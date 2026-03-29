"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Lock, CheckCircle2, XCircle, Copy, ShieldAlert } from "lucide-react";
import bcrypt from "bcryptjs";

const faqs = [
    { question: "Is this secure?", questionHi: "क्या यह सुरक्षित है?", answer: "Yes, all hashing and verification is done client-side in your browser. Passwords never travel over the network or touch a server.", answerHi: "हाँ, आपके ब्राउज़र में सभी हैशिंग और सत्यापन क्लाइंट-साइड किए जाते हैं। पासवर्ड नेटवर्क पर कभी नहीं जाते हैं या सर्वर को नहीं छूते हैं।" },
    { question: "What is Cost (Salt Rounds)?", questionHi: "लागत (नमक दौर) क्या है?", answer: "Cost factor dictates the time needed to calculate a single bcrypt hash. Higher cost means more rounds, making it exponentially slower against brute-force attacks.", answerHi: "लागत कारक एकल bcrypt हैश की गणना करने के लिए आवश्यक समय को निर्धारित करता है। उच्च लागत का अर्थ है अधिक राउंड, जो इसे ब्रूट-फोर्स हमलों के खिलाफ तेजी से धीमा कर देता है।" },
];

export default function BcryptGeneratorTool() {
    // Generate state
    const [plaintext, setPlaintext] = useState("");
    const [rounds, setRounds] = useState(10);
    const [hash, setHash] = useState("");
    const [isHashing, setIsHashing] = useState(false);
    
    // Verify state
    const [verifyPlaintext, setVerifyPlaintext] = useState("");
    const [verifyHash, setVerifyHash] = useState("");
    const [isMatch, setIsMatch] = useState<boolean | null>(null);

    const generateHash = async () => {
        if (!plaintext) return;
        setIsHashing(true);
        try {
            // Use setTimeout to not freeze the UI entirely for high rounds
            setTimeout(() => {
                const salt = bcrypt.genSaltSync(rounds);
                const generatedHash = bcrypt.hashSync(plaintext, salt);
                setHash(generatedHash);
                setIsHashing(false);
            }, 50);
        } catch (error) {
            console.error(error);
            setIsHashing(false);
        }
    };

    const verifyCredentials = () => {
        if (!verifyPlaintext || !verifyHash) return;
        try {
            const result = bcrypt.compareSync(verifyPlaintext, verifyHash);
            setIsMatch(result);
        } catch (error) {
            setIsMatch(false);
        }
    };

    const getMatchUI = () => {
        if (isMatch === null) return null;
        if (isMatch) {
            return (
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0" />
                    <span className="font-semibold">Match! The plaintext corresponds to the hash.</span>
                </div>
            );
        }
        return (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center text-red-700 dark:text-red-400">
                <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                <span className="font-semibold">No Match. The password does not map to this hash.</span>
            </div>
        );
    };

    return (
        <ToolLayout
            title="Bcrypt Hash Generator & Verifier"
            description="Securely generate bcrypt hashes and verify passwords entirely within your browser."
            faqs={faqs}
           
        >
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Generator Column */}
                <div className="glass-card p-6 rounded-2xl space-y-6 border-t-4 border-t-blue-500">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Generate Hash</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Plaintext Password</label>
                        <input
                            type="text"
                            value={plaintext}
                            onChange={(e) => setPlaintext(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none dark:text-white"
                            placeholder="Enter string to hash..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Cost (Salt Rounds)</label>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{rounds}</span>
                        </div>
                        <input
                            type="range"
                            min="4"
                            max="16"
                            value={rounds}
                            onChange={(e) => setRounds(parseInt(e.target.value))}
                            className="w-full accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-slate-500 pt-1">
                            <span>Fast (4)</span>
                            <span>Secure (10)</span>
                            <span>Slow (16)</span>
                        </div>
                        {rounds > 12 && (
                            <p className="text-xs text-orange-500 flex items-center mt-2">
                                <ShieldAlert className="w-3 h-3 mr-1" />
                                High rounds may freeze the browser for several seconds.
                            </p>
                        )}
                    </div>

                    <Button onClick={generateHash} disabled={!plaintext || isHashing} variant="primary" className="w-full bg-blue-600 hover:bg-blue-700 border-none">
                        {isHashing ? "Computing..." : "Generate Bcrypt Hash"}
                    </Button>

                    {hash && (
                        <div className="pt-4 space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Target Hash</label>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl break-all relative group">
                                <code className="text-slate-800 dark:text-slate-200">{hash}</code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(hash)}
                                    className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 shadow rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-blue-600"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Verifier Column */}
                <div className="glass-card p-6 rounded-2xl space-y-6 border-t-4 border-t-purple-500">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Verify Hash</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">String to Check</label>
                            <input
                                type="text"
                                value={verifyPlaintext}
                                onChange={(e) => {
                                    setVerifyPlaintext(e.target.value);
                                    setIsMatch(null);
                                }}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none dark:text-white"
                                placeholder="Enter password guess..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Bcrypt Hash</label>
                            <textarea
                                value={verifyHash}
                                onChange={(e) => {
                                    setVerifyHash(e.target.value);
                                    setIsMatch(null);
                                }}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none h-24 font-mono text-sm dark:text-white"
                                placeholder="$2a$10$..."
                            />
                        </div>

                        <Button 
                            onClick={verifyCredentials} 
                            disabled={!verifyPlaintext || !verifyHash} 
                            variant="primary" 
                            className="w-full bg-purple-600 hover:bg-purple-700 border-none"
                        >
                            Verify & Compare Match
                        </Button>

                        {getMatchUI()}
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
