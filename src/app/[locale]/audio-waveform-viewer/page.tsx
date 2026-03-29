"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { AudioLines, Trash2, UploadCloud } from "lucide-react";

export default function AudioWaveformViewerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (!selected.type.startsWith("audio/")) {
            alert("Please upload a valid audio file.");
            return;
        }

        setFile(selected);
        setIsProcessing(true);

        const arrayBuffer = await selected.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            drawWaveform(audioBuffer);
        } catch (err) {
            console.error("Failed to decode audio", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const drawWaveform = (audioBuffer: AudioBuffer) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Set dimensions
        canvas.width = container.clientWidth * 2; // Retina display sharpness
        canvas.height = 300 * 2;
        canvas.style.width = '100%';
        canvas.style.height = '300px';

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rawData = audioBuffer.getChannelData(0); // Only process first channel for visualization
        const samples = canvas.width / 4; // Number of bars to draw
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];

        for (let i = 0; i < samples; i++) {
            let blockStart = blockSize * i;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(rawData[blockStart + j]); 
            }
            filteredData.push(sum / blockSize);
        }

        const multiplier = Math.pow(Math.max(...filteredData), -1);
        const normalizedData = filteredData.map(n => n * multiplier);

        // Styling
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') ? 'rgb(30,30,30)' : '#f8fafc'; // Clear background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw center line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.lineCap = "round";

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#6366f1'); // Indigo 500
        gradient.addColorStop(1, '#a855f7'); // Purple 500
        ctx.strokeStyle = gradient;

        for (let i = 0; i < normalizedData.length; i++) {
            const x = i * 4 * 1.5;
            const height = normalizedData[i] * (canvas.height / 2) * 0.9;
            if (height > 0) {
                ctx.beginPath();
                ctx.moveTo(x, (canvas.height / 2) - height);
                ctx.lineTo(x, (canvas.height / 2) + height);
                ctx.stroke();
            }
        }
    };

    return (
        <ToolLayout
            title="Audio Waveform Viewer"
            description="Visually inspect the waveform peaks and troughs of your audio files."
           
        >
            <div className="max-w-5xl mx-auto flex flex-col space-y-8">
                {!file ? (
                    <div 
                        className="border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 rounded-2xl p-16 flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <AudioLines className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload Audio File</h3>
                        <p className="text-slate-500 text-sm">MP3, WAV, OGG supported</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                        <div className="flex items-center space-x-4 mb-8 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <AudioLines className="w-8 h-8 text-indigo-600" />
                            <div className="flex-1 min-w-0">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                            </div>
                            <Button variant="secondary" onClick={() => { setFile(null); }}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {isProcessing && <div className="py-20 text-indigo-500 animate-pulse font-medium text-lg">Decoding audio data...</div>}

                        <div ref={containerRef} className={`w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-black/20 ${isProcessing && 'hidden'}`}>
                            <canvas ref={canvasRef} className="block w-full" />
                        </div>

                        {!isProcessing && (
                            <div className="w-full mt-6 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
                                <audio controls src={URL.createObjectURL(file)} className="w-full max-w-2xl" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
