"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Activity, RefreshCw } from "lucide-react";

export default function BpmCounterTool() {
    const [taps, setTaps] = useState<number[]>([]);
    const [bpm, setBpm] = useState<number>(0);
    const [flash, setFlash] = useState(false);
    
    // Auto-reset if user stops tapping for 3 seconds
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleTap = () => {
        const now = performance.now();
        setFlash(true);
        setTimeout(() => setFlash(false), 50);

        setTaps((prev) => {
            const newTaps = [...prev, now];
            
            // Keep last 10 taps for moving average
            if (newTaps.length > 10) {
                newTaps.shift();
            }

            if (newTaps.length >= 2) {
                const intervals = [];
                for (let i = 1; i < newTaps.length; i++) {
                    intervals.push(newTaps[i] - newTaps[i - 1]);
                }
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const calculatedBpm = Math.round(60000 / avgInterval);
                setBpm(calculatedBpm);
            }

            return newTaps;
        });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setTaps([]);
            // keep the last BPM visible, but restart the sequence
        }, 3000);
    };

    const reset = () => {
        setTaps([]);
        setBpm(0);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    return (
        <ToolLayout
            title="BPM Counter (Tap Tempo)"
            description="Find the BPM of any song by tapping along to the beat."
           
        >
            <div className="max-w-2xl mx-auto flex flex-col items-center space-y-8 py-10">
                <div className={`w-64 h-64 rounded-[3rem] shadow-xl flex flex-col items-center justify-center transition-all duration-300 ${flash ? 'bg-indigo-600 scale-105' : 'bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/50'}`}>
                    <span className={`text-7xl font-bold font-mono ${flash ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {bpm > 0 ? bpm : '000'}
                    </span>
                    <span className={`text-lg font-medium mt-2 ${flash ? 'text-indigo-200' : 'text-slate-500'}`}>
                        BPM
                    </span>
                </div>

                <div className="w-full flex flex-col gap-4 max-w-sm">
                    <Button 
                        onClick={handleTap}
                        className="w-full py-8 text-2xl font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_8px_30px_rgb(79,70,229,0.3)] active:scale-95 transition-all outline-none"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        TAP HERE
                    </Button>
                    <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
                        Or press any key on your keyboard
                    </p>
                    <Button onClick={reset} variant="secondary" className="w-full mt-4 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Reset
                    </Button>
                </div>
            </div>
        </ToolLayout>
    );
}
