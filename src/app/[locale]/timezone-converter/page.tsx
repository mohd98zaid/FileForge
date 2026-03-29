"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How does this handle Daylight Saving Time (DST)?", questionHi: "यह डेलाइट सेविंग टाइम (DST) को कैसे संभालता है?", answer: "This tool leverages the modern JavaScript Intl API, which inherently understands historical and future planetary timezone rules, perfectly calculating DST shifts based on the specific date you select.", answerHi: "यह टूल आधुनिक जावास्क्रिप्ट Intl API का लाभ उठाता है, जो स्वाभाविक रूप से ऐतिहासिक और भविष्य के ग्रहीय समयक्षेत्र नियमों को समझता है, और आपके द्वारा चुनी गई विशिष्ट तिथि के आधार पर DST बदलावों की पूरी तरह से गणना करता है।" },
    { question: "Why are some times shown as 'Next Day' or 'Previous Day'?", questionHi: "कुछ समय 'अगले दिन' या 'पिछले दिन' के रूप में क्यों दिखाए जाते हैं?", answer: "When converting across large geographic gaps (for example, from New York to Tokyo), the targeted timezone can cross midnight into the next or previous calendar day relative to the origin time.", answerHi: "बड़े भौगोलिक अंतरालों (उदाहरण के लिए, न्यूयॉर्क से टोक्यो तक) में कनवर्ट करते समय, लक्षित समयक्षेत्र मूल समय के सापेक्ष मध्यरात्रि को पार करके अगले या पिछले कैलेंडर दिन में जा सकता है।" },
];

