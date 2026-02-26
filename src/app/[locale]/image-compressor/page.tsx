"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import { downloadBlob } from "@/lib/api";

const faqs = [
    { question: "How is this different from Compress Image?", questionHi: "यह 'इमेज कंप्रेस करें' से अलग कैसे है?", answer: "This is a lighter version using the browser-image-compression library.", answerHi: "यह एक लाइट वर्शन है जो browser-image-compression लाइब्रेरी का इस्तेमाल करता है।" },
    { question: "Is it processed locally?", questionHi: "क्या यह लोकली प्रोसेस होता है?", answer: "Yes, 100% browser-based.", answerHi: "हाँ, 100% ब्राउज़र में।" },
];

export default function ImageCompressorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [quality, setQuality] = useState(0.8);

    const handleFile = (files: File[]) => {
        if (files.length) {
            setFile(files[0]);
            setCompressedFile(null);
        }
    };

    const compress = async () => {
        if (!file) return;
        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: quality,
            };

            const compressed = await imageCompression(file, options);
            setCompressedFile(compressed);
        } catch (e) {
            console.error(e);
            alert(isHi ? "कंप्रेस करना विफल रहा।" : "Compression failed.");
        } finally {
            setIsCompressing(false);
        }
    };

    const formatSize = (size: number) => {
        const kb = (size / 1024).toFixed(1);
        const mb = (size / 1024 / 1024).toFixed(2);
        return size >= 1024 * 1024
            ? `${mb} MB (${Math.round(size / 1024)} KB)`
            : `${kb} KB (${mb} MB)`;
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📉 इमेज कंप्रेसर" : "📉 Image Compressor"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "इमेज को ब्राउज़र में कंप्रेस करें" : "Reduce file size while maintaining quality"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <FileUpload
                    accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                    maxFiles={1}
                    onFilesSelected={handleFile}
                    label={isHi ? "यहाँ टूट-फूट इमेज ड्रॉप करें" : "Drop image here"}
                    hint={isHi ? "JPG, PNG, WebP — अधिकतम 20MB" : "JPG, PNG, WebP — Max 20MB"}
                />

                {file && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Original */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-300">{isHi ? "मूल" : "Original"}</h3>
                            <div className="relative rounded-lg overflow-hidden border border-slate-700 aspect-video bg-black/50 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={URL.createObjectURL(file)} alt="Original" className="max-w-full max-h-full object-contain" />
                                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                                    {formatSize(file.size)}
                                </div>
                            </div>
                        </div>

                        {/* Controls & Result */}
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
                                <div className="flex justify-between">
                                    <label className="text-sm text-slate-400">{isHi ? "क्वालिटी:" : "Quality:"} {Math.round(quality * 100)}%</label>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />

                                <button
                                    onClick={compress}
                                    disabled={isCompressing}
                                    className="btn-primary w-full"
                                >
                                    {isCompressing ? (isHi ? "कंप्रेस हो रहा है..." : "Compressing...") : (isHi ? "इमेज कंप्रेस करें" : "Compress Image")}
                                </button>
                            </div>

                            {compressedFile && (
                                <div className="animate-fade-in space-y-4">
                                    <h3 className="font-semibold text-green-400">{isHi ? "कंप्रेस किया हुआ रिज़ल्ट" : "Compressed Result"}</h3>
                                    <div className="flex items-center justify-between bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                                        <div>
                                            <p className="text-xl font-mono text-white">{formatSize(compressedFile.size)}</p>
                                            <p className="text-xs text-green-400">
                                                -{Math.round(((file.size - compressedFile.size) / file.size) * 100)}% {isHi ? "की कमी (reduction)" : "reduction"}
                                            </p>
                                        </div>
                                        <DownloadButton
                                            onClick={() => {
                                                downloadBlob(compressedFile, `compressed_${file.name}`);
                                            }}
                                            label={isHi ? "डाउनलोड करें" : "Download"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/image-compressor" tools={ALL_TOOLS} />
        </div>
    );
}
