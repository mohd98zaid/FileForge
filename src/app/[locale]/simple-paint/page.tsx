"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Paintbrush, Eraser, Download, Trash2, Undo } from "lucide-react";

export default function SimplePaintTool() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#4f46e5");
    const [lineWidth, setLineWidth] = useState(5);
    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const [history, setHistory] = useState<ImageData[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                saveHistory();
            }
        }
    }, []);

    const saveHistory = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setHistory(prev => [...prev.slice(-10), data]); // save last 10 steps
        }
    };

    const undo = () => {
        if (history.length > 1) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (canvas && ctx) {
                const prev = history[history.length - 2];
                ctx.putImageData(prev, 0, 0);
                setHistory(history.slice(0, -1));
            }
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveHistory();
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) ctx.beginPath();
        saveHistory();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const downloadImage = () => {
        const url = canvasRef.current?.toDataURL("image/png");
        if (url) {
            const link = document.createElement("a");
            link.href = url;
            link.download = `drawing_${Date.now()}.png`;
            link.click();
        }
    };

    return (
        <ToolLayout title="Simple Online Paint" description="A minimal digital canvas for quick sketches and diagrams.">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex flex-wrap gap-6 items-center shadow-sm">
                    {/* Tools */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => setTool("brush")} 
                            className={`p-3 rounded-lg flex items-center gap-2 ${tool === 'brush' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                            <Paintbrush className="w-5 h-5"/> <span className="hidden sm:inline">Brush</span>
                        </button>
                        <button 
                            onClick={() => setTool("eraser")} 
                            className={`p-3 rounded-lg flex items-center gap-2 ${tool === 'eraser' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                            <Eraser className="w-5 h-5"/> <span className="hidden sm:inline">Eraser</span>
                        </button>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-3 border-l pl-6 dark:border-slate-700">
                        <label className="text-sm font-semibold">Color:</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} disabled={tool === 'eraser'} className="w-10 h-10 rounded cursor-pointer" />
                    </div>

                    {/* Line Width */}
                    <div className="flex items-center gap-3 border-l pl-6 dark:border-slate-700 flex-1">
                        <label className="text-sm font-semibold">Thickness:</label>
                        <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full max-w-[150px]" />
                        <span className="text-xs text-slate-500 w-8">{lineWidth}px</span>
                    </div>

                    <div className="flex gap-2 border-l pl-6 dark:border-slate-700">
                        <Button variant="secondary" onClick={undo} disabled={history.length <= 1} title="Undo">
                            <Undo className="w-5 h-5" />
                        </Button>
                        <Button variant="secondary" onClick={clearCanvas} title="Clear Canvas" className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-100 flex justify-center p-4">
                    <canvas 
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchCancel={stopDrawing}
                        onTouchMove={draw}
                        className="bg-white rounded shadow-sm touch-none w-full max-w-4xl h-[600px] cursor-crosshair"
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={downloadImage} className="bg-indigo-600 text-white px-8 py-3 rounded-xl gap-2 font-bold shadow-lg hover:shadow-indigo-500/30">
                        <Download className="w-5 h-5" /> Export Sketch
                    </Button>
                </div>
            </div>
        </ToolLayout>
    );
}
