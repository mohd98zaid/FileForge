"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is a PAN number?", questionHi: "पैन नंबर क्या है?", answer: "PAN (Permanent Account Number) is a 10-character alphanumeric identifier, issued by the Indian Income Tax Department to all judicial entities identifiable under the Indian Income Tax Act, 1961.", answerHi: "पैन (स्थायी खाता संख्या) एक 10-वर्ण वाला अल्फ़ान्यूमेरिक पहचानकर्ता है, जो भारतीय आयकर विभाग द्वारा भारतीय आयकर अधिनियम, 1961 के तहत पहचाने जा सकने वाली सभी न्यायिक संस्थाओं को जारी किया जाता है।" },
    { question: "Is my PAN stored securely?", questionHi: "क्या मेरा पैन सुरक्षित रूप से संग्रहीत है?", answer: "Your PAN is NEVER stored or sent to any server. This tool completely analyzes the structure of your PAN directly within your browser.", answerHi: "आपका पैन कभी भी किसी सर्वर पर संग्रहीत या भेजा नहीं जाता है। यह उपकरण पूरी तरह से आपके ब्राउज़र में सीधे आपके पैन की संरचना का विश्लेषण करता है।" },
    { question: "What does the 4th letter of a PAN signify?", questionHi: "पैन का चौथा अक्षर क्या दर्शाता है?", answer: "The 4th character represents the status of the PAN holder. For example, 'P' stands for Individual (Person), 'C' for Company, 'H' for Hindu Undivided Family (HUF), 'F' for Firm, etc.", answerHi: "चौथा अक्षर पैन धारक की स्थिति को दर्शाता है। उदाहरण के लिए, 'पी' का अर्थ है व्यक्ति, 'सी' कंपनी के लिए, 'एच' हिंदू अविभाजित परिवार (एचयूएफ) के लिए, 'एफ' फर्म के लिए, आदि।" }
];

