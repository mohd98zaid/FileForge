"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How does this work?", questionHi: "यह कैसे काम करता है?", answer: "We use the browser's MediaRecorder API to re-record the video without its audio track. The video plays muted and gets captured frame by frame.", answerHi: "हम ब्राउज़र की MediaRecorder API का उपयोग करके वीडियो को बिना ऑडियो ट्रैक के पुनः रिकॉर्ड करते हैं।" },
    { question: "Is my video uploaded?", questionHi: "क्या मेरा वीडियो अपलोड होता है?", answer: "No, everything happens locally in your browser. No data leaves your device.", answerHi: "नहीं, सब कुछ आपके ब्राउज़र में स्थानीय रूप से होता है। आपके डिवाइस से कोई डेटा बाहर नहीं जाता।" },
    { question: "Which video formats are supported?", questionHi: "कौन से वीडियो फ़ॉर्मेट समर्थित हैं?", answer: "Any format your browser can play (typically MP4, WebM, MOV). The output is WebM by default.", answerHi: "कोई भी फ़ॉर्मेट जिसे आपका ब्राउज़र चला सके (आमतौर पर MP4, WebM, MOV)। आउटपुट डिफ़ॉल्ट रूप से WebM है।" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function VideoMutePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [outputUrl, setOutputUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            if (outputUrl) URL.revokeObjectURL(outputUrl);
        };
    }, [videoUrl, outputUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (!selected.type.startsWith("video/")) {
            setError(isHi ? "कृपया एक वैध वीडियो फ़ाइल अपलोड करें।" : "Please upload a valid video file.");
            return;
        }
        setFile(selected);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setVideoUrl(URL.createObjectURL(selected));
        setOutputUrl("");
        setError(null);
        setProgress(0);
    };

    const handleMute = async () => {
        if (!file || !videoUrl) return;
        setIsProcessing(true);
        setError(null);
        setProgress(10);

        try {
            const video = document.createElement("video");
            video.src = videoUrl;
            video.muted = true;
            video.playsInline = true;

            await new Promise<void>((resolve, reject) => {
                video.onloadedmetadata = () => resolve();
                video.onerror = () => reject(new Error(isHi ? "वीडियो लोड करने में विफल" : "Failed to load video"));
            });

            video.currentTime = 0;
            await new Promise<void>((resolve) => { video.onseeked = () => resolve(); });

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d")!;

            const canvasStream = canvas.captureStream(30);
            const recorder = new MediaRecorder(canvasStream, { mimeType: "video/webm; codecs=vp9" });
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

            const done = new Promise<Blob>((resolve) => {
                recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
            });

            recorder.start();
            video.play();

            const drawFrame = () => {
                if (video.ended || video.paused) {
                    recorder.stop();
                    return;
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setProgress(Math.min(95, Math.round((video.currentTime / video.duration) * 100)));
                requestAnimationFrame(drawFrame);
            };

            requestAnimationFrame(drawFrame);
            const blob = await done;
            setOutputUrl(URL.createObjectURL(blob));
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "प्रोसेसिंग में त्रुटि" : "Processing error"));
        }
        setIsProcessing(false);
    };

    const handleDownload = () => {
        if (!outputUrl || !file) return;
        const link = document.createElement("a");
        link.href = outputUrl;
        const name = file.name.replace(/\.[^/.]+$/, "");
        link.download = `${name}_muted.webm`;
        link.click();
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔇 वीडियो म्यूट करें" : "🔇 Mute Video"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "वीडियो से ऑडियो ट्रैक हटाएँ" : "Remove the audio track from your video"}</p>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">
                {!file ? (
                    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">{isHi ? "वीडियो अपलोड करें" : "Upload a Video"}</h3>
                        <p className="text-sm text-slate-400">{isHi ? "ऑडियो ट्रैक हटाने के लिए वीडियो चुनें" : "Select a video to remove its audio"}</p>
                        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </div>
                ) : (
                    <>
                        {/* File info */}
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                            </div>
                            <button onClick={() => { setFile(null); setVideoUrl(""); setOutputUrl(""); setProgress(0); }} className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700">
                                {isHi ? "बदलें" : "Change"}
                            </button>
                        </div>

                        {/* Video preview */}
                        <div className="rounded-xl overflow-hidden border border-slate-700/50">
                            <video src={outputUrl || videoUrl} controls className="w-full max-h-[400px] bg-black" />
                        </div>

                        {/* Progress */}
                        {isProcessing && (
                            <div className="space-y-2">
                                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="text-xs text-slate-500 text-right">{progress}%</p>
                            </div>
                        )}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {!outputUrl ? (
                                <button onClick={handleMute} disabled={isProcessing} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                                    {isProcessing
                                        ? (isHi ? "प्रोसेस हो रहा है..." : "Processing...")
                                        : (isHi ? "🔇 म्यूट और डाउनलोड" : "🔇 Mute & Download")}
                                </button>
                            ) : (
                                <button onClick={handleDownload} className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
                                    {isHi ? "⬇️ म्यूटेड वीडियो डाउनलोड करें" : "⬇️ Download Muted Video"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/video-mute" tools={ALL_TOOLS} />
        </div>
    );
}
