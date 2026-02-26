"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { generatePassportPhoto, PASSPORT_SPECS } from "@/utils/passport-photo";

const COUNTRIES = Object.values(PASSPORT_SPECS);

const faqs = [
    { question: "What size is generated?", questionHi: "कौन सा साइज़ बनता है?", answer: "Indian passport format 35×45mm with white background.", answerHi: "भारतीय पासपोर्ट फ़ॉर्मेट 35×45mm, सफ़ेद बैकग्राउंड के साथ।" },
    { question: "Does it work for visa photos?", questionHi: "क्या यह वीज़ा फ़ोटो के लिए काम करता है?", answer: "Yes, the size is compatible with both passport and visa requirements.", answerHi: "हाँ, पासपोर्ट और वीज़ा दोनों के लिए सही साइज़ बनता है।" },
    { question: "Is it processed locally?", questionHi: "क्या यह लोकली प्रोसेस होता है?", answer: "Yes, your photo is processed in your browser.", answerHi: "हाँ, आपकी फ़ोटो ब्राउज़र में ही प्रोसेस होती है।" },
];

export default function PassportPhotoPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [country, setCountry] = useState("india");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);

    const selected = PASSPORT_SPECS[country] || PASSPORT_SPECS.india;

    const handleFilesSelected = async (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setOriginalDims(null);
        if (f.length) {
            const bmp = await createImageBitmap(f[0]);
            setOriginalDims({ w: bmp.width, h: bmp.height });
            bmp.close();
        }
    };

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(5);

        try {
            const resultFile = await generatePassportPhoto(files[0], country);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(isHi ? "फ़ोटो बनाना विफल रहा। सुनिश्चित करें कि चेहरा साफ़ दिखाई दे रहा है।" : "Failed to generate photo. Make sure the face is clearly visible.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📸 पासपोर्ट फ़ोटो बनाएँ" : "📸 Passport Photo Maker"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "बैकग्राउंड हटाकर पासपोर्ट साइज की फोटो बनाएं" : "Generate regulation-size passport photos with AI background removal"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    ⚡ {isHi ? "क्लाइंट-साइड AI" : "Client-side AI"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={handleFilesSelected} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} hint={isHi ? "पासपोर्ट साइज के लिए" : "For passport size"} />

                {files.length > 0 && (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={URL.createObjectURL(files[0])} alt="Preview" className="w-20 h-24 object-cover rounded-lg border border-slate-600/50" />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            {originalDims && (
                                <p className="text-xs text-slate-400 mt-1">{isHi ? "मूल:" : "Original:"} <span className="text-amber-400 font-semibold">{originalDims.w}×{originalDims.h}px</span></p>
                            )}
                            <p className="text-xs text-slate-500 mt-0.5">{isHi ? "आउटपुट:" : "Output:"} <span className="text-indigo-400 font-semibold">{selected.w_mm}×{selected.h_mm}mm</span> → {selected.width}×{selected.height}px ({selected.label})</p>
                            <p className="text-xs text-slate-600 mt-0.5">{isHi ? "सफ़ेद बैकग्राउंड, ऑटो-क्रॉप्ड" : "White background, auto-cropped"}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "देश का प्रारूप" : "Country Format"}</label>
                    <div className="flex flex-wrap gap-2">
                        {COUNTRIES.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => setCountry(c.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${country === c.value
                                    ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300"
                                    : "bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "फ़ोटो बनाएँ" : "Generate Photo"}</button>

                <ProgressBar progress={progress} label={progress > 0 && progress < 100 ? (isHi ? "बैकग्राउंड हटाया जा रहा है (इसमें कुछ समय लग सकता है)..." : "Removing background (this may take a moment)...") : undefined} />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Passport Photo" className="max-h-72 object-contain rounded shadow-lg" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, "passport_photo.jpg")} label={isHi ? "फ़ोटो डाउनलोड करें" : "Download Photo"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/passport-photo-maker" tools={ALL_TOOLS} />
        </div>
    );
}
