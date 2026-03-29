"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import JSZip from "jszip";

interface ZipEntry {
    name: string;
    size: number;
    compressedSize: number;
    isDirectory: boolean;
    date: Date | null;
    dir: string;
    fullPath: string;
}

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const faqs = [
    { question: "Is my archive uploaded?", questionHi: "क्या मेरा आर्काइव अपलोड होता है?", answer: "No, the ZIP file is read entirely in your browser. Nothing is uploaded.", answerHi: "नहीं, ZIP फ़ाइल पूरी तरह से आपके ब्राउज़र में पढ़ी जाती है।" },
    { question: "Can I preview file contents?", questionHi: "क्या मैं फ़ाइल सामग्री देख सकता हूँ?", answer: "Yes, you can preview text files and images directly in the browser without extracting.", answerHi: "हाँ, आप टेक्स्ट और इमेज फ़ाइलों को बिना निकाले सीधे ब्राउज़र में देख सकते हैं।" },
];

export default function ArchivePreviewPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [entries, setEntries] = useState<ZipEntry[]>([]);
    const [fileName, setFileName] = useState("");
    const [totalFiles, setTotalFiles] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [previewContent, setPreviewContent] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState("");
    const [previewType, setPreviewType] = useState<"text" | "image" | null>(null);
    const [zipInstance, setZipInstance] = useState<JSZip | null>(null);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

    const processZip = async (file: File) => {
        setIsLoading(true);
        setError("");
        setEntries([]);
        setPreviewContent(null);
        setFileName(file.name);

        try {
            const zip = await JSZip.loadAsync(file);
            setZipInstance(zip);

            const items: ZipEntry[] = [];
            let fileCount = 0;
            const sizeMap: Record<string, number> = {};

            const filePromises: Promise<void>[] = [];

            zip.forEach((relativePath, zipEntry) => {
                const parts = relativePath.split('/');
                const isDir = zipEntry.dir;

                if (!isDir) {
                    fileCount++;
                    filePromises.push(
                        zipEntry.async("uint8array").then(data => {
                            sizeMap[relativePath] = data.length;
                        }).catch(() => {})
                    );
                }

                items.push({
                    name: parts[parts.length - 1] || relativePath,
                    size: 0,
                    compressedSize: 0,
                    isDirectory: isDir,
                    date: zipEntry.date || null,
                    dir: parts.slice(0, -1).join('/'),
                    fullPath: relativePath,
                });
            });

            await Promise.all(filePromises);

            let totalUncompressed = 0;
            items.forEach(item => {
                if (!item.isDirectory && sizeMap[item.fullPath]) {
                    item.size = sizeMap[item.fullPath];
                    totalUncompressed += sizeMap[item.fullPath];
                }
            });

            setEntries(items.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            }));
            setTotalFiles(fileCount);
            setTotalSize(totalUncompressed);
            setCompressedSize(totalUncompressed);
        } catch (err: any) {
            setError(isHi ? "ZIP फ़ाइल पढ़ने में त्रुटि" : "Failed to read ZIP file: " + (err.message || ""));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processZip(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processZip(e.target.files[0]);
        }
    };

    const previewFile = async (entry: ZipEntry) => {
        if (!zipInstance || entry.isDirectory) return;
        const fullPath = entry.dir ? `${entry.dir}/${entry.name}` : entry.name;

        try {
            const ext = entry.name.split('.').pop()?.toLowerCase() || '';
            const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'];
            const textExts = ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts', 'csv', 'log', 'yml', 'yaml', 'ini', 'cfg', 'conf', 'sh', 'bat', 'py', 'java', 'c', 'cpp', 'h'];

            if (imageExts.includes(ext)) {
                const blob = await zipInstance.file(fullPath)?.async("blob");
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    setPreviewContent(url);
                    setPreviewName(entry.name);
                    setPreviewType("image");
                }
            } else if (textExts.includes(ext) || entry.size < 100000) {
                const text = await zipInstance.file(fullPath)?.async("string");
                if (text !== undefined) {
                    setPreviewContent(text);
                    setPreviewName(entry.name);
                    setPreviewType("text");
                }
            } else {
                setPreviewContent(null);
                setPreviewName("");
                setPreviewType(null);
            }
        } catch {
            setPreviewContent(null);
            setPreviewName("");
            setPreviewType(null);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📦 आर्काइव प्रीव्यूअर" : "📦 Archive Previewer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "ZIP आर्काइव की सामग्री देखें बिना निकाले" : "View the contents of ZIP archives without extracting"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Dropzone */}
                <div
                    onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => document.getElementById('archive-input')?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all min-h-[180px] flex flex-col items-center justify-center
                        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'}`}
                >
                    <input type="file" accept=".zip,.jar,.war,.ear,.apk" className="hidden" id="archive-input" onChange={handleFileSelect} />
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    </div>
                    <p className="text-slate-300 font-medium">{isHi ? "ZIP फ़ाइल यहाँ खींचें" : "Drop a ZIP file here or click to browse"}</p>
                    <p className="text-xs text-slate-500 mt-1">.zip, .jar, .war, .apk</p>
                </div>

                {isLoading && <div className="text-center text-indigo-400">{isHi ? "पढ़ा जा रहा है..." : "Reading archive..."}</div>}
                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}

                {/* Archive Info */}
                {entries.length > 0 && (
                    <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div><span className="text-slate-500">{isHi ? "फ़ाइल:" : "File:"}</span> <span className="text-slate-200 font-medium">{fileName}</span></div>
                            <div><span className="text-slate-500">{isHi ? "फ़ाइलें:" : "Files:"}</span> <span className="text-indigo-400 font-bold">{totalFiles}</span></div>
                            <div><span className="text-slate-500">{isHi ? "कुल आकार:" : "Total Size:"}</span> <span className="text-slate-200">{formatSize(totalSize)}</span></div>
                            <div><span className="text-slate-500">{isHi ? "संपीड़ित:" : "Compressed:"}</span> <span className="text-slate-200">{formatSize(compressedSize)}</span></div>
                            {totalSize > 0 && <div><span className="text-slate-500">{isHi ? "अनुपात:" : "Ratio:"}</span> <span className="text-green-400">{Math.round((1 - compressedSize / totalSize) * 100)}%</span></div>}
                        </div>
                    </div>
                )}

                {/* File Tree + Preview */}
                {entries.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden max-h-[500px] overflow-y-auto">
                            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700/50 text-sm font-semibold text-slate-300 sticky top-0">
                                {isHi ? "फ़ाइल सूची" : "File List"}
                            </div>
                            {entries.map((entry, i) => (
                                <button
                                    key={i}
                                    onClick={() => previewFile(entry)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-800/50 transition-colors border-b border-slate-700/20 last:border-b-0"
                                >
                                    <span className="text-base flex-shrink-0">
                                        {entry.isDirectory ? '📁' : entry.name.endsWith('.png') || entry.name.endsWith('.jpg') ? '🖼️' : entry.name.endsWith('.json') ? '📋' : entry.name.endsWith('.js') || entry.name.endsWith('.ts') ? '📜' : '📄'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-slate-300 truncate">{entry.name}</div>
                                        {entry.dir && <div className="text-xs text-slate-600 truncate">{entry.dir}</div>}
                                    </div>
                                    {!entry.isDirectory && <span className="text-xs text-slate-500 font-mono flex-shrink-0">{formatSize(entry.size)}</span>}
                                </button>
                            ))}
                        </div>

                        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden min-h-[300px]">
                            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700/50 text-sm font-semibold text-slate-300">
                                {previewName ? previewName : (isHi ? "प्रीव्यू" : "Preview")}
                            </div>
                            <div className="p-4 max-h-[450px] overflow-auto">
                                {!previewContent ? (
                                    <p className="text-slate-500 text-sm text-center mt-10">{isHi ? "प्रीव्यू के लिए फ़ाइल पर क्लिक करें" : "Click a file to preview"}</p>
                                ) : previewType === "image" ? (
                                    <img src={previewContent} alt={previewName} className="max-w-full rounded-lg" />
                                ) : (
                                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all">{previewContent}</pre>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/archive-preview" tools={ALL_TOOLS} />
        </div>
    );
}