export default function PanValidatorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [pan, setPan] = useState("");
    const [touched, setTouched] = useState(false);

    // [A-Z]{5} [0-9]{4} [A-Z]{1}
    const isValidStructure = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    const hasError = touched && pan.length > 0 && !isValidStructure;

    // Entity Types mapping
    const entityTypes: Record<string, string> = {
        'A': 'Association of Persons (AOP)',
        'B': 'Body of Individuals (BOI)',
        'C': 'Company',
        'F': 'Firm / Limited Liability Partnership',
        'G': 'Government Agency',
        'H': 'Hindu Undivided Family (HUF)',
        'L': 'Local Authority',
        'J': 'Artificial Juridical Person',
        'P': 'Individual (Person)',
        'T': 'Trust',
    };

    const getEntityInfo = () => {
        if (!isValidStructure) return null;
        const char = pan.charAt(3);
        return {
            char,
            description: entityTypes[char] || "Unknown Entity Type"
        };
    };

    const getSurnameInfo = () => {
        if (!isValidStructure) return null;
        const char = pan.charAt(4);
        const entity = pan.charAt(3);
        
        let desc = "First letter of your Surname (Last Name).";
        if (entity !== 'P') {
            desc = "First letter of the Entity / Company Name.";
        }
        
        return { char, description: desc };
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    {isHi ? "इंडिया टूल्स" : "India Tools"}
                </div>
                <h1 className="section-title">{isHi ? "💳 पैन कार्ड वैलिडेटर" : "💳 PAN Card Validator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "भारतीय पैन नंबरों के प्रारूप को सत्यापित और डिकोड करें" : "Verify and decode the structure of Indian Permanent Account Numbers completely offline"}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Input Card */}
                <div className="glass-card p-6 md:p-10">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isHi ? "पैन नंबर दर्ज करें" : "Enter PAN Number"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={pan}
                            onChange={(e) => {
                                setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
                                setTouched(true);
                            }}
                            className={`w-full bg-slate-900 border ${hasError ? 'border-rose-500/50 focus:border-rose-500' : isValidStructure ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl px-5 py-4 text-center text-3xl font-mono tracking-[0.5em] text-slate-100 placeholder:text-slate-600 outline-none transition-colors uppercase`}
                            placeholder="ABCDE1234F"
                            maxLength={10}
                        />
                        {/* Status Icon Indicator */}
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            {isValidStructure && (
                                <svg className="w-8 h-8 text-emerald-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                            {hasError && (
                                <svg className="w-8 h-8 text-rose-500 animate-spring-in" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            )}
                        </div>
                    </div>
                    
                    {/* Error Message */}
                    {hasError && (
                        <p className="mt-3 text-rose-400 text-sm font-medium animate-fade-in text-center">
                            {pan.length < 10 
                                ? (isHi ? "पैन नंबर 10 अक्षरों का होना चाहिए।" : "PAN must be exactly 10 characters long.")
                                : (isHi ? "अमान्य प्रारूप। पहले 5 अक्षर होने चाहिए, फिर 4 संख्याएँ, और 1 अक्षर।" : "Invalid format. Must be 5 letters, followed by 4 numbers, ending with 1 letter.")
                            }
                        </p>
                    )}
                    
                    <p className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        {isHi ? "आपका पैन आपके डिवाइस पर स्थानीय रूप से जांचा जाता है।" : "Analyzed locally. Your PAN never leaves your device."}
                    </p>
                </div>

                {/* Analysis Breakdown */}
                {isValidStructure && (
                    <div className="glass-card p-6 md:p-8 border-t-4 border-t-emerald-500 animate-fade-in relative overflow-hidden">
                        
                        {/* Background Watermark/Decoration */}
                        <div className="absolute right-[-20%] top-[-20%] text-[200px] opacity-5 select-none font-black pointer-events-none">
                            {pan}
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2 relative z-10">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            {isHi ? "पैन टूटना (डिकोडिंग)" : "PAN Breakdown"}
                        </h3>

                        <div className="space-y-6 relative z-10">
                            
                            {/* Segment 1: First 3 Letters */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-emerald-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 tracking-widest w-fit">
                                    {pan.substring(0, 3)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200">{isHi ? "क्रमिक अक्षर" : "Alphabetic Sequence"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{isHi ? "AAA से ZZZ तक एक यादृच्छिक रूप से आवंटित 3-अक्षर अनुक्रम।" : "An alphabetically assigned sequence from AAA to ZZZ."}</p>
                                </div>
                            </div>

                            {/* Segment 2: 4th Letter (Entity) */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <div className="bg-indigo-500/20 text-indigo-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-indigo-500/30 w-fit">
                                    {getEntityInfo()?.char}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-indigo-200">{isHi ? "संस्था का प्रकार" : "Entity Status"}</h4>
                                        <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                            {isHi ? "महत्वपूर्ण" : "CRITICAL"}
                                        </span>
                                    </div>
                                    <p className="text-indigo-300 font-medium text-lg my-1">{getEntityInfo()?.description}</p>
                                    <p className="text-sm text-indigo-400/80">{isHi ? "चौथा अक्षर पैन धारक की श्रेणी को परिभाषित करता है।" : "The 4th character dictates what type of legal entity owns this PAN."}</p>
                                </div>
                            </div>

                            {/* Segment 3: 5th Letter (Surname) */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <div className="bg-amber-500/20 text-amber-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-amber-500/30 w-fit">
                                    {getSurnameInfo()?.char}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-amber-200">{isHi ? "उपनाम / कंपनी का नाम" : "Surname / Entity Title"}</h4>
                                    <p className="text-sm text-amber-400/80 mt-1">{getSurnameInfo()?.description}</p>
                                </div>
                            </div>

                            {/* Segment 4: 4 Numbers */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-slate-300 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 tracking-widest w-fit">
                                    {pan.substring(5, 9)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200">{isHi ? "क्रमिक संख्या" : "Sequential Numbers"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{isHi ? "0001 से 9999 तक चलने वाला 4-अंकीय अनुक्रमिक संख्या ब्लॉक।" : "A 4-digit sequential running number block from 0001 to 9999."}</p>
                                </div>
                            </div>

                            {/* Segment 5: Last Letter */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                <div className="bg-slate-800 text-emerald-400 px-4 py-2 font-mono text-xl font-bold rounded-lg border border-slate-700 w-fit">
                                    {pan.substring(9, 10)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200">{isHi ? "सुरक्षा जाँच अक्षर" : "Alphabetic Check Digit"}</h4>
                                    <p className="text-sm text-slate-400 mt-1">{isHi ? "पैन नंबर की सत्यता को सत्यापित करने के लिए सूत्र द्वारा उत्पन्न अंतिम अक्षर।" : "A calculated check character used to verify the validity of the previous 9 alphanumeric characters."}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/pan-validator" tools={ALL_TOOLS} />
        </div>
    );
}
