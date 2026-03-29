"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is a GSTIN?", questionHi: "GSTIN क्या है?", answer: "GSTIN stands for Goods and Services Tax Identification Number. It is a unique 15-character identity number assigned to every registered taxpayer in India.", answerHi: "GSTIN का मतलब गुड्स एंड सर्विसेज टैक्स आइडेंटिफिकेशन नंबर है। यह भारत में प्रत्येक पंजीकृत करदाता को सौंपा गया एक अद्वितीय 15-वर्ण का पहचान संख्या है।" },
    { question: "How is the GSTIN structured?", questionHi: "GSTIN की संरचना कैसी है?", answer: "The first 2 digits represent the State Code. The next 10 characters are the PAN of the entity. The 13th digit is the entity number within the state. The 14th character is 'Z' by default. The 15th character is a checksum digit.", answerHi: "पहले 2 अंक राज्य कोड का प्रतिनिधित्व करते हैं। अगले 10 वर्ण इकाई के पैन हैं। 13 वां अंक राज्य के भीतर इकाई संख्या है। 14 वां वर्ण डिफ़ॉल्ट रूप से 'Z' है। 15 वां वर्ण एक चेकसम अंक है।" },
    { question: "Is my data safe?", questionHi: "क्या मेरा डेटा सुरक्षित है?", answer: "Yes. The validation and decoding process happens entirely within your web browser. Nothing is sent over the internet.", answerHi: "हाँ। सत्यापन और डिकोडिंग प्रक्रिया पूरी तरह से आपके वेब ब्राउज़र के भीतर होती है। इंटरनेट पर कुछ भी नहीं भेजा जाता है।" }
];

// Mapping of GSTIN State Codes (01 to 38)
const STATE_CODES: Record<string, string> = {
    "01": "Jammu and Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "25": "Daman and Diu",
    "26": "Dadra and Nagar Haveli",
    "27": "Maharashtra",
    "28": "Andhra Pradesh (Old)",
    "29": "Karnataka",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman and Nicobar Islands",
    "36": "Telangana",
    "37": "Andhra Pradesh",
    "38": "Ladakh"
};

