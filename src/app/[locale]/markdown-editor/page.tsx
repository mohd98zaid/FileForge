"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "What is Markdown?", questionHi: "मार्कडाउन क्या है?", answer: "A simple formatting language used in GitHub, blogs, and documentation.", answerHi: "एक सिंपल फ़ॉर्मेटिंग भाषा जो GitHub, blogs और डॉक्यूमेंटेशन में इस्तेमाल होती है।" },
    { question: "Can I export?", questionHi: "क्या एक्सपोर्ट कर सकते हैं?", answer: "Yes, copy or download your formatted content.", answerHi: "हाँ, फ़ॉर्मेटेड कंटेंट कॉपी या डाउनलोड करें।" },
];

export default function MarkdownEditorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [markdown, setMarkdown] = useState<string>(isHi ? "# नमस्ते मार्कडाउन!\n\nअपना *कंटेंट* यहाँ लिखें।\n\n```javascript\nconsole.log('कोड हाइलाइटिंग भी काम करता है!');\n```" : "# Hello Markdown!\n\nWrite your *content* here.\n\n```javascript\nconsole.log('Code highlighting works too!');\n```");
    const [copied, setCopied] = useState(false);

    const copyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📝 मार्कडाउन एडिटर" : "📝 Markdown Editor"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "लाइव प्रीव्यू मार्कडाउन एडिटर" : "Live preview editor with syntax highlighting"}</p>
            </div>

            <div className="glass-card max-w-7xl mx-auto space-y-4">
                <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                    <span className="text-sm text-slate-400 font-medium ml-2">{isHi ? "एडिटर" : "Editor"}</span>
                    <button
                        onClick={copyMarkdown}
                        className="text-sm px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2"
                    >
                        {copied ? (isHi ? "✅ कॉपी हो गया" : "✅ Copied") : (isHi ? "📋 मार्कडाउन कॉपी करें" : "📋 Copy Markdown")}
                    </button>
                    <span className="text-sm text-slate-400 font-medium mr-2 hidden md:inline">{isHi ? "पूर्वावलोकन" : "Preview"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 h-[70vh] border border-slate-700 rounded-xl overflow-hidden">
                    {/* Editor */}
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="w-full h-full bg-slate-900 text-slate-300 p-6 font-mono text-sm resize-none focus:outline-none placeholder-slate-600 focus:bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-700"
                        placeholder={isHi ? "यहाँ मार्कडाउन टाइप करें..." : "Type markdown here..."}
                    />

                    {/* Preview */}
                    <div className="w-full h-full bg-slate-950 p-6 overflow-auto prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {markdown}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/markdown-editor" tools={ALL_TOOLS} />
        </div>
    );
}
