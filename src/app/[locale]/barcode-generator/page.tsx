"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import JsBarcode from "jsbarcode";

const faqs = [
    { question: "Which barcode format should I use?", questionHi: "मुझे किस बारकोड प्रारूप का उपयोग करना चाहिए?", answer: "CODE128 is the most versatile for general text and numbers. UPC and EAN are specific to retail products. ITF is used for shipping containers.", answerHi: "CODE128 सामान्य पाठ और संख्याओं के लिए सबसे बहुमुखी है। UPC और EAN खुदरा उत्पादों के लिए विशिष्ट हैं। ITF का उपयोग शिपिंग कंटेनरों के लिए किया जाता है।" },
    { question: "Why is the input turning red?", questionHi: "इनपुट लाल क्यों हो रहा है?", answer: "Some barcode formats have strict requirements. For example, EAN-13 requires exactly 12 or 13 digits (no letters).", answerHi: "कुछ बारकोड प्रारूपों की सख्त आवश्यकताएं होती हैं। उदाहरण के लिए, EAN-13 के लिए ठीक 12 या 13 अंकों (कोई अक्षर नहीं) की आवश्यकता होती है।" },
    { question: "Can I use this for real products?", questionHi: "क्या मैं वास्तविक उत्पादों के लिए इसका इस्तेमाल कर सकता हूँ?", answer: "Yes, you can generate valid codes matching your assigned GTIN/UPC numbers for printing on product labels.", answerHi: "हाँ, आप उत्पाद लेबल पर मुद्रण के लिए अपने असाइन किए गए GTIN/UPC नंबरों से मेल खाने वाले मान्य कोड उत्पन्न कर सकते हैं।" },
];

