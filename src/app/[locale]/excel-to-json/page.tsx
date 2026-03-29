"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { FileSpreadsheet, FileJson, Copy, ArrowRight, Download } from "lucide-react";

export default function ExcelToJsonTool() {
    const [jsonOutput, setJsonOutput] = useState("");
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!(window as any).XLSX) {
            const script = document.createElement("script");
            script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");
        setFileName(file.name);

        if (!(window as any).XLSX) {
            setError("Engine is loading. Try again.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = (window as any).XLSX.read(data, { type: "array" });
                
                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to JSON
                const json = (window as any).XLSX.utils.sheet_to_json(worksheet);
                setJsonOutput(JSON.stringify(json, null, 2));
            } catch (err) {
                console.error(err);
                setError("Failed to parse Excel file.");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const downloadJson = () => {
        const blob = new Blob([jsonOutput], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `data_${Date.now()}.json`;
        link.click();
    };

    return (
        <ToolLayout title="Excel to JSON Converter" description="Convert spreadsheets (.xlsx, .xls, .csv) into clean, structured JSON.">
            <div className="max-w-5xl mx-auto space-y-8">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">{error}</div>}
                
                {!jsonOutput ? (
                    <div 
                        className="border-2 border-dashed border-emerald-300 rounded-2xl p-16 flex flex-col items-center justify-center bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FileSpreadsheet className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Upload Excel Spreadsheet</h3>
                        <p className="text-slate-500">Supports .xlsx, .xls, .csv</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv" className="hidden" />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-[700px] overflow-hidden relative">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <FileSpreadsheet className="text-emerald-500 w-5 h-5"/>
                                <span className="font-semibold">{fileName}</span>
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <FileJson className="text-amber-500 w-5 h-5"/>
                                <span className="font-semibold text-amber-600">JSON Output</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={() => { setJsonOutput(""); setFileName(""); }} size="sm">Convert Another</Button>
                                <Button variant="secondary" onClick={() => navigator.clipboard.writeText(jsonOutput)} size="sm" className="gap-2">
                                    <Copy className="w-4 h-4" /> Copy JSON
                                </Button>
                                <Button onClick={downloadJson} size="sm" className="bg-emerald-600 text-white gap-2">
                                    <Download className="w-4 h-4" /> Download .json
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-auto bg-slate-900 text-slate-300 p-6 font-mono text-sm relative">
                            <pre><code>{jsonOutput}</code></pre>
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
