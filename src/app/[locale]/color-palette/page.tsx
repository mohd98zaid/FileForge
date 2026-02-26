"use client";

import { useLocale } from "next-intl";

import { useState, useRef } from "react";
// @ts-ignore
import ColorThief from "colorthief";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import FileUpload from "@/components/FileUpload";

const faqs = [
    { question: "How many colors are extracted?", questionHi: "कितने रंग निकलते हैं?", answer: "The most prominent colors are automatically extracted from the image.", answerHi: "इमेज से सबसे प्रमुख रंग ऑटोमैटिक निकाले जाते हैं।" },
    { question: "Can I copy color codes?", questionHi: "क्या कलर कोड कॉपी कर सकते हैं?", answer: "Yes, click any color to copy its hex code.", answerHi: "हाँ, किसी भी रंग पर क्लिक करके hex कोड कॉपी करें।" },
];

export default function ColorPalettePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [image, setImage] = useState<string | null>(null);
    const [palette, setPalette] = useState<string[]>([]);
    const [dominant, setDominant] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleImageUpload = (files: File[]) => {
        if (!files.length) return;
        const url = URL.createObjectURL(files[0]);
        setImage(url);
        // Reset state, wait for image load to process
        setPalette([]);
        setDominant(null);
    };

    const processImage = () => {
        const img = imgRef.current;
        if (!img) return;

        try {
            const thief = new ColorThief();
            const dom = thief.getColor(img);
            const pal = thief.getPalette(img, 10);

            setDominant(rgbToHex(dom));
            setPalette(pal.map((c: number[]) => rgbToHex(c)));
        } catch (e) {
            console.error("Color extraction failed", e);
        }
    };

    const rgbToHex = (rgb: number[]) => {
        return "#" + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    };

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
        // fast feedback could be added here
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎨 रंग पैलेट" : "🎨 Color Palette Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "इमेज से कलर पैलेट निकालें" : "Extract beautiful color palettes from any image"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="glass-card">
                    <FileUpload
                        accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".bmp"] }}
                        maxFiles={1}
                        onFilesSelected={handleImageUpload}
                        label={image ? (isHi ? "दूसरी इमेज अपलोड करें" : "Upload another image") : (isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here")}
                        hint={isHi ? "JPG, PNG, WebP — हम तुरंत रंग निकाल लेंगे" : "JPG, PNG, WebP — we'll extract the colors instantly"}
                    />

                    {image && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imgRef}
                                    src={image}
                                    alt={isHi ? "स्रोत (Source)" : "Source"}
                                    className="w-full h-auto object-cover"
                                    onLoad={processImage}
                                    crossOrigin="anonymous"
                                />
                            </div>

                            <div className="space-y-6">
                                {dominant && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{isHi ? "प्रमुख (Dominant)" : "Dominant"}</h3>
                                        <div
                                            onClick={() => copyToClipboard(dominant)}
                                            className="h-24 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform flex items-end p-4 group"
                                            style={{ backgroundColor: dominant }}
                                        >
                                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                {dominant} <span className="text-xs opacity-70 ml-1">{isHi ? "कॉपी हो गया" : "COPIED"}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {palette.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{isHi ? "पैलेट (Palette)" : "Palette"}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            {palette.map((color, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => copyToClipboard(color)}
                                                    className="h-16 rounded-lg shadow cursor-pointer transform hover:scale-105 transition-transform flex items-center justify-center group"
                                                    style={{ backgroundColor: color }}
                                                >
                                                    <span className="text-xs font-mono text-white/90 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {color}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/color-palette" tools={ALL_TOOLS} />
        </div>
    );
}
