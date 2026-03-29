"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiMaximize2, FiMinimize2, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Criterion {
    id: string;
    name: string;
    weight: number; // 1 to 5
}

interface Option {
    id: string;
    name: string;
    scores: Record<string, number>; // criterionId -> score (1 to 10)
}

export default function DecisionMatrixPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const savedCriteria = localStorage.getItem('fileforge_dm_criteria');
        const savedOptions = localStorage.getItem('fileforge_dm_options');
        
        if (savedCriteria && savedOptions) {
            try {
                setCriteria(JSON.parse(savedCriteria));
                setOptions(JSON.parse(savedOptions));
            } catch (e) {
                // Ignore parse errors, fall back to default
                loadDefaults();
            }
        } else {
            loadDefaults();
        }
        setHasLoaded(true);
    }, []);

    const loadDefaults = () => {
        const c1 = crypto.randomUUID();
        const c2 = crypto.randomUUID();
        const c3 = crypto.randomUUID();
        setCriteria([
            { id: c1, name: 'Cost', weight: 4 },
            { id: c2, name: 'Quality', weight: 5 },
            { id: c3, name: 'Speed', weight: 3 },
        ]);
        setOptions([
            { id: crypto.randomUUID(), name: 'Option A', scores: { [c1]: 4, [c2]: 8, [c3]: 7 } },
            { id: crypto.randomUUID(), name: 'Option B', scores: { [c1]: 8, [c2]: 5, [c3]: 9 } },
        ]);
    };

    useEffect(() => {
        if (!hasLoaded) return;
        localStorage.setItem('fileforge_dm_criteria', JSON.stringify(criteria));
        localStorage.setItem('fileforge_dm_options', JSON.stringify(options));
    }, [criteria, options, hasLoaded]);

    const handleClear = () => {
        if (confirm('Are you sure you want to clear the entire matrix?')) {
            setCriteria([]);
            setOptions([]);
        }
    };

    // --- Criteria Handlers ---
    const addCriterion = () => {
        const id = crypto.randomUUID();
        setCriteria([...criteria, { id, name: `Criterion ${criteria.length + 1}`, weight: 3 }]);
    };

    const updateCriterionName = (id: string, name: string) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, name } : c));
    };

    const updateCriterionWeight = (id: string, weightStr: string) => {
        const weight = parseInt(weightStr, 10);
        if (isNaN(weight)) return;
        setCriteria(criteria.map(c => c.id === id ? { ...c, weight: Math.min(Math.max(weight, 1), 5) } : c));
    };

    const removeCriterion = (id: string) => {
        setCriteria(criteria.filter(c => c.id !== id));
        // Clean up scores
        setOptions(options.map(opt => {
            const newScores = { ...opt.scores };
            delete newScores[id];
            return { ...opt, scores: newScores };
        }));
    };

    // --- Options Handlers ---
    const addOption = () => {
        setOptions([...options, { id: crypto.randomUUID(), name: `Option ${options.length + 1}`, scores: {} }]);
    };

    const updateOptionName = (id: string, name: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, name } : o));
    };

    const updateOptionScore = (optId: string, criteriaId: string, scoreStr: string) => {
        let score = parseInt(scoreStr, 10);
        if (isNaN(score)) score = 0;
        else score = Math.min(Math.max(score, 0), 10); // score 0 to 10

        setOptions(options.map(o => {
            if (o.id !== optId) return o;
            return { ...o, scores: { ...o.scores, [criteriaId]: score } };
        }));
    };

    const removeOption = (id: string) => {
        if (options.length <= 1) return;
        setOptions(options.filter(o => o.id !== id));
    };

    // --- Calculations ---
    const calculateTotalScore = (opt: Option) => {
        let total = 0;
        criteria.forEach(c => {
            const score = opt.scores[c.id] || 0;
            total += score * c.weight;
        });
        return total;
    };

    const sortedOptions = [...options].sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));
    const winnerId = sortedOptions.length > 0 && calculateTotalScore(sortedOptions[0]) > 0 ? sortedOptions[0].id : null;

    if (!hasLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Decision Matrix"
            description="Make logical decisions by weighting criteria and scoring options objectively."
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-6">

                {/* Header Controls */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                        <FiAlertCircle size={14} /> Matrix auto-saves to your browser
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleClear} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900 dark:hover:bg-rose-500/10 dark:text-rose-400">
                            <FiTrash2 size={16} className="mr-2" /> Clear Matrix
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    <Card className="p-0 border-slate-200 dark:border-slate-800 shadow-xl min-w-[800px]">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                {/* Criteria row */}
                                <tr>
                                    <th className="w-48 p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-r border-slate-200 dark:border-slate-800 align-bottom">
                                        <div className="font-bold text-slate-700 dark:text-slate-200 mb-2">Options \ Criteria</div>
                                    </th>
                                    {criteria.map((c, i) => (
                                        <th key={c.id} className="p-4 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 relative group">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        value={c.name}
                                                        onChange={(e) => updateCriterionName(c.id, e.target.value)}
                                                        className="font-semibold text-slate-800 dark:text-slate-100 h-9"
                                                        placeholder="Criterion Name"
                                                    />
                                                    <button 
                                                        onClick={() => removeCriterion(c.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-100 dark:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 z-10"
                                                        title="Remove Criterion"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    Weight (1-5):
                                                    <Input 
                                                        type="number"
                                                        min="1" max="5"
                                                        value={c.weight}
                                                        onChange={(e) => updateCriterionWeight(c.id, e.target.value)}
                                                        className="w-16 h-7 text-center font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                    <th className="w-40 p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 align-middle text-center">
                                        <Button variant="secondary" size="sm" onClick={addCriterion} className="gap-1 border-dashed w-full justify-center">
                                            <FiPlus size={14} /> Add Criteria
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Options Rows */}
                                {options.map(opt => {
                                    const totalScore = calculateTotalScore(opt);
                                    const isWinner = winnerId === opt.id;
                                    
                                    return (
                                        <tr key={opt.id} className={`${isWinner ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-900'} transition-colors group`}>
                                            <td className={`p-4 border-b border-r border-slate-200 dark:border-slate-800 relative ${isWinner ? 'border-l-4 border-l-indigo-500 pl-3' : 'border-l-4 border-l-transparent pl-4'}`}>
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        value={opt.name}
                                                        onChange={(e) => updateOptionName(opt.id, e.target.value)}
                                                        className={`font-semibold ${isWinner ? 'text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' : 'text-slate-700 dark:text-slate-200'} h-10`}
                                                        placeholder="Option Name"
                                                    />
                                                    <button 
                                                        onClick={() => removeOption(opt.id)}
                                                        disabled={options.length <= 1}
                                                        className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 rounded bg-slate-50 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2"
                                                        title="Remove Option"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            
                                            {criteria.map(c => {
                                                const score = opt.scores[c.id] || 0;
                                                return (
                                                    <td key={c.id} className="p-4 border-b border-r border-slate-200 dark:border-slate-800 text-center">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <Input 
                                                                    type="number"
                                                                    min="0" max="10"
                                                                    value={score || ''}
                                                                    onChange={(e) => updateOptionScore(opt.id, c.id, e.target.value)}
                                                                    className={`w-16 h-10 text-center font-bold text-lg ${score > 0 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 bg-slate-50 dark:bg-slate-800/50'}`}
                                                                    placeholder="0"
                                                                />
                                                                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    × {c.weight}
                                                                </span>
                                                            </div>
                                                            <div className="text-[10px] uppercase font-bold text-indigo-500/70 tracking-wider">
                                                                Points: {score * c.weight}
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            
                                            <td className={`p-4 border-b border-slate-200 dark:border-slate-800 text-center font-black text-2xl ${isWinner ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                {totalScore}
                                            </td>
                                        </tr>
                                    );
                                })}
                                
                                {/* Add Option Row */}
                                <tr>
                                    <td className="p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                        <Button variant="secondary" onClick={addOption} className="w-full gap-2 justify-center border-dashed">
                                            <FiPlus size={16} /> Add Option
                                        </Button>
                                    </td>
                                    <td colSpan={criteria.length + 1} className="p-4 bg-slate-50 dark:bg-slate-900/50">
                                        <div className="text-sm text-slate-500 italic">Score each option from 0-10 on each criterion. The matrix multiplies the score by the criterion's weight to calculate the total points.</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </div>

                {/* Results Summary */}
                {winnerId && (
                    <Card className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-center animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Decision Recommendation</h2>
                        <p className="text-lg text-slate-700 dark:text-slate-300">
                            Based on your weights and scores, <strong className="text-indigo-600 dark:text-indigo-400 text-2xl ml-1 mr-1">{options.find(o => o.id === winnerId)?.name}</strong> is the best option with <strong className="text-indigo-600 dark:text-indigo-400">{calculateTotalScore(sortedOptions[0])}</strong> points.
                        </p>
                    </Card>
                )}

            </div>
        </ToolLayout>
    );
}
