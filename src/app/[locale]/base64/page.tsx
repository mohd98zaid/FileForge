"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is Base64?", questionHi: "Base64 क्या है?", answer: "Base64 is a way to encode binary data into an ASCII string format.", answerHi: "Base64 बाइनरी डेटा को ASCII स्ट्रिंग फ़ॉर्मेट में बदलने का एक तरीका है।" },
    { question: "Is this secure?", questionHi: "क्या यह सुरक्षित है?", answer: "Base64 is encoding, not encryption. It does not secure your data.", answerHi: "Base64 एन्कोडिंग है, एन्क्रिप्शन नहीं। यह आपके डेटा को सुरक्षित नहीं करता है।" },
];

export default function Base64Page() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [text, setText] = useState("");
    const [base64, setBase64] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);
        try {
            // Encode: String to Base64
            // Using encodeURIComponent to handle unicode characters properly
            const encoded = btoa(unescape(encodeURIComponent(value)));
            setBase64(encoded);
            setError(null);
        } catch (err) {
            console.error("Encode error", err);
            setBase64("");
            setError(isHi ? "एन्कोड करने में त्रुटि" : "Error encoding text");
        }
    };

    const handleBase64Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setBase64(value);
        try {
            // Decode: Base64 to String
            const decoded = decodeURIComponent(escape(atob(value)));
            setText(decoded);
            setError(null);
        } catch (err) {
            // It's normal to have errors while typing incomplete base64
            setError(isHi ? "अमान्य बेस64 स्ट्रिंग" : "Invalid Base64 string");
        }
    };

    const copyToClipboard = (content: string) => {
        if (content) {
            navigator.clipboard.writeText(content);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔄 Base64 एन्कोडर / डिकोडर" : "🔄 Base64 Encoder / Decoder"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "टेक्स्ट को बेस64 में बदलें और वापस टेक्स्ट में लाएँ" : "Encode text to Base64 or decode Base64 back to text"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Text Input */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-slate-300">
                                {isHi ? "प्लेन टेक्स्ट (Plain Text)" : "Plain Text"}
                            </label>
                            <button onClick={() => copyToClipboard(text)} className="text-xs btn-secondary px-2 py-1">
                                {isHi ? "कॉपी" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            placeholder={isHi ? "यहाँ टेक्स्ट टाइप करें..." : "Type plain text here..."}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[250px] resize-y"
                        />
                    </div>

                    {/* Base64 Input */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="font-semibold text-slate-300">
                                {isHi ? "बेस64 स्ट्रिंग (Base64)" : "Base64 String"}
                            </label>
                            <button onClick={() => copyToClipboard(base64)} className="text-xs btn-secondary px-2 py-1">
                                {isHi ? "कॉपी" : "Copy"}
                            </button>
                        </div>
                        <textarea
                            value={base64}
                            onChange={handleBase64Change}
                            placeholder={isHi ? "यहाँ बेस64 टाइप या पेस्ट करें..." : "Type or paste Base64 here..."}
                            className={`w-full bg-slate-900/50 border ${error && base64.length > 0 ? "border-red-500/50 focus:border-red-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none min-h-[250px] resize-y font-mono text-sm`}
                        />
                        {error && base64.length > 0 && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                        )}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/base64" tools={ALL_TOOLS} />
        </div>
    );
}
