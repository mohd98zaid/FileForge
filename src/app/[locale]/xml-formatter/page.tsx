"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "How does this format XML?", questionHi: "यह XML को कैसे फ़ॉर्मेट करता है?", answer: "It uses the browser's built-in DOMParser to parse the XML, then reserializes it with proper indentation.", answerHi: "यह XML को पार्स करने के लिए ब्राउज़र के अंतर्निहित DOMParser का उपयोग करता है, और फिर उचित इंडेंटेशन के साथ इसे फिर से सीरियलाइज़ करता है।" },
];

export default function XmlFormatterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const formatXml = (xml: string) => {
        let formatted = '';
        let pad = 0;
        const indentString = '  '; // 2 spaces
        
        // Remove existing newlines and extra spaces inside tags, but not text nodes completely randomly
        // A minimal clean
        xml = xml.replace(/(>)\s*(<)/g, "$1\n$2");
        xml = xml.replace(/</g, "~::~<");
        
        const padStr = (count: number) => Array(count + 1).join(indentString);

        const lines = xml.split('~::~').filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            let indent = 0;
            if (line.match(/.+<\/\w[^>]*>$/)) {
                // Node with text and closing tag
                indent = 0;
            } else if (line.match(/^<\/\w/)) {
                // Closing tag
                if (pad !== 0) {
                    pad -= 1;
                }
            } else if (line.match(/^<\w[^>]*[^/]>.*$/)) {
                // Opening tag
                indent = 1;
            } else {
                 // Empty tag or text
                 indent = 0;
            }

            formatted += padStr(pad) + line + '\n';
            pad += indent;
        }

        return formatted;
    };

    const handleFormat = () => {
        if (!input.trim()) {
            setOutput("");
            setError(isHi ? "कृपया कुछ XML इनपुट दें।" : "Please provide some XML input.");
            return;
        }

        try {
            // Basic validation using DOMParser
            const parser = new DOMParser();
            const dom = parser.parseFromString(input, "text/xml");
            
            const parseError = dom.querySelector("parsererror");
            if (parseError) {
                setError(isHi ? "अमान्य XML: सिंटैक्स त्रुटि" : "Invalid XML: Syntax Error detected.");
                setOutput("");
                return;
            }

            const formatted = formatXml(input);
            setOutput(formatted.trim());
            setError(null);
        } catch (e: any) {
             setError(isHi ? `अमान्य XML: ${e.message}` : `Invalid XML: ${e.message}`);
             setOutput("");
        }
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📑 XML फ़ॉर्मेटर" : "📑 XML Formatter"}</h1>
                <p className="mt-2 text-slate-400">
                    {isHi ? "XML पेलोड को सुंदर और पढ़ने लायक बनाएँ" : "Prettify and format ugly XML payloads"}
                </p>
            </div>

            <div className="glass-card max-w-6xl mx-auto space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                         <label className="font-semibold text-slate-300 text-sm uppercase tracking-wider block">
                             {isHi ? "इनपुट XML" : "Input XML"}
                         </label>
                         <textarea
                             value={input}
                             onChange={(e) => setInput(e.target.value)}
                             placeholder="<note><to>User</to><from>Dev</from><body>Hello World</body></note>"
                             className={`w-full h-[400px] bg-slate-900 border ${error ? 'border-red-500 rounded-b-none' : 'border-slate-700/50 rounded-xl'} p-4 text-slate-300 font-mono text-sm focus:outline-none`}
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
                                  {isHi ? "फ़ॉर्मेटेड XML" : "Formatted XML"}
                             </label>
                             <button 
                                 onClick={copyToClipboard}
                                 disabled={!output}
                                 className="text-indigo-400 hover:text-indigo-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                             >
                                 {isHi ? "कॉपी करें" : "Copy output"}
                             </button>
                        </div>
                        <div className="relative flex-1">
                              <textarea
                                 value={output}
                                 readOnly
                                 className="w-full h-full min-h-[400px] bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none resize-none whitespace-pre"
                                 spellCheck="false"
                             />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <button
                        onClick={handleFormat}
                        className="btn-primary w-full max-w-md py-3 text-lg"
                    >
                        {isHi ? "फ़ॉर्मेट करें" : "Format XML"}
                    </button>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/xml-formatter" tools={ALL_TOOLS} />
        </div>
    );
}
