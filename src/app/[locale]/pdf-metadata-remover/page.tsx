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
import { getPdfMetadata, removePdfMetadata } from "@/utils/pdf-processing";

const faqs = [
    { question: "What metadata is removed?", questionHi: "कौन सा मेटाडेटा हटता है?", answer: "Author, software, dates — all hidden info is cleaned.", answerHi: "ऑथर, सॉफ़्टवेयर, तारीख़ — सभी छिपी जानकारी साफ़ हो जाती है।" },
    { question: "Why remove PDF metadata?", questionHi: "PDF मेटाडेटा क्यों हटाएँ?", answer: "For privacy — PDFs can contain author name, software used, and edit history.", answerHi: "प्राइवेसी के लिए — PDF में ऑथर का नाम, इस्तेमाल किया सॉफ़्टवेयर और एडिट हिस्ट्री होती है।" },
];

export default function PdfMetadataRemoverPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [metadata, setMetadata] = useState<Record<string, string> | null>(null);
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFiles = async (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setMetadata(null);
        if (!f.length) return;
        setLoadingMeta(true);
        try {
            // Client-side metadata extraction
            const info = await getPdfMetadata(f[0]);
            // Filter out empty values for display
            const displayMeta: Record<string, string> = {};
            Object.entries(info).forEach(([k, v]) => {
                if (v) displayMeta[k] = v;
            });
            setMetadata(displayMeta);
        } catch (e) {
            console.error(e);
            setMetadata(null);
        }
        setLoadingMeta(false);
    };

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const cleanPdf = await removePdfMetadata(files[0]);
            setResultBlob(cleanPdf);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || "Metadata removal failed.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🧹 PDF मेटाडेटा हटाएँ" : "🧹 PDF Metadata Remover"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF से छिपा हुआ मेटाडेटा साफ़ करें" : "Strip author, title, software & other hidden metadata from PDFs"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={handleFiles} accept={{ "application/pdf": [".pdf"] }} />

                {loadingMeta && <p className="text-sm text-slate-400 text-center animate-pulse">{isHi ? "मेटाडेटा पढ़ा जा रहा है..." : "Reading metadata..."}</p>}

                {metadata && (
                    <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                        <div className="p-3 border-b border-slate-700/50">
                            <h3 className="text-sm font-semibold text-slate-300">📋 {isHi ? "मौजूदा मेटाडेटा" : "Current Metadata"}</h3>
                        </div>
                        <div className="p-3">
                            {Object.keys(metadata).length > 0 ? (
                                <table className="w-full text-xs">
                                    <tbody>
                                        {Object.entries(metadata).map(([key, val]) => (
                                            <tr key={key} className="border-b border-slate-700/30">
                                                <td className="py-1.5 pr-3 text-slate-400 font-medium capitalize">{key.replace(/_/g, " ")}</td>
                                                <td className="py-1.5 text-slate-300">{String(val)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-slate-500">{isHi ? "कोई मेटाडेटा नहीं मिला।" : "No metadata found."}</p>
                            )}
                        </div>
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "सभी मेटाडेटा हटाएँ" : "Remove All Metadata"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "clean.pdf")} label={isHi ? "साफ़ PDF डाउनलोड करें" : "Download Clean PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-metadata-remover" tools={ALL_TOOLS} />
        </div>
    );
}
