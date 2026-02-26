import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';

interface RateListProps {
    rates: Record<string, number>;
    baseCurrency: string;
}

const RateList: React.FC<RateListProps> = ({ rates, baseCurrency }) => {
    const locale = useLocale();
    const isHi = locale === "hi";

    // All supported currencies to show in the rate list
    const priorityCurrencies = [
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

    // Sort and filter using useMemo to avoid re-renders
    const displayRates = useMemo(() => {
        if (!rates) return [];
        return Object.entries(rates)
            .filter(([currency]) => priorityCurrencies.includes(currency) && currency !== baseCurrency) // Exclude base currency
            .sort((a, b) => a[0].localeCompare(b[0]));
    }, [rates, baseCurrency]);

    if (!rates || Object.keys(rates).length === 0) return null;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-300 mb-4">{isHi ? `${baseCurrency} के मुक़ाबले मौज़ूदा रेट` : `Current Rates (vs ${baseCurrency})`}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {displayRates.map(([currency, rate]) => (
                    <div key={currency} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 flex flex-col hover:border-indigo-500/30 transition-colors">
                        <span className="text-xs text-slate-500 font-medium mb-1">{currency}</span>
                        <span className="text-lg font-semibold text-slate-200">{rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RateList;
