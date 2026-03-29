"use client";

import { useLocale } from "next-intl";
import { useState, useMemo } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Is my password sent to a server?", questionHi: "क्या मेरा पासवर्ड सर्वर पर भेजा जाता है?", answer: "No. This tool runs 100% locally in your browser. Your typed password never leaves your device.", answerHi: "नहीं। यह टूल 100% आपके ब्राउज़र में काम करता है। आपका टाइप किया गया पासवर्ड आपके डिवाइस से बाहर नहीं जाता।" },
];

export default function PasswordStrengthPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const evaluation = useMemo(() => {
        let score = 0;
        const tips: string[] = [];

        if (!password) return { score: 0, text: isHi ? "कोई पासवर्ड नहीं" : "Empty", tips: [], color: "bg-slate-700" };

        const len = password.length;
        if (len > 8) score += 1;
        if (len > 12) score += 1;
        if (len < 8) tips.push(isHi ? "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।" : "Make it at least 8 characters long.");

        if (/[A-Z]/.test(password)) score += 1;
        else tips.push(isHi ? "बड़े अक्षर (A-Z) जोड़ें।" : "Add uppercase letters (A-Z).");

        if (/[a-z]/.test(password)) score += 1;
        else tips.push(isHi ? "छोटे अक्षर (a-z) जोड़ें।" : "Add lowercase letters (a-z).");

        if (/[0-9]/.test(password)) score += 1;
        else tips.push(isHi ? "संख्याएं (0-9) जोड़ें।" : "Add numbers (0-9).");

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else tips.push(isHi ? "प्रतीक (!@#$%) जोड़ें।" : "Add special symbols (!@#$%).");

        // Max possible score based on plain logic is 6. Map to 1-4.
        const normalizedScore = Math.min(4, Math.max(1, Math.ceil(score / 1.5)));
        
        const labels = isHi 
            ? ["कमज़ोर", "ठीक ठाक", "मज़बूत", "बेहतरीन"]
            : ["Weak", "Fair", "Strong", "Excellent"];
            
        const colors = ["bg-red-500", "bg-yellow-500", "bg-emerald-500", "bg-cyan-500"];

        return {
            score: normalizedScore,
            text: labels[normalizedScore - 1],
            tips,
            color: colors[normalizedScore - 1]
        };
    }, [password, isHi]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔐 पासवर्ड स्ट्रेंथ चेकर" : "🔐 Password Strength Checker"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "ऑफ़लाइन विश्लेषण के साथ अपने पासवर्ड की सुरक्षा जांचें" : "Test the security of your password safely offline"}
                </p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={isHi ? "अपना पासवर्ड टाइप करें..." : "Type your password to test..."}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-4 pr-12 text-lg text-slate-200 focus:outline-none"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xl"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-400">{isHi ? "मज़बूती:" : "Strength:"}</span>
                        <span className={`px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 border ${evaluation.score >= 3 ? 'text-emerald-400 border-emerald-500/30' : evaluation.score === 2 ? 'text-yellow-400 border-yellow-500/30' : 'text-red-400 border-red-500/30'}`}>
                            {evaluation.text}
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((step) => (
                            <div 
                                key={step} 
                                className={`h-full flex-1 transition-colors duration-300 ${password.length > 0 && evaluation.score >= step ? evaluation.color : 'bg-transparent'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {evaluation.tips.length > 0 && password.length > 0 && (
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
                        <h4 className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
                            {isHi ? "सुधार के लिए सुझाव:" : "Suggestions for improvement:"}
                        </h4>
                        <ul className="text-slate-400 space-y-1 text-sm list-disc list-inside">
                            {evaluation.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/password-strength" tools={ALL_TOOLS} />
        </div>
    );
}
