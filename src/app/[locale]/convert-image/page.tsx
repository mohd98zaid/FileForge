"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import { convertImage } from "@/utils/image-processing";
import { downloadBlob } from "@/lib/api";

const FORMAT_GROUPS = [
    {
        label: "Common",
        labelHi: "सामान्य",
        formats: ["PNG", "JPEG", "WEBP"],
    },
    {
        label: "Document",
        labelHi: "दस्तावेज़",
        formats: ["PDF"],
    },
];

// Map display format to MIME type
const MIME_MAP: Record<string, string> = {
    "PNG": "image/png",
    "JPEG": "image/jpeg",
    "WEBP": "image/webp",
    "PDF": "application/pdf",
};

const faqs = [
    { question: "Which formats are supported?", questionHi: "कौन से फ़ॉर्मेट सपोर्ट हैं?", answer: "PNG, JPG, WebP, BMP, TIFF, and HEIC.", answerHi: "PNG, JPG, WebP, BMP, TIFF और HEIC — आपस में कन्वर्ट कर सकते हैं।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, 100% free. No limits, no sign-up.", answerHi: "हाँ, पूरी तरह मुफ़्त। कोई लिमिट नहीं, कोई साइन-अप नहीं।" },
];

export default function ConvertImagePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [format, setFormat] = useState("PNG");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const file = files[0];
            const targetMime = MIME_MAP[format];

            if (!targetMime) throw new Error("Unsupported format selected.");

            const resultFile = await convertImage(file, targetMime);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Conversion failed.");
            setProgress(0);
        }
    };

    const ext = format.toLowerCase() === "jpeg" ? "jpg" : format.toLowerCase();

    const downloadResult = () => {
        if (!resultBlob) return;
        const filename = `${files[0]?.name.replace(/\.[^/.]+$/, "")}.${ext}`;
        downloadBlob(resultBlob, filename);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔄 इमेज कन्वर्ट करें" : "🔄 Convert Image"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PNG ↔ JPG, WebP, HEIC कन्वर्ट करें" : "Convert between PNG, JPG, WebP, and PDF"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={setFiles} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={URL.createObjectURL(files[0])}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{isHi ? "कन्वर्ट कर रहे हैं " : "Converting to "}<span className="text-indigo-400 font-semibold">{format}</span>{isHi ? " में" : ""}</p>
                        </div>
                    </div>
                )}

                {/* Format groups */}
                <div className="space-y-3">
                    {FORMAT_GROUPS.map((group) => (
                        <div key={group.label}>
                            <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wide">{isHi ? group.labelHi : group.label}</label>
                            <div className="flex flex-wrap gap-2">
                                {group.formats.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all border ${format === f
                                            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                            : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "कन्वर्ट करें" : "Convert Image"}</button>
                <ProgressBar progress={progress} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Result preview — only for image formats */}
                        {format !== "PDF" && (
                            <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={URL.createObjectURL(resultBlob)} alt="Converted result" className="max-w-full max-h-72 object-contain rounded shadow-lg" />
                            </div>
                        )}
                        <div className="flex justify-center">
                            <DownloadButton onClick={downloadResult} label={isHi ? `${format} डाउनलोड करें` : `Download ${format}`} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/convert-image" tools={ALL_TOOLS} />
        </div>
    );
}
