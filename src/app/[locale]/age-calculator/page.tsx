"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How is my exact age calculated?", questionHi: "मेरी सटीक आयु की गणना कैसे की जाती है?", answer: "We take your birth date and the target date, calculating the differences month-by-month to accurately account for the varying lengths of months and leap years.", answerHi: "हम आपकी जन्म तिथि और लक्षित तिथि लेते हैं, महीनों की अलग-अलग लंबाई और लीप वर्षों का सटीक हिसाब लगाने के लिए महीने-दर-महीने अंतर की गणना करते हैं।" },
    { question: "Can I check my future age?", questionHi: "क्या मैं अपनी भविष्य की आयु देख सकता हूँ?", answer: "Yes! Simply change the 'Target Date' to a future date to see exactly how old you will be on that specific day.", answerHi: "हाँ! उस विशिष्ट दिन आप कितने वर्ष के होंगे, यह देखने के लिए बस 'लक्ष्य तिथि' को भविष्य की किसी तिथि में बदलें।" },
    { question: "How are leap years counted?", questionHi: "लीप वर्ष कैसे गिने जाते हैं?", answer: "We count every instance of February 29th that has occurred strictly between your birth date and the target date.", answerHi: "हम 29 फरवरी के हर उस उदाहरण को गिनते हैं जो आपकी जन्म तिथि और लक्षित तिथि के बीच सख्ती से हुआ है।" },
];

const westernZodiacs = [
    { start: "03-21", end: "04-19", name: "Aries", sign: "♈", hi: "मेष" },
    { start: "04-20", end: "05-20", name: "Taurus", sign: "♉", hi: "वृषभ" },
    { start: "05-21", end: "06-20", name: "Gemini", sign: "♊", hi: "मिथुन" },
    { start: "06-21", end: "07-22", name: "Cancer", sign: "♋", hi: "कर्क" },
    { start: "07-23", end: "08-22", name: "Leo", sign: "♌", hi: "सिंह" },
    { start: "08-23", end: "09-22", name: "Virgo", sign: "♍", hi: "कन्या" },
    { start: "09-23", end: "10-22", name: "Libra", sign: "♎", hi: "तुला" },
    { start: "10-23", end: "11-21", name: "Scorpio", sign: "♏", hi: "वृश्चिक" },
    { start: "11-22", end: "12-21", name: "Sagittarius", sign: "♐", hi: "धनु" },
    { start: "12-22", end: "12-31", name: "Capricorn", sign: "♑", hi: "मकर" },
    { start: "01-01", end: "01-19", name: "Capricorn", sign: "♑", hi: "मकर" }, // Split for end of year
    { start: "01-20", end: "02-18", name: "Aquarius", sign: "♒", hi: "कुंभ" },
    { start: "02-19", end: "03-20", name: "Pisces", sign: "♓", hi: "मीन" }
];

const chineseZodiacs = [
    { name: "Rat", sign: "🐀", hi: "चूहा" },
    { name: "Ox", sign: "🐂", hi: "बैल" },
    { name: "Tiger", sign: "🐅", hi: "बाघ" },
    { name: "Rabbit", sign: "🐇", hi: "खरगोश" },
    { name: "Dragon", sign: "🐉", hi: "ड्रैगन" },
    { name: "Snake", sign: "🐍", hi: "सांप" },
    { name: "Horse", sign: "🐎", hi: "घोड़ा" },
    { name: "Goat", sign: "🐐", hi: "बकरी" },
    { name: "Monkey", sign: "🐒", hi: "बंदर" },
    { name: "Rooster", sign: "🐓", hi: "मुर्गा" },
    { name: "Dog", sign: "🐕", hi: "कुत्ता" },
    { name: "Pig", sign: "🐖", hi: "सूअर" }
];

