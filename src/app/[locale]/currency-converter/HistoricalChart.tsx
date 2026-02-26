"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface HistoricalChartProps {
    fromCurrency: string;
    toCurrency: string;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ fromCurrency, toCurrency }) => {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fromCurrency === toCurrency) {
            setData([]);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            // Calculate dates: Start date = 30 days ago
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 30);

            const endDateStr = end.toISOString().split('T')[0];
            const startDateStr = start.toISOString().split('T')[0];

            try {
                // API requires start_date..end_date format
                const res = await fetch(`https://api.frankfurter.app/${startDateStr}..${endDateStr}?from=${fromCurrency}&to=${toCurrency}`);
                if (!res.ok) throw new Error("Failed to fetch history");

                const result = await res.json();

                if (result.rates) {
                    const chartData = Object.entries(result.rates).map(([date, rates]: [string, any]) => ({
                        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        rate: rates[toCurrency],
                        originalDate: date // keep for sorting if needed
                    }));
                    setData(chartData);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                setError("Could not load historical data.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [fromCurrency, toCurrency]);

    if (fromCurrency === toCurrency) return null;

    return (
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700/50 w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-300">
                    {isHi ? "30 दिन का ट्रेंड" : "30 Day Trend"} <span className="text-slate-500 text-sm font-normal">({fromCurrency} to {toCurrency})</span>
                </h3>
            </div>

            {loading ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500 animate-pulse bg-slate-900/20 rounded-lg">
                    {isHi ? "चार्ट डेटा लोड हो रहा है..." : "Loading chart data..."}
                </div>
            ) : error ? (
                <div className="h-[300px] flex items-center justify-center text-red-400 bg-slate-900/20 rounded-lg">
                    {isHi ? "ऐतिहासिक डेटा लोड नहीं हो सका।" : "Could not load historical data."}
                </div>
            ) : (
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                tick={{ fontSize: 11 }}
                                tickMargin={10}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#64748b"
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value) => value.toFixed(2)}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    borderColor: '#334155',
                                    color: '#f8fafc',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: '#818cf8' }}
                                labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem' }}
                                formatter={(value: number | undefined) => [value?.toFixed(4) ?? 'N/A', 'Rate']}
                            />
                            <Area
                                type="monotone"
                                dataKey="rate"
                                stroke="#818cf8"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRate)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default HistoricalChart;
