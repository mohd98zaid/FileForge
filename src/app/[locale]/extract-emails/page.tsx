"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How does email extraction work?", questionHi: "ईमेल निकालना कैसे काम करता है?", answer: "It uses a regular expression to match standard email patterns (user@domain.tld) from your pasted text, all processed locally in your browser.", answerHi: "यह आपके पेस्ट किए गए टेक्स्ट से मानक ईमेल पैटर्न (user@domain.tld) को मैच करने के लिए रेगुलर एक्सप्रेशन का उपयोग करता है, सब कुछ आपके ब्राउज़र में संसाधित होता है।" },
    { question: "Is my data sent to any server?", questionHi: "क्या मेरा डेटा किसी सर्वर पर भेजा जाता है?", answer: "No. All extraction happens entirely in your browser. Nothing is uploaded.", answerHi: "नहीं। सारी प्रक्रिया पूरी तरह आपके ब्राउज़र में होती है। कुछ भी अपलोड नहीं किया जाता।" },
    { question: "Does it extract duplicate emails?", questionHi: "क्या यह डुप्लीकेट ईमेल भी निकालता है?", answer: "Duplicates are automatically removed so each email appears only once in the output.", answerHi: "डुप्लीकेट स्वचालित रूप से हटा दिए जाते हैं ताकि हर ईमेल आउटपुट में केवल एक बार दिखे।" },
    { question: "Can I download the results?", questionHi: "क्या मैं परिणाम डाउनलोड कर सकता हूँ?", answer: "Yes, use the 'Download' button to save the extracted emails as a .txt file.", answerHi: "हाँ, निकाले गए ईमेल को .txt फ़ाइल के रूप में सहेजने के लिए 'डाउनलोड' बटन का उपयोग करें।" },
];

export default function ExtractEmailsPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const extractEmails = useCallback((text: string) => {
        const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(regex) || [];
        setEmails([...new Set(matches.map(e => e.toLowerCase()))]);
    }, []);

    const handleInputChange = (value: string) => {
        setInput(value);
        extractEmails(value);
    };

    const copyAll = () => {
        if (emails.length === 0) return;
        navigator.clipboard.writeText(emails.join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        if (emails.length === 0) return;
        const blob = new Blob([emails.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted-emails.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📧 ईमेल निकालें" : "📧 Extract Emails"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "टेक्स्ट से सभी ईमेल पते तुरंत निकालें" : "Instantly extract all email addresses from any text"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <div>
                    <textarea
                        value={input}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={isHi ? "ईमेल वाला टेक्स्ट यहाँ पेस्ट करें..." : "Paste text containing emails here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[160px] resize-y"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2">
                        <span className="text-slate-400 text-sm">{isHi ? "मिले ईमेल: " : "Emails found: "}</span>
                        <span className="text-indigo-400 font-bold text-lg">{emails.length}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={copyAll}
                            disabled={emails.length === 0}
                            className={`btn-secondary text-sm ${copied ? "!bg-green-600/20 !text-green-400" : ""} ${emails.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "सभी कॉपी करें" : "Copy All")}
                        </button>
                        <button
                            onClick={download}
                            disabled={emails.length === 0}
                            className={`btn-primary text-sm ${emails.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isHi ? "डाउनलोड (.txt)" : "Download (.txt)"}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[160px] max-h-[400px] overflow-y-auto">
                    {emails.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-8">
                            {isHi ? "ईमेल दिखने के लिए टेक्स्ट पेस्ट करें" : "Paste text to see extracted emails here"}
                        </p>
                    ) : (
                        <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">{emails.join("\n")}</pre>
                    )}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/extract-emails" tools={ALL_TOOLS} />
        </div>
    );
}
