"use client";

import { Link } from '@/i18n/navigation';
import { useLocale } from "next-intl";
import { ALL_TOOLS, Tool } from "@/lib/tools";

function ToolCard({ tool, isHi }: { tool: Tool; isHi: boolean }) {
    return (
        <Link href={tool.href as any} className="glass-card p-5 group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl bg-slate-800/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-xs font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">{tool.category.toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors mb-1">
                {isHi ? tool.nameHi : tool.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? tool.descriptionHi : tool.description}
            </p>
        </Link>
    );
}

export default function DevelopersPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const get = (hrefs: string[]) => ALL_TOOLS.filter(t => hrefs.includes(t.href));

    const devTools = ["/json-formatter", "/json-validator", "/sql-formatter", "/yaml-to-json", "/json-csv", "/csv-to-json", "/xml-formatter", "/xml-to-json"];
    const encodingTools = ["/base64", "/url-encoder", "/hash-generator", "/uuid-generator", "/bcrypt-generator", "/jwt-decoder", "/jwt-generator"];
    const regexTools = ["/regex-tester", "/regex-find-replace", "/cron-builder", "/timestamp-converter", "/unix-permissions", "/code-beautifier", "/html-entity"];
    const gitTools = ["/diff-checker", "/markdown-editor", "/qr-generator", "/qr-decoder", "/barcode-generator", "/file-hash-compare", "/mongo-objectid"];

    const sections = [
        { icon: "📊", label: isHi ? "JSON & डेटा कन्वर्टर" : "JSON & Data Converters", tools: get(devTools) },
        { icon: "🔐", label: isHi ? "एन्कोडिंग & हैशिंग" : "Encoding & Hashing", tools: get(encodingTools) },
        { icon: "🧪", label: isHi ? "रेगेक्स & डेवलपर टूल्स" : "Regex & Dev Tools", tools: get(regexTools) },
        { icon: "🔧", label: isHi ? "यूटिलिटीज़ & जनरेटर" : "Utilities & Generators", tools: get(gitTools) },
    ];

    return (
        <div className="animate-fade-in space-y-16">
            <div className="text-center space-y-4 pt-10">
                <div className="inline-block p-4 rounded-full bg-emerald-500/10 mb-4 animate-bounce-slow">
                    <span className="text-5xl">👨‍💻</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent leading-normal py-2">
                    {isHi ? "डेवलपर्स के लिए" : "For Developers"}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                    {isHi ? "JSON, SQL, रेगेक्स, एन्कोडिंग और बहुत कुछ — बिना साइन-अप के" : "JSON, SQL, regex, encoding and more — no sign-up required"}
                </p>
            </div>

            {sections.map(s => (
                <section key={s.label}>
                    <h2 className="section-title mb-8 flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span> {s.label}
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {s.tools.map(tool => <ToolCard key={tool.href} tool={tool} isHi={isHi} />)}
                    </div>
                </section>
            ))}

            <div className="glass-card p-10 text-center space-y-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                <h3 className="text-2xl font-bold text-white">{isHi ? "अधिक टूल्स चाहिए?" : "Need more tools?"}</h3>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="btn-secondary">{isHi ? "सभी टूल्स देखें" : "Browse All Tools"}</Link>
                    <a href="https://github.com/mohd98zaid/FileForge" target="_blank" className="btn-primary">GitHub</a>
                </div>
            </div>
        </div>
    );
}
