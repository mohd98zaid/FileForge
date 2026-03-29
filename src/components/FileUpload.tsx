"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useTranslations } from "next-intl";

interface FileUploadProps {
    accept?: Record<string, string[]>;
    maxFiles?: number;
    maxSizeMB?: number;
    onFilesSelected: (files: File[]) => void;
    label?: string;
    hint?: string;
    /**
     * When true the dropzone is hidden (externally controlled — used for
     * multi-file tools like Merge PDF where the parent manages the file list).
     * When undefined/false the component manages its own "selected" state.
     */
    hasFiles?: boolean;
    compact?: boolean;
}

function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function FileUpload({
    accept = { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".bmp", ".gif", ".tiff"] },
    maxFiles = 5,
    maxSizeMB = 10,
    onFilesSelected,
    label,
    hint,
    hasFiles,
    compact,
}: FileUploadProps) {
    const t = useTranslations("Common");
    const defaultLabel = label || t("uploadLabel");
    const defaultHint = hint || t("uploadHint");

    const [error, setError] = useState<string | null>(null);
    // Internal file tracking (used when parent doesn't control via hasFiles)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            setError(null);
            if (rejected.length > 0) {
                const code = rejected[0]?.errors?.[0]?.code;
                if (code === "too-many-files") {
                    setError(t("errorTooManyFiles", { maxFiles }));
                } else if (code === "file-too-large") {
                    const maxKB = maxSizeMB * 1024;
                    const sizeStr = maxKB >= 1024 ? `${maxSizeMB} MB` : `${maxKB} KB`;
                    setError(t("errorFileTooLarge", { sizeStr }));
                } else {
                    setError(t("errorInvalidFile"));
                }
                return;
            }
            if (accepted.length > maxFiles) {
                setError(t("errorTooManyFiles", { maxFiles }));
                return;
            }
            setSelectedFiles(accepted);
            onFilesSelected(accepted);
        },
        [maxFiles, maxSizeMB, onFilesSelected, t]
    );

    const handleClear = () => {
        setSelectedFiles([]);
        setError(null);
        onFilesSelected([]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize: maxSizeMB * 1024 * 1024,
    });

    // Determine whether to show the "selected" state
    // If parent controls via hasFiles prop, trust that; otherwise use internal state
    const isSelected = hasFiles !== undefined ? hasFiles : selectedFiles.length > 0;

    // ── Selected state: compact file card ──────────────────────────────────────
    if (isSelected) {
        // For parent-controlled (hasFiles prop), we can't show individual files
        // because we don't have a reference — parent renders its own list.
        // Just return null so the parent takes over entirely.
        if (hasFiles !== undefined) return null;

        // Internal state: render a compact card per selected file
        return (
            <div className="space-y-2">
                {selectedFiles.map((file, i) => (
                    <div
                        key={`${file.name}-${i}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-xl">
                                {file.type.startsWith("image/") ? "🖼️"
                                    : file.type === "application/pdf" ? "📄"
                                        : file.name.match(/\.(ppt|pptx)$/i) ? "📊"
                                            : file.name.match(/\.(xls|xlsx)$/i) ? "📈"
                                                : file.name.match(/\.(doc|docx)$/i) ? "📝"
                                                    : file.type.startsWith("audio/") ? "🎵"
                                                        : file.type.startsWith("video/") ? "🎬"
                                                            : "📎"}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            title={t("removeFile")}
                            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // ── Drop zone ──────────────────────────────────────────────────────────────
    return (
        <div>
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
            >
                <input {...getInputProps()} />
                {!compact && (
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                        <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                )}
                <p className="text-base font-medium text-slate-300">{defaultLabel}</p>
                <p className="mt-1 text-sm text-slate-500">{defaultHint}</p>
            </div>

            {error && (
                <p className="mt-3 text-sm font-medium text-red-400">{error}</p>
            )}
        </div>
    );
}
