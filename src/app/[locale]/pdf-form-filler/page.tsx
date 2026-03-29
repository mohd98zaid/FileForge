"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Trash2, Edit3 } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

export default function PdfFormFillerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfOutput, setPdfOutput] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [fieldsData, setFieldsData] = useState<{ id: string, name: string, value: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPdfOutput("");
        
        // Very basic form field extraction or simulation
        try {
            const arrayBuffer = await selected.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();
            const fields = form.getFields();
            
            if (fields.length > 0) {
                const extractedFields = fields.map(f => ({
                    id: f.getName(),
                    name: f.getName(),
                    value: ""
                }));
                setFieldsData(extractedFields);
            } else {
                // If no fields, just mock some for demo or leave empty
                setFieldsData([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFillPdf = async () => {
        if (!file) return;
        setIsProcessing(true);
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();
            
            fieldsData.forEach(field => {
                try {
                    const pdfField = form.getTextField(field.name);
                    if (pdfField) {
                        pdfField.setText(field.value);
                    }
                } catch (e) {
                    // Try other field types if it's not a Text field
                }
            });
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            setPdfOutput(URL.createObjectURL(blob));
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="PDF Form Filler"
            description="Fill out interactive PDF forms locally inside your browser."
           
        >
            <div className="max-w-4xl mx-auto flex flex-col space-y-8">
                {/* Upload or View */}
                {!file ? (
                    <div 
                        className="border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-indigo-50/50 dark:bg-indigo-900/10 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            <FileText className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Upload a Fillable PDF</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
                            We auto-detect form fields and let you fill them securely.
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
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
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
                                {fieldsData.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {fieldsData.map((field, idx) => (
                                            <div key={idx} className="flex flex-col space-y-1">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {field.name}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const fresh = [...fieldsData];
                                                        fresh[idx].value = e.target.value;
                                                        setFieldsData(fresh);
                                                    }}
                                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-500">
                                        No interactive form fields found in this PDF. Try uploading another one.
                                    </div>
                                )}

                                <Button 
                                    variant="primary" 
                                    onClick={handleFillPdf}
                                    disabled={isProcessing || fieldsData.length === 0}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg mt-4"
                                >
                                    {isProcessing ? "Processing..." : "Fill and Save PDF"}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl w-full mt-4">
                                <FileText className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mb-6" />
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Form Filled Successfully!</h4>
                                <a 
                                    href={pdfOutput} 
                                    download={`filled_${file.name}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    Download Filled PDF <Download className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
