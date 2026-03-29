"use client";

import { useTranslations } from "next-intl";

interface DownloadButtonProps {
    onClick: () => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export default function DownloadButton({
    onClick,
    label,
    disabled = false,
    className = "",
}: DownloadButtonProps) {
    const t = useTranslations("Common");
    const displayLabel = label || t("download");

    return (
        <button onClick={onClick} disabled={disabled} className={`btn-primary ${className}`}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {displayLabel}
        </button>
    );
}