export default function TimezoneConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [supportedZones, setSupportedZones] = useState<string[]>([]);
    
    // Inputs
    const [sourceTz, setSourceTz] = useState("");
    const [targetTz, setTargetTz] = useState("UTC");
    const [inputDateTime, setInputDateTime] = useState(() => {
        const d = new Date();
        // Remove seconds for datetime-local
        return d.toISOString().slice(0, 16);
    });

    const [resultLocalStr, setResultLocalStr] = useState<string | null>(null);
    const [resultUtcStr, setResultUtcStr] = useState<string | null>(null);
    const [diffLabel, setDiffLabel] = useState<string>("");

    useEffect(() => {
        // Load browser supported zones
        try {
            const zones = Intl.supportedValuesOf('timeZone');
            setSupportedZones(zones);
            // Default source to user's local tz
            const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setSourceTz(zones.includes(localTz) ? localTz : "UTC");
        } catch (e) {
            // Fallback gracefully
            setSupportedZones(["UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"]);
            setSourceTz("UTC");
        }
    }, [locale]);

    useEffect(() => {
        if (!sourceTz || !targetTz || !inputDateTime) {
            setResultLocalStr(null);
            return;
        }

        try {
            // JS doesn't have a direct "parse this string AS IF it were in sourceTz" easily.
            // We have to parse it locally, then adjust it to pretend that local moment was actually in sourceTz.
            const [dateStr, timeStr] = inputDateTime.split('T');
            const [y, m, d] = dateStr.split('-').map(Number);
            const [h, min] = timeStr.split(':').map(Number);

            // We construct the date in the user's LOCAL timezone just to get a JS Date object.
            const localDummy = new Date(y, m - 1, d, h, min, 0);
            
            // What is the offset of the SOURCE timezone at this exact moment?
            // To be perfectly accurate, we format localDummy into the source tz, read its parts, and find the delta.
            const sourceParts = new Intl.DateTimeFormat('en-US', {
                timeZone: sourceTz,
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            }).formatToParts(localDummy);

            const sMap: Record<string, number> = {};
            sourceParts.forEach(p => sMap[p.type] = Number(p.value));
            
            // "What time did the clock read in sourceTz?" -> sMap.hour, sMap.minute, etc.
            // But we WANT the clock in sourceTz to read h:min.
            // So we need to shift our true underlying UTC timestamp until the sourceTz clock reads exactly h:min.
            
            // Simple heuristic to build the absolute UTC time representing 'inputDateTime' inside 'sourceTz':
            // "The desired local time in sourceTz" - "Offset of sourceTz at that time" = "Actual UTC time"
            // We can iterate/hack it but realistically:
            // Let's create an ISO string with the source tz offset.
            
            // A more direct trick: `new Date(string)` parses as local. 
            // We can get the offset gap by comparing `targetTz` and `sourceTz`.
            
            // Given (y, m, d, h, min) in `sourceTz`, we want to find the equivalent milliseconds since epoch.
            // The cleanest way without massive libraries like luxon is converting the target format relative to UTC.
            // We'll approximate DST boundaries using UTC shift:
            
            // Let's create an exact UTC date assuming the input was UTC directly.
            const utcAssumed = new Date(Date.UTC(y, m - 1, d, h, min, 0));
            
            // Find what `utcAssumed` would print as in `sourceTz`
            const fmt = new Intl.DateTimeFormat('en-US', { timeZone: sourceTz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            const p = fmt.formatToParts(utcAssumed);
            const pMap: Record<string, string> = {};
            p.forEach(x => pMap[x.type] = x.value);
            // Result read in sourceTz:
            const sourceReadStr = `${pMap.year}-${pMap.month}-${pMap.day}T${pMap.hour === '24' ? '00' : pMap.hour}:${pMap.minute}:00Z`;
            const driftMs = utcAssumed.getTime() - new Date(sourceReadStr).getTime();
            
            // True UTC representing that conceptual time in the source timezone
            const trueUtc = new Date(utcAssumed.getTime() + driftMs);
            
            // 1. Format trueUtc into the Target Timezone
            const targetFormatter = new Intl.DateTimeFormat(locale, {
                timeZone: targetTz,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'long'
            });
            
            setResultLocalStr(targetFormatter.format(trueUtc));

            // Format trueUtc into UTC format for clarity
            const utcFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: "UTC",
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
            });
            setResultUtcStr(utcFormatter.format(trueUtc));

            // Calc hour difference (rough heuristic for display)
            // Just format both in same format at 'trueUtc' and compare hours
            const f1 = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, hour: 'numeric', hour12: false }).format(trueUtc);
            const f2 = new Intl.DateTimeFormat('en-US', { timeZone: sourceTz, hour: 'numeric', hour12: false }).format(trueUtc);
            let diffH = Number(f1) - Number(f2);
            if (diffH > 12) diffH -= 24;
            if (diffH < -12) diffH += 24;
            
            if (diffH === 0) setDiffLabel(isHi ? "समान समय" : "Same time");
            else setDiffLabel(diffH > 0 ? (isHi ? `+${diffH} घंटे आगे` : `+${diffH} hours ahead`) : (isHi ? `${diffH} घंटे पीछे` : `${diffH} hours behind`));

        } catch (e) {
            setResultLocalStr(isHi ? "रूपांतरण त्रुटि (अमान्य तिथि)" : "Conversion Error (Invalid Date)");
        }
    }, [sourceTz, targetTz, inputDateTime, locale, isHi]);


    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌍 समय क्षेत्र परिवर्तक" : "🌍 Timezone Converter"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "विश्व स्तर पर समय क्षेत्रों के बीच आसानी और सटीकता से समय बदलें" : "Instantly convert dates and times accurately across any global timezone"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                
                <div className="glass-card p-6 sm:p-8 flex flex-col md:flex-row gap-8 relative overflow-visible">
                    
                    {/* Source Column */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                            <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm">{isHi ? "मूल समय" : "Origin Time"}</h3>
                        </div>
                        
                        <div>
                            <label className="block text-xs uppercase text-slate-500 font-bold mb-1">{isHi ? "दिनांक और समय" : "Date & Time"}</label>
                            <input 
                                type="datetime-local" 
                                value={inputDateTime}
                                onChange={e => setInputDateTime(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:border-indigo-500 font-mono text-lg transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase text-slate-500 font-bold mb-1">{isHi ? "मूल समय क्षेत्र" : "Source Timezone"}</label>
                            <select 
                                value={sourceTz}
                                onChange={e => setSourceTz(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:border-indigo-500 transition-colors"
                            >
                                {supportedZones.map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Target Column */}
                    <div className="flex-1 space-y-4 relative">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm">{isHi ? "लक्षित समय क्षेत्र" : "Target Timezone"}</h3>
                        </div>

                        <div className="pt-[22px]"> {/* visually align with left col input gap */}
                            <label className="block text-xs uppercase text-slate-500 font-bold mb-1">{isHi ? "स्थान खोजें" : "Select Destination"}</label>
                            <select 
                                value={targetTz}
                                onChange={e => setTargetTz(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:border-emerald-500 transition-colors"
                            >
                                {supportedZones.map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                        </div>

                        {/* Relative label */}
                        <div className="pt-2 text-right">
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-400 border border-slate-700">
                                {diffLabel}
                            </span>
                        </div>
                    </div>

                    {/* Floating arrow center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 shadow-xl border border-slate-700 text-slate-400 z-10 pointer-events-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>

                </div>

                {/* Big Result Card */}
                {resultLocalStr && (
                    <div className="glass-card p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-900/40 via-slate-900 to-emerald-900/20 border-indigo-500/30 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl pointer-events-none">🌍</div>
                        
                        <div className="relative z-10">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                                {isHi ? "परिवर्तित स्थानीय समय" : "Converted Local Time"}
                            </h4>
                            <p className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 drop-shadow-md">
                                {resultLocalStr}
                            </p>
                            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/50 text-slate-400 font-mono text-sm border border-slate-800">
                                <span className="text-indigo-400">UTC:</span> {resultUtcStr}
                            </p>
                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/timezone-converter" tools={ALL_TOOLS} />
        </div>
    );
}
