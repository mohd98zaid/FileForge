import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import ToolLinks from '@/components/ToolLinks';
import FAQSection from '@/components/FAQSection';
import { ALL_TOOLS } from '@/lib/tools';

interface ToolLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
    faqs?: Array<{ question: string; questionHi?: string; answer: string; answerHi?: string }>;
}

export default function ToolLayout({ title, description, children, faqs }: ToolLayoutProps) {
    const locale = useLocale();
    const isHi = locale === 'hi';
    const pathname = usePathname();

    const currentSlug = pathname.split('/').pop() || '';
    const currentHref = currentSlug ? `/${currentSlug}` : '';

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {isHi ? "टूल्स" : "Tools"}
                </div>
                <h1 className="section-title">{title}</h1>
                <p className="mt-2 text-slate-400 max-w-2xl mx-auto">{description}</p>
            </div>

            <main className="w-full">
                {children}
                {faqs && faqs.length > 0 && (
                    <div className="mt-12">
                        <FAQSection items={faqs} />
                    </div>
                )}
            </main>

            <div className="pt-10">
                 <ToolLinks current={currentHref} tools={ALL_TOOLS} />
            </div>
        </div>
    );
}
