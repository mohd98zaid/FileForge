"use client";
import { useLocale } from "next-intl";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Which languages are supported?", questionHi: "कौन सी भाषाएँ सपोर्ट हैं?", answer: "20+ languages including Hindi, Spanish, French, Arabic, German, Japanese, and more.", answerHi: "20+ भाषाएँ — हिंदी, स्पेनिश, फ्रेंच, अरबी, जर्मन, जापानी सहित।" },
    { question: "Is the layout preserved?", questionHi: "क्या लेआउट बना रहता है?", answer: "Text is translated and rebuilt into a clean PDF. Complex layouts may be simplified.", answerHi: "टेक्स्ट का अनुवाद होकर नई PDF बनती है। जटिल लेआउट सरल हो सकता है।" },
];

const LANGUAGES = [
    { code: "hi", name: "Hindi / हिंदी" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish / Español" },
    { code: "fr", name: "French / Français" },
    { code: "de", name: "German / Deutsch" },
    { code: "ar", name: "Arabic / عربي" },
    { code: "zh", name: "Chinese / 中文" },
    { code: "ja", name: "Japanese / 日本語" },
    { code: "ko", name: "Korean / 한국어" },
    { code: "pt", name: "Portuguese / Português" },
    { code: "ru", name: "Russian / Русский" },
    { code: "it", name: "Italian / Italiano" },
    { code: "nl", name: "Dutch / Nederlands" },
    { code: "tr", name: "Turkish / Türkçe" },
    { code: "pl", name: "Polish / Polski" },
    { code: "uk", name: "Ukrainian / Українська" },
    { code: "sv", name: "Swedish / Svenska" },
    { code: "da", name: "Danish / Dansk" },
    { code: "fi", name: "Finnish / Suomi" },
    { code: "id", name: "Indonesian / Bahasa" },
];

type Step = "idle" | "extracting" | "translating" | "building" | "done" | "error";

export default function TranslatePdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const [file, setFile] = useState<File | null>(null);
    const [targetLang, setTargetLang] = useState("hi");
    const [step, setStep] = useState<Step>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);

    const handleTranslate = async () => {
        if (!file) return;
        setError(null); setResultBlob(null); setStep("extracting"); setProgress(10);
        try {
            // 1. Extract text from PDF using pdfjs-dist
            const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
            GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
            const ab = await file.arrayBuffer();
            const pdfDoc = await getDocument({ data: ab }).promise;
            const pages: string[] = [];
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const tc = await page.getTextContent();
                pages.push(tc.items.map((item: any) => item.str).join(" "));
            }
            const fullText = pages.join("\n\n--- Page Break ---\n\n");
            setStep("translating"); setProgress(35);

            // 2. Translate via LibreTranslate public API
            // Split into chunks of 500 chars to avoid request limits
            const chunks: string[] = [];
            for (let i = 0; i < fullText.length; i += 500) {
                chunks.push(fullText.slice(i, i + 500));
            }

            const translatedChunks: string[] = [];
            for (let i = 0; i < chunks.length; i++) {
                const res = await fetch("https://libretranslate.com/translate", {
                    method: "POST",
                    body: JSON.stringify({ q: chunks[i], source: "auto", target: targetLang, format: "text" }),
                    headers: { "Content-Type": "application/json" }
                });
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData?.error || "Translation API failed. Please try again later.");
                }
                const data = await res.json();
                translatedChunks.push(data.translatedText);
                setProgress(35 + Math.floor(((i + 1) / chunks.length) * 45));
            }
            const translatedText = translatedChunks.join("");

            setStep("building"); setProgress(85);

            // 3. Build output PDF using jsPDF
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageWidth = 210 - 20; // A4 width minus margins
            doc.setFontSize(11);
            const lines = doc.splitTextToSize(translatedText, pageWidth);
            let y = 20;
            lines.forEach((line: string) => {
                if (y > 277) { doc.addPage(); y = 20; }
                doc.text(line, 10, y);
                y += 7;
            });

            const blob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
            setResultBlob(blob);
            setStep("done"); setProgress(100);

        } catch (e: any) {
            setError(e?.message || "Translation failed. Please try again.");
            setStep("error"); setProgress(0);
        }
    };

    const stepLabels: Record<Step, string> = {
        idle: "",
        extracting: isHi ? "PDF से टेक्स्ट निकाल रहे हैं..." : "Extracting text from PDF...",
        translating: isHi ? "अनुवाद हो रहा है..." : "Translating text...",
        building: isHi ? "नई PDF बना रहे हैं..." : "Building translated PDF...",
        done: isHi ? "पूरा हुआ!" : "Done!",
        error: isHi ? "त्रुटि हुई" : "Error",
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌍 PDF अनुवाद करें" : "🌍 Translate PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "PDF का टेक्स्ट 20+ भाषाओं में अनुवाद करें" : "Extract and translate PDF text into 20+ languages"}</p>
                <div className="mt-2 bg-indigo-500/10 text-indigo-400 text-xs py-1 px-3 rounded-full inline-block">⚡ Powered by LibreTranslate (Free, Open Source)</div>
            </div>

            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={(files) => { setFile(files[0]); setStep("idle"); setResultBlob(null); }} label={isHi ? "यहाँ PDF ड्रॉप करें" : "Drop PDF here"} hint={isHi ? "अधिकतम 20MB" : "Max 20MB"} />

                {file && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <span className="text-xl">📄</span>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400">✕</button>
                    </div>
                )}

                <div>
                    <label className="text-sm text-slate-400 mb-2 block">{isHi ? "किस भाषा में अनुवाद करें?" : "Translate to:"}</label>
                    <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full bg-black/30 text-white rounded-lg px-3 py-2.5 border border-white/10">
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                </div>

                <button onClick={handleTranslate} disabled={!file || (step !== "idle" && step !== "error" && step !== "done")} className="btn-primary w-full">
                    {step === "idle" || step === "error" || step === "done" ? (isHi ? "🌍 अनुवाद शुरू करें" : "🌍 Translate PDF") : stepLabels[step]}
                </button>

                {step !== "idle" && <ProgressBar progress={progress} label={stepLabels[step]} />}

                {/* Step indicators */}
                {step !== "idle" && (
                    <div className="flex justify-between text-xs">
                        {(["extracting", "translating", "building", "done"] as Step[]).map((s, i) => (
                            <div key={s} className={`flex flex-col items-center gap-1 ${["extracting", "translating", "building", "done"].indexOf(step) >= i ? "text-indigo-400" : "text-slate-600"}`}>
                                <div className={`w-2 h-2 rounded-full ${["extracting", "translating", "building", "done"].indexOf(step) >= i ? "bg-indigo-400" : "bg-slate-600"}`} />
                                <span>{["Extract", "Translate", "Build", "Done"][i]}</span>
                            </div>
                        ))}
                    </div>
                )}

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">{error}</div>}

                {resultBlob && step === "done" && (
                    <div className="flex justify-center pt-2">
                        <DownloadButton
                            onClick={() => {
                                const url = URL.createObjectURL(resultBlob);
                                const a = document.createElement("a");
                                a.href = url; a.download = `translated_${targetLang}_${file?.name}`; a.click();
                                URL.revokeObjectURL(url);
                            }}
                            label={isHi ? "अनुवादित PDF डाउनलोड करें" : "Download Translated PDF"}
                        />
                    </div>
                )}
            </div>
            <FAQSection items={faqs} />
            <ToolLinks current="/translate-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
