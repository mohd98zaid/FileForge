"use client";

import { useLocale } from "next-intl";

import { useState, useRef, useEffect, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "Can I customize the watermark?", questionHi: "क्या वॉटरमार्क कस्टमाइज़ कर सकते हैं?", answer: "Yes — text, color, size, opacity and position are all customizable.", answerHi: "हाँ, टेक्स्ट, रंग, साइज़, ट्रांसपेरेंसी और पोज़ीशन — सब बदल सकते हैं।" },
    { question: "Is my image uploaded?", questionHi: "क्या मेरी इमेज अपलोड होती है?", answer: "No, everything happens in your browser. No data goes to a server.", answerHi: "नहीं, सब कुछ ब्राउज़र में होता है। कोई डेटा सर्वर पर नहीं जाता।" },
];

export default function WatermarkImagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(30);
    const [fontSize, setFontSize] = useState(36);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!files.length) { setImgEl(null); return; }
        const img = new Image();
        img.onload = () => setImgEl(img);
        img.src = URL.createObjectURL(files[0]);
        return () => URL.revokeObjectURL(img.src);
    }, [files]);

    const drawPreview = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imgEl) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const maxW = canvas.parentElement?.clientWidth || 500;
        const scale = Math.min(1, maxW / imgEl.naturalWidth);
        canvas.width = Math.round(imgEl.naturalWidth * scale);
        canvas.height = Math.round(imgEl.naturalHeight * scale);

        ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

        // Draw watermark text diagonally across the image
        ctx.save();
        ctx.globalAlpha = opacity / 100;
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.round(fontSize * scale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
        const angle = -Math.atan2(canvas.height, canvas.width);
        const spacing = Math.round(fontSize * scale * 3.5);

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);

        for (let y = -diagonal; y < diagonal; y += spacing) {
            ctx.fillText(text, 0, y);
        }

        ctx.restore();
    }, [imgEl, text, opacity, fontSize]);

    useEffect(() => { drawPreview(); }, [drawPreview]);

    useEffect(() => {
        const container = canvasRef.current?.parentElement;
        if (!container) return;
        const ro = new ResizeObserver(() => drawPreview());
        ro.observe(container);
        return () => ro.disconnect();
    }, [drawPreview]);

    const handleProcess = async () => {
        if (!files.length || !text.trim() || !imgEl) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            // Processing on full resolution canvas
            const canvas = document.createElement('canvas');
            canvas.width = imgEl.naturalWidth;
            canvas.height = imgEl.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            ctx.drawImage(imgEl, 0, 0);

            // Draw watermark logic (replicated without scale)
            ctx.save();
            ctx.globalAlpha = opacity / 100;
            ctx.fillStyle = "#ffffff";
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
            const angle = -Math.atan2(canvas.height, canvas.width);
            const spacing = Math.round(fontSize * 3.5);

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);

            for (let y = -diagonal; y < diagonal; y += spacing) {
                ctx.fillText(text, 0, y);
            }

            ctx.restore();

            canvas.toBlob((blob) => {
                if (blob) {
                    setResultBlob(blob);
                    setProgress(100);
                } else {
                    setError(isHi ? "इमेज बनाना विफल।" : "Failed to generate image.");
                    setProgress(0);
                }
            }, 'image/jpeg', 0.9);

        } catch (e: any) {
            setError(e?.message || (isHi ? "वॉटरमार्क लगाना विफल रहा।" : "Watermark failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "💧 इमेज पर वॉटरमार्क" : "💧 Watermark Image"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "इमेज पर टेक्स्ट वॉटरमार्क लगाएँ" : "Add text watermark to your images"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={setFiles} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} hint={isHi ? "JPG, PNG, WebP" : "JPG, PNG, WebP"} />

                {/* Live watermark preview */}
                {imgEl && (
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500">{isHi ? "लाइव प्रीव्यू — रीयल-टाइम में बदलाव देखें" : "Live preview — changes update in real time"}</p>
                        <div className="w-full overflow-hidden rounded-lg border border-slate-700/50">
                            <canvas ref={canvasRef} className="w-full" />
                        </div>
                    </div>
                )}

                <div><label className="block text-sm text-slate-400 mb-1">{isHi ? "वॉटरमार्क टेक्स्ट" : "Watermark Text"}</label><input type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" /></div>
                <div><label className="block text-sm text-slate-400 mb-1">{isHi ? "पारदर्शिता:" : "Opacity:"} <span className="text-indigo-400 font-semibold">{opacity}%</span></label><input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-indigo-500" /></div>
                <div><label className="block text-sm text-slate-400 mb-1">{isHi ? "फ़ॉन्ट साइज़:" : "Font Size:"} <span className="text-indigo-400 font-semibold">{fontSize}px</span></label><input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-indigo-500" /></div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "वॉटरमार्क लगाएँ" : "Add Watermark"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {resultBlob && (
                    <div className="space-y-3">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Result" className="max-w-full max-h-72 object-contain rounded" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, "watermarked_image.jpg")} label={isHi ? "वॉटरमार्क चित्र डाउनलोड करें" : "Download Watermarked Image"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/watermark-image" tools={ALL_TOOLS} />
        </div>
    );
}
