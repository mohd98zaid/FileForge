"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";

const faqs = [
    { question: "Are these QR codes safe?", questionHi: "क्या ये QR कोड सुरक्षित हैं?", answer: "Yes! Everything is generated 100% locally in your browser. No data is sent to our servers.", answerHi: "हाँ! सब कुछ आपके ब्राउज़र में 100% स्थानीय रूप से उत्पन्न होता है। हमारे सर्वर पर कोई डेटा नहीं भेजा जाता है।" },
    { question: "Do these QR codes expire?", questionHi: "क्या ये QR कोड समाप्त होते हैं?", answer: "No, they never expire. These are static QR codes that encode the data directly into the image pattern.", answerHi: "नहीं, वे कभी समाप्त नहीं होते हैं। ये स्थिर QR कोड हैं जो डेटा को सीधे छवि पैटर्न में एन्कोड करते हैं।" },
    { question: "Which format should I download?", questionHi: "मुझे कौन सा प्रारूप डाउनलोड करना चाहिए?", answer: "PNG is great for general use and sharing. SVG is a vector format ideal for professional printing because it never loses quality.", answerHi: "PNG सामान्य उपयोग और साझा करने के लिए बहुत अच्छा है। SVG एक वेक्टर प्रारूप है जो पेशेवर छपाई के लिए आदर्श है क्योंकि यह कभी गुणवत्ता नहीं खोता है।" },
];

export default function QrGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [text, setText] = useState<string>("https://fileforge.app");
    const [fgColor, setFgColor] = useState<string>("#ffffff");
    const [bgColor, setBgColor] = useState<string>("#1e293b"); // slate-800
    const [size, setSize] = useState<number>(300);
    const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
    const [includeMargin, setIncludeMargin] = useState<boolean>(true);

    const presetColors = ["#ffffff", "#000000", "#3b82f6", "#10b981", "#ef4444", "#f59e0b"];
    const presetBgColors = ["#1e293b", "#ffffff", "#000000", "#f8fafc", "#fef3c7", "#ecfdf5"];

    const svgRef = useRef<SVGSVGElement>(null);

    const downloadPNG = () => {
        // Target the hidden Canvas element we render specifically for PNG downloads
        const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
        if (!canvas) return;
        
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `fileforge-qr-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadSVG = () => {
        if (!svgRef.current) return;
        
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `fileforge-qr-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📱 QR जनरेटर" : "📱 QR Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "रंग, आकार और उच्च गुणवत्ता वाले निर्यात के साथ कस्टम QR कोड बनाएं" : "Create custom QR codes with color, size, and high-quality export"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block">
                            {isHi ? "कंटेंट (URL, टेक्स्ट, फ़ोन नंबर)" : "Content (URL, Text, Phone)"}
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "QR का रंग" : "QR Color"}</label>
                            <div className="flex flex-wrap gap-2">
                                {presetColors.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setFgColor(c)} 
                                        className={`w-6 h-6 rounded-full border-2 ${fgColor === c ? 'border-indigo-400 scale-110' : 'border-transparent shadow-sm'}`} 
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input 
                                    type="color" 
                                    value={fgColor} 
                                    onChange={(e) => setFgColor(e.target.value)} 
                                    className="w-6 h-6 rounded cursor-pointer border-0 p-0" 
                                />
                            </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "पृष्ठभूमि (Background)" : "Background"}</label>
                            <div className="flex flex-wrap gap-2">
                                {presetBgColors.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setBgColor(c)} 
                                        className={`w-6 h-6 rounded-full border-2 ${bgColor === c ? 'border-indigo-400 scale-110' : 'border-transparent shadow-sm border-slate-600'}`} 
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input 
                                    type="color" 
                                    value={bgColor} 
                                    onChange={(e) => setBgColor(e.target.value)} 
                                    className="w-6 h-6 rounded cursor-pointer border-0 p-0" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        {/* Size */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-slate-300">{isHi ? "आकार (Size)" : "Base Size"}</label>
                                <span className="text-xs text-slate-400 font-mono">{size}px</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="1000"
                                step="10"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                className="w-full accent-indigo-500"
                            />
                        </div>

                        {/* Error Correction */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-300">{isHi ? "सुधार स्तर" : "Error Correction"}</label>
                            <select 
                                value={level} 
                                onChange={(e) => setLevel(e.target.value as any)}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                            >
                                <option value="L">L (7%)</option>
                                <option value="M">M (15%)</option>
                                <option value="Q">Q (25%)</option>
                                <option value="H">H (30%)</option>
                            </select>
                        </div>

                        {/* Margin Toggle */}
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={includeMargin}
                                onChange={(e) => setIncludeMargin(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-indigo-500 rounded border-slate-600 bg-slate-900 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-300 font-medium">
                                {isHi ? "सुरक्षित सीमा शामिल करें" : "Include Safe Margin"}
                            </span>
                        </label>
                    </div>

                </div>

                {/* Preview & Export Panel */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700">
                    
                    <div className="bg-stripes-slate-800 p-8 rounded-xl w-full flex-grow flex items-center justify-center min-h-[350px]">
                        {text.trim() ? (
                            <div className="shadow-2xl transition-transform hover:scale-105 duration-300">
                                {/* We render SVG for preview to keep it crisp on high-DPI screens */}
                                <QRCodeSVG
                                    value={text}
                                    size={Math.min(size, 300)} // Cap visual preview size at 300px
                                    bgColor={bgColor}
                                    fgColor={fgColor}
                                    level={level}
                                    includeMargin={includeMargin}
                                    ref={svgRef}
                                />
                                {/* Hidden Canvas strictly for high-res PNG export */}
                                <div className="hidden">
                                     <QRCodeCanvas
                                        id="qr-canvas"
                                        value={text}
                                        size={size} // Uses actual requested size (up to 1000px)
                                        bgColor={bgColor}
                                        fgColor={fgColor}
                                        level={level}
                                        includeMargin={includeMargin}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 text-center">
                                <span className="text-4xl block mb-2">🤔</span>
                                {isHi ? "देखने के लिए कुछ टेक्स्ट टाइप करें" : "Enter text to view QR code"}
                            </div>
                        )}
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-6">
                        <button
                            onClick={downloadPNG}
                            disabled={!text.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            {isHi ? "PNG डाउनलोड" : "Download PNG"}
                        </button>
                        <button
                            onClick={downloadSVG}
                            disabled={!text.trim()}
                            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl border border-slate-600 shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            {isHi ? "SVG डाउनलोड" : "Download SVG"}
                        </button>
                    </div>
                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/qr-generator" tools={ALL_TOOLS} />
        </div>
    );
}
