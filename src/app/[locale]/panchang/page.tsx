"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Sunrise, Sunset, Moon, MapPin, Calendar } from "lucide-react";
import SunCalc from "suncalc";

export default function PanchangTool() {
    const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);
    const [lat, setLat] = useState("28.6139"); // New Delhi
    const [lng, setLng] = useState("77.2090");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        calculatePanchang();
    }, [dateStr, lat, lng]);

    const calculatePanchang = () => {
        const date = new Date(dateStr);
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        
        if (isNaN(latitude) || isNaN(longitude)) return;

        const times = SunCalc.getTimes(date, latitude, longitude);
        const moon = SunCalc.getMoonIllumination(date);
        
        // Approximate Tithi (1 Tithi = 12 degrees difference between Sun and Moon longitude)
        // Here we just use the phase (0 to 1) where 0 = New Moon, 0.5 = Full Moon.
        // 30 Tithis in a lunar month => 360 degrees.
        const tithiNum = Math.floor(moon.phase * 30) + 1;
        const rootTithi = tithiNum > 15 ? tithiNum - 15 : tithiNum;
        const paksha = tithiNum > 15 ? "Krishna Paksha (Waning)" : "Shukla Paksha (Waxing)";

        setData({
            sunrise: times.sunrise.toLocaleTimeString(),
            sunset: times.sunset.toLocaleTimeString(),
            moonIllumination: Math.round(moon.fraction * 100),
            tithi: rootTithi,
            paksha: paksha,
        });
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLat(pos.coords.latitude.toString());
                setLng(pos.coords.longitude.toString());
            });
        }
    };

    return (
        <ToolLayout title="Daily Panchang & Sun Times" description="Calculate precise Sunrise, Sunset, and approximate Moon phase (Tithi) for any location.">
            <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 md:p-8 shadow-sm grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 space-y-4">
                        <div>
                            <label className="text-sm font-semibold flex items-center gap-2 mb-2"><Calendar className="w-4 h-4"/> Date</label>
                            <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="w-full px-4 py-3 border rounded-xl" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-semibold mb-2 block">Latitude</label>
                                <input type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-semibold mb-2 block">Longitude</label>
                                <input type="number" step="0.0001" value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <Button variant="secondary" onClick={getLocation} className="w-full gap-2 text-indigo-600">
                            <MapPin className="w-4 h-4"/> Use My Location
                        </Button>
                    </div>

                    <div className="md:col-span-8">
                        {data && (
                            <div className="grid grid-cols-2 gap-4 h-full">
                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/50 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                                    <Sunrise className="w-12 h-12 text-amber-500 mb-2" />
                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-500">Sunrise</span>
                                    <span className="text-2xl font-bold text-amber-900 dark:text-amber-100">{data.sunrise}</span>
                                </div>
                                <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                                    <Sunset className="w-12 h-12 text-rose-500 mb-2" />
                                    <span className="text-sm font-medium text-rose-700 dark:text-rose-500">Sunset</span>
                                    <span className="text-2xl font-bold text-rose-900 dark:text-rose-100">{data.sunset}</span>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-900/50 rounded-xl flex flex-col items-center justify-center p-6 text-center col-span-2">
                                    <Moon className="w-10 h-10 text-indigo-500 mb-2" />
                                    <div className="grid grid-cols-3 w-full gap-4 mt-2">
                                        <div>
                                            <span className="block text-xs text-indigo-400 font-semibold uppercase">Illumination</span>
                                            <span className="font-bold text-lg">{data.moonIllumination}%</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-indigo-400 font-semibold uppercase">Tithi (Approx)</span>
                                            <span className="font-bold text-lg">{data.tithi}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-indigo-400 font-semibold uppercase">Paksha</span>
                                            <span className="font-bold text-sm leading-tight inline-block mt-1">{data.paksha}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
