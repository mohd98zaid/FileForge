"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "Can I add multiple borders?", questionHi: "क्या मैं कई बॉर्डर जोड़ सकता हूँ?", answer: "Currently, this tool supports a solid single-color border frame.", answerHi: "वर्तमान में, यह टूल एक ठोस सिंगल-कलर बॉर्डर फ़्रेम का समर्थन करता है।" },
    { question: "Is the resolution maintained?", questionHi: "क्या रिज़ॉल्यूशन बनाए रखा जाता है?", answer: "Yes, the border is added to the original image dimensions without losing quality.", answerHi: "हाँ, गुणवत्ता खोए बिना मूल छवि आयामों में बॉर्डर जोड़ा जाता है।" },
];

export default function ImageBorderPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [borderWidth, setBorderWidth] = useState(20);
    const [borderColor, setBorderColor] = useState("#ffffff");
    const [borderRadius, setBorderRadius] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        if (!canvasRef.current || !image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // The final canvas size will be original size + border margins
        const finalWidth = image.width + borderWidth * 2;
        const finalHeight = image.height + borderWidth * 2;
        
        canvas.width = finalWidth;
        canvas.height = finalHeight;

        ctx.clearRect(0, 0, finalWidth, finalHeight);

        // Draw border background
        ctx.fillStyle = borderColor;
        ctx.fillRect(0, 0, finalWidth, finalHeight);

        // Optionally, round the corners of the inner image
        if (borderRadius > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(borderWidth + borderRadius, borderWidth);
            ctx.lineTo(finalWidth - borderWidth - borderRadius, borderWidth);
            ctx.quadraticCurveTo(finalWidth - borderWidth, borderWidth, finalWidth - borderWidth, borderWidth + borderRadius);
            ctx.lineTo(finalWidth - borderWidth, finalHeight - borderWidth - borderRadius);
            ctx.quadraticCurveTo(finalWidth - borderWidth, finalHeight - borderWidth, finalWidth - borderWidth - borderRadius, finalHeight - borderWidth);
            ctx.lineTo(borderWidth + borderRadius, finalHeight - borderWidth);
            ctx.quadraticCurveTo(borderWidth, finalHeight - borderWidth, borderWidth, finalHeight - borderWidth - borderRadius);
            ctx.lineTo(borderWidth, borderWidth + borderRadius);
            ctx.quadraticCurveTo(borderWidth, borderWidth, borderWidth + borderRadius, borderWidth);
            ctx.closePath();
            ctx.clip();
        }

        // Draw the image inside the border
        ctx.drawImage(image, borderWidth, borderWidth, image.width, image.height);

        if (borderRadius > 0) ctx.restore();

    }, [image, borderWidth, borderColor, borderRadius]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `framed_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🖼️ छवि बॉर्डर" : "🖼️ Image Border"}
            description={isHi ? "छवियों के चारों ओर रंगीन बॉर्डर जोड़ें" : "Add colored frames and borders to your photos"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Editor Controls */}
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "बॉर्डर सेटिंग्स" : "Border Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">
                                    {isHi ? "नया चित्र चुनें" : "New Image"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "लेंथ (Thickness)" : "Thickness (px)"}</span>
                                        <span className="text-slate-200">{borderWidth}px</span>
                                    </label>
                                    <input type="range" min="0" max="250" value={borderWidth} onChange={(e) => setBorderWidth(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                                
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "भीतरी गोलाई" : "Inner Roundness"}</span>
                                        <span className="text-slate-200">{borderRadius}px</span>
                                    </label>
                                    <input type="range" min="0" max="200" value={borderRadius} onChange={(e) => setBorderRadius(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "बॉर्डर का रंग" : "Border Color"}</label>
                                    <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-12 rounded cursor-pointer bg-transparent border border-slate-700 block p-1" />
                                </div>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "फ्रेम छवि डाउनलोड करें" : "Download Framed Image"} className="w-full mt-4" />
                        </div>

                        {/* Preview Area */}
                        <div className="lg:col-span-8 flex justify-center bg-slate-900 rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
