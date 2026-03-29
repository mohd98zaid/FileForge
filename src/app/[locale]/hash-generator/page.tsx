"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is my data safe?", questionHi: "क्या मेरा डेटा सुरक्षित है?", answer: "Yes, hashing is done entirely in your browser. No data is sent to any server.", answerHi: "हाँ, हैशिंग पूरी तरह से आपके ब्राउज़र में होती है। किसी भी सर्वर पर कोई डेटा नहीं भेजा जाता है।" },
    { question: "What algorithms are supported?", questionHi: "कौन से एल्गोरिदम समर्थित हैं?", answer: "We support SHA-1, SHA-256, SHA-384, and SHA-512.", answerHi: "हम SHA-1, SHA-256, SHA-384 और SHA-512 का समर्थन करते हैं।" },
];

export default function HashGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState<Record<string, string>>({
        "SHA-1": "",
        "SHA-256": "",
        "SHA-384": "",
        "SHA-512": ""
    });
    const [copiedHash, setCopiedHash] = useState<string | null>(null);

    useEffect(() => {
        const generateHashes = async () => {
            if (!input) {
                setHashes({
                    "SHA-1": "",
                    "SHA-256": "",
                    "SHA-384": "",
                    "SHA-512": ""
                });
                return;
            }

            const encoder = new TextEncoder();
            const data = encoder.encode(input);

            const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
            const newHashes: Record<string, string> = {};

            try {
                for (const algo of algorithms) {
                    const hashBuffer = await crypto.subtle.digest(algo, data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    newHashes[algo] = hashHex;
                }
                setHashes(newHashes);
            } catch (err) {
                console.error("Hashing failed", err);
            }
        };

        generateHashes();
    }, [input]);

    const copyToClipboard = (hashType: string, hashValue: string) => {
        if (!hashValue) return;
        navigator.clipboard.writeText(hashValue);
        setCopiedHash(hashType);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔐 हैश जनरेटर" : "🔐 Hash Generator"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "अपने टेक्स्ट के लिए सुरक्षित हैश बनाएँ" : "Generate secure cryptographic hashes for your text locally"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                <div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isHi ? "टेक्स्ट यहाँ दर्ज करें..." : "Enter text here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[120px] resize-y"
                    />
                </div>

                <div className="space-y-4">
                    {Object.entries(hashes).map(([algo, hashValue]) => (
                        <div key={algo} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-indigo-400">{algo}</span>
                                <button
                                    onClick={() => copyToClipboard(algo, hashValue)}
                                    disabled={!hashValue}
                                    className={`text-sm px-3 py-1 rounded transition-colors ${copiedHash === algo ? 'bg-green-600/20 text-green-400' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'} ${!hashValue && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {copiedHash === algo ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी" : "Copy")}
                                </button>
                            </div>
                            <div className="font-mono text-sm text-slate-300 break-all bg-slate-900 p-3 rounded border border-slate-800">
                                {hashValue || (isHi ? "आउटपुट की प्रतीक्षा..." : "Waiting for input...")}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/hash-generator" tools={ALL_TOOLS} />
        </div>
    );
}
