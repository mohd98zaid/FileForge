"use client";

import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import { ALL_TOOLS, Tool } from "@/lib/tools";

function ToolCard({ tool, isHi }: { tool: Tool; isHi: boolean }) {
    return (
        <Link href={tool.href as any} className="glass-card p-5 group hover:border-pink-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl bg-slate-800/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-xs font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">{tool.category.toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors mb-1">
                {isHi ? tool.nameHi : tool.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? tool.descriptionHi : tool.description}
            </p>
        </Link>
    );
}

export default function StudentsPage() {
    const t = useTranslations("Personas.students");
    const locale = useLocale();
    const isHi = locale === "hi";

    // 3 sections × 6 tools each = 18 tools
    const examTools = ["/exam-photo", "/passport-photo-maker", "/resize-image", "/compress-image", "/image-to-pdf", "/compress-pdf"];
    const docTools = ["/pdf-merge", "/pdf-split", "/pdf-to-word", "/edit-pdf", "/image-to-text", "/translate-pdf"];
    const utilTools = ["/unit-converter", "/currency-converter", "/qr-generator", "/password-generator", "/diff-checker", "/lorem-ipsum"];

    const get = (hrefs: string[]) => ALL_TOOLS.filter(t => hrefs.includes(t.href));

    const sections = [
        { icon: "📝", label: t('examPrep'), tools: get(examTools) },
        { icon: "📚", label: t('assignments'), tools: get(docTools) },
        { icon: "🧮", label: t('utilities'), tools: get(utilTools) },
    ];

    return (
        <div className="animate-fade-in space-y-16">
            {/* Hero */}
            <div className="text-center space-y-4 pt-10">
                <div className="inline-block p-4 rounded-full bg-pink-500/10 mb-4 animate-bounce-slow">
                    <span className="text-5xl">🎓</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent leading-normal py-2">
                    {t('title')}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            {/* Sections — all identical structure */}
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

            {/* CTA */}
            <div className="glass-card p-10 text-center space-y-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                <h3 className="text-2xl font-bold text-white">{isHi ? "कोई टूल गायब है?" : "Missing a tool?"}</h3>
                <p className="text-slate-400">{isHi ? "हम ओपन सोर्स हैं! GitHub पर फ़ीचर की मांग करें।" : "We are open source! Request a feature on GitHub."}</p>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="btn-secondary">{isHi ? "सभी टूल्स देखें" : "Browse All Tools"}</Link>
                    <a href="https://github.com/mohd98zaid/FileForge" target="_blank" className="btn-primary">GitHub</a>
                </div>
            </div>
        </div>
    );
}
