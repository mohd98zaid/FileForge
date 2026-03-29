"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is a CSS Gradient?", questionHi: "CSS ग्रेडिएंट क्या है?", answer: "A gradient creates a smooth transition between two or more colors. Linear gradients go in a straight line, radial gradients radiate from a center point.", answerHi: "ग्रेडिएंट दो या अधिक रंगों के बीच एक सहज संक्रमण बनाता है।" },
    { question: "Can I use this in Tailwind CSS?", questionHi: "क्या मैं इसे टेलविंड CSS में उपयोग कर सकता हूँ?", answer: "Yes! Copy the generated CSS and use it as `bg-[linear-gradient(...)]` in Tailwind.", answerHi: "हाँ! जनरेट किए गए CSS को टेलविंड में `bg-[linear-gradient(...)]` के रूप में उपयोग करें।" },
    { question: "How many colors can I use?", questionHi: "कितने रंग उपयोग कर सकते हैं?", answer: "You can add up to 6 color stops for rich, multi-color gradients.", answerHi: "आप 6 रंग स्टॉप तक जोड़ सकते हैं।" },
];

const PRESETS = [
    { colors: ["#4F46E5", "#EC4899"], angle: 90 },
    { colors: ["#10B981", "#3B82F6"], angle: 135 },
    { colors: ["#F59E0B", "#EF4444"], angle: 45 },
    { colors: ["#8B5CF6", "#06B6D4"], angle: 180 },
    { colors: ["#1E293B", "#0F172A"], angle: 90 },
    { colors: ["#FF6B6B", "#FFE66D", "#4ECDC4"], angle: 120 },
];

export default function GradientGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [colors, setColors] = useState(["#4F46E5", "#EC4899"]);
    const [angle, setAngle] = useState(90);
    const [type, setType] = useState<"linear" | "radial">("linear");
    const [copied, setCopied] = useState(false);

    const cssString = type === "linear"
        ? `linear-gradient(${angle}deg, ${colors.join(", ")})`
        : `radial-gradient(circle, ${colors.join(", ")})`;
    const fullCss = `background: ${colors[0]};\nbackground: -webkit-${cssString};\nbackground: ${cssString};`;

    const copyCSS = () => {
        navigator.clipboard.writeText(fullCss);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addColor = () => { if (colors.length < 6) setColors([...colors, "#ffffff"]); };
    const removeColor = (i: number) => { if (colors.length > 2) setColors(colors.filter((_, idx) => idx !== i)); };
    const updateColor = (i: number, val: string) => { const c = [...colors]; c[i] = val; setColors(c); };

    const swapColors = () => { setColors([...colors].reverse()); };
    const randomGradient = () => {
        const rc = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
        setColors([rc(), rc()]);
        setAngle(Math.floor(Math.random() * 360));
    };
    const applyPreset = (p: typeof PRESETS[0]) => { setColors(p.colors); setAngle(p.angle); setType("linear"); };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌈 ग्रेडिएंट जनरेटर" : "🌈 CSS Gradient Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "खूबसूरत CSS ग्रेडिएंट्स बनाएं और एक्सपोर्ट करें" : "Create beautiful CSS gradients and export the code"}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Preview */}
                <div className="w-full h-64 md:h-80 rounded-2xl shadow-2xl transition-all duration-300 border border-slate-700/50 relative group"
                    style={{ background: cssString }}>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={randomGradient} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white transition shadow-lg">
                            {isHi ? "🎲 रैंडम" : "🎲 Random"}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-6">
                    {/* Color Editor */}
                    <div className="md:col-span-7 glass-card space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{isHi ? "रंग" : "Colors"}</h3>
                            <button onClick={addColor} disabled={colors.length >= 6}
                                className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition">
                                + {isHi ? "रंग जोड़ें" : "Add Color"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {colors.map((c, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/30">
                                    <input type="color" value={c} onChange={e => updateColor(i, e.target.value)}
                                        className="w-10 h-10 rounded cursor-pointer border-0 p-0 shrink-0" />
                                    <input type="text" value={c} onChange={e => updateColor(i, e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-slate-200 outline-none font-mono text-sm uppercase focus:border-indigo-500" />
                                    <button onClick={() => removeColor(i)} disabled={colors.length <= 2}
                                        className={`p-2 rounded transition ${colors.length <= 2 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={swapColors} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition">
                                ⇅ {isHi ? "उल्टा करें" : "Reverse"}
                            </button>
                        </div>

                        {/* Type & Angle */}
                        <div className="space-y-4 pt-4 border-t border-slate-700/50">
                            <div className="flex bg-slate-900 p-1 rounded-lg">
                                <button onClick={() => setType("linear")} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${type === "linear" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                                    {isHi ? "रैखिक" : "Linear"}
                                </button>
                                <button onClick={() => setType("radial")} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${type === "radial" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                                    {isHi ? "वृत्ताकार" : "Radial"}
                                </button>
                            </div>

                            {type === "linear" && (
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-bold text-slate-300">{isHi ? "कोण" : "Angle"}</label>
                                        <span className="text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded text-sm">{angle}°</span>
                                    </div>
                                    <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))}
                                        className="w-full accent-indigo-500" />
                                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                                        {[0, 45, 90, 135, 180, 225, 270, 315, 360].map(d => (
                                            <button key={d} onClick={() => setAngle(d)} className={`hover:text-indigo-400 ${angle === d ? "text-indigo-400 font-bold" : ""}`}>{d}°</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output & Presets */}
                    <div className="md:col-span-5 space-y-6">
                        {/* CSS Output */}
                        <div className="glass-card relative">
                            <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">{isHi ? "CSS आउटपुट" : "CSS Output"}</label>
                            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap min-h-[80px]">{fullCss}</pre>
                            <button onClick={copyCSS}
                                className={`mt-3 w-full py-3 rounded-xl font-bold text-sm transition-all ${copied ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}>
                                {copied ? (isHi ? "✓ कॉपी हुआ" : "✓ Copied") : (isHi ? "📋 CSS कॉपी करें" : "📋 Copy CSS")}
                            </button>
                        </div>

                        {/* Presets */}
                        <div className="glass-card">
                            <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">{isHi ? "सुंदर टेम्पलेट्स" : "Beautiful Presets"}</label>
                            <div className="grid grid-cols-6 gap-3">
                                {PRESETS.map((p, i) => (
                                    <button key={i} onClick={() => applyPreset(p)}
                                        className="w-full aspect-square rounded-full shadow-md hover:scale-110 transition-transform hover:shadow-lg border-2 border-transparent hover:border-white/50"
                                        style={{ background: `linear-gradient(${p.angle}deg, ${p.colors.join(", ")})` }}
                                        title={p.colors.join(" → ")} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/gradient-generator" tools={ALL_TOOLS} />
        </div>
    );
}
