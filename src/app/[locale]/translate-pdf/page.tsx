"use client";
import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How to translate a PDF for free?", questionHi: "मुफ़्त में PDF का अनुवाद कैसे करें?", answer: "Upload your PDF, select source and target languages (or use auto-detect), and click Translate. The tool processes everything in your browser — no signup, no payment, no file upload to any server.", answerHi: "अपनी PDF अपलोड करें, स्रोत और लक्ष्य भाषा चुनें (या ऑटो-डिटेक्ट उपयोग करें), और अनुवाद पर क्लिक करें। सब कुछ आपके ब्राउज़र में — कोई साइनअप, कोई भुगतान नहीं।" },
    { question: "Which languages are supported?", questionHi: "कौन सी भाषाएँ सपोर्ट हैं?", answer: "17 languages: English, Hindi, Spanish, French, German, Russian, Italian, Dutch, Polish, Romanian, Swedish, Danish, Finnish, Turkish, Arabic, Chinese, Japanese, Korean, Ukrainian, and Indonesian. Translate from English to any language or from select languages back to English.", answerHi: "17 भाषाएँ: अंग्रेज़ी, हिंदी, स्पेनिश, फ्रेंच, जर्मन, रूसी, इटैलियन, डच, पोलिश, रोमानियन, स्वीडिश, डैनिश, फिनिश, तुर्की, अरबी, चीनी, जापानी, कोरियाई, यूक्रेनी, इंडोनेशियाई।" },
    { question: "Is my PDF uploaded to a server?", questionHi: "क्या मेरी PDF किसी सर्वर पर अपलोड होती है?", answer: "No. Your PDF is processed entirely in your browser using WebAssembly and AI models. No file data ever leaves your device. This makes it safe for confidential documents, contracts, and personal files.", answerHi: "नहीं। आपकी PDF पूरी तरह ब्राउज़र में WebAssembly और AI मॉडल से प्रोसेस होती है। कोई डेटा बाहर नहीं जाता। गोपनीय दस्तावेज़ों के लिए सुरक्षित।" },
    { question: "Does it work offline?", questionHi: "क्या यह ऑफलाइन काम करता है?", answer: "After the AI translation model is downloaded on first use (~30MB), translation works offline. The model is cached by your browser for future use without internet.", answerHi: "पहली बार AI मॉडल डाउनलोड होने के बाद (~30MB), अनुवाद ऑफलाइन चलता है। मॉडल ब्राउज़र में कैश हो जाता है।" },
    { question: "Is the layout preserved?", questionHi: "क्या लेआउट बना रहता है?", answer: "The translated text is rebuilt into a clean, readable A4 PDF. Complex layouts with tables, images, or columns may be simplified to focus on text content.", answerHi: "अनुवादित टेक्स्ट साफ A4 PDF में बनता है। टेबल, इमेज या कॉलम वाले जटिल लेआउट सरल हो सकते हैं।" },
    { question: "How accurate is the translation?", questionHi: "अनुवाद कितना सटीक है?", answer: "The tool uses Helsinki-NLP neural machine translation models, which provide high-quality translations for common language pairs. For professional or legal documents, we recommend having a human review the output.", answerHi: "यह टूल Helsinki-NLP न्यूरल मशीन ट्रांसलेशन मॉडल उपयोग करता है जो आम भाषा जोड़ियों के लिए उच्च गुणवत्ता देता है। पेशेवर दस्तावेज़ों के लिए मानवीय समीक्षा अनुशंसित।" },
    { question: "Can I translate a scanned PDF?", questionHi: "क्या स्कैन की गई PDF का अनुवाद कर सकते हैं?", answer: "This tool works with text-based PDFs. Scanned PDFs (images of text) require OCR first. If your PDF has no extractable text, you will see an error message.", answerHi: "यह टूल टेक्स्ट-आधारित PDF पर काम करता है। स्कैन की गई PDF (इमेज) के लिए पहले OCR ज़रूरी है।" },
];

