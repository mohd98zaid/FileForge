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

const faqs = [
    { question: "Is formatting preserved?", questionHi: "क्या फ़ॉर्मेटिंग बनी रहती है?", answer: "Layout and images are preserved as accurately as possible.", answerHi: "लेआउट और इमेज यथासंभव सुरक्षित रखी जाती हैं।" },
    { question: "What is the max file size?", questionHi: "अधिकतम फ़ाइल साइज़ क्या है?", answer: "Up to 20MB per PDF.", answerHi: "प्रति PDF 20MB तक।" },
];

export default function PdfToPowerpointPage() {
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
            const formData = new FormData();
            formData.append("file", file);
            setProgress(30);
            const res = await fetch("/api/adobe/pdf-to-pptx", { method: "POST", body: formData });
            setProgress(80);
            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: "Unknown error" }));
                throw new Error(err.error || "Conversion failed");
            }
            const blob = await res.blob();
            setResultBlob(blob);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || (isHi ? "बदलना विफल रहा। कृपया पुनः प्रयास करें।" : "Conversion failed. Please try again."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📊 PDF से PowerPoint" : "📊 PDF to PowerPoint"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF को एडिटेबल PowerPoint स्लाइड्स (.pptx) में बदलें" : "Convert PDF pages to editable PowerPoint slides (.pptx)"}</p>
                <div className="mt-2 bg-indigo-500/10 text-indigo-400 text-xs py-1 px-3 rounded-full inline-block">⚡ Powered by Adobe PDF Services</div>
            </div>
            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={(files) => setFile(files[0])} label={isHi ? "यहाँ PDF ड्रॉप करें" : "Drop PDF here"} hint={isHi ? "अधिकतम 20MB" : "Max 20MB"} />
                {file && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="text-xl">📄</span>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">✕</button>
                    </div>
                )}
                <button onClick={handleProcess} disabled={!file} className="btn-primary w-full">{isHi ? "PowerPoint में बदलें" : "Convert to PowerPoint"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">{error}</div>}
                {resultBlob && (
                    <div className="flex justify-center pt-2">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, `${file?.name.replace(/\.[^/.]+$/, "")}.pptx`)} label={isHi ? "PowerPoint डाउनलोड करें" : "Download PowerPoint"} />
                    </div>
                )}
            </div>
            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-to-powerpoint" tools={ALL_TOOLS} />
        </div>
    );
}
