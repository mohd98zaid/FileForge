"use client";

interface ProgressBarProps {
    progress: number;
    label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
    if (progress <= 0) return null;

    return (
        <div className="w-full">
            {label && <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>
            <p className="mt-1 text-right text-xs text-slate-500">{Math.round(progress)}%</p>
        </div>
    );
}
