"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";

type Matrix = number[][];

export default function MatrixCalculatorTool() {
    const [size, setSize] = useState(3);
    
    // Create matrix of given size
    const createMatrix = (s: number): Matrix => Array(s).fill(0).map(() => Array(s).fill(0));

    const [matA, setMatA] = useState<Matrix>(createMatrix(3));
    const [matB, setMatB] = useState<Matrix>(createMatrix(3));
    const [result, setResult] = useState<Matrix | null>(null);
    const [operation, setOperation] = useState("+");
    const [error, setError] = useState("");

    const updateMatA = (r: number, c: number, val: string) => {
        const newM = [...matA.map(row => [...row])];
        newM[r][c] = parseFloat(val) || 0;
        setMatA(newM);
    };

    const updateMatB = (r: number, c: number, val: string) => {
        const newM = [...matB.map(row => [...row])];
        newM[r][c] = parseFloat(val) || 0;
        setMatB(newM);
    };

    const handleSizeChange = (s: number) => {
        setSize(s);
        setMatA(createMatrix(s));
        setMatB(createMatrix(s));
        setResult(null);
        setError("");
    };

    const calculate = () => {
        setError("");
        let res = createMatrix(size);

        try {
            if (operation === "+") {
                for (let i=0; i<size; i++) 
                    for (let j=0; j<size; j++) 
                        res[i][j] = matA[i][j] + matB[i][j];
            } else if (operation === "-") {
                for (let i=0; i<size; i++) 
                    for (let j=0; j<size; j++) 
                        res[i][j] = matA[i][j] - matB[i][j];
            } else if (operation === "*") {
                for (let i=0; i<size; i++) {
                    for (let j=0; j<size; j++) {
                        let sum = 0;
                        for (let k=0; k<size; k++) {
                            sum += matA[i][k] * matB[k][j];
                        }
                        res[i][j] = sum;
                    }
                }
            } else if (operation === "detA") {
                if (size === 2) {
                    res = [[matA[0][0]*matA[1][1] - matA[0][1]*matA[1][0]]];
                } else if (size === 3) {
                    const det = matA[0][0]*(matA[1][1]*matA[2][2] - matA[1][2]*matA[2][1])
                              - matA[0][1]*(matA[1][0]*matA[2][2] - matA[1][2]*matA[2][0])
                              + matA[0][2]*(matA[1][0]*matA[2][1] - matA[1][1]*matA[2][0]);
                    res = [[det]];
                } else {
                    throw new Error("Determinant limited to 2x2 and 3x3 for now.");
                }
            }
            setResult(res);
        } catch (err: any) {
            setError(err.message || "Computation error");
            setResult(null);
        }
    };

    return (
        <ToolLayout title="Matrix Calculator" description="Add, subtract, multiply matrices or calculate determinants instantly.">
            <div className="max-w-5xl mx-auto space-y-8 flex flex-col items-center">
                
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => handleSizeChange(2)} className={`px-6 py-2 rounded-md ${size === 2 ? 'bg-white shadow font-bold text-indigo-600' : 'text-slate-500'}`}>2x2</button>
                    <button onClick={() => handleSizeChange(3)} className={`px-6 py-2 rounded-md ${size === 3 ? 'bg-white shadow font-bold text-indigo-600' : 'text-slate-500'}`}>3x3</button>
                    <button onClick={() => handleSizeChange(4)} className={`px-6 py-2 rounded-md ${size === 4 ? 'bg-white shadow font-bold text-indigo-600' : 'text-slate-500'}`}>4x4</button>
                </div>

                {error && <div className="text-red-500 font-bold bg-red-50 p-4 rounded-xl">{error}</div>}

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full p-8 bg-slate-50 rounded-2xl border">
                    {/* Matrix A */}
                    <div className="flex flex-col items-center">
                        <span className="font-bold mb-4 text-slate-500">Matrix A</span>
                        <div className={`grid gap-2 border-l-2 border-r-2 border-slate-400 p-4 rounded-lg bg-white`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                            {matA.map((row, r) => row.map((val, c) => (
                                <input 
                                    key={`A-${r}-${c}`} 
                                    type="number" 
                                    value={val.toString()} 
                                    onChange={(e) => updateMatA(r, c, e.target.value)}
                                    className="w-16 h-16 text-center text-lg font-mono bg-slate-50 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            )))}
                        </div>
                    </div>

                    {/* Operations */}
                    <div className="flex flex-col gap-2">
                        {['+', '-', '*', 'detA'].map(op => (
                            <button 
                                key={op} 
                                onClick={() => setOperation(op)}
                                className={`w-12 h-12 rounded-full font-bold text-xl flex items-center justify-center transition-all shadow-sm ${operation === op ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-100 border'}`}
                            >
                                {op === 'detA' ? '|A|' : op}
                            </button>
                        ))}
                    </div>

                    {/* Matrix B */}
                    <div className="flex flex-col items-center" style={{ opacity: operation === 'detA' ? 0.3 : 1, pointerEvents: operation === 'detA' ? 'none' : 'auto' }}>
                        <span className="font-bold mb-4 text-slate-500">Matrix B</span>
                        <div className={`grid gap-2 border-l-2 border-r-2 border-slate-400 p-4 rounded-lg bg-white`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                            {matB.map((row, r) => row.map((val, c) => (
                                <input 
                                    key={`B-${r}-${c}`} 
                                    type="number" 
                                    value={val.toString()} 
                                    onChange={(e) => updateMatB(r, c, e.target.value)}
                                    className="w-16 h-16 text-center text-lg font-mono bg-slate-50 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                            )))}
                        </div>
                    </div>
                </div>

                <Button onClick={calculate} className="w-full max-w-md py-4 text-xl font-bold rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">Calculate =</Button>

                {result && (
                    <div className="mt-8 flex flex-col items-center bg-indigo-50 p-8 rounded-2xl border border-indigo-100 w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                        <span className="font-bold mb-4 text-indigo-800 text-lg">Result</span>
                        {result.length === 1 && result[0].length === 1 ? (
                            <div className="text-4xl font-black font-mono text-indigo-600">{result[0][0]}</div>
                        ) : (
                            <div className={`grid gap-2 border-l-2 border-r-2 border-indigo-300 p-4 rounded-lg bg-white shadow-inner`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
                                {result.map((row, r) => row.map((val, c) => (
                                    <div key={`R-${r}-${c}`} className="w-16 h-16 flex items-center justify-center text-lg font-bold font-mono text-slate-800 bg-slate-50 rounded-md">
                                        {Number.isInteger(val) ? val : parseFloat(val.toFixed(4))}
                                    </div>
                                )))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
