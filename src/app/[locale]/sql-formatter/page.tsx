"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, Database, Code, Settings } from "lucide-react";
import { format } from "sql-formatter";

export default function SqlFormatterTool() {
    const [sqlInput, setSqlInput] = useState("SELECT id, name, email FROM users WHERE status = 'active' ORDER BY created_at DESC LIMIT 10;");
    const [sqlOutput, setSqlOutput] = useState("");
    const [dialect, setDialect] = useState<"sql" | "mysql" | "postgresql">("sql");
    const [keywordCase, setKeywordCase] = useState<"upper" | "lower" | "preserve">("upper");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    // Auto-format when inputs change
    useEffect(() => {
        try {
            setError("");
            if (!sqlInput.trim()) {
                setSqlOutput("");
                return;
            }
            const formatted = format(sqlInput, {
                language: dialect,
                keywordCase: keywordCase,
                indentStyle: "standard",
                tabWidth: 4,
                linesBetweenQueries: 2,
            });
            setSqlOutput(formatted);
        } catch (e: any) {
            setError(`Formatting Error: ${e.message}`);
        }
    }, [sqlInput, dialect, keywordCase]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sqlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolLayout
            title="SQL Formatter"
            description="Prettify minified or poorly formatted SQL queries into highly readable syntax instantly."
           
        >
            <div className="max-w-7xl mx-auto flex flex-col space-y-6">
                
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between glass-card px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    
                    {/* Settings Group */}
                    <div className="flex items-center space-x-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <div className="flex items-center space-x-2 mr-2">
                            <Settings className="w-5 h-5 text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Format Options:</span>
                        </div>
                        
                        {/* Dialect */}
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value as any)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-1.5"
                        >
                            <option value="sql">Standard SQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="postgresql">PostgreSQL</option>
                        </select>

                        {/* Keyword Case */}
                        <select
                            value={keywordCase}
                            onChange={(e) => setKeywordCase(e.target.value as any)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-1.5"
                        >
                            <option value="upper">UPPERCASE Keywords</option>
                            <option value="lower">lowercase keywords</option>
                            <option value="preserve">Preserve Original</option>
                        </select>
                    </div>

                    <Button variant="primary" size="sm" onClick={copyToClipboard} className="flex items-center shrink-0">
                        {copied ? <Code className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied!" : "Copy Formatted SQL"}
                    </Button>
                </div>

                {/* Editor Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                    
                    {/* Left Pane - Input */}
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
                        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 flex items-center border-b border-slate-200 dark:border-slate-700">
                            <Database className="w-4 h-4 text-slate-500 mr-2" />
                            <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Minified / Raw SQL Input</span>
                        </div>
                        <textarea
                            value={sqlInput}
                            onChange={(e) => setSqlInput(e.target.value)}
                            className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
                            placeholder="Paste your raw, unformatted SQL query here..."
                            spellCheck={false}
                        />
                    </div>

                    {/* Right Pane - Output */}
                    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm relative">
                        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center">
                                <Code className="w-4 h-4 text-emerald-400 mr-2" />
                                <span className="text-xs font-bold tracking-wider text-emerald-500 uppercase">Prettified Output</span>
                            </div>
                            {error && (
                                <span className="text-xs font-semibold text-red-400 truncate max-w-xs">{error}</span>
                            )}
                        </div>
                        <textarea
                            value={sqlOutput}
                            readOnly
                            className="flex-1 w-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-emerald-400 placeholder-slate-600"
                            placeholder="Formatted SQL will appear here..."
                            spellCheck={false}
                        />
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
