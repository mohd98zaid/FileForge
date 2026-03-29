"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

export default function MakeTransparentPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [tolerance, setTolerance] = useState(30);
    const [targetColor, setTargetColor] = useState<{r: number, g: number, b: number} | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
        setTargetColor(null);
    };

    useEffect(() => {
        if (!file) { setImage(null); return; }
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        if (!canvasRef.current || !image) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        if (targetColor) {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];

                // Check distance
                const dist = Math.sqrt(
                    Math.pow(r - targetColor.r, 2) +
                    Math.pow(g - targetColor.g, 2) +
                    Math.pow(b - targetColor.b, 2)
                );

                if (dist <= tolerance) {
                    data[i+3] = 0; // Make transparent
                }
            }
            ctx.putImageData(imgData, 0, 0);
        }

    }, [image, targetColor, tolerance]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !image) return;
        
        // Find exact pixel clicked considering CSS scaling
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // If a target color is already applied, clicking again selects from the *original* image
        // To do this, we temporarily redraw the original image to pick the true color
        ctx.drawImage(image, 0, 0);
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        setTargetColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
        
        // The useEffect will instantly re-run and re-apply the transparency
    };

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transparent_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🧪 रंग पारदर्शी बनाएं" : "🧪 Make Color Transparent"}
            description={isHi ? "पारदर्शी बनाने के लिए छवि में किसी भी रंग पर क्लिक करें" : "Click on any color in your image to instantly make it transparent"}
            faqs={[{question: "How does this differ from Background Remover?", questionHi: "यह अलग कैसे है?", answer: "Background Remover uses AI to find the main subject. This tool allows you to manually pick a specific color (like a blue sky or green screen) to remove.", answerHi: "पृष्ठभूमि हटाने वाला मुख्य विषय खोजने के लिए एआई का उपयोग करता है। यह टूल आपको हटाने के लिए मैन्युअल रूप से एक विशिष्ट रंग चुनने की अनुमति देता है।"}]}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "पारदर्शिता सेटिंग्स" : "Transparency Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">Back</button>
                            </div>

                            {!targetColor && (
                                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm animate-pulse">
                                    {isHi ? "पारदर्शी बनाने के लिए दाईं ओर छवि पर क्लिक करें" : "👉 Click anywhere on the image to select a color to remove"}
                                </div>
                            )}

                            {targetColor && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-700">
                                        <div className="w-8 h-8 rounded border border-slate-600 shadow-inner" style={{backgroundColor: `rgb(${targetColor.r},${targetColor.g},${targetColor.b})`}}></div>
                                        <div className="text-sm">
                                            <div className="text-slate-300">{isHi ? "हटाया गया रंग" : "Removed Color"}</div>
                                            <div className="text-slate-500 font-mono text-xs">RGB({targetColor.r}, {targetColor.g}, {targetColor.b})</div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="flex justify-between text-sm text-slate-400 mb-2">
                                            <span>{isHi ? "सहनशीलता (Tolerance)" : "Tolerance"}</span>
                                            <span className="text-slate-200">{tolerance}</span>
                                        </label>
                                        <input type="range" min="0" max="255" value={tolerance} onChange={(e) => setTolerance(+e.target.value)} className="w-full accent-indigo-500" />
                                        <div className="text-xs text-slate-500 mt-1">{isHi ? "हटाने के लिए समान रंगों को शामिल करने के लिए बढ़ाएं" : "Increase to remove similar shades of the selected color"}</div>
                                    </div>

                                    <button onClick={() => setTargetColor(null)} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition-colors">
                                        {isHi ? "रीसेट करें" : "Reset Selection"}
                                    </button>
                                </div>
                            )}

                            <DownloadButton onClick={handleDownload} label={isHi ? "PNG डाउनलोड करें" : "Download PNG"} className="w-full mt-4" disabled={!targetColor} />
                        </div>

                        <div ref={containerRef} className="lg:col-span-8 flex justify-center bg-transparent rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center relative overflow-hidden checkerboard-bg"
                            style={{backgroundImage: "repeating-linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), repeating-linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 75%, #1e293b 75%, #1e293b)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px"}}
                        >
                            <canvas 
                                ref={canvasRef} 
                                onClick={handleCanvasClick}
                                className={`max-w-full h-auto shadow-2xl rounded drop-shadow-2xl ${!targetColor ? "cursor-crosshair" : "cursor-pointer"}`} 
                                style={{ maxHeight: "60vh" }}
                            ></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
