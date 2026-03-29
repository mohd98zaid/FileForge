"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How accurate is the time?", questionHi: "समय कितना सटीक है?", answer: "The time is synchronized to your device's internal clock and is rendered natively by your browser's internationalization API (Intl.DateTimeFormat). It is as accurate as your system clock.", answerHi: "समय आपके डिवाइस की घडी के साथ समन्वयित है और आपके ब्राउज़र के अंतर्राष्ट्रीयकरण API (Intl.DateTimeFormat) द्वारा मूल रूप से प्रस्तुत किया जाता है। यह आपके सिस्टम घड़ी जितना ही सटीक है।" },
    { question: "Does it adjust for Daylight Saving Time (DST)?", questionHi: "क्या यह डेलाइट सेविंग टाइम (DST) के लिए समायोजित होता है?", answer: "Yes. By using proper IANA timezone names (like America/New_York instead of EST), the browser automatically calculates and applies the correct active Daylight Saving Time shifts for any given date.", answerHi: "हाँ। उचित IANA समयक्षेत्र नामों का उपयोग करके, ब्राउज़र किसी भी दी गई तिथि के लिए सही सक्रिय डेलाइट सेविंग टाइम बदलावों की स्वचालित रूप से गणना और लागू करता है।" },
    { question: "Is this checking a server?", questionHi: "क्या यह सर्वर की जांच कर रहा है?", answer: "No. All calculations are performed 100% locally on your machine. This page will tick perfectly even if you lose your internet connection.", answerHi: "नहीं। सभी गणनाएं आपकी मशीन पर 100% स्थानीय रूप से की जाती हैं।" },
];

const ALL_TIMEZONES = [
    { city: "Los Angeles", tz: "America/Los_Angeles" },
    { city: "Chicago", tz: "America/Chicago" },
    { city: "New York", tz: "America/New_York" },
    { city: "Toronto", tz: "America/Toronto" },
    { city: "Sao Paulo", tz: "America/Sao_Paulo" },
    { city: "London", tz: "Europe/London" },
    { city: "Paris", tz: "Europe/Paris" },
    { city: "Berlin", tz: "Europe/Berlin" },
    { city: "Moscow", tz: "Europe/Moscow" },
    { city: "Dubai", tz: "Asia/Dubai" },
    { city: "Mumbai", tz: "Asia/Kolkata" },
    { city: "Singapore", tz: "Asia/Singapore" },
    { city: "Hong Kong", tz: "Asia/Hong_Kong" },
    { city: "Tokyo", tz: "Asia/Tokyo" },
    { city: "Seoul", tz: "Asia/Seoul" },
    { city: "Sydney", tz: "Australia/Sydney" },
    { city: "Auckland", tz: "Pacific/Auckland" },
];

const DEFAULT_ZONES = [
    { id: "UTC", city: "UTC", tz: "UTC" },
    { id: "NY", city: "New York", tz: "America/New_York" },
    { id: "LND", city: "London", tz: "Europe/London" },
    { id: "TYO", city: "Tokyo", tz: "Asia/Tokyo" },
    { id: "SYD", city: "Sydney", tz: "Australia/Sydney" },
    { id: "DEL", city: "New Delhi", tz: "Asia/Kolkata" },
];

