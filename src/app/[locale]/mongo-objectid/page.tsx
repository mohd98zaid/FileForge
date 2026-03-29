"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, Plus, RefreshCw, Clock } from "lucide-react";

// Generate a valid Mongo ObjectId strictly client-side
function generateObjectId() {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const processId = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
    const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    return timestamp + machineId + processId + counter;
}

// Decode a Mongo ObjectId to get its creation timestamp
function decodeObjectId(id: string) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return null;
    }
    const timestampHex = id.substring(0, 8);
    const date = new Date(parseInt(timestampHex, 16) * 1000);
    return date;
}

const faqs = [
    { question: "What is a MongoDB ObjectId?", questionHi: "MongoDB ObjectId क्या है?", answer: "An ObjectId is a 12-byte (24 character hex) unique identifier typically used in MongoDB. It has built-in creation timestamps.", answerHi: "ObjectId एक 12-बाइट (24 वर्ण हेक्स) अद्वितीय पहचानकर्ता है जो आमतौर पर MongoDB में उपयोग किया जाता है। इसमें अंतर्निहित निर्माण टाइमस्टैम्प हैं।" },
    { question: "How does the timestamp extraction work?", questionHi: "टाइमस्टैम्प निष्कर्षण कैसे काम करता है?", answer: "The first 4 bytes (8 hex characters) of every ObjectId represent the Unix epoch timestamp of when it was created.", answerHi: "प्रत्येक ObjectId के पहले 4 बाइट्स (8 हेक्स अक्षर) उस Unix युग टाइमस्टैम्प का प्रतिनिधित्व करते हैं जब इसे बनाया गया था।" },
];

export default function MongoObjectIdTool() {
    const [generatedIds, setGeneratedIds] = useState<string[]>([]);
    const [decodeInput, setDecodeInput] = useState("");
    const [decodedDate, setDecodedDate] = useState<Date | null>(null);
    const [decodeError, setDecodeError] = useState("");

    const generateNew = () => {
        setGeneratedIds(prev => [generateObjectId(), ...prev].slice(0, 10)); // Keep last 10
    };

    React.useEffect(() => {
        generateNew();
    }, []);

    const handleDecode = (text: string) => {
        setDecodeInput(text);
        if (!text.trim()) {
            setDecodedDate(null);
            setDecodeError("");
            return;
        }

        const date = decodeObjectId(text.trim());
        if (date) {
            setDecodedDate(date);
            setDecodeError("");
        } else {
            setDecodedDate(null);
            setDecodeError("Invalid ObjectId Format. Must be a 24-character hexadecimal string.");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolLayout
            title="MongoDB ObjectId Generator & Decoder"
            description="Generate valid MongoDB ObjectIds and decode existing ones to extract their creation timestamp."
            faqs={faqs}
           
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Generator Section */}
                <div className="glass-card p-6 divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl">
                    <div className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-600">
                                Generator
                            </h2>
                            <Button onClick={generateNew} variant="primary" size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                                <Plus className="w-4 h-4 mr-2" /> Generate New
                            </Button>
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            {generatedIds.map((id, index) => (
                                <div key={id} className={`flex justify-between items-center p-4 hover:bg-white dark:hover:bg-slate-800 transition-colors ${index !== generatedIds.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''}`}>
                                    <div>
                                        <code className="text-lg font-mono text-slate-800 dark:text-slate-200">{id}</code>
                                        {index === 0 && <span className="ml-3 text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">Newest</span>}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(id)}
                                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                                        title="Copy ObjectId"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decoder Section */}
                <div className="glass-card p-6 rounded-2xl space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border-t-4 border-t-indigo-500">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-600">
                        Timestamp Decoder
                    </h2>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Paste ObjectId</label>
                        <input
                            type="text"
                            placeholder="e.g. 507f1f77bcf86cd799439011"
                            value={decodeInput}
                            onChange={(e) => handleDecode(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-mono text-lg dark:text-white"
                        />
                        {decodeError && <p className="text-sm text-red-500 mt-1">{decodeError}</p>}
                    </div>

                    {decodedDate && (
                        <div className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-start space-x-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="space-y-3 flex-1">
                                <div>
                                    <p className="text-sm font-semibold text-indigo-900/60 dark:text-indigo-200/60 uppercase tracking-wider">Local Time</p>
                                    <p className="text-xl font-medium text-slate-800 dark:text-slate-200">{decodedDate.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-indigo-900/60 dark:text-indigo-200/60 uppercase tracking-wider">ISO 8601 UTC</p>
                                    <p className="text-lg text-slate-700 dark:text-slate-300 font-mono">{decodedDate.toISOString()}</p>
                                </div>
                                <div className="pt-2 flex items-center space-x-4">
                                    <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 flex items-center space-x-2">
                                        <span className="text-xs font-semibold text-slate-500">Epoch Timestamp:</span>
                                        <code className="text-sm text-slate-800 dark:text-slate-200">{Math.floor(decodedDate.getTime() / 1000)}</code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
