"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is an IFSC code?", questionHi: "IFSC कोड क्या है?", answer: "IFSC stands for Indian Financial System Code. It is an 11-character alphanumeric code used to uniquely identify every bank branch participating in online funds transfer systems in India (like NEFT, RTGS, and IMPS).", answerHi: "IFSC का मतलब इंडियन फाइनेंशियल सिस्टम कोड है। यह 11-वर्ण का अल्फ़ान्यूमेरिक कोड है जिसका उपयोग भारत में ऑनलाइन फंड ट्रांसफर सिस्टम (जैसे एनईएफटी, आरटीजीएस और आईएमपीएस) में भाग लेने वाली प्रत्येक बैंक शाखा की विशिष्ट रूप से पहचान करने के लिए किया जाता है।" },
    { question: "How does the IFSC structure work?", questionHi: "IFSC संरचना कैसे काम करती है?", answer: "The first 4 letters represent the bank's name (e.g., SBIN for State Bank of India). The 5th character is always zero (0). The last 6 characters represent the specific branch code.", answerHi: "पहले 4 अक्षर बैंक के नाम (जैसे 'स्टेट बैंक ऑफ इंडिया' के लिए 'एसबीआईएन') का प्रतिनिधित्व करते हैं। 5वां वर्ण हमेशा शून्य (0) होता है। अंतिम 6 अक्षर विशिष्ट शाखा कोड का प्रतिनिधित्व करते हैं।" },
    { question: "Can this tool find my exact branch?", questionHi: "क्या यह उपकरण मेरी सटीक शाखा ढूंढ सकता है?", answer: "This validator confirms the code structure and identifies the parent bank (e.g., 'HDFC Bank'). It does not currently store the massive database of every single physical branch address offline.", answerHi: "यह वैलिडेटर कोड संरचना की पुष्टि करता है और मूल बैंक (उदा. 'एचडीएफसी बैंक') की पहचान करता है। यह वर्तमान में प्रत्येक भौतिक शाखा के पते के विशाल डेटाबेस को ऑफ़लाइन संग्रहीत नहीं करता है।" }
];


// Comprehensive (but lightweight) map of top Indian Bank IFSC prefixes to full string names
const BANK_CODES: Record<string, string> = {
    "SBIN": "State Bank of India",
    "HDFC": "HDFC Bank",
    "ICIC": "ICICI Bank",
    "PUNB": "Punjab National Bank",
    "UTIB": "Axis Bank",
    "KKBK": "Kotak Mahindra Bank",
    "BARB": "Bank of Baroda",
    "CNRB": "Canara Bank",
    "UBIN": "Union Bank of India",
    "IDIB": "Indian Bank",
    "BKID": "Bank of India",
    "MAHB": "Bank of Maharashtra",
    "IOBA": "Indian Overseas Bank",
    "PSIB": "Punjab & Sind Bank",
    "UCBA": "UCO Bank",
    "CBIN": "Central Bank of India",
    "INDB": "IndusInd Bank",
    "YESB": "Yes Bank",
    "FDRL": "Federal Bank",
    "IDFB": "IDFC FIRST Bank",
    "SIBL": "South Indian Bank",
    "KARB": "Karnataka Bank",
    "KVBL": "Karur Vysya Bank",
    "CSBK": "CSB Bank",
    "DCBL": "DCB Bank",
    "CUBK": "City Union Bank",
    "TMBL": "Tamilnad Mercantile Bank",
    "UJVN": "Ujjivan Small Finance Bank",
    "ESAF": "ESAF Small Finance Bank",
    "AUBL": "AU Small Finance Bank",
    "PYTM": "Paytm Payments Bank",
    "AIRP": "Airtel Payments Bank",
    "IPOS": "India Post Payments Bank",
    "JIOP": "Jio Payments Bank",
    "FINO": "Fino Payments Bank",
    "NSDL": "NSDL Payments Bank",
    "CITI": "Citibank",
    "HSBC": "HSBC Bank",
    "SCBL": "Standard Chartered Bank"
};

