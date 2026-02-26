"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { removeBackground } from "@imgly/background-removal";

const faqs = [
    { question: "How does it work?", questionHi: "यह कैसे काम करता है?", answer: "An AI model detects the foreground and removes the background automatically.", answerHi: "AI मॉडल से इमेज का बैकग्राउंड पहचान कर ऑटोमैटिक हटा दिया जाता है।" },
    { question: "Is it accurate?", questionHi: "क्या यह सटीक है?", answer: "Works great on most photos, especially people and products.", answerHi: "ज़्यादातर फ़ोटो पर बहुत अच्छा काम करता है, ख़ासकर लोगों और प्रोडक्ट्स पर।" },
];

/**
 * Parses a hex color string like "#ff00aa" into { r, g, b } (0-255).
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleaned = hex.replace("#", "");
    return {
        r: parseInt(cleaned.substring(0, 2), 16),
        g: parseInt(cleaned.substring(2, 4), 16),
        b: parseInt(cleaned.substring(4, 6), 16),
    };
}

/**
 * Takes a transparent-background blob (PNG) and composites it on a solid
 * color, returning a new Blob.
 */
async function applyBackgroundColor(blob: Blob, bgColor: string): Promise<Blob> {
    const img = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context failed");

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Failed to export canvas"));
        }, "image/png");
    });
}

export default function RemoveBgPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [bgOption, setBgOption] = useState<"transparent" | "white" | "custom">("transparent");
    const [customColor, setCustomColor] = useState("#ffffff");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(5);
        setProcessing(true);
        try {
            // Client-side background removal using @imgly/background-removal
            const noBgBlob = await removeBackground(files[0], {
                progress: (_key: string, current: number, total: number) => {
                    if (total > 0) {
                        setProgress(Math.min(90, Math.round((current / total) * 90)));
                    }
                },
            });

            let finalBlob: Blob = noBgBlob;

            // Apply background color if needed
            if (bgOption === "white") {
                finalBlob = await applyBackgroundColor(noBgBlob, "#ffffff");
            } else if (bgOption === "custom") {
                finalBlob = await applyBackgroundColor(noBgBlob, customColor);
            }

            setResultBlob(finalBlob);
            setProgress(100);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Background removal failed.";
            setError(msg);
            setProgress(0);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎭 बैकग्राउंड हटाएँ" : "🖼️ Remove Background"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "इमेज का बैकग्राउंड ऑटोमैटिक हटाएँ" : "AI-powered background removal — runs 100% in your browser"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={(f) => { setFiles(f); setResultBlob(null); }} accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} hint={isHi ? "JPG, PNG, WebP" : "JPG, PNG, WebP"} />

                {files.length > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                        <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "बैकग्राउंड विकल्प" : "Background Option"}</label>
                    <div className="flex gap-3 flex-wrap">
                        <button onClick={() => setBgOption("transparent")} className={bgOption === "transparent" ? "btn-primary" : "btn-secondary"}>{isHi ? "पारदर्शी (Transparent)" : "Transparent"}</button>
                        <button onClick={() => setBgOption("white")} className={bgOption === "white" ? "btn-primary" : "btn-secondary"}>{isHi ? "सफ़ेद (White)" : "White"}</button>
                        <button onClick={() => setBgOption("custom")} className={bgOption === "custom" ? "btn-primary" : "btn-secondary"}>{isHi ? "कस्टम रंग (Custom Color)" : "Custom Color"}</button>
                    </div>
                </div>

                {bgOption === "custom" && (
                    <div className="flex items-center gap-3">
                        <label className="text-sm text-slate-400">{isHi ? "रंग:" : "Color:"}</label>
                        <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
                        <input type="text" value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="input-field w-32" placeholder="#ffffff" />
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length || processing} className="btn-primary w-full">
                    {processing ? (isHi ? "प्रोसेस हो रहा है... (इसमें कुछ समय लग सकता है)" : "Processing… (this may take a moment)") : (isHi ? "बैकग्राउंड हटाएँ" : "Remove Background")}
                </button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है... AI मॉडल आपके ब्राउज़र में चल रहा है" : "Processing… AI model runs in your browser"} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2220%22%20height%3D%2220%22%3E%3Crect%20fill%3D%22%23333%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20fill%3D%22%23444%22%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20fill%3D%22%23444%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3Crect%20fill%3D%22%23333%22%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22/%3E%3C/svg%3E')] flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Result" className="max-w-full max-h-72 object-contain rounded" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, bgOption === "transparent" ? "no_bg.png" : "no_bg.jpg")} label={isHi ? "चित्र डाउनलोड करें" : "Download Image"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/remove-bg" tools={ALL_TOOLS} />
        </div>
    );
}
