"use client";

import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is the Pomodoro technique?", questionHi: "पोमोडोरो तकनीक क्या है?", answer: "The Pomodoro Technique is a time management method based on 25-minute stretches of focused work broken by five-minute breaks. Longer breaks, typically 15 to 30 minutes, are taken after four consecutive work intervals.", answerHi: "पोमोडोरो तकनीक एक समय प्रबंधन पद्धति है जो 25 मिनट के केंद्रित कार्य पर आधारित है जिसे पांच मिनट के ब्रेक से तोड़ा जाता है। लगातार चार कार्य अंतरालों के बाद लंबे ब्रेक, आमतौर पर 15 से 30 मिनट, लिए जाते हैं।" },
    { question: "Does this timer sound an alarm?", questionHi: "क्या यह टाइमर अलार्म बजाता है?", answer: "Yes, a short audio chime plays whenever a timer finishes to alert you to switch contexts.", answerHi: "हां, जब भी टाइमर समाप्त होता है तो आपको संदर्भ बदलने के लिए सचेत करने के लिए एक छोटी ऑडियो घंटी बजती है।" },
    { question: "Why do browsers sometimes stop the timer?", questionHi: "कभी-कभी ब्राउज़र टाइमर को क्यों रोक देते हैं?", answer: "Modern web browsers pause background tabs to save battery. We calculate time using timestamps, meaning even if the browser pauses the visual tick, the underlying math will immediately catch up perfectly as soon as you refocus the tab.", answerHi: "आधुनिक वेब ब्राउज़र बैटरी बचाने के लिए पृष्ठभूमि टैब को रोकते हैं। हम टाइमस्टैम्प का उपयोग करके समय की गणना करते हैं, जिसका अर्थ है कि भले ही ब्राउज़र दृश्य टिक को रोक दे, जैसे ही आप टैब को फिर से फोकस करेंगे, अंतर्निहित गणित तुरंत पूरी तरह से पकड़ लेगा।" },
];

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

// Base64 encoded simple sine-wave chime (so we don't need external static assets)
const CHIME_URL = "data:audio/wav;base64,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";

// Small inline audio player ref purely for triggering chime
const playChime = () => {
    try {
        const audio = new Audio(CHIME_URL);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play suppressed by browser policy:", e));
    } catch {
        // Ignore fallback
    }
};

