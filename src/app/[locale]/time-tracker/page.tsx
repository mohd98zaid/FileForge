"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Play, Pause, Square, History, Trash2, Download } from "lucide-react";

interface Record {
    id: string;
    task: string;
    duration: number; // in seconds
    date: Date;
}

export default function TimeTrackerTool() {
    const [currentTask, setCurrentTask] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [records, setRecords] = useState<Record[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsRunning(!isRunning);

    const stopTimer = () => {
        if (time > 0) {
            const newRecord: Record = {
                id: Math.random().toString(36).substring(7),
                task: currentTask || "Untitled Task",
                duration: time,
                date: new Date()
            };
            setRecords([newRecord, ...records]);
        }
        setIsRunning(false);
        setTime(0);
        setCurrentTask("");
    };

    const deleteRecord = (id: string) => {
        setRecords(records.filter(r => r.id !== id));
    };

    const exportCsv = () => {
        const headers = ["Date", "Task", "Duration (HH:MM:SS)", "Duration (Seconds)"];
        const rows = records.map(r => [
            r.date.toLocaleDateString(),
            `"${r.task.replace(/"/g, '""')}"`,
            formatTime(r.duration),
            r.duration
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `time_tracking_${Date.now()}.csv`;
        link.click();
    };

    return (
        <ToolLayout title="Online Time Tracker" description="Track your work hours manually and export the timesheet for billing or productivity analysis.">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Timer Section */}
                <div className="bg-white dark:bg-slate-900 border rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none flex flex-col items-center">
                    
                    <input 
                        type="text" 
                        value={currentTask} 
                        onChange={(e) => setCurrentTask(e.target.value)} 
                        placeholder="What are you working on?" 
                        className="w-full max-w-xl text-center text-xl md:text-2xl font-medium border-b-2 border-slate-200 dark:border-slate-800 bg-transparent py-2 mb-10 outline-none focus:border-indigo-500 transition-colors"
                    />

                    <div className="text-7xl md:text-[8rem] font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100 drop-shadow-sm mb-12">
                        {formatTime(time)}
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            onClick={toggleTimer} 
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRunning ? 'bg-amber-100 hover:bg-amber-200 text-amber-600' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:scale-105'}`}
                        >
                            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-2" />}
                        </Button>

                        {(time > 0 || isRunning) && (
                            <Button 
                                onClick={stopTimer} 
                                className="w-20 h-20 rounded-full flex items-center justify-center bg-rose-100 hover:bg-rose-200 text-rose-600 transition-all hover:scale-105"
                            >
                                <Square className="w-8 h-8" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Records Section */}
                {records.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 border rounded-2xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-slate-800">
                            <h3 className="text-xl font-bold flex items-center gap-2"><History className="w-5 h-5"/> Recent Entries</h3>
                            <Button onClick={exportCsv} variant="secondary" className="gap-2">
                                <Download className="w-4 h-4"/> Export CSV
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {records.map(record => (
                                <div key={record.id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition shadow-sm">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-4">{record.task}</h4>
                                        <p className="text-xs text-slate-500">{record.date.toLocaleDateString()} at {record.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">{formatTime(record.duration)}</span>
                                        <button onClick={() => deleteRecord(record.id)} className="text-slate-400 hover:text-rose-500 transition"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
