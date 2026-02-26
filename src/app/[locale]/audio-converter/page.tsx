"use client";

import { useLocale } from "next-intl";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import { downloadBlob, downloadFromUrl } from "@/lib/api";

const faqs = [
    { question: "Which formats are supported?", questionHi: "कौन से फ़ॉर्मेट सपोर्ट हैं?", answer: "MP3, WAV, and other popular audio formats.", answerHi: "MP3, WAV और अन्य लोकप्रिय ऑडियो फ़ॉर्मेट।" },
    { question: "Is it private?", questionHi: "क्या यह सुरक्षित है?", answer: "Absolutely! Audio is converted in your browser using FFmpeg WASM. Nothing is uploaded.", answerHi: "बिल्कुल! ऑडियो आपके ब्राउज़र में FFmpeg WASM से कन्वर्ट होता है, कहीं अपलोड नहीं होता।" },
];

export default function AudioConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<"mp3" | "wav">("wav");

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
        ffmpeg.on("progress", ({ progress, time }) => {
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
        setMessage(isHi ? "प्रोसेस हो रहा है..." : "Processing...");

        const ffmpeg = ffmpegRef.current;
        const inputExt = file.name.split('.').pop()?.toLowerCase();
        const outputExt = targetFormat;

        try {
            await ffmpeg.writeFile("input." + inputExt, await fetchFile(file));
            await ffmpeg.exec(["-i", "input." + inputExt, "output." + outputExt]);

            const data = await ffmpeg.readFile("output." + outputExt);
            const blob = new Blob([data as any], { type: `audio/${outputExt}` });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setMessage(isHi ? "कन्वर्ज़न पूरा हुआ!" : "Conversion complete!");
            setProgress(100);
        } catch (e) {
            console.error(e);
            setMessage(isHi ? "कन्वर्ज़न विफल रहा।" : "Conversion failed.");
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎵 ऑडियो कन्वर्टर" : "🎵 Audio Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "MP3 को WAV में बदलें (ब्राउज़र में, सुरक्षित)" : "Convert MP3 ↔ WAV privately in your browser"}</p>
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
                            accept={{ "audio/*": [".mp3", ".wav"] }}
                            maxFiles={1}
                            onFilesSelected={(files) => setFile(files[0])}
                            label={isHi ? "यहाँ ऑडियो फ़ाइल ड्रॉप करें" : "Drop audio file here"}
                            hint={isHi ? "MP3 या WAV" : "MP3 or WAV"}
                        />

                        {file && (
                            <div className="space-y-4">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                                    <span className="truncate text-slate-200 text-sm">{file.name}</span>
                                    <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">✕</button>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className="text-slate-400 text-sm">{isHi ? "इसमें बदलें:" : "Convert to:"}</span>
                                    <select
                                        value={targetFormat}
                                        onChange={(e) => setTargetFormat(e.target.value as any)}
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-white text-sm focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="wav">WAV</option>
                                        <option value="mp3">MP3</option>
                                    </select>
                                </div>

                                <button onClick={convert} className="btn-primary w-full">{isHi ? "ऑडियो कन्वर्ट करें" : "Convert Audio"}</button>
                            </div>
                        )}

                        <ProgressBar progress={progress} />

                        {message && <p className="text-center text-sm text-slate-300">{message}</p>}

                        {resultUrl && (
                            <div className="flex justify-center pt-2">
                                <DownloadButton
                                    onClick={() => {
                                        downloadFromUrl(resultUrl, `converted.${targetFormat}`);
                                    }}
                                    label={isHi ? `.${targetFormat.toUpperCase()} डाउनलोड करें` : `Download .${targetFormat.toUpperCase()}`}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/audio-converter" tools={ALL_TOOLS} />
        </div>
    );
}
