"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is GST?", questionHi: "GST क्या है?", answer: "Goods and Services Tax (GST) is an indirect comprehensive tax levied on the supply of goods and services. In India, it is divided into CGST (Central), SGST (State), and IGST (Integrated).", answerHi: "माल और सेवा कर (GST) वस्तुओं और सेवाओं की आपूर्ति पर लगाया जाने वाला एक अप्रत्यक्ष व्यापक कर है। भारत में, इसे CGST (केंद्रीय), SGST (राज्य), और IGST (एकीकृत) में विभाजित किया गया है।" },
    { question: "How is 'Add GST' calculated?", questionHi: "'Add GST' की गणना कैसे की जाती है?", answer: "To add GST to a base amount: GST Amount = (Base Amount × Rate) / 100. Total = Base Amount + GST Amount.", answerHi: "मूल राशि में GST जोड़ने के लिए: GST राशि = (मूल राशि × दर) / 100। कुल = मूल राशि + GST राशि।" },
    { question: "How is 'Remove GST' calculated?", questionHi: "'Remove GST' की गणना कैसे की जाती है?", answer: "To find the base amount from a GST-inclusive price: Base Amount = Total Price / (1 + Rate/100).", answerHi: "GST-समावेशी मूल्य से मूल राशि ज्ञात करने के लिए: मूल राशि = कुल मूल्य / (1 + दर/100)।" },
];

export default function GstCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [mode, setMode] = useState<"add" | "remove">("add");
    const [amount, setAmount] = useState<number>(1000);
    const [rate, setRate] = useState<number>(18);
    
    // Outputs
    const [baseAmount, setBaseAmount] = useState<number>(0);
    const [gstAmount, setGstAmount] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const commonRates = [5, 12, 18, 28];

    useEffect(() => {
        if (!amount || amount < 0 || rate < 0) {
            setBaseAmount(0);
            setGstAmount(0);
            setTotalAmount(0);
            return;
        }

        if (mode === "add") {
            // Amount is the Base, we need to find GST and Total
            const calcGst = (amount * rate) / 100;
            const calcTotal = amount + calcGst;
            
            setBaseAmount(amount);
            setGstAmount(calcGst);
            setTotalAmount(calcTotal);
        } else {
            // Amount is the Total, we need to extract Base and GST
            const calcBase = amount / (1 + (rate / 100));
            const calcGst = amount - calcBase;
            
            setBaseAmount(calcBase);
            setGstAmount(calcGst);
            setTotalAmount(amount);
        }
    }, [amount, rate, mode]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🧾 GST कैलकुलेटर" : "🧾 GST Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "भारतीय दरों के साथ आसानी से GST जोड़ें या निकालें" : "Easily Add or Remove GST with standard Indian tax rates"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full md:w-5/12 flex flex-col gap-6">
                    
                    {/* Mode Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => setMode("add")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${mode === "add" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "+ GST जोड़ें (Exclusive)" : "+ Add GST (Exclusive)"}
                        </button>
                        <button
                            onClick={() => setMode("remove")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${mode === "remove" ? "bg-emerald-500 text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "- GST निकालें (Inclusive)" : "- Remove GST (Inclusive)"}
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                            {mode === "add" ? (isHi ? "मूल राशि (Base Amount) ₹" : "Base Amount (₹)") : (isHi ? "कुल राशि (Total Amount) ₹" : "Total Amount (₹)")}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input
                                type="number"
                                min="0"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded-xl py-4 pl-10 pr-4 text-xl font-mono text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* GST Rate Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                            {isHi ? "GST दर (%)" : "GST Rate (%)"}
                        </label>
                        
                        <div className="grid grid-cols-4 gap-2">
                            {commonRates.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRate(r)}
                                    className={`py-2 rounded-lg font-mono font-bold transition-all border ${rate === r ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-400'}`}
                                >
                                    {r}%
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                            <label className="text-sm text-slate-400 whitespace-nowrap">{isHi ? "कस्टम दर:" : "Custom Rate:"}</label>
                            <div className="relative w-full">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={rate || ""}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-right text-indigo-300 font-mono focus:border-indigo-500 outline-none pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Results Panel */}
                <div className="w-full md:w-7/12 flex flex-col">
                    
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center">
                        
                        <div className="space-y-8">
                            
                            {/* Base Amount Row */}
                            <div className="flex justify-between items-center opacity-80">
                                <div className="text-sm font-medium text-slate-400">
                                    {isHi ? "खरीद मूल्य (Basis)" : "Base Amount"}
                                </div>
                                <div className="text-xl font-mono text-slate-300">
                                    {formatCurrency(baseAmount)}
                                </div>
                            </div>

                            {/* GST Breakdown Box */}
                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 relative">
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 font-bold z-10 flex-shrink-0">
                                    +
                                </div>
                                
                                <div className="flex justify-between items-start mb-4 pl-4">
                                    <div>
                                        <div className="text-sm text-indigo-400 font-medium">{isHi ? "कुल GST" : "Total GST"} <span className="text-xs opacity-70">({rate}%)</span></div>
                                    </div>
                                    <div className="text-xl font-mono text-indigo-400 font-bold">
                                        {formatCurrency(gstAmount)}
                                    </div>
                                </div>

                                <div className="flex justify-between text-xs text-slate-500 pl-4 border-t border-slate-800 pt-3">
                                    <div>CGST ({rate / 2}%): <span className="font-mono text-slate-400">{formatCurrency(gstAmount / 2)}</span></div>
                                    <div>SGST ({rate / 2}%): <span className="font-mono text-slate-400">{formatCurrency(gstAmount / 2)}</span></div>
                                </div>
                            </div>

                            {/* Total Amount Row */}
                            <div className="flex justify-between items-center pt-4 border-t-2 border-slate-700">
                                <div className="text-lg font-bold text-slate-200">
                                    {isHi ? "कुल भुगतान" : "Total Amount"}
                                </div>
                                <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 drop-shadow-md">
                                    {formatCurrency(totalAmount)}
                                </div>
                            </div>

                        </div>
                        
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/gst-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
