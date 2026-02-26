"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState, useMemo } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { compressPdf } from "@/utils/pdf-processing";

const faqs = [
    { question: "How much can I compress?", questionHi: "कितना कंप्रेस हो सकता है?", answer: "Typically 40-70% reduction depending on the PDF content (images vs text).", answerHi: "आमतौर पर 40-70% तक, PDF के कंटेंट पर निर्भर करता है (इमेज vs टेक्स्ट)।" },
    { question: "What do the levels mean?", questionHi: "लेवल का क्या मतलब है?", answer: "Low keeps high quality. Medium is balanced for email. High reduces size aggressively for web. Maximum is the smallest possible.", answerHi: "Low = अच्छी क्वालिटी। Medium = ईमेल के लिए बैलेंस्ड। High = वेब के लिए ज़बरदस्त कमी। Maximum = सबसे छोटा साइज़।" },
];

const LEVELS = [
    { value: "low", label: "Low", desc: "Best quality, less compression", icon: "📐", labelHi: "कम (Low)", descHi: "सबसे अच्छी क्वालिटी, कम कंप्रेशन" },
    { value: "medium", label: "Medium", desc: "Balanced for email/sharing", icon: "⚖️", labelHi: "मध्यम (Medium)", descHi: "ईमेल/शेयरिंग के लिए संतुलित" },
    { value: "high", label: "High", desc: "Good for web uploads", icon: "🗜️", labelHi: "उच्च (High)", descHi: "वेब अपलोड के लिए अच्छा" },
    { value: "maximum", label: "Maximum", desc: "Smallest file possible", icon: "🔥", labelHi: "अधिकतम (Max)", descHi: "सबसे छोटा संभव फ़ाइल साइज़" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const tCommon = useTranslations("Common");

    const [files, setFiles] = useState<File[]>([]);
    const [level, setLevel] = useState("medium");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const originalSize = useMemo(() => (files.length ? files[0].size : 0), [files]);

    const [targetSize, setTargetSize] = useState<number | undefined>(undefined);
    const [forceSize, setForceSize] = useState(false);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const compressedFile = await compressPdf(files[0], level, targetSize, forceSize);
            setResultBlob(compressedFile);
            setProgress(100);
        } catch (e: any) {
            console.error("Compression error:", e);
            setError(e?.message || (isHi ? "कंप्रेशन विफल रहा।" : "Compression failed."));
            setProgress(0);
        }
    };

    const reduction = resultBlob && originalSize
        ? Math.max(0, Math.round((1 - resultBlob.size / originalSize) * 100))
        : null;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📦 PDF कंप्रेस करें" : "📦 Compress PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF की फ़ाइल साइज़ कम करें" : "Reduce PDF file size"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={setFiles} label={tCommon("dropPdfHere")} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">📄</div>
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{isHi ? "साइज़:" : "Size:"} <span className="text-indigo-400 font-semibold">{formatSize(originalSize)}</span></p>
                        </div>
                    </div>
                )}

                {/* Compression Level */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "कंप्रेशन लेवल" : "Compression Level"}</label>
                    <div className="grid grid-cols-2 gap-2">
                        {LEVELS.map((l) => (
                            <button
                                key={l.value}
                                onClick={() => setLevel(l.value)}
                                className={`rounded-lg px-3 py-3 text-left text-sm transition-all border ${level === l.value
                                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                    : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                    }`}
                            >
                                <span className="block font-medium">{l.icon} {isHi ? l.labelHi : l.label}</span>
                                <span className="block text-xs opacity-70 mt-0.5">{isHi ? l.descHi : l.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target Size Input */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "टारगेट साइज़ (वैकल्पिक)" : "Target Size (Optional)"}</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder={isHi ? "उदा. 500" : "e.g. 500"}
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 w-full focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setTargetSize(val > 0 ? val : undefined);
                            }}
                            value={targetSize || ''}
                            id="targetSizeInput"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">KB</span>
                    </div>
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-500 focus:ring-indigo-500/50"
                            id="forceSize"
                            checked={forceSize}
                            onChange={(e) => setForceSize(e.target.checked)}
                        />
                        <label htmlFor="forceSize" className="ml-2 text-xs text-slate-400 cursor-pointer select-none">
                            {isHi ? "सख्त साइज़ लिमिट लागू करें (क्वालिटी कम हो सकती है)" : "Force strict size limit (may reduce quality further)"}
                        </label>
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "PDF कंप्रेस करें" : "Compress PDF"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3">
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
                            <DownloadButton onClick={() => downloadBlob(resultBlob, "compressed.pdf")} label={isHi ? "कंप्रेस्ड PDF डाउनलोड करें" : "Download Compressed PDF"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/compress-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
