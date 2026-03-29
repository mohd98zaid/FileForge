"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Which languages are supported?", questionHi: "कौन सी भाषाएँ समर्थित हैं?", answer: "JavaScript, CSS, HTML, and JSON. JSON uses native pretty-printing; others use indent-based formatting.", answerHi: "JavaScript, CSS, HTML और JSON। JSON नेटिव प्रिटी-प्रिंटिंग का उपयोग करता है; अन्य इंडेंट-आधारित फ़ॉर्मेटिंग का।" },
    { question: "Is my code sent to a server?", questionHi: "क्या मेरा कोड सर्वर पर भेजा जाता है?", answer: "No, all beautification happens locally in your browser.", answerHi: "नहीं, सभी ब्यूटिफिकेशन आपके ब्राउज़र में स्थानीय रूप से होता है।" },
    { question: "Is the beautifier perfect?", questionHi: "क्या ब्यूटिफायर परफ़ेक्ट है?", answer: "For JSON it is exact. For JS/CSS/HTML it provides basic formatting — for advanced formatting consider a dedicated formatter.", answerHi: "JSON के लिए यह सटीक है। JS/CSS/HTML के लिए यह बेसिक फ़ॉर्मेटिंग देता है — एडवांस्ड फ़ॉर्मेटिंग के लिए डेडिकेटेड फ़ॉर्मेटर का उपयोग करें।" },
];

type Language = "javascript" | "css" | "html" | "json";

function beautifyJson(input: string): string {
    return JSON.stringify(JSON.parse(input), null, 2);
}

function beautifyGeneric(input: string): string {
    let indent = 0;
    const INDENT_STR = "  ";
    let result = "";
    let i = 0;
    const len = input.length;
    let inString = false;
    let stringChar = "";

    while (i < len) {
        const ch = input[i];

        if (inString) {
            result += ch;
            if (ch === "\\") {
                if (i + 1 < len) {
                    result += input[i + 1];
                    i += 2;
                    continue;
                }
            }
            if (ch === stringChar) inString = false;
            i++;
            continue;
        }

        if (ch === '"' || ch === "'") {
            inString = true;
            stringChar = ch;
            result += ch;
            i++;
            continue;
        }

        if (ch === "{" || ch === "[") {
            result += ch;
            indent++;
            result += "\n" + INDENT_STR.repeat(indent);
            i++;
            // skip whitespace after opener
            while (i < len && /\s/.test(input[i])) i++;
            continue;
        }

        if (ch === "}" || ch === "]") {
            // handle } or ] preceded by comma
            if (result.trimEnd().endsWith(",")) {
                result = result.trimEnd();
                if (result.endsWith(",")) result = result.slice(0, -1) + ",";
            }
            indent = Math.max(0, indent - 1);
            result += "\n" + INDENT_STR.repeat(indent) + ch;
            i++;
            // skip whitespace after closer
            while (i < len && /\s/.test(input[i])) i++;
            continue;
        }

        if (ch === ",") {
            result += ch;
            i++;
            // skip whitespace after comma
            while (i < len && /\s/.test(input[i])) i++;
            result += "\n" + INDENT_STR.repeat(indent);
            continue;
        }

        if (ch === ";") {
            result += ch;
            i++;
            while (i < len && /\s/.test(input[i])) i++;
            result += "\n" + INDENT_STR.repeat(indent);
            continue;
        }

        if (/\s/.test(ch)) {
            // collapse whitespace to single space unless at line start
            if (result.length > 0 && !result.endsWith(" ") && !result.endsWith("\n")) {
                result += " ";
            }
            while (i < len && /\s/.test(input[i])) i++;
            continue;
        }

        result += ch;
        i++;
    }

    return result.trim();
}

export default function CodeBeautifierPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [language, setLanguage] = useState<Language>("json");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleBeautify = () => {
        setError(null);
        if (!input.trim()) {
            setOutput("");
            return;
        }
        try {
            if (language === "json") {
                setOutput(beautifyJson(input));
            } else {
                setOutput(beautifyGeneric(input));
            }
        } catch (e: any) {
            setError(e?.message || (isHi ? "फ़ॉर्मेटिंग में त्रुटि" : "Formatting error"));
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const languages: { value: Language; label: string; labelHi: string }[] = [
        { value: "json", label: "JSON", labelHi: "JSON" },
        { value: "javascript", label: "JavaScript", labelHi: "JavaScript" },
        { value: "css", label: "CSS", labelHi: "CSS" },
        { value: "html", label: "HTML", labelHi: "HTML" },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✨ कोड ब्यूटिफायर" : "✨ Code Beautifier"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "मिनिफ़ाइड कोड को सुंदर फ़ॉर्मेट में बदलें" : "Format minified code into a clean, readable layout"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Language select */}
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-slate-300">
                        {isHi ? "भाषा:" : "Language:"}
                    </label>
                    <div className="flex gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.value}
                                onClick={() => { setLanguage(lang.value); setOutput(""); setError(null); }}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    language === lang.value
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                                }`}
                            >
                                {isHi ? lang.labelHi : lang.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleBeautify}
                        className="ml-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {isHi ? "ब्यूटिफाई करें" : "Beautify"}
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Input / Output */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            {isHi ? "मिनिफ़ाइड इनपुट" : "Minified Input"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isHi ? "यहाँ मिनिफ़ाइड कोड पेस्ट करें..." : "Paste minified code here..."}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[350px] resize-y font-mono text-sm"
                            spellCheck={false}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "ब्यूटिफाइड आउटपुट" : "Beautified Output"}
                            </label>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className={`text-xs px-3 py-1 rounded transition-colors ${
                                    copied ? "bg-green-600/20 text-green-400" : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                                } ${!output && "opacity-50 cursor-not-allowed"}`}
                            >
                                {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी" : "Copy")}
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder={isHi ? "ब्यूटिफाइड कोड यहाँ दिखेगा..." : "Beautified code will appear here..."}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-indigo-300 placeholder-slate-600 min-h-[350px] resize-y font-mono text-sm focus:outline-none"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/code-beautifier" tools={ALL_TOOLS} />
        </div>
    );
}
