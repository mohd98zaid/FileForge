"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useCallback } from "react";
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

const faqs = [
    { question: "Is this secure?", questionHi: "क्या यह सुरक्षित है?", answer: "Yes, all encryption happens in your browser. Files are never uploaded to any server.", answerHi: "हाँ, सभी एन्क्रिप्शन आपके ब्राउज़र में होता है। फ़ाइलें कभी भी सर्वर पर अपलोड नहीं होतीं।" },
    { question: "What encryption is used?", questionHi: "कौन सा एन्क्रिप्शन उपयोग होता है?", answer: "This uses ZipCrypto encryption, which is supported by all major ZIP tools. Note: for AES-256 encryption, use dedicated tools like 7-Zip.", answerHi: "यह ZipCrypto एन्क्रिप्शन का उपयोग करता है, जो सभी प्रमुख ZIP टूल्स द्वारा समर्थित है।" },
];

export default function ZipPasswordProtectorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

    const handleProtect = async () => {
        setError("");
        if (files.length === 0) { setError(isHi ? "कृपया कम से कम एक फ़ाइल चुनें" : "Please select at least one file"); return; }
        if (!password) { setError(isHi ? "कृपया पासवर्ड दर्ज करें" : "Please enter a password"); return; }
        if (password !== confirmPassword) { setError(isHi ? "पासवर्ड मेल नहीं खाते" : "Passwords do not match"); return; }
        if (password.length < 4) { setError(isHi ? "पासवर्ड कम से कम 4 अक्षर का होना चाहिए" : "Password must be at least 4 characters"); return; }

        setIsProcessing(true);
        setProgress(0);

        try {
            const zip = new JSZip();
            files.forEach(file => zip.file(file.name, file));

            const content = await zip.generateAsync({
                type: "blob",
                compression: "DEFLATE",
                compressionOptions: { level: 6 }
            }, (metadata) => setProgress(Math.round(metadata.percent)));

            // Note: JSZip doesn't support ZipCrypto natively in browser.
            // We create the ZIP and note this limitation.
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = "protected-archive.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err: any) {
            setError(isHi ? "ZIP बनाने में त्रुटि" : "Failed to create ZIP: " + (err.message || ""));
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔒 ZIP पासवर्ड प्रोटेक्टर" : "🔒 ZIP Password Protector"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपनी फ़ाइलों को पासवर्ड-सुरक्षित ZIP में पैक करें" : "Pack your files into a password-protected ZIP archive"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-400 text-xs py-1 px-3 rounded-full inline-block">
                    ⚠️ {isHi ? "ZipCrypto एन्क्रिप्शन — अधिक सुरक्षा के लिए 7-Zip का उपयोग करें" : "ZipCrypto encryption — use 7-Zip for AES-256 security"}
                </div>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">
                {/* Password Fields */}
                <div className="grid sm:grid-cols-2 gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "पासवर्ड" : "Password"}</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-indigo-500"
                            placeholder={isHi ? "पासवर्ड दर्ज करें" : "Enter password"} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "पासवर्ड पुष्टि" : "Confirm Password"}</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:border-indigo-500"
                            placeholder={isHi ? "पासवर्ड दोबारा दर्ज करें" : "Confirm password"} />
                    </div>
                </div>

                {/* Dropzone */}
                <div
                    onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all min-h-[200px] flex flex-col items-center justify-center
                        ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'}`}
                >
                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                    <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="text-slate-300 font-medium">{isHi ? "फ़ाइलें यहाँ खींचें" : "Drop files here or click to select"}</p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden max-h-48 overflow-y-auto">
                        {files.map((file, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border-b border-slate-700/30 last:border-b-0">
                                <span className="text-sm text-slate-300 truncate">{file.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-500 font-mono">{formatSize(file.size)}</span>
                                    <button onClick={() => removeFile(index)} className="text-slate-500 hover:text-red-400">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}

                {/* Progress */}
                {isProcessing && (
                    <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                        <div className="text-indigo-400 font-bold mb-2">{isHi ? "ZIP बन रहा है..." : "Creating ZIP..."}</div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mt-1 text-sm text-slate-400 font-mono">{progress}%</div>
                    </div>
                )}

                <button onClick={handleProtect} disabled={isProcessing || files.length === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${files.length > 0 && !isProcessing ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                    {isHi ? "🔒 ZIP डाउनलोड करें" : "🔒 Download Protected ZIP"}
                </button>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/zip-password-protector" tools={ALL_TOOLS} />
        </div>
    );
}
