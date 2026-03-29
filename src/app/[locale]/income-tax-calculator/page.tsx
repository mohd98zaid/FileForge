"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is the New Tax Regime?", questionHi: "नई कर व्यवस्था क्या है?", answer: "The New Tax Regime (default from FY 2023-24) offers lower tax rates but removes most exemptions like HRA, LTA, and Section 80C. It includes a standard deduction of ₹50,000 for salaried individuals.", answerHi: "नई कर व्यवस्था (FY 2023-24 से डिफ़ॉल्ट) कम कर दरों की पेशकश करती है लेकिन एचआरए (HRA), एलटीए (LTA) और धारा 80C जैसी अधिकांश छूटों को हटा देती है। इसमें वेतनभोगी व्यक्तियों के लिए ₹50,000 की मानक कटौती शामिल है।" },
    { question: "What is the Old Tax Regime?", questionHi: "पुरानी कर व्यवस्था क्या है?", answer: "The Old Tax Regime has higher tax slab rates but allows you to claim various exemptions and deductions (like 80C up to ₹1.5 Lakh, 80D, HRA, etc.) to reduce your taxable income.", answerHi: "पुरानी कर व्यवस्था में कर स्लैब की दरें अधिक हैं लेकिन आपको अपनी कर योग्य आय को कम करने के लिए विभिन्न छूट और कटौती (जैसे 80C ₹1.5 लाख तक, 80D, HRA आदि) का दावा करने की अनुमति मिलती है।" },
    { question: "Is Health & Education Cess included?", questionHi: "क्या स्वास्थ्य और शिक्षा उपकर (Cess) शामिल है?", answer: "Yes, a 4% Health and Education Cess is calculated on the total income tax amount and added to your final tax liability.", answerHi: "हाँ, कुल आयकर राशि पर 4% स्वास्थ्य और शिक्षा उपकर की गणना की जाती है और आपकी अंतिम कर देयता में जोड़ा जाता है।" },
];

