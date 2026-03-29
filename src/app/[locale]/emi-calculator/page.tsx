"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is an EMI?", questionHi: "ईएमआई (EMI) क्या है?", answer: "Equated Monthly Installment (EMI) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month.", answerHi: "समान मासिक किस्त (EMI) एक निश्चित भुगतान राशि है जो एक उधारकर्ता द्वारा ऋणदाता को प्रत्येक कैलेंडर माह की एक निर्दिष्ट तिथि पर की जाती है।" },
    { question: "How does the formula work?", questionHi: "यह फॉर्मूला कैसे काम करता है?", answer: "We use the standard formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is the number of months.", answerHi: "हम मानक सूत्र का उपयोग करते हैं: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]। जहाँ P मूलधन है, R मासिक ब्याज दर है, और N महीनों की संख्या है।" },
    { question: "Does it apply to Home Loans and Car Loans?", questionHi: "क्या यह होम लोन और कार लोन पर लागू होता है?", answer: "Yes! This standard reducing-balance EMI calculator works for Home Loans, Car Loans, Personal Loans, and Education Loans.", answerHi: "हाँ! यह मानक 'घटते मूलधन' वाला कैलकुलेटर होम लोन, कार लोन, पर्सनल लोन और एजुकेशन लोन के लिए एकदम सही काम करता है।" },
];

export default function EmiCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Inputs
    const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakhs Default
    const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
    const [loanTenure, setLoanTenure] = useState<number>(10); // 10 Years
    const [tenureType, setTenureType] = useState<"Yr" | "Mo">("Yr");

    // Outputs
    const [emi, setEmi] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayment, setTotalPayment] = useState<number>(0);

    useEffect(() => {
        if (!loanAmount || !interestRate || !loanTenure) {
            setEmi(0);
            setTotalInterest(0);
            setTotalPayment(0);
            return;
        }

        const p = loanAmount;
        const r = interestRate / 12 / 100; // Monthly interest rate
        const n = tenureType === "Yr" ? loanTenure * 12 : loanTenure; // Total months

        if (r === 0) {
            // Zero interest edge case
            setEmi(Math.round(p / n));
            setTotalInterest(0);
            setTotalPayment(p);
            return;
        }

        // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
        const factor = Math.pow(1 + r, n);
        const calculatedEmi = (p * r * factor) / (factor - 1);
        
        const totalPaymentCalculated = calculatedEmi * n;
        const totalInterestCalculated = totalPaymentCalculated - p;

        setEmi(Math.round(calculatedEmi));
        setTotalInterest(Math.round(totalInterestCalculated));
        setTotalPayment(Math.round(totalPaymentCalculated));

    }, [loanAmount, interestRate, loanTenure, tenureType]);

    // Format currency in Indian numbering system
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const getProgressBarStyle = () => {
        if (totalPayment === 0) return { width: "0%" };
        const pPercent = (loanAmount / totalPayment) * 100;
        return { width: `${100 - pPercent}%` }; // Left side is interest (Orangeish), right is principal (Indigo)
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🏦 EMI कैलकुलेटर" : "🏦 EMI Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "होम लोन, कार लोन या पर्सनल लोन के लिए समान मासिक किस्त की गणना करें" : "Calculate Equated Monthly Installment for Home, Car, or Personal Loans"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    
                    {/* Loan Amount */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "ऋण राशि (₹)" : "Loan Amount (₹)"}
                            </label>
                            <input
                                type="number"
                                value={loanAmount || ""}
                                onChange={(e) => setLoanAmount(Number(e.target.value))}
                                className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-28 text-right text-indigo-300 font-mono font-bold focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <input
                            type="range"
                            min="10000"
                            max="20000000" // 2 Crores max default
                            step="10000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>10K</span>
                            <span>2 {isHi ? "करोड़" : "Cr"}</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "ब्याज दर (वार्षिक)" : "Interest Rate (p.a)"}
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={interestRate || ""}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20 text-right text-orange-400 font-mono font-bold focus:border-orange-500 outline-none"
                                />
                                <span className="text-slate-400 font-bold">%</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                         <div className="flex justify-between text-xs text-slate-500">
                            <span>1%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "ऋण की अवधि" : "Loan Tenure"}
                            </label>
                            
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={loanTenure || ""}
                                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20 text-right text-emerald-300 font-mono font-bold focus:border-emerald-500 outline-none"
                                />
                                <div className="flex bg-slate-900 rounded p-1 border border-slate-600">
                                    <button 
                                        onClick={() => setTenureType("Yr")}
                                        className={`px-2 py-0.5 rounded text-xs transition-colors ${tenureType === "Yr" ? "bg-emerald-500/20 text-emerald-400 font-medium" : "text-slate-500 hover:text-slate-300"}`}
                                    >
                                        Yr
                                    </button>
                                    <button 
                                        onClick={() => setTenureType("Mo")}
                                        className={`px-2 py-0.5 rounded text-xs transition-colors ${tenureType === "Mo" ? "bg-emerald-500/20 text-emerald-400 font-medium" : "text-slate-500 hover:text-slate-300"}`}
                                    >
                                        Mo
                                    </button>
                                </div>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max={tenureType === "Yr" ? 40 : 480}
                            step="1"
                            value={loanTenure}
                            onChange={(e) => setLoanTenure(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                </div>

                {/* Results Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    
                    <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center">
                        
                        {/* Huge EMI Display */}
                        <div className="text-center mb-8 border-b border-slate-700/50 pb-8">
                            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">
                                {isHi ? "आपकी मासिक ईएमआई" : "Your Monthly EMI"}
                            </h3>
                            <div className="text-5xl sm:text-6xl font-mono font-black text-indigo-400 drop-shadow-lg">
                                {formatCurrency(emi)}
                            </div>
                        </div>

                        <div className="space-y-6 px-4">
                            <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    <span className="text-slate-300">{isHi ? "मूलधन राशि" : "Principal Amount"}</span>
                                </div>
                                <span className="text-xl font-mono text-slate-200">{formatCurrency(loanAmount)}</span>
                            </div>
                            
                            <div className="flex justify-between items-end border-b border-slate-700/50 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                    <span className="text-slate-300">{isHi ? "कुल ब्याज" : "Total Interest"}</span>
                                </div>
                                <span className="text-xl font-mono text-orange-400">{formatCurrency(totalInterest)}</span>
                            </div>

                            <div className="flex justify-between items-end pt-2">
                                <span className="text-lg font-bold text-slate-100">{isHi ? "कुल भुगतान" : "Total Payment"} <span className="text-xs font-normal text-slate-500 block sm:inline">{isHi ? "(मूलधन + ब्याज)" : "(Principal + Interest)"}</span></span>
                                <span className="text-2xl font-mono font-bold text-emerald-400">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>

                        {/* Visual Breakdown Bar */}
                        <div className="mt-8 px-4">
                            <div className="w-full h-3 rounded-full bg-indigo-900/50 overflow-hidden flex border border-slate-700/50">
                                <div 
                                    className="h-full bg-indigo-500 rounded-l-full transition-all duration-1000 ease-out flex-grow"
                                    title={isHi ? "मूलधन" : "Principal"}
                                ></div>
                                <div 
                                    className="h-full bg-orange-400 rounded-r-full transition-all duration-1000 ease-out"
                                    style={getProgressBarStyle()}
                                    title={isHi ? "ब्याज" : "Interest"}
                                ></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/emi-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
