"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "Why is the downloaded file a PNG?", questionHi: "डाउनलोड की गई फ़ाइल PNG क्यों है?", answer: "To maintain the transparent background around the rounded edges, the file must be saved as a PNG.", answerHi: "गोल किनारों के चारों ओर पारदर्शी पृष्ठभूमि बनाए रखने के लिए फ़ाइल को PNG के रूप में सहेजा जाना चाहिए।" },
];

export default function RoundCornersPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [radius, setRadius] = useState(50);
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

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, image.width, image.height);

        // Clamp radius so it doesn't exceed half the image dimension
        const maxRadius = Math.min(image.width, image.height) / 2;
        const actualRadius = Math.min(radius, maxRadius);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(actualRadius, 0);
        ctx.lineTo(image.width - actualRadius, 0);
        ctx.quadraticCurveTo(image.width, 0, image.width, actualRadius);
        ctx.lineTo(image.width, image.height - actualRadius);
        ctx.quadraticCurveTo(image.width, image.height, image.width - actualRadius, image.height);
        ctx.lineTo(actualRadius, image.height);
        ctx.quadraticCurveTo(0, image.height, 0, image.height - actualRadius);
        ctx.lineTo(0, actualRadius);
        ctx.quadraticCurveTo(0, 0, actualRadius, 0);
        ctx.closePath();
        ctx.clip();

        // Draw the image
        ctx.drawImage(image, 0, 0, image.width, image.height);
        ctx.restore();

    }, [image, radius]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `rounded_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "⭕ गोलाई वाले किनारे" : "⭕ Round Image Corners"}
            description={isHi ? "अपनी छवियों के किनारों को गोल करें और पारदर्शी PNG के रूप में डाउनलोड करें" : "Curve the corners of your image with a transparent background"}
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
                                <span className="font-semibold text-slate-200">{isHi ? "रेडियस सेटिंग्स" : "Radius Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">
                                    {isHi ? "नया चित्र चुनें" : "New Image"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm text-slate-400 mb-2">
                                        <span>{isHi ? "कॉर्नर त्रिज्या (px)" : "Corner Radius (px)"}</span>
                                        <span className="text-slate-200">{radius}px</span>
                                    </label>
                                    <input type="range" min="0" max={Math.min(image?.width || 500, image?.height || 500) / 2} value={radius} onChange={(e) => setRadius(+e.target.value)} className="w-full accent-indigo-500" />
                                </div>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "पारदर्शी चित्र डाउनलोड करें" : "Download PNG (Transparent)"} className="w-full mt-4" />
                        </div>

                        {/* Preview Area */}
                        <div className="lg:col-span-8 flex justify-center border-dashed border-2 bg-black bg-opacity-30 rounded-lg p-2 md:p-6 border-slate-700 min-h-[400px] flex-col items-center relative overflow-hidden" 
                             style={{backgroundImage: "repeating-linear-gradient(45deg, #1e293b 25%, transparent 25%, transparent 75%, #1e293b 75%, #1e293b), repeating-linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 75%, #1e293b 75%, #1e293b)", backgroundPosition: "0 0, 10px 10px", backgroundSize: "20px 20px"}}>
                            <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-2xl" style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
