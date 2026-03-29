"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How does duplicate detection work?", questionHi: "डुप्लिकेट पहचान कैसे काम करती है?", answer: "Each line is compared against all other lines. If case-sensitive is off, lines are compared after converting to lowercase.", answerHi: "हर लाइन को अन्य सभी लाइनों से तुलना की जाती है. यदि case-sensitive बंद है, तो छोटे अक्षरों में बदलकर तुलना की जाती है." },
    { question: "What does 'preserve order' mean?", questionHi: "'क्रम बनाए रखें' का क्या मतलब है?", answer: "When enabled, the first occurrence of each unique line keeps its original position. When disabled, lines are kept in the order of their last occurrence.", answerHi: "सक्षम होने पर, हर अद्वितीय लाइन की पहली उपस्थिति अपनी मूल स्थिति में रहती है. अक्षम होने पर, लाइनें अंतिम उपस्थिति के क्रम में रहती हैं." },
    { question: "Is empty line a duplicate?", questionHi: "क्या खाली लाइन डुप्लिकेट है?", answer: "Yes, empty lines are treated like any other line and duplicates are removed if detected.", answerHi: "हाँ, खाली लाइनों को अन्य लाइनों की तरह माना जाता है और डुप्लिकेट होने पर हटा दिया जाता है." },
    { question: "Is my data sent anywhere?", questionHi: "क्या मेरा डेटा कहीं भेजा जाता है?", answer: "No, all processing happens locally in your browser.", answerHi: "नहीं, सभी प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से होती है." },
];

function removeDuplicateLines(
    text: string,
    caseSensitive: boolean,
    preserveOrder: boolean
): { result: string; originalCount: number; uniqueCount: number } {
    const lines = text.split("\n");
    const originalCount = lines.length;

    if (preserveOrder) {
        const seen = new Set<string>();
        const unique: string[] = [];
        for (const line of lines) {
            const key = caseSensitive ? line : line.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(line);
            }
        }
        return { result: unique.join("\n"), originalCount, uniqueCount: unique.length };
    } else {
        const seen = new Map<string, string>();
        for (const line of lines) {
            const key = caseSensitive ? line : line.toLowerCase();
            seen.set(key, line);
        }
        const unique = Array.from(seen.values());
        return { result: unique.join("\n"), originalCount, uniqueCount: unique.length };
    }
}

export default function RemoveDuplicateLinesPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [caseSensitive, setCaseSensitive] = useState(true);
    const [preserveOrder, setPreserveOrder] = useState(true);
    const [copied, setCopied] = useState(false);

    const { result, originalCount, uniqueCount } = input
        ? removeDuplicateLines(input, caseSensitive, preserveOrder)
        : { result: "", originalCount: 0, uniqueCount: 0 };
    const duplicatesRemoved = originalCount - uniqueCount;

    const copyOutput = useCallback(() => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [result]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">
                    {isHi ? "🧹 डुप्लिकेट लाइनें हटाएँ" : "🧹 Remove Duplicate Lines"}
                </h1>
                <p className="mt-2 text-slate-400">
                    {isHi
                        ? "टेक्स्ट से डुप्लिकेट लाइनें तुरंत हटाएँ"
                        : "Instantly remove duplicate lines from your text"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Stats */}
                {input && (
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-400">{originalCount}</div>
                            <div className="text-sm text-slate-400 mt-1">
                                {isHi ? "कुल लाइनें" : "Original Lines"}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">{uniqueCount}</div>
                            <div className="text-sm text-slate-400 mt-1">
                                {isHi ? "अद्वितीय लाइनें" : "Unique Lines"}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-400">{duplicatesRemoved}</div>
                            <div className="text-sm text-slate-400 mt-1">
                                {isHi ? "हटाई गईं" : "Duplicates Removed"}
                            </div>
                        </div>
                    </div>
                )}

                {/* Options */}
                <div className="flex flex-wrap gap-6 items-center justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={caseSensitive}
                            onChange={(e) => setCaseSensitive(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "केस-सेंसिटिव" : "Case-Sensitive"}
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={preserveOrder}
                            onChange={(e) => setPreserveOrder(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "क्रम बनाए रखें" : "Preserve Order"}
                        </span>
                    </label>
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "इनपुट" : "Input"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setCopied(false);
                            }}
                            placeholder={isHi ? "टेक्स्ट पेस्ट करें...\nहर लाइन अलग होनी चाहिए" : "Paste text here...\nEach line should be on a new line"}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[300px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-slate-300">
                                {isHi ? "आउटपुट" : "Output"}
                            </label>
                            <button
                                onClick={copyOutput}
                                disabled={!result}
                                className={`text-sm px-3 py-1 rounded transition-colors ${
                                    copied
                                        ? "bg-green-600/20 text-green-400"
                                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                } ${!result ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {copied
                                    ? isHi
                                        ? "कॉपी हो गया!"
                                        : "Copied!"
                                    : isHi
                                        ? "कॉपी करें"
                                        : "Copy"}
                            </button>
                        </div>
                        <textarea
                            value={result}
                            readOnly
                            placeholder={isHi ? "अद्वितीय लाइनें यहाँ दिखेंगी..." : "Unique lines will appear here..."}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[300px] text-slate-200 placeholder-slate-500 focus:outline-none resize-y font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/remove-duplicate-lines" tools={ALL_TOOLS} />
        </div>
    );
}
