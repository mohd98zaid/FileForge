"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, Film, Trash2, ArrowRight, RefreshCw, AudioLines, Music } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoToAudioTool() {
    const [file, setFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [audioFormat, setAudioFormat] = useState<"mp3" | "wav" | "aac">("mp3");
    
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
        setAudioUrl("");
        setProgress(0);
        
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith("video/")) {
            setError("Please upload a valid video file.");
            return;
        }

        setFile(selected);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const extractAudio = async () => {
        if (!file || !isLoaded) return;
        
        setIsProcessing(true);
        setError("");
        setAudioUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = `input_${file.name}`;
            const outputName = `output.${audioFormat}`;

            // Write to memfs
            // fetchFile returns a Uint8Array, we can pass it directly
            const fileData = await fetchFile(file);
            await ffmpeg.writeFile(inputName, fileData);

            // Execute extraction command
            // Simple mapping of audio streams from the input file
            await ffmpeg.exec([
                "-i", inputName,
                "-q:a", "0", // preserves quality where applicable
                "-map", "a", // Map only the audio stream
                outputName
            ]);

            // Read output
            const data = await ffmpeg.readFile(outputName);
            const mimeTypes = {
                mp3: "audio/mpeg",
                wav: "audio/wav",
                aac: "audio/aac"
            };
            
            const url = URL.createObjectURL(new Blob([data as any], { type: mimeTypes[audioFormat] }));
            setAudioUrl(url);

        } catch (err: any) {
            console.error("Extraction error:", err);
            setError("An error occurred while extracting audio. The video may not contain an audio track.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadAudio = () => {
        if (!audioUrl || !file) return;
        const link = document.createElement("a");
        link.href = audioUrl;
        
        // Replace video extension with new audio extension
        const originalName = file.name.substring(0, file.name.lastIndexOf("."));
        link.download = `${originalName}_extracted.${audioFormat}`;
        
        link.click();
    };

    return (
        <ToolLayout
            title="Video to Audio Extractor"
            description="Strip the video frames and extract the raw audio layer securely inside your browser."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                
                {/* Engine Status */}
                {!isLoaded && !error && (
                    <div className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 text-sm font-medium">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Initializing WebAssembly Engine...
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
                    className={`border-2 border-dashed border-purple-300 dark:border-purple-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-purple-50/50 dark:bg-purple-900/10 transition-colors ${isLoaded ? 'hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer' : 'opacity-50 pointer-events-none'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <AudioLines className="w-10 h-10 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload a Video</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            We will extract the audio track and convert it to your selected format locally.
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        
                        {/* File Info */}
                        <div className="flex items-center space-x-4 mb-8 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                                <Film className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">Ready for extraction</span>
                            </div>
                            <Button variant="secondary" onClick={() => { setFile(null); setAudioUrl(""); }} size="sm">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {!audioUrl && !isProcessing && (
                            <div className="flex flex-col w-full max-w-sm items-center space-y-6">
                                <div className="w-full space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Target Audio Format</label>
                                    <select
                                        value={audioFormat}
                                        onChange={(e) => setAudioFormat(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option value="mp3">.MP3 (Standard Audio)</option>
                                        <option value="wav">.WAV (Lossless Uncompressed)</option>
                                        <option value="aac">.AAC (Advanced Audio)</option>
                                    </select>
                                </div>

                                <Button 
                                    variant="primary" 
                                    onClick={extractAudio}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-lg"
                                >
                                    <AudioLines className="w-5 h-5 mr-2" />
                                    Extract Audio Track
                                </Button>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="flex flex-col items-center justify-center py-10 w-full">
                                <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mb-6" />
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Extracting Audio Streams...</h4>
                                <div className="w-full max-w-sm h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                                    <div 
                                        className="h-full bg-purple-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {audioUrl && !isProcessing && (
                            <div className="flex flex-col items-center justify-center p-8 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-2xl w-full mt-4 animation-fade-in">
                                <Music className="w-16 h-16 text-purple-600 dark:text-purple-400 mb-6" />
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Extraction Complete!</h4>
                                
                                <audio src={audioUrl} controls className="w-full max-w-md mb-8" />
                                
                                <Button 
                                    variant="primary" 
                                    onClick={downloadAudio}
                                    className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    Download Audio <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
