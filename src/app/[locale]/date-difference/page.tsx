"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How are business days calculated?", questionHi: "व्यावसायिक दिनों की गणना कैसे की जाती है?", answer: "Business days exclude Saturdays and Sundays. They do not automatically account for public holidays as these vary wildly by country and region.", answerHi: "व्यावसायिक दिनों में शनिवार और रविवार शामिल नहीं होते हैं। वे स्वचालित रूप से सार्वजनिक छुट्टियों का हिसाब नहीं रखते क्योंकि वे देश और क्षेत्र के अनुसार बेतहाशा भिन्न होते हैं।" },
    { question: "Does this handle leap years?", questionHi: "क्या यह लीप वर्ष को संभालता है?", answer: "Yes! The underlying JavaScript Date engine correctly accounts for leap years when calculating the exact day gap between dates.", answerHi: "हाँ! तिथियों के बीच सटीक दिन के अंतर की गणना करते समय अंतर्निहित जावास्क्रिप्ट दिनांक इंजन लीप वर्षों का सही ढंग से हिसाब रखता है।" },
    { question: "Can I enter dates in the past?", questionHi: "क्या मैं अतीत की तिथियां दर्ज कर सकता हूँ?", answer: "Absolutely. You can calculate the difference between any two dates, whether they are in the past, present, or future.", answerHi: "बिल्कुल। आप किन्हीं भी दो तिथियों के बीच के अंतर की गणना कर सकते हैं, चाहे वे अतीत, वर्तमान या भविष्य में हों।" },
];

