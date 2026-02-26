"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import HistoricalChart from "./HistoricalChart";
import RateList from "./RateList";

const faqs = [
    { question: "Are rates real-time?", questionHi: "क्या रेट लाइव हैं?", answer: "Yes, exchange rates are fetched from a real-time API.", answerHi: "हाँ, एक्सचेंज रेट रीयल-टाइम API से आते हैं।" },
    { question: "Is INR supported?", questionHi: "क्या INR (₹) सपोर्ट है?", answer: "Yes! Indian Rupee and 150+ currencies are supported.", answerHi: "हाँ! भारतीय रुपया (₹) और 150+ करेंसी सपोर्ट हैं।" },
];

interface Rates {
    [key: string]: number;
}

export default function CurrencyConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [amount, setAmount] = useState<number | "">(1);
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("INR");
    const [rates, setRates] = useState<Rates>({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Fetch rates
    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
                const data = await res.json();
                if (data.result === "success") {
                    // Remove the base currency itself from the rates map
                    const { [fromCurrency]: _self, ...rest } = data.rates as Record<string, number>;
                    setRates(rest);
                } else {
                    setMessage("Failed to load exchange rates.");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rates:", error);
                setMessage("Failed to load exchange rates.");
                setLoading(false);
            }
        };

        fetchRates();
    }, [fromCurrency]);



    // ... (previous imports and code unchanged)

    // Calculate conversion
    useEffect(() => {
        if (amount && rates[toCurrency]) {
            setResult(Number(amount) * rates[toCurrency]);
        } else if (amount && fromCurrency === toCurrency) {
            setResult(Number(amount));
        } else {
            setResult(null);
        }
    }, [amount, toCurrency, rates, fromCurrency]);


    const currencies = [
        // Major Global
        "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
        // Asia
        "INR", "CNY", "SGD", "HKD", "KRW", "TWD", "MYR", "THB", "IDR", "PHP", "VND", "PKR", "BDT", "LKR", "NPR",
        // Middle East
        "AED", "SAR", "QAR", "KWD", "BHD", "OMR", "ILS", "TRY",
        // Europe
        "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "RUB",
        // Americas
        "BRL", "MXN", "ARS", "CLP", "COP",
        // Africa
        "ZAR", "EGP", "NGN", "KES",
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "💱 मुद्रा कन्वर्टर" : "💱 Currency Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "लाइव एक्सचेंज रेट के साथ मुद्रा बदलें" : "Real-time exchange rates (ECB Data)"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8"> {/* Widened container for charts */}

                <div className="glass-card max-w-lg mx-auto space-y-6"> {/* Converter Card */}
                    {message && (
                        <div className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                            <span>{message}</span>
                            <button
                                onClick={() => { setMessage(null); setFromCurrency(fromCurrency); }}
                                className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                            >
                                {isHi ? "पुनः प्रयास करें" : "Retry"}
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Amount */}
                        <div>
                            <label className="text-sm font-semibold text-slate-400">{isHi ? "रकम" : "Amount"}</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="100"
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-2xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                        </div>

                        {/* Currencies */}
                        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:ring-1 focus:ring-indigo-500"
                            >
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            <button
                                onClick={() => {
                                    setFromCurrency(toCurrency);
                                    setToCurrency(fromCurrency);
                                }}
                                className="text-slate-500 text-xl hover:text-indigo-400 hover:scale-110 transition-all p-2 rounded-full hover:bg-white/5 active:scale-95"
                                title={isHi ? "मुद्रा बदलें" : "Swap Currencies"}
                            >
                                ⇄
                            </button>

                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:ring-1 focus:ring-indigo-500"
                            >
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Result */}
                        <div className="bg-slate-800/50 p-6 rounded-xl border border-indigo-500/20 text-center">
                            {loading ? (
                                <span className="text-slate-500 animate-pulse">{isHi ? "रेट लोड हो रहे हैं..." : "Loading rates..."}</span>
                            ) : result !== null ? (
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">{isHi ? "कन्वर्ट की गई रकम" : "Converted Amount"}</p>
                                    <p className="text-3xl font-bold text-green-400">
                                        {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg">{toCurrency}</span>
                                    </p>
                                    <p className="text-xs text-slate-600 mt-2">1 {fromCurrency} = {rates[toCurrency]} {toCurrency}</p>
                                </div>
                            ) : (
                                <span className="text-slate-500">{isHi ? "कन्वर्शन देखने के लिए रकम दर्ज करें" : "Enter an amount to see conversion"}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Historical Chart */}
                <HistoricalChart fromCurrency={fromCurrency} toCurrency={toCurrency} />

                {/* Rates List */}
                <RateList rates={rates} baseCurrency={fromCurrency} />

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/currency-converter" tools={ALL_TOOLS} />
        </div>
    );
}
