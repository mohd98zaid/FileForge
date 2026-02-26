import GIF from "gif.js";

/**
 * createGif
 * Combines multiple image files into an animated GIF.
 */
export async function createGif(
    files: File[],
    delayMs: number = 200, // frame delay
    loopCount: number = 0 // 0 = infinite
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        if (!files.length) return reject("No files provided");

        // gif.js needs a worker script. We need to ensure it's available in public/
        // For now, we assume gif.worker.js is present or we use a blob URL if imported?
        // gif.js requires the worker file path.
        // A common pattern in Next.js/React is to copy the worker to public/
        // OR construct it from a Blob.

        // Let's try to infer if we can load it.
        // For this implementation, we will assume "gif.worker.js" is at root. 
        // We might need to copy it there.

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 500, // Default width? Or should we detect?
            height: 500,
            workerScript: "/gif.worker.js",
            repeat: loopCount === 0 ? 0 : -1 // gif.js: 0 for repeat, -1 for no-repeat? No.
            // gif.js options: repeat - repeat count, -1 = no repeat, 0 = forever
        });

        // We need to load images to get dimensions (and maybe resize to first image dims)
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        // Load all images first
        files.forEach((file, index) => {
            const img = new Image();
            img.onload = () => {
                images[index] = img;
                loadedCount++;
                if (loadedCount === files.length) {
                    processImages(gif, images, delayMs, resolve, reject);
                }
            };
            img.onerror = () => reject(`Failed to load image ${file.name}`);
            img.src = URL.createObjectURL(file);
        });
    });
}

function processImages(
    gif: any,
    images: HTMLImageElement[],
    delay: number,
    resolve: (b: Blob) => void,
    reject: (s: string) => void
) {
    if (!images.length) return reject("No images loaded");

    // Use first image dimensions as base
    const width = images[0].width;
    const height = images[0].height;

    gif.options.width = width;
    gif.options.height = height;

    // Add frames
    // We should probably resize other images to fit providing they differ
    // For now, simple draw.
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return reject("Canvas init failed");

    images.forEach(img => {
        // Clear and Draw
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        // Draw image scaled to fit? Or center?
        // Let's stretch to fit for simplicity similar to backend behavior usually,
        // or just draw. 
        ctx.drawImage(img, 0, 0, width, height);

        gif.addFrame(ctx, { copy: true, delay: delay });
    });

    gif.on("finished", (blob: Blob) => {
        resolve(blob);
    });

    gif.render();
}
