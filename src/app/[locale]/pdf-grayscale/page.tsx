"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url
).toString();

const faqs = [
    { question: "How does this work?", questionHi: "यह कैसे काम करता है?", answer: "We render each PDF page to a canvas, apply a grayscale CSS filter, then re-create the PDF using pdf-lib.", answerHi: "हम प्रत्येक PDF पेज को कैनवास पर रेंडर करते हैं, ग्रेस्केल CSS फ़िल्टर लगाते हैं, फिर pdf-lib से PDF पुनः बनाते हैं।" },
    { question: "Is my PDF uploaded?", questionHi: "क्या मेरी PDF अपलोड होती है?", answer: "No, everything happens locally in your browser.", answerHi: "नहीं, सब कुछ आपके ब्राउज़र में स्थानीय रूप से होता है।" },
    { question: "Does it reduce file size?", questionHi: "क्या फ़ाइल साइज़ कम होता है?", answer: "It may slightly reduce or increase size depending on the content. Grayscale images generally compress better.", answerHi: "यह कंटेंट पर निर्भर करता है। ग्रेस्केल इमेज आमतौर पर बेहतर कंप्रेस होती हैं।" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfGrayscalePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.type !== "application/pdf") {
            setError(isHi ? "कृपया एक वैध PDF अपलोड करें।" : "Please upload a valid PDF.");
            return;
        }
        setFile(selected);
        setResultBlob(null);
        setError(null);
        setProgress(0);
        try {
            const arrayBuffer = await selected.arrayBuffer();
            const pdf = await getDocument({ data: arrayBuffer }).promise;
            setPageCount(pdf.numPages);
        } catch {
            setPageCount(0);
        }
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        setResultBlob(null);
        setProgress(5);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await getDocument({ data: arrayBuffer }).promise;
            const outputPdf = await PDFDocument.create();

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });

                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext("2d")!;

                await page.render({ canvasContext: ctx, viewport }).promise;

                // Apply grayscale
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let p = 0; p < data.length; p += 4) {
                    const gray = data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114;
                    data[p] = gray;
                    data[p + 1] = gray;
                    data[p + 2] = gray;
                }
                ctx.putImageData(imageData, 0, 0);

                const pngDataUrl = canvas.toDataURL("image/png");
                const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) => c.charCodeAt(0));
                const pngImage = await outputPdf.embedPng(pngBytes);

                const outPage = outputPdf.addPage([viewport.width, viewport.height]);
                outPage.drawImage(pngImage, { x: 0, y: 0, width: viewport.width, height: viewport.height });

                setProgress(Math.round((i / pdf.numPages) * 90) + 5);
            }

            const pdfBytes = await outputPdf.save();
            setResultBlob(new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }));
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || (isHi ? "ग्रेस्केल रूपांतरण में त्रुटि" : "Grayscale conversion error"));
        }
        setIsProcessing(false);
    };

    const handleDownload = () => {
        if (!resultBlob || !file) return;
        const url = URL.createObjectURL(resultBlob);
        const link = document.createElement("a");
        link.href = url;
        const name = file.name.replace(/\.pdf$/i, "");
        link.download = `${name}_grayscale.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⬛ PDF ग्रेस्केल कन्वर्टर" : "⬛ PDF Grayscale Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपनी PDF को काले-सफ़ेद में बदलें" : "Convert your PDF to black and white"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                {!file ? (
                    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <h3 className="text-xl font-bold text-slate-200 mb-2">{isHi ? "PDF अपलोड करें" : "Upload a PDF"}</h3>
                        <p className="text-sm text-slate-400">{isHi ? "ग्रेस्केल में बदलने के लिए PDF चुनें" : "Select a PDF to convert to grayscale"}</p>
                        <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                            <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatSize(file.size)}{pageCount ? ` · ${pageCount} ${isHi ? "पेज" : "pages"}` : ""}</p>
                            </div>
                            <button onClick={() => { setFile(null); setResultBlob(null); setProgress(0); setPageCount(0); }} className="text-xs px-3 py-1.5 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700">
                                {isHi ? "बदलें" : "Change"}
                            </button>
                        </div>

                        {/* Progress */}
                        {progress > 0 && (
                            <div className="space-y-2">
                                <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                </div>
                                <p className="text-xs text-slate-500 text-right">{progress}%</p>
                            </div>
                        )}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <div className="flex gap-3">
                            {!resultBlob ? (
                                <button onClick={handleConvert} disabled={isProcessing} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                                    {isProcessing
                                        ? (isHi ? "ग्रेस्केल में बदल रहे हैं..." : "Converting to grayscale...")
                                        : (isHi ? "ग्रेस्केल में बदलें" : "Convert to Grayscale")}
                                </button>
                            ) : (
                                <button onClick={handleDownload} className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
                                    {isHi ? "⬇️ ग्रेस्केल PDF डाउनलोड करें" : "⬇️ Download Grayscale PDF"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-grayscale" tools={ALL_TOOLS} />
        </div>
    );
}