export default function WorldClockPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [zones, setZones] = useState(DEFAULT_ZONES);
    const [use24Hour, setUse24Hour] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showAddMenu, setShowAddMenu] = useState(false);

    useEffect(() => {
        // Load saved preferences
        try {
            const saved = localStorage.getItem("fileforge_worldclock_prefs");
            if (saved) {
                const prefs = JSON.parse(saved);
                if (prefs.use24Hour !== undefined) setUse24Hour(prefs.use24Hour);
                if (prefs.viewMode) setViewMode(prefs.viewMode);
            }
            const savedZones = localStorage.getItem("fileforge_worldclock_zones");
            if (savedZones) {
                const parsed = JSON.parse(savedZones);
                if (Array.isArray(parsed) && parsed.length > 0) setZones(parsed);
            }
        } catch {}

        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem("fileforge_worldclock_prefs", JSON.stringify({ use24Hour, viewMode }));
    }, [use24Hour, viewMode]);

    useEffect(() => {
        localStorage.setItem("fileforge_worldclock_zones", JSON.stringify(zones));
    }, [zones]);

    const addZone = (city: string, tz: string) => {
        if (!zones.find(z => z.tz === tz)) {
            setZones([...zones, { id: tz, city, tz }]);
        }
        setShowAddMenu(false);
    };

    const removeZone = (tz: string) => {
        setZones(zones.filter(z => z.tz !== tz));
    };

    const formatTime = (date: Date, timeZone: string) => {
        try {
            return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-US", {
                timeZone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: !use24Hour
            }).format(date);
        } catch { return "Invalid TZ"; }
    };

    const formatDate = (date: Date, timeZone: string) => {
        try {
            return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-US", {
                timeZone, weekday: 'short', month: 'short', day: 'numeric'
            }).format(date);
        } catch { return ""; }
    };

    const getOffsetString = (date: Date, tz: string) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone: tz, timeZoneName: 'shortOffset'
            }).formatToParts(date).find(p => p.type === 'timeZoneName')?.value || tz;
        } catch { return tz; }
    };

    const getAnalogHands = (date: Date, tz: string) => {
        try {
            const options = { timeZone: tz === 'UTC' ? 'UTC' : tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false } as const;
            const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
            const find = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
            const h = find('hour'), m = find('minute'), s = find('second');
            return { hours: (h % 12) * 30 + m * 0.5, minutes: m * 6, seconds: s * 6 };
        } catch { return { hours: 0, minutes: 0, seconds: 0 }; }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌍 वर्ल्ड क्लॉक" : "🌍 World Clock"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "वास्तविक समय में वैश्विक समयक्षेत्रों को ट्रैक करें" : "Track exact global timezones live in your browser"}</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Controls Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-sm font-medium text-slate-300">
                        {isHi ? "स्थानीय समय:" : "Local:"}
                        <span className="ml-2 font-mono text-indigo-400 font-bold">
                            {currentTime ? currentTime.toLocaleTimeString(locale === "hi" ? 'hi-IN' : 'en-US', { hour12: !use24Hour }) : '--:--:--'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">
                            <input type="checkbox" checked={use24Hour} onChange={e => setUse24Hour(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" />
                            {isHi ? "24h" : "24h"}
                        </label>
                        {/* View Toggle */}
                        <div className="flex bg-slate-900 p-1 rounded-lg">
                            <button onClick={() => setViewMode("grid")} className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                ⊞ {isHi ? "ग्रिड" : "Grid"}
                            </button>
                            <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded text-sm font-medium transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                                ☰ {isHi ? "लिस्ट" : "List"}
                            </button>
                        </div>
                        {/* Add Timezone */}
                        <div className="relative">
                            <button onClick={() => setShowAddMenu(!showAddMenu)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                {isHi ? "जोड़ें" : "Add"}
                            </button>
                            {showAddMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 py-2 max-h-64 overflow-y-auto">
                                    {ALL_TIMEZONES.filter(az => !zones.find(z => z.tz === az.tz)).map(az => (
                                        <button key={az.tz} onClick={() => addZone(az.city, az.tz)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                            {az.city}
                                        </button>
                                    ))}
                                    {ALL_TIMEZONES.filter(az => !zones.find(z => z.tz === az.tz)).length === 0 && (
                                        <div className="px-4 py-3 text-sm text-slate-500 italic">{isHi ? "सभी जोड़े गए" : "All added"}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Clocks */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {zones.map(zone => {
                            const hands = currentTime ? getAnalogHands(currentTime, zone.tz) : { hours: 0, minutes: 0, seconds: 0 };
                            return (
                                <div key={zone.id} className="glass-card relative group overflow-hidden">
                                    {zones.length > 1 && (
                                        <button onClick={() => removeZone(zone.tz)}
                                            className="absolute top-3 right-3 text-slate-500 hover:text-red-400 bg-slate-900/50 hover:bg-red-500/10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                                            title="Remove">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-xl font-bold text-slate-200">{zone.city}</h3>
                                        {/* Analog mini-clock */}
                                        <div className="relative w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-indigo-900/50 bg-slate-800 shrink-0">
                                            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-slate-200 rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
                                            <div className="absolute top-1/2 left-1/2 w-0.5 bg-slate-300 rounded-full origin-bottom" style={{ height: '22%', transform: `translate(-50%, -100%) rotate(${hands.hours}deg)` }} />
                                            <div className="absolute top-1/2 left-1/2 w-px bg-slate-400 rounded-full origin-bottom" style={{ height: '30%', transform: `translate(-50%, -100%) rotate(${hands.minutes}deg)` }} />
                                            <div className="absolute top-1/2 left-1/2 w-px bg-rose-500 rounded-full origin-bottom" style={{ height: '35%', transform: `translate(-50%, -100%) rotate(${hands.seconds}deg)` }} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-indigo-400 font-mono mb-3">{currentTime ? getOffsetString(currentTime, zone.tz) : zone.tz}</p>
                                    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                                        <div className={`font-mono font-bold text-slate-100 tracking-tight ${use24Hour ? 'text-3xl' : 'text-2xl'}`}>
                                            {currentTime ? formatTime(currentTime, zone.tz) : '--:--:--'}
                                        </div>
                                        <div className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">
                                            {currentTime ? formatDate(currentTime, zone.tz) : '---'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {zones.map(zone => (
                            <div key={zone.id} className="glass-card flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-200">{zone.city}</h3>
                                        <span className="text-xs text-slate-500 font-mono">{currentTime ? getOffsetString(currentTime, zone.tz) : zone.tz}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-xl text-slate-100">{currentTime ? formatTime(currentTime, zone.tz) : '--:--:--'}</div>
                                        <div className="text-xs text-slate-400">{currentTime ? formatDate(currentTime, zone.tz) : ''}</div>
                                    </div>
                                    {zones.length > 1 && (
                                        <button onClick={() => removeZone(zone.tz)}
                                            className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/world-clock" tools={ALL_TOOLS} />
        </div>
    );
}
