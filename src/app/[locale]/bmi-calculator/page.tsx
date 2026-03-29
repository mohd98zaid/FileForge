"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is BMI?", questionHi: "BMI क्या है?", answer: "Body Mass Index (BMI) is a measure of body fat based on your weight in relation to your height.", answerHi: "बॉडी मास इंडेक्स (BMI) आपकी ऊंचाई के संबंध में आपके वजन के आधार पर शरीर में वसा का एक उपाय है।" },
    { question: "Is BMI perfectly accurate?", questionHi: "क्या BMI पूरी तरह से सटीक है?", answer: "BMI is a useful general screening tool, but it doesn't distinguish between muscle and fat. Highly muscular individuals might have a high BMI but low body fat.", answerHi: "BMI एक उपयोगी सामान्य स्क्रीनिंग उपकरण है, लेकिन यह मांसपेशियों और वसा के बीच अंतर नहीं करता है। अत्यधिक मांसल व्यक्तियों में उच्च बीएमआई हो सकता है लेकिन शरीर में वसा कम हो सकती है।" },
    { question: "What are the standard BMI categories?", questionHi: "मानक BMI श्रेणियां क्या हैं?", answer: "Underweight: < 18.5 | Normal weight: 18.5 – 24.9 | Overweight: 25 – 29.9 | Obesity: 30 or greater.", answerHi: "कम वजन: < 18.5 | सामान्य वजन: 18.5 – 24.9 | अधिक वजन: 25 – 29.9 | मोटापा: 30 या अधिक।" },
];

