"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is it truly random?", questionHi: "क्या यह सच में रैंडम है?", answer: "Yes, generated using the browser's crypto API for secure randomness.", answerHi: "हाँ, ब्राउज़र के crypto API से सुरक्षित रैंडम पासवर्ड बनता है।" },
    { question: "Can I set password length?", questionHi: "क्या पासवर्ड की लंबाई सेट कर सकते हैं?", answer: "Yes, choose length and character types (letters, numbers, special).", answerHi: "हाँ, लंबाई और कैरेक्टर टाइप (अक्षर, नंबर, स्पेशल) चुन सकते हैं।" },
];

export default function PasswordGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generate = () => {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let chars = "";
        if (useUppercase) chars += uppercase;
        if (useLowercase) chars += lowercase;
        if (useNumbers) chars += numbers;
        if (useSymbols) chars += symbols;

        if (!chars) {
            setPassword("");
            return;
        }

        let generated = "";
        for (let i = 0; i < length; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(generated);
        setCopied(false);
    };

    useEffect(() => {
        generate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔑 पासवर्ड जनरेटर" : "🔑 Secure Password Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "मज़बूत और सुरक्षित पासवर्ड बनाएँ" : "Generate strong, random passwords instantly"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-8">
                {/* Display */}
                <div className="relative">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-center">
                        <span className="text-3xl font-mono text-white tracking-wider break-all">{password}</span>
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-white"
                        title="Copy to Clipboard"
                    >
                        {copied ? "✅" : "📋"}
                    </button>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="label">{isHi ? `लंबाई: ${length}` : `Length: ${length}`}</label>
                        </div>
                        <input
                            type="range"
                            min="6"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: "ABC", state: useUppercase, set: setUseUppercase },
                            { label: "abc", state: useLowercase, set: setUseLowercase },
                            { label: "123", state: useNumbers, set: setUseNumbers },
                            { label: "#$@", state: useSymbols, set: setUseSymbols },
                        ].map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => opt.set(!opt.state)}
                                className={`p-3 rounded-lg border transition-all ${opt.state
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                                    }`}
                            >
                                <span className="font-bold">{opt.label}</span>
                            </button>
                        ))}
                    </div>

                    <button onClick={generate} className="btn-primary w-full py-4 text-lg">
                        🔄 Regenerate
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/password-generator" tools={ALL_TOOLS} />
        </div>
    );
}
