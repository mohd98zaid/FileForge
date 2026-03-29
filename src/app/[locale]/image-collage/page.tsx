"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "How many images can I add?", questionHi: "मैं कितनी छवियाँ जोड़ सकता हूँ?", answer: "You can upload up to 9 images for a collage.", answerHi: "आप कोलाज के लिए अधिकतम 9 छवियाँ अपलोड कर सकते हैं।" },
    { question: "Does this upload my photos?", questionHi: "क्या यह मेरी तस्वीरें अपलोड करता है?", answer: "No, all processing happens locally in your browser. Your images are safe and private.", answerHi: "नहीं, सभी प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से होती है। आपकी छवियाँ सुरक्षित और निजी हैं।" },
    { question: "Can I customize the gap and background?", questionHi: "क्या मैं गैप और पृष्ठभूमि को अनुकूलित कर सकता हूँ?", answer: "Yes, use the sliders to adjust spacing and pick any background color.", answerHi: "हाँ, रिक्ति को समायोजित करने के लिए स्लाइडर का उपयोग करें और कोई भी पृष्ठभूमि रंग चुनें।" },
];

export default function ImageCollagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [gap, setGap] = useState(10);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [columns, setColumns] = useState(2);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        const newFiles = [...files, ...f].slice(0, 9);
        setFiles(newFiles);
    };

    const clearFiles = () => {
        setFiles([]);
        setImages([]);
    };

    // Load actual image elements from files
    useEffect(() => {
        let loaded = 0;
        const loadedImages: HTMLImageElement[] = new Array(files.length);
        
        if (files.length === 0) {
            setImages([]);
            return;
        }

        files.forEach((file, index) => {
            const img = new Image();
            img.onload = () => {
                loadedImages[index] = img;
                loaded++;
                if (loaded === files.length) {
                    setImages([...loadedImages]);
                }
            };
            img.src = URL.createObjectURL(file);
        });
    }, [files]);

    // Draw collage
    useEffect(() => {
        if (!canvasRef.current || images.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Auto-determine layout rows based on columns
        const rows = Math.ceil(images.length / columns);
        
        // Define canvas size
        const targetCellSize = 600; 
        const canvasWidth = columns * targetCellSize + gap * (columns + 1);
        const canvasHeight = rows * targetCellSize + gap * (rows + 1);
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw each image
        images.forEach((img, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);

            const x = gap + col * (targetCellSize + gap);
            const y = gap + row * (targetCellSize + gap);

            // Object-fit: cover calculation
            const imgRatio = img.width / img.height;
            const cellRatio = 1; // square cells
            
            let sWidth = img.width;
            let sHeight = img.height;
            let sx = 0;
            let sy = 0;

            if (imgRatio > cellRatio) {
                // Image is wider
                sWidth = img.height; // aspect 1:1
                sx = (img.width - sWidth) / 2;
            } else {
                // Image is taller
                sHeight = img.width;
                sy = (img.height - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, targetCellSize, targetCellSize);
        });
    }, [images, gap, bgColor, columns]);

    const downloadCollage = () => {
        if (!canvasRef.current) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `collage_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🖼️ छवि कोलाज निर्माता" : "🖼️ Image Collage Maker"}
            description={isHi ? "फ़ोटो को आसानी से एक सुंदर ग्रिड में संयोजित करें" : "Combine photos into a beautiful grid collage instantly"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                <FileUpload maxFiles={9} accept={{ "image/*": [] }} onFilesSelected={(f) => setFiles(f)} hint={isHi ? "2 से 9 चित्र चुनें" : "Select 2 to 9 images"} />

                {files.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {files.map((file, i) => (
                            <div key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded truncate max-w-[120px]">
                                {file.name}
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "कॉलम" : "Columns"}</label>
                        <input type="range" min="1" max="5" value={columns} onChange={(e) => setColumns(+e.target.value)} className="w-full accent-indigo-500" />
                        <div className="text-center text-sm text-slate-300 mt-1">{columns}</div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "गैप (px)" : "Gap (px)"}</label>
                        <input type="range" min="0" max="100" value={gap} onChange={(e) => setGap(+e.target.value)} className="w-full accent-indigo-500" />
                        <div className="text-center text-sm text-slate-300 mt-1">{gap}px</div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "पृष्ठभूमि का रंग" : "Background Color"}</label>
                        <div className="flex gap-2">
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded cursor-pointer bg-slate-800 border-none" />
                        </div>
                    </div>
                    <div className="flex items-end gap-2 text-sm">
                        <button onClick={clearFiles} className="h-10 px-4 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 w-full transition-colors">{isHi ? "स्पष्ट" : "Clear"}</button>
                    </div>
                </div>

                {images.length > 0 && (
                    <div className="space-y-4 animate-in fade-in duration-500 flex flex-col items-center">
                        <div className="w-full overflow-hidden flex justify-center bg-slate-900 rounded-lg p-4 border border-slate-800">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                        <DownloadButton onClick={downloadCollage} label={isHi ? "कोलाज डाउनलोड करें" : "Download Collage"} />
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
