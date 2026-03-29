"use client";

import React, { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

export default function CompoundInterestTool() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(7);
    const [years, setYears] = useState(10);
    const [contribution, setContribution] = useState(500);
    const [frequency, setFrequency] = useState(12); // compounded times per year

    const result = useMemo(() => {
        let currentBalance = principal;
        const totalPrincipal = principal + (contribution * frequency * years);
        
        // A simple loop for calculating year by year easily including contributions
        const yearlyData = [];
        let r = rate / 100 / frequency;
        
        for (let y = 1; y <= years; y++) {
            for (let m = 0; m < frequency; m++) {
                currentBalance = (currentBalance + contribution) * (1 + r);
            }
            yearlyData.push({
                year: y,
                balance: currentBalance,
                invested: principal + (contribution * frequency * y)
            });
        }
        
        return {
            finalBalance: currentBalance,
            totalInvested: totalPrincipal,
            totalInterest: currentBalance - totalPrincipal,
            yearlyData
        };
    }, [principal, rate, years, contribution, frequency]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <ToolLayout title="Compound Interest Calculator" description="Visualize the magic of compounding over time with regular contributions.">
            <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8">
                
                {/* Inputs */}
                <div className="md:col-span-4 bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm space-y-4 h-fit">
                    <h3 className="font-bold text-lg border-b pb-2 mb-4 dark:border-slate-800">Investment Details</h3>
                    
                    <div>
                        <label className="text-sm font-semibold flex justify-between">
                            <span>Initial Investment</span> <span>{formatCurrency(principal)}</span>
                        </label>
                        <input type="range" min="0" max="1000000" step="1000" value={principal} onChange={e => setPrincipal(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex justify-between">
                            <span>Regular Contribution</span> <span>{formatCurrency(contribution)}/period</span>
                        </label>
                        <input type="range" min="0" max="10000" step="50" value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex justify-between">
                            <span>Annual Interest Rate</span> <span>{rate}%</span>
                        </label>
                        <input type="range" min="0" max="30" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex justify-between">
                            <span>Years to Grow</span> <span>{years} years</span>
                        </label>
                        <input type="range" min="1" max="50" step="1" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div>
                        <label className="text-sm font-semibold block mb-1">Compound Frequency</label>
                        <select value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="w-full p-2 border rounded-lg dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value={1}>Annually</option>
                            <option value={12}>Monthly</option>
                            <option value={365}>Daily</option>
                        </select>
                    </div>
                </div>

                {/* Outputs */}
                <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 relative overflow-hidden">
                            <span className="text-emerald-800 dark:text-emerald-400 font-semibold text-sm">Future Balance</span>
                            <div className="text-3xl font-bold mt-2 text-emerald-900 dark:text-emerald-100">{formatCurrency(result.finalBalance)}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-2xl p-6 text-center">
                            <span className="text-slate-500 text-sm font-semibold uppercase">Total Invested</span>
                            <div className="text-2xl font-bold mt-1">{formatCurrency(result.totalInvested)}</div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-6 text-center col-span-2 md:col-span-1">
                            <span className="text-indigo-500 font-semibold text-sm uppercase">Total Interest</span>
                            <div className="text-2xl font-bold mt-1 text-indigo-700 dark:text-indigo-300">+{formatCurrency(result.totalInterest)}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Year</th>
                                    <th className="px-4 py-3">Invested Principal</th>
                                    <th className="px-4 py-3">Accumulated Interest</th>
                                    <th className="px-4 py-3 rounded-r-lg">Total Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.yearlyData.map(d => (
                                    <tr key={d.year} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium">Year {d.year}</td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatCurrency(d.invested)}</td>
                                        <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400 font-medium">+{formatCurrency(d.balance - d.invested)}</td>
                                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(d.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
