"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What hashing algorithms are supported?", questionHi: "कौन से हैशिंग एल्गोरिदम समर्थित हैं?", answer: "SHA-1, SHA-256, and SHA-512 via the browser's built-in Web Crypto API.", answerHi: "SHA-1, SHA-256 और SHA-512 — ब्राउज़र की बिल्ट-इन वेब क्रिप्टो API के माध्यम से।" },
    { question: "Is my data uploaded?", questionHi: "क्या मेरा डेटा अपलोड होता है?", answer: "No. Files are read locally and hashed entirely in your browser using crypto.subtle.digest.", answerHi: "नहीं। फ़ाइलें स्थानीय रूप से पढ़ी जाती हैं और crypto.subtle.digest का उपयोग करके पूरी तरह ब्राउज़र में हैश की जाती हैं।" },
    { question: "Why compare file hashes?", questionHi: "फ़ाइल हैश की तुलना क्यों करें?", answer: "To verify file integrity — if two files have identical hashes, they are byte-for-byte identical. Useful for verifying downloads.", answerHi: "फ़ाइल इंटेग्रिटी सत्यापित करने के लिए — यदि दो फ़ाइलों के हैश समान हैं, तो वे बाइट-दर-बाइट समान हैं। डाउनलोड सत्यापन के लिए उपयोगी।" },
];

type Algorithm = "SHA-1" | "SHA-256" | "SHA-512";

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function hashFile(file: File, algo: Algorithm): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algo, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function FileHashComparePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [fileA, setFileA] = useState<File | null>(null);
    const [fileB, setFileB] = useState<File | null>(null);
    const [hashA, setHashA] = useState("");
    const [hashB, setHashB] = useState("");
    const [algo, setAlgo] = useState<Algorithm>("SHA-256");
    const [isHashing, setIsHashing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputARef = useRef<HTMLInputElement>(null);
    const inputBRef = useRef<HTMLInputElement>(null);

    const handleFileA = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setFileA(f);
        setHashA("");
        setError(null);
    };

    const handleFileB = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setFileB(f);
        setHashB("");
        setError(null);
    };

    const compare = async () => {
        if (!fileA || !fileB) return;
        setIsHashing(true);
        setError(null);
        setHashA("");
        setHashB("");
        try {
            const [a, b] = await Promise.all([hashFile(fileA, algo), hashFile(fileB, algo)]);
            setHashA(a);
            setHashB(b);
        } catch (e: any) {
            setError(e?.message || (isHi ? "हैशिंग में त्रुटि" : "Hashing error"));
        }
        setIsHashing(false);
    };

    const match = hashA && hashB && hashA === hashB;
    const noMatch = hashA && hashB && hashA !== hashB;

    const DropZone = ({
        label,
        file,
        onClick,
    }: {
        label: string;
        file: File | null;
        onClick: () => void;
    }) => (
        <div
            onClick={onClick}
            className="border-2 border-dashed border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors min-h-[140px]"
        >
            {file ? (
                <>
                    <span className="text-sm font-semibold text-slate-200 truncate max-w-full">{file.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{formatSize(file.size)}</span>
                    <span className="text-xs text-indigo-400 mt-2">
                        {isHi ? "बदलने के लिए क्लिक करें" : "Click to change"}
                    </span>
                </>
            ) : (
                <>
                    <svg className="w-8 h-8 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-medium text-slate-400">{label}</span>
                </>
            )}
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔍 फ़ाइल हैश तुलना" : "🔍 File Hash Compare"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "दो फ़ाइलों के हैश की तुलना करके सत्यापित करें" : "Compare hashes of two files to verify integrity"}
                </p>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">
                {/* Algorithm */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-300">
                        {isHi ? "एल्गोरिदम:" : "Algorithm:"}
                    </label>
                    {(["SHA-1", "SHA-256", "SHA-512"] as Algorithm[]).map((a) => (
                        <button
                            key={a}
                            onClick={() => { setAlgo(a); setHashA(""); setHashB(""); }}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                algo === a
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                            }`}
                        >
                            {a}
                        </button>
                    ))}
                </div>

                {/* Upload zones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-slate-300">
                            {isHi ? "फ़ाइल A" : "File A"}
                        </span>
                        <DropZone
                            label={isHi ? "पहली फ़ाइल चुनें" : "Select first file"}
                            file={fileA}
                            onClick={() => inputARef.current?.click()}
                        />
                        <input ref={inputARef} type="file" className="hidden" onChange={handleFileA} />
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-medium text-slate-300">
                            {isHi ? "फ़ाइल B" : "File B"}
                        </span>
                        <DropZone
                            label={isHi ? "दूसरी फ़ाइल चुनें" : "Select second file"}
                            file={fileB}
                            onClick={() => inputBRef.current?.click()}
                        />
                        <input ref={inputBRef} type="file" className="hidden" onChange={handleFileB} />
                    </div>
                </div>

                {/* Compare button */}
                <button
                    onClick={compare}
                    disabled={!fileA || !fileB || isHashing}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isHashing
                        ? (isHi ? "हैश बना रहे हैं..." : "Hashing...")
                        : (isHi ? "तुलना करें" : "Compare")}
                </button>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Hash display */}
                {(hashA || hashB) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">File A</span>
                            <p className="font-mono text-xs text-slate-300 break-all mt-2">{hashA || "..."}</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">File B</span>
                            <p className="font-mono text-xs text-slate-300 break-all mt-2">{hashB || "..."}</p>
                        </div>
                    </div>
                )}

                {/* Result badge */}
                {match && (
                    <div className="flex items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl animate-fade-in">
                        <span className="text-2xl mr-3">✅</span>
                        <span className="text-lg font-bold text-emerald-400">
                            {isHi ? "मैच! फ़ाइलें समान हैं।" : "MATCH! Files are identical."}
                        </span>
                    </div>
                )}
                {noMatch && (
                    <div className="flex items-center justify-center p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
                        <span className="text-2xl mr-3">❌</span>
                        <span className="text-lg font-bold text-red-400">
                            {isHi ? "मैच नहीं! फ़ाइलें भिन्न हैं।" : "NO MATCH! Files are different."}
                        </span>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/file-hash-compare" tools={ALL_TOOLS} />
        </div>
    );
}
