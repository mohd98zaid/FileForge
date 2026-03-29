"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function RandomGeneratorPage() {
    const t = useTranslations('Tools');
    const locale = useLocale();

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [mode, setMode] = useState<'number' | 'password' | 'coin' | 'dice'>('number');
    
    // Number Generator State
    const [numMin, setNumMin] = useState(1);
    const [numMax, setNumMax] = useState(100);
    const [numCount, setNumCount] = useState(1);
    const [numResult, setNumResult] = useState<number[]>([]);

    // Password State
    const [passLength, setPassLength] = useState(16);
    const [passUpper, setPassUpper] = useState(true);
    const [passLower, setPassLower] = useState(true);
    const [passNums, setPassNums] = useState(true);
    const [passSyms, setPassSyms] = useState(true);
    const [passResult, setPassResult] = useState('');

    // Coin State
    const [coinResult, setCoinResult] = useState<'Heads' | 'Tails' | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    // Dice State
    const [diceSides, setDiceSides] = useState(6);
    const [diceCount, setDiceCount] = useState(1);
    const [diceResult, setDiceResult] = useState<number[]>([]);
    const [isRolling, setIsRolling] = useState(false);

    // Shared State
    const [isCopied, setIsCopied] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    const generateNumber = () => {
        const minVal = Math.ceil(numMin);
        const maxVal = Math.floor(numMax);
        if (minVal > maxVal) {
            alert("Min cannot be greater than Max");
            return;
        }
        if (numCount < 1 || numCount > 1000) {
            alert("Count must be between 1 and 1000");
            return;
        }
        
        const results = [];
        for (let i = 0; i < numCount; i++) {
            results.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
        }
        setNumResult(results);
    };

    const generatePassword = () => {
        if (!passUpper && !passLower && !passNums && !passSyms) {
            alert("Please select at least one character type");
            return;
        }
        
        const upperStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerStr = 'abcdefghijklmnopqrstuvwxyz';
        const numStr = '0123456789';
        const symStr = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        
        let chars = '';
        if (passUpper) chars += upperStr;
        if (passLower) chars += lowerStr;
        if (passNums) chars += numStr;
        if (passSyms) chars += symStr;

        let password = '';
        for (let i = 0; i < passLength; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassResult(password);
    };

    const flipCoin = () => {
        setIsFlipping(true);
        setCoinResult(null);
        setTimeout(() => {
            setCoinResult(Math.random() < 0.5 ? 'Heads' : 'Tails');
            setIsFlipping(false);
        }, 600);
    };

    const rollDice = () => {
        if (diceSides < 2 || diceSides > 100) {
            alert("Dice sides must be between 2 and 100");
            return;
        }
        if (diceCount < 1 || diceCount > 20) {
            alert("Dice count must be between 1 and 20");
            return;
        }

        setIsRolling(true);
        setDiceResult([]);
        setTimeout(() => {
            const results = [];
            for (let i = 0; i < diceCount; i++) {
                results.push(Math.floor(Math.random() * diceSides) + 1);
            }
            setDiceResult(results);
            setIsRolling(false);
        }, 600);
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Random Tools
                </div>
                <h1 className="section-title">🎲 Random Generator</h1>
                <p className="mt-2 text-slate-400">Generate random numbers, secure passwords, roll virtual dice, or flip a virtual coin.</p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                {/* Mode Selector */}
                <div className="flex bg-slate-900 border border-slate-700 p-1.5 rounded-xl shadow-inner gap-1 mx-auto overflow-x-auto w-full max-w-2xl">
                    <button 
                        onClick={() => setMode('number')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${mode === 'number' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        Number
                    </button>
                    <button 
                        onClick={() => setMode('password')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${mode === 'password' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        Password
                    </button>
                    <button 
                        onClick={() => setMode('dice')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${mode === 'dice' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        Dice
                    </button>
                    <button 
                        onClick={() => setMode('coin')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${mode === 'coin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        Coin
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* Input Controls */}
                    <div className="w-full lg:w-1/3 glass-card p-6 shrink-0 border-t-4 border-t-indigo-500">
                        {mode === 'number' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Minimum</label>
                                    <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors" value={numMin} onChange={(e: any) => setNumMin(Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Maximum</label>
                                    <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors" value={numMax} onChange={(e: any) => setNumMax(Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Count</label>
                                    <input type="number" min="1" max="1000" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors" value={numCount} onChange={(e: any) => setNumCount(Number(e.target.value))} />
                                </div>
                                <button onClick={generateNumber} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">
                                    Generate Numbers
                                </button>
                            </div>
                        )}

                        {mode === 'password' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Length: {passLength}</label>
                                    <input 
                                        type="range" min="4" max="128" 
                                        value={passLength} 
                                        onChange={(e) => setPassLength(Number(e.target.value))}
                                        className="w-full accent-indigo-600 mt-2"
                                    />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={passUpper} onChange={(e) => setPassUpper(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                        <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={passLower} onChange={(e) => setPassLower(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                        <span className="text-sm text-slate-300">Lowercase (a-z)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={passNums} onChange={(e) => setPassNums(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                        <span className="text-sm text-slate-300">Numbers (0-9)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={passSyms} onChange={(e) => setPassSyms(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                                        <span className="text-sm text-slate-300">Symbols (!@#$%)</span>
                                    </label>
                                </div>
                                <button onClick={generatePassword} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">
                                    Generate Password
                                </button>
                            </div>
                        )}

                        {mode === 'dice' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Sides per Dice</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                                        value={diceSides}
                                        onChange={(e: any) => setDiceSides(Number(e.target.value))}
                                    >
                                        <option value={4}>d4</option>
                                        <option value={6}>d6 (Standard)</option>
                                        <option value={8}>d8</option>
                                        <option value={10}>d10</option>
                                        <option value={12}>d12</option>
                                        <option value={20}>d20</option>
                                        <option value={100}>d100</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Number of Dice</label>
                                    <input type="number" min="1" max="20" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors" value={diceCount} onChange={(e: any) => setDiceCount(Number(e.target.value))} />
                                </div>
                                <button onClick={rollDice} disabled={isRolling} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:opacity-50">
                                    {isRolling ? 'Rolling...' : 'Roll Dice'}
                                </button>
                            </div>
                        )}

                        {mode === 'coin' && (
                            <div className="space-y-4">
                                <div className="text-sm text-slate-400 text-center py-4">
                                    A simple 50/50 virtual coin toss.
                                </div>
                                <button onClick={flipCoin} disabled={isFlipping} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors mt-2 disabled:opacity-50">
                                    {isFlipping ? 'Flipping...' : 'Flip Coin'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Result Output Area */}
                    <div className="flex-1 w-full min-h-[300px] flex flex-col p-0 overflow-hidden relative glass-card border-t-4 border-slate-700">
                        {/* Copy Button header */}
                        <div className="absolute top-4 right-4 z-10">
                            {((mode === 'number' && numResult.length > 0) || (mode === 'password' && passResult) || (mode === 'dice' && diceResult.length > 0)) && (
                                <button
                                    onClick={() => {
                                        if (mode === 'number') copyToClipboard(numResult.join(', '));
                                        if (mode === 'password') copyToClipboard(passResult);
                                        if (mode === 'dice') copyToClipboard(diceResult.join(', '));
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                                    title="Copy Result"
                                >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 flex items-center justify-center p-8">
                            
                            {/* Number Result */}
                            {mode === 'number' && (
                                numResult.length === 0 ? (
                                    <span className="text-slate-500 font-medium">Click generate to get random numbers</span>
                                ) : (
                                    <div className="w-full">
                                        {numResult.length === 1 ? (
                                            <div className="text-7xl sm:text-9xl font-black text-center text-slate-100 tracking-tighter break-all">
                                                {numResult[0]}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center max-h-[400px] overflow-y-auto w-full custom-scrollbar">
                                                {numResult.map((n, i) => (
                                                    <div key={i} className="px-4 py-2 sm:px-6 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl shadow-sm text-xl sm:text-2xl font-bold text-slate-200 text-center min-w-[3rem]">
                                                        {n}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {numResult.length > 1 && (
                                            <div className="text-center mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                Sum: {numResult.reduce((a, b) => a + b, 0)}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}

                            {/* Password Result */}
                            {mode === 'password' && (
                                !passResult ? (
                                    <span className="text-slate-500 font-medium">Click generate to get a secure password</span>
                                ) : (
                                    <div className="text-center w-full max-w-lg">
                                        <div className="font-mono text-3xl sm:text-4xl text-slate-100 break-all leading-relaxed tracking-wider bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-700 selection:bg-indigo-900/50">
                                            {passResult}
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Coin Result */}
                            {mode === 'coin' && (
                                <div className="text-center perspective-1000 w-full flex flex-col items-center">
                                    <div 
                                        className={`w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-[600ms] shadow-2xl relative preserve-3d
                                            ${isFlipping ? 'animate-[spin_600ms_ease-in-out] scale-125' : ''}
                                            ${coinResult === 'Heads' ? 'bg-indigo-600 text-white border-[12px] border-indigo-700' : 
                                              coinResult === 'Tails' ? 'bg-slate-300 text-slate-800 border-[12px] border-slate-400' :
                                              'bg-slate-800 text-slate-500 border-8 border-slate-700'}
                                        `}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {!isFlipping && (coinResult || '?')}
                                    </div>
                                    <div className={`mt-8 text-2xl font-bold transition-opacity text-slate-200 ${coinResult && !isFlipping ? 'opacity-100' : 'opacity-0'}`}>
                                        It's {coinResult}!
                                    </div>
                                </div>
                            )}

                            {/* Dice Result */}
                            {mode === 'dice' && (
                                diceResult.length === 0 && !isRolling ? (
                                    <span className="text-slate-500 font-medium">Click roll to roll the dice</span>
                                ) : (
                                    <div className={`w-full flex flex-col items-center transition-opacity ${isRolling ? 'opacity-50' : 'opacity-100'}`}>
                                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full max-w-3xl">
                                            {diceResult.map((n, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`w-20 h-20 sm:w-28 sm:h-28 bg-slate-800 text-slate-100 border-4 border-slate-700 rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-black shadow-lg
                                                        ${isRolling ? 'animate-bounce' : ''}`}
                                                    style={{ animationDelay: `${i * 0.05}s` }}
                                                >
                                                    {isRolling ? '...' : n}
                                                </div>
                                            ))}
                                            {isRolling && diceResult.length === 0 && Array.from({length: diceCount}).map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-800 border-4 border-slate-700 rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-black shadow-lg animate-bounce text-slate-500"
                                                    style={{ animationDelay: `${i * 0.05}s` }}
                                                >
                                                    ...
                                                </div>
                                            ))}
                                        </div>
                                        {diceResult.length > 1 && !isRolling && (
                                            <div className="text-center mt-10 text-lg font-bold text-slate-400 uppercase tracking-widest bg-slate-900 border border-slate-800 px-6 py-2 rounded-full">
                                                Total Score: {diceResult.reduce((a, b) => a + b, 0)}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
