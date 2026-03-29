"use client";

import React, { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function GraphingCalculatorTool() {
    const [equation, setEquation] = useState("Math.sin(x) * x");
    const [xMin, setXMin] = useState(-10);
    const [xMax, setXMax] = useState(10);
    const [step, setStep] = useState(0.5);
    const [error, setError] = useState("");

    const data = useMemo(() => {
        setError("");
        const points = [];
        try {
            // Very basic evaluator wrapper for graphing.
            // Using Function constructor strictly for math parsing inside the browser sandbox.
            // Allows using Math.sin(x), x*x, etc. Replacing ^ with ** for convenience.
            const parsedEq = equation.replace(/\^/g, "**");
            // Validate: only allow Math functions, numbers, x, operators, parens
            const stripped = parsedEq.replace(/Math\.\w+/g, 'F');
            if (!/^[\d\s+\-*/.()xF]+$/.test(stripped)) {
                throw new Error("Invalid equation");
            }
            const func = new Function("x", `"use strict"; return (${parsedEq});`);
            
            for (let x = xMin; x <= xMax; x += step) {
                const y = func(x);
                if (isFinite(y)) {
                    points.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
                }
            }
        } catch (err: any) {
            setError("Invalid equation syntax. Use JS Math expressions (e.g., Math.sin(x), Math.pow(x, 2), x * x)");
        }
        return points;
    }, [equation, xMin, xMax, step]);

    // Presets
    const setPreset = (eq: string) => {
        setEquation(eq);
    };

    return (
        <ToolLayout title="Online Graphing Calculator" description="Visualize mathematical functions instantly on a dynamic line chart.">
            <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8">
                
                <div className="md:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm">
                        <label className="text-xl font-bold flex items-center mb-4">
                            <span className="text-indigo-500 italic mr-2 mr-2">f(x) =</span>
                        </label>
                        <input 
                            type="text" 
                            value={equation} 
                            onChange={(e) => setEquation(e.target.value)} 
                            className="w-full text-lg font-mono p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800"
                            placeholder="x * x"
                        />
                        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t dark:border-slate-800">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">X Min</label>
                                <input type="number" value={xMin} onChange={(e) => setXMin(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase">X Max</label>
                                <input type="number" value={xMax} onChange={(e) => setXMax(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Resolution (Step)</label>
                                <input type="number" step="0.1" value={step} onChange={(e) => setStep(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border">
                        <h4 className="font-bold text-sm mb-3">Example Functions</h4>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setPreset("x * x")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">x²</button>
                            <button onClick={() => setPreset("Math.sin(x)")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">sin(x)</button>
                            <button onClick={() => setPreset("Math.cos(x) * x")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">x * cos(x)</button>
                            <button onClick={() => setPreset("1 / x")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">1 / x</button>
                            <button onClick={() => setPreset("Math.tan(x)")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">tan(x)</button>
                            <button onClick={() => setPreset("Math.sqrt(Math.abs(x))")} className="px-3 py-1 bg-white border border-slate-200 rounded text-sm font-mono shadow-sm">√|x|</button>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8 bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-xl h-[600px] flex items-center justify-center relative">
                    {!error && data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} tick={{fill: '#64748b'}} />
                                <YAxis domain={['auto', 'auto']} tick={{fill: '#64748b'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [value, "f(x)"]}
                                    labelFormatter={(label: any) => `x = ${label}`}
                                />
                                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
                                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={2} />
                                <Line 
                                    type="monotone" 
                                    dataKey="y" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3} 
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-slate-400 font-medium">Invalid or empty data</div>
                    )}
                </div>

            </div>
        </ToolLayout>
    );
}
