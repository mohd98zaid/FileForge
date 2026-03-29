"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// --- Color Math Utilities ---

const hexToHsl = (hex: string) => {
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

const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const validateHex = (hex: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex);

const faqs = [
    { question: "What is a Complementary color?", questionHi: "पूरक (Complementary) रंग क्या है?", answer: "Complementary colors are opposite each other on the color wheel (180 degrees apart). They create high contrast and vibrant looks.", answerHi: "पूरक रंग रंग चक्र (180 डिग्री अलग) पर एक दूसरे के विपरीत होते हैं। वे उच्च कंट्रास्ट और जीवंत रूप बनाते हैं।" },
    { question: "What are Analogous colors?", questionHi: "अनुरूप (Analogous) रंग क्या हैं?", answer: "Analogous colors are next to each other on the color wheel. They usually match well and create serene and comfortable designs.", answerHi: "अनुरूप रंग रंग चक्र पर एक दूसरे के बगल में होते हैं। वे आम तौर पर अच्छी तरह मेल खाते हैं और शांत और आरामदायक डिजाइन बनाते हैं।" },
    { question: "What is a Triadic palette?", questionHi: "ट्रायडिक (Triadic) पैलेट क्या है?", answer: "A triadic color scheme uses colors that are evenly spaced around the color wheel (120 degrees apart), offering high contrast while retaining harmony.", answerHi: "एक ट्रायडिक रंग योजना उन रंगों का उपयोग करती है जो रंग चक्र (120 डिग्री अलग) के चारों ओर समान रूप से दूरी पर होते हैं, जो सद्भाव बनाए रखते हुए उच्च कंट्रास्ट प्रदान करते हैं।" },
];

export default function PaletteGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [baseColor, setBaseColor] = useState("#6366F1"); // Indigo
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("#")) val = "#" + val;
        setBaseColor(val.slice(0, 7));
    };

    // Derived Palettes (Always arrays of 5 hex strings based on the baseColor)
    const palettes = useMemo(() => {
        if (!validateHex(baseColor)) return null;
        
        const hsl = hexToHsl(baseColor);
        const { h, s, l } = hsl;
        
        // Helper to safely shift hue (wrap around 360)
        const shiftH = (val: number) => (h + val + 360) % 360;
        
        // Helper to safely shift lightness (clamp 0-100)
        const shiftL = (baseL: number, val: number) => Math.min(100, Math.max(0, baseL + val));

        return {
            monochromatic: [
                hslToHex(h, s, shiftL(l, 40)),
                hslToHex(h, s, shiftL(l, 20)),
                baseColor.toUpperCase(),
                hslToHex(h, s, shiftL(l, -20)),
                hslToHex(h, s, shiftL(l, -40)),
            ],
            analogous: [
                hslToHex(shiftH(-60), s, l),
                hslToHex(shiftH(-30), s, l),
                baseColor.toUpperCase(),
                hslToHex(shiftH(30), s, l),
                hslToHex(shiftH(60), s, l),
            ],
            complementary: [
                hslToHex(h, s, shiftL(l, 20)),
                baseColor.toUpperCase(),
                hslToHex(shiftH(180), s, l),
                hslToHex(shiftH(180), s, shiftL(l, 20)),
                hslToHex(shiftH(180), s, shiftL(l, -20)),
            ],
            triadic: [
                hslToHex(h, s, shiftL(l, 20)),
                baseColor.toUpperCase(),
                hslToHex(shiftH(120), s, l),
                hslToHex(shiftH(240), s, l),
                hslToHex(shiftH(240), s, shiftL(l, -20)),
            ]
        };
    }, [baseColor]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHex(text);
        setTimeout(() => setCopiedHex(null), 2000);
    };

    const copyJSON = (palette: string[]) => {
        const jsonString = JSON.stringify(palette, null, 2);
        copyToClipboard(jsonString);
    };

    const copyTailwind = (name: string, palette: string[]) => {
        const config = {
            [name.toLowerCase()]: {
                100: palette[0],
                300: palette[1],
                500: palette[2],
                700: palette[3],
                900: palette[4],
            }
        };
        copyToClipboard(JSON.stringify(config, null, 2).slice(1, -1).trim());
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎨 पैलेट जनरेटर" : "🎨 Color Palette Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "एक आधार रंग चुनें और तुरंत सामंजस्यपूर्ण रंग योजनाएं उत्पन्न करें" : "Pick a base color and instantly generate harmonious color schemes"}</p>
            </div>

            <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
                
                {/* Base Color Input Area */}
                <div className="glass-card flex flex-col sm:flex-row items-center gap-6 w-full max-w-md">
                    <div 
                        className="w-20 h-20 rounded-full shadow-lg border-4 border-slate-700/50 relative overflow-hidden"
                        style={{ backgroundColor: validateHex(baseColor) ? baseColor : '#000000' }}
                    >
                        <input 
                            type="color" 
                            value={validateHex(baseColor) ? baseColor : '#000000'}
                            onChange={(e) => setBaseColor(e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex-1 w-full relative">
                        <label className="text-sm font-bold text-slate-300 mb-2 block">{isHi ? "आधार रंग (Base Color)" : "Base Color (HEX)"}</label>
                        <input
                            type="text"
                            value={baseColor.replace("#", "")}
                            onChange={handleBaseChange}
                            maxLength={6}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 outline-none font-mono tracking-wider focus:border-indigo-500 uppercase"
                            placeholder="6366F1"
                        />
                        <div className="absolute inset-y-0 right-3 bottom-0 flex items-center pointer-events-none mt-7">
                            <span className="text-slate-500 font-mono text-xs">HEX</span>
                        </div>
                    </div>
                </div>

                {/* Palettes Display */}
                {palettes && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {Object.entries(palettes).map(([name, colors]) => (
                            <div key={name} className="glass-card flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-slate-200 capitalize">{name} Scheme</h3>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => copyJSON(colors)}
                                            className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                                            title="Copy as JSON Array"
                                        >
                                            {copiedHex === JSON.stringify(colors, null, 2) ? 'Copied' : 'JSON'}
                                        </button>
                                        <button 
                                            onClick={() => copyTailwind(name, colors)}
                                            className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                                            title="Copy as Tailwind Config Object"
                                        >
                                            TW
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex h-32 w-full rounded-xl overflow-hidden border border-slate-700/50 shadow-inner">
                                    {colors.map((color, idx) => (
                                        <div 
                                            key={`${name}-${idx}`} 
                                            className="flex-1 group relative cursor-pointer transition-all hover:flex-[1.5]"
                                            style={{ backgroundColor: color }}
                                            onClick={() => copyToClipboard(color)}
                                            title="Click to copy HEX"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px] transition-all">
                                                <span className="text-white font-mono text-sm font-bold tracking-wider drop-shadow-md bg-black/40 px-2 py-1 rounded">
                                                    {copiedHex === color ? "COPIED" : color}
                                                </span>
                                            </div>
                                            {/* Base Color Indicator */}
                                            {color === baseColor.toUpperCase() && (
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-sm ring-1 ring-black/20"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/palette-generator" tools={ALL_TOOLS} />
        </div>
    );
}
