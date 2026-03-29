"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Activity, Play, Pause, UploadCloud, Trash2 } from "lucide-react";

export default function AudioVisualizerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const requestRef = useRef<number>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (!selected.type.startsWith("audio/")) return alert("Audio files only");

        setFile(selected);
        setIsPlaying(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const setupAudioContext = () => {
        if (!audioRef.current || audioCtxRef.current) return;
        
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        const source = audioCtx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const analyser = analyserRef.current;
        
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            requestRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? 'rgb(20, 20, 30)' : 'rgb(248, 250, 252)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                const r = barHeight + (25 * (i / bufferLength));
                const g = 100 * (i / bufferLength);
                const b = 250;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    };

    const togglePlay = async () => {
        if (!audioRef.current) return;

        setupAudioContext();

        if (audioCtxRef.current?.state === "suspended") {
            await audioCtxRef.current.resume();
        }

        if (isPlaying) {
            audioRef.current.pause();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        } else {
            audioRef.current.play();
            drawVisualizer();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            audioCtxRef.current?.close();
        };
    }, []);

    return (
        <ToolLayout
            title="Audio Visualizer"
            description="Create engaging frequency bar visualizations Reacting directly to your music."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
                {!file ? (
                    <div 
                        className="border-2 border-dashed border-cyan-300 dark:border-cyan-700/50 rounded-2xl p-16 flex flex-col items-center justify-center bg-cyan-50/50 dark:bg-cyan-900/10 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer w-full"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Activity className="w-16 h-16 text-cyan-500 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Upload Track to Visualize</h3>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-slate-900 rounded-3xl p-6 w-full shadow-2xl relative overflow-hidden group border border-slate-800">
                        {/* Audio Element Hidden */}
                        <audio 
                            ref={audioRef} 
                            src={URL.createObjectURL(file)} 
                            onEnded={() => setIsPlaying(false)}
                            crossOrigin="anonymous" 
                        />
                        
                        <div className="flex items-center justify-between mb-6 z-10 relative">
                            <span className="text-cyan-400 font-medium truncate px-4">{file.name}</span>
                            <Button variant="secondary" onClick={() => { setFile(null); setIsPlaying(false); }}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Canvas */}
                        <div className="w-full h-80 bg-slate-800/50 rounded-2xl flex items-center justify-center overflow-hidden mb-6 relative z-10">
                            <canvas ref={canvasRef} width="800" height="300" className="w-full h-full" />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                                    <Button onClick={togglePlay} className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                                        <Play className="w-8 h-8 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 z-10 relative">
                            <Button onClick={togglePlay} variant="secondary" className="w-16 h-16 rounded-full flex items-center justify-center border-slate-700 text-cyan-400 hover:text-cyan-300">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
