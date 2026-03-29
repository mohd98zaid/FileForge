"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is a URL slug?", questionHi: "URL slug क्या है?", answer: "A slug is a URL-friendly version of a string, typically lowercase with words separated by hyphens, used in web page URLs.", answerHi: "slug एक स्ट्रिंग का URL-अनुकूल रूप है, जो आमतौर पर छोटे अक्षरों में होता है और शब्दों को हाइफ़न से अलग किया जाता है, वेब पेज URL में उपयोग होता है." },
    { question: "Why use hyphens instead of underscores?", questionHi: "अंडरस्कोर की जगह हाइफ़न क्यों?", answer: "Search engines like Google treat hyphens as word separators but underscores are not, making hyphens better for SEO.", answerHi: "Google जैसे सर्च इंजन हाइफ़न को शब्द विभाजक मानते हैं लेकिन अंडरस्कोर को नहीं, इसलिए SEO के लिए हाइफ़न बेहतर है." },
    { question: "Should I remove special characters?", questionHi: "क्या विशेष अक्षर हटाने चाहिए?", answer: "Yes, slugs should only contain alphanumeric characters and hyphens for clean, SEO-friendly URLs.", answerHi: "हाँ, slug में केवल अक्षर, अंक और हाइफ़न होने चाहिए ताकि URL साफ और SEO-अनुकूल रहे." },
    { question: "Is my text sent to a server?", questionHi: "क्या मेरा टेक्स्ट सर्वर पर भेजा जाता है?", answer: "No, the slug is generated entirely in your browser.", answerHi: "नहीं, slug पूरी तरह से आपके ब्राउज़र में बनाया जाता है." },
];

function generateSlug(
    text: string,
    separator: string,
    lowercase: boolean,
    removeSpecial: boolean
): string {
    let slug = text.trim();

    if (removeSpecial) {
        slug = slug.replace(/[^\w\s\-]/g, "");
    }

    slug = slug.replace(/[\s_]+/g, separator);
    slug = slug.replace(new RegExp(`[${separator}]{2,}`, "g"), separator);
    slug = slug.replace(new RegExp(`^[${separator}]+|[${separator}]+$`, "g"), "");

    if (lowercase) {
        slug = slug.toLowerCase();
    }

    return slug;
}

export default function SlugGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [separator, setSeparator] = useState("-");
    const [lowercase, setLowercase] = useState(true);
    const [removeSpecial, setRemoveSpecial] = useState(true);
    const [copied, setCopied] = useState(false);

    const slug = input ? generateSlug(input, separator, lowercase, removeSpecial) : "";

    const copySlug = useCallback(() => {
        if (!slug) return;
        navigator.clipboard.writeText(slug);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [slug]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">
                    {isHi ? "🔗 स्लग जनरेटर" : "🔗 Slug Generator"}
                </h1>
                <p className="mt-2 text-slate-400">
                    {isHi
                        ? "टेक्स्ट से SEO-अनुकूल URL slug बनाएँ"
                        : "Generate SEO-friendly URL slugs from any text"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                {/* Input */}
                <div className="space-y-2">
                    <label className="font-semibold text-slate-300">
                        {isHi ? "इनपुट टेक्स्ट" : "Input Text"}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setCopied(false);
                        }}
                        placeholder={isHi ? "उदाहरण: My Awesome Blog Post! 2025" : "e.g. My Awesome Blog Post! 2025"}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[120px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-6 items-center justify-center">
                    {/* Separator */}
                    <div className="space-y-1">
                        <label className="text-sm text-slate-400">
                            {isHi ? "विभाजक" : "Separator"}
                        </label>
                        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                            {["-", "_"].map((sep) => (
                                <button
                                    key={sep}
                                    onClick={() => {
                                        setSeparator(sep);
                                        setCopied(false);
                                    }}
                                    className={`px-4 py-1.5 rounded-md font-mono text-lg transition-colors ${
                                        separator === sep
                                            ? "bg-indigo-600 text-white shadow-lg"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {sep}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lowercase Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lowercase}
                            onChange={(e) => {
                                setLowercase(e.target.checked);
                                setCopied(false);
                            }}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "छोटे अक्षर" : "Lowercase"}
                        </span>
                    </label>

                    {/* Remove Special Chars Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={removeSpecial}
                            onChange={(e) => {
                                setRemoveSpecial(e.target.checked);
                                setCopied(false);
                            }}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-slate-300">
                            {isHi ? "विशेष अक्षर हटाएँ" : "Remove Special Chars"}
                        </span>
                    </label>
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "जनरेट किया गया स्लग" : "Generated Slug"}
                        </label>
                        <button
                            onClick={copySlug}
                            disabled={!slug}
                            className={`text-sm px-3 py-1 rounded transition-colors ${
                                copied
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            } ${!slug ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[56px] font-mono text-indigo-300 break-all">
                        {slug || (
                            <span className="text-slate-500">
                                {isHi ? "स्लग यहाँ दिखेगा..." : "Your slug will appear here..."}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/slug-generator" tools={ALL_TOOLS} />
        </div>
    );
}
