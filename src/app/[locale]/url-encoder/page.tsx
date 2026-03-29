"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is URL Encoding?", questionHi: "URL एन्कोडिंग क्या है?", answer: "URL encoding converts characters into a format that can be safely transmitted over the Internet.", answerHi: "URL एन्कोडिंग अक्षरों को ऐसे प्रारूप में बदल देता है जिसे इंटरनेट के माध्यम से सुरक्षित रूप से ट्रांसमिट किया जा सकता है।" },
    { question: "Why do I see %20?", questionHi: "मुझे %20 क्यों दिखाई देता है?", answer: "Spaces are replaced by %20 or + in URLs because raw spaces are not allowed.", answerHi: "URL में स्पेस की अनुमति नहीं है, इसलिए उनके स्थान पर %20 या + का उपयोग होता है।" },
];

export default function UrlEncoderPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [decoded, setDecoded] = useState("");
    const [encoded, setEncoded] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleDecodedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDecoded(val);
        try {
            setEncoded(encodeURIComponent(val));
            setError(null);
        } catch (err) {
            setError(isHi ? "एन्कोड करने में त्रुटि" : "Error encoding URL");
        }
    };

    const handleEncodedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setEncoded(val);
        try {
            setDecoded(decodeURIComponent(val));
            setError(null);
        } catch (err) {
            setError(isHi ? "अमान्य URL एन्कोडेड स्ट्रिंग" : "Invalid URL encoded string");
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
                <h1 className="section-title">{isHi ? "🔗 URL एन्कोडर / डिकोडर" : "🔗 URL Encoder / Decoder"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "URL पैरामीटर को सुरक्षित रूप से एन्कोड या डिकोड करें" : "Quickly encode or decode URL components and parameters"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Decoded Input */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "डिकोड किया गया (Plain Text)" : "Decoded (Plain Text)"}
                        </label>
                        <button onClick={() => copyToClipboard(decoded)} className="text-xs btn-secondary px-2 py-1">
                            {isHi ? "कॉपी" : "Copy"}
                        </button>
                    </div>
                    <textarea
                        value={decoded}
                        onChange={handleDecodedChange}
                        placeholder={isHi ? "साधारण टेक्स्ट यहाँ टाइप करें..." : "Type plain text here to encode..."}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[250px] resize-y"
                    />
                </div>

                {/* Encoded Input */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-slate-300">
                            {isHi ? "एन्कोड किया गया (URL Encoded)" : "Encoded (URL Ready)"}
                        </label>
                        <button onClick={() => copyToClipboard(encoded)} className="text-xs btn-secondary px-2 py-1">
                            {isHi ? "कॉपी" : "Copy"}
                        </button>
                    </div>
                    <textarea
                        value={encoded}
                        onChange={handleEncodedChange}
                        placeholder={isHi ? "एन्कोड किया गया URL यहाँ टाइप करें..." : "Type URL encoded string here to decode..."}
                        className={`w-full bg-slate-900/50 border ${error && encoded.length > 0 ? "border-red-500/50 focus:border-red-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none min-h-[250px] resize-y font-mono text-sm`}
                    />
                    {error && encoded.length > 0 && (
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                    )}
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/url-encoder" tools={ALL_TOOLS} />
        </div>
    );
}
