"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "How does this calculate times?", questionHi: "यह समय की गणना कैसे करता है?", answer: "It uses a simplified astronomical algorithm to determine the sun's position relative to your GPS coordinates and date.", answerHi: "यह आपके GPS निर्देशांक और दिनांक के सापेक्ष सूर्य की स्थिति निर्धारित करने के लिए एक सरलीकृत खगोलीय एल्गोरिदम का उपयोग करता है।" },
    { question: "Is my location data sent to a server?", questionHi: "क्या मेरा स्थान डेटा किसी सर्वर पर भेजा जाता है?", answer: "No. All calculations happen entirely within your browser on your device.", answerHi: "नहीं। सभी गणनाएँ पूरी तरह आपके डिवाइस पर ब्राउज़र में होती हैं।" },
    { question: "How accurate is this?", questionHi: "यह कितना सटीक है?", answer: "The simplified algorithm is accurate to within ~1-2 minutes for most locations. It accounts for the equation of time and solar declination.", answerHi: "सरलीकृत एल्गोरिदम अधिकांश स्थानों के लिए ~1-2 मिनट की सटीकता प्रदान करता है। यह समय के समीकरण और सौर झुकाव को ध्यान में रखता है।" },
];

// Simplified solar position algorithm
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function getJulianDay(date: Date): number {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

function getSolarNoon(jd: number, longitude: number): number {
    const n = jd - 2451545.0 + 0.0008;
    const Js = Math.floor(n) - longitude / 360;
    const M = (357.5291 + 0.98560028 * Js) % 360;
    const C = 1.9148 * Math.sin(M * DEG2RAD) + 0.02 * Math.sin(2 * M * DEG2RAD) + 0.0003 * Math.sin(3 * M * DEG2RAD);
    const lambda = (M + C + 180 + 102.9372) % 360;
    const Jt = 2451545.0 + Js + 0.0053 * Math.sin(M * DEG2RAD) - 0.0069 * Math.sin(2 * lambda * DEG2RAD);
    return Jt;
}

function getSunriseSunset(date: Date, lat: number, lon: number) {
    const jd = getJulianDay(date);
    const n = jd - 2451545.0 + 0.0008;

    // Mean solar noon
    const Js = Math.floor(n) - lon / 360;

    // Solar mean anomaly
    const M = (357.5291 + 0.98560028 * Js) % 360;

    // Equation of center
    const C = 1.9148 * Math.sin(M * DEG2RAD) + 0.02 * Math.sin(2 * M * DEG2RAD) + 0.0003 * Math.sin(3 * M * DEG2RAD);

    // Ecliptic longitude
    const lambda = (M + C + 180 + 102.9372) % 360;

    // Declination
    const decl = Math.asin(Math.sin(lambda * DEG2RAD) * Math.sin(23.44 * DEG2RAD));

    // Hour angle
    const cosOmega = (Math.sin(-0.833 * DEG2RAD) - Math.sin(lat * DEG2RAD) * Math.sin(decl)) /
        (Math.cos(lat * DEG2RAD) * Math.cos(decl));

    if (cosOmega > 1 || cosOmega < -1) {
        return null; // Sun never rises or sets
    }

    const omega = Math.acos(cosOmega) * RAD2DEG;

    // Equation of time
    const y = Math.tan(23.44 * DEG2RAD / 2);
    const L0 = (280.46646 + M + C) % 360;
    const RA = Math.atan2(Math.cos(23.44 * DEG2RAD) * Math.sin(lambda * DEG2RAD), Math.cos(lambda * DEG2RAD)) * RAD2DEG;
    const eot = (M - RA) * 4; // in minutes (approx)

    // Solar noon in Julian date
    const Jt = 2451545.0 + Js + 0.0053 * Math.sin(M * DEG2RAD) - 0.0069 * Math.sin(2 * lambda * DEG2RAD);

    const sunrise = Jt - (omega / 360);
    const sunset = Jt + (omega / 360);

    return {
        sunrise: julianToDate(sunrise),
        sunset: julianToDate(sunset),
        solarNoon: julianToDate(Jt),
        dayLength: (2 * omega / 360) * 24,
    };
}

function julianToDate(jd: number): Date {
    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;
    let a = z;
    if (z >= 2299161) {
        const alpha = Math.floor((z - 1867216.25) / 36524.25);
        a = z + 1 + alpha - Math.floor(alpha / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const day = b - d - Math.floor(30.6001 * e) + f;
    const month = e < 14 ? e - 1 : e - 13;
    const year = month > 2 ? c - 4716 : c - 4715;

    return new Date(Date.UTC(year, month - 1, Math.floor(day), 0, 0, 0, Math.round((day % 1) * 86400000)));
}

export default function SunriseSunsetPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [lat, setLat] = useState<number | "">("");
    const [lon, setLon] = useState<number | "">("");
    const [result, setResult] = useState<{
        sunrise: Date;
        sunset: Date;
        solarNoon: Date;
        dayLength: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [noRise, setNoRise] = useState(false);

    const getBrowserLocation = () => {
        setIsLocating(true);
        setError(null);
        if (!navigator.geolocation) {
            setError(isHi ? "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।" : "Your browser does not support geolocation.");
            setIsLocating(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
                setIsLocating(false);
            },
            (err) => {
                console.error(err);
                setError(isHi ? "स्थान प्राप्त करने में विफल।" : "Failed to get location.");
                setIsLocating(false);
            }
        );
    };

    useEffect(() => {
        if (lat !== "" && lon !== "" && date) {
            const targetDate = new Date(date + "T12:00:00Z");
            if (isNaN(targetDate.getTime())) return;
            const calc = getSunriseSunset(targetDate, Number(lat), Number(lon));
            if (calc) {
                setResult(calc);
                setNoRise(false);
            } else {
                setResult(null);
                setNoRise(true);
            }
            setError(null);
        } else {
            setResult(null);
            setNoRise(false);
        }
    }, [lat, lon, date]);

    const formatTime = (d: Date | undefined) => {
        if (!d || isNaN(d.getTime())) return "N/A";
        return new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(d);
    };

    const formatDuration = (hours: number) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    const solarEvents = result
        ? [
              { label: isHi ? "सूर्योदय" : "Sunrise", icon: "🌅", time: formatTime(result.sunrise), desc: isHi ? "दिन की शुरुआत" : "Top edge of sun appears" },
              { label: isHi ? "सौर दोपहर" : "Solar Noon", icon: "☀️", time: formatTime(result.solarNoon), desc: isHi ? "सूर्य सबसे ऊँचा" : "Sun at highest point" },
              { label: isHi ? "सूर्यास्त" : "Sunset", icon: "🌇", time: formatTime(result.sunset), desc: isHi ? "दिन का अंत" : "Sun below horizon" },
              { label: isHi ? "दिन की लंबाई" : "Day Length", icon: "⏳", time: formatDuration(result.dayLength), desc: isHi ? "कुल दिन का समय" : "Total daylight duration" },
          ]
        : [];

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌅 सूर्योदय और सूर्यास्त कैलकुलेटर" : "🌅 Sunrise & Sunset Calculator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपने सटीक स्थान के लिए खगोलीय सौर समय खोजें" : "Discover precise astronomical solar times for your exact location"}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Input */}
                <div className="glass-card p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-300 mb-2">{isHi ? "दिनांक" : "Date"}</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-indigo-500 transition-colors" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-300 mb-2">{isHi ? "अक्षांश (Latitude)" : "Latitude"}</label>
                            <input type="number" placeholder="e.g. 28.7041" value={lat} onChange={(e) => setLat(e.target.value ? Number(e.target.value) : "")} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-indigo-500 transition-colors" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-300 mb-2">{isHi ? "देशांतर (Longitude)" : "Longitude"}</label>
                            <input type="number" placeholder="e.g. 77.1025" value={lon} onChange={(e) => setLon(e.target.value ? Number(e.target.value) : "")} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-indigo-500 transition-colors" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={getBrowserLocation} disabled={isLocating} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                            {isLocating ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            )}
                            {isHi ? "मेरा स्थान उपयोग करें" : "Use My Location"}
                        </button>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                    </div>
                </div>

                {/* Results */}
                {result ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        {solarEvents.map((event, i) => (
                            <div key={i} className="glass-card p-5 hover:border-indigo-500/30 transition-colors group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform origin-left">{event.icon}</div>
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">{event.label}</h3>
                                <p className="text-2xl font-black text-white mt-1 mb-2 tracking-tight">{event.time}</p>
                                <p className="text-xs text-slate-500 leading-tight">{event.desc}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-2 border-slate-700/50">
                        <div className="text-5xl mb-4 opacity-50">🌍</div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">
                            {noRise
                                ? (isHi ? "इस स्थान/तिथि पर सूर्य नहीं उगता" : "Sun does not rise at this location/date")
                                : (isHi ? "कोई स्थान निर्धारित नहीं" : "No Location Set")}
                        </h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            {noRise
                                ? (isHi ? "ध्रुवीय क्षेत्रों में यह हो सकता है।" : "This can happen in polar regions.")
                                : (isHi ? "सौर समय की गणना के लिए स्थान दर्ज करें।" : "Enter a location to calculate solar times.")}
                        </p>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/sunrise-sunset" tools={ALL_TOOLS} />
        </div>
    );
}