const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi / हिंदी" },
    { code: "es", name: "Spanish / Español" },
    { code: "fr", name: "French / Français" },
    { code: "de", name: "German / Deutsch" },
    { code: "ru", name: "Russian / Русский" },
    { code: "it", name: "Italian / Italiano" },
    { code: "nl", name: "Dutch / Nederlands" },
    { code: "pl", name: "Polish / Polski" },
    { code: "ro", name: "Romanian / Română" },
    { code: "sv", name: "Swedish / Svenska" },
    { code: "da", name: "Danish / Dansk" },
    { code: "fi", name: "Finnish / Suomi" },
    { code: "tr", name: "Turkish / Türkçe" },
    { code: "ar", name: "Arabic / عربي" },
    { code: "zh", name: "Chinese / 中文" },
    { code: "ja", name: "Japanese / 日本語" },
    { code: "ko", name: "Korean / 한국어" },
    { code: "uk", name: "Ukrainian / Українська" },
    { code: "id", name: "Indonesian / Bahasa" },
];

// Only models verified to exist on HuggingFace Xenova hub
const MODEL_MAP: Record<string, string> = {
    "en→hi": "Xenova/opus-mt-en-hi",
    "en→es": "Xenova/opus-mt-en-es",
    "en→fr": "Xenova/opus-mt-en-fr",
    "en→de": "Xenova/opus-mt-en-de",
    "en→ru": "Xenova/opus-mt-en-ru",
    "en→it": "Xenova/opus-mt-en-it",
    "en→nl": "Xenova/opus-mt-en-nl",
    "en→pl": "Xenova/opus-mt-en-pl",
    "en→ro": "Xenova/opus-mt-en-ro",
    "en→sv": "Xenova/opus-mt-en-sv",
    "en→da": "Xenova/opus-mt-en-da",
    "en→fi": "Xenova/opus-mt-en-fi",
    "en→tr": "Xenova/opus-mt-en-tr",
    "en→ar": "Xenova/opus-mt-en-ar",
    "en→zh": "Xenova/opus-mt-en-zh",
    "en→ja": "Xenova/opus-mt-en-jap",
    "en→ko": "Xenova/opus-mt-en-ko",
    "en→uk": "Xenova/opus-mt-en-uk",
    "en→id": "Xenova/opus-mt-en-id",
    "hi→en": "Xenova/opus-mt-hi-en",
    "es→en": "Xenova/opus-mt-es-en",
    "fr→en": "Xenova/opus-mt-fr-en",
    "de→en": "Xenova/opus-mt-de-en",
    "ru→en": "Xenova/opus-mt-ru-en",
    "it→en": "Xenova/opus-mt-it-en",
    "nl→en": "Xenova/opus-mt-nl-en",
    "pl→en": "Xenova/opus-mt-pl-en",
    "ro→en": "Xenova/opus-mt-ROMANCE-en",
    "sv→en": "Xenova/opus-mt-sv-en",
    "da→en": "Xenova/opus-mt-da-en",
    "fi→en": "Xenova/opus-mt-fi-en",
    "tr→en": "Xenova/opus-mt-tr-en",
    "ar→en": "Xenova/opus-mt-ar-en",
    "zh→en": "Xenova/opus-mt-zh-en",
    "ja→en": "Xenova/opus-mt-jap-en",
    "ko→en": "Xenova/opus-mt-ko-en",
    "uk→en": "Xenova/opus-mt-uk-en",
};

