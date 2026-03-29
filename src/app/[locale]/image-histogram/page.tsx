"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "What does the histogram show?", questionHi: "हिस्टोग्राम क्या दिखाता है?", answer: "It shows the distribution of Red, Green, and Blue color intensities across your image.", answerHi: "यह आपकी छवि में लाल, हरे और नीले रंग की तीव्रता का वितरण दिखाता है।" },
];

export default function ImageHistogramPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Arrays for 256 intensity values (0-255)
    const [histR, setHistR] = useState<number[]>([]);
    const [histG, setHistG] = useState<number[]>([]);
    const [histB, setHistB] = useState<number[]>([]);
    const [maxCount, setMaxCount] = useState(0);
    
    const chartCanvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
    };

    useEffect(() => {
        if (!file) {
            setImage(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        if (!image) return;
        
        setIsLoading(true);
        
        // Use a hidden canvas to get pixel data
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        
        // Scale down large images for performance (histogram shape remains mostly same)
        const scale = Math.min(1, 800 / Math.max(image.width, image.height));
        canvas.width = Math.floor(image.width * scale);
        canvas.height = Math.floor(image.height * scale);
        
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        // Timeout to allow UI to show loading state if image processing takes time
        setTimeout(() => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const r = new Array(256).fill(0);
            const g = new Array(256).fill(0);
            const b = new Array(256).fill(0);
            let max = 0;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                
                r[red]++;
                g[green]++;
                b[blue]++;
            }

            // Find global maximum for scaling the chart
            for (let i = 0; i < 256; i++) {
                if (r[i] > max) max = r[i];
                if (g[i] > max) max = g[i];
                if (b[i] > max) max = b[i];
            }

            setHistR(r);
            setHistG(g);
            setHistB(b);
            setMaxCount(Math.max(max, 1));
            setIsLoading(false);
        }, 50);

    }, [image]);

    // Draw the chart on the visible canvas
    useEffect(() => {
        if (!chartCanvasRef.current || maxCount === 0) return;
        
        const canvas = chartCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set high-res canvas
        const w = canvas.parentElement?.clientWidth || 800;
        const h = 400;
        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);
        
        // Fill background
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, w, h);

        const drawChannel = (data: number[], color: string, isLine: boolean) => {
            ctx.beginPath();
            ctx.moveTo(0, h);
            
            for (let i = 0; i < 256; i++) {
                const x = (i / 255) * w;
                // scale logarithmically or linearly? Linearly is standard
                let normalizedY = data[i] / maxCount;
                // To prevent huge spikes from hiding everything else, we can cap or use power scale
                normalizedY = Math.pow(normalizedY, 0.7); 
                const y = h - (normalizedY * h);
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            
            ctx.fillStyle = color;
            ctx.fill();
        };

        // Draw RGB overlaps using global composite blending
        ctx.globalCompositeOperation = "screen";
        drawChannel(histR, "rgba(239, 68, 68, 0.7)", false);  // Red
        drawChannel(histG, "rgba(34, 197, 94, 0.7)", false);  // Green
        drawChannel(histB, "rgba(59, 130, 246, 0.7)", false); // Blue
        ctx.globalCompositeOperation = "source-over";

        // Draw grid lines
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for(let i=1; i<=3; i++) {
            ctx.moveTo(0, (h/4)*i);
            ctx.lineTo(w, (h/4)*i);
            ctx.moveTo((w/4)*i, 0);
            ctx.lineTo((w/4)*i, h);
        }
        ctx.stroke();

    }, [histR, histG, histB, maxCount]);

    return (
        <ToolLayout
            title={isHi ? "📊 छवि हिस्टोग्राम" : "📊 Image Histogram"}
            description={isHi ? "छवि के RGB रंग वितरण का विश्लेषण करें" : "Analyze the RGB color distribution and tonal range of your image"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "चित्र अपलोड करें" : "Upload Image"} />
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <span className="text-slate-300 font-medium truncate max-w-xs">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded">
                                {isHi ? "नया चित्र चुनें" : "Change Image"}
                            </button>
                        </div>

                        {isLoading && <div className="text-center py-10 text-indigo-400 animate-pulse">{isHi ? "विश्लेषण हो रहा है..." : "Analyzing pixels..."}</div>}

                        {!isLoading && maxCount > 0 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-full rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl overflow-hidden p-4">
                                    <div className="flex justify-between text-xs text-slate-500 mb-2 px-1">
                                        <span>0 (Shadows)</span>
                                        <span>128 (Midtones)</span>
                                        <span>255 (Highlights)</span>
                                    </div>
                                    <canvas ref={chartCanvasRef} className="w-full h-64 md:h-80 rounded"></canvas>
                                    <div className="flex justify-center gap-6 mt-4 opacity-80">
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm text-slate-300">Red</span></div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm text-slate-300">Green</span></div>
                                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm text-slate-300">Blue</span></div>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                     <img src={URL.createObjectURL(file)} alt="Preview" className="h-32 rounded border border-slate-700 opacity-60 hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
