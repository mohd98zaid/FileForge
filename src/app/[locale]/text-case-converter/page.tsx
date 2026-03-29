"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is camelCase?", questionHi: "camelCase क्या है?", answer: "camelCase starts with a lowercase letter and capitalizes each subsequent word without spaces, e.g. myVariableName.", answerHi: "camelCase छोटे अक्षर से शुरू होता है और हर अगले शब्द का पहला अक्षर बड़ा होता है, बिना स्पेस के, जैसे myVariableName." },
    { question: "What is PascalCase?", questionHi: "PascalCase क्या है?", answer: "PascalCase capitalizes the first letter of every word without spaces, e.g. MyVariableName.", answerHi: "PascalCase में हर शब्द का पहला अक्षर बड़ा होता है, बिना स्पेस के, जैसे MyVariableName." },
    { question: "What is the difference between snake_case and kebab-case?", questionHi: "snake_case और kebab-case में क्या अंतर है?", answer: "snake_case uses underscores (_) to separate words while kebab-case uses hyphens (-).", answerHi: "snake_case शब्दों को अंडरस्कोर (_) से अलग करता है जबकि kebab-case हाइफ़न (-) का उपयोग करता है." },
    { question: "Is my text sent to any server?", questionHi: "क्या मेरा टेक्स्ट किसी सर्वर पर भेजा जाता है?", answer: "No, all conversion happens entirely in your browser.", answerHi: "नहीं, सभी रूपांतरण पूरी तरह से आपके ब्राउज़र में होता है." },
];

function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function toCamelCase(str: string): string {
    const words = str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
    return words
        .map((w, i) =>
            i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
}

function toPascalCase(str: string): string {
    const words = str.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
    return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
}

function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toLowerCase();
}

function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function toConstantCase(str: string): string {
    return toSnakeCase(str).toUpperCase();
}

type CaseType = "UPPERCASE" | "lowercase" | "Title Case" | "camelCase" | "PascalCase" | "snake_case" | "kebab-case" | "CONSTANT_CASE";

const converters: Record<CaseType, (s: string) => string> = {
    UPPERCASE: (s) => s.toUpperCase(),
    lowercase: (s) => s.toLowerCase(),
    "Title Case": toTitleCase,
    camelCase: toCamelCase,
    PascalCase: toPascalCase,
    snake_case: toSnakeCase,
    "kebab-case": toKebabCase,
    CONSTANT_CASE: toConstantCase,
};

export default function TextCaseConverterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [activeCase, setActiveCase] = useState<CaseType | null>(null);
    const [copied, setCopied] = useState(false);

    const convert = (type: CaseType) => {
        setOutput(converters[type](input));
        setActiveCase(type);
        setCopied(false);
    };

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">
                    {isHi ? "🔤 टेक्स्ट केस कन्वर्टर" : "🔤 Text Case Converter"}
                </h1>
                <p className="mt-2 text-slate-400">
                    {isHi
                        ? "टेक्स्ट को विभिन्न केस फ़ॉर्मेट में बदलें"
                        : "Convert text between different case formats instantly"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                {/* Input */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "इनपुट टेक्स्ट" : "Input Text"}
                        </label>
                        <span className="text-sm text-slate-500">
                            {input.length} {isHi ? "अक्षर" : "characters"}
                        </span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setOutput("");
                            setActiveCase(null);
                        }}
                        placeholder={isHi ? "यहाँ टेक्स्ट टाइप या पेस्ट करें..." : "Type or paste text here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[150px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    />
                </div>

                {/* Conversion Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {(Object.keys(converters) as CaseType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => convert(type)}
                            disabled={!input}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                activeCase === type
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white"
                            } ${!input ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "आउटपुट" : "Output"}
                        </label>
                        <button
                            onClick={copyOutput}
                            disabled={!output}
                            className={`text-sm px-3 py-1 rounded transition-colors ${
                                copied
                                    ? "bg-green-600/20 text-green-400"
                                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                            } ${!output ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {copied
                                ? isHi
                                    ? "कॉपी हो गया!"
                                    : "Copied!"
                                : isHi
                                    ? "कॉपी करें"
                                    : "Copy"}
                        </button>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder={isHi ? "रूपांतरित टेक्स्ट यहाँ दिखेगा..." : "Converted text will appear here..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-[150px] text-slate-200 placeholder-slate-500 focus:outline-none resize-y"
                    />
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/text-case-converter" tools={ALL_TOOLS} />
        </div>
    );
}