export default function BmiCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
    
    // Metric
    const [weightKg, setWeightKg] = useState<number>(70);
    const [heightCm, setHeightCm] = useState<number>(170);
    
    // Imperial
    const [weightLbs, setWeightLbs] = useState<number>(150);
    const [heightFt, setHeightFt] = useState<number>(5);
    const [heightIn, setHeightIn] = useState<number>(7);

    // Outputs
    const [bmi, setBmi] = useState<number>(0);
    const [category, setCategory] = useState<{ id: string, name: string, hi: string, color: string, range: string }>({ id: "", name: "", hi: "", color: "", range: "" });

    const categories = [
        { id: "underweight", name: "Underweight", hi: "कम वजन", max: 18.5, color: "text-blue-400", range: "< 18.5" },
        { id: "normal", name: "Normal Weight", hi: "सामान्य वजन", max: 25, color: "text-emerald-400", range: "18.5 - 24.9" },
        { id: "overweight", name: "Overweight", hi: "अधिक वजन", max: 30, color: "text-orange-400", range: "25 - 29.9" },
        { id: "obese", name: "Obese", hi: "मोटापा", max: Infinity, color: "text-red-500", range: "≥ 30" }
    ];

    useEffect(() => {
        let calculatedBmi = 0;

        if (unitSystem === "metric") {
            if (heightCm > 0 && weightKg > 0) {
                const heightM = heightCm / 100;
                calculatedBmi = weightKg / (heightM * heightM);
            }
        } else {
            const totalInches = (heightFt * 12) + (Number(heightIn) || 0); // Convert strictly to number safely
            if (totalInches > 0 && weightLbs > 0) {
                calculatedBmi = 703 * (weightLbs / (totalInches * totalInches));
            }
        }

        if (calculatedBmi > 0 && calculatedBmi < 100) {
            setBmi(parseFloat(calculatedBmi.toFixed(1)));
            
            // Determine category
            for (const cat of categories) {
                if (calculatedBmi < cat.max) {
                    setCategory(cat);
                    break;
                }
            }
        } else {
            setBmi(0);
        }
    }, [weightKg, heightCm, weightLbs, heightFt, heightIn, unitSystem]);

    // Gauge needle calculation (approximate mapping 15-40 BMI to 0-100% width)
    const getSliderPosition = () => {
        if (bmi < 15) return "0%";
        if (bmi > 40) return "100%";
        const percent = ((bmi - 15) / 25) * 100;
        return `${percent}%`;
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "⚖️ BMI कैलकुलेटर" : "⚖️ BMI Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपने शारीरिक द्रव्यमान सूचकांक (BMI) की जांच करें" : "Calculate your Body Mass Index (BMI)"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full md:w-5/12 flex flex-col gap-6">
                    
                    {/* Unit Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => setUnitSystem("metric")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${unitSystem === "metric" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "मीट्रिक (kg/cm)" : "Metric (kg/cm)"}
                        </button>
                        <button
                            onClick={() => setUnitSystem("imperial")}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${unitSystem === "imperial" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "फ़ुट/पाउंड (lbs/ft)" : "Imperial (lbs/ft)"}
                        </button>
                    </div>

                    {/* Form Inputs based on system */}
                    {unitSystem === "metric" ? (
                        <>
                            <div className="space-y-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-semibold text-slate-300">{isHi ? "वजन (Weight)" : "Weight"}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={weightKg || ""}
                                            onChange={(e) => setWeightKg(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 w-24 text-right text-indigo-300 font-bold focus:border-indigo-500 outline-none"
                                        />
                                        <span className="text-slate-400">kg</span>
                                    </div>
                                </div>
                                <input type="range" min="20" max="250" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} className="w-full accent-indigo-500" />
                            </div>

                            <div className="space-y-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-semibold text-slate-300">{isHi ? "ऊँचाई (Height)" : "Height"}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={heightCm || ""}
                                            onChange={(e) => setHeightCm(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 w-24 text-right text-emerald-300 font-bold focus:border-emerald-500 outline-none"
                                        />
                                        <span className="text-slate-400">cm</span>
                                    </div>
                                </div>
                                <input type="range" min="100" max="250" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} className="w-full accent-emerald-500" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-semibold text-slate-300">{isHi ? "वजन (Weight)" : "Weight"}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={weightLbs || ""}
                                            onChange={(e) => setWeightLbs(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-600 rounded px-3 py-1.5 w-24 text-right text-indigo-300 font-bold focus:border-indigo-500 outline-none"
                                        />
                                        <span className="text-slate-400">lbs</span>
                                    </div>
                                </div>
                                <input type="range" min="40" max="500" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} className="w-full accent-indigo-500" />
                            </div>

                            <div className="space-y-4 p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="font-semibold text-slate-300">{isHi ? "ऊँचाई (Height)" : "Height"}</label>
                                    <div className="flex justify-end items-center gap-2 w-full max-w-[160px]">
                                        <input
                                            type="number"
                                            value={heightFt || ""}
                                            onChange={(e) => setHeightFt(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 w-16 text-center text-emerald-300 font-bold focus:border-emerald-500 outline-none"
                                            placeholder="ft"
                                        />
                                        <span className="text-slate-400 mr-2">ft</span>
                                        <input
                                            type="number"
                                            value={heightIn === 0 ? "0" : heightIn || ""}
                                            onChange={(e) => setHeightIn(Number(e.target.value))}
                                            className="bg-slate-900 border border-slate-600 rounded px-2 py-1.5 w-16 text-center text-emerald-300 font-bold focus:border-emerald-500 outline-none"
                                            placeholder="in"
                                        />
                                        <span className="text-slate-400">in</span>
                                    </div>
                                </div>
                                {/* Simple height slider based on total inches to sync inputs */}
                                <input 
                                    type="range" 
                                    min="40" 
                                    max="90" 
                                    value={(heightFt * 12) + (Number(heightIn) || 0)} 
                                    onChange={(e) => {
                                        const total = Number(e.target.value);
                                        setHeightFt(Math.floor(total / 12));
                                        setHeightIn(total % 12);
                                    }} 
                                    className="w-full accent-emerald-500 mt-2" 
                                />
                            </div>
                        </>
                    )}

                </div>

                {/* Results Panel */}
                <div className="w-full md:w-7/12 flex flex-col">
                    
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl flex-grow flex flex-col justify-center items-center text-center">
                        
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">
                            {isHi ? "आपका बीएमआई परिणाम" : "Your BMI Result"}
                        </h3>
                        
                        {bmi > 0 ? (
                            <>
                                <div className={`text-7xl font-mono font-black mb-2 drop-shadow-lg ${category.color}`}>
                                    {bmi}
                                </div>
                                <div className={`text-xl font-bold tracking-wide uppercase px-4 py-1 rounded-full bg-slate-900/50 border border-slate-700/50 ${category.color}`}>
                                    {isHi ? category.hi : category.name}
                                </div>

                                {/* Visual Gauge Container */}
                                <div className="w-full max-w-sm mt-12 relative">
                                    {/* Gradient Bar */}
                                    <div className="h-4 w-full rounded-full flex overflow-hidden border border-slate-700/50 shadow-inner">
                                        <div className="h-full bg-blue-400" style={{ width: "23%" }} title="Underweight (< 18.5)"></div> {/* 15 to 18.5 */}
                                        <div className="h-full bg-emerald-400" style={{ width: "26%" }} title="Normal (18.5 - 24.9)"></div> {/* 18.5 to 25 */}
                                        <div className="h-full bg-orange-400" style={{ width: "20%" }} title="Overweight (25 - 29.9)"></div> {/* 25 to 30 */}
                                        <div className="h-full bg-red-500" style={{ width: "31%" }} title="Obese (≥ 30)"></div> {/* 30 to 40+ */}
                                    </div>
                                    
                                    {/* Needle Marker */}
                                    <div 
                                        className="absolute top-0 -mt-2 transition-all duration-700 ease-out z-10"
                                        style={{ left: getSliderPosition() }}
                                    >
                                        <div className="relative -ml-2">
                                            <div className="w-4 h-8 bg-white rounded flex items-center justify-center shadow-lg border-2 border-slate-900">
                                                <div className="w-0.5 h-4 bg-slate-900"></div>
                                            </div>
                                            <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-300">
                                                {bmi}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scale Labels */}
                                    <div className="flex justify-between w-full mt-2 px-1 text-[10px] text-slate-500 font-mono">
                                        <span>15</span>
                                        <span>18.5</span>
                                        <span>25</span>
                                        <span>30</span>
                                        <span>40+</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-500 italic mt-8">
                                {isHi ? "अपने परिणाम देखने के लिए विवरण दर्ज करें।" : "Enter your details to see your result."}
                            </div>
                        )}
                        
                    </div>

                    {/* Scale legend */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="text-center p-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
                                <div className={`text-xs font-bold ${cat.color}`}>{isHi ? cat.hi : cat.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{cat.range}</div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/bmi-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
