"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is Box Shadow?", questionHi: "बॉक्स शैडो क्या है?", answer: "Box Shadow adds depth to elements by projecting a customizable shadow behind them. It's a key part of modern web design.", answerHi: "बॉक्स शैडो तत्वों के पीछे एक अनुकूलन योग्य छाया प्रोजेक्ट करके गहराई जोड़ता है। यह आधुनिक वेब डिज़ाइन का एक महत्वपूर्ण हिस्सा है।" },
    { question: "What is Glassmorphism?", questionHi: "ग्लासमॉर्फिज्म क्या है?", answer: "Glassmorphism is a UI trend that creates a frosted-glass effect using background blur and translucent colors.", answerHi: "ग्लासमॉर्फिज्म एक UI प्रवृत्ति है जो पृष्ठभूमि धुंधलापन और पारभासी रंगों का उपयोग करके पाले सेओढ़े-कांच का प्रभाव पैदा करती है।" },
];

export default function CssGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [activeTab, setActiveTab] = useState<"shadow" | "border" | "glass">("shadow");
    const [copied, setCopied] = useState(false);

    // Box Shadow State
    const [shadowX, setShadowX] = useState(0);
    const [shadowY, setShadowY] = useState(10);
    const [shadowBlur, setShadowBlur] = useState(15);
    const [shadowSpread, setShadowSpread] = useState(-3);
    const [shadowColor, setShadowColor] = useState("rgba(0,0,0,0.5)");
    const [shadowInset, setShadowInset] = useState(false);

    // Border Radius State
    const [tl, setTl] = useState(20);
    const [tr, setTr] = useState(20);
    const [br, setBr] = useState(20);
    const [bl, setBl] = useState(20);

    // Glassmorphism State
    const [glassBlur, setGlassBlur] = useState(10);
    const [glassTransparency, setGlassTransparency] = useState(0.2);
    const [glassColor, setGlassColor] = useState("#ffffff");
    const [glassOutline, setGlassOutline] = useState(0.1);

    const getShadowCSS = () => {
        return `box-shadow: ${shadowInset ? "inset " : ""}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;
    };

    const getRadiusCSS = () => {
        return `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
    };

    const hexToRgbForGlass = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) || 255;
        const g = parseInt(hex.slice(3, 5), 16) || 255;
        const b = parseInt(hex.slice(5, 7), 16) || 255;
        return `${r}, ${g}, ${b}`;
    };

    const getGlassCSS = () => {
        const rgb = hexToRgbForGlass(glassColor);
        return `background: rgba(${rgb}, ${glassTransparency});\nbackdrop-filter: blur(${glassBlur}px);\n-webkit-backdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(${rgb}, ${glassOutline});`;
    };

    const getActiveCSS = () => {
        switch (activeTab) {
            case "shadow": return getShadowCSS();
            case "border": return getRadiusCSS();
            case "glass": return getGlassCSS();
        }
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(getActiveCSS());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✨ CSS जनरेटर" : "✨ CSS Settings Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "जटिल CSS प्रभाव (छाया, गोलाई, ग्लास) डिज़ाइन करें और निकालें" : "Visually construct complex Box Shadows, Border Radiuses, and Glassmorphism effects"}</p>
            </div>

            <div className="glass-card max-w-6xl mx-auto flex flex-col pt-4">
                
                {/* Tabs */}
                <div className="flex justify-center border-b border-slate-700/50 mb-8 mx-4">
                    <button 
                        onClick={() => setActiveTab("shadow")}
                        className={`px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "shadow" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
                    >
                        {isHi ? "बॉक्स शैडो" : "Box Shadow"}
                    </button>
                    <button 
                        onClick={() => setActiveTab("border")}
                        className={`px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "border" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
                    >
                        {isHi ? "बॉर्डर रेडियस" : "Border Radius"}
                    </button>
                    <button 
                        onClick={() => setActiveTab("glass")}
                        className={`px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === "glass" ? "border-indigo-500 text-indigo-400" : "border-transparent text-slate-400 hover:text-slate-300"}`}
                    >
                        {isHi ? "ग्लासमॉर्फिज्म" : "Glassmorphism"}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 px-4 pb-4">
                    
                    {/* Controls Sidebar */}
                    <div className="w-full md:w-5/12 space-y-6">
                        
                        {activeTab === "shadow" && (
                            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 space-y-5 animate-fade-in">
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Horizontal Offset (X)</span>
                                        <span className="text-indigo-400 font-mono">{shadowX}px</span>
                                    </div>
                                    <input type="range" min="-100" max="100" value={shadowX} onChange={(e) => setShadowX(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Vertical Offset (Y)</span>
                                        <span className="text-indigo-400 font-mono">{shadowY}px</span>
                                    </div>
                                    <input type="range" min="-100" max="100" value={shadowY} onChange={(e) => setShadowY(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Blur Radius</span>
                                        <span className="text-indigo-400 font-mono">{shadowBlur}px</span>
                                    </div>
                                    <input type="range" min="0" max="150" value={shadowBlur} onChange={(e) => setShadowBlur(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Spread Radius</span>
                                        <span className="text-indigo-400 font-mono">{shadowSpread}px</span>
                                    </div>
                                    <input type="range" min="-50" max="100" value={shadowSpread} onChange={(e) => setShadowSpread(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Color (RGBA/HEX)</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        value={shadowColor} 
                                        onChange={(e) => setShadowColor(e.target.value)} 
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={shadowInset} onChange={(e) => setShadowInset(e.target.checked)} className="h-5 w-5 rounded border-slate-600 text-indigo-500 bg-slate-900" />
                                    <span className="text-slate-300">Inset (Inner Shadow)</span>
                                </label>
                            </div>
                        )}

                        {activeTab === "border" && (
                            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 space-y-5 animate-fade-in grid grid-cols-2 gap-4">
                                <div className="col-span-2 text-sm text-slate-400 mb-2">Adjust individual corners (in pixels)</div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Top Left</span>
                                        <span className="text-indigo-400 font-mono">{tl}px</span>
                                    </div>
                                    <input type="range" min="0" max="250" value={tl} onChange={(e) => setTl(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Top Right</span>
                                        <span className="text-indigo-400 font-mono">{tr}px</span>
                                    </div>
                                    <input type="range" min="0" max="250" value={tr} onChange={(e) => setTr(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Bottom Left</span>
                                        <span className="text-indigo-400 font-mono">{bl}px</span>
                                    </div>
                                    <input type="range" min="0" max="250" value={bl} onChange={(e) => setBl(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Bottom Right</span>
                                        <span className="text-indigo-400 font-mono">{br}px</span>
                                    </div>
                                    <input type="range" min="0" max="250" value={br} onChange={(e) => setBr(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>
                            </div>
                        )}

                        {activeTab === "glass" && (
                            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 space-y-5 animate-fade-in">
                                
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Blur Amount</span>
                                        <span className="text-indigo-400 font-mono">{glassBlur}px</span>
                                    </div>
                                    <input type="range" min="0" max="40" step="1" value={glassBlur} onChange={(e) => setGlassBlur(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Transparency</span>
                                        <span className="text-indigo-400 font-mono">{(glassTransparency * 100).toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0.01" max="1" step="0.01" value={glassTransparency} onChange={(e) => setGlassTransparency(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Background Color (HEX)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={glassColor} onChange={(e) => setGlassColor(e.target.value)} className="w-10 h-10 border-0 p-0 rounded cursor-pointer" />
                                        <input type="text" value={glassColor} onChange={(e) => setGlassColor(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500 font-mono" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Outline/Border Opacity</span>
                                        <span className="text-indigo-400 font-mono">{(glassOutline * 100).toFixed(0)}%</span>
                                    </div>
                                    <input type="range" min="0" max="1" step="0.01" value={glassOutline} onChange={(e) => setGlassOutline(Number(e.target.value))} className="w-full accent-indigo-500" />
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Preview Area */}
                    <div className="w-full md:w-7/12 flex flex-col gap-6">
                        
                        <div className={`w-full min-h-[350px] rounded-2xl border border-slate-700/50 flex items-center justify-center p-8 relative overflow-hidden flex-grow transition-colors duration-500
                            ${activeTab === 'glass' ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500' : 'bg-slate-900'}
                        `}>
                            {/* Decorative background elements for Glassmorphism demo */}
                            {activeTab === 'glass' && (
                                <>
                                    <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                                    <div className="absolute top-10 right-10 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                                    <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                                </>
                            )}

                            {/* Center Preview Element */}
                            <div 
                                className={`w-full max-w-[300px] h-[300px] transition-all duration-300 flex items-center justify-center
                                    ${activeTab !== 'glass' ? 'bg-indigo-600' : ''}
                                `}
                                style={
                                    activeTab === 'shadow' ? {boxShadow: `${shadowInset ? "inset " : ""}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`, borderRadius: "20px"} :
                                    activeTab === 'border' ? {borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`} :
                                    activeTab === 'glass' ? {
                                        background: `rgba(${hexToRgbForGlass(glassColor)}, ${glassTransparency})`,
                                        backdropFilter: `blur(${glassBlur}px)`,
                                        WebkitBackdropFilter: `blur(${glassBlur}px)`,
                                        border: `1px solid rgba(${hexToRgbForGlass(glassColor)}, ${glassOutline})`,
                                        borderRadius: "20px"
                                    } : {}
                                }
                            >
                                <span className={activeTab === 'glass' ? 'text-white/80 font-bold text-xl drop-shadow' : 'text-white font-bold text-xl drop-shadow'}>
                                    Preview
                                </span>
                            </div>
                        </div>

                        {/* CSS Output Box */}
                        <div className="relative group">
                            <div className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-indigo-400 font-bold uppercase tracking-wider z-10 border border-slate-700/50 rounded-md">CSS Output</div>
                            <pre className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                                {getActiveCSS()}
                            </pre>
                            <button
                                onClick={copyCSS}
                                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-600 shadow-md flex items-center gap-2"
                            >
                                {copied ? (
                                    <><svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Copied!</>
                                ) : (
                                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy CSS</>
                                )}
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/css-generator" tools={ALL_TOOLS} />
        </div>
    );
}
