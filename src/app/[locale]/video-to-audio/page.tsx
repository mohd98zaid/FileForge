"use client";

import { useLocale } from "next-intl";

import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import { downloadFromUrl } from "@/lib/api";

const faqs = [
    { question: "Which video formats?", questionHi: "कौन से वीडियो फ़ॉर्मेट?", answer: "MP4, WebM, AVI and other popular formats — converted right in your browser.", answerHi: "MP4, WebM, AVI और अन्य लोकप्रिय फ़ॉर्मेट — ब्राउज़र में ही कन्वर्ट होता है।" },
    { question: "Is it private?", questionHi: "क्या यह सुरक्षित है?", answer: "Yes! FFmpeg WebAssembly runs in your browser. Nothing is uploaded.", answerHi: "बिल्कुल! FFmpeg WebAssembly से सब ब्राउज़र में होता है, कोई अपलोड नहीं।" },
];

export default function VideoToAudioPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<"mp3" | "wav">("mp3");

    const load = async () => {
        setIsLoading(true);
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current as FFmpeg;

        ffmpeg.on("log", ({ message }) => {
            console.log(message);
        });

        // Progress handler
        ffmpeg.on("progress", ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setLoaded(true);
        } catch (e) {
            console.error(e);
            setMessage(isHi ? "FFmpeg इंजन लोड करने में विफल। कृपया एक आधुनिक ब्राउज़र का उपयोग करें।" : "Failed to load FFmpeg engine. Please use a modern desktop browser.");
        } finally {
            setIsLoading(false);
        }
    };

    const convert = async () => {
        if (!file || !ffmpegRef.current) return;
        setResultUrl(null);
        setProgress(0);
        setMessage(isHi ? "ऑडियो निकाला जा रहा है..." : "Extracting audio...");

        const ffmpeg = ffmpegRef.current;
        const inputExt = file.name.split('.').pop()?.toLowerCase() || "mp4";
        const outputExt = targetFormat;

        try {
            await ffmpeg.writeFile("input." + inputExt, await fetchFile(file));
            // -vn: disable video recording, -acodec: force audio codec
            await ffmpeg.exec(["-i", "input." + inputExt, "-vn", "output." + outputExt]);

            const data = await ffmpeg.readFile("output." + outputExt);
            const blob = new Blob([data as any], { type: `audio/${outputExt}` });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setMessage(isHi ? "ऑडियो निकालना पूरा हुआ!" : "Extraction complete!");
            setProgress(100);
        } catch (e) {
            console.error(e);
            setMessage(isHi ? "ऑडियो निकालना विफल रहा।" : "Extraction failed.");
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔉 वीडियो से ऑडियो" : "🔉 Video to Audio"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "वीडियो से MP3 निकालें (ब्राउज़र में, सुरक्षित)" : "Extract MP3/WAV from video files privately"}</p>
            </div>

            <div className="glass-card max-w-xl mx-auto space-y-6">
                {!loaded ? (
                    <div className="text-center py-8">
                        <p className="mb-4 text-slate-300">
                            {isHi ? "इस टूल को कन्वर्ज़न इंजन (~30MB) के वन-टाइम डाउनलोड की आवश्यकता है।" : "This tool requires a one-time download of the conversion engine (~30MB)."}
                        </p>
                        <button
                            onClick={load}
                            disabled={isLoading}
                            className="btn-primary"
                        >
                            {isLoading ? (isHi ? "इंजन लोड हो रहा है..." : "Loading Engine...") : (isHi ? "कन्वर्टर इंजन लोड करें" : "Load Converter Engine")}
                        </button>
                    </div>
                ) : (
                    <>
                        <FileUpload
                            accept={{ "video/*": [".mp4", ".webm", ".mov", ".mkv"] }}
                            maxFiles={1}
                            onFilesSelected={(files) => setFile(files[0])}
                            label={isHi ? "यहाँ वीडियो फ़ाइल ड्रॉप करें" : "Drop video file here"}
                            hint={isHi ? "MP4, WebM, MOV, MKV" : "MP4, WebM, MOV, MKV"}
                        />

                        {file && (
                            <div className="space-y-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                                    <span className="truncate text-slate-200 text-sm">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">✕</button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className="text-slate-400 text-sm">{isHi ? "निकालें:" : "Extract as:"}</span>
                                    <select
                                        value={targetFormat}
                                        onChange={(e) => setTargetFormat(e.target.value as any)}
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-white text-sm focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="mp3">MP3</option>
                                        <option value="wav">WAV</option>
                                    </select>
                                </div>

                                <button onClick={convert} className="btn-primary w-full">{isHi ? "ऑडियो निकालें" : "Extract Audio"}</button>
                            </div>
                        )}

                        <ProgressBar progress={progress} />

                        {message && <p className="text-center text-sm text-slate-300">{message}</p>}

                        {resultUrl && (
                            <div className="flex justify-center pt-2">
                                <DownloadButton
                                    onClick={() => {
                                        downloadFromUrl(resultUrl, `audio.${targetFormat}`);
                                    }}
                                    label={isHi ? `.${targetFormat.toUpperCase()} डाउनलोड करें` : `Download .${targetFormat.toUpperCase()}`}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/video-to-audio" tools={ALL_TOOLS} />
        </div>
    );
}