export default function BarcodeGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [text, setText] = useState<string>("FILEFORGE2025");
    const [format, setFormat] = useState<string>("CODE128");
    const [lineColor, setLineColor] = useState<string>("#000000");
    const [bgColor, setBgColor] = useState<string>("#ffffff");
    
    // Barcode dimensions
    const [width, setWidth] = useState<number>(2); // Thickness of a single bar
    const [height, setHeight] = useState<number>(100);
    const [displayValue, setDisplayValue] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const presetLineColors = ["#000000", "#1e293b", "#3b82f6", "#ef4444", "#8b5cf6"];
    const presetBgColors = ["#ffffff", "#f8fafc", "#fef3c7", "#ecfdf5", "transparent"];

    const svgRef = useRef<SVGSVGElement>(null);

    // Format options with simple validation hints
    const formats = [
        { id: "CODE128", label: "CODE128 (Most Versatile)" },
        { id: "CODE39", label: "CODE39 (Uppercase & basic symbols)" },
        { id: "EAN13", label: "EAN-13 (12 or 13 digits)" },
        { id: "EAN8", label: "EAN-8 (7 or 8 digits)" },
        { id: "UPC", label: "UPC-A (11 or 12 digits)" },
        { id: "ITF14", label: "ITF-14 (13 or 14 digits)" },
        { id: "MSI", label: "MSI (Numbers only)" },
        { id: "pharmacode", label: "Pharmacode (Numbers only)" }
    ];

    useEffect(() => {
        if (!svgRef.current) return;
        
        let targetText = text.trim();
        // Fallback text if empty to prevent JsBarcode from throwing hard errors during typing
        if (!targetText) {
             targetText = format.startsWith("EAN") || format === "UPC" || format === "ITF14" || format === "MSI" || format === "pharmacode" ? "123456789012" : "FILEFORGE";
        }

        try {
            JsBarcode(svgRef.current, targetText, {
                format: format,
                lineColor: lineColor,
                background: bgColor === "transparent" ? "rgba(0,0,0,0)" : bgColor,
                width: width,
                height: height,
                displayValue: displayValue,
                fontOptions: "bold",
                font: "monospace",
                textAlign: "center",
                textPosition: "bottom",
                textMargin: 6,
                fontSize: 20,
                margin: 10,
                valid: function(valid) {
                    if(valid){
                        setError(null);
                    } else {
                        // This callback is actually rarely triggered cleanly by jsbarcode for all formats.
                        // Try/catch below handles most actual format validation throws.
                    }
                }
            });
            setError(null);
        } catch (e: any) {
            console.error("Barcode generation error:", e);
            setError(isHi ? "अमान्य प्रारूप या वर्ण। यह बारकोड प्रकार इस टेक्स्ट का समर्थन नहीं करता है।" : "Invalid format/characters for selected barcode type.");
            
            // Clear the SVG if invalid
            if (svgRef.current) {
                svgRef.current.innerHTML = "";
            }
        }
    }, [text, format, lineColor, bgColor, width, height, displayValue, isHi]);

    const downloadPNG = () => {
        if (!svgRef.current || error || !text.trim()) return;
        
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        // Convert SVG string to base64
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if(ctx) {
                // Fill background in canvas if transparent otherwise PNG might be hard to read on dark OS themes
                if (bgColor === "transparent") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                ctx.drawImage(img, 0, 0);
                
                const pngUrl = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = pngUrl;
                a.download = `fileforge-barcode-${format}-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        };
        img.src = url;
    };

    const downloadSVG = () => {
        if (!svgRef.current || error || !text.trim()) return;
        
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `fileforge-barcode-${format}-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🛒 बारकोड जनरेटर" : "🛒 Barcode Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "CODE128, EAN, UPC और अन्य 1D बारकोड स्वरूप बनाएँ" : "Generate CODE128, EAN, UPC, and other standard 1D barcodes"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full md:w-5/12 flex flex-col gap-6">
                    
                    {/* Content Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block">
                            {isHi ? "बारकोड डेटा (टेक्स्ट या नंबर)" : "Barcode Data (Text or Numbers)"}
                        </label>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className={`w-full bg-slate-900 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} rounded-xl p-4 text-slate-200 outline-none font-mono tracking-widest`}
                            placeholder="FILEFORGE"
                        />
                        {error && (
                            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Format Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block">{isHi ? "बारकोड प्रारूप" : "Barcode Format"}</label>
                        <select 
                            value={format} 
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none"
                        >
                            {formats.map(f => (
                                <option key={f.id} value={f.id}>{f.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "रेखा का रंग" : "Line Color"}</label>
                            <div className="flex flex-wrap gap-2">
                                {presetLineColors.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setLineColor(c)} 
                                        className={`w-5 h-5 rounded-full border border-slate-500 ${lineColor === c ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''}`} 
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "पृष्ठभूमि" : "Background"}</label>
                            <div className="flex flex-wrap gap-2">
                                {presetBgColors.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setBgColor(c)} 
                                        className={`w-5 h-5 rounded-full border border-slate-500 ${bgColor === c ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''} ${c === 'transparent' ? 'bg-stripes-slate-800' : ''}`} 
                                        style={{ backgroundColor: c !== 'transparent' ? c : undefined }}
                                        title={c === 'transparent' ? 'Transparent' : c}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dimensions & Toggles */}
                    <div className="space-y-5 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-slate-400">{isHi ? "बार की चौड़ाई" : "Bar Width"}</label>
                                <span className="text-xs text-slate-500 font-mono">{width}</span>
                            </div>
                            <input
                                type="range" min="1" max="4" step="1"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="w-full accent-indigo-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-slate-400">{isHi ? "ऊंचाई" : "Height"}</label>
                                <span className="text-xs text-slate-500 font-mono">{height}px</span>
                            </div>
                            <input
                                type="range" min="30" max="250" step="10"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full accent-indigo-500"
                            />
                        </div>

                        <label className="flex items-center space-x-3 cursor-pointer pt-2 border-t border-slate-700/50">
                            <input
                                type="checkbox"
                                checked={displayValue}
                                onChange={(e) => setDisplayValue(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-indigo-500 rounded border-slate-600 bg-slate-900 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-300 font-medium">
                                {isHi ? "टेक्स्ट दिखाएँ" : "Show Text Value"}
                            </span>
                        </label>
                    </div>

                </div>

                {/* Preview & Export Panel */}
                <div className="w-full md:w-7/12 flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700">
                    
                    <div className={`p-8 rounded-xl w-full flex-grow flex items-center justify-center min-h-[300px] overflow-hidden ${bgColor === 'transparent' ? 'bg-stripes-slate-800' : ''}`} style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}>
                        
                        {/* Wrapper for SVG scaling to prevent overflow on very long barcodes */}
                        <div className="max-w-full overflow-x-auto shadow-2xl rounded custom-scrollbar">
                           <svg ref={svgRef} className="max-w-none"></svg>
                        </div>
                        
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 mt-6">
                        <button
                            onClick={downloadPNG}
                            disabled={!!error || !text.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            {isHi ? "PNG डाउनलोड" : "Download PNG"}
                        </button>
                        <button
                            onClick={downloadSVG}
                            disabled={!!error || !text.trim()}
                            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl border border-slate-600 shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            {isHi ? "SVG डाउनलोड" : "Download SVG"}
                        </button>
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/barcode-generator" tools={ALL_TOOLS} />
        </div>
    );
}
