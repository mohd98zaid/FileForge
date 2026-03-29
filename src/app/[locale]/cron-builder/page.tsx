"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is Cron?", questionHi: "क्रॉन क्या है?", answer: "Cron is a time-based job scheduler used in Unix-like operating systems to automate repetitive tasks.", answerHi: "क्रॉन एक समय-आधारित जॉब शेड्यूलर है जिसका उपयोग दोहराए जाने वाले कार्यों को स्वचालित करने के लिए किया जाता है।" },
];

export default function CronBuilderPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [minute, setMinute] = useState("*");
    const [hour, setHour] = useState("*");
    const [dayOfMonth, setDayOfMonth] = useState("*");
    const [month, setMonth] = useState("*");
    const [dayOfWeek, setDayOfWeek] = useState("*");

    const cronString = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

    const setPreset = (preset: string) => {
        const parts = preset.split(" ");
        if (parts.length === 5) {
            setMinute(parts[0]);
            setHour(parts[1]);
            setDayOfMonth(parts[2]);
            setMonth(parts[3]);
            setDayOfWeek(parts[4]);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cronString);
    };

    const translateToReadable = () => {
        // Simple human-readable translation just to provide context (a full library like cronstrue is better, but this suffices for basics)
        if (cronString === "* * * * *") return isHi ? "हर एक मिनट में" : "Every minute";
        if (cronString === "0 * * * *") return isHi ? "हर एक घंटे में" : "Every hour (at minute 0)";
        if (cronString === "0 0 * * *") return isHi ? "हर दिन आधी रात को" : "Every day at midnight";
        if (cronString === "0 0 * * 0") return isHi ? "हर हफ्ते संडे को" : "Every week on Sunday at midnight";
        if (cronString === "0 0 1 * *") return isHi ? "हर महीने की 1 तारीख को" : "Every month on the 1st at midnight";
        
        return isHi ? "क्रॉन शेड्युल" : "Custom Cron Schedule";
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⏰ क्रॉन बिल्डर" : "⏰ Cron Builder"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "क्रॉन एक्सप्रेशन जनरेट करें" : "Generate and understand cron scheduling expressions"}
                </p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-8">
                
                {/* Result Box */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 shadow-inner relative">
                    <h2 className="text-4xl sm:text-6xl font-mono text-indigo-400 tracking-widest font-black">
                        {cronString}
                    </h2>
                    <p className="text-slate-300 text-lg sm:text-xl font-medium text-center">
                        "{translateToReadable()}"
                    </p>
                    <button 
                        onClick={copyToClipboard}
                        className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-600"
                        title={isHi ? "कॉपी करें" : "Copy"}
                    >
                        📑
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 py-2">
                     <span className="text-sm text-slate-500 flex items-center mr-2">{isHi ? "प्रीसेट (Presets):" : "Presets:"}</span>
                     {[
                         { label: isHi ? "हर मिनट" : "Every Minute", cron: "* * * * *" },
                         { label: isHi ? "हर घंटा" : "Every Hour", cron: "0 * * * *" },
                         { label: isHi ? "रोजाना" : "Daily", cron: "0 0 * * *" },
                         { label: isHi ? "साप्ताहिक" : "Weekly", cron: "0 0 * * 0" },
                         { label: isHi ? "मासिक" : "Monthly", cron: "0 0 1 * *" },
                     ].map((p, i) => (
                         <button 
                            key={i} 
                            onClick={() => setPreset(p.cron)}
                            className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs transition-colors"
                        >
                             {p.label}
                         </button>
                     ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                     {[
                         { title: isHi ? "मिनट (Minute)" : "Minute", val: minute, set: setMinute, options: ["*", "0", "15", "30", "45", "*/5", "*/15"] },
                         { title: isHi ? "घंटा (Hour)" : "Hour", val: hour, set: setHour, options: ["*", "0", "12", "*/2", "*/4", "*/6"] },
                         { title: isHi ? "दिन (Day)" : "Day (Month)", val: dayOfMonth, set: setDayOfMonth, options: ["*", "1", "15", "*/2"] },
                         { title: isHi ? "महीना (Month)" : "Month", val: month, set: setMonth, options: ["*", "1", "6", "12", "*/3"] },
                         { title: isHi ? "सप्ताह (Week)" : "Day (Week)", val: dayOfWeek, set: setDayOfWeek, options: ["*", "0", "1-5", "6,0"] }
                     ].map((col, i) => (
                         <div key={i} className="flex flex-col space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase text-center bg-slate-800 py-1 rounded">
                                 {col.title}
                             </label>
                             <input 
                                type="text" 
                                value={col.val} 
                                onChange={(e) => col.set(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-slate-200 font-mono text-lg focus:outline-none focus:border-indigo-500"
                             />
                             <div className="flex flex-col gap-1 mt-2">
                                 {col.options.map((opt, j) => (
                                     <button 
                                        key={j} 
                                        onClick={() => col.set(opt)}
                                        className={`px-2 py-1 text-xs font-mono rounded transition-colors ${col.val === opt ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                     >
                                         {opt}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     ))}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/cron-builder" tools={ALL_TOOLS} />
        </div>
    );
}
