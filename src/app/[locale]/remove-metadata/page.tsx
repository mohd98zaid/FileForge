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
import { resizeImage } from "@/utils/image-processing"; // Pick right tools for task

const faqs = [
    { question: "What metadata is removed?", questionHi: "कौन सा मेटाडेटा हटता है?", answer: "EXIF data, GPS location, camera info — everything is stripped.", answerHi: "EXIF डेटा, GPS लोकेशन, कैमरा जानकारी — सब हट जाता है।" },
    { question: "Why should I remove metadata?", questionHi: "मेटाडेटा क्यों हटाना चाहिए?", answer: "For privacy — images contain your location, device info, and timestamps.", answerHi: "प्राइवेसी के लिए — इमेज में आपकी लोकेशन, डिवाइस की जानकारी छिपी होती है।" },
];

export default function RemoveMetadataPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState<"all" | "gps">("all");
    const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMeta, setLoadingMeta] = useState(false);

    const loadMetadata = async (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setMetadata(null);
        if (!f.length) return;

        setMetadata({
            format: f[0].type,
            size: `${(f[0].size / 1024).toFixed(1)} KB`,
            mode: isHi ? "क्लाइंट-साइड (एक्सिफ़ प्रीव्यू उपलब्ध नहीं)" : "Client-side (EXIF preview unavailable without backend)"
        });
    };

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const file = files[0];
            const bmp = await createImageBitmap(file);
            const w = bmp.width;
            const h = bmp.height;
            bmp.close();

            const cleanImage = await resizeImage(file, w, h, false);
            setResultBlob(cleanImage);
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || (isHi ? "मेटाडेटा हटाना विफल रहा।" : "Metadata removal failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🧹 मेटाडेटा हटाएँ" : "🧹 Remove Image Metadata"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "EXIF डेटा, GPS, कैमरा जानकारी हटाएँ" : "Strip EXIF data — camera info, GPS, timestamps & more"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={loadMetadata} accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".bmp"] }} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} hint={isHi ? "JPG, PNG, WebP" : "JPG, PNG, WebP"} />

                {loadingMeta && <p className="text-sm text-slate-400 text-center animate-pulse">{isHi ? "मेटाडेटा पढ़ा जा रहा है..." : "Reading metadata..."}</p>}

                {metadata && (
                    <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 overflow-hidden">
                        <div className="p-3 border-b border-slate-700/50">
                            <h3 className="text-sm font-semibold text-slate-300">📋 {isHi ? "प्राप्त मेटाडेटा" : "Detected Metadata"}</h3>
                        </div>
                        <div className="p-3 max-h-48 overflow-y-auto">
                            {metadata.metadata && Object.keys(metadata.metadata).length > 0 ? (
                                <table className="w-full text-xs">
                                    <tbody>
                                        {Object.entries(metadata.metadata).map(([key, val]) => (
                                            <tr key={key} className="border-b border-slate-700/30">
                                                <td className="py-1 pr-3 text-slate-400 font-medium">{key}</td>
                                                <td className="py-1 text-slate-300">{typeof val === "object" ? JSON.stringify(val) : String(val)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-slate-500">{isHi ? "कोई मेटाडेटा नहीं मिला।" : "No metadata found."}</p>
                            )}
                        </div>
                        <div className="p-2 bg-slate-900/30 text-xs text-slate-500">
                            {isHi ? "फ़ॉर्मेट:" : "Format:"} {metadata.format} · {isHi ? "साइज़:" : "Size:"} {metadata.size} · {isHi ? "मोड:" : "Mode:"} {metadata.mode}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "हटाने का मोड" : "Removal Mode"}</label>
                    <div className="flex gap-3">
                        <button onClick={() => setMode("all")} className={mode === "all" ? "btn-primary flex-1" : "btn-secondary flex-1"}>{isHi ? "सभी मेटाडेटा हटाएँ" : "Remove All Metadata"}</button>
                        <button onClick={() => setMode("gps")} className={mode === "gps" ? "btn-primary flex-1" : "btn-secondary flex-1"}>{isHi ? "सिर्फ़ GPS हटाएँ" : "Remove GPS Only"}</button>
                    </div>
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "इमेज साफ़ करें" : "Clean Image"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "cleaned_image.jpg")} label={isHi ? "साफ़ चित्र डाउनलोड करें" : "Download Cleaned Image"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/remove-metadata" tools={ALL_TOOLS} />
        </div>
    );
}
