"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useCallback } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How does this work?", questionHi: "यह कैसे काम करता है?", answer: "This tool uses SVG color matrix filters applied via CSS directly in your browser. It shifts the red, green, and blue channels of your image to simulate how different types of color deficiency perceive those wavelengths.", answerHi: "यह टूल सीधे आपके ब्राउज़र में CSS के माध्यम से लागू SVG रंग मैट्रिक्स फ़िल्टर का उपयोग करता है। यह आपकी छवि के लाल, हरे और नीले चैनलों को यह अनुकरण करने के लिए स्थानांतरित करता है कि विभिन्न प्रकार की रंग की कमी उन तरंग दैर्ध्य को कैसे मानती है।" },
    { question: "What is Protanopia?", questionHi: "प्रोटानोपिया (Protanopia) क्या है?", answer: "Protanopia is a type of red-green color blindness where the red cones do not detect enough red and are too sensitive to greens, yellows, and oranges.", answerHi: "प्रोटानोपिया लाल-हरे रंग के अंधेपन का एक प्रकार है जहां लाल शंकु पर्याप्त लाल रंग का पता नहीं लगाते हैं और हरे, पीले और नारंगी के प्रति बहुत संवेदनशील होते हैं।" },
    { question: "What is Deuteranopia?", questionHi: "ड्यूटरानोपिया (Deuteranopia) क्या है?", answer: "Deuteranopia is the most common form of color blindness (green-blind). It makes greens look more red.", answerHi: "ड्यूटरानोपिया रंग अंधापन (हरा-अंधा) का सबसे आम रूप है। यह साग को अधिक लाल दिखाता है।" },
    { question: "What is Tritanopia?", questionHi: "ट्रिटानोपिया (Tritanopia) क्या है?", answer: "Tritanopia is a very rare blue-yellow color blindness. People with this condition confuse blue with green and yellow with violet.", answerHi: "ट्रिटानोपिया एक बहुत ही दुर्लभ नीला-पीला रंग अंधापन है। इस स्थिति वाले लोग नीले को हरे और पीले को बैंगनी के साथ मिलाते हैं।" },
];

// SVG Filter IDs
const FILTERS = [
    { id: "protanopia", name: "Protanopia", nameHi: "प्रोटानोपिया", desc: "Red-Blind", descHi: "लाल अंधा" },
    { id: "deuteranopia", name: "Deuteranopia", nameHi: "ड्यूटरानोपिया", desc: "Green-Blind", descHi: "हरा अंधा" },
    { id: "tritanopia", name: "Tritanopia", nameHi: "ट्रिटानोपिया", desc: "Blue-Blind", descHi: "नीला अंधा" },
    { id: "achromatopsia", name: "Achromatopsia", nameHi: "एक्रोमैटोप्सिया", desc: "Monochromacy", descHi: "मोनोक्रोमेसी (कुल अंधापन)" },
];

export default function ColorBlindnessSimulatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert(isHi ? "कृपया एक मान्य छवि अपलोड करें।" : "Please upload a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setSourceImage(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // Use a default demo image if none provided yet
    const displayImage = sourceImage || "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1080&auto=format&fit=crop"; 

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "👓 कलर ब्लाइंडनेस सिम्युलेटर" : "👓 Color Blindness Simulator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "देखें कि आपकी छवियां विभिन्न प्रकार के रंग दृष्टि दोष वाले लोगों को कैसी दिखाई देती हैं" : "See how your designs appear to people with different types of color vision deficiencies"}</p>
            </div>

            {/* SVG Filters Definition (Hidden) */}
            <svg style={{ display: 'none' }}>
                <defs>
                    {/* Protanopia (Red-Blind) */}
                    <filter id="filter-protanopia">
                        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
                    </filter>
                    {/* Deuteranopia (Green-Blind) */}
                    <filter id="filter-deuteranopia">
                        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
                    </filter>
                    {/* Tritanopia (Blue-Blind) */}
                    <filter id="filter-tritanopia">
                        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
                    </filter>
                    {/* Achromatopsia (Monochromacy) */}
                    <filter id="filter-achromatopsia">
                        <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
                    </filter>
                </defs>
            </svg>

            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Uploader / Original Preview */}
                <div className="glass-card flex flex-col items-center p-8">
                    {!sourceImage ? (
                        <div 
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center
                                ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500'}`}
                        >
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect}/>
                            
                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-200 mb-1">{isHi ? "परीक्षण करने के लिए डिज़ाइन अपलोड करें" : "Upload a design to test"}</h3>
                            <p className="text-slate-400 text-sm mb-4">{isHi ? "खींचें और छोड़ें या ब्राउज़ करें" : "Drag and drop or click to browse"}</p>
                            
                            <p className="text-xs text-indigo-400 max-w-md mx-auto italic">
                                {isHi ? "(नीचे एक डिफ़ॉल्ट डेमो छवि दिखाई गई है। अपनी खुद की छवि अपलोड करने के लिए यहां क्लिक करें।)" : "(A default demo image is shown below. Upload your own to replace it.)"}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">{isHi ? "आपकी मूल छवि" : "Your Original Image"}</h3>
                                <p className="text-sm text-slate-400">{isHi ? "पूरी तरह से रंग दृष्टि (Trichromacy)" : "Normal color vision (Trichromacy)"}</p>
                            </div>
                            <button 
                                onClick={() => setSourceImage(null)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                            >
                                {isHi ? "नया अपलोड करें" : "Upload New"}
                            </button>
                        </div>
                    )}

                    {/* Original Full Width Display */}
                    <div className="w-full max-w-4xl aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 mt-4 relative bg-slate-900">
                        <img 
                            src={displayImage} 
                            alt="Original" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg uppercase tracking-widest">
                            Original
                        </div>
                    </div>

                </div>

                {/* Simulated Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {FILTERS.map((filter) => (
                        <div key={filter.id} className="glass-card flex flex-col overflow-hidden p-0 group">
                            
                            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-200 text-lg">{isHi ? filter.nameHi : filter.name}</h4>
                                    <p className="text-sm text-slate-400">{isHi ? filter.descHi : filter.desc}</p>
                                </div>
                            </div>
                            
                            <div className="w-full aspect-[16/9] relative bg-slate-900 overflow-hidden">
                                <img 
                                    src={displayImage} 
                                    alt={`${filter.name} Simulation`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    style={{ filter: `url(#filter-${filter.id})` }}
                                />
                            </div>

                        </div>
                    ))}
                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/color-blindness-simulator" tools={ALL_TOOLS} />
        </div>
    );
}
