import * as piexif from "piexifjs";

/**
 * Change the DPI of an image file (JPEG only for now).
 * Returns a new Blob with updated EXIF metadata.
 */
export async function changeDpi(file: File, dpi: number): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const headers = new Uint8Array(arrayBuffer.slice(0, 4));

    // Check for JPEG signature (FF D8 FF)
    // For PNG to have DPI change, we'd need a different approach (pHYs chunk), 
    // but piexifjs only supports JPEG.
    const isJpeg = headers[0] === 0xff && headers[1] === 0xd8 && headers[2] === 0xff;

    if (!isJpeg) {
        // Fallback: If not JPEG, we can try to convert to JPEG first using Canvas, 
        // OR just return original (with warning? or throw error?)
        // For this tool, users often want to keep format. 
        // But DPI metadata is standard mostly in JPEG/TIFF. 
        // PNG has it too but piexif doesn't support it.
        // Let's silently convert to JPEG for now as that's safe for metadata.
        return await convertToJpegAndSetDpi(file, dpi);
    }

    // Convert ArrayBuffer to binary string (required by piexifjs)
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const CHUNK = 8192;
    for (let i = 0; i < bytes.byteLength; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + CHUNK, bytes.byteLength)));
    }

    // Get existing EXIF or create new
    let exifObj;
    try {
        exifObj = piexif.load(binary);
    } catch (e) {
        exifObj = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": null };
    }

    // Update DPI in "0th" IFD
    // ResolutionUnit: 2 (inches), 3 (cm). We use 2.
    // XResolution, YResolution: Rational (numerator, denominator)
    (exifObj as any)["0th"][piexif.ImageIFD.XResolution] = [dpi, 1];
    (exifObj as any)["0th"][piexif.ImageIFD.YResolution] = [dpi, 1];
    (exifObj as any)["0th"][piexif.ImageIFD.ResolutionUnit] = 2;

    const exifBytes = piexif.dump(exifObj);
    const newBinary = piexif.insert(exifBytes, binary);

    // Convert back to Blob
    const newBytes = new Uint8Array(newBinary.length);
    for (let i = 0; i < newBinary.length; i++) {
        newBytes[i] = newBinary.charCodeAt(i);
    }

    return new Blob([newBytes], { type: "image/jpeg" });
}

async function convertToJpegAndSetDpi(file: File, dpi: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject("Canvas error");

                // Draw white background for transparency handling
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

                const exifObj: any = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": null };
                exifObj["0th"][piexif.ImageIFD.XResolution] = [dpi, 1];
                exifObj["0th"][piexif.ImageIFD.YResolution] = [dpi, 1];
                exifObj["0th"][piexif.ImageIFD.ResolutionUnit] = 2;

                const exifBytes = piexif.dump(exifObj);
                const newJpeg = piexif.insert(exifBytes, dataUrl);

                fetch(newJpeg).then(res => res.blob()).then(resolve).catch(reject);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject("Image load error");
        };
        img.src = objectUrl;
    });
}
