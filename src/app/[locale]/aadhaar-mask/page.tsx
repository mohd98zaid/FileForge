"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "What is a Masked Aadhaar?", questionHi: "मास्क्ड आधार क्या है?", answer: "A Masked Aadhaar hides the first 8 digits of your Aadhaar number (e.g., XXXX-XXXX-1234) for privacy and security reasons, exposing only the last 4 digits.", answerHi: "मास्क्ड आधार गोपनीयता और सुरक्षा कारणों से आपके आधार नंबर के पहले 8 अंकों (जैसे, XXXX-XXXX-1234) को छिपा देता है, केवल अंतिम 4 अंकों को उजागर करता है।" },
    { question: "Is Masked Aadhaar legally valid?", questionHi: "क्या मास्क्ड आधार कानूनी रूप से मान्य है?", answer: "Yes. The UIDAI and RBI both recognize Masked Aadhaar/Virtual IDs as valid proofs of identity for eKYC, hotel bookings, and airport verification to prevent identity theft.", answerHi: "हाँ। यूआईडीएआई और आरबीआई दोनों पहचान की चोरी को रोकने के लिए ईकेवाईसी, होटल बुकिंग और हवाई अड्डे के सत्यापन के लिए पहचान के वैध प्रमाण के रूप में मास्क्ड आधार/वर्चुअल आईडी को मान्यता देते हैं।" },
    { question: "Are my Aadhaar details safe here?", questionHi: "क्या मेरे आधार विवरण यहाँ सुरक्षित हैं?", answer: "Absolutely. This tool operates 100% locally in your web browser. Your Aadhaar number is never stored, logged, or transmitted anywhere.", answerHi: "बिल्कुल। यह टूल आपके वेब ब्राउज़र में 100% स्थानीय रूप से संचालित होता है। आपका आधार नंबर कभी भी कहीं भी संग्रहीत, लॉग या प्रसारित नहीं होता है।" }
];

export default function AadhaarMaskPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [aadhaar, setAadhaar] = useState("");
    const [touched, setTouched] = useState(false);
    const [copied, setCopied] = useState(false);

    // Format: 12 digits total. 
    // Usually formatted as "1234 5678 9012" but we accept raw digits.
    const cleanAadhaar = aadhaar.replace(/\D/g, '').substring(0, 12);
    
    // Strict compliance check
    const isStrictlyValid = cleanAadhaar.length === 12;
    const hasError = touched && cleanAadhaar.length > 0 && !isStrictlyValid;

    // Mask the first 8 digits
    const maskedAadhaar = isStrictlyValid ? `XXXX XXXX ${cleanAadhaar.substring(8, 12)}` : "";

    const formatDisplay = (val: string) => {
        const cleaned = val.replace(/\D/g, '').substring(0, 12);
        // Add spaces every 4 digits for better readability
        return cleaned.replace(/(.{4})/g, '$1 ').trim();
    };

    const handleCopy = () => {
        if (!isStrictlyValid) return;
        navigator.clipboard.writeText(maskedAadhaar);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {isHi ? "गोपनीयता उपकरण" : "Privacy Tools"}
                </div>
                <h1 className="section-title">{isHi ? "🛡️ आधार मास्क जनरेटर" : "🛡️ Aadhaar Masker"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "ईकेवाईसी और सुरक्षित साझाकरण के लिए पहले 8 अंकों को सुरक्षित रूप से छिपाएं" : "Securely hide the first 8 digits of your Aadhaar for safe sharing and eKYC"}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Input Card */}
                <div className="glass-card p-6 md:p-10 border-t-4 border-t-blue-500">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {isHi ? "12-अंकीय आधार नंबर दर्ज करें" : "Enter 12-Digit Aadhaar Number"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formatDisplay(aadhaar)}
                            onChange={(e) => {
                                setAadhaar(e.target.value);
                                setTouched(true);
                                setCopied(false);
                            }}
                            className={`w-full bg-slate-900 border ${hasError ? 'border-rose-500/50 focus:border-rose-500' : isStrictlyValid ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-indigo-500'} rounded-xl px-5 py-4 text-center text-3xl sm:text-4xl font-mono tracking-widest text-slate-100 placeholder:text-slate-600 outline-none transition-colors`}
                            placeholder="1234 5678 9012"
                        />
                        {/* Clear Button */}
                        {cleanAadhaar.length > 0 && (
                            <button 
                                onClick={() => { setAadhaar(""); setTouched(false); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-400 transition-colors bg-slate-800 rounded-lg"
                                aria-label="Clear Input"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        )}
                    </div>
                    
                    {/* Error Messages */}
                    {hasError && (
                        <div className="mt-4 text-rose-400 text-sm font-medium animate-fade-in text-center space-y-1">
                            {cleanAadhaar.length < 12 && <p>{isHi ? "आधार नंबर ठीक 12 अंकों का होना चाहिए।" : "Aadhaar must be exactly 12 digits long."}</p>}
                        </div>
                    )}

                    {/* Result Card (Inside Input Card for visual cohesion) */}
                    <div className={`mt-8 transition-all duration-500 overflow-hidden ${isStrictlyValid ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-xl relative overflow-hidden group">
                            
                            {/* Watermark Logo */}
                            <div className="absolute right-[-10%] top-[-20%] opacity-[0.03] select-none pointer-events-none">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L3 7l1.5 5 2.5 5 5 5 5-5 2.5-5L21 7l-9-5zm0 2.8l7 3.9-1.2 3.9-2 3.9L12 19.8l-3.8-3.2-2-3.9L5 8.7l7-3.9z"/>
                                </svg>
                            </div>

                            <label className="block text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                {isHi ? "मास्क्ड परिणाम" : "Masked Output Generated"}
                            </label>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                                <div className="flex-1 bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-center relative overflow-hidden">
                                     {/* Fake Holo Line effect */}
                                     <div className="absolute top-0 bottom-0 left-[-100%] w-[50%] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>
                                     
                                     <span className="text-3xl sm:text-4xl font-mono tracking-widest text-slate-200">
                                         {maskedAadhaar}
                                     </span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center justify-center min-w-[120px] gap-2 px-6 py-4 rounded-lg font-bold transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {isHi ? "कॉपी किया!" : "Copied!"}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                            {isHi ? "कॉपी करें" : "Copy"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* Informational Cards */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
                 <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-xl flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-200">{isHi ? "100% ऑफ़लाइन और निजी" : "100% Offline & Private"}</h4>
                        <p className="text-sm text-slate-400 mt-1">{isHi ? "हम आपका डेटा लॉग या सहेजते नहीं हैं। मास्किंग आपके ब्राउज़र में ही होती है।" : "We do not log or save your data. The masking happens purely inside your browser."}</p>
                    </div>
                 </div>
                 <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-xl flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-200">{isHi ? "eKYC अनुपालन" : "eKYC Compliant"}</h4>
                        <p className="text-sm text-slate-400 mt-1">{isHi ? "दस्तावेज़ भेजते समय दुरुपयोग को रोकने के लिए बैंक और होटल मास्क्ड आधार स्वीकार करते हैं।" : "Banks and hotels accept Masked Aadhaar to prevent misuse when submitting identity documents."}</p>
                    </div>
                 </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/aadhaar-mask" tools={ALL_TOOLS} />
        </div>
    );
}
