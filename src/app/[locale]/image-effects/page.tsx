"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Download, UploadCloud, RefreshCw, SlidersHorizontal } from "lucide-react";

export default function ImageEffectsTool() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        sepia: 0,
        grayscale: 0,
        blur: 0,
        hue: 0,
    });

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            setImage(img);
            resetFilters();
        };
        img.src = url;
    };

    useEffect(() => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Auto scale canvas keeping aspect ratio and max width 800
        const scale = Math.min(800 / image.width, 600 / image.height, 1);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        ctx.filter = `
            brightness(${filters.brightness}%) 
            contrast(${filters.contrast}%) 
            saturate(${filters.saturation}%) 
            sepia(${filters.sepia}%) 
            grayscale(${filters.grayscale}%) 
            blur(${filters.blur}px) 
            hue-rotate(${filters.hue}deg)
        `;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }, [image, filters]);

    const resetFilters = () => {
        setFilters({ brightness: 100, contrast: 100, saturation: 100, sepia: 0, grayscale: 0, blur: 0, hue: 0 });
    };

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `edited_image_${Date.now()}.png`;
        link.click();
    };

    return (
        <ToolLayout title="Image Effects Studio" description="Apply beautiful color filters, adjust brightness, blur, and export high quality images.">
            <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8">
                
                {/* Editor Sidebar */}
                <div className="md:col-span-4 bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-6 h-fit max-h-[800px] overflow-y-auto">
                    <div className="flex justify-between items-center pb-4 border-b">
                        <h3 className="font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-indigo-500"/> Adjustments</h3>
                        <Button variant="secondary" size="sm" onClick={resetFilters}><RefreshCw className="w-4 h-4 mr-2"/> Reset</Button>
                    </div>

                    {[
                        { key: "brightness", label: "Brightness", icon: "☀️", min: 0, max: 200, unit: "%" },
                        { key: "contrast", label: "Contrast", icon: "🌓", min: 0, max: 200, unit: "%" },
                        { key: "saturation", label: "Saturation", icon: "🌈", min: 0, max: 200, unit: "%" },
                        { key: "sepia", label: "Sepia", icon: "🟫", min: 0, max: 100, unit: "%" },
                        { key: "grayscale", label: "Grayscale", icon: "⚪", min: 0, max: 100, unit: "%" },
                        { key: "blur", label: "Blur", icon: "💧", min: 0, max: 20, unit: "px" },
                        { key: "hue", label: "Hue Rotate", icon: "🎨", min: 0, max: 360, unit: "°" },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="text-sm font-semibold flex justify-between mb-2 text-slate-700 dark:text-slate-300">
                                <span>{f.icon} {f.label}</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{(filters as any)[f.key]}{f.unit}</span>
                            </label>
                            <input 
                                type="range" 
                                min={f.min} 
                                max={f.max} 
                                value={(filters as any)[f.key]} 
                                onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    ))}

                    <div className="pt-6 mt-6 border-t flex flex-col gap-3">
                        {!image ? (
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full font-bold py-4">
                                <UploadCloud className="w-5 h-5 mr-2"/> Upload Photo
                            </Button>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full">
                                    Change Photo
                                </Button>
                                <Button onClick={downloadImage} className="w-full font-bold py-4 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30">
                                    <Download className="w-5 h-5 mr-2"/> Download Edited Image
                                </Button>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="md:col-span-8 bg-slate-50 dark:bg-slate-900 border rounded-2xl min-h-[500px] flex items-center justify-center overflow-hidden relative shadow-inner p-4">
                    {!image ? (
                        <div className="text-center text-slate-400 flex flex-col items-center">
                            <UploadCloud className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-medium">Upload an image to start editing</p>
                        </div>
                    ) : (
                        <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded drop-shadow-2xl border bg-transparent" />
                    )}
                </div>

            </div>
        </ToolLayout>
    );
}
