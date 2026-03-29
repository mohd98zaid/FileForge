"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is numeric sort?", questionHi: "न्यूमेरिक सॉर्ट क्या है?", answer: "Numeric sort compares values as numbers instead of strings. For example, '10' comes after '2' numerically, but before it alphabetically.", answerHi: "न्यूमेरिक सॉर्ट मानों की तुलना संख्याओं के रूप में करता है स्ट्रिंग के बजाय. उदाहरण: '10' संख्यात्मक रूप से '2' के बाद आता है, लेकिन वर्णमाला में पहले." },
    { question: "What does case-insensitive sort do?", questionHi: "केस-इनसेंसिटिव सॉर्ट क्या करता है?", answer: "It treats uppercase and lowercase letters as equal. 'apple' and 'Apple' are considered the same for sorting purposes.", answerHi: "यह बड़े और छोटे अक्षरों को समान मानता है. 'apple' और 'Apple' को सॉर्टिंग के लिए समान माना जाता है." },
    { question: "Are blank lines sorted too?", questionHi: "क्या खाली लाइनें भी सॉर्ट होती हैं?", answer: "Yes, empty lines are included in sorting and will appear at the beginning or end depending on sort order.", answerHi: "हाँ, खाली लाइनें सॉर्टिंग में शामिल होती हैं और सॉर्ट क्रम के अनुसार शुरू या अंत में दिखेंगी." },
    { question: "Is my data sent to any server?", questionHi: "क्या मेरा डेटा सर्वर पर भेजा जाता है?", answer: "No, sorting is performed entirely in your browser.", answerHi: "नहीं, सॉर्टिंग पूरी तरह से आपके ब्राउज़र में की जाती है." },
];

function sortLines(
    text: string,
    order: "asc" | "desc",
    numeric: boolean,
    caseInsensitive: boolean
): string {
    const lines = text.split("\n");

    const sorted = [...lines].sort((a, b) => {
        let valA: string | number = a;
        let valB: string | number = b;

        if (numeric) {
            const numA = parseFloat(a.trim());
            const numB = parseFloat(b.trim());
            const aIsNum = !isNaN(numA);
            const bIsNum = !isNaN(numB);

            if (aIsNum && bIsNum) {
                return order === "asc" ? numA - numB : numB - numA;
            }
            if (aIsNum) return order === "asc" ? -1 : 1;
            if (bIsNum) return order === "asc" ? 1 : -1;
        }

        if (caseInsensitive) {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });

    return sorted.join("\n");
}

export default function SortLinesPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [numeric, setNumeric] = useState(false);
    const [caseInsensitive, setCaseInsensitive] = useState(false);
    const [copied, setCopied] = useState(false);

    const output = input ? sortLines(input, order, numeric, caseInsensitive) : "";

    const copyOutput = useCallback(() => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [output]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">
                    {isHi ? "📊 लाइनें सॉर्ट करें" : "📊 Sort Lines"}
                </h1>
                <p className="mt-2 text-slate-400">
                    {isHi
                        ? "टेक्स्ट की लाइनों को वर्णमाला या संख्या के अनुसार सॉर्ट करें"
                        : "Sort text lines alphabetically or numerically"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Options */}
                <div className="flex flex-wrap gap-6 items-center justify-center">
                    {/* Order Toggle */}
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400">
                            {isHi ? "क्रम" : "Order"}
                        </label>
                        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                            <button
                                onClick={() => setOrder("asc")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    order === "asc"
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {isHi ? "A → Z" : "Ascending"}
                            </button>
                            <button
                                onClick={() => setOrder("desc")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                    order === "desc"
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {isHi ? "Z → A" : "Descending"}
                            </button>
                        </div>
                    </div>

                    {/* Numeric Sort Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={numeric}
                            onChange={(e) => setNumeric(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "संख्यात्मक सॉर्ट" : "Numeric Sort"}
                        </span>
                    </label>

                    {/* Case-Insensitive Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={caseInsensitive}
                            onChange={(e) => setCaseInsensitive(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "केस-इनसेंसिटिव" : "Case-Insensitive"}
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
                            placeholder={isHi ? "टेक्स्ट पेस्ट करें...\nहर लाइन अलग होनी चाहिए" : "Paste text here...\nEach line on a new line"}
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
                                disabled={!output}
                                className={`text-sm px-3 py-1 rounded transition-colors ${
                                    copied
                                        ? "bg-green-600/20 text-green-400"
                                        : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                } ${!output ? "opacity-50 cursor-not-allowed" : ""}`}
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
                            value={output}
                            readOnly
                            placeholder={isHi ? "सॉर्ट की गई लाइनें यहाँ दिखेंगी..." : "Sorted lines will appear here..."}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[300px] text-slate-200 placeholder-slate-500 focus:outline-none resize-y font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/sort-lines" tools={ALL_TOOLS} />
        </div>
    );
}
