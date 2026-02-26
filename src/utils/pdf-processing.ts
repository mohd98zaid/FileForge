import JSZip from 'jszip';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Configure worker locally when needed or use dynamic import
const setupPdfJs = async () => {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        } catch (e) {
            console.warn("Failed to set pdfjs worker:", e);
        }
    }
    return pdfjsLib;
};

/**
 * Create a ZIP file from multiple files.
 */
export async function createZip(files: File[]): Promise<Blob> {
    const zip = new JSZip();
    files.forEach((file) => {
        zip.file(file.name, file);
    });
    return zip.generateAsync({ type: 'blob' });
}

/**
 * Add watermark to PDF.
 */
export async function watermarkPdf(
    file: File,
    text: string,
    opacity: number = 0.5,
    colorHex: string = '#000000',
    size: number = 50
): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    pdfDoc.registerFontkit(fontkit);

    // Fetch a font that supports Devanagari characters
    const fontUrl = 'https://fonts.gstatic.com/s/notosansdevanagari/v23/jizDREyVoH129L5qonvT-yHnWW2R312W_0hLpA.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());

    // Fallback to StandardFonts.HelveticaBold if the fetch fails
    let font;
    try {
        font = await pdfDoc.embedFont(fontBytes);
    } catch (e) {
        console.warn("Could not load Hindi font, falling back to Helvetica", e);
        font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }

    // Convert hex to rgb
    const r = parseInt(colorHex.slice(1, 3), 16) / 255;
    const g = parseInt(colorHex.slice(3, 5), 16) / 255;
    const b = parseInt(colorHex.slice(5, 7), 16) / 255;

    pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(text, {
            x: width / 2 - (text.length * size) / 4, // Rough centering
            y: height / 2,
            size,
            font,
            color: rgb(r, g, b),
            opacity,
            rotate: degrees(45),
        });
    });

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'watermarked.pdf', { type: 'application/pdf' });
}

/**
 * Get PDF page count.
 */
export async function getPdfPageCount(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    return pdf.getPageCount();
}

/**
 * Merge multiple PDFs into one.
 */
export async function mergePdfs(files: File[]): Promise<File> {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const savedBytes = await mergedPdf.save();
    return new File([savedBytes as BlobPart], 'merged.pdf', { type: 'application/pdf' });
}

/**
 * Split a PDF.
 * Returns a ZIP file containing split pages? Or specific pages?
 */
export async function splitPdf(file: File, rangeStr: string): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    const totalPages = pdfDoc.getPageCount();
    const indicesToKeep = parsePageRange(rangeStr, totalPages);

    if (indicesToKeep.length === 0) throw new Error("No pages selected");

    const copiedPages = await newPdf.copyPages(pdfDoc, indicesToKeep);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const savedBytes = await newPdf.save();
    return new File([savedBytes as BlobPart], 'split.pdf', { type: 'application/pdf' });
}

/**
 * Rotate PDF pages.
 * rotation: degrees (90, 180, 270)
 */
export async function rotatePdf(file: File, rotation: number): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
    });

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'rotated.pdf', { type: 'application/pdf' });
}

/**
 * Add Page Numbers.
 */
export async function addPageNumbers(
    file: File,
    position: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right' = 'bottom-center'
): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const fontSize = 12;
        const text = `${idx + 1}`;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = 0;
        let y = 30; // default bottom margin

        switch (position) {
            case 'bottom-center':
                x = (width - textWidth) / 2;
                y = 30;
                break;
            case 'bottom-right':
                x = width - textWidth - 30;
                y = 30;
                break;
            case 'top-center':
                x = (width - textWidth) / 2;
                y = height - 30;
                break;
            case 'top-right':
                x = width - textWidth - 30;
                y = height - 30;
                break;
        }

        page.drawText(text, {
            x,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });
    });

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'numbered.pdf', { type: 'application/pdf' });
}

/**
 * Helper: Parse page range string (e.g "1-3, 5").
 * Returns 0-based indices.
 */
