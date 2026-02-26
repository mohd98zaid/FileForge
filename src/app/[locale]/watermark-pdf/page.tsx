"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { watermarkPdf } from "@/utils/pdf-processing";

const faqs = [
    { question: "Can I adjust position?", questionHi: "क्या पोज़ीशन बदल सकते हैं?", answer: "Yes, position and size are customizable.", answerHi: "हाँ, वॉटरमार्क की जगह और साइज़ दोनों बदल सकते हैं।" },
    { question: "Does it apply to all pages?", questionHi: "क्या सभी पेज पर लगता है?", answer: "Yes, watermark is applied to every page automatically.", answerHi: "हाँ, वॉटरमार्क PDF के हर पेज पर ऑटोमैटिक लग जाता है।" },
];

export default function WatermarkPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const tCommon = useTranslations("Common");

    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("DRAFT");
    const [opacity, setOpacity] = useState(30);
    const [color, setColor] = useState("#FF0000"); // Red default
    const [fontSize, setFontSize] = useState(60);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length || !text.trim()) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const resultFile = await watermarkPdf(
                files[0],
                text,
                opacity / 100,
                color,
                fontSize
            );
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || (isHi ? "वॉटरमार्क लगाना विफल रहा।" : "Watermark failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "💧 PDF पर वॉटरमार्क" : "💧 Watermark PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF पेज पर टेक्स्ट वॉटरमार्क लगाएँ" : "Add text watermark to all pages of a PDF"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={setFiles} label={tCommon("dropPdfHere")} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg">📄</div>
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{isHi ? "साइज़:" : "Size:"} <span className="text-indigo-400">{(files[0].size / 1024).toFixed(0)} KB</span></p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-1">{isHi ? "वॉटरमार्क टेक्स्ट" : "Watermark Text"}</label>
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" placeholder={isHi ? "उदा. गोपनीय (CONFIDENTIAL)" : "E.g. CONFIDENTIAL"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "रंग" : "Color"}</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-[42px] rounded cursor-pointer border border-slate-700/50" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "फ़ॉन्ट साइज़:" : "Font Size:"} {fontSize}px</label>
                        <input type="range" min={10} max={150} step={5} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">{isHi ? "पारदर्शिता (Opacity):" : "Opacity:"} {opacity}%</label>
                    <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-indigo-500" />
                </div>

                <button onClick={handleProcess} disabled={!files.length || !text.trim()} className="btn-primary w-full">{isHi ? "वॉटरमार्क लगाएँ" : "Add Watermark"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "watermarked.pdf")} label={isHi ? "वॉटरमार्क PDF डाउनलोड करें" : "Download Watermarked PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/watermark-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
