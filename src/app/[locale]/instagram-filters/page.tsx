"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How do these filters work?", questionHi: "ये फिल्टर कैसे काम करते हैं?", answer: "These filters use standard CSS properties (like contrast, brightness, sepia, hue-rotate) to perfectly mimic famous photo filters, all applied instantly in your browser.", answerHi: "ये फ़िल्टर प्रसिद्ध फ़ोटो फ़िल्टर की पूरी तरह से नकल करने के लिए मानक CSS गुणों (जैसे कंट्रास्ट, ब्राइटनेस, सीपिया, ह्यू-रोटेट) का उपयोग करते हैं, जो सभी आपके ब्राउज़र में तुरंत लागू होते हैं।" },
    { question: "Is my image uploaded anywhere?", questionHi: "क्या मेरी छवि कहीं अपलोड की गई है?", answer: "No. The entire editing process and image rendering is done natively on your device using the HTML5 Canvas API.", answerHi: "नहीं। संपूर्ण संपादन प्रक्रिया और छवि रेंडरिंग मूल रूप से आपके डिवाइस पर HTML5 कैनवास एपीआई का उपयोग करके की जाती है।" },
    { question: "Will the downloaded image keep its original resolution?", questionHi: "क्या डाउनलोड की गई छवि अपना मूल रिज़ॉल्यूशन बनाए रखेगी?", answer: "Yes. Even though the preview might be scaled down to fit your screen, the final downloaded image will apply the filters to your original, full-resolution upload.", answerHi: "हाँ। भले ही पूर्वावलोकन आपकी स्क्रीन पर फ़िट होने के लिए छोटा किया जा सकता है, अंतिम डाउनलोड की गई छवि आपके मूल, पूर्ण-रिज़ॉल्यूशन अपलोड पर फ़िल्टर लागू करेगी।" }
];


// Famous app-like filters modeled with CSS variables
type FilterPreset = {
    name: string;
    filterGroup: string; // CSS standard filter string
    blendColor?: string; // Optional pseudo-element blend layer overlay (e.g. rgba(255,0,0,0.1))
    blendMode?: GlobalCompositeOperation;
};

const FILTERS: FilterPreset[] = [
    { name: "Normal", filterGroup: "none" },
    { name: "Clarendon", filterGroup: "contrast(1.2) saturate(1.35)", blendColor: "rgba(127, 187, 227, 0.2)", blendMode: "overlay" },
    { name: "Gingham", filterGroup: "brightness(1.05) hue-rotate(-10deg)", blendColor: "rgba(230, 230, 250, 0.3)", blendMode: "soft-light" },
    { name: "Moon", filterGroup: "grayscale(1) contrast(1.1) brightness(1.1)" },
    { name: "Lark", filterGroup: "contrast(0.9) saturate(1.1) brightness(1.2)", blendColor: "rgba(34, 34, 34, 0.1)", blendMode: "color-burn" },
    { name: "Reyes", filterGroup: "sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)" },
    { name: "Juno", filterGroup: "saturate(1.5) contrast(1.1) brightness(1.15) hue-rotate(-15deg)" },
    { name: "Slumber", filterGroup: "saturate(0.66) brightness(1.05)", blendColor: "rgba(69, 41, 13, 0.4)", blendMode: "soft-light" },
    { name: "Crema", filterGroup: "sepia(0.5) contrast(1.1) brightness(1.15) saturate(0.9)" },
    { name: "Ludwig", filterGroup: "sepia(0.25) contrast(1.05) saturate(1.5) hue-rotate(-10deg)" },
    { name: "Aden", filterGroup: "hue-rotate(-20deg) contrast(0.9) saturate(0.85) brightness(1.2)", blendColor: "rgba(66, 10, 14, 0.2)", blendMode: "darken" },
    { name: "Perpetua", filterGroup: "contrast(1.1)", blendColor: "rgba(0, 91, 154, 0.2)", blendMode: "soft-light" },
    { name: "Amaro", filterGroup: "sepia(0.35) contrast(1.1) brightness(1.2) saturate(1.3)" },
    { name: "Mayfair", filterGroup: "contrast(1.1) saturate(1.1)", blendColor: "rgba(255, 200, 200, 0.2)", blendMode: "overlay" },
    { name: "Nashville", filterGroup: "sepia(0.2) contrast(1.2) brightness(1.05) saturate(1.2)", blendColor: "rgba(247, 176, 153, 0.3)", blendMode: "darken" },
    { name: "Noir", filterGroup: "grayscale(1) contrast(1.3) brightness(0.9)" }
];

