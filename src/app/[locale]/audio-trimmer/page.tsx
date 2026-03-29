"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Scissors, Music, Trash2, ArrowRight, RefreshCw, AudioLines } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function AudioTrimmerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [trimmedUrl, setTrimmedUrl] = useState<string>("");
    
    // Config
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(10);
    
    // System
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    
    const ffmpegRef = useRef(new FFmpeg());
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        if (!selected.type.startsWith("audio/")) {
            setError("Please upload a valid audio file.");
            return;
        }

        setFile(selected);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const trimAudio = async () => {
        if (!file || !isLoaded) return;
        if (startTime >= endTime) {
            setError("Start time must be less than end time.");
            return;
        }
        
        setIsProcessing(true);
        setError("");
        setTrimmedUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = `input_${file.name.replace(/\s+/g, "_")}`;
            const extensionMatch = file.name.match(/\.[0-9a-z]+$/i);
            const ext = extensionMatch ? extensionMatch[0] : ".mp3";
            const outputName = `output${ext}`;

            // fetchFile returns a Uint8Array
            const fileData = await fetchFile(file);
            await ffmpeg.writeFile(inputName, fileData);

            // Execute trim command
            const duration = (endTime - startTime).toString();
            
            await ffmpeg.exec([
                "-ss", startTime.toString(),
                "-i", inputName,
                "-t", duration,
                "-c", "copy",
                outputName
            ]);

            // Read output
            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: file.type }));
            setTrimmedUrl(url);

        } catch (err: any) {
            console.error("Trimming error:", err);
            setError("An error occurred during trimming. The file may be corrupt or unsupported.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadAudio = () => {
        if (!trimmedUrl || !file) return;
        const link = document.createElement("a");
        link.href = trimmedUrl;
        
        const originalName = file.name.substring(0, file.name.lastIndexOf("."));
        const extMatch = file.name.match(/\.[0-9a-z]+$/i);
        const ext = extMatch ? extMatch[0] : ".mp3";
        
        link.download = `${originalName}_trimmed${ext}`;
        link.click();
    };

    return (
        <ToolLayout
            title="Audio Trimmer"
            description="Cut and trim audio files exactly at the seconds you need without re-encoding."
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                
                {/* Engine Status */}
                {!isLoaded && !error && (
                    <div className="flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Initializing Audio Engine...
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
                        className={`border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-emerald-50/50 dark:bg-emerald-900/10 transition-colors ${isLoaded ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Scissors className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload an Audio File to Trim</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            Extract specific sections of MP3, WAV, or AAC files locally in your browser.
                        </p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="audio/*" 
                            className="hidden" 
                            disabled={!isLoaded}
                        />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        
                        {/* File Info */}
                        <div className="flex items-center space-x-4 mb-8 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                                <Music className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Ready to trim</span>
                            </div>
                            <Button variant="secondary" onClick={() => { setFile(null); setTrimmedUrl(""); }} size="sm">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {!trimmedUrl && !isProcessing && (
                            <div className="flex flex-col w-full max-w-lg space-y-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time (sec)</label>
                                        <input
                                            type="number"
                                            value={startTime}
                                            onChange={(e) => setStartTime(Number(e.target.value))}
                                            min="0"
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time (sec)</label>
                                        <input
                                            type="number"
                                            value={endTime}
                                            onChange={(e) => setEndTime(Number(e.target.value))}
                                            min="0"
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    variant="primary" 
                                    onClick={trimAudio}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-lg mt-6"
                                >
                                    <Scissors className="w-5 h-5 mr-2" />
                                    Cut Audio
                                </Button>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="flex flex-col items-center justify-center py-10 w-full">
                                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Trimming Audio...</h4>
                            </div>
                        )}

                        {trimmedUrl && !isProcessing && (
                            <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl w-full mt-4 animation-fade-in">
                                <AudioLines className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mb-6" />
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Trimming Complete!</h4>
                                
                                <audio src={trimmedUrl} controls className="w-full max-w-md mb-8" />
                                
                                <Button 
                                    variant="primary" 
                                    onClick={downloadAudio}
                                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    Download Trimmed Audio <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
