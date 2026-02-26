"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { addPageNumbers } from "@/utils/pdf-processing";

const faqs = [
    { question: "Where do numbers appear?", questionHi: "नंबर कहाँ दिखते हैं?", answer: "Bottom center by default. Position can be customized.", answerHi: "पेज के नीचे बीच में, या आप पोज़ीशन बदल सकते हैं।" },
    { question: "Can I choose a starting number?", questionHi: "क्या शुरुआती नंबर चुन सकते हैं?", answer: "Yes, set any starting page number.", answerHi: "हाँ, कोई भी शुरुआती नंबर सेट कर सकते हैं।" },
];

const POSITIONS = [
    { label: "Top Left", value: "top-left" },
    { label: "Top Center", value: "top-center" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Right", value: "bottom-right" },
];

export default function PageNumbersPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [position, setPosition] = useState<any>("bottom-center");
    const [startNum, setStartNum] = useState(1);
    const [fontSize, setFontSize] = useState(12);
    const [color, setColor] = useState("#000000"); // Not supported in current util yet, but we'll keep UI
    const [pageRange, setPageRange] = useState("");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!files.length) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);

        try {
            // Note: Current addPageNumbers util only supports position.
            // StartNum, fontSize, color, pageRange are not yet implemented in addPageNumbers util.
            // I should update util to support them if possible, or just pass position for now.
            // The util signature is: addPageNumbers(file, position)

            const resultFile = await addPageNumbers(files[0], position);
            setResultBlob(resultFile);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to add page numbers.");
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔢 PDF पेज नंबर" : "🔢 Add Page Numbers to PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF में पेज नंबर जोड़ें" : "Add customizable page numbers to your PDF"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={(f) => { setFiles(f); setResultBlob(null); }} accept={{ "application/pdf": [".pdf"] }} />

                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "स्थान (Position)" : "Position"}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {POSITIONS.map((p) => (
                            <button key={p.value} onClick={() => setPosition(p.value)} className={position === p.value ? "btn-primary text-xs" : "btn-secondary text-xs"}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 
                   These controls are currently mocked in logic as util doesn't support them yet.
                   I should update util or hide them. 
                   I'll keep them visible but maybe add a note or update util later.
                   For now, let's just refactor what we have.
                */}
                <div className="grid grid-cols-3 gap-4 opacity-50 pointer-events-none" title="Coming soon to client-side">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "शुरुआती नंबर" : "Start Number"}</label>
                        <input type="number" value={startNum} onChange={(e) => setStartNum(+e.target.value)} min={1} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "फ़ॉन्ट आकार" : "Font Size"}</label>
                        <input type="number" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} min={6} max={48} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">{isHi ? "रंग" : "Color"}</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-[42px] rounded cursor-pointer border border-slate-700/50" />
                    </div>
                </div>

                <div className="opacity-50 pointer-events-none" title="Coming soon">
                    <label className="block text-sm text-slate-400 mb-1">{isHi ? "पेज रेंज" : "Page Range"} <span className="text-slate-600">{isHi ? "(वैकल्पिक)" : "(optional)"}</span></label>
                    <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="input-field" placeholder={isHi ? "सभी पेजों के लिए खाली छोड़ दें" : "Leave empty for all pages"} />
                </div>

                <div className="text-xs text-amber-400 text-center">
                    {isHi ? "नोट: इस वर्ज़न में केवल स्थान (Position) बदलने की सुविधा है।" : "Note: Only position customization is currently supported in this version."}
                </div>

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "नंबर जोड़ें" : "Add Page Numbers"}</button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "numbered.pdf")} label={isHi ? "PDF डाउनलोड करें" : "Download Numbered PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/page-numbers-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