// ── Auto-detect: heuristic language detection using Unicode scripts ─────────
function detectLanguage(text: string): string {
    const sample = text.slice(0, 2000);

    if (/[\u4e00-\u9fff]/.test(sample)) {
        if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sample)) return "ja";
        return "zh";
    }
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(sample)) return "ja";
    if (/[\uac00-\ud7af\u1100-\u11ff]/.test(sample)) return "ko";
    if (/[\u0900-\u097f]/.test(sample)) return "hi";
    if (/[\u0600-\u06ff\u0750-\u077f]/.test(sample)) return "ar";
    if (/[\u0400-\u04ff]/.test(sample)) {
        if (/[іїєґ]/i.test(sample)) return "uk";
        return "ru";
    }

    const lower = sample.toLowerCase();
    if (/[ışçğü]/i.test(sample) && /\b(bir|ve|bu|ile|için|nedir|değil)\b/.test(lower)) return "tr";
    if (/\b(el|la|los|las|es|que|del|como|está|ñ)\b/i.test(lower) || /[ñ¿¡]/.test(sample)) return "es";
    if (/\b(le|la|les|des|est|une|dans|pour|que|avec|sont|c'est|l'|d'|nous|vous|très|français)\b/.test(lower)
        || /[àâæçéèêëîïôùûüÿœ]/i.test(sample)) return "fr";
    if (/\b(der|die|das|und|ist|ein|eine|nicht|sind|ich|auf|für|mit|den|dem|sich|auch)\b/.test(lower)
        || /[äöüß]/i.test(sample)) return "de";
    if (/\b(il|lo|la|gli|le|dell|della|che|è|sono|per|con|non|anche|come|questo|quello|italiano)\b/.test(lower)) return "it";
    if (/\b(de|het|een|van|en|dat|niet|zijn|voor|met|ook|maar|nog|geen|nederlands)\b/.test(lower)) return "nl";
    if (/[ąćęłńóśźż]/i.test(sample)) return "pl";
    if (/\b(och|att|det|för|med|den|var|som|har|inte|till|från|svenska)\b/.test(lower) || /[åä]/i.test(sample)) return "sv";
    if (/\b(og|er|det|til|for|med|den|har|ikke|var|på|dansk)\b/.test(lower) || /[æø]/i.test(sample)) return "da";
    if (/\b(ja|on|ei|se|että|kun|hän|myös|minä|suomi)\b/.test(lower) || /[äö]/i.test(sample)) return "fi";
    if (/\b(yang|dan|di|ini|itu|dengan|untuk|dari|adalah|pada|tidak|indonesia)\b/.test(lower)) return "id";

    return "en";
}

type Step = "idle" | "detecting" | "loading-model" | "extracting" | "translating" | "building" | "done" | "error";

// ── Pipeline cache & initialization via CDN (avoids npm bundler issues) ─────
let pipelineCache: Record<string, any> = {};
let initPromise: Promise<any> | null = null;

