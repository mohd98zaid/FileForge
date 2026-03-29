"use client";

import { Link } from '@/i18n/navigation';
import { useState } from "react";
import { ALL_TOOLS, Tool } from "@/lib/tools";
import { useTranslations, useLocale } from "next-intl";

function ToolCard({ tool, isHi, serverLabel }: { tool: Tool; isHi: boolean; serverLabel: string }) {
    if (tool.disabled) {
        return (
            <div key={tool.href} className="tool-card group flex items-start gap-4 opacity-50 cursor-not-allowed select-none">
                <span className="text-3xl grayscale">{tool.icon}</span>
                <div>
                    <h3 className="font-semibold text-slate-400 flex items-center gap-2">
                        {isHi ? tool.nameHi : tool.name}
                        <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-700 text-slate-500">{isHi ? 'जल्द आएगा' : 'Coming Soon'}</span>
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{isHi ? tool.descriptionHi : tool.description}</p>
                </div>
            </div>
        );
    }
    return (
        <Link href={tool.href as any} key={tool.href} className="tool-card group flex items-start gap-4">
            <span className="text-3xl">{tool.icon}</span>
            <div>
                <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {isHi ? tool.nameHi : tool.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{isHi ? tool.descriptionHi : tool.description}</p>
            </div>
        </Link>
    );
}

export default function Home() {
    const t = useTranslations("Index");
    const locale = useLocale();
    const isHi = locale === "hi";
    const [searchQuery, setSearchQuery] = useState("");

    // Filter tools based on search (search both EN and HI fields)
    const filteredTools = ALL_TOOLS.filter((tool) => {
        const q = searchQuery.toLowerCase();
        return (
            tool.name.toLowerCase().includes(q) ||
            tool.nameHi.includes(searchQuery) ||
            tool.description.toLowerCase().includes(q) ||
            tool.descriptionHi.includes(searchQuery) ||
            tool.category.toLowerCase().includes(q)
        );
    });

    // Categorized tools
    const imageTools = ALL_TOOLS.filter((t) => t.category === "image");
    const pdfTools = ALL_TOOLS.filter((t) => t.category === "pdf");
    const officeTools = ALL_TOOLS.filter((t) => t.category === "office");
    const ocrTools = ALL_TOOLS.filter((t) => t.category === "ocr");
    const audioTools = ALL_TOOLS.filter((t) => t.category === "audio");
    const videoTools = ALL_TOOLS.filter((t) => t.category === "video");
    const devTools = ALL_TOOLS.filter((t) => ["dev", "developer", "generators"].includes(t.category));
    const designTools = ALL_TOOLS.filter((t) => t.category === "design");
    const productivityTools = ALL_TOOLS.filter((t) => ["productivity", "time"].includes(t.category));
    const calculatorsTools = ALL_TOOLS.filter((t) => ["calculators", "finance"].includes(t.category));
    const securityTools = ALL_TOOLS.filter((t) => t.category === "security");
    const archiveTools = ALL_TOOLS.filter((t) => t.category === "archive");
    const aiTools = ALL_TOOLS.filter((t) => t.category === "ai");

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="text-center py-16 md:py-24">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t('heroBadge')}
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent leading-normal py-2">
                    {t('title')}
                </h1>
                <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    {t('subtitle')}
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-md mx-auto relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-200" />
                    <div className="relative flex items-center bg-dark-900 border border-slate-700/50 rounded-xl shadow-2xl">
                        <span className="pl-4 text-slate-500">🔍</span>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-3 pl-3 pr-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <a href="#image-tools" className="btn-secondary">{t('browseAll')}</a>
                    <Link href={"/for/students" as any} className="group px-5 py-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all flex items-center gap-2">
                        <span className="text-xl group-hover:scale-110 transition-transform">🎓</span>
                        <span className="font-medium">{t('studentsExams')}</span>
                    </Link>
                    <Link href={"/for/creators" as any} className="group px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all flex items-center gap-2">
                        <span className="text-xl group-hover:scale-110 transition-transform">🎨</span>
                        <span className="font-medium">{t('creatorsDesigners')}</span>
                    </Link>
                    <Link href={"/for/developers" as any} className="group px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center gap-2">
                        <span className="text-xl group-hover:scale-110 transition-transform">👨‍💻</span>
                        <span className="font-medium">{isHi ? "डेवलपर्स" : "Developers"}</span>
                    </Link>
                    <Link href={"/for/business" as any} className="group px-5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-2">
                        <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                        <span className="font-medium">{isHi ? "व्यवसाय" : "Business"}</span>
                    </Link>
                </div>
            </section>

            {/* Search Results */}
            {searchQuery.trim() && (
                <section className="mt-10 animate-fade-in">
                    <h2 className="section-title mb-8">{t('searchResults', { count: filteredTools.length })}</h2>
                    {filteredTools.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTools.map((tool) => (
                                <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500">{t('noResults', { query: searchQuery })}</p>
                    )}
                </section>
            )}

            {/* Categorized View */}
            {!searchQuery.trim() && (
                <>
                    <section id="image-tools" className="mt-10">
                        <h2 className="section-title mb-8">🖼️ {t('imageTools')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {imageTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>

                    <section id="pdf-tools" className="mt-16">
                        <h2 className="section-title mb-8">📄 {t('pdfTools')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {pdfTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>

                    <section id="office-tools" className="mt-16">
                        <h2 className="section-title mb-8">🗂️ {isHi ? 'ऑफ़िस डॉक्यूमेंट टूल्स' : 'Office Docs'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {officeTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>

                    <section id="ocr-tools" className="mt-16">
                        <h2 className="section-title mb-8">🔍 {t('ocrTools')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {ocrTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>

                    <section id="audio-tools" className="mt-16">
                        <h2 className="section-title mb-8">🎵 {t('audioTools')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {audioTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>

                    <section id="dev-tools" className="mt-16">
                        <h2 className="section-title mb-8">🛠️ {t('devTools')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {devTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    
                    {videoTools.length > 0 && (
                    <section id="video-tools" className="mt-16">
                        <h2 className="section-title mb-8">🎞️ {isHi ? 'वीडियो टूल्स' : 'Video Tools'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {videoTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {designTools.length > 0 && (
                    <section id="design-tools" className="mt-16">
                        <h2 className="section-title mb-8">🎨 {isHi ? 'डिज़ाइन टूल्स' : 'Design Tools'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {designTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {productivityTools.length > 0 && (
                    <section id="productivity-tools" className="mt-16">
                        <h2 className="section-title mb-8">⏱️ {isHi ? 'प्रोडक्टिविटी' : 'Productivity & Time'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {productivityTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {calculatorsTools.length > 0 && (
                    <section id="calculators-tools" className="mt-16">
                        <h2 className="section-title mb-8">🧮 {isHi ? 'कैलकुलेटर' : 'Calculators & Math'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {calculatorsTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {securityTools.length > 0 && (
                    <section id="security-tools" className="mt-16">
                        <h2 className="section-title mb-8">🔐 {isHi ? 'सुरक्षा टूल्स' : 'Security Tools'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {securityTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {archiveTools.length > 0 && (
                    <section id="archive-tools" className="mt-16">
                        <h2 className="section-title mb-8">📦 {isHi ? 'आर्काइव टूल्स' : 'Archive Tools'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {archiveTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}

                    {aiTools.length > 0 && (
                    <section id="ai-tools" className="mt-16">
                        <h2 className="section-title mb-8">🤖 {isHi ? 'AI विज़न' : 'Edge AI Vision'}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {aiTools.map((tool) => <ToolCard key={tool.href} tool={tool} isHi={isHi} serverLabel={t('serverLabel')} />)}
                        </div>
                    </section>
                    )}
                </>
            )}

            {/* Stats */}
            <section className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t('statsTools'), value: `${ALL_TOOLS.length}+` },
                    { label: t('statsAI'), value: t('statsAIValue') },
                    { label: t('statsCost'), value: t('statsCostValue') },
                    { label: t('statsSignup'), value: t('statsSignupValue') },
                ].map((s) => (
                    <div key={s.label} className="glass-card text-center">
                        <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
                        <p className="mt-2 text-sm text-slate-500">{s.label}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}
