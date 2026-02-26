"use client";

import { useLocale } from "next-intl";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import {
    validateExamPhoto,
    addNameDateToPhoto,
    joinPhotoSignature,
    ValidationResult
} from "@/utils/exam-photo";

const faqs = [
    { question: "Which exams are supported?", questionHi: "कौन सी परीक्षाएँ सपोर्ट हैं?", answer: "SSC (CGL, CHSL, MTS, GD), UPSC, Railway (NTPC, Group D), Banking (IBPS, SBI), NEET, JEE, Passport, PAN Card, and custom sizes.", answerHi: "SSC (CGL, CHSL, MTS, GD), UPSC, रेलवे (NTPC, Group D), बैंकिंग (IBPS, SBI), NEET, JEE, पासपोर्ट, PAN कार्ड और कस्टम साइज़।" },
    { question: "What does it validate?", questionHi: "यह क्या चेक करता है?", answer: "File size (min/max KB), dimensions (px), DPI, format (JPG), and background color (white check).", answerHi: "फ़ाइल साइज़ (min/max KB), डाइमेंशन (px), DPI, फ़ॉर्मेट (JPG), और बैकग्राउंड कलर (सफ़ेद)।" },
    { question: "Can it auto-fix my photo?", questionHi: "क्या यह फ़ोटो ऑटो-फ़िक्स कर सकता है?", answer: "Yes! One click to resize, compress, and adjust DPI to meet the exact preset requirements.", answerHi: "हाँ! एक क्लिक में रिसाइज़, कंप्रेस और DPI एडजस्ट — सब ऑटोमैटिक।" },
    { question: "What is 'Add Name & Date'?", questionHi: "'नाम और तारीख़ जोड़ें' क्या है?", answer: "Many government exams require name and date inscribed on the photo. This feature adds them on a clean white strip.", answerHi: "कई सरकारी परीक्षाओं में फ़ोटो पर नाम और तारीख़ लिखनी होती है। यह फ़ीचर सफ़ेद पट्टी पर जोड़ देता है।" },
    { question: "What does 'Join Photo + Signature' do?", questionHi: "'फ़ोटो + हस्ताक्षर जोड़ें' क्या करता है?", answer: "Combines your photo and signature into a single vertical image — required by some exam portals.", answerHi: "फ़ोटो और हस्ताक्षर को एक वर्टिकल इमेज में जोड़ता है — कुछ परीक्षा पोर्टल में ज़रूरी होता है।" },
];

interface ExamPresetOption {
    value: string;
    label: string;
    photo: string;
    signature: string;
}

interface ExamCategory {
    name: string;
    icon: string;
    presets: ExamPresetOption[];
}

const CATEGORIES: ExamCategory[] = [
    {
        name: "SSC", icon: "🏛️",
        presets: [
            { value: "ssc_cgl", label: "SSC CGL", photo: "200×230 px · 4–100 KB", signature: "200×70 px · 1–20 KB" },
            { value: "ssc_chsl", label: "SSC CHSL", photo: "200×230 px · 4–100 KB", signature: "200×70 px · 1–20 KB" },
            { value: "ssc_mts", label: "SSC MTS", photo: "200×230 px · 4–100 KB", signature: "200×70 px · 1–20 KB" },
            { value: "ssc_gd", label: "SSC GD", photo: "200×230 px · 4–200 KB", signature: "200×70 px · 1–30 KB" },
        ],
    },
    {
        name: "UPSC", icon: "⚖️",
        presets: [
            { value: "upsc", label: "UPSC CSE", photo: "110×140 px · 20–300 KB", signature: "150×70 px · 5–150 KB" },
        ],
    },
    {
        name: "Railway", icon: "🚂",
        presets: [
            { value: "rrb_ntpc", label: "RRB NTPC", photo: "200×230 px · 2–50 KB", signature: "200×70 px · 1–20 KB" },
            { value: "rrb_group_d", label: "RRB Group D", photo: "200×230 px · 2–50 KB", signature: "200×70 px · 1–20 KB" },
        ],
    },
    {
        name: "Banking", icon: "🏦",
        presets: [
            { value: "ibps", label: "IBPS PO/Clerk", photo: "200×230 px · 2–50 KB", signature: "140×60 px · 1–20 KB" },
            { value: "sbi", label: "SBI PO/Clerk", photo: "200×230 px · 2–50 KB", signature: "140×60 px · 1–20 KB" },
        ],
    },
    {
        name: "NEET / JEE", icon: "🔬",
        presets: [
            { value: "neet", label: "NEET", photo: "200×200 px · 10–200 KB", signature: "200×70 px · 4–50 KB" },
            { value: "jee", label: "JEE Main", photo: "200×200 px · 10–200 KB", signature: "200×70 px · 4–50 KB" },
        ],
    },
    {
        name: "ID / Passport", icon: "🛂",
        presets: [
            { value: "passport", label: "Passport", photo: "413×531 px · 10–200 KB · 200 DPI", signature: "200×70 px · 5–50 KB" },
            { value: "pan_card", label: "PAN Card", photo: "200×200 px · 2–200 KB", signature: "140×60 px · 1–30 KB" },
        ],
    },
];

