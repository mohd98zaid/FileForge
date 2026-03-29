"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "What is the mirror effect?", questionHi: "मिरर इफ़ेक्ट क्या है?", answer: "It splits your image in half and reflects one side onto the other, creating perfect symmetry.", answerHi: "यह आपकी छवि को आधा विभाजित करता है और एक तरफ को दूसरे पर प्रतिबिंबित करता है, जिससे पूर्ण समरूपता बनती है।" },
];

export default function MirrorEffectPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [mode, setMode] = useState<"leftToRight" | "rightToLeft" | "topToBottom" | "bottomToTop">("leftToRight");
    
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

        const w = image.width;
        const h = image.height;

        if (mode === "leftToRight") {
            // Draw left half
            ctx.drawImage(image, 0, 0, w/2, h, 0, 0, w/2, h);
            // Flip and draw left half on the right
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(image, 0, 0, w/2, h, -w, 0, w/2, h);
            ctx.restore();
        } else if (mode === "rightToLeft") {
            // Draw right half
            ctx.drawImage(image, w/2, 0, w/2, h, w/2, 0, w/2, h);
            // Flip and draw right half on the left
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(image, w/2, 0, w/2, h, -w/2, 0, w/2, h);
            ctx.restore();
        } else if (mode === "topToBottom") {
            // Draw top half
            ctx.drawImage(image, 0, 0, w, h/2, 0, 0, w, h/2);
            // Flip top to bottom
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, 0, w, h/2, 0, -h, w, h/2);
            ctx.restore();
        } else if (mode === "bottomToTop") {
            // Draw bottom half
            ctx.drawImage(image, 0, h/2, w, h/2, 0, h/2, w, h/2);
            // Flip bottom to top
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(image, 0, h/2, w, h/2, 0, -h/2, w, h/2);
            ctx.restore();
        }

    }, [image, mode]);

    const handleDownload = () => {
        if (!canvasRef.current || !file) return;
        canvasRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `mirror_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, "image/png");
    };

    return (
        <ToolLayout
            title={isHi ? "🪞 मिरर इफ़ेक्ट" : "🪞 Mirror Effect"}
            description={isHi ? "अपनी छवियों में सममित प्रतिबिंब बनाएँ" : "Create perfect symmetrical reflections on your images"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-4 p-5 rounded-lg border border-slate-700 bg-slate-800/50 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                                <span className="font-semibold text-slate-200">{isHi ? "परावर्तन दिशा" : "Reflection Mode"}</span>
                                <button onClick={() => setFile(null)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10">
                                    {isHi ? "नई छवि चुनें" : "New Image"}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setMode("leftToRight")} className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${mode === "leftToRight" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:bg-slate-700/50 text-slate-400"}`}>
                                    <span className="text-xl">🪞</span>
                                    <span className="text-xs">{isHi ? "बाएं से दाएं" : "Left to Right"}</span>
                                </button>
                                <button onClick={() => setMode("rightToLeft")} className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${mode === "rightToLeft" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:bg-slate-700/50 text-slate-400"}`}>
                                    <span className="text-xl scale-x-[-1] inline-block">🪞</span>
                                    <span className="text-xs">{isHi ? "दाएं से बाएं" : "Right to Left"}</span>
                                </button>
                                <button onClick={() => setMode("topToBottom")} className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${mode === "topToBottom" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:bg-slate-700/50 text-slate-400"}`}>
                                    <span className="text-xl rotate-90 inline-block">🪞</span>
                                    <span className="text-xs">{isHi ? "ऊपर से नीचे" : "Top to Bottom"}</span>
                                </button>
                                <button onClick={() => setMode("bottomToTop")} className={`p-3 rounded-lg border flex flex-col items-center gap-2 ${mode === "bottomToTop" ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:bg-slate-700/50 text-slate-400"}`}>
                                    <span className="text-xl -rotate-90 inline-block">🪞</span>
                                    <span className="text-xs">{isHi ? "नीचे से ऊपर" : "Bottom to Top"}</span>
                                </button>
                            </div>

                            <DownloadButton onClick={handleDownload} label={isHi ? "मिरर छवि डाउनलोड करें" : "Download Mirrored Image"} className="w-full mt-4" />
                        </div>

                        <div className="lg:col-span-8 flex justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPHJlY3Qgd2lkdGg9Ijc1IiBoZWlnaHQ9Ijc1IiBmaWxsPSIjMGUxMjIyIiAvPgogIDxwYXRoIGQ9Ik0xMCAwbDEwIDEwSDB6IiBmaWxsPSIjMWUxZTJiIiBmaWxsLW9wYWNpdHk9IjEuMCIgLz4KPC9zdmc+')] rounded-lg p-2 md:p-6 border border-slate-800 min-h-[400px] flex-col items-center">
                            <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl rounded" style={{ maxHeight: "60vh" }}></canvas>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
