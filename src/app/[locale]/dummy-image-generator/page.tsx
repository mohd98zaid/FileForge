"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, Download, Image as ImageIcon } from "lucide-react";

export default function DummyImageGeneratorTool() {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [bgColor, setBgColor] = useState("#cccccc");
    const [textColor, setTextColor] = useState("#333333");
    const [text, setText] = useState("");
    const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [renderedUrl, setRenderedUrl] = useState("");

    useEffect(() => {
        drawPreview();
    }, [width, height, bgColor, textColor, text, format]);

    const drawPreview = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = width || 800;
        canvas.height = height || 600;

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let displayText = text || `${canvas.width} x ${canvas.height}`;
        
        // Auto-scale text
        let fontSize = Math.min(canvas.width, canvas.height) / 8;
        ctx.font = `bold ${fontSize}px sans-serif`;
        
        ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);
        
        setRenderedUrl(canvas.toDataURL(`image/${format}`, 0.9));
    };

    return (
        <ToolLayout title="Dummy Image Generator" description="Generate placeholder colored images instantly for your mockups or websites.">
            <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10">
                {/* Side Controls */}
                <div className="md:col-span-4 space-y-6 bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Width (px)</label>
                            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Height (px)</label>
                            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Background</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 cursor-pointer rounded overflow-hidden" />
                                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Text Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 cursor-pointer rounded overflow-hidden" />
                                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Format</label>
                        <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WEBP</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-1 block">Custom Text (Optional)</label>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Placeholder" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <a href={renderedUrl} download={`placeholder-${width}x${height}.${format}`} className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl mt-4">
                        <Download className="w-5 h-5"/> Download Image
                    </a>
                </div>

                {/* Preview Window */}
                <div className="md:col-span-8 flex flex-col items-center justify-center p-12 bg-slate-50 border rounded-2xl overflow-hidden min-h-[500px]">
                    {/* Hidden canvas used for rendering */}
                    <canvas ref={canvasRef} className="hidden" />
                    
                    <div className="relative shadow-2xl transition-all w-full flex items-center justify-center overflow-auto max-h-[600px]">
                        <img src={renderedUrl} alt="Preview" className="max-w-full rounded border border-slate-200" style={{ maxHeight: '100%' }} />
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
