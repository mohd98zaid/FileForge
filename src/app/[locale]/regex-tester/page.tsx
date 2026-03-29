"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is my data sent to a server?", questionHi: "क्या मेरा डेटा सर्वर पर भेजा जाता है?", answer: "No, all regular expressions are evaluated locally in your browser.", answerHi: "नहीं, सभी रेगुलर एक्सप्रेशन का मूल्यांकन आपके ब्राउज़र में स्थानीय रूप से किया जाता है।" },
];

export default function RegexTesterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false });
    const [testString, setTestString] = useState("");

    const results = useMemo(() => {
        if (!pattern) return { matches: [], error: null };
        try {
            const flagStr = Object.entries(flags)
                .filter(([_, enabled]) => enabled)
                .map(([flag]) => flag)
                .join("");

            // Prevent catastrophic backtracking somewhat by wrapping in a try-catch and not using monstrously long strings
            const regex = new RegExp(pattern, flagStr);
            
            const matches: { text: string; index: number; groups: string[] }[] = [];
            
            if (regex.global) {
                let match;
                let count = 0;
                while ((match = regex.exec(testString)) !== null) {
                    matches.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    count++;
                    if (count > 1000) break; // limit to 1000 matches to prevent UI freeze
                    if (match.index === regex.lastIndex) regex.lastIndex++; // Handle zero-length matches
                }
            } else {
                const match = regex.exec(testString);
                if (match) {
                    matches.push({
                         text: match[0],
                         index: match.index,
                         groups: match.slice(1)
                    });
                }
            }

            return { matches, error: null };

        } catch (e: any) {
             return { matches: [], error: e.message };
        }
    }, [pattern, flags, testString]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🧪 रेगेक्स टेस्टर" : "🧪 Regex Tester"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "लाइव मिलान के साथ रेगुलर एक्सप्रेशन का परीक्षण करें" : "Test and debug regular expressions with live matching"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                
                {/* Pattern and Flags */}
                <div className="space-y-4 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 w-full space-y-2">
                             <label className="text-sm font-semibold text-slate-400">{isHi ? "रेगुलर एक्सप्रेशन (Pattern)" : "Regular Expression (Pattern)"}</label>
                             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                 <span className="text-slate-500 pl-4 text-xl">/</span>
                                 <input
                                     type="text"
                                     value={pattern}
                                     onChange={(e) => setPattern(e.target.value)}
                                     className="w-full bg-transparent p-3 text-indigo-300 font-mono text-lg outline-none"
                                     placeholder="[A-Z]{3}-[0-9]{4}"
                                 />
                                 <span className="text-slate-500 pr-4 text-xl">/</span>
                             </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-400">{isHi ? "फ्लैग्स (Flags)" : "Flags"}</label>
                            <div className="flex gap-3">
                                {[
                                    { key: "g", label: "g (global)" },
                                    { key: "i", label: "i (ignore case)" },
                                    { key: "m", label: "m (multiline)" }
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={flags[key as keyof typeof flags]}
                                            onChange={(e) => setFlags({ ...flags, [key]: e.target.checked })}
                                            className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800"
                                        />
                                        <span className="font-mono text-sm text-slate-300">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    {results.error && (
                        <p className="text-red-400 text-sm font-mono bg-red-500/10 p-2 rounded">{results.error}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 flex flex-col h-full">
                         <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                             {isHi ? "परीक्षण स्ट्रिंग (Test String)" : "Test String"}
                         </label>
                         <textarea
                             value={testString}
                             onChange={(e) => setTestString(e.target.value)}
                             placeholder="Type something here to test..."
                             className="w-full min-h-[300px] flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                             spellCheck="false"
                         />
                    </div>

                    <div className="space-y-2 flex flex-col h-full">
                        <div className="flex justify-between items-center">
                             <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                                 {isHi ? "परिणाम (Results)" : "Results"}
                             </label>
                             <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
                                 {results.matches.length} {isHi ? "मैच मिले" : "match(es)"}
                             </span>
                        </div>
                        <div className="w-full min-h-[300px] max-h-[500px] overflow-auto flex-1 bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-slate-300">
                             {results.matches.length === 0 ? (
                                 <p className="text-slate-500 italic text-sm text-center mt-10">
                                     {isHi ? "कोई मैच नहीं मिला।" : "No matches found."}
                                 </p>
                             ) : (
                                 <div className="space-y-3">
                                     {results.matches.map((match, i) => (
                                         <div key={i} className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                                             <div className="bg-slate-800 px-3 py-2 flex justify-between items-center border-b border-slate-700 text-xs text-slate-400 font-mono">
                                                 <span>Match {i + 1}</span>
                                                 <span>Index: {match.index}</span>
                                             </div>
                                             <div className="p-3 font-mono text-sm text-green-400 break-all">
                                                 {match.text || <span className="opacity-50 italic">&lt;empty string&gt;</span>}
                                             </div>
                                             {match.groups.length > 0 && (
                                                 <div className="px-3 pb-3">
                                                     <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Groups</p>
                                                     <div className="space-y-1 font-mono text-xs">
                                                         {match.groups.map((g, j) => (
                                                             <div key={j} className="flex gap-2">
                                                                 <span className="text-slate-500">[{j + 1}]</span>
                                                                 <span className="text-yellow-200">{g === undefined ? "undefined" : g}</span>
                                                             </div>
                                                         ))}
                                                     </div>
                                                 </div>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/regex-tester" tools={ALL_TOOLS} />
        </div>
    );
}
