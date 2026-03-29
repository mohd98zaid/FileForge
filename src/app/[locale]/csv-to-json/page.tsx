"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How does the CSV parser handle quoted values?", questionHi: "CSV पार्सर कोटेड वैल्यू को कैसे हैंडल करता है?", answer: "The parser correctly handles values wrapped in double quotes, including values that contain commas or newlines inside the quotes.", answerHi: "पार्सर डबल कोट्स में लिखे गए मानों को सही तरीके से प्रोसेस करता है, जिसमें कॉमा या न्यूलाइन शामिल हों।" },
    { question: "Is my data sent to any server?", questionHi: "क्या मेरा डेटा किसी सर्वर पर भेजा जाता है?", answer: "No. All CSV to JSON conversion happens entirely in your browser. Nothing leaves your device.", answerHi: "नहीं। सभी CSV से JSON कन्वर्जन पूरी तरह आपके ब्राउज़र में होता है। कुछ भी आपके डिवाइस से बाहर नहीं जाता।" },
    { question: "What if my CSV has no header row?", questionHi: "अगर मेरे CSV में हेडर रो न हो तो?", answer: "Toggle off 'First row as headers'. The tool will generate column names like col1, col2, etc.", answerHi: "'पहली पंक्ति हेडर है' को बंद कर दें। टूल col1, col2 जैसे कॉलम नाम बनाएगा।" },
];

function parseCSV(input: string, firstRowHeaders: boolean): Record<string, string>[] {
    const rows: string[][] = [];
    let current = "";
    let inQuotes = false;
    let row: string[] = [];

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (inQuotes) {
            if (ch === '"') {
                if (input[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                current += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ",") {
                row.push(current.trim());
                current = "";
            } else if (ch === "\n" || (ch === "\r" && input[i + 1] === "\n")) {
                row.push(current.trim());
                current = "";
                if (row.some(c => c !== "")) rows.push(row);
                row = [];
                if (ch === "\r") i++;
            } else {
                current += ch;
            }
        }
    }
    row.push(current.trim());
    if (row.some(c => c !== "")) rows.push(row);

    if (rows.length === 0) return [];

    let headers: string[];
    let dataStart: number;

    if (firstRowHeaders) {
        headers = rows[0];
        dataStart = 1;
    } else {
        const maxCols = Math.max(...rows.map(r => r.length));
        headers = Array.from({ length: maxCols }, (_, i) => `col${i + 1}`);
        dataStart = 0;
    }

    return rows.slice(dataStart).map(r => {
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
            obj[h] = r[idx] ?? "";
        });
        return obj;
    });
}

export default function CsvToJsonPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [firstRowHeaders, setFirstRowHeaders] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput("");
            setError(isHi ? "कृपया कुछ CSV डेटा दें।" : "Please provide some CSV data.");
            return;
        }

        try {
            const result = parseCSV(input, firstRowHeaders);
            if (result.length === 0) {
                setError(isHi ? "कोई डेटा पंक्ति नहीं मिली।" : "No data rows found.");
                setOutput("");
                return;
            }
            setOutput(JSON.stringify(result, null, 2));
            setError(null);
        } catch (e: any) {
            setError(isHi ? `CSV पार्स त्रुटि: ${e.message}` : `CSV parse error: ${e.message}`);
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJSON = () => {
        if (!output) return;
        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📊 CSV से JSON कन्वर्टर" : "📊 CSV to JSON Converter"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "CSV डेटा को JSON एरे में बदलें" : "Convert CSV data into a JSON array instantly"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-700/50 pb-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={firstRowHeaders}
                                onChange={(e) => setFirstRowHeaders(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-indigo-600 transition-colors" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="text-slate-300 text-sm font-medium">
                            {isHi ? "पहली पंक्ति हेडर है" : "First row as headers"}
                        </span>
                    </label>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                            {isHi ? "CSV इनपुट" : "CSV Input"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={"name,age,city\nAlice,30,Delhi\nBob,25,Mumbai"}
                            className={`w-full h-[400px] bg-slate-900 border ${error ? "border-red-500 rounded-b-none" : "border-slate-700/50 rounded-xl"} p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500`}
                            spellCheck="false"
                        />
                        {error && (
                            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-b-xl border-t-0 font-mono break-all">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <div className="flex justify-between items-end">
                            <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                                {isHi ? "JSON आउटपुट" : "JSON Output"}
                            </label>
                            <div className="flex gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!output}
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी करें" : "Copy")}
                                </button>
                                <button
                                    onClick={downloadJSON}
                                    disabled={!output}
                                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isHi ? "डाउनलोड .json" : "Download .json"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-full min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none"
                            spellCheck="false"
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleConvert}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "JSON में बदलें" : "Convert to JSON"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/csv-to-json" tools={ALL_TOOLS} />
        </div>
    );
}
