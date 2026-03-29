"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "Can I print this calendar?", questionHi: "क्या मैं इस कैलेंडर को प्रिंट कर सकता हूँ?", answer: "Yes! Use the 'Print / Save PDF' button. We have customized the CSS print rules so that the UI hides itself, and only the beautiful, clean calendar table prints on standard A4/Letter paper.", answerHi: "हाँ! 'प्रिंट / पीडीएफ सहेजें' बटन का उपयोग करें। हमने CSS प्रिंट नियमों को अनुकूलित किया है ताकि UI छिप जाए, और केवल सुंदर, साफ कैलेंडर तालिका मानक A4/Letter पेपर पर प्रिंट हो।" },
    { question: "How does the layout logic work?", questionHi: "लेआउट तर्क कैसे काम करता है?", answer: "We calculate the exact day of the week the 1st of the month falls on, then generate empty padding cells before filling out the rest of the 28-31 days accurately into a 7-column flex/grid system.", answerHi: "हम इस बात की गणना करते हैं कि महीने की 1 तारीख सप्ताह के किस दिन पड़ती है, फिर बाकी 28-31 दिनों को सटीक रूप से 7-कॉलम ग्रिड सिस्टम में भरने से पहले खाली पैडिंग सेल उत्पन्न करते हैं।" },
    { question: "Can I generate a calendar for the year 2050?", questionHi: "क्या मैं 2050 वर्ष के लिए कैलेंडर जनरेट कर सकता हूँ?", answer: "Absolutely. Select any month and any year, past or future, using the selectors.", answerHi: "बिल्कुल। चयनकर्ताओं का उपयोग करके अतीत या भविष्य के किसी भी महीने और वर्ष का चयन करें।" }
];

export default function CalendarGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-11

    const [year, setYear] = useState<number>(currentYear);
    const [month, setMonth] = useState<number>(currentMonth);

    // Month names
    const EnMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const HiMonths = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
    const months = isHi ? HiMonths : EnMonths;

    const EnDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const HiDays = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
    const days = isHi ? HiDays : EnDays;

    // Generate Calendar Array
    // 0 = empty cell. 1..31 = day of month.
    const generateMonthCells = (y: number, m: number) => {
        const firstDay = new Date(y, m, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(y, m + 1, 0).getDate(); // last day of this month
        
        const cells: (number | null)[] = Array(firstDay).fill(null);
        for (let i = 1; i <= daysInMonth; i++) {
            cells.push(i);
        }
        
        // Pad the end to complete the grid (make length divisible by 7)
        const remainder = cells.length % 7;
        if (remainder !== 0) {
            cells.push(...Array(7 - remainder).fill(null));
        }
        return cells;
    };

    const cells = generateMonthCells(year, month);
    const today = new Date();
    const isCurrentMonthYear = today.getFullYear() === year && today.getMonth() === month;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="animate-fade-in space-y-8 print:space-y-0 print:m-0 print:p-0">
            {/* NO PRINT UI */}
            <div className="text-center print:hidden">
                <h1 className="section-title">{isHi ? "📆 कैलेंडर जेनरेटर" : "📆 Calendar Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "स्वच्छ, मुद्रण-योग्य मासिक कैलेंडर ग्रिड उत्पन्न करें।" : "Generate clean, print-ready monthly calendar grids instantly."}</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8 print:max-w-none print:w-full print:border-none print:shadow-none bg-slate-900 border border-slate-700/50 p-6 sm:p-12 rounded-3xl shadow-2xl relative">
                
                {/* Controls - Hide on Print */}
                <div className="print:hidden flex flex-wrap gap-4 items-center justify-between mb-8 pb-8 border-b border-slate-700/50">
                    <div className="flex flex-wrap gap-4">
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 font-bold text-slate-200 focus:border-indigo-500"
                        >
                            {months.map((m, idx) => (
                                <option key={idx} value={idx}>{m}</option>
                            ))}
                        </select>
                        
                        <input 
                            type="number" 
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 font-bold text-slate-200 w-32 focus:border-indigo-500 text-center"
                        />

                        <button 
                            onClick={() => { setYear(currentYear); setMonth(currentMonth); }}
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2 text-slate-300 transition-colors text-sm font-medium"
                        >
                            {isHi ? "आज" : "Today"}
                        </button>
                    </div>

                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        {isHi ? "प्रिंट / PDF" : "Print / PDF"}
                    </button>
                </div>

                {/* Printable Calendar Wrapper */}
                <div className="print:block print:text-black print:bg-white inset-0 print:absolute print:min-h-screen">
                    <div className="text-center mb-6">
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-200 print:text-slate-800 tracking-tight">
                            {months[month]} <span className="text-indigo-400 print:text-indigo-600 font-light">{year}</span>
                        </h2>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 border-t border-l border-slate-700 print:border-slate-400 rounded-tl-xl overflow-hidden">
                        {/* Day Headers */}
                        {days.map((d, i) => (
                            <div key={`header-${i}`} className={`text-center py-3 sm:py-4 font-bold uppercase tracking-widest text-xs sm:text-sm border-r border-b border-slate-700 print:border-slate-400 bg-slate-950/50 print:bg-slate-50
                                ${(i === 0 || i === 6) ? 'text-rose-400 print:text-rose-600' : 'text-slate-400 print:text-slate-600'}`}
                            >
                                {d}
                            </div>
                        ))}

                        {/* Calendar Body */}
                        {cells.map((cellDay, index) => {
                            const isWeekend = index % 7 === 0 || index % 7 === 6;
                            const isToday = isCurrentMonthYear && cellDay === today.getDate();
                            const isTodayPrintClass = isToday ? 'ring-2 ring-indigo-500 bg-indigo-500/10 print:bg-slate-100 print:ring-black' : '';
                            
                            return (
                                <div 
                                    key={index} 
                                    className={`relative h-24 sm:h-32 lg:h-40 border-r border-b border-slate-700 print:border-slate-400 p-2 sm:p-4 transition-colors group
                                        ${cellDay ? 'bg-slate-900 print:bg-white hover:bg-slate-800 print:hover:bg-white' : 'bg-slate-950/20 print:bg-slate-50 opacity-50'}
                                        ${isTodayPrintClass}
                                    `}
                                >
                                    {cellDay && (
                                        <div className={`font-bold text-lg sm:text-2xl 
                                            ${isToday ? 'text-indigo-400 print:text-black' : (isWeekend ? 'text-rose-400 print:text-slate-600' : 'text-slate-200 print:text-slate-800')}
                                        `}>
                                            {cellDay}
                                        </div>
                                    )}

                                    {/* Empty area to simulate lines/notes if users print it out */}
                                    {cellDay && (
                                        <div className="mt-2 space-y-1 sm:space-y-2 opacity-10 print:opacity-30">
                                            <div className="w-full h-px bg-slate-400"></div>
                                            <div className="w-full h-px bg-slate-400"></div>
                                            <div className="w-full h-px bg-slate-400"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <div className="print:hidden">
                <FAQSection items={faqs} />
                <ToolLinks current="/calendar-generator" tools={ALL_TOOLS} />
            </div>
            
            {/* Global style override for printing exclusively this component nicely */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    header, footer, nav, .print\\:hidden { // fallback class logic
                        display: none !important;
                    }
                    @page {
                        margin: 1cm;
                        size: landscape;
                    }
                }
            `}</style>
        </div>
    );
}
