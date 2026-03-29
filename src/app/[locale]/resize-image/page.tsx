"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import { downloadBlob } from "@/lib/api";
import { resizeImage, compressImage } from "@/utils/image-processing";

const faqs = [
    { question: "What formats are supported?", questionHi: "कौन-कौन से फ़ॉर्मेट समर्थित हैं?", answer: "JPEG, PNG, WebP, BMP, GIF, TIFF, and HEIC.", answerHi: "JPEG, PNG, WebP, BMP, GIF, TIFF, और HEIC।" },
    { question: "Can I resize by target file size?", questionHi: "क्या मैं लक्ष्य फ़ाइल आकार के अनुसार बदल सकता/सकती हूँ?", answer: "Yes! Set mode to 'By File Size' and enter a target in KB.", answerHi: "हाँ! 'फ़ाइल आकार से' मोड चुनें और KB में लक्ष्य दर्ज करें।" },
    { question: "Is there a max resolution?", questionHi: "क्या कोई अधिकतम रिज़ॉल्यूशन है?", answer: "We support images up to 10 MB. Very large images may take longer.", answerHi: "हम 10 MB तक की छवियों का समर्थन करते हैं। बहुत बड़ी छवियों में अधिक समय लग सकता है।" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ResizeImagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState<"dimensions" | "filesize">("dimensions");
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [targetKB, setTargetKB] = useState(200);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const originalSize = useMemo(() => (files.length ? files[0].size : 0), [files]);

    const onFilesSelected = (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setError(null);
        if (f.length) {
            const img = new Image();
            img.onload = () => {
                setWidth(img.naturalWidth);
                setHeight(img.naturalHeight);
            };
            img.src = URL.createObjectURL(f[0]);
        }
    };

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const file = files[0];
            let resultFile: File;

            if (mode === "dimensions") {
                setProgress(50);
                resultFile = await resizeImage(file, width, height);
            } else {
                setProgress(30);
                const maxSizeMB = targetKB / 1024;
                resultFile = await compressImage(file, maxSizeMB);
            }

            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "प्रोसेसिंग विफल। कृपया दूसरी फ़ाइल आज़माएँ।" : "Processing failed. Please try a different file."));
            setProgress(0);
        }
    };

    const downloadResult = () => {
        if (!resultBlob || !files.length) return;
        downloadBlob(resultBlob, `resized_${files[0].name}`);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📐 इमेज रिसाइज़ करें" : "📐 Resize Image"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "आयाम या लक्ष्य फ़ाइल आकार के अनुसार बदलें" : "Resize by exact dimensions or target file size"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={onFilesSelected} label={isHi ? "चित्र यहाँ डालें" : undefined} />

                {files.length > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{isHi ? "आकार" : "Size"}: <span className="text-indigo-400 font-semibold">{formatSize(originalSize)}</span></p>
                            <p className="text-xs text-slate-500">{isHi ? "आयाम" : "Dimensions"}: <span className="text-indigo-400 font-semibold">{width} × {height}</span></p>
                        </div>
                    </div>
                )}

                {/* Mode toggle */}
                <div className="flex gap-3">
                    <button onClick={() => setMode("dimensions")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "dimensions" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>{isHi ? "आयाम से" : "By Dimensions"}</button>
                    <button onClick={() => setMode("filesize")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "filesize" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>{isHi ? "फ़ाइल आकार से" : "By File Size"}</button>
                </div>

                {mode === "dimensions" ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{isHi ? "चौड़ाई (px)" : "Width (px)"}</label>
                            <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{isHi ? "ऊँचाई (px)" : "Height (px)"}</label>
                            <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="input-field" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "लक्ष्य आकार (KB)" : "Target Size (KB)"}</label>
                        <input type="number" value={targetKB} onChange={(e) => setTargetKB(Math.max(1, parseInt(e.target.value.replace(/^0+/, '') || '1', 10)))} className="input-field" />
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "आकार बदलें" : "Resize Image"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेसिंग..." : "Processing..."} />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Resized result" className="max-w-full max-h-72 object-contain rounded shadow-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "मूल" : "Original"}</p>
                                <p className="text-sm font-semibold text-slate-300">{formatSize(originalSize)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "बदला हुआ" : "Resized"}</p>
                                <p className="text-sm font-semibold text-emerald-400">{formatSize(resultBlob.size)}</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={downloadResult} label={isHi ? "रिसाइज़ चित्र डाउनलोड करें" : "Download Resized Image"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/resize-image" tools={ALL_TOOLS} />
        </div>
    );
}
