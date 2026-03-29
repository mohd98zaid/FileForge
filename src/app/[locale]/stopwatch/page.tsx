"use client";

import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How accurate is this stopwatch?", questionHi: "यह स्टॉपवॉच कितनी सटीक है?", answer: "Extremely accurate. It calculates time differences mathematically using high-resolution performance.now() timestamps rather than relying purely on an uncalibrated setInterval interval, minimizing drift.", answerHi: "अत्यंत सटीक। यह बहाव को कम करने के लिए केवल एक अकैलिब्रेटेड setInterval अंतराल पर भरोसा करने के बजाय उच्च-सटीकता performance.now() टाइमस्टैम्प का उपयोग करके गणितीय रूप से समय के अंतर की गणना करता है।" },
    { question: "Does it work in the background?", questionHi: "क्या यह पृष्ठभूमि (Background) में काम करता है?", answer: "Yes. Due to the timestamp diffing approach, even if the browser throttles background tabs, the time immediately recalculates correctly when you focus the tab again.", answerHi: "हाँ। टाइमस्टैम्प डिफिंग दृष्टिकोण के कारण, भले ही ब्राउज़र पृष्ठभूमि टैब को थ्रॉटल करता है, जब आप टैब पर फिर से ध्यान केंद्रित करते हैं तो समय तुरंत सही ढंग से पुनर्गणना करता है।" },
];

interface Lap {
    lapNumber: number;
    overallTime: number; // Ms
    lapDelta: number;    // Ms since previous lap
}

export default function StopwatchPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [isRunning, setIsRunning] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0); // in ms
    const [laps, setLaps] = useState<Lap[]>([]);

    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);

    const updateTimer = () => {
        if (!startTimeRef.current) return;
        const now = performance.now();
        const delta = now - startTimeRef.current;
        setTimeElapsed(accumulatedTimeRef.current + delta);
        animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = performance.now();
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning]);

    const toggleStartStop = () => {
        if (isRunning) {
            // Stopping: Add the delta to accumulated time
            const now = performance.now();
            const delta = now - startTimeRef.current;
            accumulatedTimeRef.current += delta;
        }
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeElapsed(0);
        accumulatedTimeRef.current = 0;
        startTimeRef.current = 0;
        setLaps([]);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const recordLap = () => {
        const lastLapTime = laps.length > 0 ? laps[0].overallTime : 0;
        const delta = timeElapsed - lastLapTime;
        
        const newLap: Lap = {
            lapNumber: laps.length + 1,
            overallTime: timeElapsed,
            lapDelta: delta
        };

        // Prepend so the newest lap is at the top of the table
        setLaps([newLap, ...laps]);
    };

    // Format mm:ss.ms
    const formatTime = (ms: number, includeMs = true) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10); // Display 2 digit MS

        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');
        const msStr = String(milliseconds).padStart(2, '0');

        if (includeMs) {
            return `${mStr}:${sStr}.${msStr}`;
        }
        return `${mStr}:${sStr}`;
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⏱️ स्टॉपवॉच" : "⏱️ Stopwatch"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "सटीक मिलीसेकंड समय और लैप रिकॉर्डिंग" : "Precision millisecond timing and lap recording"}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Main Display */}
                <div className="glass-card flex flex-col items-center justify-center p-12 sm:p-20 relative overflow-hidden">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

                    <div className={`text-6xl sm:text-8xl font-black font-mono tracking-tighter transition-colors duration-300 drop-shadow-xl z-10
                        ${isRunning ? 'text-indigo-400' : 'text-slate-100'}`}>
                        {formatTime(timeElapsed)}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 sm:gap-6 mt-12 z-10 w-full max-w-sm">
                        <button 
                            onClick={toggleStartStop}
                            className={`flex-1 py-4 sm:py-5 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2
                                ${isRunning 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50'
                                }`}
                        >
                            {isRunning ? (
                                <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg> Stop</>
                            ) : (
                                <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg> Start</>
                            )}
                        </button>
                        
                        <button 
                            onClick={isRunning ? recordLap : resetTimer}
                            disabled={!isRunning && timeElapsed === 0}
                            className={`flex-1 py-4 sm:py-5 rounded-2xl font-bold text-lg transition-all border shadow-lg flex items-center justify-center gap-2
                                ${(!isRunning && timeElapsed === 0)
                                    ? 'bg-slate-800/50 border-slate-700/50 text-slate-500 cursor-not-allowed'
                                    : 'bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700'
                                }`}
                        >
                            {isRunning ? (
                                <><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg> {isHi ? "लैप" : "Lap"}</>
                            ) : (
                                <><svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> {isHi ? "रीसेट करें" : "Reset"}</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Laps List */}
                {laps.length > 0 && (
                    <div className="glass-card shadow-xl overflow-hidden mt-8 p-0">
                        <div className="flex justify-between items-center mb-4 p-4 border-b border-slate-700/50">
                            <h3 className="font-bold text-lg text-slate-200">{isHi ? "लैप्स" : "Laps"}</h3>
                            <button 
                                onClick={() => setLaps([])}
                                className="text-sm px-3 py-1 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-slate-700 hover:border-red-500/50"
                            >
                                {isHi ? "स्पष्ट" : "Clear Laps"}
                            </button>
                        </div>
                        
                        <div className="w-full max-h-80 overflow-y-auto">
                            <table className="w-full text-left font-mono text-sm">
                                <thead className="bg-slate-800/80 sticky top-0 z-10 shadow-md">
                                    <tr>
                                        <th className="py-3 px-6 text-slate-400 font-medium">Lap</th>
                                        <th className="py-3 px-6 text-slate-400 font-medium text-right">Lap Time</th>
                                        <th className="py-3 px-6 text-slate-400 font-medium text-right">Overall Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laps.map((lap, idx) => (
                                        <tr key={lap.lapNumber} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${idx === 0 ? 'text-indigo-300' : 'text-slate-300'}`}>
                                            <td className="py-4 px-6 font-bold flex items-center gap-2">
                                                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">{String(lap.lapNumber).padStart(2, '0')}</span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                +{formatTime(lap.lapDelta)}
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold">
                                                {formatTime(lap.overallTime)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/stopwatch" tools={ALL_TOOLS} />
        </div>
    );
}
