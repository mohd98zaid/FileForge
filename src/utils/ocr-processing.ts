import Tesseract from 'tesseract.js';

export interface OCRResult {
    text: string;
    confidence: number;
}

/**
 * Extract text from an image using Tesseract.js
 * @param file Image file
 * @param language Language code (e.g., 'eng', 'spa', 'fra')
 * @param onProgress Callback for progress (0-100)
 */
export async function extractText(
    file: File,
    language: string = 'eng',
    onProgress?: (progress: number) => void
): Promise<OCRResult> {
    const worker = await Tesseract.createWorker(language, 1, {
        logger: m => {
            if (m.status === 'recognizing text' && onProgress) {
                onProgress(Math.round(m.progress * 100));
            }
        }
    });

    const { data: { text, confidence } } = await worker.recognize(file);
    await worker.terminate();

    return { text, confidence };
}
