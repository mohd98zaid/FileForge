"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useCallback } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import JSZip from "jszip";

const faqs = [
    { question: "What sizes are generated?", questionHi: "कौन से आकार (Sizes) उत्पन्न होते हैं?", answer: "This tool generates the standard 16x16 and 32x32 pixels for desktop browsers, 180x180 for Apple Touch, and 192x192/512x512 for Android/PWA manifests.", answerHi: "यह टूल डेस्कटॉप ब्राउज़रों के लिए मानक 16x16 और 32x32 पिक्सेल, Apple टच के लिए 180x180, और Android/PWA मैनिफ़ेस्ट के लिए 192x192/512x512 उत्पन्न करता है।" },
    { question: "Are my images uploaded to a server?", questionHi: "क्या मेरी छवियां सर्वर पर अपलोड की जाती हैं?", answer: "No. The resizing happens entirely in your browser using the HTML5 Canvas API. Your image never leaves your device.", answerHi: "नहीं। आकार बदलना पूरी तरह से HTML5 कैनवास एपीआई का उपयोग करके आपके ब्राउज़र में होता है। आपकी छवि कभी भी आपके डिवाइस से बाहर नहीं जाती है।" },
    { question: "Why do I need multiple favicons?", questionHi: "मुझे एक से अधिक फ़ेविकॉन की आवश्यकता क्यों है?", answer: "Different devices (Windows, Mac, iOS, Android) and contexts (browser tabs, home screen shortcuts, bookmarks) require different sizes to look sharp.", answerHi: "विभिन्न उपकरणों (विंडोज, मैक, आईओएस, एंड्रॉइड) और संदर्भों (ब्राउजर टैब, होम स्क्रीन शॉर्टकट, बुकमार्क) को तेज दिखने के लिए अलग-अलग आकारों की आवश्यकता होती है।" },
];

const SIZES = [
    { name: "favicon-16x16.png", size: 16 },
    { name: "favicon-32x32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
    { name: "android-chrome-192x192.png", size: 192 },
    { name: "android-chrome-512x512.png", size: 512 },
];

export default function FaviconGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // For generating a quick `.ico` which is essentially a renamed PNG in modern times, 
    // though ideally it's a specific wrapper. We'll use 32x32 renamed for highest wide compatibility.
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert(isHi ? "कृपया एक मान्य छवि अपलोड करें।" : "Please upload a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setSourceImage(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const resizeImage = (img: HTMLImageElement, size: number): Promise<Blob> => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Set canvas to desired size
            canvas.width = size;
            canvas.height = size;
            
            // Clear canvas
            ctx.clearRect(0, 0, size, size);
            
            // Draw image scaled
            // Maintain aspect ratio while covering the square (crop center if necessary)
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
            }, "image/png");
        });
    };

    const generateFavicons = async () => {
        if (!sourceImage) return;
        setIsGenerating(true);

        try {
            const img = new Image();
            img.src = sourceImage;
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const zip = new JSZip();

            // Generate all PNG sizes
            for (const { name, size } of SIZES) {
                const blob = await resizeImage(img, size);
                zip.file(name, blob);
                
                // Also duplicate the 32x32 as favicon.ico for legacy support
                if (size === 32) {
                    zip.file("favicon.ico", blob);
                }
            }

            // Generate HTML snippet instructions
            const htmlSnippet = `<!-- Place this in the <head> of your HTML -->\n<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="icon" sizes="192x192" href="/android-chrome-192x192.png">\n<link rel="icon" sizes="512x512" href="/android-chrome-512x512.png">`;
            zip.file("instructions.html", htmlSnippet);

            // Export ZIP
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = "favicons.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Favicon generation failed:", error);
            alert(isHi ? "फ़ेविकॉन जनरेट करने में त्रुटि।" : "Error generating favicons.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌟 फ़ेविकॉन जनरेटर" : "🌟 Favicon Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "वेब और ऐप प्लेटफ़ॉर्म के लिए तुरंत आइकन आकार (16x16 से 512x512) बनाएं" : "Instantly generate perfect icon sizes (16x16 to 512x512) for all web and app platforms"}</p>
            </div>

            {/* Hidden Canvas for manipulation */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="glass-card max-w-4xl mx-auto flex flex-col gap-8">
                
                {!sourceImage ? (
                    // Dropzone
                    <div 
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]
                            ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500'}`}
                    >
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect}
                        />
                        
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">
                            {isHi ? "छवि यहाँ खींचें और छोड़ें" : "Drag your logo here"}
                        </h3>
                        <p className="text-slate-400">
                            {isHi ? "या अपने डिवाइस से ब्राउज़ करने के लिए क्लिक करें" : "or click to upload (Square PNG recommended)"}
                        </p>
                    </div>
                ) : (
                    // Preview & Action Area
                    <div className="flex flex-col items-center gap-8 py-8">
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-end justify-items-center">
                            
                            {/* Original Preview */}
                            <div className="flex flex-col items-center gap-3 col-span-2 sm:col-span-1">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isHi ? "मूल" : "Original"}</span>
                                <div className="w-32 h-32 rounded-xl bg-slate-800 border border-slate-700 p-2 flex items-center justify-center shadow-inner overflow-hidden relative group">
                                    <img src={sourceImage} alt="Source" className="max-w-full max-h-full object-contain" />
                                    <button 
                                        onClick={() => setSourceImage(null)}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold"
                                    >
                                        {isHi ? "बदलें" : "Change Image"}
                                    </button>
                                </div>
                            </div>

                            {/* Simulated Output Scale 1 */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">32x32</span>
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 p-4 flex items-center justify-center">
                                    <img src={sourceImage} alt="32x32 preview" className="w-8 h-8 object-cover rounded-sm border border-slate-600/50" />
                                </div>
                            </div>

                            {/* Simulated Output Scale 2 */}
                            <div className="flex flex-col items-center gap-3">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">16x16</span>
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 p-4 flex items-center justify-center">
                                    <img src={sourceImage} alt="16x16 preview" className="w-4 h-4 object-cover rounded-sm border border-slate-600/50" />
                                </div>
                            </div>

                        </div>

                        <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-4">
                            <h4 className="text-slate-300 font-bold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {isHi ? "पैकेज में शामिल:" : "Package contains:"}
                            </h4>
                            <ul className="text-sm text-slate-400 space-y-1 grid grid-cols-2">
                                <li>• favicon.ico</li>
                                <li>• favicon-16x16.png</li>
                                <li>• favicon-32x32.png</li>
                                <li>• apple-touch-icon.png</li>
                                <li>• android-chrome-192.png</li>
                                <li>• instructions.html</li>
                            </ul>
                        </div>

                        <button
                            onClick={generateFavicons}
                            disabled={isGenerating}
                            className={`w-full max-w-md py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-3
                                ${isGenerating 
                                    ? 'bg-indigo-600/50 text-white/50 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] hover:shadow-indigo-500/25'}`}
                        >
                            {isGenerating ? (
                                <><svg className="animate-spin w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> {isHi ? "जनरेट हो रहा है..." : "Generating & Zipping..."}</>
                            ) : (
                                <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> {isHi ? "Favicons ZIP डाउनलोड करें" : "Download Favicon ZIP"}</>
                            )}
                        </button>

                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/favicon-generator" tools={ALL_TOOLS} />
        </div>
    );
}
