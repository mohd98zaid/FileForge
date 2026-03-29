"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Video, FileText, Download, RefreshCw, Trash2, Subtitles } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function BurnSubtitlesTool() {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [subFile, setSubFile] = useState<File | null>(null);
    const [outputUrl, setOutputUrl] = useState<string>("");
    
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

    const burnSubs = async () => {
        if (!videoFile || !subFile || !isLoaded) return;
        setIsProcessing(true);
        setError("");
        setOutputUrl("");
        setProgress(0);

        try {
            const ffmpeg = ffmpegRef.current;
            
            await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));
            await ffmpeg.writeFile("subs.srt", await fetchFile(subFile));

            await ffmpeg.exec([
                "-i", "input.mp4",
                "-vf", "subtitles=subs.srt",
                "-c:a", "copy",
                "output.mp4"
            ]);

            const data = await ffmpeg.readFile("output.mp4");
            const url = URL.createObjectURL(new Blob([data as any], { type: "video/mp4" }));
            setOutputUrl(url);

        } catch (err) {
            console.error(err);
            setError("Subtitle burning failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout title="Burn Subtitles to Video" description="Permanently encode (hardcode) SRT subtitles into your videos.">
            <div className="max-w-4xl mx-auto space-y-8">
                {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl">{error}</div>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-violet-200 rounded-xl p-6 bg-slate-50 text-center">
                        <Video className="w-10 h-10 text-violet-400 mx-auto mb-2" />
                        <h3 className="font-bold mb-4">Upload Video (MP4)</h3>
                        <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                    </div>
                    
                    <div className="border border-fuchsia-200 rounded-xl p-6 bg-slate-50 text-center">
                        <Subtitles className="w-10 h-10 text-fuchsia-400 mx-auto mb-2" />
                        <h3 className="font-bold mb-4">Upload Subtitles (SRT)</h3>
                        <input type="file" accept=".srt" onChange={(e) => setSubFile(e.target.files?.[0] || null)} className="text-sm" disabled={!isLoaded} />
                    </div>
                </div>

                {videoFile && subFile && !outputUrl && !isProcessing && (
                    <div className="bg-white p-6 rounded-xl border flex flex-col items-center">
                        <Button onClick={burnSubs} className="w-full bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-xl font-bold text-lg">
                            Hardcode Subtitles
                        </Button>
                    </div>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center py-10">
                        <RefreshCw className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                        <h4 className="font-semibold text-slate-700">Encoding Video... this will take some time.</h4>
                        <div className="w-full h-3 bg-slate-100 rounded-full max-w-sm mt-4 overflow-hidden border">
                            <div className="h-full bg-violet-500" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mt-2 text-sm font-medium">{progress}% Complete</p>
                    </div>
                )}

                {outputUrl && (
                    <div className="p-8 bg-violet-50 border border-violet-100 rounded-2xl text-center flex flex-col items-center">
                        <h3 className="text-xl font-bold mb-6 text-violet-900">Encoding Successful!</h3>
                        <video src={outputUrl} controls className="max-w-md w-full rounded-lg shadow-xl mb-6" />
                        <a href={outputUrl} download={`subbed_${videoFile?.name}`} className="px-8 py-3 bg-violet-600 hover:bg-violet-700 transition shadow-lg text-white rounded-xl font-bold flex gap-2">
                            <Download className="w-5 h-5"/> Download Video
                        </a>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
