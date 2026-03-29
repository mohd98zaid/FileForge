"use client";

import { useLocale } from "next-intl";

import { useState, useRef, useEffect, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { reorderPdf } from "@/utils/pdf-processing";

const faqs = [
    { question: "Can I delete pages?", questionHi: "क्या पेज डिलीट कर सकते हैं?", answer: "Yes, remove unwanted pages and reorder the rest.", answerHi: "हाँ, जो पेज नहीं चाहिए उन्हें हटा सकते हैं और क्रम भी बदल सकते हैं।" },
    { question: "Is it processed locally?", questionHi: "क्या यह लोकली प्रोसेस होता है?", answer: "Yes, everything runs in your browser.", answerHi: "हाँ, सब कुछ आपके ब्राउज़र में होता है।" },
];

interface PageInfo {
    pageNum: number;
    thumbnail: string; // data URL
    deleted: boolean;
    rotation: number;
}

export default function ReorderPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    const pdfjsRef = useRef<any>(null);

    // Load pdf.js
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (pdfjsRef.current) return;
        (async () => {
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url
            ).toString();
            pdfjsRef.current = pdfjs;
        })();
    }, []);

    // Render all page thumbnails
    const renderThumbnails = useCallback(async (file: File) => {
        if (!pdfjsRef.current) {
            // Wait a bit for script to load
            await new Promise(r => setTimeout(r, 500));
            if (!pdfjsRef.current) return;
        }
        setLoading(true);
        setError(null);
        try {
            const buf = await file.arrayBuffer();
            const doc = await pdfjsRef.current.getDocument({ data: buf }).promise;
            const thumbnails: PageInfo[] = [];

            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const vp = page.getViewport({ scale: 1 });
                const thumbWidth = 180;
                const scale = thumbWidth / vp.width;
                const svp = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                canvas.width = svp.width;
                canvas.height = svp.height;
                const ctx = canvas.getContext("2d")!;
                await page.render({ canvasContext: ctx, viewport: svp }).promise;

                thumbnails.push({
                    pageNum: i,
                    thumbnail: canvas.toDataURL("image/jpeg", 0.7),
                    deleted: false,
                    rotation: 0,
                });
            }

            setPages(thumbnails);
        } catch (e: any) {
            setError("Failed to render PDF pages. The file may be corrupted or encrypted.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleFiles = async (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setPages([]);
        if (f.length > 0) {
            await renderThumbnails(f[0]);
        }
    };

    // Drag and drop handlers
    const handleDragStart = (idx: number) => {
        setDragIdx(idx);
    };

    const handleDragOver = (e: React.DragEvent, idx: number) => {
        e.preventDefault();
        setDragOverIdx(idx);
    };

    const handleDrop = (idx: number) => {
        if (dragIdx === null || dragIdx === idx) {
            setDragIdx(null);
            setDragOverIdx(null);
            return;
        }
        const updated = [...pages];
        const [item] = updated.splice(dragIdx, 1);
        updated.splice(idx, 0, item);
        setPages(updated);
        setDragIdx(null);
        setDragOverIdx(null);
    };

    const handleDragEnd = () => {
        setDragIdx(null);
        setDragOverIdx(null);
    };

    // Move with arrows
    const moveItem = (from: number, to: number) => {
        if (to < 0 || to >= pages.length) return;
        const updated = [...pages];
        const [item] = updated.splice(from, 1);
        updated.splice(to, 0, item);
        setPages(updated);
    };

    const toggleDelete = (idx: number) => {
        const updated = [...pages];
        updated[idx] = { ...updated[idx], deleted: !updated[idx].deleted };
        setPages(updated);
    };

    const rotatePage = (idx: number) => {
        const updated = [...pages];
        updated[idx] = { ...updated[idx], rotation: (updated[idx].rotation + 90) % 360 };
        setPages(updated);
    };

    const handleProcess = async () => {
        if (!files.length || !pages.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            // Filter deleted pages and map to expected format
            // pageNum in state is 1-based, reorderPdf expects 0-based index
            const orderedPages = pages
                .filter(p => !p.deleted)
                .map(p => ({
                    pageIndex: p.pageNum - 1,
                    rotation: p.rotation
                }));

            const resultFile = await reorderPdf(files[0], orderedPages);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Reorder failed.");
            setProgress(0);
        }
    };

    const activePages = pages.filter(p => !p.deleted).length;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔀 PDF पेज क्रम बदलें" : "🔀 Reorder PDF Pages"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF पेज का क्रम बदलें, हटाएँ और घुमाएँ" : "Drag to reorder, delete, and rotate individual PDF pages with real-time preview"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={handleFiles} accept={{ "application/pdf": [".pdf"] }} />

                {loading && (
                    <div className="flex items-center justify-center gap-3 py-8">
                        <div className="h-6 w-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        <p className="text-slate-400 text-sm">{isHi ? "पेज प्रीव्यू रेंडर हो रहे हैं..." : "Rendering page previews..."}</p>
                    </div>
                )}

                {pages.length > 0 && !loading && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">
                                {isHi ? (
                                    <>
                                        <span className="text-indigo-400 font-bold">{pages.length}</span> पेज मिले · <span className="text-emerald-400 font-semibold">{activePages}</span> सक्रिय · <span className="text-red-400 font-semibold">{pages.length - activePages}</span> हटाए गए
                                    </>
                                ) : (
                                    <>
                                        <span className="text-indigo-400 font-bold">{pages.length}</span> pages detected · <span className="text-emerald-400 font-semibold">{activePages}</span> active · <span className="text-red-400 font-semibold">{pages.length - activePages}</span> deleted
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-slate-600">{isHi ? "क्रम बदलने के लिए थंबनेल खींचें" : "Drag thumbnails to reorder"}</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {pages.map((page, idx) => (
                                <div
                                    key={`${page.pageNum}-${idx}`}
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDrop={() => handleDrop(idx)}
                                    onDragEnd={handleDragEnd}
                                    className={`
                                        relative group rounded-xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
                                        ${dragOverIdx === idx ? "border-indigo-500 scale-105 shadow-lg shadow-indigo-500/20" : ""}
                                        ${dragIdx === idx ? "opacity-40 scale-95" : ""}
                                        ${page.deleted
                                            ? "border-red-500/40 bg-red-950/20"
                                            : "border-slate-700/50 bg-slate-800/50 hover:border-indigo-500/50"
                                        }
                                    `}
                                >
                                    {/* Thumbnail */}
                                    <div className="p-2 flex items-center justify-center overflow-hidden rounded-t-lg" style={{ minHeight: "160px" }}>
                                        <img
                                            src={page.thumbnail}
                                            alt={`Page ${page.pageNum}`}
                                            className={`max-w-full max-h-40 rounded shadow-md transition-all duration-300 ${page.deleted ? "opacity-30 grayscale" : ""}`}
                                            style={{ transform: `rotate(${page.rotation}deg)` }}
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Page label */}
                                    <div className={`px-2 py-1.5 text-center border-t ${page.deleted ? "border-red-500/20" : "border-slate-700/30"}`}>
                                        <span className={`text-xs font-bold ${page.deleted ? "text-red-400 line-through" : "text-indigo-400"}`}>
                                            {isHi ? `पेज ${page.pageNum}` : `Page ${page.pageNum}`}
                                        </span>
                                        {page.rotation > 0 && (
                                            <span className="ml-1 text-xs text-orange-400">↻{page.rotation}°</span>
                                        )}
                                    </div>

                                    {/* Hover controls overlay */}
                                    <div className="absolute inset-0 rounded-xl bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                                        {/* Move arrows */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveItem(idx, idx - 1); }}
                                                disabled={idx === 0}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                                            >
                                                ←
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveItem(idx, idx + 1); }}
                                                disabled={idx === pages.length - 1}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                                            >
                                                →
                                            </button>
                                        </div>

                                        {/* Rotate */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); rotatePage(idx); }}
                                            className="flex items-center justify-center gap-1 px-3 h-8 rounded-lg bg-orange-500/80 hover:bg-orange-500 text-white text-xs font-medium transition-colors"
                                        >
                                            {isHi ? "↻ घुमाएँ" : "↻ Rotate"}
                                        </button>

                                        {/* Delete / Restore */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleDelete(idx); }}
                                            className={`flex items-center justify-center gap-1 px-3 h-8 rounded-lg text-white text-xs font-medium transition-colors ${page.deleted
                                                ? "bg-emerald-500/80 hover:bg-emerald-500"
                                                : "bg-red-500/80 hover:bg-red-500"
                                                }`}
                                        >
                                            {page.deleted ? (isHi ? "↩ पुनर्स्थापित" : "↩ Restore") : (isHi ? "🗑 हटाएँ" : "🗑 Delete")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {pages.length > 0 && !loading && (
                    <>
                        <button onClick={handleProcess} disabled={activePages === 0} className="btn-primary w-full">
                            {isHi ? `बदलाव लागू करें (${activePages} पेज)` : `Apply Changes (${activePages} page${activePages !== 1 ? "s" : ""})`}
                        </button>

                        <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        {resultBlob && (
                            <div className="flex justify-center">
                                <DownloadButton onClick={() => downloadBlob(resultBlob, "reordered.pdf")} label={isHi ? "PDF डाउनलोड करें" : "Download Reordered PDF"} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/reorder-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
