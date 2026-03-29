"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// Utility functions for color conversions
const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
};

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
};

const validateHex = (hex: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex);

const faqs = [
    { question: "What is HEX used for?", questionHi: "HEX का उपयोग किसलिए किया जाता है?", answer: "HEX (Hexadecimal) codes are widely used in web design (CSS and HTML) to represent colors digitally.", answerHi: "HEX (हेक्साडेसिमल) कोड का उपयोग वेब डिज़ाइन (CSS और HTML) में रंगों को डिजिटल रूप से दर्शाने के लिए व्यापक रूप से किया जाता है।" },
    { question: "When should I use CMYK?", questionHi: "मुझे CMYK का उपयोग कब करना चाहिए?", answer: "CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard format for physical printing on paper. RGB is for screens.", answerHi: "CMYK (सियान, मैजेंटा, पीला, कुंजी/काला) कागज पर भौतिक छपाई के लिए मानक प्रारूप है। RGB स्क्रीन के लिए है।" },
    { question: "Why do HSL values matter?", questionHi: "HSL मान क्यों मायने रखते हैं?", answer: "HSL (Hue, Saturation, Lightness) makes it easier for humans to create color harmonies. You can just change the Lightness value to make a color lighter or darker without affecting its core hue.", answerHi: "HSL (ह्यू, सैचुरेशन, लाइटनेस) इंसानों के लिए रंग सामंजस्य बनाना आसान बनाता है। आप इसके मूल रंग को प्रभावित किए बिना किसी रंग को हल्का या गहरा बनाने के लिए लाइटनेस मान बदल सकते हैं।" },
];

export default function ColorPickerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [hex, setHex] = useState("#6366F1"); // Default Indigo-500
    const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
    const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });
    const [cmyk, setCmyk] = useState({ c: 59, m: 58, y: 0, k: 5 });
    
    const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

    // Sync from Hex to all format states
    const syncFromHex = (newHex: string) => {
        setHex(newHex);
        if (validateHex(newHex)) {
            const rgbVal = hexToRgb(newHex);
            setRgb(rgbVal);
            setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
            setCmyk(rgbToCmyk(rgbVal.r, rgbVal.g, rgbVal.b));
        }
    };

    // Handle manual Hex Input
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        setHex(val.slice(0, 7)); // Only allow #RRGGBB length roughly
        if (validateHex(val)) {
            syncFromHex(val);
        }
    };

    // Predefined Tailwind-style palettes for quick selection
    const swatches = [
        "#EF4444", "#F97316", "#F59E0B", "#10B981", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
        "#1E293B", "#475569", "#94A3B8", "#FFFFFF", "#E2E8F0", "#000000"
    ];

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopiedFormat(format);
        setTimeout(() => setCopiedFormat(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎨 कलर पिकर" : "🎨 Color Picker & Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "रंग चुनें और तुरंत फॉर्मेट (HEX, RGB, HSL, CMYK) बदलें" : "Select a color and instantly convert between HEX, RGB, HSL, and CMYK formats"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                
                {/* Visual Picker Side */}
                <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 gap-6">
                    
                    {/* The Swatch Preview */}
                    <div 
                        className="w-full aspect-square max-w-[240px] rounded-full shadow-2xl transition-colors duration-200 border-4 border-slate-700/50 relative overflow-hidden group"
                        style={{ backgroundColor: validateHex(hex) ? hex : '#000000' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-300">
                            {/* Hidden native picker stretched over the entire circle */}
                            <input 
                                type="color" 
                                value={validateHex(hex) ? hex : '#000000'}
                                onChange={(e) => syncFromHex(e.target.value)}
                                className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-0 cursor-pointer"
                            />
                            <span className="text-white font-medium drop-shadow-md pointer-events-none flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                {isHi ? "रंग बदलें" : "Click to pick"}
                            </span>
                        </div>
                    </div>

                    {/* Quick Swatches */}
                    <div className="w-full">
                        <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block text-center">{isHi ? "त्वरित रंग" : "Quick Swatches"}</label>
                        <div className="flex flex-wrap justify-center gap-2">
                            {swatches.map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => syncFromHex(c)} 
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${hex.toUpperCase() === c ? 'border-indigo-400 scale-110 shadow-lg shadow-indigo-500/20' : 'border-slate-600'}`} 
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Values Panel Side */}
                <div className="w-full md:w-7/12 flex flex-col gap-4">
                    
                    {/* HEX */}
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-300">HEX</label>
                            <span className="text-xs text-slate-500">{isHi ? "वेब (CSS/HTML)" : "Web (CSS/HTML)"}</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 font-mono">#</span>
                                </div>
                                <input
                                    type="text"
                                    value={hex.replace("#", "")}
                                    onChange={handleHexChange}
                                    className="w-full bg-slate-800 border-none rounded-lg py-3 pl-8 pr-4 text-slate-200 outline-none font-mono tracking-wider focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                            <button 
                                onClick={() => copyToClipboard(hex, 'HEX')}
                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-transparent group-hover:border-slate-600 flex items-center gap-2"
                            >
                                {copiedFormat === 'HEX' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RGB */}
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-300">RGB</label>
                            <span className="text-xs text-slate-500">{isHi ? "स्क्रीन (Red, Green, Blue)" : "Screens (Red, Green, Blue)"}</span>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                readOnly
                                value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                                className="w-full bg-slate-800 border-none rounded-lg py-3 px-4 text-slate-200 outline-none font-mono tracking-wider"
                            />
                            <button 
                                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'RGB')}
                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-transparent group-hover:border-slate-600 flex items-center gap-2"
                            >
                                {copiedFormat === 'RGB' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </button>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="h-1 bg-red-500/20 rounded overflow-hidden"><div className="h-full bg-red-500" style={{width: `${(rgb.r/255)*100}%`}}></div></div>
                            <div className="h-1 bg-green-500/20 rounded overflow-hidden"><div className="h-full bg-green-500" style={{width: `${(rgb.g/255)*100}%`}}></div></div>
                            <div className="h-1 bg-blue-500/20 rounded overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${(rgb.b/255)*100}%`}}></div></div>
                        </div>
                    </div>

                    {/* HSL */}
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-300">HSL</label>
                            <span className="text-xs text-slate-500">{isHi ? "डिज़ाइन (Hue, Saturation, Lightness)" : "Design (Hue, Saturation, Light)"}</span>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                readOnly
                                value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                                className="w-full bg-slate-800 border-none rounded-lg py-3 px-4 text-slate-200 outline-none font-mono tracking-wider"
                            />
                            <button 
                                onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'HSL')}
                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-transparent group-hover:border-slate-600 flex items-center gap-2"
                            >
                                {copiedFormat === 'HSL' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CMYK */}
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-300">CMYK</label>
                            <span className="text-xs text-slate-500">{isHi ? "प्रिंट (Cyan, Magenta, Yellow, Key)" : "Print (Cyan, Magenta, Yellow, Key)"}</span>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                readOnly
                                value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                                className="w-full bg-slate-800 border-none rounded-lg py-3 px-4 text-slate-200 outline-none font-mono tracking-wider"
                            />
                            <button 
                                onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, 'CMYK')}
                                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-transparent group-hover:border-slate-600 flex items-center gap-2"
                            >
                                {copiedFormat === 'CMYK' ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/color-picker" tools={ALL_TOOLS} />
        </div>
    );
}
