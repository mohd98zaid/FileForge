"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

export default function ImageTextOverlayPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    // Text state
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
    const [fontSize, setFontSize] = useState(10); // % of image height
    const [color, setColor] = useState("#ffffff");
    const [outlineColor, setOutlineColor] = useState("#000000");
    const [font, setFont] = useState("Impact");
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
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
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const drawText = (text: string, yPos: "top" | "bottom") => {
            if (!text) return;
            const sizePx = (image.height * fontSize) / 100;
            ctx.font = `bold ${sizePx}px ${font}, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = color;
            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = sizePx / 15;
            ctx.lineJoin = "round";

            const lines = text.toUpperCase().split("\n");
            const lineHeight = sizePx * 1.1;
            
            let currentY = yPos === "top" ? sizePx + 10 : image.height - 20 - (lines.length - 1) * lineHeight;

            lines.forEach(line => {
                ctx.strokeText(line, image.width / 2, currentY);
                ctx.fillText(line, image.width / 2, currentY);
                currentY += lineHeight;
            });
        };

        drawText(topText, "top");
        drawText(bottomText, "bottom");

    }, [image, topText, bottomText, fontSize, color, outlineColor, font]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `meme_${Date.now()}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/jpeg", 0.95);
    };

    return (
        <ToolLayout
            title={isHi ? "🅰️ टेक्स्ट ओवरले और मेम मेकर" : "🅰️ Text Overlay & Meme Maker"}
            description={isHi ? "अपनी छवि पर कस्टम टेक्स्ट जोड़ें या मेम बनाएं" : "Add custom text to your images like classic internet memes"}
            faqs={[{question: "Supported fonts?", questionHi: "समर्थित फ़ॉन्ट?", answer: "Impact, Arial, Comic Sans, Trebuchet, and Courier.", answerHi: "Impact, Arial, Comic Sans, Trebuchet, और Courier."}]}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-4">
                            <div className="flex justify-between pb-2 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "टेक्स्ट" : "Text Settings"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">Back</button>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "ऊपर का टेक्स्ट" : "Top Text"}</label>
                                <textarea rows={2} value={topText} onChange={e => setTopText(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "नीचे का टेक्स्ट" : "Bottom Text"}</label>
                                <textarea rows={2} value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "आकार (%)" : "Size (%)"}</label>
                                <input type="range" min="2" max="30" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-indigo-500" />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-400 mb-1">{isHi ? "टेक्स्ट रंग" : "Fill Color"}</label>
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded bg-transparent border-0 cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-400 mb-1">{isHi ? "बाहरी रंग" : "Outline Color"}</label>
                                    <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} className="w-full h-8 rounded bg-transparent border-0 cursor-pointer" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "फ़ॉन्ट" : "Font"}</label>
                                <select value={font} onChange={e => setFont(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                                    <option value="Impact">Impact</option>
                                    <option value="Arial">Arial</option>
                                    <option value="'Comic Sans MS'">Comic Sans</option>
                                    <option value="Courier">Courier</option>
                                    <option value="'Trebuchet MS'">Trebuchet</option>
                                </select>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "छवि डाउनलोड करें" : "Download Meme"} className="w-full mt-2" />
                        </div>

                        <div className="lg:col-span-8 flex justify-center bg-slate-900 rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
