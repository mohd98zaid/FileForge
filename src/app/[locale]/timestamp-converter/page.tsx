"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is a Unix timestamp?", questionHi: "Unix टाइमस्टैम्प क्या है?", answer: "The number of seconds since Jan 1, 1970. Widely used in programming.", answerHi: "1 जनवरी 1970 से अब तक बीते सेकंड्स की गिनती। प्रोग्रामिंग में बहुत इस्तेमाल होता है।" },
    { question: "Can I convert both ways?", questionHi: "क्या दोनों तरफ़ कन्वर्ट कर सकते हैं?", answer: "Yes — timestamp to date and date to timestamp.", answerHi: "हाँ — टाइमस्टैम्प से तारीख़ और तारीख़ से टाइमस्टैम्प।" },
];

export default function TimestampConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [now, setNow] = useState(Math.floor(Date.now() / 1000));
    const [epochInput, setEpochInput] = useState<string>("");
    const [dateInput, setDateInput] = useState<string>("");
    const [isMs, setIsMs] = useState(false);

    // Update "current time" every second
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Math.floor(Date.now() / (isMs ? 1 : 1000)));
        }, 1000);
        return () => clearInterval(interval);
    }, [isMs]);

    const handleEpochChange = (val: string) => {
        setEpochInput(val);
        if (!val) {
            setDateInput("");
            return;
        }
        try {
            const timestamp = parseInt(val);
            if (!isNaN(timestamp)) {
                // Determine if input is likely ms or seconds if auto-detect wanted, 
                // but sticking to manual toggle for precision.
                const date = fromUnixTime(isMs ? timestamp / 1000 : timestamp);
                setDateInput(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDateChange = (val: string) => {
        setDateInput(val);
        if (!val) {
            setEpochInput("");
            return;
        }
        try {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
                const stamp = isMs ? date.getTime() : getUnixTime(date);
                setEpochInput(stamp.toString());
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⏱️ टाइमस्टैम्प कन्वर्टर" : "⏱️ Timestamp Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "Epoch ↔ मानव तिथि" : "Epoch to Human Date & Vice Versa"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-8">
                {/* Current Time Display */}
                <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">{isHi ? "वर्तमान Unix तिथि" : "Current Unix Date"}</p>
                    <div className="text-4xl md:text-6xl font-mono text-indigo-400 font-bold tracking-tight">
                        {now}
                    </div>
                    <div className="mt-4 flex justify-center gap-4 text-sm">
                        <button
                            onClick={() => setIsMs(false)}
                            className={`px-3 py-1 rounded transition-colors ${!isMs ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            {isHi ? "सेकंड्स" : "Seconds"}
                        </button>
                        <button
                            onClick={() => setIsMs(true)}
                            className={`px-3 py-1 rounded transition-colors ${isMs ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            {isHi ? "मिलीसेकंड्स" : "Milliseconds"}
                        </button>
                    </div>
                </div>

                {/* Converter */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
                    {/* Epoch Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "Epoch टाइमस्टैम्प" : "Epoch Timestamp"}</label>
                        <input
                            type="number"
                            value={epochInput}
                            onChange={(e) => handleEpochChange(e.target.value)}
                            placeholder={now.toString()}
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 font-mono text-lg text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                        />
                        <button
                            onClick={() => handleEpochChange(now.toString())}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                            {isHi ? "वर्तमान समय का उपयोग करें" : "Use Current Time"}
                        </button>
                    </div>

                    <div className="hidden md:flex self-center text-slate-500 text-2xl pt-6">⇄</div>

                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "मानव तिथि (स्थानीय)" : "Human Date (Local)"}</label>
                        <input
                            type="datetime-local"
                            step="1"
                            value={dateInput}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 font-mono text-lg text-green-300 focus:ring-2 focus:ring-green-500/50 outline-none"
                        />
                        <p className="text-xs text-slate-500">
                            {dateInput ? new Date(dateInput).toUTCString() : (isHi ? "UTC समय यहाँ दिखाई देगा" : "UTC time will appear here")}
                        </p>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/timestamp-converter" tools={ALL_TOOLS} />
        </div>
    );
}
