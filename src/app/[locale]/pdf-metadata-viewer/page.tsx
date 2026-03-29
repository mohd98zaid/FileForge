"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { PDFDocument } from "pdf-lib";

const faqs = [
    { question: "What metadata is shown?", questionHi: "कौन सा मेटाडेटा दिखाया जाता है?", answer: "Title, author, subject, creator, producer, creation date, modification date, page count, PDF version, and file size.", answerHi: "शीर्षक, लेखक, विषय, निर्माता, उत्पादक, निर्माण तिथि, संशोधन तिथि, पृष्ठ संख्या, PDF संस्करण और फ़ाइल आकार।" },
    { question: "Is my PDF uploaded?", questionHi: "क्या मेरी PDF अपलोड होती है?", answer: "No, all metadata extraction happens locally in your browser using pdf-lib.", answerHi: "नहीं, सभी मेटाडेटा निष्कर्षण pdf-lib का उपयोग करके आपके ब्राउज़र में स्थानीय रूप से होता है।" },
    { question: "Can I edit the metadata?", questionHi: "क्या मैं मेटाडेटा संपादित कर सकता हूँ?", answer: "This tool is read-only. Use our PDF Metadata Remover to strip metadata, or an editor to modify it.", answerHi: "यह टूल केवल पढ़ने के लिए है। मेटाडेटा हटाने के लिए PDF मेटाडेटा रिमूवर का उपयोग करें।" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface MetadataEntry {
    key: string;
    label: string;
    labelHi: string;
    icon: string;
    value: string;
}

export default function PdfMetadataViewerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState<MetadataEntry[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.type !== "application/pdf") {
            setError(isHi ? "कृपया एक वैध PDF अपलोड करें।" : "Please upload a valid PDF.");
            return;
        }
        setFile(selected);
        setMetadata(null);
        setError(null);
        setIsLoading(true);

        try {
            const arrayBuffer = await selected.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const title = pdfDoc.getTitle();
            const author = pdfDoc.getAuthor();
            const subject = pdfDoc.getSubject();
            const creator = pdfDoc.getCreator();
            const producer = pdfDoc.getProducer();
            const creationDate = pdfDoc.getCreationDate();
            const modificationDate = pdfDoc.getModificationDate();
            const pageCount = pdfDoc.getPageCount();

            // Try to get PDF version from the raw bytes
            let pdfVersion = "Unknown";
            const headerStr = new TextDecoder().decode(arrayBuffer.slice(0, 20));
            const versionMatch = headerStr.match(/%PDF-(\d+\.\d+)/);
            if (versionMatch) pdfVersion = versionMatch[1];

            const entries: MetadataEntry[] = [
                { key: "title", label: "Title", labelHi: "शीर्षक", icon: "📄", value: title || "" },
                { key: "author", label: "Author", labelHi: "लेखक", icon: "✍️", value: author || "" },
                { key: "subject", label: "Subject", labelHi: "विषय", icon: "📝", value: subject || "" },
                { key: "creator", label: "Creator", labelHi: "निर्माता", icon: "🛠️", value: creator || "" },
                { key: "producer", label: "Producer", labelHi: "उत्पादक", icon: "🏭", value: producer || "" },
                {
                    key: "creationDate",
                    label: "Creation Date",
                    labelHi: "निर्माण तिथि",
                    icon: "📅",
                    value: creationDate ? creationDate.toLocaleString(locale) : "",
                },
                {
                    key: "modificationDate",
                    label: "Modification Date",
                    labelHi: "संशोधन तिथि",
                    icon: "🔄",
                    value: modificationDate ? modificationDate.toLocaleString(locale) : "",
                },
                { key: "pageCount", label: "Page Count", labelHi: "पृष्ठ संख्या", icon: "📑", value: String(pageCount) },
                { key: "pdfVersion", label: "PDF Version", labelHi: "PDF संस्करण", icon: "📌", value: pdfVersion },
                { key: "fileSize", label: "File Size", labelHi: "फ़ाइल आकार", icon: "💾", value: formatSize(selected.size) },
            ];

            setMetadata(entries);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "मेटाडेटा पढ़ने में त्रुटि" : "Error reading metadata"));
        }
        setIsLoading(false);
    };

    const copyValue = (key: string, value: string) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📋 PDF मेटाडेटा व्यूअर" : "📋 PDF Metadata Viewer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF फ़ाइलों का छिपा हुआ मेटाडेटा देखें" : "View hidden metadata inside PDF files"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                {!file ? (
                    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">{isHi ? "PDF अपलोड करें" : "Upload a PDF"}</h3>
                        <p className="text-sm text-slate-400">{isHi ? "मेटाडेटा देखने के लिए PDF चुनें" : "Select a PDF to view its metadata"}</p>
                        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                ) : (
                    <>
                        {/* File info */}
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                            <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                            </div>
                            <button onClick={() => { setFile(null); setMetadata(null); }} className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700">
                                {isHi ? "बदलें" : "Change"}
                            </button>
                        </div>

                        {isLoading && (
                            <p className="text-sm text-slate-400 text-center animate-pulse">
                                {isHi ? "मेटाडेटा पढ़ा जा रहा है..." : "Reading metadata..."}
                            </p>
                        )}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        {metadata && (
                            <div className="space-y-2">
                                {metadata.map((entry) => (
                                    <div key={entry.key} className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700/30 rounded-lg group hover:border-slate-600/50 transition-colors">
                                        <span className="text-xl shrink-0">{entry.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 font-medium">
                                                {isHi ? entry.labelHi : entry.label}
                                            </p>
                                            <p className={`text-sm font-medium truncate ${entry.value ? "text-slate-200" : "text-slate-600 italic"}`}>
                                                {entry.value || (isHi ? "उपलब्ध नहीं" : "Not available")}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyValue(entry.key, entry.value)}
                                            disabled={!entry.value}
                                            className={`text-xs px-2.5 py-1 rounded transition-colors shrink-0 ${
                                                copiedKey === entry.key
                                                    ? "bg-green-600/20 text-green-400"
                                                    : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 opacity-0 group-hover:opacity-100"
                                            } ${!entry.value && "cursor-not-allowed"}`}
                                        >
                                            {copiedKey === entry.key ? (isHi ? "कॉपी!" : "Copied!") : (isHi ? "कॉपी" : "Copy")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-metadata-viewer" tools={ALL_TOOLS} />
        </div>
    );
}
