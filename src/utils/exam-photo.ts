import { compressImage } from './image-processing';

export interface ExamPreset {
    label: string;
    max_kb: number;
    min_kb: number;
    width: number;
    height: number;
    min_dpi: number;
    sig_max_kb: number;
    sig_min_kb: number;
    sig_width: number;
    sig_height: number;
}

export const EXAM_PRESETS: Record<string, ExamPreset> = {
    ssc_cgl: {
        label: "SSC CGL", max_kb: 100, min_kb: 4,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    ssc_chsl: {
        label: "SSC CHSL", max_kb: 100, min_kb: 4,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    ssc_mts: {
        label: "SSC MTS", max_kb: 100, min_kb: 4,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    ssc_gd: {
        label: "SSC GD", max_kb: 200, min_kb: 4,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 30, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    upsc: {
        label: "UPSC", max_kb: 300, min_kb: 20,
        width: 110, height: 140, min_dpi: 72,
        sig_max_kb: 150, sig_min_kb: 5, sig_width: 150, sig_height: 70,
    },
    rrb_ntpc: {
        label: "RRB NTPC", max_kb: 50, min_kb: 2,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    rrb_group_d: {
        label: "RRB Group D", max_kb: 50, min_kb: 2,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 200, sig_height: 70,
    },
    ibps: {
        label: "IBPS PO/Clerk", max_kb: 50, min_kb: 2,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 140, sig_height: 60,
    },
    sbi: {
        label: "SBI PO/Clerk", max_kb: 50, min_kb: 2,
        width: 200, height: 230, min_dpi: 72,
        sig_max_kb: 20, sig_min_kb: 1, sig_width: 140, sig_height: 60,
    },
    neet: {
        label: "NEET", max_kb: 200, min_kb: 10,
        width: 200, height: 200, min_dpi: 72,
        sig_max_kb: 50, sig_min_kb: 4, sig_width: 200, sig_height: 70,
    },
    jee: {
        label: "JEE Main", max_kb: 200, min_kb: 10,
        width: 200, height: 200, min_dpi: 72,
        sig_max_kb: 50, sig_min_kb: 4, sig_width: 200, sig_height: 70,
    },
    passport: {
        label: "Passport", max_kb: 200, min_kb: 10,
        width: 413, height: 531, min_dpi: 200,
        sig_max_kb: 50, sig_min_kb: 5, sig_width: 200, sig_height: 70,
    },
    pan_card: {
        label: "PAN Card", max_kb: 200, min_kb: 2,
        width: 200, height: 200, min_dpi: 72,
        sig_max_kb: 30, sig_min_kb: 1, sig_width: 140, sig_height: 60,
    },
};

export interface ValidationCheck {
    name: string;
    expected: string;
    actual: string;
    pass: boolean;
}

export interface ValidationResult {
    photo: {
        checks: ValidationCheck[];
        pass: boolean;
    };
    signature?: {
        checks: ValidationCheck[];
        pass: boolean;
    };
    fixed_file?: File;
    fixed_sig_file?: File;
}

export async function validateExamPhoto(
    photoFile: File,
    presetKey: string,
    sigFile?: File
): Promise<ValidationResult> {
    const spec = EXAM_PRESETS[presetKey] || EXAM_PRESETS.ssc_cgl;
    const result: ValidationResult = {
        photo: { checks: [], pass: true },
    };

    // 1. Photo Validation
    const photoBitmap = await createImageBitmap(photoFile);
    const photoSizeKb = photoFile.size / 1024;

    // Size Check
    const sizeOk = photoSizeKb >= spec.min_kb && photoSizeKb <= spec.max_kb;
    result.photo.checks.push({
        name: "File Size",
        expected: `${spec.min_kb}–${spec.max_kb} KB`,
        actual: `${photoSizeKb.toFixed(1)} KB`,
        pass: sizeOk,
    });
    if (!sizeOk) result.photo.pass = false;

    // Dimensions Check
    const dimsOk = photoBitmap.width === spec.width && photoBitmap.height === spec.height;
    result.photo.checks.push({
        name: "Dimensions",
        expected: `${spec.width}×${spec.height} px`,
        actual: `${photoBitmap.width}×${photoBitmap.height} px`,
        pass: dimsOk,
    });
    if (!dimsOk) result.photo.pass = false;

    // Format Check
    const fmt = photoFile.type === "image/jpeg" ? "JPEG" : photoFile.type.split("/")[1].toUpperCase();
    const fmtOk = fmt === "JPEG" || fmt === "JPG";
    result.photo.checks.push({
        name: "Format",
        expected: "JPEG / JPG",
        actual: fmt,
        pass: fmtOk,
    });
    if (!fmtOk) result.photo.pass = false;

    // Background Check (Corners)
    const canvas = document.createElement("canvas");
    canvas.width = photoBitmap.width;
    canvas.height = photoBitmap.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
        ctx.drawImage(photoBitmap, 0, 0);
        const corners = [
            { x: 5, y: 5 },
            { x: photoBitmap.width - 5, y: 5 },
            { x: 5, y: photoBitmap.height - 5 },
            { x: photoBitmap.width - 5, y: photoBitmap.height - 5 },
        ];
        let whiteCorners = 0;
        const threshold = 220;

        corners.forEach(p => {
            // Clamp coordinates
            const x = Math.max(0, Math.min(p.x, photoBitmap.width - 1));
            const y = Math.max(0, Math.min(p.y, photoBitmap.height - 1));
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            // pixel is [r, g, b, a]
            if (pixel[0] > threshold && pixel[1] > threshold && pixel[2] > threshold) {
                whiteCorners++;
            }
        });

        const bgOk = whiteCorners >= 3;
        result.photo.checks.push({
            name: "Background",
            expected: "White / Light",
            actual: bgOk ? "White/Light" : "Dark/Colored",
            pass: bgOk,
        });
        if (!bgOk) result.photo.pass = false;
    }

    // 2. Signature Validation
    if (sigFile) {
        result.signature = { checks: [], pass: true };
        const sigBitmap = await createImageBitmap(sigFile);
        const sigSizeKb = sigFile.size / 1024;

        const sigSizeOk = sigSizeKb >= spec.sig_min_kb && sigSizeKb <= spec.sig_max_kb;
        result.signature.checks.push({
            name: "File Size",
            expected: `${spec.sig_min_kb}–${spec.sig_max_kb} KB`,
            actual: `${sigSizeKb.toFixed(1)} KB`,
            pass: sigSizeOk,
        });
        if (!sigSizeOk) result.signature.pass = false;

        const sigDimsOk = sigBitmap.width === spec.sig_width && sigBitmap.height === spec.sig_height;
        result.signature.checks.push({
            name: "Dimensions",
            expected: `${spec.sig_width}×${spec.sig_height} px`,
            actual: `${sigBitmap.width}×${sigBitmap.height} px`,
            pass: sigDimsOk,
        });
        if (!sigDimsOk) result.signature.pass = false;
    }

    // 3. Auto-Fix (if needed or requested)
    // We'll just always generate the fixed version if it fails?
    // Or provide helper to fix.
    // The 'fixed_file' in result implies we return it.

    // Fix Photo
    const fixedPhotoCanvas = document.createElement("canvas");
    fixedPhotoCanvas.width = spec.width;
    fixedPhotoCanvas.height = spec.height;
    const fCtx = fixedPhotoCanvas.getContext("2d");
    if (fCtx) {
        // Fill white first (for transparency)
        fCtx.fillStyle = "#FFFFFF";
        fCtx.fillRect(0, 0, spec.width, spec.height);

        // Scale and center (cover)
        const ratio = Math.max(spec.width / photoBitmap.width, spec.height / photoBitmap.height);
        const w = photoBitmap.width * ratio;
        const h = photoBitmap.height * ratio;
        const x = (spec.width - w) / 2;
        const y = (spec.height - h) / 2;

        fCtx.drawImage(photoBitmap, x, y, w, h);

        const blob = await new Promise<Blob | null>(resolve =>
            fixedPhotoCanvas.toBlob(resolve, "image/jpeg", 0.95)
        );

        if (blob) {
            let fFile = new File([blob], "fixed_photo.jpg", { type: "image/jpeg" });
            // Compress if too big
            if (fFile.size > spec.max_kb * 1024) {
                fFile = await compressImage(fFile, spec.max_kb / 1024);
            }
            result.fixed_file = fFile;
        }
    }

    // Fix Signature
    if (sigFile && result.signature) {
        const sigBitmap = await createImageBitmap(sigFile);
        const fixedSigCanvas = document.createElement("canvas");
        fixedSigCanvas.width = spec.sig_width;
        fixedSigCanvas.height = spec.sig_height;
        const sCtx = fixedSigCanvas.getContext("2d");
        if (sCtx) {
            // Fill white
            sCtx.fillStyle = "#FFFFFF";
            sCtx.fillRect(0, 0, spec.sig_width, spec.sig_height);

            // Scale and center (contain/fit) - Signatures should be fully visible
            const ratio = Math.min(spec.sig_width / sigBitmap.width, spec.sig_height / sigBitmap.height);
            const w = sigBitmap.width * ratio;
            const h = sigBitmap.height * ratio;
            const x = (spec.sig_width - w) / 2;
            const y = (spec.sig_height - h) / 2;

            sCtx.drawImage(sigBitmap, x, y, w, h);

            const blob = await new Promise<Blob | null>(resolve =>
                fixedSigCanvas.toBlob(resolve, "image/jpeg", 0.95)
            );

            if (blob) {
                let sFile = new File([blob], "fixed_signature.jpg", { type: "image/jpeg" });
                if (sFile.size > spec.sig_max_kb * 1024) {
                    sFile = await compressImage(sFile, spec.sig_max_kb / 1024);
                }
                result.fixed_sig_file = sFile;
            }
        }
    }

    return result;
}

export async function addNameDateToPhoto(
    photoFile: File,
    name: string,
    dateText: string
): Promise<File> {
    const img = await createImageBitmap(photoFile);

    // Strip height = 12% of image height, min 30px
    const stripHeight = Math.max(30, Math.floor(img.height * 0.12));
    const newHeight = img.height + stripHeight;

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas init failed");

    // Draw white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Main Image
    ctx.drawImage(img, 0, 0);

    // Draw Text
    const fontSize = Math.max(10, Math.floor(stripHeight * 0.5));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";

    // Name on left
    const textY = img.height + stripHeight / 2;
    ctx.textAlign = "left";
    ctx.fillText(name, 8, textY);

    // Date on right
    if (dateText) {
        ctx.textAlign = "right";
        ctx.fillText(dateText, canvas.width - 8, textY);
    }

    const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
    );

    if (!blob) throw new Error("Encoding failed");
    return new File([blob], "photo_with_name.jpg", { type: "image/jpeg" });
}

export async function joinPhotoSignature(
    photoFile: File,
    sigFile: File,
    gap: number = 10
): Promise<File> {
    const photo = await createImageBitmap(photoFile);
    const sig = await createImageBitmap(sigFile);

    // Resize signature to match photo width
    const sigRatio = photo.width / sig.width;
    const newSigHeight = Math.round(sig.height * sigRatio);
    const totalHeight = photo.height + gap + newSigHeight;

    const canvas = document.createElement("canvas");
    canvas.width = photo.width;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas key failed");

    // White bg
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Photo
    ctx.drawImage(photo, 0, 0);

    // Draw Signature
    // Draw it scaled
    ctx.drawImage(sig, 0, photo.height + gap, photo.width, newSigHeight);

    const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.95)
    );

    if (!blob) throw new Error("Encoding failed");
    return new File([blob], "photo_joined.jpg", { type: "image/jpeg" });
}
