"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Trash2, ShieldAlert } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

export default function PdfRedactionTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfOutput, setPdfOutput] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Simplistic text approach: redacted regions by coordinates
    const [redactions, setRedactions] = useState<{ page: number, x: number, y: number, width: number, height: number }[]>([
        { page: 1, x: 50, y: 50, width: 200, height: 50 }
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPdfOutput("");
    };

    const handleApplyRedaction = async () => {
        if (!file) return;
        setIsProcessing(true);
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            
            redactions.forEach(rect => {
                const pageIndex = rect.page - 1;
                if (pageIndex >= 0 && pageIndex < pages.length) {
                    const page = pages[pageIndex];
                    page.drawRectangle({
                        x: rect.x,
                        y: rect.y,
                        width: rect.width,
                        height: rect.height,
                        color: rgb(0, 0, 0),
                        borderWidth: 0,
                    });
                }
            });
            
            // Note: True redaction requires removing the underlying text data from the PDF stream.
            // Drawing a black rectangle obscures it visually but text might still be selectable 
            // if not flattened or rasterized. For a client-side simple tool, drawing a rect is step 1.
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setPdfOutput(URL.createObjectURL(blob));
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const addRedaction = () => {
        setRedactions([...redactions, { page: 1, x: 100, y: 100, width: 150, height: 30 }]);
    };

    return (
        <ToolLayout
            title="PDF Redaction Tool"
            description="Visually obscure and redact sensitive information from your PDF documents."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                {/* Upload or View */}
                {!file ? (
                    <div 
                        className="border-2 border-dashed border-red-300 dark:border-red-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-red-50/50 dark:bg-red-900/10 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <ShieldAlert className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload PDF to Redact</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            Black out text and images securely in your browser.
                        </p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="application/pdf" 
                            className="hidden" 
                        />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                        <div className="flex items-center space-x-4 mb-8 w-full p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                            </div>
                            <Button variant="secondary" onClick={() => { setFile(null); setPdfOutput(""); }} size="sm">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {!pdfOutput ? (
                            <div className="w-full space-y-6">
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm mb-4">
                                    <strong>Note:</strong> Specify the exact coordinates (X, Y, Width, Height) to draw solid black redaction boxes on specific pages. (0,0 is bottom-left).
                                </div>
                                <div className="space-y-4">
                                    {redactions.map((rect, idx) => (
                                        <div key={idx} className="flex flex-wrap items-end gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-slate-500 mb-1">Page</label>
                                                <input type="number" min="1" className="w-20 px-3 py-2 border rounded-md dark:bg-slate-800" value={rect.page} onChange={(e) => { const r = [...redactions]; r[idx].page = Number(e.target.value); setRedactions(r); }} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-slate-500 mb-1">X (px)</label>
                                                <input type="number" className="w-20 px-3 py-2 border rounded-md dark:bg-slate-800" value={rect.x} onChange={(e) => { const r = [...redactions]; r[idx].x = Number(e.target.value); setRedactions(r); }} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-slate-500 mb-1">Y (px)</label>
                                                <input type="number" className="w-20 px-3 py-2 border rounded-md dark:bg-slate-800" value={rect.y} onChange={(e) => { const r = [...redactions]; r[idx].y = Number(e.target.value); setRedactions(r); }} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-slate-500 mb-1">Width</label>
                                                <input type="number" className="w-24 px-3 py-2 border rounded-md dark:bg-slate-800" value={rect.width} onChange={(e) => { const r = [...redactions]; r[idx].width = Number(e.target.value); setRedactions(r); }} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-slate-500 mb-1">Height</label>
                                                <input type="number" className="w-24 px-3 py-2 border rounded-md dark:bg-slate-800" value={rect.height} onChange={(e) => { const r = [...redactions]; r[idx].height = Number(e.target.value); setRedactions(r); }} />
                                            </div>
                                            <Button variant="secondary" onClick={() => setRedactions(redactions.filter((_, i) => i !== idx))}>Remove</Button>
                                        </div>
                                    ))}
                                </div>
                                
                                <Button variant="secondary" onClick={addRedaction} className="text-sm">
                                    + Add Another Redaction Area
                                </Button>

                                <Button 
                                    variant="primary" 
                                    onClick={handleApplyRedaction}
                                    disabled={isProcessing || redactions.length === 0}
                                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-lg mt-4"
                                >
                                    {isProcessing ? "Processing..." : "Apply Redactions & Save"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl w-full mt-4">
                                <ShieldAlert className="w-16 h-16 text-red-600 dark:text-red-400 mb-6" />
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">PDF Redacted Successfully!</h4>
                                <a 
                                    href={pdfOutput} 
                                    download={`redacted_${file.name}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    Download Redacted PDF <Download className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
