"use client";

import { useLocale } from "next-intl";

import { useState, useRef, useEffect, useCallback } from "react";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { downloadBlob } from "@/lib/api";
import { ALL_TOOLS } from "@/lib/tools";

const faqs = [
    { question: "Can I flip images?", questionHi: "क्या इमेज फ़्लिप कर सकते हैं?", answer: "Yes, both horizontal and vertical flip are supported.", answerHi: "हाँ, हॉरिज़ॉन्टल और वर्टिकल दोनों तरह से फ़्लिप कर सकते हैं।" },
    { question: "Does it support free crop?", questionHi: "क्या फ़्री क्रॉप सपोर्ट है?", answer: "Yes, select a custom area and crop.", answerHi: "हाँ, कस्टम एरिया सेलेक्ट करके क्रॉप कर सकते हैं।" },
];

type Handle = "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move" | null;

export default function CropRotatePage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState<"crop" | "rotate" | "flip">("crop");
    const [cropLeft, setCropLeft] = useState(0);
    const [cropTop, setCropTop] = useState(0);
    const [cropRight, setCropRight] = useState(800);
    const [cropBottom, setCropBottom] = useState(600);
    const [angle, setAngle] = useState(90);
    const [flipDir, setFlipDir] = useState<"horizontal" | "vertical">("horizontal");
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
    const [canvasScale, setCanvasScale] = useState(1);

    // Interaction state
    const [activeHandle, setActiveHandle] = useState<Handle>(null);
    const [dragAnchor, setDragAnchor] = useState({ x: 0, y: 0 });
    const [dragInitCrop, setDragInitCrop] = useState({ l: 0, t: 0, r: 800, b: 600 });

    const HANDLE_SIZE = 8; // px on canvas

    useEffect(() => {
        if (!files.length) { setImgEl(null); return; }
        const img = new Image();
        img.onload = () => {
            setImgEl(img);
            setCropLeft(0);
            setCropTop(0);
            setCropRight(img.naturalWidth);
            setCropBottom(img.naturalHeight);
        };
        img.src = URL.createObjectURL(files[0]);
        return () => URL.revokeObjectURL(img.src);
    }, [files]);

    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imgEl) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const maxW = canvas.parentElement?.clientWidth || 600;
        const scale = Math.min(1, maxW / imgEl.naturalWidth);
        const cw = Math.round(imgEl.naturalWidth * scale);
        const ch = Math.round(imgEl.naturalHeight * scale);

        canvas.width = cw;
        canvas.height = ch;
        setCanvasScale(scale);

        ctx.drawImage(imgEl, 0, 0, cw, ch);

        // Darken outside crop
        const sl = cropLeft * scale, st = cropTop * scale;
        const sw = (cropRight - cropLeft) * scale, sh = (cropBottom - cropTop) * scale;

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, cw, st);
        ctx.fillRect(0, st + sh, cw, ch - st - sh);
        ctx.fillRect(0, st, sl, sh);
        ctx.fillRect(sl + sw, st, cw - sl - sw, sh);

        // Border
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(sl, st, sw, sh);
        ctx.setLineDash([]);

        // Rule of thirds grid
        ctx.strokeStyle = "rgba(99,102,241,0.25)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(sl + (sw * i) / 3, st);
            ctx.lineTo(sl + (sw * i) / 3, st + sh);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(sl, st + (sh * i) / 3);
            ctx.lineTo(sl + sw, st + (sh * i) / 3);
            ctx.stroke();
        }

        // Resize handles (8 points)
        const hs = HANDLE_SIZE;
        ctx.fillStyle = "#6366f1";
        const handles = [
            [sl, st], [sl + sw, st], [sl, st + sh], [sl + sw, st + sh], // corners
            [sl + sw / 2, st], [sl + sw / 2, st + sh], // top/bottom center
            [sl, st + sh / 2], [sl + sw, st + sh / 2], // left/right center
        ];
        for (const [hx, hy] of handles) {
            ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
        }

        // Dimension label
        const label = `${Math.round(cropRight - cropLeft)} × ${Math.round(cropBottom - cropTop)}`;
        ctx.font = "12px sans-serif";
        const tw = ctx.measureText(label).width + 12;
        const lx = sl + sw / 2 - tw / 2;
        const ly = st - 8;
        ctx.fillStyle = "rgba(99,102,241,0.9)";
        ctx.fillRect(lx, ly - 14, tw, 18);
        ctx.fillStyle = "#fff";
        ctx.fillText(label, lx + 6, ly - 1);
    }, [imgEl, cropLeft, cropTop, cropRight, cropBottom]);

    useEffect(() => { drawCanvas(); }, [drawCanvas]);

    useEffect(() => {
        const container = canvasRef.current?.parentElement;
        if (!container) return;
        const ro = new ResizeObserver(() => drawCanvas());
        ro.observe(container);
        return () => ro.disconnect();
    }, [drawCanvas]);

    const toImgCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width) / canvasScale,
            y: (e.clientY - rect.top) * (canvas.height / rect.height) / canvasScale,
        };
    };

    const detectHandle = (mx: number, my: number): Handle => {
        const tol = 12 / canvasScale; // tolerance in image pixels
        const cl = cropLeft, ct = cropTop, cr = cropRight, cb = cropBottom;

        // Corners
        if (Math.abs(mx - cl) < tol && Math.abs(my - ct) < tol) return "tl";
        if (Math.abs(mx - cr) < tol && Math.abs(my - ct) < tol) return "tr";
        if (Math.abs(mx - cl) < tol && Math.abs(my - cb) < tol) return "bl";
        if (Math.abs(mx - cr) < tol && Math.abs(my - cb) < tol) return "br";
        // Edges
        if (Math.abs(my - ct) < tol && mx > cl + tol && mx < cr - tol) return "t";
        if (Math.abs(my - cb) < tol && mx > cl + tol && mx < cr - tol) return "b";
        if (Math.abs(mx - cl) < tol && my > ct + tol && my < cb - tol) return "l";
        if (Math.abs(mx - cr) < tol && my > ct + tol && my < cb - tol) return "r";
        // Inside = move
        if (mx >= cl && mx <= cr && my >= ct && my <= cb) return "move";
        return null;
    };

    const getCursor = (h: Handle): string => {
        switch (h) {
            case "tl": case "br": return "nwse-resize";
            case "tr": case "bl": return "nesw-resize";
            case "t": case "b": return "ns-resize";
            case "l": case "r": return "ew-resize";
            case "move": return "move";
            default: return "crosshair";
        }
    };

    const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (mode !== "crop" || !imgEl) return;
        const p = toImgCoords(e);
        const h = detectHandle(p.x, p.y);
        if (h) {
            // Resize/move existing selection
            setActiveHandle(h);
            setDragAnchor(p);
            setDragInitCrop({ l: cropLeft, t: cropTop, r: cropRight, b: cropBottom });
        } else {
            // Start a new crop selection
            setActiveHandle("br");
            setCropLeft(Math.round(p.x));
            setCropTop(Math.round(p.y));
            setCropRight(Math.round(p.x));
            setCropBottom(Math.round(p.y));
            setDragAnchor(p);
            setDragInitCrop({ l: Math.round(p.x), t: Math.round(p.y), r: Math.round(p.x), b: Math.round(p.y) });
        }
    };

    const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!imgEl) return;
        const p = toImgCoords(e);

        // Update cursor
        if (!activeHandle) {
            const h = detectHandle(p.x, p.y);
            const canvas = canvasRef.current;
            if (canvas) canvas.style.cursor = getCursor(h);
            return;
        }

        const dx = p.x - dragAnchor.x;
        const dy = p.y - dragAnchor.y;
        const { l, t, r, b } = dragInitCrop;
        const W = imgEl.naturalWidth, H = imgEl.naturalHeight;

        let nl = cropLeft, nt = cropTop, nr = cropRight, nb = cropBottom;

        switch (activeHandle) {
            case "move": {
                const sw = r - l, sh = b - t;
                nl = Math.max(0, Math.min(W - sw, l + dx));
                nt = Math.max(0, Math.min(H - sh, t + dy));
                nr = nl + sw;
                nb = nt + sh;
                break;
            }
            case "tl": nl = Math.max(0, Math.min(r - 10, l + dx)); nt = Math.max(0, Math.min(b - 10, t + dy)); nr = r; nb = b; break;
            case "tr": nr = Math.min(W, Math.max(l + 10, r + dx)); nt = Math.max(0, Math.min(b - 10, t + dy)); nl = l; nb = b; break;
            case "bl": nl = Math.max(0, Math.min(r - 10, l + dx)); nb = Math.min(H, Math.max(t + 10, b + dy)); nr = r; nt = t; break;
            case "br": nr = Math.min(W, Math.max(l + 10, r + dx)); nb = Math.min(H, Math.max(t + 10, b + dy)); nl = l; nt = t; break;
            case "t": nt = Math.max(0, Math.min(b - 10, t + dy)); nl = l; nr = r; nb = b; break;
            case "b": nb = Math.min(H, Math.max(t + 10, b + dy)); nl = l; nr = r; nt = t; break;
            case "l": nl = Math.max(0, Math.min(r - 10, l + dx)); nt = t; nr = r; nb = b; break;
            case "r": nr = Math.min(W, Math.max(l + 10, r + dx)); nl = l; nt = t; nb = b; break;
        }

        setCropLeft(Math.round(nl));
        setCropTop(Math.round(nt));
        setCropRight(Math.round(nr));
        setCropBottom(Math.round(nb));
    };

    const onMouseUp = () => setActiveHandle(null);

    const handleProcess = async () => {
        if (!files.length || !imgEl) return;
        setError(null);
        setResultBlob(null);
        setProgress(10);
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            if (mode === "crop") {
                const w = cropRight - cropLeft;
                const h = cropBottom - cropTop;
                // Ensure valid dimensions
                if (w <= 0 || h <= 0) throw new Error("Invalid crop dimensions");

                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(imgEl, cropLeft, cropTop, w, h, 0, 0, w, h);
            } else if (mode === "rotate") {
                const rad = angle * Math.PI / 180;
                const sin = Math.abs(Math.sin(rad));
                const cos = Math.abs(Math.cos(rad));
                const w = imgEl.naturalWidth;
                const h = imgEl.naturalHeight;
                const newW = Math.round(w * cos + h * sin);
                const newH = Math.round(w * sin + h * cos);

                canvas.width = newW;
                canvas.height = newH;

                ctx.translate(newW / 2, newH / 2);
                ctx.rotate(rad);
                ctx.drawImage(imgEl, -w / 2, -h / 2);
            } else if (mode === "flip") {
                canvas.width = imgEl.naturalWidth;
                canvas.height = imgEl.naturalHeight;
                if (flipDir === "horizontal") {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                } else {
                    ctx.translate(0, canvas.height);
                    ctx.scale(1, -1);
                }
                ctx.drawImage(imgEl, 0, 0);
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    setResultBlob(blob);
                    setProgress(100);
                } else {
                    setError(isHi ? "इमेज बनाना विफल।" : "Failed to generate image.");
                    setProgress(0);
                }
            }, 'image/jpeg', 0.95);

        } catch (e: any) {
            setError(e?.message || (isHi ? "प्रक्रिया विफल रही।" : "Operation failed."));
            setProgress(0);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✂️ क्रॉप / रोटेट / फ़्लिप" : "✂️ Crop / Rotate / Flip"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "इमेज क्रॉप, रोटेट या फ़्लिप करें" : "Crop, rotate, or flip your images"}</p>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-6">
                <FileUpload maxFiles={1} onFilesSelected={setFiles} label={isHi ? "यहाँ इमेज ड्रॉप करें" : "Drop image here"} />

                <div className="flex gap-3">
                    <button onClick={() => setMode("crop")} className={mode === "crop" ? "btn-primary" : "btn-secondary"}>{isHi ? "✂️ क्रॉप" : "✂️ Crop"}</button>
                    <button onClick={() => setMode("rotate")} className={mode === "rotate" ? "btn-primary" : "btn-secondary"}>{isHi ? "🔄 रोटेट" : "🔄 Rotate"}</button>
                    <button onClick={() => setMode("flip")} className={mode === "flip" ? "btn-primary" : "btn-secondary"}>{isHi ? "↔ फ़्लिप" : "↔ Flip"}</button>
                </div>

                {/* Interactive crop canvas */}
                {imgEl && mode === "crop" && (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500">{isHi ? "चुनने के लिए खींचें। आकार बदलने के लिए कोनों/किनारों को खींचें। घुमाने के लिए अंदर खींचें।" : "Drag to select. Drag corners/edges to resize. Drag inside to move."}</p>
                        <div className="w-full overflow-hidden rounded-lg border border-slate-700/50">
                            <canvas
                                ref={canvasRef}
                                className="w-full"
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                onMouseLeave={onMouseUp}
                            />
                        </div>
                    </div>
                )}

                {mode === "crop" && (
                    <div className="grid grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "बाएँ" : "Left"}</label>
                            <input type="number" value={cropLeft} onChange={(e) => setCropLeft(+e.target.value)} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "ऊपर" : "Top"}</label>
                            <input type="number" value={cropTop} onChange={(e) => setCropTop(+e.target.value)} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "दाएँ" : "Right"}</label>
                            <input type="number" value={cropRight} onChange={(e) => setCropRight(+e.target.value)} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">{isHi ? "नीचे" : "Bottom"}</label>
                            <input type="number" value={cropBottom} onChange={(e) => setCropBottom(+e.target.value)} className="input-field text-sm" />
                        </div>
                    </div>
                )}
                {/* Real-time preview for rotate/flip */}
                {imgEl && mode !== "crop" && (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500">
                            {mode === "rotate" ? (isHi ? "नीचे कोण समायोजित करें — रीयल-टाइम में पूर्वावलोकन" : "Adjust the angle below — preview updates in real time") : (isHi ? "फ़्लिप दिशा चुनें — रीयल-टाइम में पूर्वावलोकन" : "Select flip direction — preview updates in real time")}
                        </p>
                        <div className="w-full overflow-hidden rounded-lg border border-slate-700/50 flex items-center justify-center bg-slate-800/50 p-4"
                            style={{ minHeight: 200 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={URL.createObjectURL(files[0])}
                                alt="Preview"
                                className="max-w-full max-h-64 object-contain transition-transform duration-200"
                                style={{
                                    transform: mode === "rotate"
                                        ? `rotate(${angle}deg)`
                                        : flipDir === "horizontal"
                                            ? "scaleX(-1)"
                                            : "scaleY(-1)",
                                }}
                            />
                        </div>
                    </div>
                )}

                {mode === "rotate" && (
                    <div className="space-y-2">
                        <label className="block text-sm text-slate-400">{isHi ? "कोण:" : "Angle:"} <span className="text-indigo-400 font-semibold">{angle}°</span></label>
                        <div className="flex gap-2 mb-2">
                            {[0, 90, 180, 270].map((a) => (
                                <button key={a} onClick={() => setAngle(a)} className={angle === a ? "btn-primary !px-3 !py-1 text-sm" : "btn-secondary !px-3 !py-1 text-sm"}>{a}°</button>
                            ))}
                        </div>
                        <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full accent-indigo-500" />
                        <div className="flex justify-between text-xs text-slate-600"><span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span></div>
                        <input type="number" value={angle} onChange={(e) => setAngle(+e.target.value)} className="input-field" placeholder={isHi ? "कस्टम कोण" : "Custom angle"} />
                    </div>
                )}
                {mode === "flip" && (
                    <div className="flex gap-3">
                        <button onClick={() => setFlipDir("horizontal")} className={flipDir === "horizontal" ? "btn-primary" : "btn-secondary"}>{isHi ? "↔ क्षैतिज" : "↔ Horizontal"}</button>
                        <button onClick={() => setFlipDir("vertical")} className={flipDir === "vertical" ? "btn-primary" : "btn-secondary"}>{isHi ? "↕ लंबवत" : "↕ Vertical"}</button>
                    </div>
                )}

                <button onClick={handleProcess} disabled={!files.length} className="btn-primary w-full">{isHi ? "लागू करें" : "Apply"}</button>
                <ProgressBar progress={progress} label={isHi ? "प्रोसेस हो रहा है..." : "Processing..."} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {resultBlob && (
                    <div className="space-y-3">
                        {/* Result preview */}
                        <div className="w-full rounded-lg border border-slate-700/50 overflow-hidden bg-slate-800/30 flex items-center justify-center p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={URL.createObjectURL(resultBlob)} alt="Result" className="max-w-full max-h-72 object-contain rounded" />
                        </div>
                        <div className="flex justify-center">
                            <DownloadButton onClick={() => downloadBlob(resultBlob, "edited_image.jpg")} label={isHi ? "परिणाम डाउनलोड करें" : "Download Result"} />
                        </div>
                    </div>
                )}
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/crop-rotate" tools={ALL_TOOLS} />
        </div>
    );
}
