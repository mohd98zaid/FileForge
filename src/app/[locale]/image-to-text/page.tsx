"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import { extractText } from "@/utils/ocr-processing";

const faqs = [
    { question: "Does it support Hindi?", questionHi: "क्या यह हिंदी सपोर्ट करता है?", answer: "Yes! OCR works in both English and Hindi.", answerHi: "हाँ! अंग्रेज़ी और हिंदी दोनों में OCR काम करता है।" },
    { question: "How accurate is it?", questionHi: "कितना सटीक है?", answer: "90%+ accuracy on clean images. Works best on scanned documents.", answerHi: "साफ़ इमेज पर 90%+ सटीकता। स्कैन की गई डॉक्यूमेंट पर सबसे अच्छा काम करता है।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free with no limits.", answerHi: "हाँ, पूरी तरह मुफ़्त, कोई लिमिट नहीं।" },
];

export default function ImageToTextPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [language, setLanguage] = useState("eng");
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setProgress(10);
        try {
            // Map our simple language codes to Tesseract codes if needed.
            // "eng", "hin" are standard. "eng+hin" is supported by Tesseract using '+' separator.
            const result = await extractText(files[0], language, setProgress);
            setText(result.text);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || (isHi ? "टेक्स्ट निकालना विफल हुआ।" : "OCR failed."));
            setProgress(0);
        }
    };

    const copyAll = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔍 इमेज से टेक्स्ट निकालें (OCR)" : "🔍 Image to Text (OCR)"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अंग्रेज़ी और हिंदी में टेक्स्ट निकालें" : "Extract text from images in English or Hindi"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={setFiles} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} hint={isHi ? "JPG, PNG, WebP" : "JPG, PNG, WebP"} />

                {files.length > 0 && (
                    <div className="relative w-full h-64 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={URL.createObjectURL(files[0])}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "भाषा" : "Language"}</label>
                    <div className="flex gap-3">
                        <button onClick={() => setLanguage("eng")} className={language === "eng" ? "btn-primary" : "btn-secondary"}>{isHi ? "अंग्रेज़ी" : "English"}</button>
                        <button onClick={() => setLanguage("hin")} className={language === "hin" ? "btn-primary" : "btn-secondary"}>{isHi ? "हिंदी" : "Hindi"}</button>
                        <button onClick={() => setLanguage("eng+hin")} className={language === "eng+hin" ? "btn-primary" : "btn-secondary"}>{isHi ? "दोनों" : "Both"}</button>
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "टेक्स्ट निकालें" : "Extract Text"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {text && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm text-slate-400">{isHi ? "निकाला गया टेक्स्ट" : "Extracted Text"}</label>
                            <button
                                onClick={copyAll}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50"
                            >
                                {copied ? (
                                    <><span>✅</span> {isHi ? "कॉपी हो गया!" : "Copied!"}</>
                                ) : (
                                    <><span>📋</span> {isHi ? "सभी कॉपी करें" : "Copy All"}</>
                                )}
                            </button>
                        </div>
                        <textarea readOnly value={text} rows={10} className="input-field font-mono text-sm" />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/image-to-text" tools={ALL_TOOLS} />
        </div>
    );
}
