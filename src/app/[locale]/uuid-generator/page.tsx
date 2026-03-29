"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, RefreshCw, Check } from "lucide-react";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";
import { useTranslations } from "next-intl";

const faqs = [
    { question: "What is a UUID?", questionHi: "UUID क्या है?", answer: "UUID stands for Universally Unique Identifier. It is a 128-bit label used for information in computer systems.", answerHi: "UUID का मतलब यूनिवर्सली यूनिक आइडेंटिफायर है। यह कंप्यूटर सिस्टम में सूचना के लिए उपयोग किया जाने वाला 128-बिट लेबल है।" },
    { question: "What is the difference between v1 and v4?", questionHi: "v1 और v4 में क्या अंतर है?", answer: "Version 1 is generated from a MAC address and the current time, whereas Version 4 is generated from completely random numbers.", answerHi: "संस्करण 1 मैक पते और वर्तमान समय से उत्पन्न होता है, जबकि संस्करण 4 पूरी तरह से यादृच्छिक संख्याओं से उत्पन्न होता है।" },
    { question: "Are these UUIDs generated securely?", questionHi: "क्या ये UUID सुरक्षित रूप से उत्पन्न होते हैं?", answer: "Yes, v4 UUIDs are generated using cryptographic random number generators natively in your browser.", answerHi: "हाँ, v4 UUID आपके ब्राउज़र में मूल रूप से क्रिप्टोग्राफ़िक रैंडम नंबर जनरेटर का उपयोग करके उत्पन्न होते हैं।" },
];

export default function UuidGeneratorTool() {
    const t = useTranslations("Tools");
    const [uuids, setUuids] = useState<string[]>([]);
    const [version, setVersion] = useState<"v1" | "v4">("v4");
    const [count, setCount] = useState<number>(5);
    const [uppercase, setUppercase] = useState(false);
    const [stripHyphens, setStripHyphens] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const generateUuids = () => {
        const generated = Array.from({ length: count }, () => {
            let id = version === "v1" ? uuidv1() : uuidv4();
            if (uppercase) id = id.toUpperCase();
            if (stripHyphens) id = id.replace(/-/g, "");
            return id;
        });
        setUuids(generated);
        setCopiedIndex(null);
    };

    // Generate initial UUIDs on mount
    React.useEffect(() => {
        generateUuids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join("\n"));
    };

    return (
        <ToolLayout
            title="UUID Generator"
            description="Generate universally unique identifiers (UUIDs) across versions 1 and 4."
            faqs={faqs}
           
        >
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Settings</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">UUID Version</label>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${version === "v1" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                        onClick={() => setVersion("v1")}
                                    >
                                        Version 1 (Time-based)
                                    </button>
                                    <button
                                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${version === "v4" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                        onClick={() => setVersion("v4")}
                                    >
                                        Version 4 (Random)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Quantity (1 - 100)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={count}
                                    onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                />
                            </div>

                            <div className="flex flex-col space-y-3 pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={uppercase}
                                        onChange={(e) => setUppercase(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Uppercase output (e.g., A1B2...)</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={stripHyphens}
                                        onChange={(e) => setStripHyphens(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Strip hyphens</span>
                                </label>
                            </div>

                            <Button onClick={generateUuids} className="w-full mt-4" variant="primary">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Generate UUIDs
                            </Button>
                        </div>

                        {/* Results */}
                        <div className="space-y-4 flex flex-col">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Generated ({uuids.length})</h3>
                                {uuids.length > 0 && (
                                    <button
                                        onClick={copyAll}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                                    >
                                        <Copy className="w-3.5 h-3.5 mr-1" />
                                        Copy All
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col max-h-[400px]">
                                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                    {uuids.map((id, index) => (
                                        <div
                                            key={index}
                                            className="group flex items-center justify-between px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <code className="text-sm text-slate-700 dark:text-slate-300 font-mono tracking-wide">{id}</code>
                                            <button
                                                onClick={() => copyToClipboard(id, index)}
                                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                title="Copy"
                                            >
                                                {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
