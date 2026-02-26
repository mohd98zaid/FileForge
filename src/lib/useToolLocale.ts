"use client";

import { useLocale } from "next-intl";

/**
 * A lightweight hook that returns locale helpers for tool pages.
 * Usage: const { isHi, t } = useToolLocale({ title: "Resize Image", titleHi: "चित्र का आकार बदलें", ... });
 */
export function useToolLocale<T extends Record<string, string>>(translations: { en: T; hi: T }): T & { isHi: boolean } {
    const locale = useLocale();
    const isHi = locale === "hi";
    const t = isHi ? translations.hi : translations.en;
    return { ...t, isHi };
}
