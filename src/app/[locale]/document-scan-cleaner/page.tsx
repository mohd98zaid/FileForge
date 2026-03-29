"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

export default function DocumentScanCleanerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    // Filters
    const [threshold, setThreshold] = useState(150); // B&W cutoff
    const [contrast, setContrast] = useState(120); // 100 is normal
    const [brightness, setBrightness] = useState(110);
    const [isBW, setIsBW] = useState(true);
    
    const [isProcessing, setIsProcessing] = useState(false);
    
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
        
        setIsProcessing(true);
        
        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (!ctx) return;

            canvas.width = image.width;
            canvas.height = image.height;
            
            // First pass: contrast & brightness via context filter (very fast)
            ctx.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
            ctx.drawImage(image, 0, 0);
            ctx.filter = 'none';

            // Second pass: Grayscale / Thresholding
            if (isBW) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];

                    // Grayscale Luma
                    const luma = r * 0.299 + g * 0.587 + b * 0.114;
                    
                    // Thresholding (make it pure black or pure white like a copy machine)
                    const val = luma > threshold ? 255 : 0;

                    data[i] = val;
                    data[i+1] = val;
                    data[i+2] = val;
                }
                ctx.putImageData(imgData, 0, 0);
            }
            
            setIsProcessing(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [image, threshold, contrast, brightness, isBW]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cleaned_scan_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
            
            // Wait, we should probably just download as image, but document scan usually implies PDF. 
            // We use JPG directly for simplicity here, as PDF would require pdf-lib embedding.
            a.download = `scanned_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/jpeg", 0.9);
    };

    return (
        <ToolLayout
            title={isHi ? "📄 दस्तावेज़ स्कैन क्लीनर" : "📄 Document Scan Cleaner"}
            description={isHi ? "कागज़ की तस्वीरों को स्वच्छ, पढ़ने में आसान काले और सफेद स्कैन में बदलें" : "Turn photos of paper into clean, high-contrast black and white document scans"}
            faqs={[{question: "What does this do?", questionHi: "यह क्या करता है?", answer: "It removes shadows, uneven lighting, and cell phone camera artifacts by forcing pixels to be either pure black text or pure white paper (thresholding).", answerHi: "यह पिक्सेल को शुद्ध काले पाठ या शुद्ध सफेद कागज (थ्रेशोल्डिंग) होने के लिए मजबूर करके छाया, असमान प्रकाश और सेल फोन कैमरा कलाकृतियों को हटा देता है।"}]}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "दस्तावेज की तस्वीर यहाँ छोड़ें" : "Drop Document Photo Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "स्कैन सेटिंग्स" : "Scan Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">Back</button>
                            </div>

                            <div className="space-y-4">
                                
                                <label className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-500 transition-colors">
                                    <input type="checkbox" checked={isBW} onChange={(e) => setIsBW(e.target.checked)} className="w-4 h-4 rounded text-indigo-500 bg-slate-900 border-slate-600" />
                                    <span className="text-sm font-medium text-slate-200">{isHi ? "कठोर B&W (फोटोकॉपी प्रभाव)" : "Harsh B&W (Photocopy Effect)"}</span>
                                </label>

                                {isBW && (
                                    <div className="pl-2 border-l-2 border-slate-700 space-y-1">
                                        <label className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>{isHi ? "काले/सफ़ेद की सीमा" : "B&W Threshold"}</span>
                                        </label>
                                        <input type="range" min="50" max="220" value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                    </div>
                                )}

                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "कंट्रास्ट" : "Contrast"}</span>
                                        <span className="text-slate-200">{contrast}%</span>
                                    </label>
                                    <input type="range" min="50" max="250" value={contrast} onChange={(e) => setContrast(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                                
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "चमक (Brightness)" : "Brightness"}</span>
                                        <span className="text-slate-200">{brightness}%</span>
                                    </label>
                                    <input type="range" min="50" max="200" value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "स्कैन चित्र डाउनलोड करें (JPG)" : "Download Scan (JPG)"} className="w-full mt-4" disabled={isProcessing} />
                        </div>

                        <div className="lg:col-span-8 flex justify-center bg-slate-900 rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className={`max-w-full h-auto shadow-2xl rounded transition-opacity ${isProcessing ? 'opacity-50' : 'opacity-100'}`} style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