interface CheckResult {
    name: string;
    expected: string;
    actual: string;
    pass: boolean;
}

export default function ExamPhotoPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const today = new Date();
    const todayDateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;


    const [files, setFiles] = useState<File[]>([]);
    const [sigFiles, setSigFiles] = useState<File[]>([]);
    const [category, setCategory] = useState(0);
    const [presetIdx, setPresetIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fixing, setFixing] = useState(false);
    const [fixingSig, setFixingSig] = useState(false);

    // Name + Date
    const [nameText, setNameText] = useState("");
    const [dateText, setDateText] = useState("");
    const [showNameDate, setShowNameDate] = useState(false);
    const [nameProcessing, setNameProcessing] = useState(false);

    // Join
    const [joinProcessing, setJoinProcessing] = useState(false);

    // Preview
    const [preview, setPreview] = useState<string | null>(null);
    const [previewInfo, setPreviewInfo] = useState<{ width: number; height: number; sizeKB: string } | null>(null);

    const selectedPreset = CATEGORIES[category].presets[presetIdx];

    // Update preview when photo changes
    useEffect(() => {
        if (!files.length) {
            setPreview(null);
            setPreviewInfo(null);
            return;
        }
        const file = files[0];
        const url = URL.createObjectURL(file);
        setPreview(url);
        const img = new window.Image();
        img.onload = () => {
            setPreviewInfo({
                width: img.naturalWidth,
                height: img.naturalHeight,
                sizeKB: (file.size / 1024).toFixed(1),
            });
        };
        img.src = url;
        return () => URL.revokeObjectURL(url);
    }, [files]);

    const handleCategoryChange = (idx: number) => {
        setCategory(idx);
        setPresetIdx(0);
        setValidationResult(null);
    };

    const handleValidate = async () => {
        if (!files.length) return;
        setError(null);
        setValidationResult(null);
        setProgress(10);

        try {
            const result = await validateExamPhoto(files[0], selectedPreset.value, sigFiles[0]);
            setValidationResult(result);
            setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(isHi ? "जांच विफल रही।" : "Validation failed.");
            setProgress(0);
        }
    };

    const handleDownloadFixed = async () => {
        if (!validationResult?.fixed_file) return;
        setFixing(true);
        downloadBlob(validationResult.fixed_file, "exam_photo_fixed.jpg");
        setFixing(false);
    };

    const handleDownloadFixedSig = async () => {
        if (!validationResult?.fixed_sig_file) return;
        setFixingSig(true);
        downloadBlob(validationResult.fixed_sig_file, "exam_signature_fixed.jpg");
        setFixingSig(false);
    };

    const handleAddNameDate = async () => {
        if (!files.length || !nameText.trim()) return;
        setNameProcessing(true);
        setError(null);
        try {
            const resultFile = await addNameDateToPhoto(files[0], nameText.trim(), dateText.trim());
            downloadBlob(resultFile, "photo_with_name_date.jpg");
        } catch (e: any) {
            console.error(e);
            setError(isHi ? "नाम और तारीख़ जोड़ना विफल रहा।" : "Failed to add name and date.");
        }
        setNameProcessing(false);
    };

    const handleJoinPhotoSig = async () => {
        if (!files.length || !sigFiles.length) return;
        setJoinProcessing(true);
        setError(null);
        try {
            const resultFile = await joinPhotoSignature(files[0], sigFiles[0]);
            downloadBlob(resultFile, "photo_with_signature.jpg");
        } catch (e: any) {
            console.error(e);
            setError(isHi ? "फ़ोटो और हस्ताक्षर जोड़ना विफल रहा।" : "Failed to join photo and signature.");
        }
        setJoinProcessing(false);
    };

    const renderChecks = (checks: CheckResult[], title: string) => (
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 overflow-hidden">
            <div className="p-3 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
            </div>
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-slate-700/50 text-slate-500">
                        <th className="p-2 text-left">{isHi ? "जांच" : "Check"}</th>
                        <th className="p-2 text-left">{isHi ? "अपेक्षित" : "Expected"}</th>
                        <th className="p-2 text-left">{isHi ? "वास्तविक" : "Actual"}</th>
                        <th className="p-2 text-center">{isHi ? "परिणाम" : "Result"}</th>
                    </tr>
                </thead>
                <tbody>
                    {checks.map((c, i) => (
                        <tr key={i} className="border-b border-slate-700/30">
                            <td className="p-2 text-slate-300">{c.name}</td>
                            <td className="p-2 text-slate-400">{c.expected}</td>
                            <td className="p-2 text-slate-300 font-mono">{c.actual}</td>
                            <td className="p-2 text-center">
                                {c.pass
                                    ? <span className="inline-flex items-center gap-1 text-emerald-400 font-bold"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> {isHi ? "पास" : "PASS"}</span>
                                    : <span className="inline-flex items-center gap-1 text-red-400 font-bold"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {isHi ? "विफल" : "FAIL"}</span>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🎓 परीक्षा फ़ोटो" : "🎓 Exam Photo & Signature Tool"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "SSC, UPSC, रेलवे, बैंकिंग परीक्षा फ़ोटो" : "Validate, fix, and prepare photos for SSC, UPSC, Railway, Banking, NEET & more"}</p>
                <div className="mt-2 bg-yellow-500/10 text-yellow-500 text-xs py-1 px-3 rounded-full inline-block">
                    {isHi ? "⚡ आपके ब्राउज़र में प्रोसेस होता है (तेज़ और सुरक्षित)" : "⚡ Client-side processing (Fast & Private)"}
                </div>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">

                {/* ── Category Tabs ── */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "परीक्षा कैटेगरी" : "Exam Category"}</label>
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryChange(i)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${category === i
                                    ? "bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10"
                                    : "bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:text-slate-300"
                                    }`}
                            >
                                <span className="mr-1">{cat.icon}</span> {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Sub-Preset Selector ── */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "परीक्षा" : "Exam"}</label>
                    <div className="flex gap-2 flex-wrap">
                        {CATEGORIES[category].presets.map((p, i) => (
                            <button
                                key={p.value}
                                onClick={() => { setPresetIdx(i); setValidationResult(null); }}
                                className={presetIdx === i ? "btn-primary" : "btn-secondary"}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Spec Display ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-3">
                        <p className="text-xs text-indigo-400 font-semibold mb-1">{isHi ? "📸 फ़ोटो की आवश्यकताएँ" : "📸 Photo Requirements"}</p>
                        <p className="text-sm text-slate-300">{selectedPreset.photo}</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3">
                        <p className="text-xs text-amber-400 font-semibold mb-1">{isHi ? "✍️ हस्ताक्षर की आवश्यकताएँ" : "✍️ Signature Requirements"}</p>
                        <p className="text-sm text-slate-300">{selectedPreset.signature}</p>
                    </div>
                </div>

                {/* ── Upload Photo ── */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "फ़ोटो अपलोड करें" : "Upload Photo"}</label>
                    <FileUpload maxFiles={1} onFilesSelected={(f) => { setFiles(f); setValidationResult(null); }} accept={{ "image/*": [".jpg", ".jpeg", ".png"] }} />
                </div>

                {/* ── Live Preview ── */}
                {preview && previewInfo && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                        <img src={preview} alt="Preview" className="w-24 h-auto rounded-lg border border-slate-600/50 shadow-lg" />
                        <div className="space-y-1">
                            <p className="text-sm text-slate-300 font-semibold">{isHi ? "अपलोड की गई फ़ोटो" : "Uploaded Photo"}</p>
                            <p className="text-xs text-slate-400">
                                <span className="text-indigo-400 font-mono">{previewInfo.width}×{previewInfo.height}</span> px
                                <span className="mx-2 text-slate-600">·</span>
                                <span className="text-amber-400 font-mono">{previewInfo.sizeKB}</span> KB
                            </p>
                            <p className="text-xs text-slate-500">{isHi ? "आवश्यक:" : "Required:"} {selectedPreset.photo}</p>
                        </div>
                    </div>
                )}

                {/* ── Upload Signature ── */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">{isHi ? "हस्ताक्षर अपलोड करें" : "Upload Signature"} <span className="text-slate-600">{isHi ? "(वैकल्पिक)" : "(optional)"}</span></label>
                    <FileUpload maxFiles={1} onFilesSelected={setSigFiles} accept={{ "image/*": [".jpg", ".jpeg", ".png"] }} />
                </div>

                {/* ── Validate Button ── */}
                <button onClick={handleValidate} disabled={!files.length} className="btn-primary w-full text-lg">
                    🔍 {isHi ? "फ़ोटो मान्य करें" : "Validate Photo"}{sigFiles.length > 0 ? (isHi ? " और हस्ताक्षर" : " & Signature") : ""}
                </button>

                <ProgressBar progress={progress} label={isHi ? "जांच हो रही है..." : "Validating..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* ── Validation Results ── */}
                {validationResult && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Overall result banner */}
                        <div className={`p-4 rounded-xl text-center font-bold text-lg ${validationResult.photo?.pass
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                            }`}>
                            {validationResult.photo?.pass ? (isHi ? "✅ सभी फ़ोटो जांच पास हुईं" : "✅ ALL PHOTO CHECKS PASSED") : (isHi ? "❌ कुछ फ़ोटो जांच विफल रहीं" : "❌ SOME PHOTO CHECKS FAILED")}
                        </div>

                        {validationResult.photo?.checks && renderChecks(validationResult.photo.checks, isHi ? `📸 फ़ोटो जांच — ${selectedPreset.label}` : `📸 Photo Checks — ${selectedPreset.label}`)}
                        {validationResult.signature?.checks && renderChecks(validationResult.signature.checks, isHi ? "✍️ हस्ताक्षर जांच" : "✍️ Signature Checks")}

                        {/* Auto-fix downloads */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="text-center space-y-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                                <p className="text-xs text-slate-400">{isHi ? "फ़ोटो ऑटो-फ़िक्स करें — रिसाइज़ और कंप्रेस करें" : "Auto-fix Photo — resize & compress to spec"}</p>
                                <button onClick={handleDownloadFixed} disabled={fixing || !validationResult.fixed_file} className="btn-primary w-full">
                                    {fixing ? (isHi ? "बनाया जा रहा है..." : "Generating...") : (isHi ? "⬇️ ठीक की गई फ़ोटो डाउनलोड करें" : "⬇️ Download Fixed Photo")}
                                </button>
                                {validationResult.fixed_file && (
                                    <p className="text-xs text-slate-500">{isHi ? "ठीक किया गया:" : "Fixed:"} {(validationResult.fixed_file.size / 1024).toFixed(1)} KB</p>
                                )}
                            </div>
                            {validationResult.signature && (
                                <div className="text-center space-y-2 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                                    <p className="text-xs text-slate-400">{isHi ? "हस्ताक्षर ऑटो-फ़िक्स करें — रिसाइज़ और कंप्रेस करें" : "Auto-fix Signature — resize & compress"}</p>
                                    <button onClick={handleDownloadFixedSig} disabled={fixingSig || !validationResult.fixed_sig_file} className="btn-primary w-full">
                                        {fixingSig ? (isHi ? "बनाया जा रहा है..." : "Generating...") : (isHi ? "⬇️ ठीक किया गया हस्ताक्षर डाउनलोड करें" : "⬇️ Download Fixed Signature")}
                                    </button>
                                    {validationResult.fixed_sig_file && (
                                        <p className="text-xs text-slate-500">{isHi ? "ठीक किया गया:" : "Fixed:"} {(validationResult.fixed_sig_file.size / 1024).toFixed(1)} KB</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Divider ── */}
                {files.length > 0 && (
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-slate-900 px-3 text-slate-500">{isHi ? "अतिरिक्त टूल्स" : "Extra Tools"}</span>
                        </div>
                    </div>
                )}

                {/* ── Name + Date Overlay ── */}
                {files.length > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-violet-500/5 to-pink-500/5 border border-violet-500/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-violet-300">✏️ {isHi ? "फ़ोटो पर नाम और तारीख़ जोड़ें" : "Add Name & Date on Photo"}</p>
                                <p className="text-xs text-slate-500">{isHi ? "कई सरकारी परीक्षा फ़ॉर्म में आवश्यक" : "Required by many govt exam forms"}</p>
                            </div>
                            <button
                                onClick={() => setShowNameDate(!showNameDate)}
                                className="text-xs px-3 py-1 rounded-lg bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition-colors"
                            >
                                {showNameDate ? (isHi ? "छुपाएं" : "Hide") : (isHi ? "दिखाएं" : "Show")}
                            </button>
                        </div>
                        {showNameDate && (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder={isHi ? "आपका नाम" : "Your Name"}
                                    value={nameText}
                                    onChange={e => setNameText(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:border-violet-500/50 focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder={isHi ? `तारीख़ (उदा. ${todayDateStr})` : `Date (e.g. ${todayDateStr})`}
                                    value={dateText}
                                    onChange={e => setDateText(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:border-violet-500/50 focus:outline-none"
                                />
                                <button
                                    onClick={handleAddNameDate}
                                    disabled={!nameText.trim() || nameProcessing}
                                    className="btn-primary w-full"
                                >
                                    {nameProcessing ? (isHi ? "प्रोसेस हो रहा है..." : "Processing...") : (isHi ? "⬇️ नाम और तारीख़ के साथ फ़ोटो डाउनलोड करें" : "⬇️ Download Photo with Name & Date")}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Join Photo + Signature ── */}
                {files.length > 0 && sigFiles.length > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border border-teal-500/20 p-4 space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-teal-300">🔗 {isHi ? "फ़ोटो + हस्ताक्षर जोड़ें" : "Join Photo + Signature"}</p>
                            <p className="text-xs text-slate-500">{isHi ? "एक वर्टिकल इमेज में मिलाएं" : "Combine vertically into one image"}</p>
                        </div>
                        <button
                            onClick={handleJoinPhotoSig}
                            disabled={joinProcessing}
                            className="btn-primary w-full"
                        >
                            {joinProcessing ? (isHi ? "जोड़ा जा रहा है..." : "Joining...") : (isHi ? "⬇️ जुड़ी हुई इमेज डाउनलोड करें" : "⬇️ Download Combined Image")}
                        </button>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/exam-photo" tools={ALL_TOOLS} />
        </div>
    );
}
