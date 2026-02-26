"use client";

import { useLocale } from "next-intl";

interface FAQItem {
    question: string;
    questionHi?: string;
    answer: string;
    answerHi?: string;
}

import { useState } from "react";

export default function FAQSection({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const locale = useLocale();
    const isHi = locale === "hi";

    // JSON-LD for FAQ
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };

    return (
        <section className="mt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <h2 className="section-title mb-6">{isHi ? "❓ अक्सर पूछे जाने वाले प्रश्न" : "❓ Frequently Asked Questions"}</h2>
            <div className="space-y-3 max-w-2xl mx-auto">
                {items.map((faq, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex justify-between items-center p-4 text-left"
                        >
                            <span className="font-medium text-slate-200">{isHi && faq.questionHi ? faq.questionHi : faq.question}</span>
                            <span className={`text-slate-500 transition-transform ${openIndex === i ? "rotate-180" : ""}`}>▼</span>
                        </button>
                        {openIndex === i && (
                            <div className="px-4 pb-4 text-sm text-slate-400 animate-fade-in">
                                {isHi && faq.answerHi ? faq.answerHi : faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
