"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";

const faqs = [
    { question: "Can I download the panorama viewer?", questionHi: "क्या मैं पैनोरमा व्यूअर डाउनलोड कर सकता हूँ?", answer: "This tool is strictly for previewing 360-degree or ultra-wide images seamlessly in your browser.", answerHi: "यह टूल सख्ती से आपके ब्राउज़र में 360-डिग्री या अल्ट्रा-वाइड छवियों का निर्बाध रूप से पूर्वावलोकन करने के लिए है।" },
];

export default function PanoramaPreviewPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(f[0]));
    };

    return (
        <ToolLayout
            title={isHi ? "👀 पैनोरमा पूर्वावलोकन" : "👀 Panorama Preview"}
            description={isHi ? "Ultra-wide और 360° पैनोरमिक फ़ोटो का पूर्ण-स्क्रीन में पूर्वावलोकन करें" : "Preview ultra-wide and panoramic photos in an immersive scrolling container"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "पैनोरमा छवि यहाँ छोड़ें" : "Drop a Panoramic Image Here"} />
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <span className="text-slate-300 font-medium truncate max-w-xs">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded">
                                {isHi ? "नया चित्र चुनें" : "Change Image"}
                            </button>
                        </div>
                        
                        <div className="w-full relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden group">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full opacity-80 z-10 pointer-events-none">
                                {isHi ? "स्क्रॉल करने के लिए खींचें" : "Scroll horizontally to view"}
                            </div>
                            
                            {/* Horizontal scrolling container */}
                            <div className="w-full overflow-x-auto overflow-y-hidden" style={{ height: "65vh" }}>
                                {previewUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={previewUrl} 
                                        alt="Panorama Preview" 
                                        className="h-full w-auto max-w-none object-cover" 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
