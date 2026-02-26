"use client";

import { useLocale } from "next-intl";

import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
// @ts-ignore
import { createGif } from "@/utils/gif-processing";

const faqs = [
    { question: "How many images can I use?", questionHi: "कितनी इमेज इस्तेमाल कर सकते हैं?", answer: "Upload multiple images to create an animated GIF.", answerHi: "कई इमेज अपलोड करके एनिमेटेड GIF बना सकते हैं।" },
    { question: "Can I set the speed?", questionHi: "क्या स्पीड सेट कर सकते हैं?", answer: "Yes, set the delay (in ms) between each frame.", answerHi: "हाँ, हर फ़्रेम के बीच डिले (मिलीसेकंड में) सेट कर सकते हैं।" },
];

export default function GifMakerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [delay, setDelay] = useState(200);
    const [loopCount, setLoopCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onFilesSelected = useCallback((f: File[]) => {
        setFiles(f);
        setResultBlob(null);
    }, []);

    const moveItem = (from: number, to: number) => {
        if (to < 0 || to >= files.length) return;
        const updated = [...files];
        const [item] = updated.splice(from, 1);
        updated.splice(to, 0, item);
        setFiles(updated);
    };

    const removeItem = (idx: number) => {
        setFiles(files.filter((_, i) => i !== idx));
    };

    const handleProcess = async () => {
        if (files.length < 2) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const blob = await createGif(files, delay, loopCount);
            setResultBlob(blob);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "GIF बनाना विफल रहा।" : "GIF creation failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎞️ GIF बनाएँ" : "🎞️ GIF Maker"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "कई इमेज से एनिमेटेड GIF बनाएँ" : "Create animated GIFs from your images"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={10} onFilesSelected={onFilesSelected} accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop images here"} hint={isHi ? "2 या अधिक इमेज अपलोड करें" : "Upload 2 or more images"} />

                {files.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-slate-400">{isHi ? "फ़्रेम क्रम (खींचकर बदलें):" : "Frame order (drag to reorder):"}</p>
                        <div className="grid grid-cols-5 gap-2">
                            {files.map((f, i) => (
                                <div key={i} className="relative group rounded-lg border border-slate-700/50 bg-slate-800/50 p-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={URL.createObjectURL(f)} alt={`Frame ${i + 1}`} className="w-full aspect-square object-cover rounded" />
                                    <div className="absolute inset-0 rounded-lg bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <button onClick={() => moveItem(i, i - 1)} className="text-xs bg-indigo-500/80 rounded px-1 py-0.5 text-white hover:bg-indigo-500" disabled={i === 0}>←</button>
                                        <button onClick={() => moveItem(i, i + 1)} className="text-xs bg-indigo-500/80 rounded px-1 py-0.5 text-white hover:bg-indigo-500" disabled={i === files.length - 1}>→</button>
                                        <button onClick={() => removeItem(i)} className="text-xs bg-red-500/80 rounded px-1 py-0.5 text-white hover:bg-red-500">✕</button>
                                    </div>
                                    <p className="text-center text-xs text-slate-500 mt-1">{i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "फ़्रेम डिले:" : "Frame Delay:"} {delay}ms</label>
                        <input type="range" min={50} max={2000} step={50} value={delay} onChange={(e) => setDelay(+e.target.value)} className="w-full accent-indigo-500" />
                        <div className="flex justify-between text-xs text-slate-600">
                            <span>{isHi ? "तेज़" : "Fast"}</span><span>{isHi ? "धीमा" : "Slow"}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "लूप काउंट" : "Loop Count"}</label>
                        <input type="number" value={loopCount} onChange={(e) => setLoopCount(+e.target.value)} min={0} className="input-field" />
                        <p className="text-xs text-slate-600 mt-1">{isHi ? "0 = अनंत (infinite)" : "0 = infinite"}</p>
                    </div>
                </div>

                <button onClick={handleProcess} disabled={files.length < 2} className="btn-primary w-full">
                    {isHi ? `GIF बनाएँ (${files.length} फ़्रेम)` : `Create GIF (${files.length} frames)`}
                </button>

                <ProgressBar progress={progress} label={isHi ? "GIF बनाया जा रहा है..." : "Creating GIF..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Animated GIF" className="max-w-full max-h-72 object-contain rounded" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, "animated.gif")} label={isHi ? "GIF डाउनलोड करें" : "Download GIF"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/gif-maker" tools={ALL_TOOLS} />
        </div>
    );
}
