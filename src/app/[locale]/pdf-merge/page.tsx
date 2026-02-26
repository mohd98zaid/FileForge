"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { mergePdfs } from "@/utils/pdf-processing";
import { downloadBlob } from "@/lib/api";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";

const faqs = [
    { question: "How many PDFs can I merge?", questionHi: "कितनी PDF मर्ज कर सकते हैं?", answer: "Merge up to 20 PDFs at once.", answerHi: "एक बार में 20 PDF तक मर्ज कर सकते हैं।" },
    { question: "Is the order preserved?", questionHi: "क्या क्रम बना रहता है?", answer: "Yes, files are merged in the order you upload them. Drag to reorder.", answerHi: "हाँ, जिस क्रम में अपलोड करेंगे उसी क्रम में मर्ज होंगे। क्रम बदलने के लिए ड्रैग करें।" },
    { question: "Is it secure?", questionHi: "क्या यह सुरक्षित है?", answer: "Absolutely! Everything runs in your browser. PDFs never leave your device.", answerHi: "बिल्कुल! सब कुछ ब्राउज़र में होता है। PDF कभी सर्वर पर नहीं जाती।" },
];

function AddMoreDropzone({ onAdd }: { onAdd: (files: File[]) => void }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (accepted) => onAdd(accepted),
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 20,
        maxSize: 100 * 1024 * 1024,
    });
    return (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer transition-all ${isDragActive ? "border-indigo-400 bg-indigo-500/10" : "border-white/20 hover:border-indigo-500/50 hover:bg-white/5"}`}>
            <input {...getInputProps()} />
            <span className="text-sm text-slate-400">➕ Drop more PDFs here or click to add</span>
        </div>
    );
}

export default function PdfMergePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

    // Initial dropzone (only shown when no files)
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (accepted) => { setFiles(accepted); setResultBlob(null); setError(null); },
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 20,
        maxSize: 100 * 1024 * 1024,
    });

    const addMoreFiles = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles].slice(0, 20));
        setResultBlob(null);
    };

    const removeFile = (idx: number) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // Drag-to-reorder
    const handleDragStart = (idx: number) => setDraggingIdx(idx);
    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        if (draggingIdx === null || draggingIdx === idx) return;
        setFiles(prev => {
            const arr = [...prev];
            const [item] = arr.splice(draggingIdx, 1);
            arr.splice(idx, 0, item);
            return arr;
        });
        setDraggingIdx(idx);
    };

    const handleProcess = async () => {
        if (files.length < 2) { setError(isHi ? "कृपया कम से कम 2 PDF अपलोड करें।" : "Please upload at least 2 PDFs."); return; }
        setError(null); setResultBlob(null); setProgress(10);
        try {
            const resultFile = await mergePdfs(files);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            setError(isHi ? "मर्ज विफल रहा।" : "Merge failed. Ensure files are valid PDFs.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📎 PDF मर्ज करें" : "📎 Merge PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "कई PDF को एक में मिलाएँ" : "Combine multiple PDFs into one document"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    ⚡ {isHi ? "ब्राउज़र में प्रोसेस (तेज़ और सुरक्षित)" : "Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-4">
                {files.length === 0 ? (
                    /* Initial drop zone */
                    <div {...getRootProps()} className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}>
                        <input {...getInputProps()} />
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                            <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <p className="text-base font-medium text-slate-300">{isHi ? "PDF फ़ाइलें यहाँ ड्रॉप करें" : "Drop PDFs here or click to select"}</p>
                        <p className="mt-1 text-sm text-slate-500">{isHi ? "एक से ज़्यादा PDF चुनें — अधिकतम 20" : "Select multiple PDFs — max 20"}</p>
                    </div>
                ) : (
                    <>
                        {/* File list with drag-to-reorder */}
                        <div className="space-y-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-slate-500">{files.length} PDF{files.length > 1 ? "s" : ""} — {isHi ? "मर्ज ऑर्डर (ड्रैग करें बदलने के लिए)" : "merge order (drag to reorder)"}</p>
                                <button onClick={() => { setFiles([]); setResultBlob(null); }} className="text-xs text-red-400 hover:text-red-300">✕ {isHi ? "सब हटाएँ" : "Clear all"}</button>
                            </div>
                            {files.map((f, i) => (
                                <div
                                    key={`${f.name}-${i}`}
                                    draggable
                                    onDragStart={() => handleDragStart(i)}
                                    onDragOver={(e) => handleDragOver(e, i)}
                                    onDragEnd={() => setDraggingIdx(null)}
                                    className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all ${draggingIdx === i ? "opacity-50 bg-indigo-500/20" : "hover:bg-white/5"}`}
                                >
                                    <span className="text-slate-500 text-xs">⣿</span>
                                    <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                                    <span className="text-slate-300 truncate flex-1">{f.name}</span>
                                    <span className="text-xs text-slate-500 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                                    <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-red-400 transition-colors ml-1 shrink-0">✕</button>
                                </div>
                            ))}
                        </div>

                        {/* Add more PDFs */}
                        {files.length < 20 && <AddMoreDropzone onAdd={addMoreFiles} />}
                    </>
                )}

                <button onClick={handleProcess} disabled={files.length < 2} className="btn-primary w-full">
                    {isHi ? "PDF मर्ज करें" : "Merge PDFs"}
                </button>
                <ProgressBar progress={progress} label={isHi ? "मर्ज हो रहा है..." : "Merging..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "merged.pdf")} label={isHi ? "मर्ज PDF डाउनलोड करें" : "Download Merged PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pdf-merge" tools={ALL_TOOLS} />
        </div>
    );
}
