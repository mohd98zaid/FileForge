"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Which units are supported?", questionHi: "कौन सी इकाइयाँ सपोर्ट हैं?", answer: "Length, weight, temperature, speed, area — all common units.", answerHi: "लंबाई, वज़न, तापमान, स्पीड, क्षेत्रफल — सभी लोकप्रिय इकाइयाँ।" },
    { question: "Is it accurate?", questionHi: "क्या यह सटीक है?", answer: "Yes, all conversions use standard mathematical formulas.", answerHi: "हाँ, सभी कन्वर्शन स्टैंडर्ड गणितीय फ़ॉर्मूले का इस्तेमाल करते हैं।" },
];

const CATEGORIES = {
    length: {
        units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34 },
        labels: { m: "Meters", km: "Kilometers", cm: "Centimeters", mm: "Millimeters", in: "Inches", ft: "Feet", yd: "Yards", mi: "Miles" },
        labelsHi: { m: "मीटर", km: "किलोमीटर", cm: "सेंटीमीटर", mm: "मिलीमीटर", in: "इंच", ft: "फुट", yd: "गज", mi: "मील" }
    },
    weight: {
        units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
        labels: { kg: "Kilograms", g: "Grams", mg: "Milligrams", lb: "Pounds", oz: "Ounces" },
        labelsHi: { kg: "किलोग्राम", g: "ग्राम", mg: "मिलीग्राम", lb: "पाउंड", oz: "औंस" }
    },
    volume: {
        units: { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588 },
        labels: { l: "Liters", ml: "Milliliters", gal: "Gallons (US)", qt: "Quarts (US)", pt: "Pints (US)", cup: "Cups (US)" },
        labelsHi: { l: "लीटर", ml: "मिलीलीटर", gal: "गैलन (US)", qt: "क्वार्ट (US)", pt: "पिंट (US)", cup: "कप (US)" }
    },
    speed: {
        units: { "m/s": 1, "km/h": 0.277778, "mph": 0.44704, "kn": 0.514444 },
        labels: { "m/s": "Meters/Second", "km/h": "Kilometers/Hour", "mph": "Miles/Hour", "kn": "Knots" },
        labelsHi: { "m/s": "मीटर/सेकंड", "km/h": "किलोमीटर/घंटा", "mph": "मील/घंटा", "kn": "नॉट्स" }
    },
};

type Category = keyof typeof CATEGORIES | "temperature";

export default function UnitConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [category, setCategory] = useState<Category>("length");
    const [fromUnit, setFromUnit] = useState("m");
    const [toUnit, setToUnit] = useState("km");
    const [fromValue, setFromValue] = useState<number | "">("");
    const [toValue, setToValue] = useState<number | "">("");

    // Update units when category changes
    useEffect(() => {
        if (category === "temperature") {
            setFromUnit("c");
            setToUnit("f");
        } else {
            const units = Object.keys(CATEGORIES[category].units);
            setFromUnit(units[0]);
            setToUnit(units[1] || units[0]);
        }
        setFromValue("");
        setToValue("");
    }, [category]);

    const convert = (val: number, from: string, to: string, cat: Category) => {
        if (cat === "temperature") {
            let celsius = val;
            if (from === "f") celsius = (val - 32) * 5 / 9;
            if (from === "k") celsius = val - 273.15;

            if (to === "c") return celsius;
            if (to === "f") return (celsius * 9 / 5) + 32;
            if (to === "k") return celsius + 273.15;
            return val;
        } else {
            const catData = CATEGORIES[cat as keyof typeof CATEGORIES];
            const base = val * (catData.units as Record<string, number>)[from];
            return base / (catData.units as Record<string, number>)[to];
        }
    };

    const handleFromChange = (val: string) => {
        const num = parseFloat(val);
        setFromValue(val === "" ? "" : num);
        if (val === "" || isNaN(num)) {
            setToValue("");
        } else {
            const res = convert(num, fromUnit, toUnit, category);
            setToValue(parseFloat(res.toPrecision(6)));
        }
    };

    const handleToChange = (val: string) => {
        const num = parseFloat(val);
        setToValue(val === "" ? "" : num);
        if (val === "" || isNaN(num)) {
            setFromValue("");
        } else {
            const res = convert(num, toUnit, fromUnit, category);
            setFromValue(parseFloat(res.toPrecision(6)));
        }
    };

    // Re-calculate when units change
    useEffect(() => {
        if (typeof fromValue === "number") {
            const res = convert(fromValue, fromUnit, toUnit, category);
            setToValue(parseFloat(res.toPrecision(6)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromUnit, toUnit]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🧮 इकाई कन्वर्टर" : "🧮 Unit Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "लंबाई, वज़न, तापमान आदि बदलें" : "Convert Length, Weight, Temperature, and more"}</p>
            </div>

            <div className="glass-card max-w-4xl mx-auto space-y-8">
                {/* Category Selection */}
                <div className="flex flex-wrap justify-center gap-2">
                    {(["length", "weight", "volume", "speed", "temperature"] as Category[]).map((c) => {
                        const hiCategoryLabels: Record<string, string> = { length: "लंबाई", weight: "वज़न", volume: "आयतन", speed: "गति", temperature: "तापमान" };
                        return (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-4 py-2 rounded-full capitalize transition-colors ${category === c
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white"
                                    }`}
                            >
                                {isHi ? hiCategoryLabels[c] || c : c}
                            </button>
                        );
                    })}
                </div>

                {/* Conversion Interface */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "से (From)" : "From"}</label>
                        <input
                            type="number"
                            value={fromValue}
                            onChange={(e) => handleFromChange(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-2xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:ring-1 focus:ring-indigo-500"
                        >
                            {category === "temperature" ? (
                                <>
                                    <option value="c">{isHi ? "सेल्सियस (°C)" : "Celsius (°C)"}</option>
                                    <option value="f">{isHi ? "फ़ारेनहाइट (°F)" : "Fahrenheit (°F)"}</option>
                                    <option value="k">{isHi ? "केल्विन (K)" : "Kelvin (K)"}</option>
                                </>
                            ) : (
                                Object.entries(isHi ? CATEGORIES[category as keyof typeof CATEGORIES].labelsHi : CATEGORIES[category as keyof typeof CATEGORIES].labels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="hidden md:flex justify-center text-slate-500 text-2xl">=</div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isHi ? "में (To)" : "To"}</label>
                        <input
                            type="number"
                            value={toValue}
                            onChange={(e) => handleToChange(e.target.value)}
                            placeholder="0"
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-2xl text-green-300 focus:ring-2 focus:ring-green-500/50 outline-none"
                        />
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:ring-1 focus:ring-indigo-500"
                        >
                            {category === "temperature" ? (
                                <>
                                    <option value="c">{isHi ? "सेल्सियस (°C)" : "Celsius (°C)"}</option>
                                    <option value="f">{isHi ? "फ़ारेनहाइट (°F)" : "Fahrenheit (°F)"}</option>
                                    <option value="k">{isHi ? "केल्विन (K)" : "Kelvin (K)"}</option>
                                </>
                            ) : (
                                Object.entries(isHi ? CATEGORIES[category as keyof typeof CATEGORIES].labelsHi : CATEGORIES[category as keyof typeof CATEGORIES].labels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/unit-converter" tools={ALL_TOOLS} />
        </div>
    );
}
