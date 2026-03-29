"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { UploadCloud, FileText, Copy, Trash2, RefreshCw } from "lucide-react";

export default function PdfToTextTool() {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setExtractedText("");
        setProgress(0);
        
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.type !== "application/pdf") {
            setError("Please upload a valid PDF file.");
            return;
        }

        setFile(selected);

        // Auto-extract upon upload
        extractText(selected);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const extractText = async (pdfFile: File) => {
        setIsProcessing(true);
        setError("");
        setExtractedText("");
        setProgress(0);

        try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url
            ).toString();

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = "";
            const numPages = pdf.numPages;

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Extract string items
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;
                
                // Update progress hook
                setProgress(Math.round((i / numPages) * 100));
            }

            setExtractedText(fullText.trim());

        } catch (err: any) {
            console.error("PDF Extraction error:", err);
            setError(`Failed to extract text: ${err.message || 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
            setProgress(100);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolLayout
            title="PDF to Text Extractor"
            description="Extract all raw, readable text from a PDF document securely in your browser without uploading."
           
        >
            <div className="max-w-5xl mx-auto flex flex-col space-y-6">
                
                {/* Upload Header */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                    
                    {/* Background Progress Bar */}
                    {isProcessing && (
                        <div 
                            className="absolute top-0 left-0 h-full bg-blue-50 dark:bg-blue-500/10 transition-all duration-300 ease-out z-0" 
                            style={{ width: `${progress}%` }}
                        />
                    )}

                    <div className="flex items-center space-x-4 z-10 w-full md:w-auto">
                        <Button 
                            variant="primary" 
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white border-none"
                            disabled={isProcessing}
                        >
                            <UploadCloud className="w-4 h-4 mr-2" />
                            {file ? 'Change PDF' : 'Upload PDF'}
                        </Button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept=".pdf,application/pdf" 
                            className="hidden" 
                        />
                        
                        {file && (
                            <div className="flex items-center space-x-2 truncate pr-4">
                                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="z-10 flex items-center w-full md:w-auto justify-end gap-2">
                         {file && extractedText && (
                            <Button variant="secondary" onClick={copyToClipboard} size="sm" className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                                <Copy className="w-4 h-4 mr-2" />
                                {copied ? "Copied!" : "Copy Text"}
                            </Button>
                        )}
                        {file && (
                            <Button variant="secondary" onClick={() => { setFile(null); setExtractedText(""); setError(""); }} size="sm" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Editor Split Pane */}
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm relative h-[600px] focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
                    
                    {!file && !isProcessing && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                             <FileText className="w-16 h-16 mb-4 opacity-50" />
                             <p className="font-medium">Upload a PDF to view extracted text here.</p>
                         </div>
                    )}

                    {isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
                            <RefreshCw className="w-10 h-10 mb-4 animate-spin" />
                            <p className="font-bold tracking-wide">Extracting Text... {progress}%</p>
                        </div>
                    )}

                    <textarea
                        value={extractedText}
                        readOnly
                        className="flex-1 w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed outline-none resize-none text-slate-800 dark:text-slate-200"
                        placeholder=""
                        spellCheck={false}
                    />
                </div>

            </div>
        </ToolLayout>
    );
}
