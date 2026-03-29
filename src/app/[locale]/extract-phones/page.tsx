"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What phone formats are supported?", questionHi: "किस प्रकार के फ़ोन नंबर समर्थित हैं?", answer: "International formats including country codes, parentheses, dashes, dots, and spaces are supported (e.g., +1 (555) 123-4567).", answerHi: "कंट्री कोड, ब्रैकेट, डैश, डॉट और स्पेस सहित अंतरराष्ट्रीय फॉर्मेट समर्थित हैं (जैसे +1 (555) 123-4567)।" },
    { question: "Is my data secure?", questionHi: "क्या मेरा डेटा सुरक्षित है?", answer: "Yes, all processing happens locally in your browser. No data leaves your device.", answerHi: "हाँ, सारी प्रोसेसिंग आपके ब्राउज़र में होती है। कोई डेटा आपके डिवाइस से बाहर नहीं जाता।" },
    { question: "Are duplicate numbers removed?", questionHi: "क्या डुप्लीकेट नंबर हटाए जाते हैं?", answer: "Yes, identical phone numbers are automatically deduplicated.", answerHi: "हाँ, एक जैसे फ़ोन नंबर स्वचालित रूप से हटा दिए जाते हैं।" },
    { question: "Can I download the results?", questionHi: "क्या मैं परिणाम डाउनलोड कर सकता हूँ?", answer: "Yes, click 'Download (.txt)' to save all extracted numbers as a text file.", answerHi: "हाँ, सभी निकाले गए नंबर को टेक्स्ट फ़ाइल के रूप में सहेजने के लिए 'डाउनलोड (.txt)' पर क्लिक करें।" },
];

export default function ExtractPhonesPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [phones, setPhones] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const extractPhones = useCallback((text: string) => {
        const regex = /[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,}/g;
        const matches = text.match(regex) || [];
        setPhones([...new Set(matches.map(p => p.trim()))]);
    }, []);

    const handleInputChange = (value: string) => {
        setInput(value);
        extractPhones(value);
    };

    const copyAll = () => {
        if (phones.length === 0) return;
        navigator.clipboard.writeText(phones.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        if (phones.length === 0) return;
        const blob = new Blob([phones.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted-phones.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📞 फ़ोन नंबर निकालें" : "📞 Extract Phone Numbers"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "टेक्स्ट से सभी फ़ोन नंबर तुरंत निकालें" : "Instantly extract all phone numbers from any text"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <div>
                    <textarea
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={isHi ? "फ़ोन नंबर वाला टेक्स्ट यहाँ पेस्ट करें..." : "Paste text containing phone numbers here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[160px] resize-y"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
                        <span className="text-slate-400 text-sm">{isHi ? "मिले नंबर: " : "Numbers found: "}</span>
                        <span className="text-indigo-400 font-bold text-lg">{phones.length}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={copyAll}
                            disabled={phones.length === 0}
                            className={`btn-secondary text-sm ${copied ? "!bg-green-600/20 !text-green-400" : ""} ${phones.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "सभी कॉपी करें" : "Copy All")}
                        </button>
                        <button
                            onClick={download}
                            disabled={phones.length === 0}
                            className={`btn-primary text-sm ${phones.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isHi ? "डाउनलोड (.txt)" : "Download (.txt)"}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[160px] max-h-[400px] overflow-y-auto">
                    {phones.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">
                            {isHi ? "फ़ोन नंबर दिखने के लिए टेक्स्ट पेस्ट करें" : "Paste text to see extracted phone numbers here"}
                        </p>
                    ) : (
                        <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">{phones.join("\n")}</pre>
                    )}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/extract-phones" tools={ALL_TOOLS} />
        </div>
    );
}
