"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

export default function NoiseGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [intensity, setIntensity] = useState(20);
    const [isColor, setIsColor] = useState(false);
    
    // Performance improvement for dragging slider
    const [isApplying, setIsApplying] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
    };

    useEffect(() => {
        if (!file) { setImage(null); return; }
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        if (!canvasRef.current || !image) return;
        
        setIsApplying(true);
        
        // Debounce drawing if user is dragging slider fast
        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            if (intensity > 0) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                for (let i = 0; i < data.length; i += 4) {
                    if (isColor) {
                        data[i] += (Math.random() - 0.5) * intensity * 5;     // R
                        data[i+1] += (Math.random() - 0.5) * intensity * 5;   // G
                        data[i+2] += (Math.random() - 0.5) * intensity * 5;   // B
                    } else {
                        const noise = (Math.random() - 0.5) * intensity * 5;
                        data[i] += noise;
                        data[i+1] += noise;
                        data[i+2] += noise;
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            }
            setIsApplying(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [image, intensity, isColor]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `noise_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🎞️ फिल्म ग्रेन / नॉयस जेनरेटर" : "🎞️ Film Grain / Noise Generator"}
            description={isHi ? "विंटेज या बनावट वाला लुक देने के लिए अपनी तस्वीरों में शोर जोड़ें" : "Add randomized static noise and retro film grain to your images"}
            faqs={[{question: "What is color noise vs monochrome?", questionHi: "क्या है?", answer: "Monochrome adds black/white film grain. Color noise adds random RGB pixels.", answerHi: ""}]}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "ग्रेन सेटिंग्स" : "Grain Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">Back</button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "तीव्रता (Intensity)" : "Intensity"}</span>
                                        <span className="text-slate-200">{intensity}%</span>
                                    </label>
                                    <input type="range" min="0" max="100" value={intensity} onChange={(e) => setIntensity(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                                
                                <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-500 transition-colors">
                                    <input type="checkbox" checked={isColor} onChange={(e) => setIsColor(e.target.checked)} className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-600" />
                                    <span className="text-sm text-slate-300">{isHi ? "रंगीन शोर (घटिया टीवी)" : "Color Noise (Retro TV Effect)"}</span>
                                </label>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "छवि डाउनलोड करें" : "Download Image"} className="w-full mt-4" disabled={isApplying} />
                        </div>

                        <div className="lg:col-span-8 flex justify-center bg-slate-900 rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className={`max-w-full h-auto shadow-2xl rounded transition-opacity ${isApplying ? 'opacity-50' : 'opacity-100'}`} style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
