// import { removeBackground } from "@imgly/background-removal";

export interface PassportSpec {
    label: string;
    value: string;
    w_mm: number;
    h_mm: number;
    width: number;  // px at 300 DPI
    height: number; // px at 300 DPI
    dpi: number;
}

export const PASSPORT_SPECS: Record<string, PassportSpec> = {
    india: {
        label: "India", value: "india",
        w_mm: 35, h_mm: 45,
        width: 413, height: 531, dpi: 300
    },
    us: {
        label: "USA", value: "us",
        w_mm: 51, h_mm: 51,
        width: 600, height: 600, dpi: 300
    },
    uk: {
        label: "UK", value: "uk",
        w_mm: 35, h_mm: 45,
        width: 413, height: 531, dpi: 300
    },
    eu: {
        label: "Schengen (EU)", value: "eu",
        w_mm: 35, h_mm: 45,
        width: 413, height: 531, dpi: 300
    },
};

export async function generatePassportPhoto(
    file: File,
    countryCode: string
): Promise<File> {
    const spec = PASSPORT_SPECS[countryCode] || PASSPORT_SPECS.india;

    // 1. Remove Background
    // @imgly/background-removal returns a Blob (PNG with transparent bg)
    // DISABLED TEMPORARILY DUE TO BUILD ERRORS
    /*
    const noBgBlob = await removeBackground(file, {
        progress: (key, current, total) => {
            // console.log(`Downloading ${key}: ${current} of ${total}`);
        }
    });
    */
    // Fallback: use original file for now
    const noBgBlob = file;

    const img = await createImageBitmap(noBgBlob);

    // 2. Create Canvas with White Background
    const canvas = document.createElement("canvas");
    canvas.width = spec.width;
    canvas.height = spec.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context failed");

    // Fill White
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Draw Image Centered and Scaled
    // Face sizing logic is complex to do perfectly without face detection coordinates.
    // We will assume the input image is reasonably framed and just 'cover' or 'contain' it?
    // Passport photos usually require the head to be a certain size.
    // The 'removeBackground' result is just the foreground.

    // Strategy: 
    // - Scale image so its height is about 70-80% of canvas height?
    // - Center it horizontally.
    // - Align bottom? Or center vertically?
    // usually passport photos are bust shots. Center vertically usually works if cropped well.
    // If we assume the user uploaded a photo with some headroom, we should try to fit it.

    /* 
       Better approach for generic 'cover' if we don't know face pos:
       - Maintain aspect ratio.
       - Scale to cover the canvas (so no whitespace at edges except top/bottom if mismatch).
       - Actually passport specs require specific head size. 
       - Without face detection lib, we can't guarantee head size.
       - We'll implement a "best guess" fit:
         Scale to fit width or height such that it covers the canvas (zoom).
         Center it.
    */

    const ratio = Math.max(spec.width / img.width, spec.height / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    const x = (spec.width - w) / 2;
    // Position slightly lower than center? Or exact center?
    // Usually exact center is safe.
    const y = (spec.height - h) / 2;

    ctx.drawImage(img, x, y, w, h);

    // 4. Convert to JPEG
    const resultBlob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
    );

    if (!resultBlob) throw new Error("Encoding failed");

    return new File([resultBlob], `passport_photo_${spec.value}.jpg`, { type: "image/jpeg" });
}
