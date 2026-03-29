"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// --- Color Parsing Utilities --- //
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
    return [r, g, b];
};

const getLuminance = (r: number, g: number, b: number) => {
    let [rs, gs, bs] = [r / 255, g / 255, b / 255];
    rs = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    gs = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    bs = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrastRatio = (lum1: number, lum2: number) => {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
};

const validateHex = (hex: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex);

const faqs = [
    { question: "What is WCAG?", questionHi: "WCAG क्या है?", answer: "WCAG stands for Web Content Accessibility Guidelines. It defines standards to make web content more accessible to people with disabilities, including low vision or color blindness.", answerHi: "WCAG का मतलब वेब कंटेंट एक्सेसिबिलिटी गाइडलाइंस है। यह विकलांग लोगों, जिनमें कम दृष्टि या रंग अंधापन वाले लोग शामिल हैं, उनके लिए वेब सामग्री को अधिक सुलभ बनाने के लिए मानकों को परिभाषित करता है।" },
    { question: "What is AA vs AAA?", questionHi: "AA बनाम AAA क्या है?", answer: "AA is the minimum acceptable contrast ratio (4.5:1 for normal text). AAA is the enhanced standard (7.1:1), which provides maximum legibility.", answerHi: "AA न्यूनतम स्वीकार्य कंट्रास्ट अनुपात (सामान्य पाठ के लिए 4.5:1) है। AAA उन्नत मानक (7.1:1) है, जो अधिकतम सुगमता प्रदान करता है।" },
    { question: "Does text size matter?", questionHi: "क्या टेक्स्ट का आकार मायने रखता है?", answer: "Yes! Large text (18pt+, or 14pt+ bold) is easier to read, so the WCAG guidelines allow a lower contrast ratio (3.0:1 for AA) for large text compared to normal text.", answerHi: "हाँ! बड़े पाठ (18pt+, या 14pt+ बोल्ड) को पढ़ना आसान है, इसलिए WCAG दिशानिर्देश सामान्य पाठ की तुलना में बड़े पाठ के लिए कम कंट्रास्ट अनुपात (AA के लिए 3.0:1) की अनुमति देते हैं।" },
];

export default function ColorContrastPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [fg, setFg] = useState("#FFFFFF"); // Foreground exactly
    const [bg, setBg] = useState("#4F46E5"); // Background exactly (Indigo-600)

    const handleFgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        setFg(val.slice(0, 7));
    };

    const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        setBg(val.slice(0, 7));
    };

    // Derived values
    const contrastInfo = useMemo(() => {
        if (!validateHex(fg) || !validateHex(bg)) return { ratio: 0, valid: false };
        
        const [r1, g1, b1] = hexToRgb(fg);
        const [r2, g2, b2] = hexToRgb(bg);
        
        const l1 = getLuminance(r1, g1, b1);
        const l2 = getLuminance(r2, g2, b2);
        
        const ratio = getContrastRatio(l1, l2);
        
        return {
            valid: true,
            ratio: Number(ratio.toFixed(2)),
            aaNormal: ratio >= 4.5,
            aaLarge: ratio >= 3.0,
            aaaNormal: ratio >= 7.0,
            aaaLarge: ratio >= 4.5,
        };
    }, [fg, bg]);

    const swapColors = () => {
        const temp = fg;
        setFg(bg);
        setBg(temp);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "👀 कलर कंट्रास्ट चेकर" : "👀 Color Contrast Checker"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "सुनिश्चित करें कि आपके रंग WCAG AA/AAA एक्सेसिबिलिटी मानकों को पास करते हैं" : "Ensure your colors pass WCAG AA/AAA accessibility standards"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Visual Preview */}
                <div 
                    className="w-full h-64 rounded-2xl shadow-2xl flex items-center justify-center transition-colors duration-300 relative border border-slate-700/50"
                    style={{ backgroundColor: validateHex(bg) ? bg : '#000000' }}
                >
                    <div className="text-center" style={{ color: validateHex(fg) ? fg : '#FFFFFF' }}>
                        <h2 className="text-5xl font-bold mb-4 drop-shadow-sm">Readability Preview</h2>
                        <p className="text-lg max-w-md mx-auto opacity-90 drop-shadow-sm">
                            This is an example of normal text to demonstrate how legible the contrast is between your chosen foreground and background.
                        </p>
                    </div>

                    {/* WCAG Pass/Fail Stamp Overlay */}
                    {contrastInfo.valid && (
                        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20 shadow-xl">
                            <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                                Ratio: {contrastInfo.ratio}:1
                                {contrastInfo.ratio >= 4.5 ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Controls Area */}
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Inputs */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6 relative">
                        {/* Swap Button */}
                        <button 
                            onClick={swapColors}
                            className="absolute top-[42%] left-[45%] z-10 p-3 bg-slate-800 rounded-full border-2 border-slate-700 text-slate-300 hover:text-indigo-400 hover:border-indigo-500 transition-all shadow-xl"
                            title="Swap Colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                        </button>

                        {/* Foreground */}
                        <div className="glass-card flex flex-col gap-3 relative z-0">
                            <label className="font-medium text-slate-300">{isHi ? "टेक्स्ट का रंग (Foreground)" : "Text Color (Foreground)"}</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={fg} 
                                    onChange={(e) => setFg(e.target.value)}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-mono">#</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={fg.replace("#", "")}
                                        onChange={handleFgChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-slate-200 outline-none font-mono tracking-wider focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background */}
                        <div className="glass-card flex flex-col gap-3 relative z-0">
                            <label className="font-medium text-slate-300">{isHi ? "पृष्ठभूमि (Background)" : "Background Color"}</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={bg} 
                                    onChange={(e) => setBg(e.target.value)}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500 font-mono">#</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={bg.replace("#", "")}
                                        onChange={handleBgChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-8 pr-4 text-slate-200 outline-none font-mono tracking-wider focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Report Card */}
                    <div className="w-full md:w-1/2 glass-card">
                        <label className="font-medium text-slate-300 mb-6 block text-lg">{isHi ? "WCAG कंप्लायंस" : "WCAG Compliance Ratings"}</label>
                        
                        <div className="grid grid-cols-2 gap-4">
                            
                            {/* AA Normal */}
                            <div className={`p-4 rounded-xl border-l-4 ${contrastInfo.aaNormal ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200">AA Normal</span>
                                    {contrastInfo.aaNormal ? (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "पास" : "Pass"}</span>
                                    ) : (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "फेल" : "Fail"}</span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">{isHi ? "न्यूनतम: 4.5:1" : "Required: 4.5:1"}</span>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Standard 14pt (18px) regular weight text.</p>
                            </div>

                            {/* AA Large */}
                            <div className={`p-4 rounded-xl border-l-4 ${contrastInfo.aaLarge ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200">AA Large</span>
                                    {contrastInfo.aaLarge ? (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "पास" : "Pass"}</span>
                                    ) : (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "फेल" : "Fail"}</span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">{isHi ? "न्यूनतम: 3.0:1" : "Required: 3.0:1"}</span>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Large 18pt (24px) or 14pt (18px) bold text.</p>
                            </div>

                            {/* AAA Normal */}
                            <div className={`p-4 rounded-xl border-l-4 ${contrastInfo.aaaNormal ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200">AAA Normal</span>
                                    {contrastInfo.aaaNormal ? (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "पास" : "Pass"}</span>
                                    ) : (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "फेल" : "Fail"}</span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">{isHi ? "न्यूनतम: 7.0:1" : "Required: 7.0:1"}</span>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Enhanced contrast for standard text sizes.</p>
                            </div>

                            {/* AAA Large */}
                            <div className={`p-4 rounded-xl border-l-4 ${contrastInfo.aaaLarge ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200">AAA Large</span>
                                    {contrastInfo.aaaLarge ? (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "पास" : "Pass"}</span>
                                    ) : (
                                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-bold uppercase">{isHi ? "फेल" : "Fail"}</span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400">{isHi ? "न्यूनतम: 4.5:1" : "Required: 4.5:1"}</span>
                                <p className="text-xs text-slate-500 mt-2 leading-relaxed">Enhanced contrast for large text elements.</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/color-contrast" tools={ALL_TOOLS} />
        </div>
    );
}