function parsePageRange(rangeStr: string, totalPages: number): number[] {
    const indices = new Set<number>();
    const parts = rangeStr.split(/,/);

    for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i >= 1 && i <= totalPages) indices.add(i - 1);
                }
            }
        } else {
            const page = Number(trimmed);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                indices.add(page - 1);
            }
        }
    }

    return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Convert PDF pages to Images.
 */
export async function pdfToImages(
    file: File,
    dpi: number = 300,
    mimeType: string = 'image/jpeg',
    quality: number = 0.9
): Promise<File[]> {
    const pdfjsLib = await setupPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const images: File[] = [];
    const totalPages = pdf.numPages;

    // Calculate scale based on DPI (72 dpi = scale 1)
    const scale = dpi / 72;

    for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
            const renderContext: any = { canvasContext: context, viewport };
            await page.render(renderContext).promise;

            const blob = await new Promise<Blob | null>(resolve =>
                canvas.toBlob(resolve, mimeType, quality)
            );

            if (blob) {
                const ext = mimeType.split('/')[1];
                images.push(new File([blob], `page_${i}.${ext}`, { type: mimeType }));
            }
        }
    }

    return images;
}

/**
 * Reorder, rotate, and delete pages.
 * @param pages Array of objects defining the new order. Each object has original pageIndex and rotation.
 */
export async function reorderPdf(
    file: File,
    pages: { pageIndex: number; rotation: number }[]
): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    // newPdf.copyPages takes an array of indices
    const indices = pages.map(p => p.pageIndex);
    const copiedPages = await newPdf.copyPages(pdfDoc, indices);

    copiedPages.forEach((page, i) => {
        const rotation = pages[i].rotation;
        if (rotation !== 0) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees(currentRotation + rotation));
        }
        newPdf.addPage(page);
    });

    const savedBytes = await newPdf.save();
    return new File([savedBytes as BlobPart], 'reordered.pdf', { type: 'application/pdf' });
}

/**
 * Encrypt PDF with a password.
 */
/**
 * Encrypt PDF with a password.
 */
export async function encryptPdf(file: File, password: string): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Standard 128-bit encryption with user password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (pdfDoc as any).encrypt({
        userPassword: password,
        ownerPassword: password, // Same for simplicity in this tool
        permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false,
        },
    });

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'protected.pdf', { type: 'application/pdf' });
}

/**
 * Decrypt PDF (Unlock).
 * This function essentially loads the PDF with the password and saves it without one.
 */
export async function decryptPdf(file: File, password: string): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();

    // Attempt to load with password
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfDoc = await PDFDocument.load(arrayBuffer, { password } as any);
        // Saving without encryption options removes the password
        const savedBytes = await pdfDoc.save();
        return new File([savedBytes as BlobPart], 'unlocked.pdf', { type: 'application/pdf' });
    } catch (error) {
        throw new Error("Incorrect password or failed to unlock.");
    }
}

/**
 * Remove PDF Metadata.
 */
export async function removePdfMetadata(file: File): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'clean.pdf', { type: 'application/pdf' });
}

/**
 * Get PDF Metadata.
 */
export async function getPdfMetadata(file: File): Promise<Record<string, string>> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    return {
        title: pdfDoc.getTitle() || '',
        author: pdfDoc.getAuthor() || '',
        subject: pdfDoc.getSubject() || '',
        creator: pdfDoc.getCreator() || '',
        producer: pdfDoc.getProducer() || '',
        creationDate: pdfDoc.getCreationDate()?.toISOString() || '',
        modificationDate: pdfDoc.getModificationDate()?.toISOString() || '',
        pageCount: String(pdfDoc.getPageCount()),
    };
}

/**
 * eSign PDF.
 * Overlays a signature image onto a PDF page.
 */
