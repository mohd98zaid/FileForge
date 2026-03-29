"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What does minifying do?", questionHi: "मिनिफ़ाई करने से क्या होता है?", answer: "It removes all unnecessary spaces, tabs, and newlines from the JSON payload, resulting in a smaller file size for transmission over networks.", answerHi: "यह JSON पेलोड से सभी अनावश्यक रिक्त स्थान, टैब और नई लाइनों को हटा देता है, जिससे नेटवर्क पर ट्रांसमिशन के लिए फ़ाइल का आकार छोटा हो जाता है।" },
];

export default function JsonMinifierPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<{ original: number, minified: number } | null>(null);

    const handleMinify = () => {
        if (!input.trim()) {
            setOutput("");
            setStats(null);
            setError(isHi ? "कृपया कुछ JSON इनपुट दें।" : "Please provide some JSON input.");
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const stringified = JSON.stringify(parsed);
            setOutput(stringified);
            
            setStats({
                original: new Blob([input]).size,
                minified: new Blob([stringified]).size
            });
            setError(null);
        } catch (e: any) {
            setError(isHi ? `अमान्य JSON: ${e.message}` : `Invalid JSON: ${e.message}`);
            setOutput("");
            setStats(null);
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
                <h1 className="section-title">{isHi ? "🗜️ JSON मिनिफ़ायर" : "🗜️ JSON Minifier"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "JSON से खाली जगह हटाकर साइज़ छोटा करें" : "Compress JSON by removing all whitespace"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                            {isHi ? "इनपुट JSON" : "Input JSON"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="{\n  &quot;hello&quot;: &quot;world&quot;\n}"
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
                                {isHi ? "मिनिफ़ाइड आउटपुट" : "Minified Output"}
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
                                className="w-full h-full min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none break-all"
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                {stats && (
                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex justify-around flex-wrap gap-4 text-center">
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider">{isHi ? "मूल साइज़" : "Original Size"}</p>
                            <p className="font-mono text-lg text-slate-200">{stats.original} B</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider">{isHi ? "नया साइज़" : "Minified Size"}</p>
                            <p className="font-mono text-lg text-emerald-400">{stats.minified} B</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase tracking-wider">{isHi ? "बचत" : "Saved"}</p>
                            <p className="font-mono text-lg text-indigo-400">
                                {(((stats.original - stats.minified) / Math.max(stats.original, 1)) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleMinify}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "मिनिफ़ाई करें" : "Minify JSON"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/json-minifier" tools={ALL_TOOLS} />
        </div>
    );
}
