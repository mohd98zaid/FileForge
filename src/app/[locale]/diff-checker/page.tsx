"use client";

import { useLocale } from "next-intl";

import { useState, useMemo } from "react";
import * as Diff from "diff";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Can I compare files?", questionHi: "क्या फ़ाइलें कंपेयर कर सकते हैं?", answer: "Yes, paste two texts and see differences instantly.", answerHi: "हाँ, दो टेक्स्ट पेस्ट करें और तुरंत अंतर देखें।" },
    { question: "Does it highlight changes?", questionHi: "क्या बदलाव हाइलाइट होते हैं?", answer: "Yes, additions and deletions are color-coded.", answerHi: "हाँ, जोड़े गए और हटाए गए हिस्से अलग-अलग रंगों में दिखते हैं।" },
];

export default function DiffCheckerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [original, setOriginal] = useState("");
    const [modified, setModified] = useState("");
    const [mode, setMode] = useState<"chars" | "words" | "lines">("lines");

    const diff = useMemo(() => {
        if (!original && !modified) return [];

        if (mode === "chars") return Diff.diffChars(original, modified);
        if (mode === "words") return Diff.diffWords(original, modified);
        return Diff.diffLines(original, modified);
    }, [original, modified, mode]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⚖️ डिफ़ चेकर" : "⚖️ Text Diff Checker"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "दो टेक्स्ट के बीच का फ़र्क देखें" : "Compare two text blocks and find differences"}</p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                {/* Controls */}
                <div className="flex justify-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    {(["chars", "words", "lines"] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-4 py-2 rounded-md capitalize transition-colors ${mode === m
                                ? "bg-indigo-600 text-white shadow"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            {m === "chars" ? (isHi ? "अक्षर डिफ़" : "Chars Diff") : m === "words" ? (isHi ? "शब्द डिफ़" : "Words Diff") : (isHi ? "वाक्य डिफ़" : "Lines Diff")}
                        </button>
                    ))}
                    <button
                        onClick={() => { setOriginal(""); setModified(""); }}
                        className="text-slate-400 hover:text-red-400 px-4 py-2"
                    >
                        {isHi ? "सभी साफ़ करें" : "Clear All"}
                    </button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "मूल टेक्स्ट" : "Original Text"}</label>
                        <textarea
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                            placeholder={isHi ? "मूल टेक्स्ट यहाँ पेस्ट करें..." : "Paste original text here..."}
                            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "संशोधित टेक्स्ट" : "Modified Text"}</label>
                        <textarea
                            value={modified}
                            onChange={(e) => setModified(e.target.value)}
                            placeholder={isHi ? "संशोधित टेक्स्ट यहाँ पेस्ट करें..." : "Paste modified text here..."}
                            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                        />
                    </div>
                </div>

                {/* Result */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-300">{isHi ? "तुलना का परिणाम" : "Comparison Result"}</h3>
                    <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto">
                        {diff.map((part, index) => {
                            const color = part.added ? 'bg-green-900/40 text-green-300' :
                                part.removed ? 'bg-red-900/40 text-red-300 decoration-line-through decoration-red-500/50' :
                                    'text-slate-400';
                            return (
                                <span key={index} className={`${color} px-0.5 rounded-sm`}>
                                    {part.value}
                                </span>
                            );
                        })}
                        {diff.length === 0 && <span className="text-slate-600 italic">{isHi ? "अंतर यहाँ दिखाई देंगे..." : "Differences will appear here..."}</span>}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/diff-checker" tools={ALL_TOOLS} />
        </div>
    );
}
