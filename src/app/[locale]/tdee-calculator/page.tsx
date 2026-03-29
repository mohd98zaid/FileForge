"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is BMR?", questionHi: "BMR क्या है?", answer: "Basal Metabolic Rate (BMR) estimates the amount of energy (calories) expended while at rest in a neutrally temperate environment.", answerHi: "बेसल मेटाबोलिक रेट (BMR) तटस्थ समशीतोष्ण वातावरण में आराम करते समय खर्च की गई ऊर्जा (कैलोरी) की मात्रा का अनुमान लगाता है।" },
    { question: "What is TDEE?", questionHi: "TDEE क्या है?", answer: "Total Daily Energy Expenditure (TDEE) is the total number of calories you burn per day, calculated by multiplying your BMR by an activity multiplier.", answerHi: "कुल दैनिक ऊर्जा व्यय (TDEE) प्रति दिन जलाई जाने वाली कैलोरी की कुल संख्या है, जिसकी गणना आपके BMR को गतिविधि गुणक से गुणा करके की जाती है।" },
    { question: "Which formula is used?", questionHi: "किस फार्मूले का प्रयोग किया जाता है?", answer: "This calculator uses the Mifflin-St Jeor equation, which is widely considered the most accurate formula for calculating BMR.", answerHi: "यह कैलकुलेटर Mifflin-St Jeor समीकरण का उपयोग करता है, जिसे BMR की गणना के लिए सबसे सटीक सूत्र माना जाता है।" },
];

