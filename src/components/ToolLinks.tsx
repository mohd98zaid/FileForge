"use client";

import { Link } from '@/i18n/navigation';
import { useLocale } from "next-intl";
import { Tool } from "@/lib/tools";

export default function ToolLinks({ current, tools }: { current: string; tools: Tool[] }) {
    const locale = useLocale();
    const isHi = locale === "hi";

    const others = tools.filter((t) => t.href !== current && !t.disabled).slice(0, 6);

    return (
        <section className="mt-12">
            <h3 className="text-lg font-bold text-white mb-4">{isHi ? "\u{1F517} \u0914\u0930 \u091F\u0942\u0932\u094D\u0938" : "\u{1F517} More Tools"}</h3>
            <div className="flex flex-wrap gap-2">
                {others.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href as any}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-2 text-sm text-slate-400 border border-slate-700/50 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                    >
                        <span>{tool.icon}</span>
                        <span>{isHi ? tool.nameHi : tool.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
