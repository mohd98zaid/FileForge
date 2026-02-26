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
import { convertOfficeToPdf } from "@/utils/ilovepdf-processing";

const faqs = [
    { question: "Which Word formats are supported?", questionHi: "कौन से Word फ़ॉर्मेट सपोर्ट हैं?", answer: "Both .doc and .docx are supported.", answerHi: ".doc और .docx दोनों सपोर्ट हैं।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free with no limits.", answerHi: "हाँ, बिल्कुल मुफ़्त। कोई लिमिट नहीं।" },
];

export default function WordToPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!file) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            // Client-side call to iLovePDF (via our auth route)
            const resultFile = await convertOfficeToPdf(file);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "बदलना विफल रहा। कृपया पुनः प्रयास करें।" : "Conversion failed. Please try again."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📄 Word से PDF" : "📝 Word to PDF Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "Word डॉक्यूमेंट (.doc, .docx) को PDF में बदलें" : "Convert Word documents (.doc, .docx) to PDF"}</p>
                <div className="mt-2 bg-indigo-500/10 text-indigo-400 text-xs py-1 px-3 rounded-full inline-block">
                    ⚡ Powered by iLovePDF
                </div>
            </div>

            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload
                    accept={{
                        "application/msword": [".doc"],
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
                    }}
                    maxFiles={1}
                    onFilesSelected={(files) => setFile(files[0])}
                    label={isHi ? "यहाँ Word डॉक्यूमेंट ड्रॉप करें" : "Drop Word document here"}
                    hint={isHi ? "अधिकतम 50MB" : "Max 50MB"}
                />

                {file && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="text-xl">📄</span>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">
                            ✕
                        </button>
                    </div>
                )}

                <button
                    onClick={handleProcess}
                    disabled={!file}
                    className="btn-primary w-full"
                >
                    {isHi ? "PDF में बदलें" : "Convert to PDF"}
                </button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {resultBlob && (
                    <div className="flex justify-center pt-2">
                        <DownloadButton
                            onClick={() => downloadBlob(resultBlob, `${file?.name.replace(/\.[^/.]+$/, "")}.pdf`)}
                            label={isHi ? "PDF डाउनलोड करें" : "Download PDF"}
                        />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/word-to-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
