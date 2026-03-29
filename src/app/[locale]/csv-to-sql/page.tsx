"use client";

import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { Copy, Database, Table2, AlertCircle } from "lucide-react";
import Papa from "papaparse";

export default function CsvToSqlTool() {
    const [csvInput, setCsvInput] = useState("id,name,role\n1,Alice,Admin\n2,Bob,User\n3,Charlie,Editor");
    const [tableName, setTableName] = useState("my_table");
    const [sqlOutput, setSqlOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const convertCsvToSql = () => {
        setError("");
        setSqlOutput("");
        
        Papa.parse(csvInput, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as Record<string, string>[];
                
                if (results.errors.length > 0) {
                    setError(`CSV Parsing Error: ${results.errors[0].message}`);
                    return;
                }

                if (data.length === 0) {
                    setError("CSV is empty or has no valid rows.");
                    return;
                }

                const columns = Object.keys(data[0]);
                if (columns.length === 0) {
                    setError("No columns found in CSV.");
                    return;
                }

                const header = `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES\n`;
                
                const formatValue = (val: string): string => {
                    if (val === null || val === undefined) return "NULL";
                    const trimmed = val.trim();
                    if (trimmed === "") return "NULL";
                    
                    // Attempt to parse strictly as number, otherwise treat as string
                    if (!isNaN(Number(trimmed)) && trimmed !== "") {
                        return trimmed;
                    }
                    if (trimmed.toLowerCase() === "true" || trimmed.toLowerCase() === "false") {
                        return trimmed.toUpperCase();
                    }

                    // Escape single quotes for SQL string
                    const safeString = trimmed.replace(/'/g, "''");
                    return `'${safeString}'`;
                };

                const rows = data.map(row => {
                    const values = columns.map(col => formatValue(row[col]));
                    return `  (${values.join(', ')})`;
                });

                const finalSql = header + rows.join(',\n') + ';';
                setSqlOutput(finalSql);
            },
            error: (err: any) => {
                setError(`Failed to parse CSV: ${err.message}`);
            }
        });
    };

    const copyToClipboard = () => {
        if (!sqlOutput) return;
        navigator.clipboard.writeText(sqlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolLayout
            title="CSV to SQL Converter"
            description="Parse comma-separated values (CSV) into structured SQL INSERT statements instantly."
           
        >
            <div className="max-w-6xl mx-auto flex flex-col space-y-6">
                
                <div className="flex items-center space-x-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Target Table Name</label>
                        <input
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64 bg-white dark:bg-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="pt-6">
                        <Button onClick={convertCsvToSql} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none">
                            Convert to SQL
                            <Database className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                    {/* CSV Input */}
                    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
                        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center border-b border-slate-200 dark:border-slate-700 absolute w-full top-0">
                            <Table2 className="w-4 h-4 text-slate-500 mr-2" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input CSV Text</span>
                        </div>
                        <textarea
                            value={csvInput}
                            onChange={(e) => setCsvInput(e.target.value)}
                            className="flex-1 w-full bg-slate-50 dark:bg-slate-900/50 p-4 pt-14 font-mono text-sm outline-none resize-none dark:text-slate-300 leading-relaxed"
                            spellCheck={false}
                        />
                    </div>

                    {/* SQL Output */}
                    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center border-b border-slate-200 dark:border-slate-700 absolute w-full top-0 justify-between">
                            <div className="flex items-center">
                                <Database className="w-4 h-4 text-slate-500 mr-2" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Output SQL</span>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
                            >
                                {copied ? 'Copied!' : 'Copy SQL'}
                                <Copy className="w-3 h-3 ml-1" />
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={sqlOutput}
                            className="flex-1 w-full bg-slate-50 dark:bg-slate-900 p-4 pt-14 font-mono text-sm outline-none resize-none text-indigo-800 dark:text-indigo-300"
                            spellCheck={false}
                            placeholder="SQL INSERT statements will appear here..."
                        />
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