export default function GstinValidatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [gstin, setGstin] = useState("");
    const [touched, setTouched] = useState(false);

    // [State Code: 2 digits] [PAN: 10 chars] [Entity: 1 alphanumeric] [Z] [Checksum: 1 alphanumeric]
    // Note: PAN structure: [A-Z]{5}[0-9]{4}[A-Z]{1}
    const gstRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    
    // Looser structure check just to see if it *looks* like a GSTIN before strict validation
    const isBaseFormatValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[A-Z]{1}[0-9A-Z]{1}$/.test(gstin);
    
    // Strict compliance check
    const isStrictlyValid = gstRegex.test(gstin);
    const hasError = touched && gstin.length > 0 && !isStrictlyValid;

    const getStateInfo = () => {
        if (gstin.length < 2) return null;
        const code = gstin.substring(0, 2);
        return {
            code,
            name: STATE_CODES[code] || (isHi ? "अमान्य राज्य कोड" : "Invalid State Code")
        };
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {isHi ? "इंडिया टूल्स" : "India Tools"}
                </div>
                <h1 className="section-title">{isHi ? "🏢 GSTIN वैलिडेटर" : "🏢 GSTIN Validator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "भारतीय गुड्स एंड सर्विसेज टैक्स आइडेंटिफिकेशन नंबर (GSTIN) को डीकोड करें" : "Verify and decode Indian Goods & Services Tax Identification Numbers completely offline"}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Input Card */}
                <div className="glass-card p-6 md:p-10">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isHi ? "15-अंकीय GSTIN दर्ज करें" : "Enter 15-Digit GSTIN"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={gstin}
                            onChange={(e) => {
                                setGstin(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15));
                                setTouched(true);
                            }}
                            className={`w-full bg-slate-900 border ${hasError ? 'border-rose-500/50 focus:border-rose-500' : isStrictlyValid ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl px-4 py-4 sm:px-5 sm:py-5 text-center text-xl sm:text-2xl font-mono tracking-[0.2em] sm:tracking-[0.4em] text-slate-100 placeholder:text-slate-600 outline-none transition-colors uppercase`}
                            placeholder="27ABCDE1234F1Z5"
                            maxLength={15}
                        />
                        {/* Status Icon Indicator */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {isStrictlyValid && (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            {hasError && (
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                        </div>
                    </div>
                    
                    {/* Error Messages */}
                    {hasError && (
                        <div className="mt-4 text-rose-400 text-sm font-medium animate-fade-in text-center space-y-1">
                            {gstin.length < 15 && <p>{isHi ? "GSTIN 15 अक्षरों का होना चाहिए।" : "GSTIN must be exactly 15 characters long."}</p>}
                            {gstin.length === 15 && !isBaseFormatValid && <p>{isHi ? "प्रारूप मेल नहीं खाता: 2 अंक + पैन (10) + 1 अल्फ़ान्यूमेरिक + 1 डिफ़ॉल्ट 'Z' + 1 चेकसम।" : "Structure mismatch: 2 digits + PAN (10 chars) + 1 alphanumeric + 1 Alphabet (usually Z) + 1 checksum."}</p>}
                            {isBaseFormatValid && !isStrictlyValid && gstin[13] !== 'Z' && <p>{isHi ? "14वां अक्षर डिफ़ॉल्ट रूप से 'Z' होना चाहिए।" : "The 14th character must be 'Z' by default."}</p>}
                        </div>
                    )}
                    
                    <p className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        {isHi ? "आपका डेटा कभी भी किसी सर्वर पर नहीं भेजा जाता है।" : "100% Client-Side. We do not store or transmit tax IDs."}
                    </p>
                </div>

                {/* Analysis Breakdown */}
                {isBaseFormatValid && (
                    <div className="glass-card p-6 md:p-8 border-t-4 border-t-indigo-500 animate-fade-in relative overflow-hidden">
                        
                        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            {isHi ? "GSTIN टूटना (डिकोडिंग)" : "GSTIN Breakdown"}
                        </h3>

                        <div className="space-y-4 relative z-10">
                            
                            {/* Segment 1: State Code */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <div className="bg-indigo-500/20 text-indigo-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-indigo-500/30 w-fit">
                                    {gstin.substring(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-indigo-200">{isHi ? "पंजीकृत राज्य" : "Registered State"}</h4>
                                    </div>
                                    <p className="text-indigo-300 font-medium text-lg my-1">{getStateInfo()?.name}</p>
                                    <p className="text-sm text-indigo-400/80">{isHi ? "2-अंकीय राज्य कोड 2011 की जनगणना के आधार पर आवंटित किया गया है।" : "The 2-digit State Code assigned based on the 2011 Census."}</p>
                                </div>
                            </div>

                            {/* Segment 2: PAN */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-slate-300 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 tracking-widest w-fit">
                                    {gstin.substring(2, 12)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-200">{isHi ? "पैन नंबर" : "PAN Number"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{isHi ? "करदाता या इकाई का 10-वर्ण वाला स्थायी खाता संख्या (PAN)।" : "The 10-character Permanent Account Number of the taxpayer or business."}</p>
                                </div>
                            </div>

                            {/* Segment 3: Entity Number */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-amber-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 w-fit">
                                    {gstin.substring(12, 13)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-200">{isHi ? "समान पैन पंजीकरण संख्या" : "Entity Code"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {isHi ? "यह एक ही राज्य के भीतर एक ही पैन के तहत पंजीकरण की संख्या दर्शाता है।" : "Represents the number of registrations within the same state for the same PAN. (e.g., '1' means this is the first registration)."}
                                    </p>
                                </div>
                            </div>

                            {/* Segment 4: Z Default */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-slate-300 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 w-fit">
                                    {gstin.substring(13, 14)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-slate-200">{isHi ? "डिफ़ॉल्ट वर्ण" : "Default Alphabet"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {isHi ? "भविष्य के उपयोग के लिए डिफ़ॉल्ट 'Z' वर्ण रखा गया है।" : "Currently a default 'Z' character reserved for possible future use."}
                                    </p>
                                </div>
                            </div>

                            {/* Segment 5: Checksum */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-emerald-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 w-fit">
                                    {gstin.substring(14, 15)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-emerald-200">{isHi ? "चेकसम अंक" : "Checksum Digit"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {isHi ? "एक अल्फ़ान्यूमेरिक वर्ण जिसका उपयोग त्रुटि का पता लगाने के लिए किया जाता है।" : "An alphanumeric character (A-Z or 0-9) used to detect errors in the previous 14 characters."}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/gstin-validator" tools={ALL_TOOLS} />
        </div>
    );
}
