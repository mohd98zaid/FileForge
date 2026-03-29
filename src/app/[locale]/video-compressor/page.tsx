"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Video, Trash2, ArrowRight, RefreshCw, Scissors, Download } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoCompressorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [crfLevel, setCrfLevel] = useState<"18" | "23" | "28">("28");
    
    // System
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    
    const ffmpegRef = useRef(new FFmpeg());
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadFfmpeg();
    }, []);

    const loadFfmpeg = async () => {
        try {
            const ffmpeg = ffmpegRef.current;
            ffmpeg.on("progress", ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            // Load core WASM
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setIsLoaded(true);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load engine. Please check your browser's WebAssembly support.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setVideoUrl("");
        setProgress(0);
        
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith("video/")) {
            setError("Please upload a valid video file.");
            return;
        }

        setFile(selected);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const compressVideo = async () => {
        if (!file || !isLoaded) return;
        
        setIsProcessing(true);
        setError("");
        setVideoUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = `input_${file.name.replace(/\s+/g, "_")}`;
            const outputName = `output.mp4`;

            const fileData = await fetchFile(file);
            await ffmpeg.writeFile(inputName, fileData);

            await ffmpeg.exec([
                "-i", inputName,
                "-vcodec", "libx264",
                "-crf", crfLevel,
                "-preset", "veryfast",
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
            setVideoUrl(url);

        } catch (err: any) {
            console.error(err);
            setError("Compression failed. Ensure the format is supported by the browser.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Video Compressor"
            description="Reduce video file sizes drastically right in your browser. Perfect for email and web uploads."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                
                {!isLoaded && !error && (
                    <div className="flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 font-medium">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Load Video Engine...
                    </div>
                )}
                
                {error && <div className="text-red-500 text-center font-medium bg-red-50 p-4 rounded-xl border border-red-200">{error}</div>}

                {!file ? (
                    <div 
                        className={`border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-emerald-50/50 dark:bg-emerald-900/10 ${isLoaded ? 'hover:bg-emerald-50 cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Video className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload Video</h3>
                        <p className="text-slate-500">Max size depends on browser RAM (typically ~1GB)</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" disabled={!isLoaded} />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center">
                        <div className="flex items-center space-x-4 mb-8 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <Video className="w-8 h-8 text-emerald-600" />
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold block truncate">{file.name}</span>
                                <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <Button variant="secondary" onClick={() => { setFile(null); setVideoUrl(""); }}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {!videoUrl && !isProcessing && (
                            <div className="flex flex-col w-full max-w-sm space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Compression Ratio / Quality</label>
                                    <select
                                        value={crfLevel}
                                        onChange={(e) => setCrfLevel(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-slate-50 border rounded-xl"
                                    >
                                        <option value="28">High Compression / Lower Quality</option>
                                        <option value="23">Medium (Balanced)</option>
                                        <option value="18">Low Compression / High Quality</option>
                                    </select>
                                </div>
                                <Button onClick={compressVideo} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                                    <Scissors className="w-5 h-5 mr-2" /> Compress Video
                                </Button>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="flex flex-col items-center w-full py-10">
                                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                                <h4>Compressing...</h4>
                                <div className="w-full max-w-sm h-2 bg-slate-100 rounded-full overflow-hidden mt-4">
                                    <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="mt-2 text-sm text-slate-500">{progress}% Processing (This may take a while)</p>
                            </div>
                        )}

                        {videoUrl && !isProcessing && (
                            <div className="flex flex-col items-center p-8 bg-emerald-50 rounded-xl w-full">
                                <h4 className="text-lg font-bold mb-4">Compression Finished</h4>
                                <video src={videoUrl} controls className="w-full max-w-md rounded-lg shadow-md mb-6" />
                                <a 
                                    href={videoUrl} 
                                    download={`compressed_${file.name}.mp4`}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium"
                                >
                                    Download MP4 <Download className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
