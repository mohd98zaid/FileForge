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
import { imagesToPdf } from "@/utils/image-processing";

const faqs = [
    { question: "How many images can I convert?", questionHi: "कितनी इमेज कन्वर्ट कर सकते हैं?", answer: "Convert multiple images into a single PDF at once.", answerHi: "एक बार में कई इमेज को एक PDF में बदल सकते हैं।" },
    { question: "Can I reorder the images?", questionHi: "क्या इमेज का क्रम बदल सकते हैं?", answer: "Yes, reorder after uploading.", answerHi: "हाँ, अपलोड के बाद इमेज का क्रम बदल सकते हैं।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free with no watermarks.", answerHi: "हाँ, बिल्कुल मुफ़्त और कोई वॉटरमार्क नहीं।" },
];

export default function ImageToPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const pdfFile = await imagesToPdf(files);
            setResultBlob(pdfFile);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || "Conversion failed.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📄 इमेज से PDF बनाएँ" : "📄 Image to PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "एक या कई इमेज को PDF में बदलें" : "Convert one or multiple images into a single PDF"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload
                    accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".tiff", ".heic", ".avif"] }}
                    maxFiles={20}
                    onFilesSelected={setFiles}
                    label={isHi ? "यहाँ इमेज छोड़ें (अधिकतम 20)" : "Drop images here (up to 20)"}
                    hint={isHi ? "JPG, PNG, WebP, BMP, GIF, TIFF, HEIC, AVIF — अधिकतम 10 MB प्रत्येक" : "JPG, PNG, WebP, BMP, GIF, TIFF, HEIC, AVIF — Max 10 MB each"}
                />

                {/* Image thumbnails grid */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-slate-500">
                            {isHi ? `${files.length} इमेज — प्रत्येक एक PDF पेज बनेगी` : `${files.length} image${files.length > 1 ? "s" : ""} — each will become one PDF page`}
                        </p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {files.map((f, i) => (
                                <div key={i} className="relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-800/30">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={URL.createObjectURL(f)} alt={`Page ${i + 1}`} className="w-full h-16 object-cover" />
                                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center text-slate-300 py-0.5">
                                        {isHi ? `पेज ${i + 1}` : `Page ${i + 1}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "PDF बनाएँ" : "Create PDF"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {resultBlob && (
                    <div className="flex justify-center">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "images.pdf")} label={isHi ? "PDF डाउनलोड करें" : "Download PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/image-to-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
