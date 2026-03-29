"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What algorithms are supported?", questionHi: "कौन से एल्गोरिदम समर्थित हैं?", answer: "HS256 (HMAC-SHA256), HS384 (HMAC-SHA384), and HS512 (HMAC-SHA512). All use the Web Crypto API for signing.", answerHi: "HS256 (HMAC-SHA256), HS384 (HMAC-SHA384) और HS512 (HMAC-SHA512)। सभी साइनिंग के लिए Web Crypto API का उपयोग करते हैं।" },
    { question: "Is my secret key safe?", questionHi: "क्या मेरी सीक्रेट की सुरक्षित है?", answer: "Yes. Everything runs locally in your browser. The secret key and generated token never leave your device.", answerHi: "हाँ। सब कुछ आपके ब्राउज़र में स्थानीय रूप से चलता है। सीक्रेट की और जनरेट किया गया टोकन कभी आपके डिवाइस से बाहर नहीं जाता।" },
    { question: "Can I use this for production?", questionHi: "क्या मैं इसे प्रोडक्शन के लिए उपयोग कर सकता हूँ?", answer: "This tool is great for development and testing. For production, use a server-side JWT library with proper key management.", answerHi: "यह टूल डेवलपमेंट और टेस्टिंग के लिए बहुत अच्छा है। प्रोडक्शन के लिए सर्वर-साइड JWT लाइब्रेरी और सही की प्रबंधन का उपयोग करें।" },
];

function base64UrlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signHMAC(algorithm: string, secret: string, data: string): Promise<string> {
    const algoMap: Record<string, string> = {
        HS256: "SHA-256",
        HS384: "SHA-384",
        HS512: "SHA-512",
    };
    const hash = algoMap[algorithm] || "SHA-256";

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    const bytes = new Uint8Array(signature);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return base64UrlEncode(binary);
}

export default function JwtGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [headerStr, setHeaderStr] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    const [payloadStr, setPayloadStr] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
    const [secret, setSecret] = useState("your-256-bit-secret");
    const [algorithm, setAlgorithm] = useState("HS256");
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const encodedHeader = headerStr.trim() ? base64UrlEncode(headerStr) : "";
    const encodedPayload = payloadStr.trim() ? base64UrlEncode(payloadStr) : "";

    const handleGenerate = async () => {
        setError(null);
        setToken("");

        try {
            JSON.parse(headerStr);
        } catch {
            setError(isHi ? "अमान्य JSON हेडर।" : "Invalid JSON in header.");
            return;
        }

        try {
            JSON.parse(payloadStr);
        } catch {
            setError(isHi ? "अमान्य JSON पेलोड।" : "Invalid JSON in payload.");
            return;
        }

        if (!secret.trim()) {
            setError(isHi ? "कृपया सीक्रेट की दें।" : "Please provide a secret key.");
            return;
        }

        try {
            const headerB64 = base64UrlEncode(headerStr);
            const payloadB64 = base64UrlEncode(payloadStr);
            const signingInput = `${headerB64}.${payloadB64}`;
            const signature = await signHMAC(algorithm, secret, signingInput);
            setToken(`${signingInput}.${signature}`);
        } catch (e: any) {
            setError(isHi ? `टोकन जनरेट करने में त्रुटि: ${e.message}` : `Error generating token: ${e.message}`);
        }
    };

    const copyToClipboard = () => {
        if (!token) return;
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔐 JWT जनरेटर" : "🔐 JWT Generator"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "JSON वेब टोकन जनरेट करें — पूरी तरह ब्राउज़र में" : "Generate JSON Web Tokens entirely in your browser"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="flex flex-wrap gap-4 items-center border-b border-slate-700/50 pb-4">
                    <label className="text-slate-400 text-sm font-medium">{isHi ? "एल्गोरिदम:" : "Algorithm:"}</label>
                    <select
                        value={algorithm}
                        onChange={(e) => {
                            setAlgorithm(e.target.value);
                            try {
                                const h = JSON.parse(headerStr);
                                h.alg = e.target.value;
                                setHeaderStr(JSON.stringify(h, null, 2));
                            } catch { }
                        }}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="HS256">HS256</option>
                        <option value="HS384">HS384</option>
                        <option value="HS512">HS512</option>
                    </select>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block text-red-400">
                            {isHi ? "हेडर (JSON)" : "Header (JSON)"}
                        </label>
                        <textarea
                            value={headerStr}
                            onChange={(e) => setHeaderStr(e.target.value)}
                            className="w-full h-[160px] bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-red-300 font-mono text-sm focus:outline-none focus:border-indigo-500"
                            spellCheck="false"
                        />
                        <div className="text-xs text-slate-500 font-mono break-all bg-slate-950/50 rounded-lg p-2">
                            {isHi ? "बेस64URL: " : "Base64URL: "}
                            <span className="text-red-400/70">{encodedHeader || "..."}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block text-fuchsia-400">
                            {isHi ? "पेलोड (JSON)" : "Payload (JSON)"}
                        </label>
                        <textarea
                            value={payloadStr}
                            onChange={(e) => setPayloadStr(e.target.value)}
                            className="w-full h-[160px] bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-fuchsia-300 font-mono text-sm focus:outline-none focus:border-indigo-500"
                            spellCheck="false"
                        />
                        <div className="text-xs text-slate-500 font-mono break-all bg-slate-950/50 rounded-lg p-2">
                            {isHi ? "बेस64URL: " : "Base64URL: "}
                            <span className="text-fuchsia-400/70">{encodedPayload || "..."}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block text-cyan-400">
                        {isHi ? "सीक्रेट की" : "Secret Key"}
                    </label>
                    <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-cyan-300 font-mono text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="your-256-bit-secret"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl font-mono break-all">
                        {error}
                    </div>
                )}

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleGenerate}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "टोकन जनरेट करें" : "Generate Token"}
                    </button>
                </div>

                {token && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block text-emerald-400">
                                {isHi ? "जनरेट किया गया JWT टोकन" : "Generated JWT Token"}
                            </label>
                            <button
                                onClick={copyToClipboard}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी करें" : "Copy")}
                            </button>
                        </div>
                        <div className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 font-mono text-sm break-all">
                            <span className="text-red-400">{token.split(".")[0]}</span>
                            <span className="text-slate-500">.</span>
                            <span className="text-fuchsia-400">{token.split(".")[1]}</span>
                            <span className="text-slate-500">.</span>
                            <span className="text-cyan-400">{token.split(".")[2]}</span>
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/jwt-generator" tools={ALL_TOOLS} />
        </div>
    );
}
