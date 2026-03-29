"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Film, Trash2, ArrowRight, RefreshCw, Scissors, MonitorPlay } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoTrimmerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [trimmedUrl, setTrimmedUrl] = useState<string>("");
    
    // Config
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(10);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    
    // System
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    
    const ffmpegRef = useRef(new FFmpeg());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        loadFfmpeg();
        return () => {
            ffmpegRef.current.terminate();
        };
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
            console.error("FFMpeg load error:", err);
            setError("Failed to load processing engine. Your browser might not support WebAssembly.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
        setTrimmedUrl("");
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

    const handleVideoLoadedMetadata = () => {
        if (videoRef.current) {
            const duration = Math.floor(videoRef.current.duration);
            setVideoDuration(duration);
            setEndTime(Math.min(10, duration));
        }
    };

    const formatTimestamp = (seconds: number) => {
        const d = new Date(seconds * 1000);
        return d.toISOString().substring(14, 19);
    };

    const processTrim = async () => {
        if (!file || !isLoaded) return;
        
        if (startTime >= endTime) {
            setError("Start time must be before end time.");
            return;
        }

        setIsProcessing(true);
        setError("");
        setTrimmedUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const ext = file.name.substring(file.name.lastIndexOf("."));
            const inputName = `input_${file.name}`;
            const outputName = "output_trimmed" + ext;

            const fileData = await fetchFile(file);
            await ffmpeg.writeFile(inputName, fileData);

            // Execute copy trim (re-encode disabled for max speed)
            // -c copy is fast but might not be perfectly frame accurate depending on keyframes.
            await ffmpeg.exec([
                "-ss", startTime.toString(),
                "-to", endTime.toString(),
                "-i", inputName,
                "-c", "copy",
                outputName
            ]);

            // Read output
            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: file.type }));
            setTrimmedUrl(url);

        } catch (err: any) {
            console.error("Trimming error:", err);
            setError("An error occurred while trimming the video.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadTrimmed = () => {
        if (!trimmedUrl || !file) return;
        const link = document.createElement("a");
        link.href = trimmedUrl;
        link.download = `trimmed_${file.name}`;
        link.click();
    };

    return (
        <ToolLayout
            title="Video Trimmer"
            description="Cut and trim down large video files precisely in your browser without uploading."
        >
            <div className="max-w-5xl mx-auto flex flex-col space-y-8">
                
                {/* Engine Status */}
                {!isLoaded && !error && (
                    <div className="flex items-center justify-center p-4 bg-teal-50 dark:bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400 text-sm font-medium">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Initializing WebAssembly Processing Engine...
                    </div>
                )}
                {error && (
                    <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Upload Area */}
                {!file ? (
                    <div 
                        className={`border-2 border-dashed border-teal-300 dark:border-teal-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-teal-50/50 dark:bg-teal-900/10 transition-colors ${isLoaded ? 'hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <MonitorPlay className="w-10 h-10 text-teal-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload a Video to Trim</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            Select a video (MP4, WebM, MOV). 100% offline, privacy guaranteed.
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
                        
                        {/* Editor Side */}
                        <div className="flex flex-col space-y-6">
                            
                            {/* Video Preview */}
                            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm aspect-video relative flex flex-col">
                                <video 
                                    ref={videoRef}
                                    src={videoUrl} 
                                    controls 
                                    className="flex-1 w-full"
                                    onLoadedMetadata={handleVideoLoadedMetadata}
                                />
                                <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => { setFile(null); setTrimmedUrl(""); }} 
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Change Video
                                </Button>
                            </div>

                            {/* Trim Controls */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center mb-2">
                                    <Scissors className="w-5 h-5 mr-2 text-teal-500" />
                                    Trim Range
                                </h4>
                                
                                <div className="space-y-6">
                                    {/* Start Time slider */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Start Time</label>
                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-teal-600 dark:text-teal-400 font-bold">
                                                {formatTimestamp(startTime)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={videoDuration}
                                            value={startTime}
                                            onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 1))}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                        />
                                    </div>

                                    {/* End Time slider */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">End Time</label>
                                            <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-rose-500 dark:text-rose-400 font-bold">
                                                {formatTimestamp(endTime)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={videoDuration}
                                            value={endTime}
                                            onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 1))}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <span>Total Duration: {formatTimestamp(videoDuration)}</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">
                                            Result Length: {formatTimestamp(endTime - startTime)}
                                        </span>
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    onClick={processTrim}
                                    disabled={!isLoaded || isProcessing}
                                    className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl mt-4"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Trimming Video ({progress}%)
                                        </>
                                    ) : (
                                        <>
                                            <Scissors className="w-5 h-5 mr-2" />
                                            Trim Video
                                        </>
                                    )}
                                </Button>
                            </div>

                        </div>

                        {/* Right Side: Output */}
                        <div className="flex flex-col">
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full flex flex-col items-center justify-center min-h-[400px]">
                                
                                {!isProcessing && !trimmedUrl && (
                                    <div className="text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                                        <Scissors className="w-12 h-12 mb-4 opacity-30" />
                                        <p>Adjust start and end times, then hit Trim.<br/>The trimmed video will preview here.</p>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="flex flex-col items-center text-teal-600 w-full max-w-xs">
                                        <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-6"></div>
                                        <p className="font-bold mb-2">Executing Trim...</p>
                                        <div className="w-full h-2 bg-teal-100 dark:bg-teal-900/50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-teal-500 transition-all duration-300 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {trimmedUrl && !isProcessing && (
                                    <div className="flex flex-col items-center w-full animation-fade-in space-y-4">
                                        <h4 className="font-bold text-teal-600 dark:text-teal-400 pb-2 border-b border-teal-100 dark:border-teal-900 w-full text-center">
                                            Successfully Trimmed!
                                        </h4>
                                        <video 
                                            src={trimmedUrl} 
                                            controls 
                                            className="rounded-xl shadow-md max-w-full border border-slate-200 dark:border-slate-800"
                                        />
                                        <Button 
                                            variant="primary"
                                            onClick={downloadTrimmed}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                                        >
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            Download Trimmed Video
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
