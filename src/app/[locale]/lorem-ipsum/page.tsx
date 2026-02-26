"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { LoremIpsum } from "lorem-ipsum";

const faqs = [
    { question: "What is Lorem Ipsum?", questionHi: "लोरेम इप्सम क्या है?", answer: "Placeholder text used in design and development.", answerHi: "यह डिज़ाइन और डेवलपमेंट में इस्तेमाल होने वाला डमी टेक्स्ट है।" },
    { question: "Can I set word count?", questionHi: "क्या शब्द संख्या सेट कर सकते हैं?", answer: "Yes, choose paragraphs, sentences, or words.", answerHi: "हाँ, पैराग्राफ़, वाक्य या शब्द — जितने चाहें चुनें।" },
];

export default function LoremIpsumPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const generate = () => {
        const lorem = new LoremIpsum({
            sentencesPerParagraph: {
                max: 8,
                min: 4
            },
            wordsPerSentence: {
                max: 16,
                min: 4
            }
        });

        let generated = "";
        if (unit === "paragraphs") {
            generated = lorem.generateParagraphs(count);
        } else if (unit === "sentences") {
            generated = lorem.generateSentences(count);
        } else {
            generated = lorem.generateWords(count);
        }
        setText(generated);
        setCopied(false);
    };

    useEffect(() => {
        generate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, unit]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📝 लोरेम इप्सम" : "📝 Lorem Ipsum Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "डमी/प्लेसहोल्डर टेक्स्ट बनाएँ" : "Generate placeholder text for your designs"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4 justify-center">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="input-field w-20 text-center"
                    />

                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        {(["paragraphs", "sentences", "words"] as const).map((u) => (
                            <button
                                key={u}
                                onClick={() => setUnit(u)}
                                className={`px-4 py-2 rounded-md transition-colors capitalize ${unit === u
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                {isHi ? (u === "paragraphs" ? "पैराग्राफ़" : u === "sentences" ? "वाक्य" : "शब्द") : u}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className={`btn-primary flex items-center gap-2 ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
                    >
                        {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी करें" : "Copy to Clipboard")}
                    </button>
                </div>

                {/* Output */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 min-h-[300px] overflow-y-auto max-h-[600px]">
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                        {text}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/lorem-ipsum" tools={ALL_TOOLS} />
        </div>
    );
}
