"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import FileUpload from "@/components/FileUpload";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLayout from "@/components/ToolLayout";
import ProgressBar from "@/components/ProgressBar";
import JSZip from "jszip";

const faqs = [
    { question: "Can I split images for Instagram grid?", questionHi: "क्या मैं इंस्टाग्राम ग्रिड के लिए छवियों को विभाजित कर सकता हूँ?", answer: "Yes! Upload your photo and set the grid to 3 columns and 3 rows for a perfect 9-grid.", answerHi: "हाँ! अपनी तस्वीर अपलोड करें और एक सही 9-ग्रिड के लिए ग्रिड को 3 कॉलम और 3 पंक्तियों पर सेट करें।" },
    { question: "How are the images downloaded?", questionHi: "छवियाँ कैसे डाउनलोड की जाती हैं?", answer: "The sliced images are bundled into a single ZIP file for easy downloading.", answerHi: "आसानी से डाउनलोड करने के लिए कटी हुई छवियों को एकल ZIP फ़ाइल में बंडल किया जाता है।" },
];

export default function ImageSplitterPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [rows, setRows] = useState(3);
    const [columns, setColumns] = useState(3);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onFilesSelected = (f: File[]) => {
        if (!f.length) return;
        setFile(f[0]);
    };

    useEffect(() => {
        if (!file) {
            setImage(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = URL.createObjectURL(file);
    }, [file]);

    // Draw preview with grid lines
    useEffect(() => {
        if (!canvasRef.current || !image) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Scale preview canvas down to fit viewport but maintain ratio
        const maxWidth = 800;
        let pWidth = image.width;
        let pHeight = image.height;
        if (pWidth > maxWidth) {
            pHeight = (maxWidth * pHeight) / pWidth;
            pWidth = maxWidth;
        }

        canvas.width = pWidth;
        canvas.height = pHeight;
        
        // Draw image
        ctx.drawImage(image, 0, 0, pWidth, pHeight);

        // Draw grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        const cellWidth = pWidth / columns;
        const cellHeight = pHeight / rows;

        ctx.beginPath();
        // Vertical lines
        for (let i = 1; i < columns; i++) {
            const x = i * cellWidth;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, pHeight);
        }
        // Horizontal lines
        for (let i = 1; i < rows; i++) {
            const y = i * cellHeight;
            ctx.moveTo(0, y);
            ctx.lineTo(pWidth, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }, [image, rows, columns]);

    const handleSplit = async () => {
        if (!image || !file) return;
        setIsProcessing(true);
        setProgress(10);

        try {
            const zip = new JSZip();
            const sliceWidth = image.width / columns;
            const sliceHeight = image.height / rows;
            const totalSlices = rows * columns;
            
            // We need a pristine off-screen canvas to do the actual slicing at full resolution
            const cropCanvas = document.createElement("canvas");
            cropCanvas.width = sliceWidth;
            cropCanvas.height = sliceHeight;
            const ctx = cropCanvas.getContext("2d");

            if (!ctx) throw new Error("Failed to get 2d context");

            let doneCount = 0;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    ctx.clearRect(0, 0, sliceWidth, sliceHeight);
                    // Draw the specific slice from the original image
                    ctx.drawImage(
                        image,
                        c * sliceWidth, r * sliceHeight, sliceWidth, sliceHeight, // Source crop
                        0, 0, sliceWidth, sliceHeight // Destination
                    );

                    // Convert to blob
                    const blob = await new Promise<Blob | null>(resolve => cropCanvas.toBlob(resolve, file.type || "image/png"));
                    if (blob) {
                        const ext = file.name.split('.').pop() || "png";
                        const baseName = file.name.replace(/\.[^/.]+$/, "");
                        zip.file(`${baseName}_row${r+1}_col${c+1}.${ext}`, blob);
                    }
                    
                    doneCount++;
                    setProgress(10 + Math.floor((doneCount / totalSlices) * 80));
                }
            }

            setProgress(90);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `split_${file.name.replace(/\.[^/.]+$/, "")}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            setProgress(100);

        } catch (error) {
            console.error("Split failed", error);
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProgress(0), 2000);
        }
    };

    return (
        <ToolLayout
            title={isHi ? "✂️ छवि स्प्लिटर" : "✂️ Image Splitter"}
            description={isHi ? "छवियों को ग्रिड टाइलों में काटें और उन्हें एक ZIP के रूप में डाउनलोड करें" : "Cut images into a grid of tiles and download them as a ZIP"}
            faqs={faqs}
           
        >
            <div className="space-y-6">
                {!file ? (
                    <FileUpload maxFiles={1} accept={{ "image/*": [] }} onFilesSelected={onFilesSelected} label={isHi ? "छवि यहाँ छोड़ें" : "Drop an Image Here"} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                            <span className="text-slate-300 font-medium truncate max-w-xs">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded">
                                {isHi ? "दूसरी छवि चुनें" : "Change Image"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "पंक्तियां (Rows)" : "Rows (Vertical Cuts)"}</label>
                                <div className="flex items-center gap-3">
                                    <input type="range" min="1" max="10" value={rows} onChange={(e) => setRows(+e.target.value)} className="w-full accent-indigo-500" />
                                    <span className="text-slate-300 font-medium w-6 text-center">{rows}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">{isHi ? "कॉलम (Columns)" : "Columns (Horizontal Cuts)"}</label>
                                <div className="flex items-center gap-3">
                                    <input type="range" min="1" max="10" value={columns} onChange={(e) => setColumns(+e.target.value)} className="w-full accent-indigo-500" />
                                    <span className="text-slate-300 font-medium w-6 text-center">{columns}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center bg-slate-900 rounded-lg p-2 border border-slate-800">
                            <canvas ref={canvasRef} className="max-w-full h-auto rounded shadow-xl" style={{ maxHeight: "60vh" }}></canvas>
                        </div>

                        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-slate-800">
                            <div className="text-sm text-slate-400">
                                {isHi ? `उत्पन्न करेगा ${rows * columns} छवि खंड` : `Will generate ${rows * columns} image slices`}
                            </div>
                            
                            {isProcessing ? (
                                <ProgressBar progress={progress} label={isHi ? "स्लाइसिंग और जिपिंग..." : "Slicing & Zipping..."} />
                            ) : (
                                <DownloadButton onClick={handleSplit} label={isHi ? "ZIP के रूप में स्लाइस डाउनलोड करें" : "Download Slices as ZIP"} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
