"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How does the countdown work?", questionHi: "उलटी गिनती कैसे काम करती है?", answer: "It continuously calculates the exact mathematical difference between your device's current local time and the target date you selected.", answerHi: "यह आपके डिवाइस के वर्तमान स्थानीय समय और आपके द्वारा चुनी गई लक्ष्य तिथि के बीच सटीक गणितीय अंतर की लगातार गणना करता है।" },
    { question: "Can I share my countdown?", questionHi: "क्या मैं अपनी उलटी गिनती साझा कर सकता हूँ?", answer: "Currently, this version saves the target date temporarily while the page is open. URL sharing for custom countdowns will be available in a future update.", answerHi: "वर्तमान में, यह संस्करण पेज खुला रहने के दौरान लक्ष्य तिथि को अस्थायी रूप से सहेजता है। कस्टम काउंटडाउन के लिए URL साझाकरण भविष्य के अपडेट में उपलब्ध होगा।" },
    { question: "What happens when it reaches zero?", questionHi: "जब यह शून्य पर पहुंच जाता है तो क्या होता है?", answer: "The timer stops at 00:00:00:00 and displays a completion message.", answerHi: "टाइमर 00:00:00:00 पर रुक जाता है और एक पूर्णता संदेश प्रदर्शित करता है।" },
];

export default function CountdownTimerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Default target: End of the current year
    const defaultTarget = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

    const [targetDateStr, setTargetDateStr] = useState<string>("");
    const [eventName, setEventName] = useState<string>(isHi ? "नया साल" : "New Year");
    
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    // Initialize date string for the datetime-local input safely on client side
    useEffect(() => {
        const offset = defaultTarget.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(defaultTarget.getTime() - offset)).toISOString().slice(0, 16);
        setTargetDateStr(localISOTime);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!targetDateStr) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDateStr).getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(interval);
                setIsExpired(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setIsExpired(false);
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDateStr]);

    const handlePreset = (presetName: string, dateObj: Date) => {
        setEventName(presetName);
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj.getTime() - offset)).toISOString().slice(0, 16);
        setTargetDateStr(localISOTime);
    };

    const getPresets = () => {
        const now = new Date();
        const y = now.getFullYear();
        return [
            { label: "New Year", date: new Date(y, 11, 31, 23, 59, 59) },
            { label: "Christmas", date: new Date(y, 11, 25, 0, 0, 0) },
            { label: "Tomorrow", date: new Date(y, now.getMonth(), now.getDate() + 1, 0, 0, 0) },
            { label: "Next Weekend", date: new Date(y, now.getMonth(), now.getDate() + (6 - now.getDay()), 0, 0, 0) } // Rough estimate for Saturday
        ];
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⏳ उल्टी गिनती टाइमर" : "⏳ Countdown Timer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "किसी भी घटना, मील के पत्थर या समय सीमा के लिए लाइव उल्टी गिनती" : "Live countdown down to the exact second for any event or deadline"}</p>
            </div>

            <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
                
                {/* Visual Output */}
                <div className="w-full glass-card border-indigo-500/20 shadow-2xl shadow-indigo-500/10 p-8 sm:p-16 flex flex-col items-center relative overflow-hidden">
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-12 text-center drop-shadow-sm uppercase tracking-widest">
                        {eventName || (isHi ? "आपका इवेंट" : "Your Event")}
                        {isExpired && <span className="block text-xl text-red-500 mt-4">{isHi ? "समय समाप्त हो गया है!" : "(Event has passed!)"}</span>}
                    </h2>

                    <div className="grid grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl">
                        
                        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-inner">
                            <span className="text-4xl sm:text-7xl font-mono font-black text-indigo-400 drop-shadow-md">
                                {timeLeft ? String(timeLeft.days).padStart(2, '0') : "00"}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2">{isHi ? "दिन" : "Days"}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-inner">
                            <span className="text-4xl sm:text-7xl font-mono font-black text-white drop-shadow-md">
                                {timeLeft ? String(timeLeft.hours).padStart(2, '0') : "00"}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2">{isHi ? "घंटे" : "Hours"}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-inner">
                            <span className="text-4xl sm:text-7xl font-mono font-black text-white drop-shadow-md">
                                {timeLeft ? String(timeLeft.minutes).padStart(2, '0') : "00"}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2">{isHi ? "मिनट" : "Minutes"}</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-inner">
                            <span className="text-4xl sm:text-7xl font-mono font-black text-pink-500 drop-shadow-md">
                                {timeLeft ? String(timeLeft.seconds).padStart(2, '0') : "00"}
                            </span>
                            <span className="text-xs sm:text-sm text-slate-400 uppercase tracking-widest mt-2">{isHi ? "सेकंड" : "Seconds"}</span>
                        </div>

                    </div>
                </div>

                {/* Configuration Area */}
                <div className="w-full flex flex-col md:flex-row gap-8">
                    
                    <div className="flex-1 glass-card space-y-6">
                        <h3 className="font-bold text-lg text-slate-200">{isHi ? "उल्टी गिनती सेट करें" : "Set Target Date"}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">{isHi ? "इवेंट का नाम" : "Event Name"}</label>
                                <input 
                                    type="text" 
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder={isHi ? "उदा. नया साल" : "e.g., Vacation, Launch"}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">{isHi ? "लक्ष्य तिथि और समय" : "Target Date & Time"}</label>
                                <input 
                                    type="datetime-local" 
                                    value={targetDateStr}
                                    onChange={(e) => setTargetDateStr(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 glass-card space-y-6">
                        <h3 className="font-bold text-lg text-slate-200">{isHi ? "त्वरित पूर्व-सेट" : "Quick Presets"}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {getPresets().map(preset => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePreset(preset.label, preset.date)}
                                    className="p-3 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all group"
                                >
                                    <div className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm">{preset.label}</div>
                                    <div className="text-xs font-mono text-slate-500 group-hover:text-indigo-200 mt-1">
                                        {preset.date.toLocaleDateString()}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                            {isHi ? "ये प्रीसेट आपके लाइव स्थानीय समय के सापेक्ष डायनामिक रूप से उत्पन्न होते हैं।" : "These presets are dynamically generated relative to your live local time constraint."}
                        </p>
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/countdown-timer" tools={ALL_TOOLS} />
        </div>
    );
}
