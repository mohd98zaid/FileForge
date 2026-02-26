// import imageCompression from 'browser-image-compression'; // Moved to dynamic import
// import heic2any from 'heic2any'; // Moved to dynamic import
// import { jsPDF } from 'jspdf'; // Moved to dynamic import

export async function resizeImage(
    file: File,
    width?: number,
    height?: number,
    maintainAspect: boolean = true
): Promise<File> {
    const img = await createImageBitmap(file);
    let newWidth = width || img.width;
    let newHeight = height || img.height;

    if (maintainAspect) {
        if (width && !height) {
            newHeight = Math.round((img.height / img.width) * width);
        } else if (height && !width) {
            newWidth = Math.round((img.width / img.height) * height);
        }
    }

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Failed to get canvas context for resizing.');
    }

    // Draw white background for transparent images converting to JPEG, though format is unchanged initially
    if (file.type === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, newWidth, newHeight);
    }

    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    let blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, file.type, 0.92));

    if (!blob) {
        const outputType = 'image/jpeg';
        blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, outputType, 0.92));
        if (!blob) throw new Error('Failed to encode resized image.');
        const newName = file.name.replace(/\.[^/.]+$/, '.jpg');
        return new File([blob], newName, { type: outputType });
    }

    return new File([blob], file.name, { type: file.type });
}

/**
 * Compress an image using browser-image-compression.
 */
export async function compressImage(
    file: File,
    maxSizeMB: number = 1,
    initialQuality?: number,
    maxWidthOrHeight: number = 1920
): Promise<File> {
    // Dynamic import to avoid SSR/Prerender issues with browser-image-compression
    const imageCompression = (await import('browser-image-compression')).default;

    const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: false,
        initialQuality,
    };
    return imageCompression(file, options);
}

/**
 * Convert an image format.
 * Supports HEIC to JPG conversion.
 */
export async function convertImage(
    file: File,
    targetFormat: string
): Promise<File> {
    // Handle PDF
    if (targetFormat === 'application/pdf') {
        return imagesToPdf([file]);
    }

    // Handle HEIC
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
            blob: file,
            toType: targetFormat,
        });
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        return new File([blob], file.name.replace(/\.heic$/i, `.${targetFormat.split('/')[1]}`), {
            type: targetFormat,
        });
    }

    // Handle other formats using Canvas
    const img = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Draw white background for transparent images converting to JPEG
    if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const ext = targetFormat.split('/')[1];
                    const newName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
                    resolve(new File([blob], newName, { type: targetFormat }));
                }
            },
            targetFormat,
            0.9
        );
    });
}

/**
 * Convert images to a single PDF.
 */
export async function imagesToPdf(files: File[]): Promise<File> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const img = await createImageBitmap(file);

        // Calculate aspect ratio to fit A4 (210x297mm)
        // jsPDF uses mm by default.
        // We'll just fit the image to the page.

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;

        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) doc.addPage();
        doc.addImage(dataUrl, 'JPEG', x, y, w, h);
    }

    const pdfBlob = doc.output('blob');
    return new File([pdfBlob], 'converted.pdf', { type: 'application/pdf' });
}
