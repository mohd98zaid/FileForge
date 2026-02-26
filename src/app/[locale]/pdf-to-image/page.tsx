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
import { pdfToImages, createZip } from "@/utils/pdf-processing";

const FORMATS = [
    { value: "jpg", label: "JPG", desc: "Best for photos", mime: "image/jpeg" },
    { value: "png", label: "PNG", desc: "Lossless, transparent", mime: "image/png" },
    { value: "webp", label: "WebP", desc: "Modern, small", mime: "image/webp" },
    // BMP and TIFF are not standard web exports from canvas. We'll verify support or remove.
    // Canvas toBlob usually supports image/png, image/jpeg, image/webp.
    // We'll stick to these 3 for client-side.
];

const faqs = [
    { question: "What formats can I export to?", questionHi: "किन फ़ॉर्मेट में एक्सपोर्ट कर सकते हैं?", answer: "Export as JPG, PNG, or WebP.", answerHi: "JPG, PNG और WebP — अपनी ज़रूरत के हिसाब से चुनें।" },
    { question: "What about quality?", questionHi: "क्वालिटी कैसी होती है?", answer: "High-resolution images are generated. You can also set custom DPI.", answerHi: "हाई-रेज़ॉल्यूशन इमेज बनती हैं। DPI भी सेट कर सकते हैं।" },
];

export default function PdfToImagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const tCommon = useTranslations("Common");

    const [files, setFiles] = useState<File[]>([]);
    const [dpi, setDpi] = useState(300);
    const [format, setFormat] = useState("jpg");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const selectedFormat = FORMATS.find(f => f.value === format);
            const mime = selectedFormat?.mime || "image/jpeg";

            // Progress callback? pdfToImages doesn't support it yet.
            // We can simulate or just wait.
            // Converting many pages is slow.
            const images = await pdfToImages(files[0], dpi, mime);

            if (images.length === 0) throw new Error("No images generated.");

            if (images.length === 1) {
                setResultBlob(images[0]);
            } else {
                setProgress(80);
                const zip = await createZip(images);
                setResultBlob(zip);
            }
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Conversion failed.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🖼️ PDF से चित्र" : "🖼️ PDF to Image"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF पेज को JPG/PNG में बदलें" : "Convert PDF pages to high-quality images in any format"}</p>
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

                {/* Output format selector */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "आउटपुट फ़ॉर्मेट" : "Output Format"}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {FORMATS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFormat(f.value)}
                                className={`rounded-lg px-2 py-2.5 text-center text-sm transition-all border ${format === f.value
                                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                    : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                    }`}
                            >
                                <span className="block font-medium">{f.label}</span>
                                <span className="block text-[10px] opacity-70 mt-0.5">{f.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-1">DPI: {dpi}</label>
                    <input type="range" min={72} max={300} step={10} value={dpi} onChange={(e) => setDpi(+e.target.value)} className="w-full accent-indigo-500" />
                    <div className="flex justify-between text-xs text-slate-600 mt-1"><span>{isHi ? "72 (स्क्रीन)" : "72 (Screen)"}</span><span>{isHi ? "300 (प्रिंट)" : "300 (Print)"}</span></div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? `${format.toUpperCase()} में बदलें` : `Convert to ${format.toUpperCase()}`}</button>
                <ProgressBar progress={progress} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton
                            onClick={() => downloadBlob(resultBlob, resultBlob.type.includes("zip") ? `pdf_images.zip` : `pdf_page.${format}`)}
                            label={resultBlob.type.includes("zip") ? (isHi ? "ZIP डाउनलोड करें" : "Download ZIP") : (isHi ? `${format.toUpperCase()} डाउनलोड करें` : `Download ${format.toUpperCase()}`)}
                        />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-to-image" tools={ALL_TOOLS} />
        </div>
    );
}
