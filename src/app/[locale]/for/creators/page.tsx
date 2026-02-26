"use client";

import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import { ALL_TOOLS, Tool } from "@/lib/tools";

function ToolCard({ tool, isHi }: { tool: Tool; isHi: boolean }) {
    return (
        <Link href={tool.href as any} className="glass-card p-5 group hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl bg-slate-800/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-xs font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">{tool.category.toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors mb-1">
                {isHi ? tool.nameHi : tool.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? tool.descriptionHi : tool.description}
            </p>
        </Link>
    );
}

export default function CreatorsPage() {
    const t = useTranslations("Personas.creators");
    const locale = useLocale();
    const isHi = locale === "hi";

    // 3 sections × 6 tools each = 18 tools
    const visualTools = ["/resize-image", "/crop-rotate", "/remove-bg", "/gif-maker", "/social-resize", "/color-palette"];
    const brandingTools = ["/watermark-image", "/watermark-pdf", "/qr-generator", "/change-dpi", "/remove-metadata", "/convert-image"];
    const publishTools = ["/html-to-pdf", "/pdf-to-powerpoint", "/word-to-pdf", "/compress-pdf", "/video-to-audio", "/markdown-editor"];

    const get = (hrefs: string[]) => ALL_TOOLS.filter(t => hrefs.includes(t.href));

    const sections = [
        { icon: "🖼️", label: t('visuals'), tools: get(visualTools) },
        { icon: "✨", label: t('branding'), tools: get(brandingTools) },
        { icon: "📤", label: isHi ? "कंटेंट और पब्लिशिंग" : "Content & Publishing", tools: get(publishTools) },
    ];

    return (
        <div className="animate-fade-in space-y-16">
            {/* Hero */}
            <div className="text-center space-y-4 pt-10">
                <div className="inline-block p-4 rounded-full bg-cyan-500/10 mb-4 animate-bounce-slow">
                    <span className="text-5xl">🎨</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent leading-normal py-2">
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
            <div className="glass-card p-10 text-center space-y-6 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-500/20">
                <h3 className="text-2xl font-bold text-white">{isHi ? "किसी खास टूल की तलाश है?" : "Need a specific tool?"}</h3>
                <p className="text-slate-400">{isHi ? "हमें बताएं या खुद बनाएं — हम ओपन सोर्स हैं!" : "Request it or build it yourself — we are open source!"}</p>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="btn-secondary">{isHi ? "सभी टूल्स देखें" : "Browse All Tools"}</Link>
                    <a href="https://github.com/mohd98zaid/FileForge" target="_blank" className="btn-primary">GitHub</a>
                </div>
            </div>
        </div>
    );
}
