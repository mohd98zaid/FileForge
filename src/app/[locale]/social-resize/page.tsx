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
import { resizeImage } from "@/utils/image-processing";

const PRESETS = [
    { label: "Instagram Post", w: 1080, h: 1080 },
    { label: "Instagram Story", w: 1080, h: 1920 },
    { label: "Facebook Cover", w: 820, h: 312 },
    { label: "Facebook Post", w: 1200, h: 630 },
    { label: "Twitter Header", w: 1500, h: 500 },
    { label: "Twitter Post", w: 1200, h: 675 },
    { label: "LinkedIn Banner", w: 1584, h: 396 },
    { label: "YouTube Thumbnail", w: 1280, h: 720 },
    { label: "Pinterest Pin", w: 1000, h: 1500 },
    { label: "WhatsApp DP", w: 500, h: 500 },
];

const faqs = [
    { question: "Which platforms are supported?", questionHi: "कौन से प्लेटफ़ॉर्म सपोर्ट हैं?", answer: "Instagram, Facebook, Twitter, LinkedIn, YouTube, WhatsApp — all preset sizes available.", answerHi: "Instagram, Facebook, Twitter, LinkedIn, YouTube और WhatsApp — सबके प्रीसेट साइज़ मौजूद हैं।" },
    { question: "Can I upload multiple images?", questionHi: "क्या कई इमेज अपलोड कर सकते हैं?", answer: "Currently one image at a time. Batch support coming soon.", answerHi: "अभी एक बार में एक इमेज। बैच सपोर्ट जल्द आ रहा है।" },
];

export default function SocialResizePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [selected, setSelected] = useState(PRESETS[0]);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);

    const handleFilesSelected = async (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setOriginalDims(null);
        if (f.length) {
            const bmp = await createImageBitmap(f[0]);
            setOriginalDims({ w: bmp.width, h: bmp.height });
            bmp.close();
        }
    };

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const file = files[0];
            const resultFile = await resizeImage(file, selected.w, selected.h, false);

            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || (isHi ? "रिसाइज़ विफल रहा।" : "Resize failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📱 सोशल मीडिया रिसाइज़" : "📱 Social Media Resize"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "Instagram, Facebook आदि के लिए साइज़ बदलें" : "Resize images for Instagram, Facebook, Twitter & more"}</p>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={handleFilesSelected} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} />

                {files.length > 0 && (
                    <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            {originalDims && (
                                <p className="text-xs text-slate-400">{isHi ? "मूल:" : "Original:"} <span className="text-amber-400 font-semibold">{originalDims.w}×{originalDims.h}px</span></p>
                            )}
                            <p className="text-xs text-slate-500">{isHi ? "लक्ष्य:" : "Target:"} <span className="text-indigo-400 font-semibold">{selected.label}</span> → {selected.w}×{selected.h}px</p>
                            <div className="mt-2 flex items-center gap-2">
                                <div
                                    className="border-2 border-indigo-500/50 rounded bg-indigo-500/10 transition-all duration-300"
                                    style={{
                                        width: Math.min(80, 80 * (selected.w / Math.max(selected.w, selected.h))),
                                        height: Math.min(80, 80 * (selected.h / Math.max(selected.w, selected.h))),
                                    }}
                                />
                                <span className="text-xs text-slate-500">{selected.w}×{selected.h}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-3">{isHi ? "प्रीसेट चुनें" : "Choose Preset"}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {PRESETS.map((p) => (
                            <button key={p.label} onClick={() => setSelected(p)}
                                className={`rounded-xl border p-3 text-center text-sm transition-all ${selected.label === p.label ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"}`}>
                                <span className="block font-medium">{p.label}</span>
                                <span className="text-xs text-slate-500">{p.w}×{p.h}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">
                    {isHi ? `${selected.label} के लिए रिसाइज़ करें` : `Resize for ${selected.label}`}
                </button>
                <ProgressBar progress={progress} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {resultBlob && (
                    <div className="space-y-3">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Result" className="max-w-full max-h-72 object-contain rounded" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, `${selected.label.replace(/\s/g, "_").toLowerCase()}.jpg`)} label={isHi ? "रिसाइज़ चित्र डाउनलोड करें" : "Download Resized Image"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/social-resize" tools={ALL_TOOLS} />
        </div>
    );
}
