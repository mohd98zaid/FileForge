"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "What is Steganography?", questionHi: "स्टेग्नोग्राफ़ी क्या है?", answer: "It's the practice of hiding a secret message inside an ordinary, non-secret file. We hide the text in the least significant bits of the image pixels.", answerHi: "यह एक सामान्य, गैर-गुप्त फ़ाइल के अंदर एक गुप्त संदेश छिपाने का अभ्यास है। हम छवि पिक्सेल के सबसे कम महत्वपूर्ण बिट्स में टेक्स्ट को छिपाते हैं।" },
    { question: "Why must I download as PNG?", questionHi: "मुझे PNG के रूप में क्यों डाउनलोड करना चाहिए?", answer: "Compression formats like JPEG will alter the pixels and destroy the hidden message. PNG is lossless.", answerHi: "JPEG जैसे संपीड़न प्रारूप पिक्सेल को बदल देंगे और छिपे हुए संदेश को नष्ट कर देंगे। PNG दोषरहित है।" },
];

export default function SteganographyPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    // Encode state
    const [secretMessage, setSecretMessage] = useState("");
    const [encodedBlob, setEncodedBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    
    // Decode state
    const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
        setEncodedBlob(null);
        setDecodedMessage(null);
        setErrorMessage("");
    };

    useEffect(() => {
        if (!file) {
            setImage(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImage(img);
            if (mode === "decode") {
                decodeMessage(img);
            }
        };
        img.src = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, mode]);

    const encodeMessage = () => {
        if (!image || !canvasRef.current) return;
        setErrorMessage("");
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Add a delimiter to know when to stop reading: |END|
        const messageToHide = secretMessage + "|END|";
        const encoder = new TextEncoder();
        const bits: number[] = [];
        
        encoder.encode(messageToHide).forEach(byte => {
            for (let i = 7; i >= 0; i--) {
                bits.push((byte >> i) & 1);
            }
        });

        // Capacity check: 3 bits per pixel (RGB, ignoring Alpha)
        const totalCapacityBits = (data.length / 4) * 3;
        if (bits.length > totalCapacityBits) {
            setErrorMessage(isHi ? "संदेश बहुत लंबा है इस छवि के लिए" : "Message is too long for this image size.");
            return;
        }

        let bitIndex = 0;
        for (let i = 0; i < data.length && bitIndex < bits.length; i += 4) {
            // Modify R, G, B LSBs
            if (bitIndex < bits.length) { data[i] = (data[i] & ~1) | bits[bitIndex++]; }
            if (bitIndex < bits.length) { data[i+1] = (data[i+1] & ~1) | bits[bitIndex++]; }
            if (bitIndex < bits.length) { data[i+2] = (data[i+2] & ~1) | bits[bitIndex++]; }
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) setEncodedBlob(blob);
        }, "image/png");
    };

    const decodeMessage = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const bytes: number[] = [];
        let currentByte = 0;
        let bitCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            for (let j = 0; j < 3; j++) { // R, G, B
                const lsb = data[i + j] & 1;
                currentByte = (currentByte << 1) | lsb;
                bitCount++;

                if (bitCount === 8) {
                    bytes.push(currentByte);
                    
                    // Decode incrementally to check for delimiter
                    if (bytes.length >= 5) {
                        const decoder = new TextDecoder();
                        const str = decoder.decode(new Uint8Array(bytes));
                        if (str.endsWith("|END|")) {
                            setDecodedMessage(str.slice(0, -5));
                            return; // Stop reading
                        }
                    }
                    
                    // Fallback cap if no delimiter found (stops huge decodes)
                    if (bytes.length > 50000) {
                        setDecodedMessage("Error: Payload limit reached without finding end marker. This image might not contain a hidden message.");
                        return;
                    }

                    currentByte = 0;
                    bitCount = 0;
                }
            }
        }
        
        setDecodedMessage(isHi ? "कोई छिपा हुआ संदेश नहीं मिला।" : "No hidden message found.");
    };

    const handleDownload = () => {
        if (!encodedBlob) return;
        const url = URL.createObjectURL(encodedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hidden_secret_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <ToolLayout
            title={isHi ? "🕵️ छवि में टेक्स्ट छिपाएं" : "🕵️ Image Steganography"}
            description={isHi ? "छवि पिक्सेल के अंदर गुप्त टेक्स्ट को एनकोड या डिकोड करें" : "Hide secret messages inside image pixels securely in your browser"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-800 rounded-lg max-w-sm mx-auto">
                    <button 
                        onClick={() => { setMode("encode"); setFile(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "encode" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                    >
                        {isHi ? "छुपाएं (Encode)" : "Hide (Encode)"}
                    </button>
                    <button 
                        onClick={() => { setMode("decode"); setFile(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "decode" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                    >
                        {isHi ? "खोजें (Decode)" : "Reveal (Decode)"}
                    </button>
                </div>

                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/png": [], "image/jpeg": [], "image/webp": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि (PNG/JPG) यहाँ छोड़ें" : "Drop an Image (PNG/JPG) Here"} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4 rounded-lg bg-slate-800/50 border border-slate-700 p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-slate-200">{file.name}</h3>
                                <button onClick={() => setFile(null)} className="text-xs px-2 py-1 bg-slate-700 rounded hover:bg-slate-600 text-slate-300">
                                    {isHi ? "बदलें" : "Change"}
                                </button>
                            </div>
                            
                            <img src={URL.createObjectURL(file)} className="w-full max-h-[300px] object-contain bg-slate-900 rounded border border-slate-700" alt="Source" />
                            
                            {mode === "encode" ? (
                                <div className="space-y-4 pt-2">
                                    <textarea 
                                        rows={4}
                                        placeholder={isHi ? "अपना गुप्त संदेश यहाँ लिखें..." : "Type your secret message here..."}
                                        value={secretMessage}
                                        onChange={(e) => setSecretMessage(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
                                    
                                    {!encodedBlob ? (
                                        <button onClick={encodeMessage} disabled={!secretMessage} className="w-full btn-primary disabled:opacity-50">
                                            {isHi ? "टेक्स्ट को सुरक्षित करें" : "Encode Secret Message"}
                                        </button>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in duration-300">
                                            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm text-center font-medium">
                                                {isHi ? "संदेश छवि में सुरक्षित कर दिया गया है!" : "Message encoded successfully inside the image pixels!"}
                                            </div>
                                            <DownloadButton onClick={handleDownload} label={isHi ? "सुरक्षित छवि डाउनलोड करें (PNG)" : "Download Safe Image (PNG)"} className="w-full" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 pt-2">
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">{isHi ? "डिकोड किया गया संदेश:" : "Decoded Message:"}</h4>
                                    {decodedMessage ? (
                                        <div className="w-full bg-slate-900 border border-dashed border-emerald-500/50 rounded-lg p-4 text-emerald-400 font-mono whitespace-pre-wrap min-h-[100px]">
                                            {decodedMessage}
                                        </div>
                                    ) : (
                                        <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-500 text-center animate-pulse">
                                            {isHi ? "संदेश पढ़ा जा रहा है..." : "Scanning pixels for secret data..."}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Hidden canvas for processing */}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </ToolLayout>
    );
}
