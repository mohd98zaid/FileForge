"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is this validation done locally?", questionHi: "क्या यह सत्यापन स्थानीय रूप से किया जाता है?", answer: "Yes. Validation happens in real-time in your browser without sending payloads via the network.", answerHi: "हाँ। वेरिडेशन बिना नेटवर्क पर पेलोड भेजे आपके ब्राउज़र में रीयल-टाइम में होता है।" },
];

export default function JsonValidatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!input.trim()) {
            setIsValid(null);
            setErrorMsg(null);
            return;
        }

        const timer = setTimeout(() => {
            try {
                JSON.parse(input);
                setIsValid(true);
                setErrorMsg(null);
            } catch (e: any) {
                setIsValid(false);
                setErrorMsg(e.message);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [input]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✔️ JSON वैलिडेटर" : "✔️ JSON Validator"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "रीयल-टाइम में JSON सिंटैक्स त्रुटियों की जांच करें" : "Check for JSON syntax errors in real-time"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-6">
                
                {/* Status Bar */}
                <div 
                    className={`rounded-xl p-4 flex items-center gap-3 transition-colors duration-300 font-medium ${
                        isValid === null 
                        ? 'bg-slate-800/50 text-slate-400 border border-slate-700' 
                        : isValid 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                >
                    <div className="text-2xl">
                        {isValid === null ? "⏳" : isValid ? "✅" : "❌"}
                    </div>
                    <div>
                        <p className="text-lg">
                            {isValid === null 
                                ? (isHi ? "JSON टाइप करने की प्रतीक्षा की जा रही है..." : "Waiting for JSON input...") 
                                : isValid 
                                    ? (isHi ? "वैध JSON" : "Valid JSON") 
                                    : (isHi ? "अमान्य JSON" : "Invalid JSON")}
                        </p>
                        {errorMsg && (
                            <p className="text-sm font-mono mt-1 opacity-90">{errorMsg}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                     <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="{\n  &quot;type_here&quot;: true\n}"
                        className={`w-full min-h-[500px] bg-slate-900 border ${isValid === false ? 'border-red-500/50 focus:border-red-500' : isValid === true ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl p-6 text-slate-300 font-mono text-sm focus:outline-none transition-colors duration-300`}
                        spellCheck="false"
                    />
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/json-validator" tools={ALL_TOOLS} />
        </div>
    );
}