export default function DateDifferencePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Initialize to today and tomorrow
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    });
    
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 16);
    });

    const [diff, setDiff] = useState<{
        years: number;
        months: number;
        weeks: number;
        days: number;
        hours: number;
        minutes: number;
        totalDays: number;
        businessDays: number;
    } | null>(null);

    useEffect(() => {
        if (!startDate || !endDate) {
            setDiff(null);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            setDiff(null);
            return;
        }

        const timeDiff = end.getTime() - start.getTime();
        const absoluteTimeDiff = Math.abs(timeDiff);
        
        // Totals
        const totalMinutes = Math.floor(absoluteTimeDiff / (1000 * 60));
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Component breakdown logic
        // For accurate Y/M/D we construct intermediate dates
        const earlierDate = new Date(Math.min(start.getTime(), end.getTime()));
        const laterDate = new Date(Math.max(start.getTime(), end.getTime()));

        let years = laterDate.getFullYear() - earlierDate.getFullYear();
        let months = laterDate.getMonth() - earlierDate.getMonth();
        let daysDateObj = laterDate.getDate() - earlierDate.getDate();

        if (daysDateObj < 0) {
            months--;
            // get days in previous month
            const prevMonth = new Date(laterDate.getFullYear(), laterDate.getMonth(), 0);
            daysDateObj += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        const remainingHours = laterDate.getHours() - earlierDate.getHours();
        let adjustedHours = remainingHours;
        let adjustedDays = daysDateObj;
        
        if (remainingHours < 0) {
            adjustedDays--;
            adjustedHours += 24;
            // Handle day rolling under 0
            if (adjustedDays < 0) {
                months--;
                const prevMonth = new Date(laterDate.getFullYear(), laterDate.getMonth(), 0);
                adjustedDays += prevMonth.getDate();
                if (months < 0) {
                    years--;
                    months += 12;
                }
            }
        }

        const remainingMinutes = laterDate.getMinutes() - earlierDate.getMinutes();
        let finalMinutes = remainingMinutes;
        
        if (remainingMinutes < 0) {
            adjustedHours--;
            finalMinutes += 60;
            if (adjustedHours < 0) {
                adjustedDays--;
                adjustedHours += 24;
                if (adjustedDays < 0) {
                    months--;
                    const prevMonth = new Date(laterDate.getFullYear(), laterDate.getMonth(), 0);
                    adjustedDays += prevMonth.getDate();
                    if (months < 0) {
                        years--;
                        months += 12;
                    }
                }
            }
        }

        const weeks = Math.floor(adjustedDays / 7);
        const days = adjustedDays % 7;

        // Calculate Business Days
        let businessDaysCounter = 0;
        const current = new Date(earlierDate);
        current.setHours(0,0,0,0);
        const loopEnd = new Date(laterDate);
        loopEnd.setHours(0,0,0,0);

        while (current < loopEnd) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDaysCounter++;
            }
            current.setDate(current.getDate() + 1);
        }

        setDiff({
            years,
            months,
            weeks,
            days,
            hours: adjustedHours,
            minutes: finalMinutes,
            totalDays,
            businessDays: businessDaysCounter
        });

    }, [startDate, endDate]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📅 दिनांक अंतर कैलकुलेटर" : "📅 Date Difference Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "व्यावसायिक दिनों सहित दो तिथियों के बीच सटीक अंतर की गणना करें" : "Calculate the exact difference between two dates, including business days"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="glass-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                    
                    <div className="flex-1 relative z-10">
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {isHi ? "आरंभिक तिथि" : "Start Date"}
                        </label>
                        <input 
                            type="datetime-local" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-colors text-lg"
                        />
                    </div>

                    <div className="flex items-center justify-center shrink-0 text-slate-500 hidden md:flex z-10">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>

                    <div className="flex-1 relative z-10">
                        <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            {isHi ? "अंतिम तिथि" : "End Date"}
                        </label>
                        <input 
                            type="datetime-local" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-colors text-lg"
                        />
                    </div>
                </div>

                {/* Results Area */}
                {diff ? (
                    <div className="space-y-6 animate-fade-in">
                        
                        {/* Summary Narrative */}
                        <div className="glass-card p-8 bg-gradient-to-br from-indigo-900/40 to-slate-900 border-indigo-500/30 text-center">
                            <h2 className="text-xl sm:text-2xl font-light text-slate-300 mb-2">
                                {isHi ? "इन तिथियों के बीच का अंतर है:" : "The exact duration between these dates is:"}
                            </h2>
                            <p className="text-3xl sm:text-4xl font-black text-white leading-tight">
                                {diff.years > 0 && <span className="text-indigo-400">{diff.years} {isHi ? "साल" : "years"} </span>}
                                {(diff.months > 0 || diff.years > 0) && <span className="text-blue-400">{diff.months} {isHi ? "महीने" : "months"} </span>}
                                {diff.weeks > 0 && <span className="text-emerald-400">{diff.weeks} {isHi ? "हफ़्ते" : "weeks"} </span>}
                                {(diff.days > 0 || diff.weeks > 0) && <span className="text-teal-400">{diff.days} {isHi ? "दिन" : "days"} </span>}
                                
                                {diff.hours > 0 && <span className="text-purple-400 text-2xl sm:text-3xl"><br/>{diff.hours} {isHi ? "घंटे" : "hours"} </span>}
                                {diff.minutes > 0 && <span className="text-pink-400 text-2xl sm:text-3xl">{diff.minutes} {isHi ? "मिनट" : "minutes"} </span>}
                                
                                {diff.years === 0 && diff.months === 0 && diff.weeks === 0 && diff.days === 0 && diff.hours === 0 && diff.minutes === 0 && (
                                    <span className="text-slate-400">{isHi ? "कोई अंतर नहीं (एक ही समय)" : "Identical date and time"}</span>
                                )}
                            </p>
                        </div>

                        {/* Alternate Views Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-card p-5 text-center flex flex-col justify-center">
                                <span className="text-4xl mb-2">🗓️</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{isHi ? "कुल दिन" : "Total Days"}</h3>
                                <p className="text-2xl font-bold text-white mt-1 tabular-nums">
                                    {diff.totalDays.toLocaleString()}
                                </p>
                            </div>
                            
                            <div className="glass-card p-5 text-center flex flex-col justify-center border-emerald-500/20 bg-emerald-900/10">
                                <span className="text-4xl mb-2">💼</span>
                                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{isHi ? "व्यावसायिक दिन" : "Business Days"}</h3>
                                <p className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                                    {diff.businessDays.toLocaleString()}
                                </p>
                                <p className="text-xs text-emerald-500/70 mt-1">{isHi ? "(सोमवार-शुक्रवार)" : "(Mon-Fri excluding weekends)"}</p>
                            </div>

                            <div className="glass-card p-5 text-center flex flex-col justify-center">
                                <span className="text-4xl mb-2">🕒</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{isHi ? "कुल घंटे" : "Total Hours"}</h3>
                                <p className="text-2xl font-bold text-white mt-1 tabular-nums">
                                    {(diff.totalDays * 24 + diff.hours).toLocaleString()}
                                </p>
                            </div>

                            <div className="glass-card p-5 text-center flex flex-col justify-center">
                                <span className="text-4xl mb-2">⏱️</span>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{isHi ? "कुल मिनट" : "Total Minutes"}</h3>
                                <p className="text-2xl font-bold text-white mt-1 tabular-nums">
                                    {((diff.totalDays * 24 + diff.hours) * 60 + diff.minutes).toLocaleString()}
                                </p>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-2 border-slate-700/50">
                        <div className="text-5xl mb-4 opacity-50">🧭</div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">{isHi ? "अमान्य दिनांक" : "Invalid Dates"}</h3>
                        <p className="text-slate-500">{isHi ? "गणना देखने के लिए कृपया एक वैध आरंभ और समाप्ति तिथि चुनें।" : "Please select a valid start and end date to see the calculation."}</p>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/date-difference" tools={ALL_TOOLS} />
        </div>
    );
}
