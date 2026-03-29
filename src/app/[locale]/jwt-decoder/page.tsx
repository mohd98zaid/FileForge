"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Are my JWT tokens secure here?", questionHi: "क्या मेरे JWT टोकन यहाँ सुरक्षित हैं?", answer: "Yes, this tool decodes your token entirely in your browser using JavaScript. No data is sent to external servers.", answerHi: "हाँ, यह टूल आपके टोकन को पूरी तरह से जावास्क्रिप्ट का उपयोग करके ब्राउज़र में डिकोड करता है। बाहरी सर्वर पर कोई डेटा नहीं भेजा जाता है।" },
    { question: "Why doesn't it verify the signature?", questionHi: "यह हस्ताक्षर (Signature) की पुष्टि क्यों नहीं करता?", answer: "Verifying the signature requires the secret key, which should never be exposed to the client-side. This tool is purely for inspecting the public Base64 payload.", answerHi: "हस्ताक्षर की पुष्टि करने के लिए Secret Key की आवश्यकता होती है, जिसे क्लाइंट-साइड पर कभी नहीं रखा जाना चाहिए। यह टूल केवल सार्वजनिक Base64 पेलोड का निरीक्षण करने के लिए है।" },
];

export default function JwtDecoderPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [token, setToken] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [signature, setSignature] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.trim();
        setToken(val);

        if (!val) {
            setHeader("");
            setPayload("");
            setSignature("");
            setError(null);
            return;
        }

        const parts = val.split(".");
        if (parts.length !== 3) {
            setError(isHi ? "अमान्य JWT प्रारूप। 3 भाग होने चाहिए।" : "Invalid JWT format. Must contain 3 parts separated by dots.");
            setHeader("");
            setPayload("");
            setSignature(parts[2] || "");
            return;
        }

        try {
            // Decode Base64Url
            const decodeBase64Url = (str: string) => {
                let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
                while (base64.length % 4) {
                    base64 += "=";
                }
                return decodeURIComponent(escape(atob(base64)));
            };

            const headerDecoded = JSON.parse(decodeBase64Url(parts[0]));
            const payloadDecoded = JSON.parse(decodeBase64Url(parts[1]));

            setHeader(JSON.stringify(headerDecoded, null, 2));
            setPayload(JSON.stringify(payloadDecoded, null, 2));
            setSignature(parts[2]);
            setError(null);
        } catch (err) {
            setError(isHi ? "टोकन भागों को डिकोड करने में विफल।" : "Failed to decode token parts. Invalid Base64 or JSON.");
            setHeader("");
            setPayload("");
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🛡️ JWT डिकोडर" : "🛡️ JWT Decoder"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "JSON वेब टोकन को सुरक्षित और स्थानीय रूप से डिकोड करें" : "Decode JSON Web Tokens safely and locally in your browser"}
                </p>
            </div>

            <div className="glass-card max-w-5xl mx-auto space-y-8">
                <div>
                    <label className="font-semibold text-slate-300 block mb-2">
                        {isHi ? "टोकन यहाँ पेस्ट करें (Encoded)" : "Paste Token Here (Encoded)"}
                    </label>
                    <textarea
                        value={token}
                        onChange={handleTokenChange}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                        className={`w-full bg-slate-900 border ${error ? "border-red-500 focus:border-red-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl p-4 text-indigo-300 placeholder-slate-600 focus:outline-none min-h-[120px] font-mono whitespace-pre-wrap break-all`}
                    />
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider text-red-400 block border-b border-red-500/30 pb-1">
                            {isHi ? "हेडर (Algorithm & Token Type)" : "Header (Algorithm & Token Type)"}
                        </label>
                        <pre className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-red-300 font-mono text-sm min-h-[120px] overflow-auto">
                            {header || "{}"}
                        </pre>
                    </div>

                    {/* Payload */}
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider text-fuchsia-400 block border-b border-fuchsia-500/30 pb-1">
                            {isHi ? "पेलोड (Data / Claims)" : "Payload (Data & Claims)"}
                        </label>
                        <pre className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-fuchsia-300 font-mono text-sm min-h-[200px] overflow-auto">
                            {payload || "{}"}
                        </pre>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider text-cyan-400 block border-b border-cyan-500/30 pb-1">
                        {isHi ? "हस्ताक्षर (Signature)" : "Signature"}
                    </label>
                    <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-cyan-300 font-mono text-sm min-h-[60px] break-all">
                        {signature || "..."}
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/jwt-decoder" tools={ALL_TOOLS} />
        </div>
    );
}
