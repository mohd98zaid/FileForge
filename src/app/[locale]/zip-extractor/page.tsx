"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import JSZip from "jszip";

const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface ZipEntry {
    name: string;
    dir: boolean;
    date: Date;
    _data: any; // JSZip internal reference needed for extraction
}

const faqs = [
    { question: "Is it safe to extract files here?", questionHi: "क्या यहाँ फ़ाइलें निकालना सुरक्षित है?", answer: "Yes. The ZIP is extracted locally in your browser's memory. The contents are never uploaded to any server.", answerHi: "हाँ। ZIP को आपके ब्राउज़र की मेमोरी में स्थानीय रूप से निकाला जाता है। सामग्री को कभी भी किसी सर्वर पर अपलोड नहीं किया जाता है।" },
    { question: "Can I extract password-protected ZIPs?", questionHi: "क्या मैं पासवर्ड से सुरक्षित ZIP निकाल सकता हूँ?", answer: "Currently, this tool does not support encrypted/password-protected ZIP archives. Standard ZIPs work perfectly.", answerHi: "वर्तमान में, यह टूल एन्क्रिप्टेड/पासवर्ड से सुरक्षित ZIP अभिलेखागार का समर्थन नहीं करता है। मानक ZIP पूरी तरह से काम करते हैं।" },
    { question: "Why extract one by one?", questionHi: "एक-एक करके क्यों निकालें?", answer: "Browsers restrict websites from silently downloading hundreds of files to your hard drive for security reasons. This tool lets you inspect the ZIP and save exactly what you need.", answerHi: "ब्राउज़र सुरक्षा कारणों से वेबसाइटों को आपके हार्ड ड्राइव पर चुपचाप सैकड़ों फ़ाइलों को डाउनलोड करने से रोकते हैं। यह टूल आपको ZIP का निरीक्षण करने और वास्तव में जो आपको चाहिए उसे सहेजने देता है।" },
];

export default function ZipExtractorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [zipFile, setZipFile] = useState<File | null>(null);
    const [entries, setEntries] = useState<ZipEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setZipFile(file);
        setIsLoading(true);
        setError(null);
        setEntries([]);

        try {
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            
            const fileList: ZipEntry[] = [];
            contents.forEach((relativePath, zipEntry) => {
                fileList.push(zipEntry as unknown as ZipEntry);
            });
            
            // Sort: directories first, then alphabetical
            fileList.sort((a, b) => {
                if (a.dir && !b.dir) return -1;
                if (!a.dir && b.dir) return 1;
                return a.name.localeCompare(b.name);
            });

            setEntries(fileList);
        } catch (err: any) {
            console.error("ZIP Extractor error:", err);
            setError(isHi ? "ZIP फ़ाइल पढ़ने में विफल। यह एक अमान्य या एन्क्रिप्टेड संग्रह हो सकता है।" : "Failed to read ZIP file. It may be invalid or encrypted.");
        } finally {
            setIsLoading(false);
        }
    };

    const downloadFile = async (entry: any) => {
        if (entry.dir) return; // Can't "download" a directory structure natively easily without re-zipping

        try {
            const blob = await entry.async("blob");
            const url = URL.createObjectURL(blob);
            
            // Extract just the filename from the path
            const parts = entry.name.split('/');
            const filename = parts[parts.length - 1] || entry.name;

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to extract file:", err);
            alert(isHi ? "फ़ाइल निकालने में विफल।" : "Failed to extract file.");
        }
    };

    const reset = () => {
        setZipFile(null);
        setEntries([]);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📦 ZIP एक्सट्रैक्टर" : "📦 ZIP Extractor"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "सुरक्षित रूप से खोलें और अपने ब्राउज़र में ZIP फ़ाइलों से सामग्री निकालें" : "Safely open and extract contents from ZIP archives right in your browser"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto flex flex-col gap-8">
                
                {!zipFile ? (
                    // Upload Area
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 hover:border-indigo-500 rounded-2xl p-16 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]"
                    >
                        <input 
                            type="file" 
                            accept=".zip,application/zip,application/x-zip-compressed" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect}
                        />
                        
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 rotate-3 hover:rotate-6 transition-transform">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-200 mb-2">
                            {isHi ? "ZIP फ़ाइल चुनने के लिए क्लिक करें" : "Click to select a ZIP file"}
                        </h3>
                        <p className="text-slate-400">
                            {isHi ? "या संग्रह को यहाँ खींचें और छोड़ें" : "Secure, local extraction. No uploads."}
                        </p>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 max-w-md w-full">
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    // Viewer Area
                    <div className="space-y-6">
                        
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-bold text-slate-200 truncate" title={zipFile.name}>{zipFile.name}</h3>
                                    <p className="text-sm text-slate-400 font-mono">{formatSize(zipFile.size)} • {entries.length} items</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={reset}
                                className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                {isHi ? "दूसरी फ़ाइल चुनें" : "Close Archive"}
                            </button>
                        </div>

                        {/* File Tree */}
                        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-inner">
                            {isLoading ? (
                                <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                                    <svg className="animate-spin w-8 h-8 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    {isHi ? "संग्रह पढ़ा जा रहा है..." : "Reading archive contents..."}
                                </div>
                            ) : entries.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    {isHi ? "यह आर्काइव खाली है।" : "This archive is empty."}
                                </div>
                            ) : (
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left text-sm text-slate-300">
                                        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 sticky top-0 backdrop-blur-sm">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">{isHi ? "नाम" : "Name"}</th>
                                                <th className="px-6 py-4 font-semibold w-32 hidden sm:table-cell">{isHi ? "संशोधित" : "Modified"}</th>
                                                <th className="px-6 py-4 font-semibold text-right w-32">{isHi ? "क्रिया" : "Action"}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {entries.map((entry, idx) => {
                                                const depth = entry.name.split('/').filter(Boolean).length - 1;
                                                const parts = entry.name.split('/').filter(Boolean);
                                                const displayName = parts[parts.length - 1] || entry.name;
                                                
                                                return (
                                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                                        <td className="px-6 py-3 font-medium flex items-center gap-3">
                                                            {/* Indentation based on depth for a pseudo-tree look */}
                                                            <div style={{ paddingLeft: `${depth * 16}px` }} className="flex items-center gap-3 w-full">
                                                                {entry.dir ? (
                                                                    <svg className="w-5 h-5 text-yellow-500 fill-yellow-500/20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                                                )}
                                                                <span className={`truncate ${entry.dir ? 'text-slate-200' : 'text-slate-300'}`} title={entry.name}>
                                                                    {displayName}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-slate-500 hidden sm:table-cell">
                                                            {entry.date ? entry.date.toLocaleDateString() : '--'}
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            {!entry.dir && (
                                                                <button 
                                                                    onClick={() => downloadFile(entry)}
                                                                    className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors font-medium text-xs border border-indigo-500/20 group-hover:border-indigo-500/50"
                                                                >
                                                                    {isHi ? "निकालें" : "Extract"}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/zip-extractor" tools={ALL_TOOLS} />
        </div>
    );
}
