"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Calendar, Download, Clock, MapPin } from "lucide-react";

export default function IcsGeneratorTool() {
    const [title, setTitle] = useState("Meeting");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const formatICSDate = (dateStr: string, timeStr: string) => {
        if (!dateStr || !timeStr) return "";
        const [year, month, day] = dateStr.split("-");
        const [hour, min] = timeStr.split(":");
        // Basic UTC parsing (append Z) assuming local timezone for simplicity if no library is used
        // Properly parsing to UTC:
        const d = new Date(`${dateStr}T${timeStr}:00`);
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const generateICS = () => {
        const start = formatICSDate(startDate, startTime);
        const end = formatICSDate(endDate, endTime) || start;

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//FileForge//Event Generator//EN",
            "BEGIN:VEVENT",
            `UID:${Date.now()}@fileforge.app`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${title}`,
            `LOCATION:${location}`,
            `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
        link.click();
    };

    return (
        <ToolLayout title="Calendar Event (.ics) Generator" description="Create an iCalendar (.ics) file to share events that work with Google Calendar, Outlook, and Apple Calendar.">
            <div className="max-w-3xl mx-auto space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border">
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold capitalize text-slate-500">Event Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-bold text-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="E.g., Product Launch Meeting" />
                    </div>

                    <div className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-500"/> Start Time</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <h4 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-rose-500"/> End Time</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2 text-slate-500"><MapPin className="w-4 h-4"/> Location / Link</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none" placeholder="E.g., Zoom Link or 123 Main St" />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-semibold text-slate-500">Description / Details</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border rounded-xl outline-none" rows={4} placeholder="E.g., Meeting agenda, preparation notes..." />
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t flex justify-end">
                    <Button onClick={generateICS} disabled={!title || !startDate || !startTime} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg gap-3 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30">
                        <Download className="w-5 h-5"/> Generate .ICS File
                    </Button>
                </div>
            </div>
        </ToolLayout>
    );
}
