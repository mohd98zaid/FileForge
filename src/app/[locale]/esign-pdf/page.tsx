"use client";

import { useLocale, useTranslations } from "next-intl";

import { useState, useRef, useEffect, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";
import { esignPdf } from "@/utils/pdf-processing";

const faqs = [
    { question: "Is the signature legally valid?", questionHi: "क्या हस्ताक्षर कानूनी रूप से मान्य है?", answer: "This is a visual signature overlay. For legally binding documents, a digital certificate may be required.", answerHi: "यह एक विज़ुअल सिग्नेचर है। कानूनी दस्तावेज़ों के लिए डिजिटल सर्टिफ़िकेट ज़रूरी हो सकता है।" },
    { question: "Can I draw my signature?", questionHi: "क्या मैं अपना हस्ताक्षर बना सकता हूँ?", answer: "Yes! Draw with mouse or touch and place it on any page.", answerHi: "हाँ! माउस या टच से अपना हस्ताक्षर बनाएँ और PDF पर लगाएँ।" },
];

type DragMode = "move" | "tl" | "tr" | "bl" | "br" | null;

export default function EsignPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const tCommon = useTranslations("Common");

    const sigCanvasRef = useRef<HTMLCanvasElement>(null);
    const sigCanvasContainerRef = useRef<HTMLDivElement>(null);
    const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    const [files, setFiles] = useState<File[]>([]);
    const [sigMode, setSigMode] = useState<"draw" | "upload">("draw");
    const [sigFile, setSigFile] = useState<File | null>(null);
    const [sigDataUrl, setSigDataUrl] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Signature placement (in PDF points)
    const [sigPos, setSigPos] = useState({ x: 100, y: 700 });
    const [sigSize, setSigSize] = useState({ w: 200, h: 50 });
    const [sigRotation, setSigRotation] = useState(0); // degrees

    // Drag state
    const [dragMode, setDragMode] = useState<DragMode>(null);
    const [dragAnchor, setDragAnchor] = useState({ x: 0, y: 0 });
    const [dragInitPos, setDragInitPos] = useState({ x: 0, y: 0 });
    const [dragInitSize, setDragInitSize] = useState({ w: 0, h: 0 });

    // PDF state
    const [pdfPageSize, setPdfPageSize] = useState({ w: 595, h: 842 });
    const [pdfScale, setPdfScale] = useState(1);
    const pdfjsRef = useRef<any>(null);
    const pdfDocRef = useRef<any>(null);
    const sigImgRef = useRef<HTMLImageElement | null>(null);

    // Preload signature image
    useEffect(() => {
        if (!sigDataUrl) { sigImgRef.current = null; return; }
        const img = new Image();
        img.onload = () => { sigImgRef.current = img; renderPdfPage(page); };
        img.src = sigDataUrl;
    }, [sigDataUrl]);

    // Load pdf.js
    useEffect(() => {
        if (typeof window === "undefined") return;
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = () => {
            const pdfjs = (window as any).pdfjsLib;
            pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            pdfjsRef.current = pdfjs;
        };
        document.head.appendChild(script);
    }, []);

    const renderPdfPage = useCallback(async (pageNum: number) => {
        if (!pdfjsRef.current || !files.length) return;
        try {
            if (!pdfDocRef.current) {
                const buf = await files[0].arrayBuffer();
                pdfDocRef.current = await pdfjsRef.current.getDocument({ data: buf }).promise;
                setTotalPages(pdfDocRef.current.numPages);
            }
            const doc = pdfDocRef.current;
            const clamped = Math.max(1, Math.min(pageNum, doc.numPages));
            const pdfPage = await doc.getPage(clamped);
            const vp = pdfPage.getViewport({ scale: 1 });
            setPdfPageSize({ w: vp.width, h: vp.height });

            const canvas = pdfCanvasRef.current;
            if (!canvas) return;
            const containerW = pdfContainerRef.current?.clientWidth || 600;
            const scale = Math.min(1.5, containerW / vp.width);
            setPdfScale(scale);

            const svp = pdfPage.getViewport({ scale });
            canvas.width = svp.width;
            canvas.height = svp.height;

            const ctx = canvas.getContext("2d")!;
            await pdfPage.render({ canvasContext: ctx, viewport: svp }).promise;
            drawSigOverlay(ctx, scale);
        } catch { /* ignore */ }
    }, [files, sigPos, sigSize, sigRotation]);

    const drawSigOverlay = (ctx: CanvasRenderingContext2D, scale: number) => {
        const img = sigImgRef.current;
        if (!img) return;

        const sx = sigPos.x * scale;
        const sy = sigPos.y * scale;
        const sw = sigSize.w * scale;
        const sh = sigSize.h * scale;
        const cx = sx + sw / 2;
        const cy = sy + sh / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((-sigRotation * Math.PI) / 180);
        ctx.globalAlpha = 0.85;
        ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
        ctx.globalAlpha = 1.0;

        // Dashed border
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-sw / 2, -sh / 2, sw, sh);
        ctx.setLineDash([]);

        // 4 corner handles
        const hs = 8;
        ctx.fillStyle = "#6366f1";
        ctx.fillRect(-sw / 2 - hs / 2, -sh / 2 - hs / 2, hs, hs);
        ctx.fillRect(sw / 2 - hs / 2, -sh / 2 - hs / 2, hs, hs);
        ctx.fillRect(-sw / 2 - hs / 2, sh / 2 - hs / 2, hs, hs);
        ctx.fillRect(sw / 2 - hs / 2, sh / 2 - hs / 2, hs, hs);

        // Move icon in center
        ctx.fillStyle = "rgba(99,102,241,0.7)";
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✋", 0, 4);

        ctx.restore();
    };

    useEffect(() => { renderPdfPage(page); }, [page, renderPdfPage]);
    useEffect(() => {
        pdfDocRef.current = null;
        if (files.length) { renderPdfPage(1); setPage(1); }
    }, [files]);

    // Signature drawing — transparent background
    useEffect(() => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const container = sigCanvasContainerRef.current;
        if (container) { canvas.width = container.clientWidth; canvas.height = 150; }
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Clear to transparent (no white fill)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [sigMode]);

    const getSigCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = sigCanvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
    };

    const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const ctx = sigCanvasRef.current!.getContext("2d")!;
        const p = getSigCanvasPos(e);
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = sigCanvasRef.current!.getContext("2d")!;
        const p = getSigCanvasPos(e);
        ctx.strokeStyle = "#000"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.lineTo(p.x, p.y); ctx.stroke();
    };

    const endDraw = () => {
        setIsDrawing(false);
        if (sigCanvasRef.current) setSigDataUrl(sigCanvasRef.current.toDataURL("image/png"));
    };

    const clearCanvas = () => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        // Clear to transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSigDataUrl(null);
    };

    useEffect(() => {
        if (sigFile) {
            const url = URL.createObjectURL(sigFile);
            setSigDataUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [sigFile]);

    // PDF mouse interaction — detect handle/move
    const toPdfCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = pdfCanvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width) / pdfScale,
            y: (e.clientY - rect.top) * (canvas.height / rect.height) / pdfScale,
        };
    };

    const detectPdfHandle = (mx: number, my: number): DragMode => {
        const tol = 12;
        const { x, y } = sigPos;
        const { w, h } = sigSize;

        // Corners
        if (Math.abs(mx - x) < tol && Math.abs(my - y) < tol) return "tl";
        if (Math.abs(mx - (x + w)) < tol && Math.abs(my - y) < tol) return "tr";
        if (Math.abs(mx - x) < tol && Math.abs(my - (y + h)) < tol) return "bl";
        if (Math.abs(mx - (x + w)) < tol && Math.abs(my - (y + h)) < tol) return "br";
        // Inside
        if (mx >= x && mx <= x + w && my >= y && my <= y + h) return "move";
        return null;
    };

    const onPdfMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const p = toPdfCoords(e);
        const h = detectPdfHandle(p.x, p.y);
        if (h) {
            setDragMode(h);
            setDragAnchor(p);
            setDragInitPos({ ...sigPos });
            setDragInitSize({ ...sigSize });
        }
    };

    const onPdfMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const p = toPdfCoords(e);
        if (!dragMode) {
            const h = detectPdfHandle(p.x, p.y);
            const canvas = pdfCanvasRef.current;
            if (canvas) {
                canvas.style.cursor = h === "move" ? "move" :
                    (h === "tl" || h === "br") ? "nwse-resize" :
                        (h === "tr" || h === "bl") ? "nesw-resize" : "default";
            }
            return;
        }

        const dx = p.x - dragAnchor.x;
        const dy = p.y - dragAnchor.y;
        const { x: ix, y: iy } = dragInitPos;
        const { w: iw, h: ih } = dragInitSize;

        switch (dragMode) {
            case "move":
                setSigPos({
                    x: Math.max(0, Math.min(pdfPageSize.w - sigSize.w, ix + dx)),
                    y: Math.max(0, Math.min(pdfPageSize.h - sigSize.h, iy + dy)),
                });
                break;
            case "tl":
                setSigPos({ x: Math.max(0, ix + dx), y: Math.max(0, iy + dy) });
                setSigSize({ w: Math.max(20, iw - dx), h: Math.max(20, ih - dy) });
                break;
            case "tr":
                setSigPos({ x: ix, y: Math.max(0, iy + dy) });
                setSigSize({ w: Math.max(20, iw + dx), h: Math.max(20, ih - dy) });
                break;
            case "bl":
                setSigPos({ x: Math.max(0, ix + dx), y: iy });
                setSigSize({ w: Math.max(20, iw - dx), h: Math.max(20, ih + dy) });
                break;
            case "br":
                setSigSize({ w: Math.max(20, iw + dx), h: Math.max(20, ih + dy) });
                break;
        }
    };

    const onPdfMouseUp = () => setDragMode(null);

    // Submit
    const handleProcess = async () => {
        if (!files.length) return;
        setError(null); setResultBlob(null); setProgress(10);
        try {
            // Client-side processing
            let finalSigFile: File | Blob;
            if (sigMode === "draw" && sigCanvasRef.current) {
                const blob = await new Promise<Blob | null>((res) => sigCanvasRef.current!.toBlob(res, "image/png"));
                if (!blob) throw new Error("Failed to capture signature");
                finalSigFile = blob;
            } else if (sigFile) {
                finalSigFile = sigFile;
            } else {
                throw new Error("No signature provided");
            }

            const result = await esignPdf(
                files[0],
                finalSigFile,
                sigPos.x,
                sigPos.y,
                sigSize.w,
                sigSize.h,
                page,
                sigRotation
            );
            setResultBlob(result); setProgress(100);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Signing failed."); setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✍️ PDF पर हस्ताक्षर" : "✍️ eSign PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "किसी भी पेज पर अपने हस्ताक्षर लगाएँ" : "Add your signature to any PDF page — background is auto-removed"}</p>
            </div>

            <div className="glass-card max-w-3xl mx-auto space-y-6">
                <FileUpload accept={{ "application/pdf": [".pdf"] }} maxFiles={1} onFilesSelected={setFiles} label={tCommon("dropPdfHere")} />

                <div className="flex gap-3">
                    <button onClick={() => setSigMode("draw")} className={sigMode === "draw" ? "btn-primary" : "btn-secondary"}>{isHi ? "✏️ हस्ताक्षर बनाएँ" : "✏️ Draw Signature"}</button>
                    <button onClick={() => setSigMode("upload")} className={sigMode === "upload" ? "btn-primary" : "btn-secondary"}>{isHi ? "📤 हस्ताक्षर अपलोड करें" : "📤 Upload Signature"}</button>
                </div>

                {sigMode === "draw" ? (
                    <div ref={sigCanvasContainerRef}>
                        <canvas
                            ref={sigCanvasRef}
                            height={150}
                            className="w-full rounded-xl border border-white/20 cursor-crosshair"
                            style={{
                                touchAction: "none",
                                background: "repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 50% / 16px 16px",
                            }}
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={endDraw}
                            onMouseLeave={endDraw}
                        />
                        <div className="flex items-center gap-3 mt-2">
                            <button onClick={clearCanvas} className="text-sm text-indigo-400 hover:text-indigo-300">{isHi ? "साफ़ करें" : "Clear"}</button>
                            <span className="text-xs text-slate-500">{isHi ? "पारदर्शी कैनवास पर ड्रा करें — केवल आपके स्ट्रोक PDF पर दिखाई देंगे" : "Draw on the transparent canvas — only your strokes will appear on the PDF"}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <FileUpload
                            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif", ".tiff", ".heic"] }}
                            maxFiles={1}
                            onFilesSelected={(f) => setSigFile(f[0] || null)}
                            label={isHi ? "हस्ताक्षर इमेज अपलोड करें (कोई भी फ़ॉर्मेट)" : "Upload signature image (any format)"}
                            hint={isHi ? "बैकग्राउंड अपने आप हट जाएगा" : "Background will be auto-removed"}
                        />
                        {sigFile && (
                            <p className="text-xs text-slate-500">{isHi ? "✅ अपलोड हो गया: " : "✅ Uploaded: "}<span className="text-slate-300">{sigFile.name}</span>{isHi ? " — बैकग्राउंड पारदर्शी हो जाएगा" : " — background will be made transparent"}</p>
                        )}
                    </div>
                )}

                {/* Signature size + rotation — all in one row */}
                <div className="space-y-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    <label className="block text-xs text-slate-500 font-medium uppercase tracking-wide">{isHi ? "हस्ताक्षर सेटिंग्स" : "Signature Settings"}</label>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "चौड़ाई" : "Width"}</label>
                            <input type="number" value={sigSize.w} onChange={(e) => setSigSize(s => ({ ...s, w: Math.max(20, +e.target.value) }))} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "ऊँचाई" : "Height"}</label>
                            <input type="number" value={sigSize.h} onChange={(e) => setSigSize(s => ({ ...s, h: Math.max(20, +e.target.value) }))} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "रोटेशन" : "Rotation"}</label>
                            <input type="number" value={sigRotation} onChange={(e) => setSigRotation(+e.target.value)} className="input-field text-sm" min={0} max={360} />
                        </div>
                    </div>
                    {/* Rotation slider with presets */}
                    <div>
                        <input type="range" min={0} max={360} value={sigRotation} onChange={(e) => setSigRotation(+e.target.value)} className="w-full accent-indigo-500" />
                        <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                            <button onClick={() => setSigRotation(0)} className="hover:text-indigo-400">0°</button>
                            <button onClick={() => setSigRotation(90)} className="hover:text-indigo-400">90°</button>
                            <button onClick={() => setSigRotation(180)} className="hover:text-indigo-400">180°</button>
                            <button onClick={() => setSigRotation(270)} className="hover:text-indigo-400">270°</button>
                            <button onClick={() => setSigRotation(360)} className="hover:text-indigo-400">360°</button>
                        </div>
                    </div>
                </div>

                {/* PDF Preview */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-slate-400">
                                {isHi ? "PDF प्रीव्यू — " : "PDF Preview — "}<span className="text-indigo-400">{isHi ? "खिसकाने के लिए खींचें, आकार बदलने के लिए कोनों को खींचें" : "drag to move, drag corners to resize"}</span>
                            </label>
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2 text-sm">
                                    <button onClick={() => setPage(Math.max(1, page - 1))} className="btn-secondary !px-2 !py-1 text-xs" disabled={page <= 1}>◀</button>
                                    <span className="text-slate-400">{isHi ? `पेज ${page} / ${totalPages}` : `Page ${page} / ${totalPages}`}</span>
                                    <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="btn-secondary !px-2 !py-1 text-xs" disabled={page >= totalPages}>▶</button>
                                </div>
                            )}
                        </div>
                        <div ref={pdfContainerRef} className="w-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/50">
                            <canvas
                                ref={pdfCanvasRef}
                                className="w-full"
                                onMouseDown={onPdfMouseDown}
                                onMouseMove={onPdfMouseMove}
                                onMouseUp={onPdfMouseUp}
                                onMouseLeave={onPdfMouseUp}
                            />
                        </div>
                        <p className="text-xs text-slate-600">{isHi ? `जगह: (${Math.round(sigPos.x)}, ${Math.round(sigPos.y)}) • आकार: ${Math.round(sigSize.w)}×${Math.round(sigSize.h)} • रोटेशन: ${sigRotation}°` : `Position: (${Math.round(sigPos.x)}, ${Math.round(sigPos.y)}) • Size: ${Math.round(sigSize.w)}×${Math.round(sigSize.h)} • Rotation: ${sigRotation}°`}</p>
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length || !sigDataUrl} className="btn-primary w-full">{isHi ? "हस्ताक्षर जोड़ें" : "Sign PDF"}</button>
                <ProgressBar progress={progress} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {resultBlob && (
                    <div className="flex justify-center">
                        <DownloadButton onClick={() => downloadBlob(resultBlob, "signed.pdf")} label={isHi ? "हस्ताक्षरित PDF डाउनलोड करें" : "Download Signed PDF"} />
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/esign-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
