"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiCheck, FiX, FiAward, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Habit {
    id: string;
    name: string;
    icon: string;
    createdAt: number;
    history: Record<string, boolean>; // key is YYYY-MM-DD
}

export default function HabitTrackerPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);

    // Days to show (last 7 days)
    const [days, setDays] = useState<{ dateStr: string; label: string; isToday: boolean }[]>([]);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        // Generate last 7 days including today
        const generatedDays = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const isToday = i === 0;
            const label = isToday ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
            generatedDays.push({ dateStr, label, isToday });
        }
        setDays(generatedDays);

        // Load habits
        const saved = localStorage.getItem('fileforge_habits');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setHabits(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setHabits([]);
            }
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (!hasLoaded) return;
        localStorage.setItem('fileforge_habits', JSON.stringify(habits));
    }, [habits, hasLoaded]);

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newHabitName.trim();
        if (!trimmed) return;

        const newHabit: Habit = {
            id: crypto.randomUUID(),
            name: trimmed,
            icon: '🎯', // Default icon, could add picker later
            createdAt: Date.now(),
            history: {}
        };

        setHabits([...habits, newHabit]);
        setNewHabitName('');
    };

    const deleteHabit = (id: string) => {
        if (confirm('Are you sure you want to delete this habit and all its history?')) {
            setHabits(habits.filter(h => h.id !== id));
        }
    };

    const toggleHabitHistory = (habitId: string, dateStr: string) => {
        setHabits(habits.map(h => {
            if (h.id !== habitId) return h;
            const history = { ...h.history };
            if (history[dateStr]) {
                delete history[dateStr]; // Toggle off
            } else {
                history[dateStr] = true; // Toggle on
            }
            return { ...h, history };
        }));
    };

    const calculateCurrentStreak = (habit: Habit) => {
        let streak = 0;
        const d = new Date();
        
        while (true) {
            const dateStr = d.toISOString().split('T')[0];
            if (habit.history[dateStr]) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                // If today is not checked, check yesterday before breaking streak
                if (streak === 0 && d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
                     d.setDate(d.getDate() - 1);
                     continue;
                }
                break;
            }
        }
        return streak;
    };


    if (!hasLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Habit Tracker"
            description="Track your daily habits, build streaks, and stay consistent."
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                {/* Add Habit */}
                <Card className="p-6 bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm border-t-4 border-t-indigo-500">
                    <form onSubmit={handleAddHabit} className="flex gap-3">
                        <Input 
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="What habit do you want to build? (e.g., Read 10 pages, Meditate, Exercise)"
                            className="h-12 shadow-sm text-lg"
                        />
                        <Button type="submit" variant="primary" className="h-12 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shrink-0">
                            <FiPlus size={18} /> Add Habit
                        </Button>
                    </form>
                    <div className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                        <FiAlertCircle size={14} /> Habits and history are saved locally to your current browser.
                    </div>
                </Card>

                {/* Habit Grid */}
                <Card className="p-0 overflow-hidden shadow-xl border-slate-200 dark:border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                                    <th className="p-4 font-semibold text-slate-700 dark:text-slate-200 w-1/3 min-w-[200px]">Habits</th>
                                    {days.map(day => (
                                        <th key={day.dateStr} className={`p-3 text-center text-xs font-semibold ${day.isToday ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-500 dark:text-slate-400'}`}>
                                            <div className="flex flex-col items-center">
                                                <span className="uppercase tracking-wider opacity-70 mb-1">{day.label.split(' ')[0]}</span>
                                                <span className="text-base">{day.isToday ? 'Today' : day.label.split(' ')[1] || ''}</span>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300 w-24">Streak</th>
                                    <th className="p-4 w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {habits.length === 0 ? (
                                    <tr>
                                        <td colSpan={days.length + 3} className="p-12 text-center text-slate-400">
                                            No habits tracking yet. Add one above to get started!
                                        </td>
                                    </tr>
                                ) : (
                                    habits.map(habit => {
                                        const streak = calculateCurrentStreak(habit);
                                        return (
                                            <tr key={habit.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shrink-0">
                                                        {habit.icon}
                                                    </div>
                                                    <span className="font-medium text-slate-800 dark:text-slate-200 text-lg truncate" title={habit.name}>
                                                        {habit.name}
                                                    </span>
                                                </td>
                                                
                                                {days.map(day => {
                                                    const isChecked = !!habit.history[day.dateStr];
                                                    return (
                                                        <td key={day.dateStr} className={`p-2 text-center align-middle ${day.isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                                            <button 
                                                                onClick={() => toggleHabitHistory(habit.id, day.dateStr)}
                                                                className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center transition-all shadow-sm
                                                                    ${isChecked 
                                                                        ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' 
                                                                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-transparent hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                                                    }`}
                                                            >
                                                                {isChecked ? <FiCheck size={20} strokeWidth={3} /> : <FiX size={16} className="opacity-0 hover:opacity-30 text-emerald-500" strokeWidth={3} />}
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                                
                                                <td className="p-4 text-center">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${streak > 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                                        <FiAward size={14} className={streak >= 3 ? 'text-orange-500' : 'opacity-50'} /> {streak}
                                                    </div>
                                                </td>

                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => deleteHabit(habit.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Delete Habit"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>
        </ToolLayout>
    );
}