export default function IncomeTaxCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [regime, setRegime] = useState<"new" | "old">("new");
    
    // Income
    const [salary, setSalary] = useState<number>(1200000); // 12 Lakhs default
    const [otherIncome, setOtherIncome] = useState<number>(0);
    
    // Deductions (Old Regime Mostly)
    const [deduction80c, setDeduction80c] = useState<number>(150000); // Max 1.5L
    const [deduction80d, setDeduction80d] = useState<number>(25000);
    const [hraExemption, setHraExemption] = useState<number>(0);
    
    // Results
    const [grossIncome, setGrossIncome] = useState<number>(0);
    const [totalDeductions, setTotalDeductions] = useState<number>(0);
    const [taxableIncome, setTaxableIncome] = useState<number>(0);
    const [baseTax, setBaseTax] = useState<number>(0);
    const [cess, setCess] = useState<number>(0);
    const [totalTax, setTotalTax] = useState<number>(0);
    const [effectiveRate, setEffectiveRate] = useState<number>(0);

    const standardDeduction = 50000; // Applicable in both regimes for salaried individuals

    useEffect(() => {
        const gross = (salary || 0) + (otherIncome || 0);
        setGrossIncome(gross);
        
        let deductionsToApply = 0;
        let taxable = gross;

        if (regime === "new") {
            // New Regime (FY 2023-24 onwards)
            // Allows 50k standard deduction, no 80C/80D/HRA
            deductionsToApply = standardDeduction;
            if (salary === 0) deductionsToApply = 0; // standard deduction is only against salary/pension
            
            taxable = Math.max(0, gross - deductionsToApply);
            setTotalDeductions(deductionsToApply);
            setTaxableIncome(taxable);

            // New Regime Slabs (Simplified approximation for general bounds):
            // 0 - 3L: Nil
            // 3L - 6L: 5%
            // 6L - 9L: 10%
            // 9L - 12L: 15%
            // 12L - 15L: 20%
            // > 15L: 30%
            // Rebate under 87A up to 7L taxable income

            if (taxable <= 700000) {
                setBaseTax(0);
            } else {
                let tax = 0;
                if (taxable > 1500000) {
                    tax += (taxable - 1500000) * 0.30;
                    taxable = 1500000;
                }
                if (taxable > 1200000) {
                    tax += (taxable - 1200000) * 0.20;
                    taxable = 1200000;
                }
                if (taxable > 900000) {
                    tax += (taxable - 900000) * 0.15;
                    taxable = 900000;
                }
                if (taxable > 600000) {
                    tax += (taxable - 600000) * 0.10;
                    taxable = 600000;
                }
                if (taxable > 300000) {
                    tax += (taxable - 300000) * 0.05;
                }
                setBaseTax(tax);
            }

        } else {
            // Old Regime
            // Allows 50k std deduction + 80C + 80D + HRA
            const capped80c = Math.min((deduction80c || 0), 150000);
            const stdDedActual = salary > 0 ? standardDeduction : 0;
            
            deductionsToApply = stdDedActual + capped80c + (deduction80d || 0) + (hraExemption || 0);
            taxable = Math.max(0, gross - deductionsToApply);
            setTotalDeductions(deductionsToApply);
            setTaxableIncome(taxable);

            // Old Regime Slabs (Simplified < 60 yrs):
            // 0 - 2.5L: Nil
            // 2.5L - 5L: 5%
            // 5L - 10L: 20%
            // > 10L: 30%
            // Rebate under 87A up to 5L taxable income

            if (taxable <= 500000) {
                setBaseTax(0);
            } else {
                let tax = 0;
                if (taxable > 1000000) {
                    tax += (taxable - 1000000) * 0.30;
                    taxable = 1000000;
                }
                if (taxable > 500000) {
                    tax += (taxable - 500000) * 0.20;
                    taxable = 500000;
                }
                if (taxable > 250000) {
                    tax += (taxable - 250000) * 0.05;
                }
                setBaseTax(tax);
            }
        }

    }, [salary, otherIncome, deduction80c, deduction80d, hraExemption, regime]);

    // Calculate Cess and Final Tax after baseTax updates
    useEffect(() => {
        // 4% Health & Education Cess
        const calculatedCess = baseTax * 0.04;
        const finalTax = baseTax + calculatedCess;
        
        setCess(calculatedCess);
        setTotalTax(finalTax);

        if (grossIncome > 0) {
            setEffectiveRate((finalTax / grossIncome) * 100);
        } else {
            setEffectiveRate(0);
        }
    }, [baseTax, grossIncome]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🇮🇳 आयकर कैलकुलेटर" : "🇮🇳 Income Tax Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "भारत के लिए अनुमानित कर (Old vs New Regime) की गणना करें" : "Estimate your Indian income tax liability (Old vs New Regime)"}</p>
                <div className="mt-3 bg-amber-500/10 text-amber-400/80 text-xs py-1 px-3 rounded-full inline-block border border-amber-500/20">
                    {isHi ? "वित्तीय वर्ष 2023-24/2024-25 के अनुमान" : "FY 2023-24 / 2024-25 Estimates"}
                </div>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    
                    {/* Regime Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => setRegime("new")}
                            className={`flex-[1.5] py-3 text-sm font-semibold rounded-md transition-all ${regime === "new" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "नई कर व्यवस्था (डिफ़ॉल्ट)" : "New Tax Regime (Default)"}
                        </button>
                        <button
                            onClick={() => setRegime("old")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${regime === "old" ? "bg-slate-700 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "पुरानी कर व्यवस्था" : "Old Tax Regime"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{isHi ? "आय विवरण" : "Income Details"}</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">{isHi ? "वार्षिक वेतन (Annual Salary)" : "Annual Salary"}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={salary || ""}
                                        onChange={(e) => setSalary(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-slate-200 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">{isHi ? "अन्य आय (Other Income)" : "Other Income (Interest, etc.)"}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={otherIncome || ""}
                                        onChange={(e) => setOtherIncome(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-slate-200 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`space-y-4 transition-opacity duration-300 ${regime === "new" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{isHi ? "कटौती और छूट" : "Deductions & Exemptions"}</h3>
                            {regime === "new" && <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded">{isHi ? "नई व्यवस्था में लागू नहीं" : "N/A in New Regime"}</span>}
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Sec 80C (EPF, PPF, LIC, ELSS - Max 1.5L)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="150000"
                                        value={deduction80c || ""}
                                        onChange={(e) => setDeduction80c(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-slate-200 focus:border-indigo-500 outline-none disabled:bg-slate-800 disabled:text-slate-500"
                                        disabled={regime === "new"}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 mb-1 block">Sec 80D (Health Ins.)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={deduction80d || ""}
                                            onChange={(e) => setDeduction80d(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-slate-200 focus:border-indigo-500 outline-none disabled:bg-slate-800 disabled:text-slate-500"
                                            disabled={regime === "new"}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 mb-1 block">HRA Exemption</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={hraExemption || ""}
                                            onChange={(e) => setHraExemption(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-slate-200 focus:border-indigo-500 outline-none disabled:bg-slate-800 disabled:text-slate-500"
                                            disabled={regime === "new"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Results Panel */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex-grow flex flex-col relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>

                        <div className="space-y-4 mb-6 relative z-10">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                                <span className="text-slate-400 text-sm">{isHi ? "सकल आय" : "Gross Income"}</span>
                                <span className="font-mono text-slate-200">{formatCurrency(grossIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                                <span className="text-slate-400 text-sm">{isHi ? "कुल कटौती" : "Total Deductions"} <span className="text-[10px] text-slate-500 ml-1">(incl. ₹50k Std. Ded)</span></span>
                                <span className="font-mono text-emerald-400">-{formatCurrency(totalDeductions)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-slate-200 font-semibold">{isHi ? "कर योग्य आय" : "Taxable Income"}</span>
                                <span className="text-xl font-mono text-indigo-300 font-bold">{formatCurrency(taxableIncome)}</span>
                            </div>
                        </div>

                        <div className="mt-4 p-5 rounded-xl bg-slate-950/50 border border-slate-700/50 relative z-10 flex-grow flex flex-col justify-end">
                            
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-slate-500 text-sm">{isHi ? "मूल आयकर" : "Base Tax"}</span>
                                <span className="font-mono text-slate-400">{formatCurrency(baseTax)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                                <span className="text-slate-500 text-sm">{isHi ? "स्वास्थ्य और शिक्षा उपकर (4%)" : "Health & Ed. Cess (4%)"}</span>
                                <span className="font-mono text-slate-400">+{formatCurrency(cess)}</span>
                            </div>

                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">{isHi ? "कुल देय कर" : "Total Tax Payable"}</div>
                                    {totalTax === 0 && (
                                        <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded inline-block border border-emerald-500/20">{isHi ? "कर छूट के तहत 87A" : "Rebate u/s 87A"}</div>
                                    )}
                                </div>
                                <div className="text-4xl font-mono font-black text-indigo-400 drop-shadow-lg">
                                    {formatCurrency(totalTax)}
                                </div>
                            </div>
                            
                            {grossIncome > 0 && (
                                <div className="text-right text-xs text-slate-500 mt-2">
                                    {isHi ? "प्रभावी कर दर" : "Effective Tax Rate"}: <span className="font-bold text-slate-400">{effectiveRate.toFixed(2)}%</span>
                                </div>
                            )}

                        </div>

                        <p className="text-[10px] text-slate-500 mt-4 text-center">
                            {isHi ? "अस्वीकरण: यह उपकरण एक सरलीकृत सादा अनुमान प्रदान करता है। कृपया सटीक कर देयता के लिए किसी सीए (CA) से सलाह लें।" : "Disclaimer: This tool provides a simplified estimate using generalized tax brackets. Please consult a CA for accurate tax liability."}
                        </p>
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/income-tax-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