export default function PomodoroTimerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Durations in minutes
    const [pomodoroDur, setPomodoroDur] = useState(25);
    const [shortBreakDur, setShortBreakDur] = useState(5);
    const [longBreakDur, setLongBreakDur] = useState(15);

    const [mode, setMode] = useState<TimerMode>("pomodoro");
    const [timeLeft, setTimeLeft] = useState(25 * 60); // In seconds
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);

    const endTimeRef = useRef<number | null>(null);
    const rAFRef = useRef<number | null>(null);
    const savedTimeLeftRef = useRef<number>(25 * 60);

    // Dynamic mode switching
    const switchMode = (newMode: TimerMode, isAuto = false) => {
        setIsRunning(false);
        setMode(newMode);
        
        let initialSeconds = 0;
        if (newMode === "pomodoro") initialSeconds = pomodoroDur * 60;
        if (newMode === "shortBreak") initialSeconds = shortBreakDur * 60;
        if (newMode === "longBreak") initialSeconds = longBreakDur * 60;
        
        savedTimeLeftRef.current = initialSeconds;
        setTimeLeft(initialSeconds);
        endTimeRef.current = null;

        if (isAuto) {
            playChime();
        }
    };

    // Apply custom settings immediately if timer is not running
    useEffect(() => {
        if (!isRunning) {
            if (mode === "pomodoro") setTimeLeft(pomodoroDur * 60);
            if (mode === "shortBreak") setTimeLeft(shortBreakDur * 60);
            if (mode === "longBreak") setTimeLeft(longBreakDur * 60);
        }
    }, [pomodoroDur, shortBreakDur, longBreakDur, isRunning, mode]);

    const handleTick = () => {
        if (!endTimeRef.current || !isRunning) return;
        
        const now = Date.now();
        const remainingTicks = Math.ceil((endTimeRef.current - now) / 1000);

        if (remainingTicks <= 0) {
            // Timer Finished
            if (mode === "pomodoro") {
                const newSessionCount = sessions + 1;
                setSessions(newSessionCount);
                if (newSessionCount > 0 && newSessionCount % 4 === 0) {
                    switchMode("longBreak", true);
                } else {
                    switchMode("shortBreak", true);
                }
            } else {
                switchMode("pomodoro", true);
            }
            return;
        }

        setTimeLeft(remainingTicks);
        savedTimeLeftRef.current = remainingTicks;
        rAFRef.current = requestAnimationFrame(handleTick);
    };

    useEffect(() => {
        if (isRunning) {
            // Calculate exact end time relative to now based on remaining seconds
            endTimeRef.current = Date.now() + (savedTimeLeftRef.current * 1000);
            rAFRef.current = requestAnimationFrame(handleTick);
        } else {
            if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
            endTimeRef.current = null;
        }

        return () => {
            if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning, mode, sessions]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        if (mode === "pomodoro") setTimeLeft(pomodoroDur * 60);
        if (mode === "shortBreak") setTimeLeft(shortBreakDur * 60);
        if (mode === "longBreak") setTimeLeft(longBreakDur * 60);
        savedTimeLeftRef.current = timeLeft;
    };

    // Derived UI states
    const minutesDisplay = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secondsDisplay = String(timeLeft % 60).padStart(2, '0');

    let bgClass = "from-indigo-900 to-slate-900";
    let accentClass = "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/50";
    let textClass = "text-indigo-400";
    
    // Calculate progress for circular indicator
    let totalSeconds = pomodoroDur * 60;
    if (mode === "shortBreak") {
        totalSeconds = shortBreakDur * 60;
        bgClass = "from-emerald-900 to-slate-900";
        accentClass = "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/50";
        textClass = "text-emerald-400";
    } else if (mode === "longBreak") {
        totalSeconds = longBreakDur * 60;
        bgClass = "from-blue-900 to-slate-900";
        accentClass = "bg-blue-600 hover:bg-blue-500 shadow-blue-500/50";
        textClass = "text-blue-400";
    }

    const progress = (timeLeft / totalSeconds) * 100;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🍅 पोमोडोरो टाइमर" : "🍅 Pomodoro Timer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "फ़ोकस अंतराल और छोटे ब्रेक के साथ अपनी उत्पादकता को बढ़ाएं" : "Boost your productivity with focused intervals and precise breaks"}</p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                
                {/* Timer Box */}
                <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-gradient-to-br ${bgClass} transition-colors duration-1000`}>
                    
                    {/* Tab Selection */}
                    <div className="flex w-full bg-slate-950/40 p-2 gap-2">
                        <button 
                            onClick={() => switchMode("pomodoro")}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                ${mode === "pomodoro" ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                        >
                            {isHi ? "फ़ोकस" : "Focus"}
                        </button>
                        <button 
                            onClick={() => switchMode("shortBreak")}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                ${mode === "shortBreak" ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                        >
                            {isHi ? "छोटा ब्रेक" : "Short Break"}
                        </button>
                        <button 
                            onClick={() => switchMode("longBreak")}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                ${mode === "longBreak" ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                        >
                            {isHi ? "लंबा ब्रेक" : "Long Break"}
                        </button>
                    </div>

                    <div className="p-12 flex flex-col items-center">
                        
                        {/* Circle SVG */}
                        <div className="relative w-64 h-64 mx-auto flex flex-col items-center justify-center mb-8">
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900/50" />
                                <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 120}
                                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                    className={`transition-all duration-1000 ease-linear ${textClass}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-6xl font-black tabular-nums text-white absolute z-10 drop-shadow-md">
                                {minutesDisplay}:{secondsDisplay}
                            </div>
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <button 
                                onClick={toggleTimer}
                                className={`px-12 py-5 rounded-2xl font-bold text-xl sm:text-2xl text-white transition-all shadow-lg min-w-[200px]
                                     ${isRunning ? 'bg-slate-800 hover:bg-slate-700' : accentClass}`}
                            >
                                {isRunning ? (isHi ? "विराम दें" : "Pause") : (isHi ? "शुरू" : "START")}
                            </button>
                            
                            {/* Reset Button */}
                            {(!isRunning && timeLeft !== totalSeconds && totalSeconds > 0) && (
                                <button 
                                    onClick={resetTimer}
                                    className="px-6 py-5 rounded-2xl font-bold text-2xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
                                    title={isHi ? "रीसेट करें" : "Reset Timer"}
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="bg-slate-950/60 p-4 flex justify-between items-center px-8 border-t border-slate-800/50">
                        <span className="text-slate-400 font-medium font-mono">#{sessions} {isHi ? "सत्र पूर्ण" : "Sessions completed"}</span>
                        
                        {/* Pomodoro dot tracker */}
                        <div className="flex gap-2">
                            {[1,2,3,4].map(num => (
                                <div 
                                    key={num} 
                                    className={`w-3 h-3 rounded-full transition-colors 
                                        ${(sessions % 4) >= num || (sessions > 0 && sessions % 4 === 0) ? textClass : 'bg-slate-800 border border-slate-700'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Settings Card */}
                <div className="w-full max-w-lg glass-card p-6 border-slate-700/50">
                    <h3 className="font-bold text-slate-200 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {isHi ? "अवधि सेटिंग्स (मिनट)" : "Settings (Minutes)"}
                    </h3>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col items-center">
                            <label className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-bold">{isHi ? "फ़ोकस" : "Focus"}</label>
                            <input 
                                type="number" 
                                value={pomodoroDur} 
                                onChange={(e) => setPomodoroDur(Math.max(1, Number(e.target.value)))}
                                min="1" max="60"
                                disabled={isRunning}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-slate-200 font-bold focus:border-indigo-500 disabled:opacity-50"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-bold">{isHi ? "छोटा ब्रेक" : "Short Break"}</label>
                            <input 
                                type="number" 
                                value={shortBreakDur} 
                                onChange={(e) => setShortBreakDur(Math.max(1, Number(e.target.value)))}
                                min="1" max="60"
                                disabled={isRunning}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-slate-200 font-bold focus:border-emerald-500 disabled:opacity-50"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-bold">{isHi ? "लंबा ब्रेक" : "Long Break"}</label>
                            <input 
                                type="number" 
                                value={longBreakDur} 
                                onChange={(e) => setLongBreakDur(Math.max(1, Number(e.target.value)))}
                                min="1" max="60"
                                disabled={isRunning}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-slate-200 font-bold focus:border-blue-500 disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pomodoro" tools={ALL_TOOLS} />
        </div>
    );
}
