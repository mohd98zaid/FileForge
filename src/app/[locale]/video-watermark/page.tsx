"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Video, Image as ImageIcon, Trash2, Download, RefreshCw, Eye } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoWatermarkTool() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [outputUrl, setOutputUrl] = useState<string>("");
    
    // Position
    const [position, setPosition] = useState("W-w-10:H-h-10"); // Bottom Right default
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    
    const ffmpegRef = useRef(new FFmpeg());

    useEffect(() => {
        loadFfmpeg();
    }, []);

    const loadFfmpeg = async () => {
        try {
            const ffmpeg = ffmpegRef.current;
            ffmpeg.on("progress", ({ progress }) => { setProgress(Math.round(progress * 100)); });
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setIsLoaded(true);
        } catch (err) {
            setError("Failed to load processing engine.");
        }
    };

    const applyWatermark = async () => {
        if (!videoFile || !imageFile || !isLoaded) return;
        setIsProcessing(true);
        setError("");
        setOutputUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            const inputVidName = "vid.mp4";
            const inputImgName = "img.png";
            const outputName = "output.mp4";

            await ffmpeg.writeFile(inputVidName, await fetchFile(videoFile));
            await ffmpeg.writeFile(inputImgName, await fetchFile(imageFile));

            await ffmpeg.exec([
                "-i", inputVidName,
                "-i", inputImgName,
                "-filter_complex", `overlay=${position}`,
                "-codec:a", "copy",
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
            setOutputUrl(url);

            await ffmpeg.deleteFile(inputVidName);
            await ffmpeg.deleteFile(inputImgName);
        } catch (err) {
            console.error(err);
            setError("Failed to apply watermark.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout title="Video Watermarker" description="Stamp your logos or images onto any video flawlessly.">
            <div className="max-w-4xl mx-auto space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Video Upload */}
                    <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50">
                        <Video className="w-10 h-10 text-indigo-400 mb-2" />
                        {videoFile ? (
                            <div className="text-center w-full">
                                <p className="font-semibold truncate">{videoFile.name}</p>
                                <Button variant="secondary" onClick={() => setVideoFile(null)} className="mt-2 text-red-500">Remove</Button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold mb-2">1. Upload Video</h3>
                                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                            </>
                        )}
                    </div>
                    
                    {/* Logo Upload */}
                    <div className="border-2 border-dashed border-sky-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50">
                        <ImageIcon className="w-10 h-10 text-sky-400 mb-2" />
                        {imageFile ? (
                            <div className="text-center w-full">
                                <p className="font-semibold truncate">{imageFile.name}</p>
                                <Button variant="secondary" onClick={() => setImageFile(null)} className="mt-2 text-red-500">Remove</Button>
                            </div>
                        ) : (
                            <>
                                <h3 className="font-bold mb-2">2. Upload Watermark (PNG)</h3>
                                <input type="file" accept="image/png" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                            </>
                        )}
                    </div>
                </div>

                {videoFile && imageFile && !outputUrl && !isProcessing && (
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <label className="font-semibold">Watermark Position</label>
                        <select value={position} onChange={(e) => setPosition(e.target.value)} className="w-full p-3 border rounded-lg">
                            <option value="W-w-10:H-h-10">Bottom Right</option>
                            <option value="10:H-h-10">Bottom Left</option>
                            <option value="W-w-10:10">Top Right</option>
                            <option value="10:10">Top Left</option>
                            <option value="(W-w)/2:(H-h)/2">Center</option>
                        </select>
                        <Button onClick={applyWatermark} className="w-full py-3 bg-indigo-600 text-white rounded-lg">Apply Watermark</Button>
                    </div>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center py-10">
                        <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                        <div className="w-full h-2 bg-slate-100 rounded-full mt-2 max-w-sm">
                            <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-2 text-slate-500">{progress}% Processing...</p>
                    </div>
                )}

                {outputUrl && !isProcessing && (
                    <div className="flex flex-col items-center p-6 bg-indigo-50 rounded-xl">
                        <h4 className="font-bold text-lg mb-4">Watermarked Video Ready</h4>
                        <video src={outputUrl} controls className="w-full max-w-lg rounded-lg shadow-md mb-4" />
                        <a href={outputUrl} download="watermarked.mp4" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
                            <Download className="w-4 h-4" /> Download Video
                        </a>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
