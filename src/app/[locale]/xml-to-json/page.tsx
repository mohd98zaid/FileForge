"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What XML features are supported?", questionHi: "कौन सी XML सुविधाएँ समर्थित हैं?", answer: "The parser handles elements, attributes (prefixed with @), text content (#text), nested elements, and repeated child elements (converted to arrays).", answerHi: "पार्सर एलिमेंट्स, एट्रिब्यूट्स (@ उपसर्ग), टेक्स्ट कंटेंट (#text), नेस्टेड एलिमेंट्स और दोहराए गए चाइल्ड एलिमेंट्स (एरे में) को हैंडल करता है।" },
    { question: "Is my data private?", questionHi: "क्या मेरा डेटा निजी है?", answer: "Yes. Conversion happens entirely in your browser using the built-in DOMParser. No data is sent anywhere.", answerHi: "हाँ। कन्वर्जन पूरी तरह आपके ब्राउज़र में DOMParser का उपयोग करके होता है। कोई डेटा कहीं नहीं भेजा जाता।" },
    { question: "How are attributes represented?", questionHi: "एट्रिब्यूट्स कैसे दर्शाए जाते हैं?", answer: "XML attributes are prefixed with @ in the JSON output. For example, <item id=\"1\"> becomes { \"@id\": \"1\" }.", answerHi: "XML एट्रिब्यूट्स JSON आउटपुट में @ से शुरू होते हैं। उदाहरण: <item id=\"1\"> बनता है { \"@id\": \"1\" }।" },
];

function xmlNodeToObj(node: ChildNode): any {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? text : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as Element;
    const obj: Record<string, any> = {};

    // Attributes
    for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        obj[`@${attr.name}`] = attr.value;
    }

    // Children
    const childElements = Array.from(el.childNodes).filter(
        (c) => c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.textContent?.trim())
    );

    if (childElements.length === 1 && childElements[0].nodeType === Node.TEXT_NODE) {
        const text = childElements[0].textContent?.trim() || "";
        if (Object.keys(obj).length === 0) return text;
        obj["#text"] = text;
        return obj;
    }

    const childMap: Record<string, any[]> = {};

    for (const child of childElements) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) {
                if (obj["#text"]) {
                    obj["#text"] += " " + text;
                } else {
                    obj["#text"] = text;
                }
            }
            continue;
        }

        const childEl = child as Element;
        const name = childEl.tagName;
        const value = xmlNodeToObj(child);

        if (!childMap[name]) childMap[name] = [];
        childMap[name].push(value);
    }

    for (const [key, values] of Object.entries(childMap)) {
        obj[key] = values.length === 1 ? values[0] : values;
    }

    return Object.keys(obj).length === 0 ? "" : obj;
}

function xmlToJson(xmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    const parseError = doc.querySelector("parsererror");
    if (parseError) {
        throw new Error(parseError.textContent || "Invalid XML");
    }

    const root = doc.documentElement;
    const result: Record<string, any> = {};
    result[root.tagName] = xmlNodeToObj(root);

    return JSON.stringify(result, null, 2);
}

export default function XmlToJsonPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        if (!input.trim()) {
            setOutput("");
            setError(isHi ? "कृपया कुछ XML दें।" : "Please provide some XML.");
            return;
        }

        try {
            setOutput(xmlToJson(input));
            setError(null);
        } catch (e: any) {
            setError(isHi ? `अमान्य XML: ${e.message}` : `Invalid XML: ${e.message}`);
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📑 XML से JSON कन्वर्टर" : "📑 XML to JSON Converter"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "XML डेटा को JSON में बदलें" : "Convert XML data into JSON representation"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                            {isHi ? "XML इनपुट" : "XML Input"}
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={'<users>\n  <user id="1">\n    <name>Alice</name>\n    <city>Delhi</city>\n  </user>\n</users>'}
                            className={`w-full h-[400px] bg-slate-900 border ${error ? "border-red-500 rounded-b-none" : "border-slate-700/50 rounded-xl"} p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-indigo-500`}
                            spellCheck="false"
                        />
                        {error && (
                            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-b-xl border-t-0 font-mono break-all">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <div className="flex justify-between items-end">
                            <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                                {isHi ? "JSON आउटपुट" : "JSON Output"}
                            </label>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {copied ? (isHi ? "कॉपी हो गया!" : "Copied!") : (isHi ? "कॉपी करें" : "Copy")}
                            </button>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            className="w-full h-full min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none"
                            spellCheck="false"
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleConvert}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "JSON में बदलें" : "Convert to JSON"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/xml-to-json" tools={ALL_TOOLS} />
        </div>
    );
}
