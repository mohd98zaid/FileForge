"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import { format } from "sql-formatter";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Does it change the SQL logic?", questionHi: "क्या यह SQL की लॉजिक बदलता है?", answer: "No, only formatting changes. SQL query functionality stays the same.", answerHi: "नहीं, सिर्फ़ फ़ॉर्मेटिंग बदलती है। SQL क्वेरी की कार्यक्षमता वही रहती है।" },
    { question: "Which SQL dialects?", questionHi: "कौन से SQL डायलेक्ट?", answer: "Standard SQL, MySQL, PostgreSQL, and more.", answerHi: "स्टैंडर्ड SQL, MySQL, PostgreSQL और अन्य।" },
];

export default function SqlFormatterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [dialect, setDialect] = useState<"sql" | "postgresql" | "mysql">("sql");
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        try {
            const formatted = format(input, {
                language: dialect,
                tabWidth: 2,
                keywordCase: "upper",
            });
            setOutput(formatted);
        } catch (error) {
            setOutput("Error formatting SQL: " + (error as Error).message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "💾 SQL फ़ॉर्मेटर" : "💾 SQL Formatter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "SQL क्वेरी को सुंदर और पढ़ने लायक बनाएँ" : "Beautify your SQL queries instantly"}</p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-4">
                <div className="flex flex-wrap gap-4 justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">{isHi ? "डायलेक्ट:" : "Dialect:"}</span>
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value as any)}
                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="sql">Standard SQL</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => { setInput(""); setOutput(""); }}
                            className="text-slate-400 hover:text-white px-3 py-1 text-sm"
                        >
                            {isHi ? "साफ़ करें" : "Clear"}
                        </button>
                        <button
                            onClick={handleFormat}
                            className="btn-primary py-1 px-4 text-sm"
                        >
                            {isHi ? "✨ फ़ॉर्मेट करें" : "✨ Format"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                    {/* Input */}
                    <div className="flex flex-col h-full space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "इनपुट SQL" : "Input SQL"}</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="SELECT * FROM users WHERE ..."
                            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none"
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col h-full space-y-2 relative">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-semibold text-green-400">{isHi ? "फ़ॉर्मेट किया गया आउटपुट" : "Formatted Output"}</label>
                            {output && (
                                <button
                                    onClick={copyToClipboard}
                                    className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                                >
                                    {copied ? (isHi ? "✅ कॉपी हो गया" : "✅ Copied") : (isHi ? "📋 कॉपी करें" : "📋 Copy")}
                                </button>
                            )}
                        </div>
                        <pre className="flex-1 bg-slate-950 border border-indigo-500/20 rounded-lg p-4 font-mono text-sm text-green-300 overflow-auto whitespace-pre">
                            {output || <span className="text-slate-600 select-none">{isHi ? "// फ़ॉर्मेट किया गया परिणाम यहाँ दिखाई देगा..." : "// Formatted result will appear here..."}</span>}
                        </pre>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/sql-formatter" tools={ALL_TOOLS} />
        </div>
    );
}
