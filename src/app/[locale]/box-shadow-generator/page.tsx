"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How handles inset shadows?", questionHi: "इनसेट शैडो कैसे काम करता है?", answer: "Toggle the inset switch to make the shadow appear inside the box instead of outside.", answerHi: "शैडो को बॉक्स के बाहर के बजाय अंदर दिखाने के लिए इनसेट स्विच (Inset) चालू करें।" },
    { question: "Is this CSS compatible across browsers?", questionHi: "क्या यह CSS सभी ब्राउज़र में काम करता है?", answer: "Yes, standard CSS box-shadow applies automatically across modern browsers without prefixes.", answerHi: "हाँ, स्टैंडर्ड CSS box-shadow आधुनिक ब्राउज़रों में ऑटोमैटिकली लागू हो जाता है।" },
];

export default function BoxShadowGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [hOffset, setHOffset] = useState(10);
    const [vOffset, setVOffset] = useState(10);
    const [blur, setBlur] = useState(25);
    const [spread, setSpread] = useState(0);
    const [color, setColor] = useState("rgba(0,0,0,0.5)"); // Default color in hex is hard for opacity, using hex picker + manual opacity usually, but standard input type=color gives hex.
    const [hexColor, setHexColor] = useState("#000000");
    const [opacity, setOpacity] = useState(0.5);
    const [inset, setInset] = useState(false);
    const [boxColor, setBoxColor] = useState("#6C63FF");
    const [bgColor, setBgColor] = useState("#1e1e2f");

    const [cssCode, setCssCode] = useState("");
    const [copied, setCopied] = useState(false);

    // Convert Hex + Opacity to RGBA
    useEffect(() => {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        setColor(`rgba(${r}, ${g}, ${b}, ${opacity})`);
    }, [hexColor, opacity]);

    useEffect(() => {
        const insetStr = inset ? " inset" : "";
        const shadowStr = `${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}${insetStr}`;
        setCssCode(`box-shadow: ${shadowStr};\n-webkit-box-shadow: ${shadowStr};\n-moz-box-shadow: ${shadowStr};`);
    }, [hOffset, vOffset, blur, spread, color, inset]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📦 बॉक्स शैडो जनरेटर" : "📦 Box Shadow Generator"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "सुंदर CSS बॉक्स शैडो बनाएँ और कस्टमाइज़ करें" : "Create and customize beautiful CSS box shadows"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Visual Preview */}
                <div 
                    className="w-full h-[400px] rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden transition-colors"
                    style={{ backgroundColor: bgColor }}
                >
                    <div 
                        className="w-48 h-48 rounded-xl transition-all duration-300"
                        style={{ 
                            backgroundColor: boxColor,
                            boxShadow: `${hOffset}px ${vOffset}px ${blur}px ${spread}px ${color}${inset ? ' inset' : ''}`
                        }}
                    ></div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Shadow Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{isHi ? "शैडो सेटिंग्स" : "Shadow Settings"}</h3>
                            
                            {[
                                { label: isHi ? "X-ऑफ़सेट (Horizontal)" : "Horizontal Offset", value: hOffset, setter: setHOffset, min: -100, max: 100 },
                                { label: isHi ? "Y-ऑफ़सेट (Vertical)" : "Vertical Offset", value: vOffset, setter: setVOffset, min: -100, max: 100 },
                                { label: isHi ? "ब्लर (Blur)" : "Blur", value: blur, setter: setBlur, min: 0, max: 100 },
                                { label: isHi ? "फैलाव (Spread)" : "Spread", value: spread, setter: setSpread, min: -50, max: 50 },
                            ].map((control, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{control.label}</span>
                                        <span className="text-indigo-400 font-mono">{control.value}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={control.min}
                                        max={control.max}
                                        value={control.value}
                                        onChange={(e) => control.setter(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Color & Box Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{isHi ? "रंग सेटिंग्स" : "Color Settings"}</h3>
                            
                            <div className="space-y-1">
                                <span className="text-sm text-slate-400 block mb-1">{isHi ? "शैडो का रंग (Shadow)" : "Shadow Color"}</span>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={hexColor} onChange={(e) => setHexColor(e.target.value)} className="h-10 w-full max-w-[80px] rounded cursor-pointer bg-slate-900 border border-slate-700 p-1" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{isHi ? "अपारदर्शिता (Opacity)" : "Shadow Opacity"}</span>
                                    <span className="text-indigo-400 font-mono">{Math.round(opacity * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <div className="space-y-1 flex-1">
                                    <span className="text-xs text-slate-500 block">{isHi ? "बॉक्स का रंग" : "Box Color"}</span>
                                    <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="h-8 w-full rounded cursor-pointer border-none" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <span className="text-xs text-slate-500 block">{isHi ? "पृष्ठभूमि (Background)" : "Background"}</span>
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-full rounded cursor-pointer border-none" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-800" />
                                    <span className="text-slate-300 text-sm">{isHi ? "इनसेट (Inset)" : "Inset Shadow"}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="pt-4 border-t border-slate-700/50">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 min-h-[100px] whitespace-pre-wrap mb-4">
                            {cssCode}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${copied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                        >
                            {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "CSS कॉपी करें" : "Copy CSS")}
                        </button>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/box-shadow-generator" tools={ALL_TOOLS} />
        </div>
    );
}
