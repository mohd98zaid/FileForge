"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, ScanLine, Copy, RefreshCw } from "lucide-react";

export default function QrDecoderTool() {
    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [imageSrc, setImageSrc] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!(window as any).jsQR) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setResult("");

        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            setImageSrc(src);
            decodeQr(src);
        };
        reader.readAsDataURL(file);
    };

    const decodeQr = (src: string) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            
            if ((window as any).jsQR) {
                const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    setResult(code.data);
                } else {
                    setError("No QR code found in this image.");
                }
            } else {
                setError("Scanner engine is still loading. Try again in a second.");
            }
        };
        img.src = src;
    };

    return (
        <ToolLayout title="QR Code Decoder" description="Upload a picture of a QR code to read its content instantly.">
            <div className="max-w-3xl mx-auto space-y-8 flex flex-col items-center">
                
                {!imageSrc ? (
                    <div 
                        className="border-2 border-dashed border-sky-300 rounded-2xl p-16 flex flex-col items-center justify-center bg-sky-50 w-full hover:bg-sky-100 cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ScanLine className="w-16 h-16 text-sky-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Upload QR Code Image</h3>
                        <p className="text-slate-500">PNG, JPG, JPEG</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white p-8 border rounded-2xl shadow-sm w-full flex flex-col items-center text-center">
                        <img src={imageSrc} alt="Uploaded QR" className="max-w-xs max-h-64 rounded-xl shadow-md mb-8 border" />
                        
                        {result && (
                            <div className="w-full bg-emerald-50 border border-emerald-200 p-6 rounded-xl relative">
                                <h4 className="text-emerald-800 font-bold mb-2">Decoded Content:</h4>
                                <div className="p-4 bg-white border rounded-lg font-mono text-left break-words text-lg">
                                    {result}
                                </div>
                                <Button 
                                    onClick={() => navigator.clipboard.writeText(result)}
                                    className="absolute top-6 right-6 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <Copy className="w-4 h-4"/> Copy
                                </Button>
                            </div>
                        )}

                        {error && (
                            <div className="w-full bg-red-50 p-6 rounded-xl border border-red-200 text-red-600 font-medium">
                                {error}
                            </div>
                        )}

                        <Button onClick={() => setImageSrc("")} variant="secondary" className="mt-8 gap-2">
                            <RefreshCw className="w-4 h-4" /> Scan Another Image
                        </Button>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
