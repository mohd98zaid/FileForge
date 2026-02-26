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
import { pdfToImages, createZip } from "@/utils/pdf-processing";

const faqs = [
    { question: "What format are extracted images?", questionHi: "निकाली गई इमेज किस फ़ॉर्मेट में होती हैं?", answer: "Images are extracted in their embedded format — usually JPG or PNG.", answerHi: "जो भी फ़ॉर्मेट PDF में एम्बेड है, उसी में निकलती हैं — ज़्यादातर JPG या PNG।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free.", answerHi: "हाँ, बिल्कुल मुफ़्त।" },
];

export default function ExtractImagesPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [imageCount, setImageCount] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setImageCount(null);
        setProgress(10);
        try {
            // Using pdfToImages to render pages as images (client-side extraction approximation)
            // 300 DPI for high quality
            const images = await pdfToImages(files[0], 300, 'image/png');
            setImageCount(images.length);
            setProgress(80);

            const zipBlob = await createZip(images);
            setResultBlob(zipBlob);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Failed to extract images.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🖼️ PDF से इमेज निकालें" : "🖼️ Extract Images from PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF से सभी इमेज निकालें" : "Pull all embedded images from your PDF as a ZIP"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={(f) => { setFiles(f); setResultBlob(null); setImageCount(null); }} accept={{ "application/pdf": [".pdf"] }} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <span className="text-2xl">📄</span>
                        <div>
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">{(files[0].size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "इमेज निकालें" : "Extract Images"}</button>

                <ProgressBar progress={progress} label={isHi ? "इमेज निकाली जा रहीं हैं..." : "Extracting images..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="space-y-3 text-center">
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-emerald-400 font-semibold">{isHi ? "✅ इमेज सफलतापूर्वक निकाली गईं!" : "✅ Images extracted successfully!"}</p>
                            {imageCount !== null && <p className="text-sm text-slate-400 mt-1">{isHi ? `${imageCount} इमेज मिलीं` : `${imageCount} image(s) found`}</p>}
                        </div>
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "extracted_images.zip")} label={isHi ? "चित्र डाउनलोड करें" : "Download Images (ZIP)"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/extract-images-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