export default function TdeeCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    // Inputs
    const [gender, setGender] = useState<"male" | "female">("male");
    const [age, setAge] = useState<number>(25);
    const [weightKg, setWeightKg] = useState<number>(70);
    const [heightCm, setHeightCm] = useState<number>(170);
    const [activityMultiplier, setActivityMultiplier] = useState<number>(1.2); // Sedentary

    // Outputs
    const [bmr, setBmr] = useState<number>(0);
    const [tdee, setTdee] = useState<number>(0);

    const activityLevels = [
        { label: "Sedentary", labelHi: "आसीन (व्यायाम नहीं)", value: 1.2, desc: "Little or no exercise" },
        { label: "Lightly Active", labelHi: "हल्का सक्रिय", value: 1.375, desc: "Light exercise/sports 1-3 days/week" },
        { label: "Moderately Active", labelHi: "मध्यम सक्रिय", value: 1.55, desc: "Moderate exercise/sports 3-5 days/week" },
        { label: "Very Active", labelHi: "बहुत सक्रिय", value: 1.725, desc: "Hard exercise/sports 6-7 days a week" },
        { label: "Extra Active", labelHi: "अतिरिक्त सक्रिय", value: 1.9, desc: "Very hard exercise/sports & physical job" }
    ];

    useEffect(() => {
        if (!age || !weightKg || !heightCm || weightKg <= 0 || heightCm <= 0 || age <= 0) {
            setBmr(0);
            setTdee(0);
            return;
        }

        // Mifflin-St Jeor Equation
        // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
        // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
        
        let calculatedBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        
        if (gender === "male") {
            calculatedBmr += 5;
        } else {
            calculatedBmr -= 161;
        }

        const calculatedTdee = calculatedBmr * activityMultiplier;

        setBmr(Math.round(calculatedBmr));
        setTdee(Math.round(calculatedTdee));

    }, [gender, age, weightKg, heightCm, activityMultiplier]);

    // Calculate Macros
    // Default splits (Protein=30%, Fat=30%, Carbs=40%)
    const calculateMacros = (calories: number) => {
        const pCals = calories * 0.3;
        const fCals = calories * 0.3;
        const cCals = calories * 0.4;

        // Protein = 4 kcal/g, Fat = 9 kcal/g, Carbs = 4 kcal/g
        return {
            protein: Math.round(pCals / 4),
            fat: Math.round(fCals / 9),
            carbs: Math.round(cCals / 4)
        };
    };

    const maintainMacros = calculateMacros(tdee);
    const cutMacros = calculateMacros(tdee - 500); // Mild deficit
    const bulkMacros = calculateMacros(tdee + 500); // Mild surplus

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔥 TDEE कैलकुलेटर" : "🔥 TDEE Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपने कुल दैनिक ऊर्जा व्यय और मैक्रोज़ का पता लगाएं" : "Find out how many calories you burn each day and your macros"}</p>
            </div>

            <div className="glass-card max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* Inputs Sidebar */}
                <div className="w-full lg:w-5/12 flex flex-col gap-6">
                    
                    {/* Gender Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => setGender("male")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${gender === "male" ? "bg-indigo-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "पुरुष (Male)" : "Male"}
                        </button>
                        <button
                            onClick={() => setGender("female")}
                            className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${gender === "female" ? "bg-pink-500 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            {isHi ? "महिला (Female)" : "Female"}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "आयु (Age)" : "Age"}</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={age || ""}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-3 py-2 w-full text-indigo-300 font-bold focus:border-indigo-500 outline-none"
                                />
                                <span className="text-slate-400 text-sm">yrs</span>
                            </div>
                        </div>

                        <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                            <label className="text-sm font-medium text-slate-300 block">{isHi ? "वजन (Weight)" : "Weight"}</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={weightKg || ""}
                                    onChange={(e) => setWeightKg(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-3 py-2 w-full text-indigo-300 font-bold focus:border-indigo-500 outline-none"
                                />
                                <span className="text-slate-400 text-sm">kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-300">
                                {isHi ? "ऊँचाई (Height)" : "Height"}
                            </label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    min="50"
                                    max="250"
                                    value={heightCm || ""}
                                    onChange={(e) => setHeightCm(Number(e.target.value))}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-1 w-20 text-right text-emerald-300 font-bold focus:border-emerald-500 outline-none"
                                />
                                <span className="text-slate-400 font-medium">cm</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max="250"
                            step="1"
                            value={heightCm}
                            onChange={(e) => setHeightCm(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            {isHi ? "गतिविधि स्तर (Activity Level)" : "Activity Level"}
                        </label>
                        <div className="space-y-2">
                            {activityLevels.map((lvl) => (
                                <label 
                                    key={lvl.value} 
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${activityMultiplier === lvl.value ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50"}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="activity" 
                                        value={lvl.value} 
                                        checked={activityMultiplier === lvl.value} 
                                        onChange={() => setActivityMultiplier(lvl.value)} 
                                        className="w-4 h-4 text-indigo-500 bg-slate-900 border-slate-600 focus:ring-indigo-500 focus:ring-2" 
                                    />
                                    <div className="ml-3">
                                        <div className="text-sm font-semibold text-slate-200">{isHi ? lvl.labelHi : lvl.label}</div>
                                        <div className="text-xs text-slate-500">{lvl.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Results Panel */}
                <div className="w-full lg:w-7/12 flex flex-col gap-6">
                    
                    {/* Primary Output */}
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl"></div>
                        
                        <div className="text-center sm:text-left flex-1 relative z-10 w-full border-b sm:border-b-0 sm:border-r border-slate-700/50 pb-6 sm:pb-0 sm:pr-6">
                            <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">{isHi ? "आपका BMR" : "Your BMR"}</div>
                            <div className="text-3xl font-mono font-bold text-slate-300">{bmr.toLocaleString()}</div>
                            <div className="text-xs text-slate-500 mt-1">{isHi ? "आराम करते समय कैलोरी जली" : "Calories burned at rest"}</div>
                        </div>

                        <div className="text-center sm:text-left flex-[2] relative z-10 w-full pl-0 sm:pl-2">
                            <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">{isHi ? "आपकी मैंटेनेन्स कैलोरी" : "Maintenance Calories (TDEE)"}</div>
                            <div className="flex items-end justify-center sm:justify-start gap-2">
                                <div className="text-5xl lg:text-6xl font-mono font-black text-orange-400 drop-shadow-md">{tdee.toLocaleString()}</div>
                                <div className="text-lg text-orange-400/80 font-bold mb-1">kcal</div>
                            </div>
                            <div className="text-xs text-slate-500 mt-2">{isHi ? "अपना वर्तमान वजन बनाए रखने के लिए" : "To maintain your current weight"}</div>
                        </div>
                    </div>

                    {/* Macro Breakdown */}
                    {tdee > 0 && (
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                            <div className="bg-slate-800 border-b border-slate-700/50 p-4 font-semibold text-slate-300">
                                {isHi ? "मैक्रोन्यूट्रिएंट्स विकल्प" : "Macronutrient Options"} <span className="text-xs text-slate-500 font-normal ml-2">(30/30/40 Split)</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                                
                                {/* Cut */}
                                <div className="p-4 flex flex-col items-center">
                                    <h4 className="text-emerald-400 font-bold mb-1">{isHi ? "वजन घटाएं (Cut)" : "Cut (-500)"}</h4>
                                    <div className="font-mono text-xl text-slate-200 mb-3 block">{(tdee - 500).toLocaleString()} <span className="text-xs text-slate-500">kcal</span></div>
                                    <div className="w-full space-y-2 mt-auto">
                                        <div className="flex justify-between text-sm"><span className="text-indigo-400">P:</span> <span className="font-mono">{cutMacros.protein}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-blue-400">C:</span> <span className="font-mono">{cutMacros.carbs}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-amber-400">F:</span> <span className="font-mono">{cutMacros.fat}g</span></div>
                                    </div>
                                </div>

                                {/* Maintain */}
                                <div className="p-4 flex flex-col items-center bg-slate-800/50">
                                    <h4 className="text-orange-400 font-bold mb-1">{isHi ? "वजन बनाए रखें" : "Maintain"}</h4>
                                    <div className="font-mono text-xl text-slate-200 mb-3 block">{tdee.toLocaleString()} <span className="text-xs text-slate-500">kcal</span></div>
                                    <div className="w-full space-y-2 mt-auto">
                                        <div className="flex justify-between text-sm"><span className="text-indigo-400">P:</span> <span className="font-mono">{maintainMacros.protein}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-blue-400">C:</span> <span className="font-mono">{maintainMacros.carbs}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-amber-400">F:</span> <span className="font-mono">{maintainMacros.fat}g</span></div>
                                    </div>
                                </div>

                                {/* Bulk */}
                                <div className="p-4 flex flex-col items-center">
                                    <h4 className="text-red-400 font-bold mb-1">{isHi ? "वजन बढ़ाएं (Bulk)" : "Bulk (+500)"}</h4>
                                    <div className="font-mono text-xl text-slate-200 mb-3 block">{(tdee + 500).toLocaleString()} <span className="text-xs text-slate-500">kcal</span></div>
                                    <div className="w-full space-y-2 mt-auto">
                                        <div className="flex justify-between text-sm"><span className="text-indigo-400">P:</span> <span className="font-mono">{bulkMacros.protein}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-blue-400">C:</span> <span className="font-mono">{bulkMacros.carbs}g</span></div>
                                        <div className="flex justify-between text-sm"><span className="text-amber-400">F:</span> <span className="font-mono">{bulkMacros.fat}g</span></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/tdee-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
