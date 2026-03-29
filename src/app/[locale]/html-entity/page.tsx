"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What are HTML entities?", questionHi: "HTML एंटिटीज़ क्या हैं?", answer: "HTML entities are special codes used to represent reserved characters or characters that can't be typed directly, like <, >, &.", answerHi: "HTML एंटिटीज़ विशेष कोड हैं जो आरक्षित वर्णों या सीधे टाइप न किए जा सकने वाले वर्णों जैसे <, >, & को दर्शाने के लिए उपयोग किए जाते हैं।" },
    { question: "When should I encode HTML?", questionHi: "HTML कब एन्कोड करना चाहिए?", answer: "Whenever you need to display raw HTML code as text in a webpage, or when inserting user-generated content to prevent XSS attacks.", answerHi: "जब भी आपको वेबपेज में रॉ HTML कोड को टेक्स्ट के रूप में दिखाना हो, या XSS हमलों को रोकने के लिए यूज़र-जनरेटेड कंटेंट डालना हो।" },
    { question: "Is this done locally?", questionHi: "क्या यह स्थानीय रूप से होता है?", answer: "Yes, all encoding and decoding happens in your browser. No data is sent to any server.", answerHi: "हाँ, सभी एन्कोडिंग और डिकोडिंग आपके ब्राउज़र में होती है। कोई डेटा सर्वर पर नहीं भेजा जाता।" },
];

const ENTITY_MAP: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

const DECODE_MAP: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
};

function encodeHtmlEntities(text: string): string {
    return text.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] || ch);
}

function decodeHtmlEntities(text: string): string {
    return text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (entity) => DECODE_MAP[entity] || entity);
}

export default function HtmlEntityPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [tab, setTab] = useState<"encode" | "decode">("encode");
    const [input, setInput] = useState("");
    const [copied, setCopied] = useState(false);

    const output = tab === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔤 HTML एंटिटी एन्कोडर / डिकोडर" : "🔤 HTML Entity Encoder / Decoder"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "HTML विशेष वर्णों को एन्कोड या डिकोड करें" : "Encode or decode special HTML characters safely"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                {/* Tabs */}
                <div className="flex gap-2">
                    {(["encode", "decode"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                tab === t
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                            }`}
                        >
                            {t === "encode"
                                ? isHi ? "एन्कोड" : "Encode"
                                : isHi ? "डिकोड" : "Decode"}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            {isHi ? "इनपुट" : "Input"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                tab === "encode"
                                    ? isHi ? "यहाँ HTML टेक्स्ट दर्ज करें..." : "Enter HTML text here..."
                                    : isHi ? "यहाँ एन्कोडेड टेक्स्ट दर्ज करें..." : "Enter encoded text here..."
                            }
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[200px] resize-y font-mono text-sm"
                            spellCheck={false}
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "आउटपुट" : "Output"}
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
                        <div className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-indigo-300 min-h-[200px] font-mono text-sm break-all overflow-auto">
                            {output || (isHi ? "आउटपुट यहाँ दिखेगा..." : "Output will appear here...")}
                        </div>
                    </div>
                </div>

                {/* Quick reference */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">
                        {isHi ? "सामान्य HTML एंटिटीज़" : "Common HTML Entities"}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs font-mono">
                        {Object.entries(ENTITY_MAP).map(([char, entity]) => (
                            <div key={char} className="bg-slate-900/50 rounded px-3 py-2 text-center">
                                <span className="text-slate-400">{char}</span>
                                <span className="text-slate-600 mx-1">→</span>
                                <span className="text-indigo-400">{entity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/html-entity" tools={ALL_TOOLS} />
        </div>
    );
}