export default function AgeCalculatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [dob, setDob] = useState(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 25);
        return d.toISOString().split('T')[0];
    });
    
    const [targetDate, setTargetDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [results, setResults] = useState<{
        years: number;
        months: number;
        days: number;
        nextBdayDays: number;
        leapYearsLived: number;
        monthsLived: number;
        weeksLived: number;
        daysLived: number;
        westernSign: { name: string; sign: string; hi: string } | null;
        chineseSign: { name: string; sign: string; hi: string } | null;
    } | null>(null);

    useEffect(() => {
        if (!dob || !targetDate) {
            setResults(null);
            return;
        }

        const bdate = new Date(dob);
        const tdate = new Date(targetDate);

        if (isNaN(bdate.getTime()) || isNaN(tdate.getTime()) || bdate > tdate) {
            setResults(null);
            return;
        }

        // 1. Exact age tracking
        let years = tdate.getFullYear() - bdate.getFullYear();
        let months = tdate.getMonth() - bdate.getMonth();
        let days = tdate.getDate() - bdate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(tdate.getFullYear(), tdate.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // 2. Next birthday countdown
        const nextBday = new Date(bdate);
        nextBday.setFullYear(tdate.getFullYear());
        if (nextBday < tdate) {
            nextBday.setFullYear(tdate.getFullYear() + 1);
        }
        
        const nextBdayMs = nextBday.getTime() - tdate.getTime();
        const nextBdayDays = Math.ceil(nextBdayMs / (1000 * 60 * 60 * 24));

        // 3. Leap years lived
        let leapYearsLived = 0;
        for (let y = bdate.getFullYear(); y <= tdate.getFullYear(); y++) {
            if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
                const leapDay = new Date(y, 1, 29); // Feb 29
                if (leapDay >= bdate && leapDay <= tdate) {
                    leapYearsLived++;
                }
            }
        }

        // 4. Milestones
        const totalMs = tdate.getTime() - bdate.getTime();
        const daysLived = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const weeksLived = Math.floor(daysLived / 7);
        const monthsLived = (tdate.getFullYear() - bdate.getFullYear()) * 12 + (tdate.getMonth() - bdate.getMonth());

        // 5. Zodiacs
        const bMonth = (bdate.getMonth() + 1).toString().padStart(2, '0');
        const bDay = bdate.getDate().toString().padStart(2, '0');
        const mmdd = `${bMonth}-${bDay}`;

        const westernSign = westernZodiacs.find(z => mmdd >= z.start && mmdd <= z.end) || westernZodiacs[0];
        
        // Approx Chinese Zodiac mapping based on year (offset by 4 years since 1900 was a Rat year)
        const chineseZodiacIndex = (bdate.getFullYear() - 4) % 12;
        const normalizedIndex = chineseZodiacIndex < 0 ? chineseZodiacIndex + 12 : chineseZodiacIndex;
        const chineseSign = chineseZodiacs[normalizedIndex];

        setResults({
            years, months, days, 
            nextBdayDays, 
            leapYearsLived, 
            monthsLived, weeksLived, daysLived,
            westernSign, chineseSign
        });

    }, [dob, targetDate]);


    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎂 आयु कैलकुलेटर" : "🎂 Age Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपनी सटीक आयु, राशि चिन्ह और दिलचस्प मील के पत्थर खोजें" : "Discover your exact age, astrological signs, and fun lifetime milestones"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Inputs */}
                <div className="glass-card p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden text-center md:text-left">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl pointer-events-none">✨</div>
                    
                    <div className="flex-1 relative z-10 w-full sm:max-w-xs mx-auto md:mx-0">
                        <label className="block text-sm font-bold text-slate-300 mb-2">{isHi ? "जन्म तिथि" : "Date of Birth"}</label>
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={targetDate}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-colors text-lg cursor-pointer"
                        />
                    </div>

                    <div className="flex-1 relative z-10 w-full sm:max-w-xs mx-auto md:mx-0">
                        <label className="block text-sm font-bold text-slate-300 mb-2">{isHi ? "लक्षित तिथि" : "Target Date"}</label>
                        <input 
                            type="date" 
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-colors text-lg cursor-pointer"
                        />
                    </div>
                </div>

                {/* Results block */}
                {results ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                        
                        {/* Primary Age Banner */}
                        <div className="md:col-span-12 glass-card p-8 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-500/30 flex flex-col items-center justify-center text-center">
                            <h2 className="text-xl text-slate-300 mb-4">{isHi ? "आपकी आयु है:" : "You are currently:"}</h2>
                            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 items-baseline">
                                <div className="text-center">
                                    <span className="text-5xl sm:text-7xl font-black text-indigo-400 drop-shadow-lg">{results.years}</span>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-1 text-sm">{isHi ? "साल" : "Years"}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl sm:text-7xl font-black text-blue-400 drop-shadow-lg">{results.months}</span>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-1 text-sm">{isHi ? "महीने" : "Months"}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-5xl sm:text-7xl font-black text-emerald-400 drop-shadow-lg">{results.days}</span>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest mt-1 text-sm">{isHi ? "दिन" : "Days"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats left col */}
                        <div className="md:col-span-5 space-y-6">
                            <div className="glass-card p-6 flex items-center justify-between group">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-wide">{isHi ? "अगला जन्मदिन" : "Next Birthday"}</p>
                                    <p className="text-2xl font-bold text-white">
                                        <span className="text-pink-400">{results.nextBdayDays}</span> {isHi ? "दिनों में" : "Days away"}
                                    </p>
                                </div>
                                <div className="text-4xl group-hover:scale-125 transition-transform duration-300">🎁</div>
                            </div>

                            <div className="glass-card p-6 flex flex-col gap-4">
                                <h3 className="text-slate-300 font-bold border-b border-slate-700/50 pb-2">{isHi ? "आपके पड़ाव" : "Lifetime Milestones"}</h3>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>{isHi ? "कुल महीने" : "Total Months"}</span>
                                    <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-lg">{results.monthsLived.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>{isHi ? "कुल सप्ताह" : "Total Weeks"}</span>
                                    <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-lg">{results.weeksLived.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>{isHi ? "कुल दिन" : "Total Days"}</span>
                                    <span className="text-white font-mono bg-slate-800 px-3 py-1 rounded-lg">{results.daysLived.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>{isHi ? "अनुभव किए गए लीप वर्ष" : "Leap Years Experienced"}</span>
                                    <span className="text-indigo-400 font-bold font-mono bg-indigo-900/30 px-3 py-1 rounded-lg">{results.leapYearsLived}</span>
                                </div>
                            </div>
                        </div>

                        {/* Astrological Right col */}
                        <div className="md:col-span-7 grid sm:grid-cols-2 gap-6 h-full">
                            
                            {/* Western Zodiac */}
                            {results.westernSign && (
                                <div className="glass-card p-8 flex flex-col items-center justify-center text-center bg-indigo-900/10 border-indigo-500/20 hover:border-indigo-500/50 transition-colors">
                                    <div className="text-7xl mb-4 text-indigo-400 drop-shadow-md">{results.westernSign.sign}</div>
                                    <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">{isHi ? "पश्चिमी राशि" : "Western Zodiac"}</h3>
                                    <p className="text-2xl font-bold text-white tracking-wide">
                                        {isHi ? results.westernSign.hi : results.westernSign.name}
                                    </p>
                                </div>
                            )}

                            {/* Chinese Zodiac */}
                            {results.chineseSign && (
                                <div className="glass-card p-8 flex flex-col items-center justify-center text-center bg-rose-900/10 border-rose-500/20 hover:border-rose-500/50 transition-colors">
                                    <div className="text-7xl mb-4 text-rose-400 drop-shadow-md">{results.chineseSign.sign}</div>
                                    <h3 className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">{isHi ? "चीनी राशि" : "Chinese Zodiac"}</h3>
                                    <p className="text-2xl font-bold text-white tracking-wide">
                                        {isHi ? results.chineseSign.hi : results.chineseSign.name}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-2 border-slate-700/50">
                        <div className="text-5xl mb-4 opacity-50">👶</div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">{isHi ? "अभी जन्म नहीं हुआ" : "Not Born Yet"}</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">{isHi ? "आपकी जन्म तिथि लक्षित तिथि से पहले होनी चाहिए। कृपया अपनी तिथियों को समायोजित करें।" : "Your Date of Birth cannot be after the Target Date. Please adjust the calendar inputs."}</p>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/age-calculator" tools={ALL_TOOLS} />
        </div>
    );
}
