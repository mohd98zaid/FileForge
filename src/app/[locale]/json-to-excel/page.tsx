"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { FileJson, FileSpreadsheet, Download, RefreshCw } from "lucide-react";

export default function JsonToExcelTool() {
    const [jsonInput, setJsonInput] = useState("");
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

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setJsonInput(content);
        };
        reader.readAsText(file);
    };

    const convertToExcel = () => {
        setError("");
        
        if (!(window as any).XLSX) {
            setError("Excel engine is still loading. Please try again in a few seconds.");
            return;
        }

        try {
            const parsedJs = JSON.parse(jsonInput);
            const dataArray = Array.isArray(parsedJs) ? parsedJs : [parsedJs];
            
            const worksheet = (window as any).XLSX.utils.json_to_sheet(dataArray);
            const workbook = (window as any).XLSX.utils.book_new();
            (window as any).XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            
            (window as any).XLSX.writeFile(workbook, `converted_${Date.now()}.xlsx`);
            
        } catch (err) {
            console.error(err);
            setError("Invalid JSON format. Please ensure your JSON is valid (preferably an array of objects).");
        }
    };

    return (
        <ToolLayout title="JSON to Excel Converter" description="Convert JSON data into organized Excel (.xlsx) spreadsheets instantly.">
            <div className="max-w-5xl mx-auto space-y-8">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">{error}</div>}
                
                <div className="bg-white rounded-2xl border shadow-sm flex flex-col min-h-[500px]">
                    <div className="flex border-b">
                        <div className="w-1/2 p-4 border-r bg-slate-50 flex justify-between items-center rounded-tl-2xl">
                            <h3 className="font-bold flex items-center gap-2"><FileJson className="text-amber-500 w-5 h-5"/> JSON Input</h3>
                            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} size="sm">Upload .json</Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json,application/json" className="hidden" />
                        </div>
                        <div className="w-1/2 p-4 bg-slate-50 flex items-center gap-2 rounded-tr-2xl">
                            <h3 className="font-bold flex items-center gap-2"><FileSpreadsheet className="text-emerald-500 w-5 h-5"/> Excel Output</h3>
                        </div>
                    </div>
                    
                    <div className="flex flex-1">
                        <textarea 
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-1/2 p-6 font-mono text-sm resize-none border-r outline-none focus:bg-indigo-50/10 transition-colors"
                            placeholder="[\n  {\n    &quot;name&quot;: &quot;John Doe&quot;,\n    &quot;age&quot;: 30,\n    &quot;city&quot;: &quot;New York&quot;\n  }\n]"
                        />
                        <div className="w-1/2 p-6 flex flex-col items-center justify-center bg-emerald-50/20">
                            <FileSpreadsheet className="w-24 h-24 text-emerald-200 mb-6" />
                            <p className="text-slate-500 text-center max-w-xs mb-8">
                                We will map your JSON keys to column headers automatically.
                            </p>
                            <Button onClick={convertToExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center gap-3">
                                <Download className="w-6 h-6"/> Download Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
