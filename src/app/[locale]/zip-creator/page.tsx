"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useCallback } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import JSZip from "jszip";

// Inline formatBytes
const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const faqs = [
    { question: "Are my files uploaded to a server?", questionHi: "क्या मेरी फाइलें किसी सर्वर पर अपलोड की जाती हैं?", answer: "No, this tool works entirely in your browser. Your files never leave your device, ensuring complete privacy and fast processing.", answerHi: "नहीं, यह टूल पूरी तरह से आपके ब्राउज़र में काम करता है। आपकी फाइलें कभी भी आपके डिवाइस से बाहर नहीं जाती हैं, जिससे पूर्ण गोपनीयता और तेज़ प्रोसेसिंग सुनिश्चित होती है।" },
    { question: "Is there a file size limit?", questionHi: "क्या कोई फ़ाइल आकार सीमा है?", answer: "The limit depends on your browser's memory (RAM). It generally works well for files up to a few hundred megabytes.", answerHi: "सीमा आपके ब्राउज़र की मेमोरी (RAM) पर निर्भर करती है। यह आम तौर पर कुछ सौ मेगाबाइट तक की फ़ाइलों के लिए अच्छा काम करता है।" },
    { question: "Can I create folders inside the ZIP?", questionHi: "क्या मैं ZIP के अंदर फ़ोल्डर बना सकता हूँ?", answer: "Currently, this tool packs all dropped files into the root of the ZIP file.", answerHi: "वर्तमान में, यह टूल सभी ड्रॉप की गई फ़ाइलों को ZIP फ़ाइल के मूल (root) में पैक करता है।" },
];

export default function ZipCreatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [zipName, setZipName] = useState("archive");
    const [compressionLevel, setCompressionLevel] = useState<number>(5);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const totalOriginalSize = files.reduce((acc, file) => acc + file.size, 0);

    const generateZip = async () => {
        if (files.length === 0) return;
        setIsCompressing(true);
        setProgress(0);

        try {
            const zip = new JSZip();

            // Add all files to the zip instance
            files.forEach(file => {
                zip.file(file.name, file);
            });

            // Generate the zip with standard DEFLATE compression
            const content = await zip.generateAsync({ 
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: {
                    level: compressionLevel
                }
            }, (metadata) => {
                setProgress(Math.round(metadata.percent));
            });

            // Create download link
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${zipName || 'archive'}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("ZIP Generation failed:", error);
            alert(isHi ? "ZIP बनाने में त्रुटि। कृपया पुनः प्रयास करें।" : "Failed to generate ZIP. Please try again.");
        } finally {
            setIsCompressing(false);
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🗜️ ZIP निर्माता" : "🗜️ ZIP Creator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "एकाधिक फ़ाइलों को आपके ब्राउज़र में सुरक्षित रूप से एक ZIP में संपीड़ित करें" : "Compress multiple files into a single ZIP archive securely in your browser"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto flex flex-col gap-8">
                
                {/* Configuration Row */}
                <div className="flex flex-col sm:flex-row gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex-1">
                        <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">{isHi ? "संग्रह का नाम" : "Archive Name"}</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={zipName}
                                onChange={(e) => setZipName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none pr-10 text-slate-200 font-mono"
                                placeholder="my-files"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">.zip</span>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-slate-400 uppercase tracking-widest">{isHi ? "संपीड़न स्तर" : "Compression Level"}</label>
                            <span className="text-xs text-indigo-400 font-mono">Level {compressionLevel}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="9"
                            step="1"
                            value={compressionLevel}
                            onChange={(e) => setCompressionLevel(Number(e.target.value))}
                            className="w-full accent-indigo-500 mt-2"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>{isHi ? "तेज़" : "Fast"}</span>
                            <span>{isHi ? "अधिकतम संपीड़न" : "Max Compression"}</span>
                        </div>
                    </div>
                </div>

                {/* Dropzone */}
                <div 
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[250px]
                        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500'}`}
                >
                    <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect}
                    />
                    
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                        {isHi ? "फ़ाइलें यहाँ खींचें और छोड़ें" : "Drag & Drop files here"}
                    </h3>
                    <p className="text-slate-400 text-sm">
                        {isHi ? "या अपने डिवाइस से ब्राउज़ करने के लिए क्लिक करें" : "or click to browse from your device"}
                    </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-300">
                                {isHi ? `चयनित फ़ाइलें (${files.length})` : `Selected Files (${files.length})`}
                            </h3>
                            <span className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                                Total: {formatSize(totalOriginalSize)}
                            </span>
                        </div>
                        
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex justify-between items-center bg-slate-800/40 p-3 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        <span className="text-sm text-slate-300 truncate font-medium">{file.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                                        <span className="text-xs text-slate-500 font-mono">{formatSize(file.size)}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                            title="Remove File"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Area */}
                <div className="flex flex-col items-center border-t border-slate-700/50 pt-6">
                    {isCompressing ? (
                        <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl border border-indigo-500/30 text-center">
                            <div className="text-indigo-400 font-bold mb-4">{isHi ? "संपीड़ित किया जा रहा है..." : "Compressing Archive..."}</div>
                            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
                                <div 
                                    className="bg-indigo-500 h-3 rounded-full transition-all duration-300 relative" 
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-slate-400 font-mono">{progress}%</div>
                        </div>
                    ) : (
                        <button
                            onClick={generateZip}
                            disabled={files.length === 0}
                            className={`w-full max-w-md py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-3
                                ${files.length > 0 
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] hover:shadow-indigo-500/25' 
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            {isHi ? "ZIP डाउनलोड करें" : "Download ZIP"}
                        </button>
                    )}
                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/zip-creator" tools={ALL_TOOLS} />
        </div>
    );
}
