"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is an SIP?", questionHi: "SIP क्या है?", answer: "A Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds, benefiting from compounding and rupee-cost averaging over time.", answerHi: "एक सिस्टेमैटिक इन्वेस्टमेंट प्लान (SIP) आपको म्यूचुअल फंड में नियमित रूप से एक निश्चित राशि निवेश करने की अनुमति देता है, जिससे समय के साथ कंपाउंडिंग का लाभ मिलता है।" },
    { question: "How accurate is this calculator?", questionHi: "यह कैलकुलेटर कितना सटीक है?", answer: "It uses the standard compound interest formula (FV = P * [((1+r)^n - 1) / r] * (1+r)). Real-world returns will vary based on market conditions.", answerHi: "यह मानक चक्रवृद्धि ब्याज सूत्र का उपयोग करता है। वास्तविक दुनिया के रिटर्न बाजार की स्थितियों के आधार पर भिन्न होंगे।" },
    { question: "Is inflation considered?", questionHi: "क्या महंगाई को ध्यान में रखा गया है?", answer: "This basic calculator shows absolute returns. To account for inflation, you should mentally subtract the expected inflation rate from your expected return rate.", answerHi: "यह बुनियादी कैलकुलेटर पूर्ण रिटर्न दिखाता है। मुद्रास्फीति का हिसाब लगाने के लिए, आपको अपनी अपेक्षित रिटर्न दर से अपेक्षित मुद्रास्फीति दर को मानसिक रूप से घटाना चाहिए।" },
];

export default function SipCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Inputs
    const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
    const [expectedReturn, setExpectedReturn] = useState<number>(12);
    const [timePeriod, setTimePeriod] = useState<number>(10);

    // Outputs
    const [investedAmount, setInvestedAmount] = useState<number>(0);
    const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);

    useEffect(() => {
        // Handle invalid or empty inputs gracefully
        if (!monthlyInvestment || !expectedReturn || !timePeriod) {
            setInvestedAmount(0);
            setEstimatedReturns(0);
            setTotalValue(0);
            return;
        }

        const P = monthlyInvestment;
        const n = timePeriod * 12; // total number of months
        const r = expectedReturn / 12 / 100; // monthly rate of return

        // Future Value formula for SIP: FV = P × ({[1 + i]^n - 1} / i) × (1 + i).
        const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const totalInvested = P * n;
        const totalReturns = futureValue - totalInvested;

        setInvestedAmount(Math.round(totalInvested));
        setEstimatedReturns(Math.round(totalReturns));
        setTotalValue(Math.round(futureValue));
    }, [monthlyInvestment, expectedReturn, timePeriod]);

    // Format currency in Indian numbering system
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const getProgressBarStyle = () => {
        if (totalValue === 0) return { width: "0%" };
        const investedPercent = (investedAmount / totalValue) * 100;
        return { width: `${investedPercent}%` };
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📈 SIP कैलकुलेटर" : "📈 SIP Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपने म्यूचुअल फंड निवेश के भविष्य के मूल्य का अनुमान लगाएं" : "Estimate the future value of your mutual fund investments"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    
                    {/* Monthly Investment */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "मासिक निवेश (₹)" : "Monthly Investment (₹)"}
                            </label>
                            <input
                                type="number"
                                value={monthlyInvestment || ""}
                                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-24 text-right text-indigo-300 font-mono font-bold focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={monthlyInvestment}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>₹500</span>
                            <span>₹1,00,000</span>
                        </div>
                    </div>

                    {/* Expected Return */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "अपेक्षित रिटर्न दर (p.a)" : "Expected Return Rate (p.a)"}
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={expectedReturn || ""}
                                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20 text-right text-emerald-300 font-mono font-bold focus:border-emerald-500 outline-none"
                                />
                                <span className="text-slate-400 font-bold">%</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.5"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>1%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    {/* Time Period */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "समयावधि (वर्ष)" : "Time Period (Years)"}
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={timePeriod || ""}
                                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20 text-right text-purple-300 font-mono font-bold focus:border-purple-500 outline-none"
                                />
                                <span className="text-slate-400 font-medium">{isHi ? "वर्ष" : "Yr"}</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(Number(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>1 {isHi ? "वर्ष" : "Yr"}</span>
                            <span>40 {isHi ? "वर्ष" : "Yrs"}</span>
                        </div>
                    </div>

                </div>

                {/* Results Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    
                    <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center">
                        <h3 className="text-base font-semibold text-slate-400 uppercase tracking-wider mb-6 text-center">
                            {isHi ? "अनुमानित रिटर्न" : "Estimated Returns"}
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                                <span className="text-slate-300">{isHi ? "निवेश की गई राशि" : "Invested Amount"}</span>
                                <span className="text-xl font-mono text-slate-200">{formatCurrency(investedAmount)}</span>
                            </div>
                            
                            <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                                <span className="text-slate-300">{isHi ? "अनुमानित रिटर्न" : "Est. Returns"}</span>
                                <span className="text-xl font-mono text-emerald-400">{formatCurrency(estimatedReturns)}</span>
                            </div>

                            <div className="flex justify-between items-end pt-2">
                                <span className="text-lg font-bold text-slate-100">{isHi ? "कुल मूल्य" : "Total Value"}</span>
                                <span className="text-3xl font-mono font-bold text-indigo-400">{formatCurrency(totalValue)}</span>
                            </div>
                        </div>

                        {/* Visual Bar Chart */}
                        <div className="mt-8">
                            <div className="w-full h-4 rounded-full bg-emerald-500/20 overflow-hidden flex border border-slate-700/50">
                                <div 
                                    className="h-full bg-indigo-500 rounded-l-full transition-all duration-1000 ease-out"
                                    style={getProgressBarStyle()}
                                    title={isHi ? "निवेशित" : "Invested"}
                                ></div>
                                <div 
                                    className="h-full bg-emerald-400 flex-grow rounded-r-full transition-all duration-1000 ease-out"
                                    title={isHi ? "रिटर्न" : "Returns"}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs mt-2 px-1 font-medium">
                                <div className="flex items-center gap-1.5 text-indigo-300">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    {isHi ? "निवेशित" : "Invested"}
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    {isHi ? "रिटर्न" : "Returns"}
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-8 text-center px-4">
                            {isHi ? "अस्वीकरण: यह कैलकुलेटर केवल शैक्षिक उद्देश्यों के लिए है। बाजार जोखिम के अधीन रिटर्न की गारंटी नहीं है।" : "Disclaimer: This calculator is for educational purposes only. Mutual fund returns are subject to market risks."}
                        </p>
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/sip-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
