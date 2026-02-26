"use client";
import { useLocale } from "next-intl";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { convertPptToPdf } from "@/utils/ilovepdf-processing";

const faqs = [
    { question: "Which formats are supported?", questionHi: "कौन से फ़ॉर्मेट सपोर्ट हैं?", answer: "Both .ppt and .pptx are supported.", answerHi: ".ppt और .pptx दोनों सपोर्ट हैं।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free.", answerHi: "हाँ, बिल्कुल मुफ़्त।" },
];

export default function PowerpointToPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;
        setError(null); setResultBlob(null); setProgress(10);
        try {
            const resultFile = await convertPptToPdf(file);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || (isHi ? "बदलना विफल रहा। कृपया पुनः प्रयास करें।" : "Conversion failed. Please try again."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📉 PowerPoint से PDF" : "📉 PowerPoint to PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PPT/PPTX प्रेज़ेंटेशन को PDF में बदलें" : "Convert PPT/PPTX presentations to PDF"}</p>
                <div className="mt-2 bg-indigo-500/10 text-indigo-400 text-xs py-1 px-3 rounded-full inline-block">⚡ Powered by iLovePDF</div>
            </div>
            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload
                    accept={{
                        "application/vnd.ms-powerpoint": [".ppt"],
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"]
                    }}
                    maxFiles={1}
                    onFilesSelected={(files) => setFile(files[0])}
                    label={isHi ? "यहाँ PPT/PPTX ड्रॉप करें" : "Drop PPT/PPTX here"}
                    hint={isHi ? "अधिकतम 50MB" : "Max 50MB"}
                />
                {file && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="text-xl">📊</span>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">✕</button>
                    </div>
                )}
                <button onClick={handleProcess} disabled={!file} className="btn-primary w-full">{isHi ? "PDF में बदलें" : "Convert to PDF"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">{error}</div>}
                {resultBlob && (
                    <div className="flex justify-center pt-2">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, `${file?.name.replace(/\.[^/.]+$/, "")}.pdf`)} label={isHi ? "PDF डाउनलोड करें" : "Download PDF"} />
                    </div>
                )}
            </div>
            <FAQSection items={faqs} />
            <ToolLinks current="/powerpoint-to-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
