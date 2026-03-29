"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is my data sent to a server?", questionHi: "क्या मेरा डेटा सर्वर पर भेजा जाता है?", answer: "No, all regex operations run locally in your browser. Your text never leaves your device.", answerHi: "नहीं, सभी रेगेक्स ऑपरेशन आपके ब्राउज़र में स्थानीय रूप से चलते हैं।" },
    { question: "Can I preview changes before applying?", questionHi: "क्या मैं लागू करने से पहले बदलाव देख सकता हूँ?", answer: "Yes, the tool shows a live preview with highlighted matches and replacement count.", answerHi: "हाँ, यह टूल हाइलाइट किए गए मैच और प्रतिस्थापन गणना के साथ लाइव प्रीव्यू दिखाता है।" },
];

export default function RegexFindReplacePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [pattern, setPattern] = useState("");
    const [replacement, setReplacement] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false });
    const [inputText, setInputText] = useState("");
    const [copied, setCopied] = useState(false);

    const result = useMemo(() => {
        if (!pattern) return { output: inputText, count: 0, error: null, highlighted: inputText };
        try {
            const flagStr = Object.entries(flags)
                .filter(([_, enabled]) => enabled)
                .map(([flag]) => flag)
                .join("");
            const regex = new RegExp(pattern, flagStr);

            let count = 0;
            const output = inputText.replace(regex, (...args) => {
                count++;
                if (count > 10000) return args[0];
                return replacement;
            });

            // Build highlighted version for preview
            const highlighted = inputText.replace(regex, (match) => {
                return `⟨⟨${match}⟩⟩`;
            });

            return { output, count: Math.min(count, 10000), error: null, highlighted };
        } catch (e: any) {
            return { output: inputText, count: 0, error: e.message, highlighted: inputText };
        }
    }, [pattern, replacement, flags, inputText]);

    const handleCopy = () => {
        navigator.clipboard.writeText(result.output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setPattern("");
        setReplacement("");
        setInputText("");
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔄 रेगेक्स खोजें और बदलें" : "🔄 Regex Find & Replace"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "रेगुलर एक्सप्रेशन का उपयोग करके टेक्स्ट में खोजें और बदलें" : "Search and replace text using regular expressions"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Pattern & Flags */}
                <div className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">{isHi ? "खोज पैटर्न (Find Pattern)" : "Find Pattern"}</label>
                            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden focus-within:border-indigo-500">
                                <span className="text-slate-500 pl-4 text-xl">/</span>
                                <input
                                    type="text"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    className="w-full bg-transparent p-3 text-indigo-300 font-mono text-lg outline-none"
                                    placeholder="[a-z]+"
                                />
                                <span className="text-slate-500 pr-4 text-xl">/</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">{isHi ? "प्रतिस्थापन (Replacement)" : "Replacement"}</label>
                            <input
                                type="text"
                                value={replacement}
                                onChange={(e) => setReplacement(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="replacement text"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "फ्लैग्स:" : "Flags:"}</label>
                        {[
                            { key: "g", label: "g (global)" },
                            { key: "i", label: "i (ignore case)" },
                            { key: "m", label: "m (multiline)" }
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={flags[key as keyof typeof flags]}
                                    onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800"
                                />
                                <span className="font-mono text-sm text-slate-300">{label}</span>
                            </label>
                        ))}
                    </div>
                    {result.error && (
                        <p className="text-red-400 text-sm font-mono bg-red-500/10 p-2 rounded">{result.error}</p>
                    )}
                </div>

                {/* Input & Output */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider">
                            {isHi ? "इनपुट टेक्स्ट" : "Input Text"}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={isHi ? "यहाँ टेक्स्ट दर्ज करें..." : "Enter your text here..."}
                            className="w-full min-h-[300px] bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                            spellCheck="false"
                        />
                        <span className="text-xs text-slate-500">{inputText.length} {isHi ? "अक्षर" : "chars"}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider">
                                {isHi ? "आउटपुट" : "Output"}
                            </label>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                                    {result.count} {isHi ? "प्रतिस्थापन" : "replaced"}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
                                >
                                    {copied ? (isHi ? "✓ कॉपी हुआ" : "✓ Copied") : (isHi ? "कॉपी करें" : "Copy")}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={result.output}
                            readOnly
                            className="w-full min-h-[300px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-slate-300 font-mono text-sm resize-none"
                            spellCheck="false"
                        />
                        <span className="text-xs text-slate-500">{result.output.length} {isHi ? "अक्षर" : "chars"}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 pt-2">
                    <button onClick={handleClear} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors">
                        {isHi ? "साफ़ करें" : "Clear All"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/regex-find-replace" tools={ALL_TOOLS} />
        </div>
    );
}
