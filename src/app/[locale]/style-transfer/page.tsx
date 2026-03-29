"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Download, UploadCloud, Paintbrush, Loader2 } from "lucide-react";

export default function StyleTransferTool() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [style, setStyle] = useState<"none" | "sketch" | "cyberpunk" | "vintage" | "popart" | "dream">("none");
    const [isProcessing, setIsProcessing] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImage(img);
            setStyle("none");
        };
        img.src = url;
    };

    useEffect(() => {
        applyStyle();
    }, [image, style]);

    const applyStyle = () => {
        if (!image || !canvasRef.current) return;
        setIsProcessing(true);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Auto scale canvas
        const scale = Math.min(800 / image.width, 600 / image.height, 1);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        // Reset
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        setTimeout(() => {
            // Apply simulated artistic styles using Canvas Compositing & Filtering
            if (style === "sketch") {
                // Pencil sketch approximation
                ctx.filter = 'grayscale(100%) contrast(120%)';
                ctx.drawImage(canvas, 0, 0);
                ctx.globalCompositeOperation = 'color-dodge';
                ctx.filter = 'invert(100%) blur(4px)';
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over'; // reset
            } 
            else if (style === "cyberpunk") {
                ctx.filter = 'contrast(150%) saturate(200%) hue-rotate(280deg)';
                ctx.drawImage(canvas, 0, 0);
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
            }
            else if (style === "vintage") {
                ctx.filter = 'sepia(80%) contrast(110%) brightness(90%)';
                ctx.drawImage(canvas, 0, 0);
                ctx.fillStyle = 'rgba(139, 69, 19, 0.2)'; // overlay brown
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
            }
            else if (style === "popart") {
                ctx.filter = 'contrast(250%) saturate(300%) grayscale(20%) hue-rotate(45deg)';
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
            else if (style === "dream") {
                ctx.filter = 'blur(2px) contrast(110%) brightness(110%) saturate(150%)';
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'lighten';
                ctx.filter = 'blur(10px) opacity(60%) hue-rotate(30deg)';
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'source-over';
            }
            
            setIsProcessing(false);
        }, 100); // Slight delay for UI to paint "processing" state
    };

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `styled_${style}_${Date.now()}.png`;
        link.click();
    };

    return (
        <ToolLayout title="Artistic Style Transfer" description="Transform your photos into stunning artworks using algorithmic visual filters.">
            <div className="max-w-6xl mx-auto space-y-8 flex flex-col items-center">
                
                {!image && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-2xl border-2 border-dashed border-indigo-300 rounded-3xl p-20 flex flex-col items-center justify-center bg-indigo-50/50 hover:bg-indigo-100/50 cursor-pointer transition-colors"
                    >
                        <UploadCloud className="w-20 h-20 text-indigo-400 mb-6" />
                        <h3 className="text-3xl font-bold mb-3 text-slate-800">Upload Portrait or Landscape</h3>
                        <p className="text-slate-500 font-medium">JPEG, PNG or WEBP</p>
                        <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
                    </div>
                )}

                {image && (
                    <div className="w-full flex flex-col items-center">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 max-w-4xl w-full">
                            <canvas ref={canvasRef} className="w-full h-auto block" />
                            {isProcessing && (
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border max-w-4xl w-full">
                            <h4 className="w-full text-center font-bold text-slate-500 uppercase text-sm mb-2 flex items-center justify-center gap-2">
                                <Paintbrush className="w-4 h-4"/> Choose Art Filter
                            </h4>
                            
                            {[
                                { id: "none", label: "Original", gradient: "from-slate-200 to-slate-300" },
                                { id: "sketch", label: "Pencil Sketch", gradient: "from-slate-400 to-slate-800" },
                                { id: "cyberpunk", label: "Cyberpunk", gradient: "from-fuchsia-500 to-cyan-500" },
                                { id: "vintage", label: "Vintage Sepia", gradient: "from-amber-700 to-orange-900" },
                                { id: "popart", label: "Pop Art", gradient: "from-rose-400 to-yellow-400" },
                                { id: "dream", label: "Dream Haze", gradient: "from-indigo-300 to-purple-400" },
                            ].map((s) => (
                                <button 
                                    key={s.id}
                                    onClick={() => setStyle(s.id as any)}
                                    className={`relative overflow-hidden px-6 py-3 rounded-xl font-bold text-white shadow-sm transition-all hover:-translate-y-1 ${style === s.id ? 'ring-4 ring-indigo-500 ring-offset-2' : 'opacity-90 hover:opacity-100'}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} ${style === s.id ? 'opacity-100' : 'opacity-80'}`} />
                                    <span className="relative z-10 drop-shadow-md">{s.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="px-8 py-4 font-bold rounded-xl">
                                Upload New Image
                            </Button>
                            <Button onClick={downloadImage} className="px-8 py-4 font-bold rounded-xl bg-indigo-600 text-white gap-2 shadow-lg hover:bg-indigo-700">
                                <Download className="w-5 h-5" /> Download Stylized Image
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