export default function InstagramFiltersPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterPreset>(FILTERS[0]);
    
    // Original dimensions for accurate canvas download
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            // Load once into an invisible image to get real dimensions immediately
            const img = new Image();
            img.onload = () => {
                setImgWidth(img.width);
                setImgHeight(img.height);
                setSelectedImage(result);
                setActiveFilter(FILTERS[0]); // Reset filter on new image
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    };

    const downloadRenderedImage = () => {
        if (!selectedImage || !canvasRef.current || !imgRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas to ORIGINAL image dimensions for high-res download
        canvas.width = imgWidth;
        canvas.height = imgHeight;

        // Apply CSS filter
        ctx.filter = activeFilter.filterGroup;
        ctx.drawImage(imgRef.current, 0, 0, imgWidth, imgHeight);

        // Apply optional blend color overlay
        if (activeFilter.blendColor && activeFilter.blendMode) {
            ctx.filter = 'none'; // Reset filter so we don't apply it to the colored rect
            ctx.globalCompositeOperation = activeFilter.blendMode;
            ctx.fillStyle = activeFilter.blendColor;
            ctx.fillRect(0, 0, imgWidth, imgHeight);
            
            // Reset for safety
            ctx.globalCompositeOperation = 'source-over';
        }

        // Generate download
        const link = document.createElement('a');
        link.download = `fileforge-${activeFilter.name.toLowerCase()}-filter.jpg`;
        // Use JPEG for photo filters usually sizes better
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    };


    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                    {isHi ? "ब्राउज़र में छवि संपादन" : "In-Browser Image Editing"}
                </div>
                <h1 className="section-title">{isHi ? "🎨 फोटो फिल्टर (इंस्टाग्राम स्टाइल)" : "🎨 Photo Filters"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "तुरंत 15+ प्रसिद्ध फोटो फिल्टर लागू करें" : "Apply 15+ stunning photo filters instantly in your browser"}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">

                <div className="glass-card p-6 flex flex-col items-center border-t-4 border-t-pink-500">
                    
                    {/* Media Container */}
                    <div className="relative w-full max-w-2xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col items-center justify-center aspect-square sm:aspect-[4/3]">
                        
                        {selectedImage ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* The invisible source image driving the real pixels */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    ref={imgRef}
                                    src={selectedImage} 
                                    className="hidden"
                                    alt="Source" 
                                />
                                
                                {/* The highly optimized Visual Preview using pure CSS directly on the DOM node */}
                                <div 
                                    className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center transition-all duration-300"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={selectedImage}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                        style={{ 
                                            filter: activeFilter.filterGroup,
                                            transition: 'filter 0.3s ease-out'
                                        }}
                                    />
                                    {/* Blend Mode Overlay Hack for CSS preview */}
                                    {activeFilter.blendColor && (
                                         <div 
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                backgroundColor: activeFilter.blendColor,
                                                mixBlendMode: activeFilter.blendMode as any
                                            }}
                                         />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-6 flex flex-col items-center">
                                <div className="text-6xl mb-4 text-pink-400">📸</div>
                                <p className="text-slate-400 mb-6">{isHi ? "फ़िल्टर करने के लिए एक छवि चुनें" : "Select an image to apply filters"}</p>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    id="upload-image-od-empty"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="upload-image-od-empty" className="btn-primary cursor-pointer hover:scale-105 transition-transform">
                                    {isHi ? "छवि ब्राउज़ करें" : "Browse Image"}
                                </label>
                            </div>
                        )}
                        
                        {/* Hidden canvas used solely for high-res downloading */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Filter Strip */}
                    {selectedImage && (
                        <div className="w-full mt-8">
                            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider pl-2">{isHi ? "फ़िल्टर चुनें" : "Select a Filter"}</h3>
                            <div className="flex overflow-x-auto gap-4 pb-4 px-2 snap-x scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                {FILTERS.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setActiveFilter(preset)}
                                        className={`snap-start flex flex-col items-center gap-2 group outline-none min-w-[80px] shrink-0`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl overflow-hidden relative transition-all duration-200 ${activeFilter.name === preset.name ? 'ring-4 ring-pink-500 scale-105' : 'ring-1 ring-slate-700 opacity-70 group-hover:opacity-100 group-hover:scale-105 group-hover:ring-slate-500'}`}>
                                             {/* Mini Preview using CSS */}
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img 
                                                src={selectedImage}
                                                alt={preset.name}
                                                className="w-full h-full object-cover"
                                                style={{ filter: preset.filterGroup }}
                                             />
                                             {/* Mini Blend */}
                                             {preset.blendColor && (
                                                <div 
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{
                                                        backgroundColor: preset.blendColor,
                                                        mixBlendMode: preset.blendMode as any
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium transition-colors ${activeFilter.name === preset.name ? 'text-pink-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                            {preset.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Controls Footer */}
                    {selectedImage && (
                        <div className="mt-8 flex flex-wrap gap-4 justify-center w-full">
                            <input 
                                type="file" 
                                accept="image/*"
                                id="upload-image-od"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="upload-image-od" className="btn-secondary cursor-pointer">
                                {isHi ? "छवि बदलें" : "New Image"}
                            </label>
                            
                            <button 
                                onClick={downloadRenderedImage}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                {isHi ? "डाउनलोड करें" : "Download Full Res"}
                            </button>
                        </div>
                    )}
                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/instagram-filters" tools={ALL_TOOLS} />
        </div>
    );
}
