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
// @ts-ignore
import { changeDpi } from "@/utils/dpi-processing";

const faqs = [
    { question: "What DPI should I use?", questionHi: "कौन सा DPI इस्तेमाल करूँ?", answer: "300 DPI for print, 72 DPI for web.", answerHi: "प्रिंट के लिए 300 DPI, वेब के लिए 72 DPI सबसे अच्छा है।" },
    { question: "Does it change quality?", questionHi: "क्या यह क्वालिटी बदलता है?", answer: "DPI only changes print size. Pixel data stays the same.", answerHi: "DPI सिर्फ़ प्रिंट साइज़ को बदलता है, पिक्सल डेटा वही रहता है।" },
];

const DPI_PRESETS = [
    { label: "Screen (72)", value: 72 },
    { label: "Medium (150)", value: 150 },
    { label: "Print (300)", value: 300 },
];

export default function ChangeDpiPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [dpi, setDpi] = useState(300);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // UI feel
            const blob = await changeDpi(files[0], dpi);
            setResultBlob(blob);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "DPI change failed.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📏 DPI बदलें" : "📏 Image DPI Changer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "प्रिंट या वेब के लिए इमेज DPI बदलें" : "Change image DPI for print or web — no quality loss"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={(f) => { setFiles(f); setResultBlob(null); }} accept={{ "image/*": [".jpg", ".jpeg", ".png"] }} />

                {files.length > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "लक्ष्य (Target) DPI" : "Target DPI"}</label>
                    <div className="flex gap-3 flex-wrap mb-3">
                        {DPI_PRESETS.map((p) => (
                            <button key={p.value} onClick={() => setDpi(p.value)} className={dpi === p.value ? "btn-primary" : "btn-secondary"}>{p.label}</button>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "कस्टम DPI" : "Custom DPI"}</label>
                        <input type="number" value={dpi} onChange={(e) => setDpi(+e.target.value)} min={1} max={2400} className="input-field w-32" />
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "DPI बदलें" : "Change DPI"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <div>
                                <p className="text-xs text-slate-500">{isHi ? "नया DPI" : "New DPI"}</p>
                                <p className="text-sm font-semibold text-emerald-400">{dpi}</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, `image_${dpi}dpi.jpg`)} label={isHi ? "चित्र डाउनलोड करें" : "Download Updated Image"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/change-dpi" tools={ALL_TOOLS} />
        </div>
    );
}
