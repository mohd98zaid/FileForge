"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { FileArchive, Download, Folder, File, RefreshCw } from "lucide-react";
import JSZip from "jszip";

export default function ArchiveExtractorTool() {
    const [archiveFile, setArchiveFile] = useState<File | null>(null);
    const [files, setFiles] = useState<{ name: string, dir: boolean, blob?: Blob, url?: string }[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setArchiveFile(file);
        setIsExtracting(true);
        setError("");
        
        try {
            const zip = await JSZip.loadAsync(file);
            const extractedFiles: any[] = [];
            
            for (const [filename, fileObj] of Object.entries(zip.files)) {
                if (!fileObj.dir) {
                    const blob = await fileObj.async("blob");
                    const url = URL.createObjectURL(blob);
                    extractedFiles.push({ name: filename, dir: false, blob, url });
                } else {
                    extractedFiles.push({ name: filename, dir: true });
                }
            }
            
            setFiles(extractedFiles);
        } catch (err) {
            console.error(err);
            setError("Failed to extract archive. Make sure it is a valid ZIP file.");
        } finally {
            setIsExtracting(false);
        }
    };

    const reset = () => {
        setArchiveFile(null);
        setFiles([]);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <ToolLayout title="Archive Extractor" description="Extract ZIP files instantly in your browser without uploading to any server.">
            <div className="max-w-4xl mx-auto space-y-8">
                {!archiveFile && !isExtracting && (
                    <div 
                        className="border-2 border-dashed border-amber-300 rounded-2xl p-16 flex flex-col items-center justify-center bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FileArchive className="w-16 h-16 text-amber-500 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Select ZIP File</h3>
                        <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".zip,application/zip" className="hidden" />
                    </div>
                )}

                {isExtracting && (
                    <div className="flex flex-col items-center py-12">
                        <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <h3 className="font-bold text-lg">Extracting...</h3>
                    </div>
                )}

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-200">{error}</div>}

                {files.length > 0 && (
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <h3 className="font-bold text-xl">{archiveFile?.name}</h3>
                                <p className="text-slate-500 text-sm">{files.length} items extracted</p>
                            </div>
                            <Button onClick={reset} variant="secondary">Extract Another ZIP</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 transition">
                                    {file.dir ? <Folder className="w-8 h-8 text-slate-300 flex-shrink-0" /> : <File className="w-8 h-8 text-indigo-400 flex-shrink-0" />}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                                    </div>
                                    {!file.dir && (
                                        <a href={file.url} download={file.name.split('/').pop()} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">
                                            <Download className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