async function initTransformers() {
    if (initPromise) return initPromise;

    initPromise = (async () => {
        // Load from CDN to avoid Next.js bundler interfering with ONNX WASM
        // @ts-ignore - CDN URL, resolved at runtime
        const mod = await import(/* webpackIgnore: true */ "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
        const pipeline = mod.pipeline;
        const env = mod.env;

        // Configure ONNX WASM file paths to CDN
        env.backends.onnx.wasm.numThreads = 1;

        return { pipeline, env };
    })();

    return initPromise;
}

async function getTranslator(
    modelId: string,
    progressCb: (p: number) => void
) {
    if (pipelineCache[modelId]) return pipelineCache[modelId];

    const { pipeline } = await initTransformers();

    const translator = await pipeline("translation", modelId, {
        progress_callback: (progress: any) => {
            if (progress?.progress != null && typeof progress.progress === "number") {
                progressCb(Math.min(Math.round(progress.progress), 99));
            }
        },
    });

    if (typeof translator !== "function") {
        throw new Error("Failed to load translation model. Please check your internet connection and try again.");
    }

    pipelineCache[modelId] = translator;
    return translator;
}

// Safe translation with robust result handling
async function safeTranslate(translator: Function, text: string): Promise<string> {
    try {
        if (!text.trim()) return text;
        const result = await translator(text);

        // Transformers.js translation pipeline can return:
        // [{ translation_text: "..." }]  — most common
        // ["..."]                         — sometimes
        // { translation_text: "..." }    — rare
        // "..."                           — rare
        if (Array.isArray(result)) {
            if (result.length === 0) return text;
            const first = result[0];
            if (typeof first === "string") return first;
            if (first && typeof first.translation_text === "string") return first.translation_text;
            return text;
        }
        if (typeof result === "string") return result;
        if (result && typeof result.translation_text === "string") return result.translation_text;
        return text;
    } catch {
        return text; // keep original on failure
    }
}

export default function TranslatePdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const [file, setFile] = useState<File | null>(null);
    const [sourceLang, setSourceLang] = useState("auto");
    const [targetLang, setTargetLang] = useState("hi");
    const [step, setStep] = useState<Step>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [detectedLang, setDetectedLang] = useState<string | null>(null);

    const handleTranslate = useCallback(async () => {
        if (!file) return;
        setError(null);
        setResultBlob(null);
        setDetectedLang(null);

        try {
            // ── Step 1: Extract text from PDF (client-side) ─────────────
            setStep("extracting");
            setProgress(10);
            const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
            GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs",
                import.meta.url
            ).toString();
            const ab = await file.arrayBuffer();
            const pdfDoc = await getDocument({ data: ab }).promise;
            const pages: string[] = [];
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const tc = await page.getTextContent();
                pages.push(
                    tc.items
                        .filter((item: any) => item && typeof item.str === "string")
                        .map((item: any) => item.str)
                        .join(" ")
                );
            }
            const fullText = pages.join("\n\n");
            if (!fullText.trim()) {
                throw new Error(isHi
                    ? "PDF में कोई टेक्स्ट नहीं मिला। यह स्कैन की गई PDF हो सकती है।"
                    : "No text found in PDF. It might be a scanned document.");
            }

            // ── Step 2: Detect source language if auto ──────────────────
            let resolvedSource = sourceLang;
            if (sourceLang === "auto") {
                setStep("detecting");
                setProgress(20);
                resolvedSource = detectLanguage(fullText);
                setDetectedLang(resolvedSource);
                await new Promise((r) => setTimeout(r, 300));
            }

            if (resolvedSource === targetLang) {
                throw new Error(isHi
                    ? "स्रोत और लक्ष्य भाषा समान हैं।"
                    : "Source and target language are the same.");
            }

            const modelKey = `${resolvedSource}\u2192${targetLang}`;
            const modelId = MODEL_MAP[modelKey];
            if (!modelId) {
                const srcName = SUPPORTED_LANGUAGES.find((l) => l.code === resolvedSource)?.name || resolvedSource;
                const tgtName = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;
                throw new Error(isHi
                    ? `${srcName} → ${tgtName} अनुवाद उपलब्ध नहीं है। English को स्रोत या लक्ष्य के रूप में चुनें।`
                    : `${srcName} → ${tgtName} is not available. Choose English as source or target.`);
            }

            // ── Step 3: Load translation model ──────────────────────────
            setStep("loading-model");
            setProgress(25);
            const translator = await getTranslator(modelId, (p) => setProgress(25 + Math.floor(p * 0.3)));

            // ── Step 4: Translate in chunks ─────────────────────────────
            setStep("translating");
            setProgress(55);

            const CHUNK_SIZE = 400;
            const chunks: string[] = [];
            for (let i = 0; i < fullText.length; i += CHUNK_SIZE) {
                chunks.push(fullText.slice(i, i + CHUNK_SIZE));
            }

            const translatedChunks: string[] = [];
            for (let i = 0; i < chunks.length; i++) {
                const translated = await safeTranslate(translator, chunks[i]);
                translatedChunks.push(translated);
                setProgress(55 + Math.floor(((i + 1) / chunks.length) * 30));
            }
            const translatedText = translatedChunks.join(" ");

            // ── Step 5: Build output PDF ────────────────────────────────
            setStep("building");
            setProgress(90);
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageWidth = 210 - 20;
            doc.setFontSize(11);
            const lines = doc.splitTextToSize(translatedText, pageWidth);
            let y = 20;
            for (let i = 0; i < lines.length; i++) {
                if (y > 277) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines[i], 10, y);
                y += 7;
            }

            const blob = new Blob([doc.output("arraybuffer")], { type: "application/pdf" });
            setResultBlob(blob);
            setStep("done");
            setProgress(100);
        } catch (e: any) {
            setError(e?.message || (isHi ? "अनुवाद विफल रहा।" : "Translation failed."));
            setStep("error");
            setProgress(0);
        }
    }, [file, sourceLang, targetLang, isHi]);

    const stepLabels: Record<Step, string> = {
        idle: "",
        detecting: isHi ? "भाषा पहचानी जा रही है..." : "Detecting language...",
        "loading-model": isHi ? "अनुवाद मॉडल लोड हो रहा है..." : "Loading translation model...",
        extracting: isHi ? "PDF से टेक्स्ट निकाल रहे हैं..." : "Extracting text from PDF...",
        translating: isHi ? "अनुवाद हो रहा है..." : "Translating text...",
        building: isHi ? "नई PDF बना रहे हैं..." : "Building translated PDF...",
        done: isHi ? "पूरा हुआ!" : "Done!",
        error: isHi ? "त्रुटि हुई" : "Error",
    };

    const detectedLangName = detectedLang ? SUPPORTED_LANGUAGES.find((l) => l.code === detectedLang)?.name : null;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌍 PDF अनुवाद करें" : "🌍 Translate PDF"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi
                        ? "PDF का टेक्स्ट कई भाषाओं में अनुवाद करें — पूरी तरह ऑफलाइन"
                        : "Translate PDF text into multiple languages — fully in-browser"}
                </p>
                <div className="mt-2 bg-green-500/10 text-green-400 text-xs py-1 px-3 rounded-full inline-block">
                    🔒 100% Client-Side — Your PDF never leaves your device
                </div>
            </div>

            <div className="glass-card max-w-xl mx-auto space-y-6">
                <FileUpload
                    accept={{ "application/pdf": [".pdf"] }}
                    maxFiles={1}
                    onFilesSelected={(files) => {
                        setFile(files[0]);
                        setStep("idle");
                        setResultBlob(null);
                        setDetectedLang(null);
                    }}
                    label={isHi ? "यहाँ PDF ड्रॉप करें" : "Drop PDF here"}
                    hint={isHi ? "अधिकतम 20MB" : "Max 20MB"}
                />

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

                {/* Source language */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                        {isHi ? "स्रोत भाषा (PDF की भाषा)" : "Source language (PDF language)"}
                    </label>
                    <select
                        value={sourceLang}
                        onChange={(e) => { setSourceLang(e.target.value); setDetectedLang(null); }}
                        className="w-full bg-black/30 text-white rounded-lg px-3 py-2.5 border border-white/10"
                    >
                        <option value="auto">🔍 {isHi ? "ऑटो-डिटेक्ट" : "Auto-detect"}</option>
                        {SUPPORTED_LANGUAGES.map((l) => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                    {detectedLangName && step === "done" && (
                        <p className="text-xs text-indigo-400 mt-1">
                            {isHi ? `पहचानी गई भाषा: ${detectedLangName}` : `Detected: ${detectedLangName}`}
                        </p>
                    )}
                </div>

                {/* Target language */}
                <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                        {isHi ? "किस भाषा में अनुवाद करें?" : "Translate to:"}
                    </label>
                    <select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="w-full bg-black/30 text-white rounded-lg px-3 py-2.5 border border-white/10"
                    >
                        {SUPPORTED_LANGUAGES.filter((l) => l.code !== sourceLang).map((l) => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={handleTranslate}
                    disabled={!file || (step !== "idle" && step !== "error" && step !== "done")}
                    className="btn-primary w-full"
                >
                    {step === "idle" || step === "error" || step === "done"
                        ? isHi ? "🌍 अनुवाद शुरू करें" : "🌍 Translate PDF"
                        : stepLabels[step]}
                </button>

                {step !== "idle" && step !== "error" && (
                    <ProgressBar progress={progress} label={stepLabels[step]} />
                )}

                {/* Step indicators */}
                {step !== "idle" && step !== "error" && (
                    <div className="flex justify-between text-xs">
                        {(["extracting", "loading-model", "translating", "building", "done"] as Step[]).map(
                            (s, i) => {
                                const order = ["extracting", "loading-model", "translating", "building", "done"];
                                const currentIdx = order.indexOf(step);
                                const active = currentIdx >= i;
                                return (
                                    <div
                                        key={s}
                                        className={`flex flex-col items-center gap-1 ${active ? "text-indigo-400" : "text-slate-600"}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${active ? "bg-indigo-400" : "bg-slate-600"}`} />
                                        <span>{["Extract", "Model", "Translate", "Build", "Done"][i]}</span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {resultBlob && step === "done" && (
                    <div className="flex justify-center pt-2">
                        <DownloadButton
                            onClick={() => {
                                const url = URL.createObjectURL(resultBlob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `translated_${targetLang}_${file?.name}`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            label={isHi ? "अनुवादित PDF डाउनलोड करें" : "Download Translated PDF"}
                        />
                    </div>
                )}
            </div>

            {/* SEO content section */}
            <div className="max-w-3xl mx-auto space-y-8 text-sm text-slate-400 leading-relaxed">
                <section>
                    <h2 className="text-lg font-semibold text-slate-200 mb-3">
                        {isHi ? "PDF का अनुवाद कैसे करें?" : "How to Translate a PDF"}
                    </h2>
                    <ol className="list-decimal list-inside space-y-1.5">
                        <li>{isHi ? "अपनी PDF फ़ाइल अपलोड करें (या ड्रैग-ड्रॉप करें)" : "Upload your PDF file (or drag and drop)"}</li>
                        <li>{isHi ? "स्रोत भाषा चुनें या ऑटो-डिटेक्ट छोड़ें" : "Select the source language or leave it on auto-detect"}</li>
                        <li>{isHi ? "लक्ष्य भाषा चुनें (हिंदी, स्पेनिश, फ्रेंच, आदि)" : "Choose the target language (Hindi, Spanish, French, etc.)"}</li>
                        <li>{isHi ? '"अनुवाद शुरू करें" पर क्लिक करें' : 'Click "Translate PDF"'}</li>
                        <li>{isHi ? "अनुवादित PDF डाउनलोड करें" : "Download your translated PDF"}</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-200 mb-3">
                        {isHi ? "FileForge PDF अनुवादक क्यों चुनें?" : "Why Choose FileForge PDF Translator?"}
                    </h2>
                    <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span><strong className="text-slate-300">{isHi ? "100% निजी" : "100% Private"}</strong> — {isHi ? "आपकी PDF कभी आपके डिवाइस से बाहर नहीं जाती। कोई सर्वर अपलोड नहीं।" : "Your PDF never leaves your device. No server upload. Safe for confidential contracts, legal documents, and personal files."}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span><strong className="text-slate-300">{isHi ? "AI-संचालित अनुवाद" : "AI-Powered Translation"}</strong> — {isHi ? "Helsinki-NLP न्यूरल मशीन ट्रांसलेशन मॉडल — उच्च गुणवत्ता का अनुवाद।" : "Uses Helsinki-NLP neural machine translation models for high-quality, context-aware translations."}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span><strong className="text-slate-300">{isHi ? "ऑटो-डिटेक्ट भाषा" : "Auto-Detect Language"}</strong> — {isHi ? "स्रोत भाषा खुद पहचानता है — मैन्युअल चयन की ज़रूरत नहीं।" : "Automatically detects the source language — no manual selection needed."}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span><strong className="text-slate-300">{isHi ? "17 भाषाएँ" : "17 Languages"}</strong> — {isHi ? "हिंदी, अंग्रेज़ी, स्पेनिश, फ्रेंच, जर्मन, अरबी, चीनी, जापानी, कोरियाई और अन्य।" : "Hindi, English, Spanish, French, German, Arabic, Chinese, Japanese, Korean, and more."}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">✓</span>
                            <span><strong className="text-slate-300">{isHi ? "मुफ़्त और असीमित" : "Free & Unlimited"}</strong> — {isHi ? "कोई साइनअप नहीं, कोई सीमा नहीं, कोई वॉटरमार्क नहीं।" : "No signup, no limits, no watermarks. Translate as many PDFs as you want."}</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-slate-200 mb-3">
                        {isHi ? "समर्थित भाषाएँ" : "Supported Languages"}
                    </h2>
                    <p className="mb-2">
                        {isHi
                            ? "English से अनुवाद: हिंदी, स्पेनिश, फ्रेंच, जर्मन, रूसी, इटैलियन, डच, पोलिश, रोमानियन, स्वीडिश, डैनिश, फिनिश, तुर्की, अरबी, चीनी, जापानी, कोरियाई, यूक्रेनी, इंडोनेशियाई।"
                            : "From English: Hindi, Spanish, French, German, Russian, Italian, Dutch, Polish, Romanian, Swedish, Danish, Finnish, Turkish, Arabic, Chinese, Japanese, Korean, Ukrainian, Indonesian."}
                    </p>
                    <p>
                        {isHi
                            ? "English में अनुवाद: हिंदी, स्पेनिश, फ्रेंच, जर्मन, रूसी, इटैलियन, डच, पोलिश, रोमानियन, स्वीडिश, डैनिश, फिनिश, तुर्की, अरबी, चीनी, जापानी, कोरियाई, यूक्रेनी।"
                            : "To English: Hindi, Spanish, French, German, Russian, Italian, Dutch, Polish, Romanian, Swedish, Danish, Finnish, Turkish, Arabic, Chinese, Japanese, Korean, Ukrainian."}
                    </p>
                </section>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/translate-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