export async function esignPdf(
    pdfFile: File,
    signatureFile: File | Blob,
    x: number,
    y: number,
    width: number,
    height: number,
    pageNumber: number = 1,
    rotation: number = 0
): Promise<File> {
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    // Embed signature image
    let sigImage;
    const sigArrayBuffer = await signatureFile.arrayBuffer();

    try {
        sigImage = await pdfDoc.embedPng(sigArrayBuffer);
    } catch (e) {
        try {
            sigImage = await pdfDoc.embedJpg(sigArrayBuffer);
        } catch (e2) {
            throw new Error("Signature must be PNG or JPG.");
        }
    }

    const pages = pdfDoc.getPages();
    const pageIndex = Math.max(0, Math.min(pageNumber - 1, pages.length - 1));
    const page = pages[pageIndex];
    const { height: pageHeight } = page.getSize();

    // Coordinate conversion (Frontend Top-Left -> PDF Bottom-Left)
    const pdfLibY = pageHeight - y - height;

    page.drawImage(sigImage, {
        x,
        y: pdfLibY,
        width,
        height,
        rotate: degrees(-rotation),
    });

    const savedBytes = await pdfDoc.save();
    return new File([savedBytes as BlobPart], 'signed.pdf', { type: 'application/pdf' });
}

/**
 * Compress PDF by converting pages to images (Rasterization).
 * This is a client-side workaround as effective vector compression is hard in JS.
 * Side effect: Text becomes non-selectable.
 */
export async function compressPdf(file: File, level: string = 'medium', targetSizeKB?: number, force: boolean = false): Promise<File> {
    const qualityMap: Record<string, number> = {
        'low': 0.8,     // High quality (standard)
        'medium': 0.7,  // Balanced (good for most uses)
        'high': 0.5,    // Strong compression (email size)
        'maximum': 0.3  // Maximum compression (lowest quality)
    };
    const scaleMap: Record<string, number> = {
        'low': 2,       // 144 DPI
        'medium': 1.5,  // 108 DPI
        'high': 1,      // 72 DPI
        'maximum': 0.6  // ~43 DPI
    };

    let quality = qualityMap[level] || 0.6;
    let scale = scaleMap[level] || 1.5;

    // Initial Heuristic Adjustment
    if (targetSizeKB && targetSizeKB > 0) {
        const currentSizeKB = file.size / 1024;
        const ratio = targetSizeKB / currentSizeKB;

        if (ratio < 1) {
            if (ratio > 0.8) {
                quality = 0.8;
                scale = 1.5;
            } else if (ratio > 0.5) {
                quality = 0.6;
                scale = 1.2;
            } else if (ratio > 0.3) {
                quality = 0.4;
                scale = 1.0;
            } else {
                quality = 0.25;
                scale = 0.8;
            }
        }
    }

    let attempt = 0;
    const maxAttempts = force ? 3 : 1;
    let resultFile: File | null = null;

    while (attempt < maxAttempts) {
        attempt++;

        // Convert PDF to images
        const images = await pdfToImages(file, scale * 72, 'image/jpeg', quality);

        // Create new PDF from images
        const newPdf = await PDFDocument.create();

        for (const imageFile of images) {
            const imageBytes = await imageFile.arrayBuffer();
            // Note: embedJpg doesn't re-compress, it embeds the existing JPEG bytes.
            // The compression happens in pdfToImages via toBlob quality param?
            // Wait, pdfToImages uses quality? No, currently hardcoded 0.9.
            // We need to pass quality to pdfToImages!
            const image = await newPdf.embedJpg(imageBytes);
            const page = newPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height,
            });
        }

        const savedBytes = await newPdf.save();
        resultFile = new File([savedBytes as BlobPart], 'compressed.pdf', { type: 'application/pdf' });

        if (!force || !targetSizeKB || (resultFile.size / 1024) <= targetSizeKB) {
            break;
        }

        // If here, size is too big and force is ON. Reduce quality/scale for next attempt.
        quality = Math.max(0.1, quality - 0.15);
        scale = Math.max(0.5, scale - 0.2);
    }

    return resultFile!;
}
