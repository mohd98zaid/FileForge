"use client";

import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

interface Props {
    currentLocale: string;
}

export default function LocaleSwitcher({ currentLocale }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const isHi = currentLocale === "hi";

    const toggleLocale = () => {
        const nextLocale = isHi ? "en" : "hi";
        startTransition(() => {
            // @ts-ignore
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={toggleLocale}
            disabled={isPending}
            className={`
                relative flex items-center w-16 h-8 rounded-full p-1 transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900
                ${isHi ? 'bg-indigo-600' : 'bg-slate-700'}
                ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label="Toggle language"
        >
            {/* Background Text Labels */}
            <div className="absolute inset-x-0 flex justify-between px-2 text-[10px] font-bold text-white/70 select-none pointer-events-none">
                <span>EN</span>
                <span>हिंदी</span>
            </div>

            {/* Sliding Thumb */}
            <div
                className={`
                    absolute left-1 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md
                    transform transition-transform duration-300 ease-in-out
                    ${isHi ? 'translate-x-8' : 'translate-x-0'}
                `}
            >
                <span className="text-[10px] font-bold text-slate-800 select-none">
                    {isHi ? 'हिंदी' : 'EN'}
                </span>
            </div>
        </button>
    );
}
