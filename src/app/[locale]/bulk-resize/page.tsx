"use client";

import { useLocale } from "next-intl";

import { useState, useMemo } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { resizeImage } from "@/utils/image-processing";
import { createZip } from "@/utils/pdf-processing";

const faqs = [
    { question: "How many images at once?", questionHi: "एक बार में कितनी इमेज?", answer: "Up to 10 images at once.", answerHi: "एक बार में 10 इमेज तक रिसाइज़ कर सकते हैं।" },
    { question: "Can I set different sizes?", questionHi: "क्या अलग-अलग साइज़ सेट कर सकते हैं?", answer: "All images are resized to the same dimensions — one setting at a time.", answerHi: "सभी इमेज एक ही साइज़ में रिसाइज़ होती हैं — एक बार में एक सेटिंग।" },
];

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function BulkResizePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState<"pixels" | "percentage">("pixels");
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [percentage, setPercentage] = useState(50);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const totalSize = useMemo(() => files.reduce((acc, f) => acc + f.size, 0), [files]);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            const processedFiles: File[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let targetW: number | undefined;
                let targetH: number | undefined;

                if (mode === "pixels") {
                    targetW = width;
                    targetH = height;
                } else {
                    const bmp = await createImageBitmap(file);
                    targetW = Math.round(bmp.width * (percentage / 100));
                    targetH = Math.round(bmp.height * (percentage / 100));
                    bmp.close();
                }

                if (mode === "pixels" && maintainAspect && targetW && targetH) {
                    const bmp = await createImageBitmap(file);
                    const ratio = Math.min(targetW / bmp.width, targetH / bmp.height);
                    targetW = Math.round(bmp.width * ratio);
                    targetH = Math.round(bmp.height * ratio);
                    bmp.close();
                }

                const resized = await resizeImage(file, targetW, targetH, false);
                processedFiles.push(resized);

                setProgress(10 + Math.round(((i + 1) / files.length) * 80));
            }

            const zipBlob = await createZip(processedFiles);
            setResultBlob(zipBlob);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || (isHi ? "बल्क रिसाइज़ विफल रहा।" : "Bulk resize failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📐 एक साथ कई इमेज रिसाइज़" : "📐 Bulk Image Resize"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "एक साथ कई चित्रों का आकार बदलें" : "Resize up to 10 images at once — download as ZIP"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={10} onFilesSelected={(f) => { setFiles(f); setResultBlob(null); }} label={isHi ? "यहाँ इमेजिस ड्रॉप करें" : "Drop images here"} hint={isHi ? "ZIP डाउनलोड के रूप में एक साथ साइज़ बदलें" : "Resize multiple up to 10 files"} />

                {files.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-sm text-slate-300">{files.length} {isHi ? "इमेज चुनी गईं" : "image(s) selected"} · {isHi ? "कुल:" : "Total:"} <span className="text-indigo-400 font-semibold">{formatSize(totalSize)}</span></p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button onClick={() => setMode("pixels")} className={mode === "pixels" ? "btn-primary" : "btn-secondary"}>{isHi ? "डाइमेंशन द्वारा" : "By Dimensions"}</button>
                    <button onClick={() => setMode("percentage")} className={mode === "percentage" ? "btn-primary" : "btn-secondary"}>{isHi ? "प्रतिशत द्वारा" : "By Percentage"}</button>
                </div>

                {mode === "pixels" ? (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{isHi ? "चौड़ाई (px)" : "Width (px)"}</label>
                            <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">{isHi ? "ऊँचाई (px)" : "Height (px)"}</label>
                            <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} className="input-field" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "स्केल:" : "Scale:"} {percentage}%</label>
                        <input type="range" min={10} max={200} value={percentage} onChange={(e) => setPercentage(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                )}

                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                    <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="accent-indigo-500" />
                    {isHi ? "आस्पेक्ट रेशियो बनाए रखें" : "Maintain aspect ratio"}
                </label>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "सभी इमेज रिसाइज़ करें" : "Resize All Images"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "bulk_resized.zip")} label={isHi ? "सभी डाउनलोड करें (ZIP)" : "Download ZIP"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/bulk-resize" tools={ALL_TOOLS} />
        </div>
    );
}
