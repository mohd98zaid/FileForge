"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "How does the comparison work?", questionHi: "तुलना कैसे काम करती है?", answer: "It compares the two images pixel by pixel. Areas that are identical appear dark, while differences are highlighted in bright colors.", answerHi: "यह पिक्सेल दर पिक्सेल दोनों छवियों की तुलना करता है। जो क्षेत्र समान हैं वे गहरे दिखाई देते हैं, जबकि अंतर चमकीले रंगों में हाइलाइट किए जाते हैं।" },
    { question: "Do the images need to be the same size?", questionHi: "क्या छवियों का आकार समान होना चाहिए?", answer: "For best results, yes. If they are different sizes, they will be stretched to match the dimensions of the first image.", answerHi: "सर्वोत्तम परिणामों के लिए, हाँ। यदि वे अलग-अलग आकार के हैं, तो उन्हें पहली छवि के आयामों से मेल खाने के लिए खींचा जाएगा।" },
];

export default function ImageDiffPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    
    const [img1, setImg1] = useState<HTMLImageElement | null>(null);
    const [img2, setImg2] = useState<HTMLImageElement | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [diffCount, setDiffCount] = useState<number | null>(null);
    const [threshold, setThreshold] = useState(10); // 0-255 difference threshold

    useEffect(() => {
        if (!file1) { setImg1(null); return; }
        const i1 = new Image();
        i1.onload = () => setImg1(i1);
        i1.src = URL.createObjectURL(file1);
    }, [file1]);

    useEffect(() => {
        if (!file2) { setImg2(null); return; }
        const i2 = new Image();
        i2.onload = () => setImg2(i2);
        i2.src = URL.createObjectURL(file2);
    }, [file2]);

    useEffect(() => {
        if (!img1 || !img2 || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Use dimensions of first image
        const width = img1.width;
        const height = img1.height;
        
        canvas.width = width;
        canvas.height = height;

        // Draw img1 and get data
        ctx.drawImage(img1, 0, 0, width, height);
        const data1 = ctx.getImageData(0, 0, width, height).data;

        // Draw img2 and get data
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img2, 0, 0, width, height);
        const data2 = ctx.getImageData(0, 0, width, height).data;

        // Prepare diff data
        const diffImageData = ctx.createImageData(width, height);
        const diffData = diffImageData.data;

        let diffs = 0;

        for (let i = 0; i < data1.length; i += 4) {
            const r1 = data1[i], g1 = data1[i+1], b1 = data1[i+2], a1 = data1[i+3];
            const r2 = data2[i], g2 = data2[i+1], b2 = data2[i+2], a2 = data2[i+3];

            // Calculate Euclidean distance or simple abs diff
            const diffR = Math.abs(r1 - r2);
            const diffG = Math.abs(g1 - g2);
            const diffB = Math.abs(b1 - b2);
            const maxDiff = Math.max(diffR, diffG, diffB);

            if (maxDiff > threshold) {
                // Highlight difference (Hot Pink/Red)
                diffData[i] = 255;     // R
                diffData[i+1] = 0;     // G
                diffData[i+2] = 128;   // B
                diffData[i+3] = 255;   // A
                diffs++;
            } else {
                // Dim background (Grayscale/Dark)
                const luma = r1 * 0.299 + g1 * 0.587 + b1 * 0.114;
                diffData[i] = luma * 0.3;
                diffData[i+1] = luma * 0.3;
                diffData[i+2] = luma * 0.3 + 20; // Slight blue tint
                diffData[i+3] = 255;
            }
        }

        ctx.putImageData(diffImageData, 0, 0);
        setDiffCount(diffs);

    }, [img1, img2, threshold]);

    const downloadDiff = () => {
        if (!canvasRef.current) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `diff_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🔍 छवि तुलना (Diff)" : "🔍 Image Diff Checker"}
            description={isHi ? "दो छवियों की तुलना करें और उनके बीच के अंतर को हाइलाइट करें" : "Overlay two images and instantly highlight pixel-perfect differences"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-400">{isHi ? "छवि 1" : "Image 1 (Base)"}</h3>
                        {!file1 ? (
                            <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={(f) => setFile1(f[0])} compact />
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center p-2 h-[200px]">
                                <img src={URL.createObjectURL(file1)} className="max-h-full max-w-full object-contain" alt="1" />
                                <button onClick={() => setFile1(null)} className="absolute top-2 right-2 bg-slate-900/80 text-red-400 p-1 px-3 rounded text-xs hover:bg-red-500 hover:text-white transition-colors">✕</button>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-400">{isHi ? "छवि 2" : "Image 2 (Compare)"}</h3>
                        {!file2 ? (
                            <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={(f) => setFile2(f[0])} compact />
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center p-2 h-[200px]">
                                <img src={URL.createObjectURL(file2)} className="max-h-full max-w-full object-contain" alt="2" />
                                <button onClick={() => setFile2(null)} className="absolute top-2 right-2 bg-slate-900/80 text-red-400 p-1 px-3 rounded text-xs hover:bg-red-500 hover:text-white transition-colors">✕</button>
                            </div>
                        )}
                    </div>
                </div>

                {img1 && img2 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 w-full">
                                <label className="flex justify-between text-sm text-slate-400 mb-2">
                                    <span>{isHi ? "संवेदनशीलता (थ्रेशोल्ड)" : "Sensitivity Threshold"}</span>
                                    <span className="text-slate-200">{threshold} / 255</span>
                                </label>
                                <input type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="w-full accent-indigo-500" />
                            </div>
                            <div className="text-center md:text-right px-4">
                                <div className="text-2xl font-bold text-pink-500">{diffCount?.toLocaleString() || 0}</div>
                                <div className="text-xs text-slate-400">{isHi ? "पिक्सेल अंतर" : "Different Pixels"}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 overflow-hidden flex justify-center">
                                <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-2xl rounded" style={{ maxHeight: "60vh" }}></canvas>
                            </div>
                            <DownloadButton onClick={downloadDiff} label={isHi ? "तुलना छवि डाउनलोड करें" : "Download Diff Image"} />
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
