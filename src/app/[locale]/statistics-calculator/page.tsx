"use client";

import React, { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function StatisticsCalculatorTool() {
    const [input, setInput] = useState("10, 20, 30, 40, 50, 60, 20, 10, 80");

    const stats = useMemo(() => {
        const raw = input.split(/[\s,]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
        if (raw.length === 0) return null;

        const nums = [...raw].sort((a, b) => a - b);
        const count = nums.length;
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        
        // Median
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
        
        // Mode
        const freqs: Record<number, number> = {};
        let maxFreq = 0;
        let modes: number[] = [];
        nums.forEach(n => {
            freqs[n] = (freqs[n] || 0) + 1;
            if (freqs[n] > maxFreq) maxFreq = freqs[n];
        });
        Object.entries(freqs).forEach(([k, v]) => {
            if (v === maxFreq) modes.push(Number(k));
        });

        // Range
        const min = nums[0];
        const max = nums[count - 1];
        const range = max - min;

        // Variance & StdDev (Sample)
        const sqDiffs = nums.map(n => Math.pow(n - mean, 2));
        const variance = count > 1 ? sqDiffs.reduce((a, b) => a + b, 0) / (count - 1) : 0;
        const stdDev = Math.sqrt(variance);

        return { count, sum, mean, median, modes, min, max, range, variance, stdDev, sorted: nums };
    }, [input]);

    const displayNum = (n: number) => Number.isInteger(n) ? n.toString() : n.toFixed(4);

    return (
        <ToolLayout title="Descriptive Statistics Calculator" description="Instantly compute Mean, Median, Mode, Variance, and Standard Deviation from your dataset.">
            <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                    <label className="font-bold text-lg mb-2 block">Data Set (Comma or Space Separated)</label>
                    <textarea 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full p-4 border rounded-xl font-mono text-lg focus:ring-2 focus:ring-sky-500 outline-none dark:bg-slate-800"
                        rows={4}
                        placeholder="e.g. 5, 10, 15, 20..."
                    />
                </div>

                {stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Count (N)" value={stats.count} />
                        <StatCard label="Sum (Σx)" value={displayNum(stats.sum)} />
                        <StatCard label="Mean (μ)" value={displayNum(stats.mean)} highlight />
                        <StatCard label="Median" value={displayNum(stats.median)} highlight />
                        <StatCard label="Mode" value={stats.modes.join(", ")} />
                        <StatCard label="Minimum" value={stats.min} />
                        <StatCard label="Maximum" value={stats.max} />
                        <StatCard label="Range" value={displayNum(stats.range)} />
                        <StatCard label="Sample Variance (s²)" value={displayNum(stats.variance)} colSpan={2} />
                        <StatCard label="Standard Deviation (s)" value={displayNum(stats.stdDev)} highlight colSpan={2} />
                        
                        <div className="col-span-2 md:col-span-4 bg-slate-50 dark:bg-slate-800 border rounded-xl p-4 mt-2">
                            <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Sorted Dataset:</span>
                            <div className="font-mono text-sm break-all text-slate-700 dark:text-slate-300">
                                {stats.sorted.join(", ")}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        Please enter some numbers to see statistics.
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}

function StatCard({ label, value, highlight = false, colSpan = 1 }: { label: string, value: string | number, highlight?: boolean, colSpan?: number }) {
    return (
        <div className={`border rounded-xl p-6 flex flex-col ${highlight ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800' : 'bg-white dark:bg-slate-900 shadow-sm'} ${colSpan === 2 ? 'col-span-2' : ''}`}>
            <span className="text-xs font-bold uppercase text-slate-500 mb-1">{label}</span>
            <span className={`text-2xl font-black tabular-nums truncate ${highlight ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-100'}`}>{value}</span>
        </div>
    );
}
