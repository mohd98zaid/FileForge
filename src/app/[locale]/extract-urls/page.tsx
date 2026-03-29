"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What types of URLs are extracted?", questionHi: "किस प्रकार के URL निकाले जाते हैं?", answer: "All URLs starting with http:// or https:// are extracted from the text.", answerHi: "http:// या https:// से शुरू होने वाले सभी URL टेक्स्ट से निकाले जाते हैं।" },
    { question: "Is my text sent anywhere?", questionHi: "क्या मेरा टेक्स्ट कहीं भेजा जाता है?", answer: "No. Everything runs locally in your browser.", answerHi: "नहीं। सब कुछ आपके ब्राउज़र में ही होता है।" },
    { question: "Are duplicate URLs removed?", questionHi: "क्या डुप्लीकेट URL हटाए जाते हैं?", answer: "Yes, duplicate URLs are automatically filtered out.", answerHi: "हाँ, डुप्लीकेट URL स्वचालित रूप से हटा दिए जाते हैं।" },
    { question: "Does it work with relative URLs?", questionHi: "क्या यह रिलेटिव URL के साथ काम करता है?", answer: "Only absolute URLs (http/https) are extracted. Relative paths are ignored.", answerHi: "केवल एब्सोल्यूट URL (http/https) निकाले जाते हैं। रिलेटिव पाथ को नज़रअंदाज़ किया जाता है।" },
];

export default function ExtractUrlsPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [urls, setUrls] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const extractUrls = useCallback((text: string) => {
        const regex = /https?:\/\/[^\s]+/g;
        const matches = text.match(regex) || [];
        setUrls([...new Set(matches)]);
    }, []);

    const handleInputChange = (value: string) => {
        setInput(value);
        extractUrls(value);
    };

    const copyAll = () => {
        if (urls.length === 0) return;
        navigator.clipboard.writeText(urls.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        if (urls.length === 0) return;
        const blob = new Blob([urls.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted-urls.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔗 URL निकालें" : "🔗 Extract URLs"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "टेक्स्ट से सभी लिंक तुरंत निकालें" : "Instantly extract all URLs from any text"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <div>
                    <textarea
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={isHi ? "URL वाला टेक्स्ट यहाँ पेस्ट करें..." : "Paste text containing URLs here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[160px] resize-y"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
                        <span className="text-slate-400 text-sm">{isHi ? "मिले URL: " : "URLs found: "}</span>
                        <span className="text-indigo-400 font-bold text-lg">{urls.length}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={copyAll}
                            disabled={urls.length === 0}
                            className={`btn-secondary text-sm ${copied ? "!bg-green-600/20 !text-green-400" : ""} ${urls.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "सभी कॉपी करें" : "Copy All")}
                        </button>
                        <button
                            onClick={download}
                            disabled={urls.length === 0}
                            className={`btn-primary text-sm ${urls.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isHi ? "डाउनलोड (.txt)" : "Download (.txt)"}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[160px] max-h-[400px] overflow-y-auto">
                    {urls.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">
                            {isHi ? "URL दिखने के लिए टेक्स्ट पेस्ट करें" : "Paste text to see extracted URLs here"}
                        </p>
                    ) : (
                        <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap break-all">{urls.join("\n")}</pre>
                    )}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/extract-urls" tools={ALL_TOOLS} />
        </div>
    );
}
