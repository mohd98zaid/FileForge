"use client";

import { useLocale } from "next-intl";
import { useState, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What are Unix file permissions?", questionHi: "Unix फ़ाइल परमिशन क्या हैं?", answer: "Unix permissions control who can read, write, or execute a file. Each file has permissions for the owner, group, and others.", answerHi: "Unix परमिशन नियंत्रित करती हैं कि कोई फ़ाइल कौन पढ़, लिख या चला सकता है। प्रत्येक फ़ाइल में मालिक, समूह और अन्य के लिए परमिशन होती हैं।" },
    { question: "What does 755 mean?", questionHi: "755 का क्या मतलब है?", answer: "755 means: owner can read+write+execute (7), group can read+execute (5), others can read+execute (5).", answerHi: "755 का मतलब: मालिक पढ़+लिख+चला सकता है (7), समूह पढ़+चला सकता है (5), अन्य पढ़+चला सकते हैं (5)।" },
    { question: "What does the leading 'd' mean?", questionHi: "शुरुआती 'd' का क्या मतलब है?", answer: "The 'd' indicates a directory. Regular files show '-'. Other types include 'l' (symlink), 'c' (character device), 'b' (block device).", answerHi: "'d' डायरेक्टरी दर्शाता है। नियमित फ़ाइलें '-' दिखाती हैं। अन्य प्रकार: 'l' (सिमलिंक), 'c' (कैरेक्टर डिवाइस), 'b' (ब्लॉक डिवाइस)।" },
];

interface PermBits {
    ownerR: boolean;
    ownerW: boolean;
    ownerX: boolean;
    groupR: boolean;
    groupW: boolean;
    groupX: boolean;
    otherR: boolean;
    otherW: boolean;
    otherX: boolean;
}

const DEFAULT_BITS: PermBits = {
    ownerR: true, ownerW: true, ownerX: true,
    groupR: true, groupW: false, groupX: true,
    otherR: true, otherW: false, otherX: true,
};

function bitsToOctal(bits: PermBits): number {
    const owner = (bits.ownerR ? 4 : 0) + (bits.ownerW ? 2 : 0) + (bits.ownerX ? 1 : 0);
    const group = (bits.groupR ? 4 : 0) + (bits.groupW ? 2 : 0) + (bits.groupX ? 1 : 0);
    const other = (bits.otherR ? 4 : 0) + (bits.otherW ? 2 : 0) + (bits.otherX ? 1 : 0);
    return owner * 100 + group * 10 + other;
}

function octalToBits(octal: number): PermBits {
    const owner = Math.floor(octal / 100) % 10;
    const group = Math.floor(octal / 10) % 10;
    const other = octal % 10;
    return {
        ownerR: !!(owner & 4), ownerW: !!(owner & 2), ownerX: !!(owner & 1),
        groupR: !!(group & 4), groupW: !!(group & 2), groupX: !!(group & 1),
        otherR: !!(other & 4), otherW: !!(other & 2), otherX: !!(other & 1),
    };
}

function bitsToSymbolic(bits: PermBits): string {
    const sym = (r: boolean, w: boolean, x: boolean) =>
        `${r ? "r" : "-"}${w ? "w" : "-"}${x ? "x" : "-"}`;
    return `-${sym(bits.ownerR, bits.ownerW, bits.ownerX)}${sym(bits.groupR, bits.groupW, bits.groupX)}${sym(bits.otherR, bits.otherW, bits.otherX)}`;
}

function bitsToBinary(bits: PermBits): string {
    const triad = (r: boolean, w: boolean, x: boolean) =>
        `${r ? 1 : 0}${w ? 1 : 0}${x ? 1 : 0}`;
    return `${triad(bits.ownerR, bits.ownerW, bits.ownerX)} ${triad(bits.groupR, bits.groupW, bits.groupX)} ${triad(bits.otherR, bits.otherW, bits.otherX)}`;
}

const PRESETS = [
    { value: 644, label: "644", desc: "Owner rw, group/others read" },
    { value: 755, label: "755", desc: "Owner rwx, group/others r-x" },
    { value: 777, label: "777", desc: "Everyone full access" },
    { value: 600, label: "600", desc: "Owner read-write only" },
    { value: 700, label: "700", desc: "Owner full access only" },
    { value: 444, label: "444", desc: "Everyone read only" },
];

export default function UnixPermissionsPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [bits, setBits] = useState<PermBits>(DEFAULT_BITS);
    const [octalStr, setOctalStr] = useState<string>(String(bitsToOctal(DEFAULT_BITS)));

    const handleCheckbox = useCallback((key: keyof PermBits) => {
        setBits((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            setOctalStr(String(bitsToOctal(next)));
            return next;
        });
    }, []);

    const handleOctalChange = useCallback((val: string) => {
        const cleaned = val.replace(/[^0-7]/g, "").slice(0, 3);
        setOctalStr(cleaned);
        if (cleaned.length === 3) {
            setBits(octalToBits(parseInt(cleaned, 8)));
        }
    }, []);

    const applyPreset = useCallback((octal: number) => {
        const str = String(octal).padStart(3, "0");
        setOctalStr(str);
        setBits(octalToBits(octal));
    }, []);

    const octal = bitsToOctal(bits);
    const symbolic = bitsToSymbolic(bits);
    const binary = bitsToBinary(bits);

    const checkboxGroup = (label: string, keys: [keyof PermBits, keyof PermBits, keyof PermBits]) => (
        <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">{label}</span>
            <div className="flex gap-4">
                {(["r", "w", "x"] as const).map((perm, i) => {
                    const key = keys[i];
                    return (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={bits[key]}
                                onChange={() => handleCheckbox(key)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className={`text-sm font-mono font-bold ${bits[key] ? "text-indigo-400" : "text-slate-500"}`}>
                                {perm}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🔐 Unix परमिशन कैलकुलेटर" : "🔐 Unix Permissions Calculator"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "फ़ाइल परमिशन को ऑक्टल, सिम्बोलिक और बाइनरी रूप में समझें" : "Understand file permissions in octal, symbolic, and binary form"}
                </p>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-8">
                {/* Octal Input */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                    <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium text-slate-300">
                            {isHi ? "ऑक्टल नंबर (000-777)" : "Octal Number (000-777)"}
                        </label>
                        <input
                            type="text"
                            value={octalStr}
                            onChange={(e) => handleOctalChange(e.target.value)}
                            placeholder="755"
                            maxLength={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-2xl font-mono text-center text-slate-200 tracking-widest focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            {isHi ? "प्रीसेट:" : "Presets:"}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => applyPreset(p.value)}
                                    title={p.desc}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors ${
                                        octal === p.value
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    {checkboxGroup(isHi ? "मालिक (Owner)" : "Owner", ["ownerR", "ownerW", "ownerX"])}
                    {checkboxGroup(isHi ? "समूह (Group)" : "Group", ["groupR", "groupW", "groupX"])}
                    {checkboxGroup(isHi ? "अन्य (Other)" : "Other", ["otherR", "otherW", "otherX"])}
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {isHi ? "ऑक्टल" : "Octal"}
                        </span>
                        <p className="text-3xl font-black text-indigo-400 mt-1 font-mono">{octal}</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {isHi ? "सिम्बोलिक" : "Symbolic"}
                        </span>
                        <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">{symbolic}</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {isHi ? "बाइनरी" : "Binary"}
                        </span>
                        <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{binary}</p>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/unix-permissions" tools={ALL_TOOLS} />
        </div>
    );
}
