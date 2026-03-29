"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What counts as a word?", questionHi: "शब्द क्या माना जाता है?", answer: "Any sequence of characters separated by spaces.", answerHi: "स्पेस से अलग किए गए अक्षरों का कोई भी क्रम।" },
    { question: "How is reading time calculated?", questionHi: "पढ़ने का समय कैसे गिना जाता है?", answer: "Based on an average reading speed of 200 words per minute.", answerHi: "औसतन 200 शब्द प्रति मिनट की पढ़ने की गति के आधार पर।" },
];

export default function WordCounterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [text, setText] = useState("");
    const [stats, setStats] = useState({
        chars: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    });

    useEffect(() => {
        const trimmed = text.trim();
        const chars = text.length;
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length : 0;
        const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
        const readingTime = Math.ceil(words / 200);

        setStats({ chars, words, sentences, paragraphs, readingTime });
    }, [text]);

    const clearText = () => setText("");

    const copyText = () => {
        if (text) {
            navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📝 वर्ड काउंटर" : "📝 Word Counter"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "अक्षर, शब्द और पैराग्राफ़ गिनें" : "Count characters, words, sentences, and paragraphs in real-time"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { label: isHi ? "शब्द" : "Words", value: stats.words },
                        { label: isHi ? "अक्षर" : "Characters", value: stats.chars },
                        { label: isHi ? "वाक्य" : "Sentences", value: stats.sentences },
                        { label: isHi ? "पैराग्राफ़" : "Paragraphs", value: stats.paragraphs },
                        { label: isHi ? "पढ़ने का समय" : "Reading Time", value: `${stats.readingTime} ${isHi ? "मिनट" : "min"}` }
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-400">{stat.value}</div>
                            <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isHi ? "अपना टेक्स्ट यहाँ टाइप या पेस्ट करें..." : "Type or paste your text here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-6 min-h-[300px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                </div>

                <div className="flex gap-4 justify-end">
                    <button onClick={clearText} className="btn-secondary">
                        {isHi ? "साफ़ करें" : "Clear"}
                    </button>
                    <button onClick={copyText} className="btn-primary flex items-center gap-2">
                        {isHi ? "कॉपी करें" : "Copy Text"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/word-counter" tools={ALL_TOOLS} />
        </div>
    );
}
