"use client";

import { useLocale } from "next-intl";

import { useState, useMemo } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import { compressImage } from "@/utils/image-processing";
import { downloadBlob } from "@/lib/api"; // We still need downloadBlob, removing postFormData

const faqs = [
    { question: "How much can I reduce?", questionHi: "कितना कम हो सकता है?", answer: "Typically 30-80%, depending on the image type and quality setting.", answerHi: "आमतौर पर 30-80% तक, इमेज के प्रकार और क्वालिटी सेटिंग पर निर्भर करता है।" },
    { question: "Does it reduce quality?", questionHi: "क्या क्वालिटी कम होती है?", answer: "You control the quality slider. At 70-80%, the difference is barely noticeable.", answerHi: "आप क्वालिटी स्लाइडर से कंट्रोल कर सकते हैं। 70-80% पर अंतर नज़र नहीं आता।" },
    { question: "Is my image uploaded?", questionHi: "क्या मेरी इमेज अपलोड होती है?", answer: "No. Everything is processed in your browser. Your file never leaves your device.", answerHi: "नहीं! सब कुछ आपके ब्राउज़र में होता है। आपकी फ़ाइल कहीं नहीं जाती।" },
];

const PRESETS = [
    { label: "Maximum", labelHi: "अधिकतम", quality: 40, desc: "Smallest file", descHi: "सबसे छोटी फ़ाइल" },
    { label: "Web", labelHi: "वेब", quality: 60, desc: "Good for web", descHi: "वेब के लिए अच्छा" },
    { label: "Standard", labelHi: "मानक", quality: 75, desc: "Balanced", descHi: "सन्तुलित" },
    { label: "High Quality", labelHi: "उच्च गुणवत्ता", quality: 90, desc: "Near original", descHi: "मूल के करीब" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressImagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState(75);
    const [useCustom, setUseCustom] = useState(false);
    const [compressMode, setCompressMode] = useState<"quality" | "targetKb">("quality");
    const [targetKb, setTargetKb] = useState(200);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const originalSize = useMemo(() => (files.length ? files[0].size : 0), [files]);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const file = files[0];
            let resultFile: File;

            if (compressMode === "targetKb") {
                // Target size mode
                const maxSizeMB = targetKb / 1024;
                resultFile = await compressImage(file, maxSizeMB);
            } else {
                resultFile = await compressImage(file, 50, quality / 100);
            }

            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "कंप्रेशन विफल रहा।" : "Compression failed."));
            setProgress(0);
        }
    };

    const reduction = resultBlob && originalSize
        ? Math.max(0, Math.round((1 - resultBlob.size / originalSize) * 100))
        : null;

    const downloadResult = () => {
        if (!resultBlob) return;
        downloadBlob(resultBlob, `compressed_${files[0]?.name || "image.jpg"}`);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🗜️ इमेज कंप्रेस करें" : "🗜️ Compress Image"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "गुणवत्ता बनाए रखते हुए फ़ाइल का आकार कम करें" : "Reduce file size while preserving quality"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={setFiles} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={URL.createObjectURL(files[0])}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{isHi ? "मूल:" : "Original:"} <span className="text-indigo-400 font-semibold">{formatSize(originalSize)}</span></p>
                        </div>
                    </div>
                )}

                {/* Mode toggle: Quality vs Target KB */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "कंप्रेशन मोड" : "Compression Mode"}</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setCompressMode("quality")}
                            className={`rounded-lg px-3 py-3 text-left text-sm transition-all border ${compressMode === "quality"
                                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                }`}
                        >
                            <span className="block font-medium">{isHi ? "🎚️ गुणवत्ता द्वारा" : "🎚️ By Quality"}</span>
                            <span className="block text-xs opacity-70 mt-0.5">{isHi ? "JPEG गुणवत्ता % सेट करें" : "Set JPEG quality %"}</span>
                        </button>
                        <button
                            onClick={() => setCompressMode("targetKb")}
                            className={`rounded-lg px-3 py-3 text-left text-sm transition-all border ${compressMode === "targetKb"
                                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                }`}
                        >
                            <span className="block font-medium">{isHi ? "📏 लक्ष्य आकार (KB)" : "📏 Target Size (KB)"}</span>
                            <span className="block text-xs opacity-70 mt-0.5">{isHi ? "वांछित फ़ाइल आकार निर्दिष्ट करें" : "Specify desired file size"}</span>
                        </button>
                    </div>
                </div>

                {compressMode === "quality" ? (
                    <>
                        {/* Presets */}
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">{isHi ? "त्वरित प्रीसेट" : "Quick Presets"}</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.label}
                                        onClick={() => { setQuality(p.quality); setUseCustom(false); }}
                                        className={`rounded-lg px-3 py-2 text-center text-sm transition-all border ${!useCustom && quality === p.quality
                                            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                            }`}
                                    >
                                        <span className="block font-medium">{isHi ? p.labelHi : p.label}</span>
                                        <span className="block text-xs opacity-70">{isHi ? p.descHi : p.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom toggle + slider */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => setUseCustom(!useCustom)}
                                    className={`rounded-lg px-3 py-1.5 text-sm transition-all border ${useCustom
                                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                        : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                        }`}
                                >
                                    {isHi ? "🎛️ कस्टम" : "🎛️ Custom"}
                                </button>
                                {useCustom && (
                                    <span className="text-sm text-slate-400">{isHi ? "गुणवत्ता:" : "Quality:"} <span className="text-indigo-400 font-semibold">{quality}%</span></span>
                                )}
                            </div>
                            {useCustom && (
                                <div className="space-y-1">
                                    <input type="range" min={5} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-indigo-500" />
                                    <div className="flex justify-between text-xs text-slate-600"><span>5% ({isHi ? "सबसे छोटी" : "tiniest"})</span><span>100% ({isHi ? "मूल" : "original"})</span></div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Target KB mode */
                    <div className="space-y-3">
                        <label className="block text-sm text-slate-400">{isHi ? "लक्ष्य फ़ाइल का आकार" : "Target File Size"}</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min={10}
                                max={10000}
                                value={targetKb}
                                onChange={(e) => setTargetKb(Math.max(10, +e.target.value))}
                                className="input-field w-32 text-center text-lg font-semibold"
                            />
                            <span className="text-slate-400 font-medium">KB</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[50, 100, 200, 500, 1000].map((kb) => (
                                <button
                                    key={kb}
                                    onClick={() => setTargetKb(kb)}
                                    className={`rounded-lg px-3 py-1.5 text-sm transition-all border ${targetKb === kb
                                        ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                        : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                        }`}
                                >
                                    {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                                </button>
                            ))}
                        </div>
                        {originalSize > 0 && (
                            <p className="text-xs text-slate-500">
                                {isHi ? "मूल:" : "Original:"} {formatSize(originalSize)} → {isHi ? "लक्ष्य:" : "Target:"} <span className="text-emerald-400 font-semibold">{targetKb >= 1000 ? `${(targetKb / 1024).toFixed(1)} MB` : `${targetKb} KB`}</span>
                                {targetKb * 1024 >= originalSize && <span className="text-amber-400 ml-2">{isHi ? "(पहले से ही आकार कम है!)" : "(already smaller!)"}</span>}
                            </p>
                        )}
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "इमेज कंप्रेस करें" : "Compress Image"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Result preview */}
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Compressed result" className="max-w-full max-h-72 object-contain rounded shadow-lg" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "मूल" : "Original"}</p>
                                <p className="text-sm font-semibold text-slate-300">{formatSize(originalSize)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "कंप्रेस्ड" : "Compressed"}</p>
                                <p className="text-sm font-semibold text-emerald-400">{formatSize(resultBlob.size)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "बचत" : "Saved"}</p>
                                <p className="text-sm font-semibold text-indigo-400">{reduction}%</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={downloadResult} label={isHi ? "कंप्रेस्ड चित्र डाउनलोड करें" : "Download Compressed"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/compress-image" tools={ALL_TOOLS} />
        </div>
    );
}
