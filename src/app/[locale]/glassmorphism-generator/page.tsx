"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is Glassmorphism?", questionHi: "ग्लासमॉर्फ़िज़्म क्या है?", answer: "Glassmorphism is a UI design trend emphasizing transparent, blurred backgrounds mimicking frosted glass.", answerHi: "ग्लासमॉर्फ़िज़्म एक UI डिज़ाइन ट्रेंड है जिसमें पाले से ओढ़े हुए शीशे की तरह पारदर्शी, धुंधले बैकग्राउंड का उपयोग किया जाता है।" },
];

export default function GlassmorphismGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [blur, setBlur] = useState(16);
    const [opacity, setOpacity] = useState(0.2);
    const [borderOpacity, setBorderOpacity] = useState(0.3);
    const [cardColor, setCardColor] = useState("rgba(255, 255, 255");
    const [cssCode, setCssCode] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const bgStr = `${cardColor}, ${opacity})`;
        const css = `background: ${bgStr};\nborder-radius: 16px;\nbox-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid ${cardColor}, ${borderOpacity});`;
        setCssCode(css);
    }, [blur, opacity, borderOpacity, cardColor]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "💠 ग्लासमॉर्फ़िज़्म जनरेटर" : "💠 Glassmorphism CSS"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "सुंदर फ्रॉस्टेड ग्लास UI प्रभाव बनाएँ" : "Create beautiful frosted glass UI effects"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Visual Preview */}
                <div className="w-full h-[400px] rounded-2xl flex items-center justify-center overflow-hidden transition-colors relative bg-slate-900 border border-slate-700/50">
                    {/* Background colorful elements to show blur */}
                    <div className="absolute top-10 left-10 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-10 right-10 w-48 h-48 bg-yellow-500 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-600 rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                    {/* The Glass Card */}
                    <div 
                        className="w-2/3 h-2/3 flex items-center justify-center text-white/80 font-semibold tracking-wider text-xl z-10 transition-all duration-300"
                        style={{
                            background: `${cardColor}, ${opacity})`,
                            backdropFilter: `blur(${blur}px)`,
                            WebkitBackdropFilter: `blur(${blur}px)`,
                            border: `1px solid ${cardColor}, ${borderOpacity})`,
                            borderRadius: '16px',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        Glassmorphism
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        {[
                            { label: isHi ? "ब्लर (Blur)" : "Blur", value: blur, setter: setBlur, min: 0, max: 40, unit: "px" },
                            { label: isHi ? "पारदर्शिता (Opacity)" : "Opacity", value: opacity, setter: setOpacity, min: 0, max: 1, step: 0.05, unit: "" },
                            { label: isHi ? "बॉर्डर पारदर्शिता (Border Opacity)" : "Border Opacity", value: borderOpacity, setter: setBorderOpacity, min: 0, max: 1, step: 0.05, unit: "" },
                        ].map((control, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{control.label}</span>
                                    <span className="text-indigo-400 font-mono">{control.value}{control.unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min={control.min}
                                    max={control.max}
                                    step={control.step || 1}
                                    value={control.value}
                                    onChange={(e) => control.setter(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 p-1 bg-slate-800 rounded-lg w-fit border border-slate-700">
                         <button onClick={() => setCardColor("rgba(255, 255, 255")} className={`px-4 py-2 text-sm rounded transition-colors ${cardColor.includes('255, 255, 255') ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Light Glass</button>
                         <button onClick={() => setCardColor("rgba(0, 0, 0")} className={`px-4 py-2 text-sm rounded transition-colors ${cardColor.includes('0, 0, 0') ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Dark Glass</button>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 min-h-[140px] whitespace-pre-wrap mb-4">
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
            <ToolLinks current="/glassmorphism-generator" tools={ALL_TOOLS} />
        </div>
    );
}
