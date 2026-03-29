"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Video, Image as ImageIcon, Download, RefreshCw } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function VideoGreenScreenTool() {
    const [fgVideo, setFgVideo] = useState<File | null>(null);
    const [bgImage, setBgImage] = useState<File | null>(null);
    const [outputUrl, setOutputUrl] = useState<string>("");
    
    // Chroma Key details
    const [colorHex, setColorHex] = useState("#00FF00");
    const [similarity, setSimilarity] = useState("0.1");
    const [blend, setBlend] = useState("0.05");
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    
    const ffmpegRef = useRef(new FFmpeg());

    useEffect(() => { loadFfmpeg(); }, []);

    const loadFfmpeg = async () => {
        try {
            const ffmpeg = ffmpegRef.current;
            ffmpeg.on("progress", ({ progress }) => setProgress(Math.round(progress * 100)));
            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setIsLoaded(true);
        } catch (err) { setError("Failed to load engine."); }
    };

    const processGreenScreen = async () => {
        if (!fgVideo || !bgImage || !isLoaded) return;
        setIsProcessing(true);
        setError("");
        setOutputUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            
            await ffmpeg.writeFile("fg.mp4", await fetchFile(fgVideo));
            await ffmpeg.writeFile("bg.png", await fetchFile(bgImage));

            const cleanHex = colorHex.replace('#', '0x');
            // Filter: chromakey the FG, then overlay it on the BG.
            const filterGraph = `[0:v]chromakey=${cleanHex}:${similarity}:${blend}[ckout];[1:v][ckout]overlay[outv]`;

            await ffmpeg.exec([
                "-i", "fg.mp4",
                "-i", "bg.png",
                "-filter_complex", filterGraph,
                "-map", "[outv]",
                "-map", "0:a?", // copy audio if exists
                "-c:a", "copy",
                "output.mp4"
            ]);

            const data = await ffmpeg.readFile("output.mp4");
            const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
            setOutputUrl(url);

        } catch (err) {
            console.error(err);
            setError("Chroma key processing failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout title="Green Screen Editor" description="Remove green (or any color) screen from video and replace the background.">
            <div className="max-w-4xl mx-auto space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-green-200 rounded-xl p-6 bg-slate-50 text-center">
                        <h3 className="font-bold mb-4">1. Green Screen Video</h3>
                        <input type="file" accept="video/*" onChange={(e) => setFgVideo(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                    </div>
                    
                    <div className="border border-indigo-200 rounded-xl p-6 bg-slate-50 text-center">
                        <h3 className="font-bold mb-4">2. Background Image</h3>
                        <input type="file" accept="image/*" onChange={(e) => setBgImage(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                    </div>
                </div>

                {fgVideo && bgImage && !outputUrl && !isProcessing && (
                    <div className="bg-white p-6 rounded-xl border space-y-4">
                        <h3 className="font-bold">Chroma Key Settings</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs">Color Hex</label>
                                <input type="color" value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="w-full h-10 border rounded-lg" />
                            </div>
                            <div>
                                <label className="text-xs">Similarity</label>
                                <input type="number" step="0.01" value={similarity} onChange={(e) => setSimilarity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="text-xs">Blend</label>
                                <input type="number" step="0.01" value={blend} onChange={(e) => setBlend(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <Button onClick={processGreenScreen} className="w-full bg-green-600 text-white mt-4">Composite Video</Button>
                    </div>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center py-10">
                        <RefreshCw className="w-10 h-10 text-green-500 animate-spin mb-4" />
                        <div className="w-full h-2 bg-slate-100 rounded-full max-w-sm"><div className="h-full bg-green-500" style={{ width: `${progress}%` }} /></div>
                    </div>
                )}

                {outputUrl && (
                    <div className="p-6 bg-green-50 rounded-xl text-center flex flex-col items-center">
                        <video src={outputUrl} controls className="max-w-md w-full rounded shadow-md mb-4" />
                        <a href={outputUrl} download="chromakey.mp4" className="px-6 py-2 bg-green-600 text-white rounded-lg flex gap-2"><Download className="w-4 h-4"/> Download</a>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
