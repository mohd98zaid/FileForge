"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Film, Trash2, ArrowRight, RefreshCw, Scissors, Type } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoToGifTool() {
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [gifUrl, setGifUrl] = useState<string>("");
    
    // Config
    const [startTime, setStartTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(5);
    const [fps, setFps] = useState<number>(10);
    const [width, setWidth] = useState<number>(480);
    
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
            ffmpeg.on("progress", ({ progress, time }) => {
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
            console.error("FFMpeg load error:", err);
            setError("Failed to load processing engine. Your browser might not support WebAssembly.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setGifUrl("");
        setProgress(0);
        
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith("video/")) {
            setError("Please upload a valid video file.");
            return;
        }

        setFile(selected);
        setVideoUrl(URL.createObjectURL(selected));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const convertToGif = async () => {
        if (!file || !isLoaded) return;
        setIsProcessing(true);
        setError("");
        setGifUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = "input" + file.name.substring(file.name.lastIndexOf("."));
            const outputName = "output.gif";

            // Write to memfs
            await ffmpeg.writeFile(inputName, await fetchFile(file));

            // Execute complex filtergraph for high quality GIF:
            // 1. Scale down to requested width (maintaining aspect ratio)
            // 2. Generate custom color palette
            // 3. Map palette back to scaled video
            await ffmpeg.exec([
                "-ss", startTime.toString(),
                "-t", duration.toString(),
                "-i", inputName,
                "-vf", `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
                "-loop", "0",
                outputName
            ]);

            // Read output
            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: "image/gif" }));
            setGifUrl(url);

        } catch (err: any) {
            console.error("Conversion error:", err);
            setError("An error occurred during conversion.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadGif = () => {
        if (!gifUrl) return;
        const link = document.createElement("a");
        link.href = gifUrl;
        link.download = `animated_${new Date().getTime()}.gif`;
        link.click();
    };

    return (
        <ToolLayout
            title="Video to GIF Converter"
            description="Convert video clips into high-quality animated GIFs directly in your browser without any server uploads."
           
        >
            <div className="max-w-5xl mx-auto flex flex-col space-y-8">
                
                {/* Engine Status */}
                {!isLoaded && !error && (
                    <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Initializing WebAssembly Processing Engine...
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Upload or View */}
                {!file ? (
                    <div 
                        className={`border-2 border-dashed border-rose-300 dark:border-rose-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-rose-50/50 dark:bg-rose-900/10 transition-colors ${isLoaded ? 'hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Film className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload a Video</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            Select a video (MP4, WebM, MOV) to convert into a GIF. Operations are 100% offline.
                        </p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="video/*" 
                            className="hidden" 
                            disabled={!isLoaded}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Left Side: Video & Settings */}
                        <div className="flex flex-col space-y-6">
                            
                            {/* Video Preview */}
                            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm aspect-video relative flex items-center justify-center border border-slate-800">
                                <video 
                                    src={videoUrl} 
                                    controls 
                                    className="max-w-full max-h-full"
                                    onTimeUpdate={(e) => {
                                        // Optional: link video playback to start time visually
                                    }}
                                />
                                <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => { setFile(null); setGifUrl(""); }} 
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Change
                                </Button>
                            </div>

                            {/* Settings Panel */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center mb-2">
                                    <Scissors className="w-5 h-5 mr-2 text-rose-500" />
                                    GIF Configuration
                                </h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Start Time (sec)</label>
                                        <input 
                                            type="number" 
                                            min="0" step="0.5"
                                            value={startTime} 
                                            onChange={e => setStartTime(Number(e.target.value))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Duration (sec)</label>
                                        <input 
                                            type="number" 
                                            min="0.5" step="0.5" max="30"
                                            value={duration} 
                                            onChange={e => setDuration(Number(e.target.value))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Framerate (FPS)</label>
                                        <input 
                                            type="number" 
                                            min="1" max="30"
                                            value={fps} 
                                            onChange={e => setFps(Number(e.target.value))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Width (px)</label>
                                        <input 
                                            type="number" 
                                            min="120" max="1080" step="10"
                                            value={width} 
                                            onChange={e => setWidth(Number(e.target.value))}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    onClick={convertToGif}
                                    disabled={!isLoaded || isProcessing}
                                    className="w-full px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Processing ({progress}%)
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight className="w-5 h-5 mr-2" />
                                            Generate GIF
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                                    Higher durations and framerates will require more processing time.
                                </p>
                            </div>

                        </div>

                        {/* Right Side: Output */}
                        <div className="flex flex-col">
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col items-center justify-center min-h-[400px]">
                                
                                {!isProcessing && !gifUrl && (
                                    <div className="text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                                        <Type className="w-12 h-12 mb-4 opacity-30" />
                                        <p>Adjust your settings and click Generate.<br/>Your GIF will appear here.</p>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="flex flex-col items-center text-rose-500 w-full max-w-xs">
                                        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-6"></div>
                                        <p className="font-bold mb-2">Encoding GIF...</p>
                                        {/* Progress Bar */}
                                        <div className="w-full h-2 bg-rose-100 dark:bg-rose-900/50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-rose-500 transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {gifUrl && !isProcessing && (
                                    <div className="flex flex-col items-center w-full animation-fade-in">
                                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-4 pb-2 border-b border-emerald-100 dark:border-emerald-900 w-full text-center">
                                            Successfully Generated!
                                        </h4>
                                        <img 
                                            src={gifUrl} 
                                            alt="Generated GIF" 
                                            className="rounded-lg shadow-md max-w-full mb-6 border border-slate-200 dark:border-slate-700 max-h-[400px]"
                                        />
                                        <Button 
                                            variant="primary"
                                            onClick={downloadGif}
                                        className="gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Download GIF <ArrowRight className="w-4 h-4" />
                                    </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
