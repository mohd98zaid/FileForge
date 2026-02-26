"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import Papa from "papaparse";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import DownloadButton from "@/components/DownloadButton";
import { downloadBlob } from "@/lib/api";

const faqs = [
    { question: "Can I go CSV to JSON?", questionHi: "क्या CSV से JSON भी बन सकता है?", answer: "Yes! Convert both ways — JSON to CSV and CSV to JSON.", answerHi: "हाँ, दोनों तरफ़ कन्वर्ट कर सकते हैं — JSON से CSV और CSV से JSON।" },
    { question: "Is it free?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, completely free.", answerHi: "हाँ, बिल्कुल मुफ़्त।" },
];

export default function JsonCsvPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [json, setJson] = useState("");
    const [csv, setCsv] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleJsonToCsv = () => {
        setError(null);
        try {
            const data = JSON.parse(json);
            const result = Papa.unparse(data);
            setCsv(result);
        } catch (e: any) {
            setError("Invalid JSON: " + e.message);
        }
    };

    const handleCsvToJson = () => {
        setError(null);
        try {
            const result = Papa.parse(csv, { header: true, skipEmptyLines: true });
            if (result.errors.length) {
                setError("CSV Error: " + result.errors[0].message);
            } else {
                setJson(JSON.stringify(result.data, null, 2));
            }
        } catch (e: any) {
            setError("Conversion failed: " + e.message);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "json" | "csv") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target?.result as string;
            if (type === "json") {
                setJson(content);
                // Auto convert
                try {
                    const data = JSON.parse(content);
                    const result = Papa.unparse(data);
                    setCsv(result);
                } catch (e) { setError("Uploaded JSON is invalid"); }
            } else {
                setCsv(content);
                // Auto convert
                try {
                    const result = Papa.parse(content, { header: true, skipEmptyLines: true });
                    setJson(JSON.stringify(result.data, null, 2));
                } catch (e) { setError("Uploaded CSV is invalid"); }
            }
        };
        reader.readAsText(file);
    };

    const download = (content: string, ext: "json" | "csv") => {
        const blob = new Blob([content], { type: ext === "json" ? "application/json" : "text/csv" });
        downloadBlob(blob, `converted.${ext}`);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📊 JSON ↔ CSV" : "📊 JSON &lt;&gt; CSV Converter"}</h1>

                <p className="mt-2 text-slate-400">{isHi ? "JSON को CSV में और वापस बदलें" : "Convert data formats instantly in your browser"}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto h-[600px]">
                {/* JSON Side */}
                <div className="glass-card flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-emerald-400">JSON</h3>
                        <div className="flex gap-2">
                            <label className="btn-secondary text-xs cursor-pointer">
                                {isHi ? "JSON अपलोड करें" : "Upload JSON"}
                                <input type="file" accept=".json" className="hidden" onChange={(e) => handleFileUpload(e, "json")} />
                            </label>
                            <button onClick={handleJsonToCsv} className="btn-primary text-xs">{isHi ? "CSV में बदलें →" : "Convert to CSV →"}</button>
                        </div>
                    </div>
                    <textarea
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        placeholder='[{"id": 1, "name": "Alice"}, ...]'
                    />
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => download(json, "json")} disabled={!json} className="text-slate-400 hover:text-white text-sm">{isHi ? "JSON डाउनलोड करें" : "Download JSON"}</button>
                    </div>
                </div>

                {/* CSV Side */}
                <div className="glass-card flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-blue-400">CSV</h3>
                        <div className="flex gap-2">
                            <button onClick={handleCsvToJson} className="btn-primary text-xs">{isHi ? "← JSON में बदलें" : "← Convert to JSON"}</button>
                            <label className="btn-secondary text-xs cursor-pointer">
                                {isHi ? "CSV अपलोड करें" : "Upload CSV"}
                                <input type="file" accept=".csv" className="hidden" onChange={(e) => handleFileUpload(e, "csv")} />
                            </label>
                        </div>
                    </div>
                    <textarea
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        value={csv}
                        onChange={(e) => setCsv(e.target.value)}
                        placeholder="id,name,age..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => download(csv, "csv")} disabled={!csv} className="text-slate-400 hover:text-white text-sm">{isHi ? "CSV डाउनलोड करें" : "Download CSV"}</button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg text-center">
                    {error}
                </div>
            )}

            <FAQSection items={faqs} />
            <ToolLinks current="/json-csv" tools={ALL_TOOLS} />
        </div>
    );
}
