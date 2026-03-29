"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is my JSON data kept private?", questionHi: "क्या मेरा JSON डेटा निजी रखा जाता है?", answer: "Yes. All processing is done locally in your browser. Nothing is sent to our servers.", answerHi: "हाँ। सभी प्रोसेसिंग आपके ब्राउज़र में स्थानीय रूप से की जाती है। हमारे सर्वर पर कुछ भी नहीं भेजा जाता है।" },
];

export default function JsonFormatterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [indent, setIndent] = useState<number | "tab">(2);
    const [error, setError] = useState<string | null>(null);

    const handleFormat = () => {
        if (!input.trim()) {
            setOutput("");
            setError(isHi ? "कृपया कुछ JSON इनपुट दें।" : "Please provide some JSON input.");
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const space = indent === "tab" ? "\t" : indent;
            setOutput(JSON.stringify(parsed, null, space));
            setError(null);
        } catch (e: any) {
            setError(isHi ? `अमान्य JSON: ${e.message}` : `Invalid JSON: ${e.message}`);
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📐 JSON फ़ॉर्मेटर" : "📐 JSON Formatter"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "JSON डेटा को पढ़ने लायक बनाएँ" : "Prettify and format ugly JSON data"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-700/50 pb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-slate-400 text-sm font-medium">{isHi ? "इंडेंटेशन:" : "Indentation:"}</label>
                        <select 
                            value={indent} 
                            onChange={(e) => setIndent(e.target.value === "tab" ? "tab" : Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                        >
                            <option value={2}>2 Spaces</option>
                            <option value={4}>4 Spaces</option>
                            <option value="tab">Tab</option>
                        </select>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                            {isHi ? "इनपुट JSON" : "Input JSON"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='{"hello": "world"}'
                            className={`w-full h-[400px] bg-slate-900 border ${error ? 'border-red-500 rounded-b-none' : 'border-slate-700/50 rounded-xl'} p-4 text-slate-300 font-mono text-sm focus:outline-none`}
                            spellCheck="false"
                        />
                        {error && (
                            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-b-xl border-t-0 font-mono break-all">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <div className="flex justify-between items-end">
                            <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                                {isHi ? "आउटपुट JSON" : "Output JSON"}
                            </label>
                            <button 
                                onClick={copyToClipboard}
                                disabled={!output}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isHi ? "कॉपी करें" : "Copy output"}
                            </button>
                        </div>
                        <div className="relative flex-1">
                             <textarea
                                value={output}
                                readOnly
                                className="w-full h-full min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleFormat}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "फ़ॉर्मेट करें" : "Format JSON"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/json-formatter" tools={ALL_TOOLS} />
        </div>
    );
}
