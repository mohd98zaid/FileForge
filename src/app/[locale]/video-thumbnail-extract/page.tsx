"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, Video, Trash2, RefreshCw, Download } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import JSZip from "jszip";

export default function VideoThumbnailExtractorTool() {
    const [file, setFile] = useState<File | null>(null);
    const [frames, setFrames] = useState<string[]>([]);
    const [intervalSeconds, setIntervalSeconds] = useState("5");
    
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
            setError("Failed to load engine.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setFrames([]);
    };

    const extractThumbnails = async () => {
        if (!file || !isLoaded) return;
        setIsProcessing(true);
        setFrames([]);
        setError("");

        try {
            const ffmpeg = ffmpegRef.current;
            const inputName = "input.mp4";
            
            await ffmpeg.writeFile(inputName, await fetchFile(file));

            const intv = parseFloat(intervalSeconds) || 5;
            
            // Generate frames using fps filter. e.g. 1 frame every 5 secs = fps=1/5
            await ffmpeg.exec([
                "-i", inputName,
                "-vf", `fps=1/${intv}`,
                "frame_%04d.jpg"
            ]);

            // Read the generated frames
            const fileList = await ffmpeg.listDir(".");
            const generatedFrames = fileList.filter((f) => f.name.startsWith("frame_") && f.name.endsWith(".jpg"));
            
            const urls: string[] = [];
            for (const f of generatedFrames) {
                const data = await ffmpeg.readFile(f.name);
                const url = URL.createObjectURL(new Blob([data as any], { type: "image/jpeg" }));
                urls.push(url);
                // Clean up ffmpeg FS to save memory
                await ffmpeg.deleteFile(f.name);
            }
            
            setFrames(urls);
        } catch (err: any) {
            console.error(err);
            setError("Extraction failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadZip = async () => {
        const zip = new JSZip();
        for (let i = 0; i < frames.length; i++) {
            const res = await fetch(frames[i]);
            const blob = await res.blob();
            zip.file(`thumbnail_${i+1}.jpg`, blob);
        }
        zip.generateAsync({ type: "blob" }).then(content => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = `thumbnails_${file?.name}.zip`;
            link.click();
        });
    };

    return (
        <ToolLayout
            title="Video Thumbnail Extractor"
            description="Extract high-quality still frames from any video at specific intervals."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                {error && <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>}

                {!file ? (
                    <div 
                        className={`border-2 border-dashed border-sky-300 rounded-2xl p-12 flex flex-col items-center justify-center bg-sky-50 transition-colors ${isLoaded ? 'hover:bg-sky-100 cursor-pointer' : 'opacity-50'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="w-16 h-16 text-sky-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Upload Video</h3>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" disabled={!isLoaded} />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-sm border flex flex-col items-center w-full">
                        <div className="flex items-center space-x-4 mb-6 w-full p-4 bg-slate-50 rounded-xl">
                            <Video className="w-8 h-8 text-sky-600" />
                            <span className="font-semibold flex-1 truncate">{file.name}</span>
                            <Button variant="secondary" onClick={() => { setFile(null); setFrames([]); }}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {frames.length === 0 && !isProcessing && (
                            <div className="w-full max-w-sm space-y-4">
                                <div>
                                    <label className="text-sm font-semibold">Extract 1 frame every X seconds</label>
                                    <input 
                                        type="number" min="1"
                                        value={intervalSeconds}
                                        onChange={(e) => setIntervalSeconds(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-xl mt-1"
                                    />
                                </div>
                                <Button onClick={extractThumbnails} className="w-full py-3 bg-sky-600 text-white rounded-xl">
                                    Extract Frames
                                </Button>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="flex flex-col items-center py-10">
                                <RefreshCw className="w-10 h-10 text-sky-500 animate-spin mb-4" />
                                <div className="w-full h-2 bg-slate-100 rounded-full mt-2 w-64">
                                    <div className="h-full bg-sky-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="mt-2 text-sm text-slate-500">{progress}%</p>
                            </div>
                        )}

                        {frames.length > 0 && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold">Extracted {frames.length} frames</h4>
                                    <Button onClick={downloadZip} className="bg-sky-600 text-white gap-2">
                                        <Download className="w-4 h-4" /> Download ZIP
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {frames.map((url, i) => (
                                        <div key={i} className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                                            <img src={url} alt={`Frame ${i}`} className="w-full h-full object-cover" />
                                            <a href={url} download={`frame_${i+1}.jpg`} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                <Download className="w-6 h-6" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
