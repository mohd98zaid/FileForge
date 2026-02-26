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
import { convertPdfToWord } from "@/utils/ilovepdf-processing";

const faqs = [
    { question: "Is the formatting preserved?", questionHi: "क्या फ़ॉर्मेटिंग बनी रहती है?", answer: "Most formatting is preserved. Complex layouts may have minor differences.", answerHi: "ज़्यादातर फ़ॉर्मेटिंग बनी रहती है। जटिल लेआउट में कुछ बदलाव हो सकते हैं।" },
    { question: "Does it need internet?", questionHi: "क्या इंटरनेट ज़रूरी है?", answer: "Yes, this uses server-side processing.", answerHi: "हाँ, यह सर्वर-साइड प्रोसेसिंग का उपयोग करता है।" },
];

export default function PdfToWordPage() {
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
            const resultFile = await convertPdfToWord(file);
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
                <h1 className="section-title">{isHi ? "📝 PDF से Word" : "📝 PDF to Word Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF को एडिट करने लायक Word (.docx) में बदलें" : "Convert PDF documents to editable Word (.docx) files"}</p>
                <div className="mt-2 bg-indigo-500/10 text-indigo-400 text-xs py-1 px-3 rounded-full inline-block">
                    ⚡ Powered by Adobe PDF Services
                </div>
            </div>

            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    onFilesSelected={(files) => setFile(files[0])}
                    label={isHi ? "यहाँ PDF ड्रॉप करें" : "Drop PDF here"}
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

                    className="btn-primary w-full"
                >
                    {isHi ? "Word में बदलें" : "Convert to Word"}
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
                            onClick={() => downloadBlob(resultBlob, `${file?.name.replace(".pdf", "")}.docx`)}
                            label={isHi ? "Word फ़ाइल डाउनलोड करें" : "Download Word Doc"}
                        />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-to-word" tools={ALL_TOOLS} />
        </div>
    );
}
