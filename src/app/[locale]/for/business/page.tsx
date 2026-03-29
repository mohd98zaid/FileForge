"use client";

import { Link } from '@/i18n/navigation';
import { useLocale } from "next-intl";
import { ALL_TOOLS, Tool } from "@/lib/tools";

function ToolCard({ tool, isHi }: { tool: Tool; isHi: boolean }) {
    return (
        <Link href={tool.href as any} className="glass-card p-5 group hover:border-amber-500/50 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <span className="text-3xl bg-slate-800/50 p-2.5 rounded-xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                <span className="text-xs font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded">{tool.category.toUpperCase()}</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors mb-1">
                {isHi ? tool.nameHi : tool.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? tool.descriptionHi : tool.description}
            </p>
        </Link>
    );
}

export default function BusinessPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const get = (hrefs: string[]) => ALL_TOOLS.filter(t => hrefs.includes(t.href));

    const invoiceTools = ["/invoice-generator", "/resume-builder", "/pdf-merge", "/pdf-split", "/compress-pdf", "/pdf-to-word", "/word-to-pdf"];
    const finTools = ["/sip-calculator", "/emi-calculator", "/gst-calculator", "/income-tax-calculator", "/currency-converter", "/compound-interest"];
    const complianceTools = ["/pan-validator", "/gstin-validator", "/ifsc-validator", "/aadhaar-mask", "/pdf-redaction", "/password-pdf", "/pdf-metadata-remover"];
    const seoTools = ["/meta-tag-generator", "/sitemap-generator", "/robots-txt-generator", "/utm-builder", "/html-to-pdf", "/privacy-policy-generator", "/qr-generator"];

    const sections = [
        { icon: "📝", label: isHi ? "इनवॉइस & रिज़्यूम" : "Invoices & Resumes", tools: get(invoiceTools) },
        { icon: "💰", label: isHi ? "वित्त कैलकुलेटर" : "Financial Calculators", tools: get(finTools) },
        { icon: "🔒", label: isHi ? "अनुपालन & सुरक्षा" : "Compliance & Security", tools: get(complianceTools) },
        { icon: "📈", label: isHi ? "SEO & मार्केटिंग" : "SEO & Marketing", tools: get(seoTools) },
    ];

    return (
        <div className="animate-fade-in space-y-16">
            <div className="text-center space-y-4 pt-10">
                <div className="inline-block p-4 rounded-full bg-amber-500/10 mb-4 animate-bounce-slow">
                    <span className="text-5xl">💼</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent leading-normal py-2">
                    {isHi ? "व्यवसाय & प्रोफ़ेशनल" : "Business & Professional"}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                    {isHi ? "इनवॉइस, वित्त, भारतीय अनुपालन, और SEO टूल्स — सब मुफ़्त" : "Invoices, finance, Indian compliance, and SEO tools — all free"}
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

            <div className="glass-card p-10 text-center space-y-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                <h3 className="text-2xl font-bold text-white">{isHi ? "अधिक टूल्स चाहिए?" : "Need more tools?"}</h3>
                <div className="flex justify-center gap-4">
                    <Link href="/" className="btn-secondary">{isHi ? "सभी टूल्स देखें" : "Browse All Tools"}</Link>
                    <a href="https://github.com/mohd98zaid/FileForge" target="_blank" className="btn-primary">GitHub</a>
                </div>
            </div>
        </div>
    );
}
