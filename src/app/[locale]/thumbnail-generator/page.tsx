"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";
import ProgressBar from "@/components/ProgressBar";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const faqs = [
    { question: "What sizes are generated?", questionHi: "कौन से आकार उत्पन्न होते हैं?", answer: "We instantly generate 16x16, 32x32, 64x64, 128x128, 256x256, and 512x512 thumbnails.", answerHi: "हम तुरंत 16x16, 32x32, 64x64, 128x128, 256x256 और 512x512 थंबनेल उत्पन्न करते हैं।" },
    { question: "Are aspect ratios maintained?", questionHi: "क्या पहलू अनुपात बनाए रखा जाता है?", answer: "Yes, the thumbnails are cropped and centered to be perfectly square while maintaining the original image's aspect ratio.", answerHi: "हाँ, थंबनेल को काटा और केंद्रित किया जाता है ताकि मूल छवि के पहलू अनुपात को बनाए रखते हुए एकदम सही चौकोर हो सके।" },
];

const PRESET_SIZES = [16, 32, 64, 128, 256, 512];

export default function ThumbnailGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [previews, setPreviews] = useState<{size: number, blob: Blob, url: string}[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
        setPreviews([]);
    };

    const generateThumbnails = () => {
        if (!file) return;
        setIsProcessing(true);
        setProgress(10);
        
        const img = new Image();
        img.onload = async () => {
            const results: {size: number, blob: Blob, url: string}[] = [];
            
            // Reusable hidden canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            if (!ctx) {
                setIsProcessing(false);
                return;
            }

            // Determine crop box for a square aspect ratio (object-fit: cover)
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;

            for (let i = 0; i < PRESET_SIZES.length; i++) {
                const size = PRESET_SIZES[i];
                canvas.width = size;
                canvas.height = size;
                
                // Draw cropped square
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
                
                // Export
                const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, "image/png"));
                if (blob) {
                    results.push({
                        size,
                        blob,
                        url: URL.createObjectURL(blob)
                    });
                }
                setProgress(10 + Math.floor(((i + 1) / PRESET_SIZES.length) * 80));
            }
            
            setPreviews(results);
            setProgress(100);
            setTimeout(() => setIsProcessing(false), 500);
        };
        img.src = URL.createObjectURL(file);
    };

    const downloadZip = async () => {
        if (previews.length === 0 || !file) return;
        
        const zip = new JSZip();
        const folderName = `thumbnails_${file.name.replace(/\.[^/.]+$/, "")}`;
        
        previews.forEach((p) => {
            zip.file(`${p.size}x${p.size}.png`, p.blob);
        });

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${folderName}.zip`);
    };

    return (
        <ToolLayout
            title={isHi ? "🖼️ थंबनेल जेनरेटर" : "🖼️ Thumbnail Generator"}
            description={isHi ? "एक क्लिक में सभी मानक आकारों के वर्गाकार थंबनेल बनाएँ" : "Generate perfectly square thumbnails in all standard sizes instantly"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <span className="text-slate-300 font-medium truncate max-w-xs">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded">
                                {isHi ? "नया चित्र चुनें" : "Change Image"}
                            </button>
                        </div>

                        {previews.length === 0 ? (
                            <div className="flex flex-col items-center">
                                {isProcessing ? (
                                    <div className="w-full max-w-md"><ProgressBar progress={progress} label={isHi ? "जनरेट किया जा रहा है..." : "Generating thumbnails..."} /></div>
                                ) : (
                                    <button onClick={generateThumbnails} className="btn-primary w-full max-w-md">
                                        {isHi ? "थंबनेल जेनरेट करें" : "Generate Thumbnails"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex justify-center mb-4">
                                    <DownloadButton onClick={downloadZip} label={isHi ? "सभी थंबनेल (ZIP) डाउनलोड करें" : "Download All (ZIP)"} className="w-full max-w-md" />
                                </div>
                                
                                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col items-center gap-8">
                                    <h3 className="text-slate-400 text-sm">{isHi ? "तैयार थंबनेल:" : "Generated sizes:"}</h3>
                                    
                                    <div className="flex flex-wrap justify-center items-end gap-10">
                                        {previews.slice().reverse().map((p) => (
                                            <div key={p.size} className="flex flex-col items-center gap-3">
                                                <div className="rounded-md border border-slate-700 bg-slate-800 overflow-hidden shadow-lg p-1 bg-gradient-to-b from-slate-700 to-slate-800">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={p.url} width={p.size} height={p.size} alt={`${p.size}px`} className="rounded-sm" style={{ width: p.size, height: p.size }} />
                                                </div>
                                                <span className="text-xs font-mono text-slate-500">{p.size}x{p.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
