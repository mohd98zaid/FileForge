"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { encryptPdf, decryptPdf } from "@/utils/pdf-processing";

const faqs = [
    {
        question: "Is it secure?",
        questionHi: "क्या यह सुरक्षित है?",
        answer: "Yes, all processing happens in your browser. Your PDF never leaves your device.",
        answerHi: "हाँ, सारी प्रक्रिया आपके ब्राउज़र में होती है। PDF कभी सर्वर पर नहीं जाती।",
    },
    {
        question: "Can I unlock a PDF?",
        questionHi: "क्या इससे PDF अनलॉक कर सकते हैं?",
        answer: "Yes, switch to the Unlock tab, upload your PDF and enter the current password.",
        answerHi: "हाँ, Unlock टैब चुनें, PDF अपलोड करें और मौजूदा पासवर्ड दर्ज करें।",
    },
    {
        question: "What encryption is used?",
        questionHi: "कौन सा एन्क्रिप्शन इस्तेमाल होता है?",
        answer: "128-bit RC4 encryption via pdf-lib, compatible with most PDF readers.",
        answerHi: "pdf-lib के ज़रिए 128-bit RC4 एन्क्रिप्शन, अधिकांश PDF रीडर के साथ संगत।",
    },
];

type Mode = "protect" | "unlock";

export default function PasswordPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [mode, setMode] = useState<Mode>("protect");
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState("");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (f: File[]) => {
        setFiles(f);
        setResultBlob(null);
        setError(null);
        setProgress(0);
    };

    const handleModeChange = (m: Mode) => {
        setMode(m);
        setResultBlob(null);
        setError(null);
        setPassword("");
        setProgress(0);
    };

    const handleProcess = async () => {
        if (!files.length) return;
        if (!password.trim()) {
            setError(isHi ? "कृपया पासवर्ड दर्ज करें।" : "Please enter a password.");
            return;
        }
        setError(null);
        setResultBlob(null);
        setProgress(20);

        try {
            let result: File;
            if (mode === "protect") {
                result = await encryptPdf(files[0], password);
            } else {
                result = await decryptPdf(files[0], password);
            }
            setResultBlob(result);
            setProgress(100);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "";
            setError(msg || (isHi ? "प्रक्रिया विफल रही।" : "Operation failed."));
            setProgress(0);
        }
    };

    const downloadName = mode === "protect" ? "protected.pdf" : "unlocked.pdf";

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">
                    {isHi ? "🔒 PDF पासवर्ड" : "🔒 Password PDF"}
                </h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "PDF को पासवर्ड से लॉक या अनलॉक करें" : "Protect a PDF with a password or remove one"}
                </p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ ब्राउज़र में प्रोसेस होता है" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => handleModeChange("protect")}
                        className={mode === "protect" ? "btn-primary flex-1" : "btn-secondary flex-1"}
                    >
                        {isHi ? "🔐 PDF सुरक्षित करें" : "🔐 Protect PDF"}
                    </button>
                    <button
                        onClick={() => handleModeChange("unlock")}
                        className={mode === "unlock" ? "btn-primary flex-1" : "btn-secondary flex-1"}
                    >
                        {isHi ? "🔓 PDF अनलॉक करें" : "🔓 Unlock PDF"}
                    </button>
                </div>

                <FileUpload
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    onFilesSelected={handleFilesSelected}
                    label={isHi ? "PDF यहाँ छोड़ें" : "Drop PDF here"}
                    hint={isHi ? "अधिकतम 50 MB" : "Max 50 MB"}
                    maxSizeMB={50}
                />

                {files.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-sm text-slate-300">{files[0].name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{(files[0].size / 1024).toFixed(0)} KB</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm text-slate-400 mb-2">
                        {mode === "protect"
                            ? (isHi ? "नया पासवर्ड" : "New Password")
                            : (isHi ? "मौजूदा पासवर्ड" : "Current Password")}
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isHi ? "पासवर्ड दर्ज करें" : "Enter password"}
                        className="input-field w-full"
                        onKeyDown={(e) => e.key === "Enter" && handleProcess()}
                    />
                </div>

                <button
                    onClick={handleProcess}
                    disabled={!files.length || !password.trim()}
                    className="btn-primary w-full"
                >
                    {mode === "protect"
                        ? (isHi ? "PDF सुरक्षित करें" : "Protect PDF")
                        : (isHi ? "PDF अनलॉक करें" : "Unlock PDF")}
                </button>

                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {resultBlob && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <DownloadButton
                            onClick={() => downloadBlob(resultBlob, downloadName)}
                            label={
                                mode === "protect"
                                    ? (isHi ? "सुरक्षित PDF डाउनलोड करें" : "Download Protected PDF")
                                    : (isHi ? "अनलॉक PDF डाउनलोड करें" : "Download Unlocked PDF")
                            }
                        />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/password-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
