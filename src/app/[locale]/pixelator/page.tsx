"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "How does the pixelation work?", questionHi: "पिक्सेलेशन कैसे काम करता है?", answer: "The image is shrunk down to a very small size and then stretched back up without smoothing (anti-aliasing).", answerHi: "छवि को बहुत छोटे आकार में सिकोड़ा जाता है और फिर बिना स्मूथिंग (एंटी-अलियासिंग) के वापस बढ़ाया जाता है।" },
    { question: "Can I pixelate only faces?", questionHi: "क्या मैं केवल चेहरों को पिक्सेलयुक्त कर सकता हूँ?", answer: "Currently, this applies a retro pixel art effect to the entire image. Targeted blurring is available in our other privacy tools.", answerHi: "अभी के लिए, यह पूरी छवि पर एक रेट्रो पिक्सेल कला प्रभाव लागू करता है। लक्षित ब्लरिंग हमारे अन्य गोपनीयता टूल में उपलब्ध है।" },
];

export default function PixelatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [pixelSize, setPixelSize] = useState(10); // Block size in px
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
    };

    useEffect(() => {
        if (!file) {
            setImage(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        if (!canvasRef.current || !image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        // Turn off image smoothing for blocky look
        ctx.imageSmoothingEnabled = false;

        // Calculate size of scaled down image (minimum 1px)
        const scale = 1 / Math.max(pixelSize, 1);
        const w = image.width * scale;
        const h = image.height * scale;

        // Draw small
        ctx.drawImage(image, 0, 0, w, h);
        
        // Scale it back up directly onto itself
        ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);

    }, [image, pixelSize]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `pixelated_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "👾 8-बिट पिक्सेलेटर" : "👾 8-Bit Pixelator"}
            description={isHi ? "अपनी छवियों को रेट्रो पिक्सेल कला प्रभाव दें" : "Turn your photos into retro 8-bit style pixel art"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "पिक्सेल आकार" : "Pixel Size"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">
                                    {isHi ? "नई छवि चुनें" : "New Image"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "ब्लॉक का आकार (px)" : "Block Size (px)"}</span>
                                        <span className="text-slate-200">{pixelSize}px</span>
                                    </label>
                                    <input type="range" min="2" max="100" value={pixelSize} onChange={(e) => setPixelSize(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "पिक्सेल कला डाउनलोड करें" : "Download Pixel Art"} className="w-full mt-4" />
                        </div>

                        <div className="lg:col-span-8 flex justify-center bg-slate-900 rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" style={{ maxHeight: "60vh", imageRendering: "pixelated" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
