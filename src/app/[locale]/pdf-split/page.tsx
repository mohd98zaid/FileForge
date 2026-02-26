"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { splitPdf, getPdfPageCount } from "@/utils/pdf-processing";

const faqs = [
    { question: "Can I extract specific pages?", questionHi: "क्या मैं ख़ास पेज निकाल सकता हूँ?", answer: "Yes, enter page ranges (e.g. 1-5, 8, 10-15) to create a new PDF.", answerHi: "हाँ, पेज रेंज चुनें (जैसे 1-5, 8, 10-15) और अलग PDF बनाएँ।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, 100% free with no limits or watermarks.", answerHi: "हाँ, पूरी तरह मुफ़्त। कोई लिमिट, कोई वॉटरमार्क नहीं।" },
];

export default function PdfSplitPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const tCommon = useTranslations("Common");

    const [files, setFiles] = useState<File[]>([]);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [pageRange, setPageRange] = useState("");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [detecting, setDetecting] = useState(false);

    const handleFilesSelected = async (selectedFiles: File[]) => {
        setFiles(selectedFiles);
        setResultBlob(null);
        setPageCount(null);
        setPageRange("");
        setError(null);

        if (selectedFiles.length > 0) {
            setDetecting(true);
            try {
                const count = await getPdfPageCount(selectedFiles[0]);
                setPageCount(count);
                setPageRange(`1-${count}`);
            } catch (e: any) {
                console.error(e);
                setError(isHi ? "पेज गिनने में विफल। सुनिश्चित करें कि फ़ाइल वैध PDF है।" : "Failed to detect page count. Ensure the file is a valid PDF.");
            } finally {
                setDetecting(false);
            }
        }
    };

    const handleProcess = async () => {
        if (!files.length || !pageRange) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const resultFile = await splitPdf(files[0], pageRange);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || (isHi ? "स्प्लिट विफल रहा।" : "Split failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✂️ PDF स्प्लिट करें" : "✂️ Split PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF से पेज अलग करें" : "Extract specific pages from a PDF"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={handleFilesSelected} label={tCommon("dropPdfHere")} />

                {files.length > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg">📄</div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-300 font-medium">{files[0].name}</p>
                            <p className="text-xs text-slate-500">
                                {isHi ? "साइज़:" : "Size:"} <span className="text-indigo-400">{(files[0].size / 1024).toFixed(0)} KB</span>
                                {detecting && <span className="ml-2 text-amber-400">{isHi ? "⏳ पेज गिने जा रहे हैं..." : "⏳ Detecting pages..."}</span>}
                                {pageCount !== null && (
                                    <span className="ml-2 text-emerald-400">· {isHi ? `${pageCount} पेज मिले` : `${pageCount} page${pageCount !== 1 ? "s" : ""} detected`}</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {pageCount !== null && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                        <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                            <p className="text-sm text-slate-300">
                                {isHi ? (
                                    <>इस PDF में <span className="text-indigo-400 font-bold text-base">{pageCount}</span> पेज हैं। नीचे वे पेज दर्ज करें जिन्हें आप अलग करना चाहते हैं।</>
                                ) : (
                                    <>This PDF has <span className="text-indigo-400 font-bold text-base">{pageCount}</span> page{pageCount !== 1 ? "s" : ""}. Enter the pages you want to extract below.</>
                                )}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">
                                {isHi ? `पेज रेंज (1 से ${pageCount})` : `Page Range (1 to ${pageCount})`}
                            </label>
                            <input
                                type="text"
                                value={pageRange}
                                onChange={(e) => setPageRange(e.target.value)}
                                placeholder={`e.g. 1-${pageCount} or 1,3,${pageCount}`}
                                className="input-field w-full"
                            />
                            <p className="mt-1 text-xs text-slate-600">
                                {isHi ? 'उदाहरण: रेंज के लिए "1-5", ख़ास पेजों के लिए "1,3,7", एक पेज के लिए "3"' : 'Examples: "1-5" for a range, "1,3,7" for specific pages, "3" for a single page'}
                            </p>
                        </div>

                        <button onClick={handleProcess} disabled={!pageRange} className="btn-primary w-full">{isHi ? "PDF स्प्लिट करें" : "Split PDF"}</button>
                    </div>
                )}

                <ProgressBar progress={progress} label={isHi ? "स्प्लिट हो रहा है..." : "Splitting..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "split.pdf")} label={isHi ? "स्प्लिट PDF डाउनलोड करें" : "Download Split PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-split" tools={ALL_TOOLS} />
        </div>
    );
}