export default function IfscValidatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [ifsc, setIfsc] = useState("");
    const [touched, setTouched] = useState(false);

    // [Bank Code: 4 Alphabets] [Zero: 0] [Branch Code: 6 Alphanumeric]
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    
    // Strict compliance check
    const isStrictlyValid = ifscRegex.test(ifsc);
    const hasError = touched && ifsc.length > 0 && !isStrictlyValid;

    const getBankInfo = () => {
        if (ifsc.length < 4) return null;
        const code = ifsc.substring(0, 4);
        return {
            code,
            name: BANK_CODES[code] || (isHi ? "वाणिज्यिक बैंक / अन्य निगम" : "Commercial / Cooperative Bank (Not in top 40 lookup)")
        };
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    {isHi ? "इंडिया टूल्स" : "India Tools"}
                </div>
                <h1 className="section-title">{isHi ? "🏦 IFSC कोड वैलिडेटर" : "🏦 IFSC Code Validator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "NEFT / RTGS फंड ट्रांसफर के लिए 11-अंकीय भारतीय बैंक शाखा कोड को सत्यापित और डिकोड करें" : "Verify and decode the 11-character Indian Financial System Code for bank branches"}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Input Card */}
                <div className="glass-card p-6 md:p-10">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isHi ? "11-अक्षरों का IFSC कोड दर्ज करें" : "Enter 11-Character IFSC Code"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={ifsc}
                            onChange={(e) => {
                                setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11));
                                setTouched(true);
                            }}
                            className={`w-full bg-slate-900 border ${hasError ? 'border-rose-500/50 focus:border-rose-500' : isStrictlyValid ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl px-5 py-4 text-center text-3xl font-mono tracking-[0.5em] text-slate-100 placeholder:text-slate-600 outline-none transition-colors uppercase`}
                            placeholder="SBIN0123456"
                            maxLength={11}
                        />
                        {/* Status Icon Indicator */}
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            {isStrictlyValid && (
                                <svg className="w-8 h-8 text-emerald-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            {hasError && (
                                <svg className="w-8 h-8 text-rose-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                        </div>
                    </div>
                    
                    {/* Error Messages */}
                    {hasError && (
                        <div className="mt-4 text-rose-400 text-sm font-medium animate-fade-in text-center space-y-1">
                            {ifsc.length < 11 && <p>{isHi ? "IFSC कोड 11 अक्षरों का होना चाहिए।" : "IFSC must be exactly 11 characters long."}</p>}
                            {ifsc.length === 11 && !/^[A-Z]{4}/.test(ifsc) && <p>{isHi ? "पहले 4 अक्षर अक्षर (A-Z) होने चाहिए।" : "First 4 characters must be letters (A-Z)."}</p>}
                            {ifsc.length === 11 && /^[A-Z]{4}/.test(ifsc) && ifsc[4] !== '0' && <p>{isHi ? "5वां अक्षर शून्य (0) होना चाहिए, अक्षर 'O' नहीं।" : "The 5th character MUST be a numeric zero '0' (not the letter O)."}</p>}
                        </div>
                    )}
                </div>

                {/* Analysis Breakdown */}
                {isStrictlyValid && (
                    <div className="glass-card p-6 md:p-8 border-t-4 border-t-cyan-500 animate-fade-in relative overflow-hidden">
                        
                        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
                            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                            {isHi ? "IFSC टूटना (डिकोडिंग)" : "IFSC Breakdown"}
                        </h3>

                        <div className="space-y-4 relative z-10">
                            
                            {/* Segment 1: Bank Code */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                <div className="bg-cyan-500/20 text-cyan-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-cyan-500/30 tracking-widest w-fit">
                                    {ifsc.substring(0, 4)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-cyan-200">{isHi ? "बैंक का नाम" : "Bank Name Identifier"}</h4>
                                    <p className="text-cyan-300 font-medium text-lg my-1">{getBankInfo()?.name}</p>
                                    <p className="text-sm text-cyan-400/80">{isHi ? "पहले 4 अक्षर मूल बैंक का प्रतिनिधित्व करते हैं।" : "The first 4 alphabetic characters represent the parent bank entity."}</p>
                                </div>
                            </div>

                            {/* Segment 2: Control Zero */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-slate-300 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 w-fit relative group">
                                    {ifsc.substring(4, 5)}
                                    <div className="absolute inset-0 bg-red-500/20 rounded-lg group-hover:bg-red-500/40 transition-colors pointer-events-none"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-200">{isHi ? "नियंत्रण वर्ण (शून्य)" : "Control Character (ZERO)"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{isHi ? "5वां वर्ण भविष्य में उपयोग के लिए आरक्षित है और यह हमेशा संख्यात्मक शून्य '0' होता है।" : "The 5th character is reserved for future use and is strictly set to the numeric zero '0' by the RBI."}</p>
                                </div>
                            </div>

                            {/* Segment 3: Branch Code */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-amber-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 tracking-widest w-fit">
                                    {ifsc.substring(5, 11)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-200">{isHi ? "शाखा कोड" : "Specific Branch Code"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {isHi ? "अंतिम 6 अक्षर (जो संख्यात्मक या वर्णानुक्रमिक हो सकते हैं) अद्वितीय भौतिक या डिजिटल बैंक शाखा की पहचान करते हैं।" : "The final 6 alphanumeric characters identify the unique physical (or digital) branch of the bank."}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/ifsc-validator" tools={ALL_TOOLS} />
        </div>
    );
}
