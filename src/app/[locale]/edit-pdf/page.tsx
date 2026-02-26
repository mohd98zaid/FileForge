"use client";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

// ── Types ────────────────────────────────────────────────────────────────────
type ToolMode = "select" | "text" | "draw" | "rect" | "ellipse" | "line" | "arrow" | "highlight" | "whiteout" | "image" | "signature";

interface PageState {
    pageNum: number;
    width: number;
    height: number;
}

// ── Sidebar tool button ───────────────────────────────────────────────────────
function ToolBtn({
    icon, label, active, onClick,
}: {
    icon: string; label: string; active?: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            title={label}
            className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-xs transition-all select-none
                ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-400 hover:text-white hover:bg-white/10 active:bg-white/20"}`}
        >
            <span className="text-lg leading-none">{icon}</span>
            <span className="leading-none whitespace-nowrap hidden sm:block">{label}</span>
        </button>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageState[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<ToolMode>("select");
    const [color, setColor] = useState("#1e3a8a");
    const [fontSize, setFontSize] = useState(16);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [opacity, setOpacity] = useState(100);
    const [zoom, setZoom] = useState(1);
    const [currentPageIdx, setCurrentPageIdx] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showProps, setShowProps] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const fabricRefs = useRef<Record<number, any>>({});
    const pdfDocRef = useRef<any>(null);

    // ── Load PDF ─────────────────────────────────────────────────────────────
    const loadPdf = async (f: File) => {
        setLoading(true); setError(null); setPages([]);
        try {
            const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
            GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url
            ).toString();
            const doc = await getDocument({ data: await f.arrayBuffer() }).promise;
            pdfDocRef.current = doc;
            const newPages: PageState[] = [];
            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const vp = page.getViewport({ scale: 1.5 });
                newPages.push({ pageNum: i, width: vp.width, height: vp.height });
            }
            setPages(newPages);
        } catch (e: any) { setError("Failed to load PDF: " + e.message); }
        finally { setLoading(false); }
    };

    // ── Init Fabric per page ─────────────────────────────────────────────────
    const initPageCanvas = useCallback(async (pageNum: number, wrapperEl: HTMLDivElement) => {
        if (fabricRefs.current[pageNum] || !pdfDocRef.current) return;

        const { Canvas: FabricCanvas, PencilBrush, FabricImage: FabricImgCls } = await import("fabric");

        // Render PDF page to offscreen canvas
        const page = await pdfDocRef.current.getPage(pageNum);
        const vp = page.getViewport({ scale: 1.5 });
        const offscreen = document.createElement("canvas");
        offscreen.width = vp.width; offscreen.height = vp.height;
        await page.render({ canvasContext: offscreen.getContext("2d")!, viewport: vp }).promise;
        const bgDataUrl = offscreen.toDataURL("image/jpeg", 0.92);

        // Create a real canvas element inside wrapper
        const canvasEl = document.createElement("canvas");
        canvasEl.width = vp.width; canvasEl.height = vp.height;
        // Touch: prevent browser scroll/zoom while drawing
        canvasEl.style.touchAction = "none";
        canvasEl.style.display = "block";
        canvasEl.style.maxWidth = "100%";
        wrapperEl.appendChild(canvasEl);

        const fc = new FabricCanvas(canvasEl, {
            width: vp.width,
            height: vp.height,
            selection: true,
            allowTouchScrolling: false,   // prevents page scroll during draw
        });

        // Set PDF page as background
        FabricImgCls.fromURL(bgDataUrl).then(img => {
            fc.backgroundImage = img;
            fc.renderAll();
        });

        // Pencil brush (works with touch + mouse)
        const brush = new PencilBrush(fc);
        brush.color = color;
        brush.width = strokeWidth;
        fc.freeDrawingBrush = brush;

        fabricRefs.current[pageNum] = fc;
    }, []); // eslint-disable-line

    const setWrapperRef = useCallback((pageNum: number, el: HTMLDivElement | null) => {
        if (el && !fabricRefs.current[pageNum]) {
            initPageCanvas(pageNum, el);
        }
    }, [initPageCanvas]);

    // ── Sync tool to all fabric canvases ──────────────────────────────────────
    useEffect(() => {
        Object.values(fabricRefs.current).forEach((fc: any) => {
            if (!fc) return;
            fc.isDrawingMode = mode === "draw" || mode === "signature";
            fc.selection = mode === "select";
            if (fc.freeDrawingBrush) {
                fc.freeDrawingBrush.color = mode === "signature" ? "#1e40af" : color;
                fc.freeDrawingBrush.width = mode === "signature" ? 2 : strokeWidth;
            }
        });
    }, [mode, color, strokeWidth]);

    // ── Active canvas helper ──────────────────────────────────────────────────
    const getFC = () => fabricRefs.current[currentPageIdx + 1];

    // ── Add objects ───────────────────────────────────────────────────────────
    const addText = useCallback(async () => {
        const fc = getFC(); if (!fc) return;
        const { IText } = await import("fabric");
        const t = new IText(isHi ? "यहाँ टाइप करें" : "Type here", {
            left: fc.width! / 2 - 60, top: fc.height! / 2 - 12,
            fontSize, fill: color, fontFamily: "Arial", opacity: opacity / 100,
        });
        fc.add(t); fc.setActiveObject(t); t.enterEditing(); fc.renderAll();
    }, [currentPageIdx, fontSize, color, opacity, isHi]);

    const addShape = useCallback(async (type: "rect" | "ellipse") => {
        const fc = getFC(); if (!fc) return;
        const { Rect, Ellipse } = await import("fabric");
        const obj = type === "rect"
            ? new Rect({ left: fc.width! / 2 - 60, top: fc.height! / 2 - 40, width: 120, height: 80, fill: "transparent", stroke: color, strokeWidth, opacity: opacity / 100 })
            : new Ellipse({ left: fc.width! / 2 - 60, top: fc.height! / 2 - 40, rx: 60, ry: 40, fill: "transparent", stroke: color, strokeWidth, opacity: opacity / 100 });
        fc.add(obj); fc.setActiveObject(obj); fc.renderAll();
    }, [currentPageIdx, color, strokeWidth, opacity]);

    const addLine = useCallback(async (withArrow: boolean) => {
        const fc = getFC(); if (!fc) return;
        const { Line, Triangle, Group } = await import("fabric");
        const line = new Line([50, fc.height! / 2, fc.width! - 50, fc.height! / 2], { stroke: color, strokeWidth, opacity: opacity / 100 });
        if (withArrow) {
            const head = new Triangle({ width: 12, height: 16, fill: color, left: fc.width! - 50, top: fc.height! / 2 - 8, angle: 90 });
            fc.add(new Group([line, head]));
        } else { fc.add(line); }
        fc.renderAll();
    }, [currentPageIdx, color, strokeWidth, opacity]);

    const addHighlight = useCallback(async () => {
        const fc = getFC(); if (!fc) return;
        const { Rect } = await import("fabric");
        const r = new Rect({ left: fc.width! / 2 - 100, top: fc.height! / 2 - 12, width: 200, height: 24, fill: color, stroke: "transparent", opacity: 0.35 });
        fc.add(r); fc.setActiveObject(r); fc.renderAll();
    }, [currentPageIdx, color]);

    const addWhiteout = useCallback(async () => {
        const fc = getFC(); if (!fc) return;
        const { Rect } = await import("fabric");
        const r = new Rect({ left: fc.width! / 2 - 80, top: fc.height! / 2 - 16, width: 160, height: 32, fill: "white", stroke: "transparent", opacity: 1 });
        fc.add(r); fc.setActiveObject(r); fc.renderAll();
    }, [currentPageIdx]);

    const addImage = useCallback(async (imgFile: File) => {
        const fc = getFC(); if (!fc) return;
        const { FabricImage } = await import("fabric");
        const url = URL.createObjectURL(imgFile);
        const img = await FabricImage.fromURL(url);
        const scale = Math.min((fc.width! * 0.5) / img.width!, (fc.height! * 0.5) / img.height!);
        img.scale(scale);
        img.set({ left: fc.width! / 2 - (img.width! * scale) / 2, top: fc.height! / 2 - (img.height! * scale) / 2, opacity: opacity / 100 });
        fc.add(img); fc.setActiveObject(img); fc.renderAll();
        URL.revokeObjectURL(url);
    }, [currentPageIdx, opacity]);

    const deleteSelected = () => {
        const fc = getFC(); if (!fc) return;
        const obj = fc.getActiveObject();
        if (obj) { fc.remove(obj); fc.discardActiveObject(); fc.renderAll(); }
    };

    const undo = () => {
        const fc = getFC(); if (!fc) return;
        const objs = fc.getObjects();
        if (objs.length) { fc.remove(objs[objs.length - 1]); fc.renderAll(); }
    };

    // ── Tool click dispatcher ──────────────────────────────────────────────────
    const handleTool = (tool: ToolMode) => {
        setMode(tool);
        if (tool === "text") addText();
        else if (tool === "rect") addShape("rect");
        else if (tool === "ellipse") addShape("ellipse");
        else if (tool === "line") addLine(false);
        else if (tool === "arrow") addLine(true);
        else if (tool === "highlight") addHighlight();
        else if (tool === "whiteout") addWhiteout();
        else if (tool === "image") imageInputRef.current?.click();
        // draw/signature/select: just mode change → handled in useEffect
    };

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!file) return;
        setSaving(true); setError(null);
        try {
            const { PDFDocument } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
            const pdfPages = pdfDoc.getPages();
            for (const [pgStr, fc] of Object.entries(fabricRefs.current)) {
                const pg = parseInt(pgStr);
                if (!fc) continue;
                const pdfPage = pdfPages[pg - 1]; if (!pdfPage) continue;
                const savedBg = fc.backgroundImage;
                fc.backgroundImage = undefined as any;
                fc.renderAll();
                const dataUrl = fc.toDataURL({ format: "png", multiplier: 1 });
                fc.backgroundImage = savedBg; fc.renderAll();
                const bytes = Uint8Array.from(atob(dataUrl.split(",")[1]), c => c.charCodeAt(0));
                const png = await pdfDoc.embedPng(bytes);
                const { width: w, height: h } = pdfPage.getSize();
                pdfPage.drawImage(png, { x: 0, y: 0, width: w, height: h });
            }
            const out = await pdfDoc.save();
            const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `edited_${file.name}`; a.click();
            URL.revokeObjectURL(url);
        } catch (e: any) { setError("Save failed: " + e.message); }
        finally { setSaving(false); }
    };

    // ── Tool palette config ───────────────────────────────────────────────────
    const tools: { mode: ToolMode; icon: string; label: string }[] = [
        { mode: "select", icon: "↖", label: "Select" },
        { mode: "text", icon: "T", label: "Text" },
        { mode: "draw", icon: "🖊️", label: "Draw" },
        { mode: "signature", icon: "✒️", label: "Sign" },
        { mode: "rect", icon: "▭", label: "Rect" },
        { mode: "ellipse", icon: "○", label: "Circle" },
        { mode: "line", icon: "—", label: "Line" },
        { mode: "arrow", icon: "→", label: "Arrow" },
        { mode: "highlight", icon: "🟡", label: "Highlight" },
        { mode: "whiteout", icon: "⬜", label: "Whiteout" },
        { mode: "image", icon: "🖼️", label: "Image" },
    ];

    // ── Upload screen ─────────────────────────────────────────────────────────
    if (!file) {
        return (
            <div className="animate-fade-in space-y-8">
                <div className="text-center">
                    <h1 className="section-title">{isHi ? "✏️ PDF एडिटर" : "✏️ PDF Editor"}</h1>
                    <p className="mt-2 text-slate-400">{isHi ? "टेक्स्ट, शेप, हाइलाइट, हस्ताक्षर — टच या माउस से" : "Text · Shapes · Highlights · Sign · Draw — works on touch & mouse"}</p>
                </div>
                <label className="flex flex-col items-center justify-center h-64 max-w-xl mx-auto border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/3 transition-all group">
                    <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">📄</span>
                    <span className="text-slate-300 font-semibold text-lg">{isHi ? "PDF चुनें या यहाँ खींचें" : "Choose or drop a PDF"}</span>
                    <span className="text-slate-500 text-sm mt-2">100% in-browser · never uploaded</span>
                    <input type="file" accept=".pdf" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); loadPdf(f); } }} />
                </label>
                <ToolLinks current="/edit-pdf" tools={ALL_TOOLS} />
            </div>
        );
    }

    // ── Editor ────────────────────────────────────────────────────────────────
    return (
        <div className="animate-fade-in -mx-4 sm:-mx-6 lg:-mx-8">
            {/* ── Top bar (mobile + desktop) ── */}
            <div className="sticky top-16 z-40 flex items-center justify-between gap-2 bg-slate-900/95 backdrop-blur border-b border-white/10 px-3 py-2">
                <button onClick={() => { setFile(null); setPages([]); fabricRefs.current = {}; pdfDocRef.current = null; }}
                    className="text-slate-400 hover:text-white text-sm shrink-0">← {isHi ? "नई PDF" : "New"}</button>

                <span className="text-sm text-slate-400 truncate hidden sm:block">
                    {isHi ? `पेज ${currentPageIdx + 1}/${pages.length}` : `Page ${currentPageIdx + 1} of ${pages.length}`}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Color */}
                    <input type="color" value={color} onChange={e => setColor(e.target.value)}
                        title="Color" className="w-8 h-8 rounded border-0 cursor-pointer" />
                    {/* Props toggle (mobile) */}
                    <button onClick={() => setShowProps(v => !v)}
                        className="sm:hidden px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-400">⚙️</button>
                    <button onClick={handleSave} disabled={saving}
                        className="btn-primary text-sm py-1.5 px-4">
                        {saving ? "..." : (isHi ? "💾 सेव" : "💾 Save")}
                    </button>
                </div>
            </div>

            {/* ── Properties panel (collapsible on mobile) ── */}
            {showProps && (
                <div className="sm:hidden bg-slate-900/95 border-b border-white/10 px-4 py-3 grid grid-cols-3 gap-4 text-xs">
                    <div>
                        <label className="text-slate-500 block mb-1">Font {fontSize}px</label>
                        <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="text-slate-500 block mb-1">Stroke {strokeWidth}px</label>
                        <input type="range" min={1} max={12} value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                        <label className="text-slate-500 block mb-1">Opacity {opacity}%</label>
                        <input type="range" min={10} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-indigo-500" />
                    </div>
                </div>
            )}

            <div className="flex">
                {/* ── LEFT sidebar — desktop only ── */}
                <aside className="hidden sm:flex w-16 shrink-0 flex-col items-center py-3 gap-1 bg-slate-900/80 border-r border-white/10 sticky top-[7.5rem] h-[calc(100vh-7.5rem)] overflow-y-auto">
                    {tools.map(t => (
                        <ToolBtn key={t.mode} icon={t.icon} label={t.label} active={mode === t.mode} onClick={() => handleTool(t.mode)} />
                    ))}
                    <div className="w-10 border-t border-white/10 my-1" />
                    <ToolBtn icon="↩" label="Undo" onClick={undo} />
                    <ToolBtn icon="🗑" label="Delete" onClick={deleteSelected} />
                </aside>

                {/* ── CANVAS AREA ── */}
                <div className="flex-1 overflow-auto bg-slate-950 min-h-[calc(100vh-10rem)]">
                    {loading && (
                        <div className="flex items-center justify-center h-48 gap-3">
                            <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            <span className="text-slate-400">{isHi ? "लोड हो रहा है..." : "Loading..."}</span>
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-8 py-6 px-2">
                        {pages.map((p, idx) => (
                            <div
                                key={p.pageNum}
                                id={`page-${p.pageNum}`}
                                onClick={() => setCurrentPageIdx(idx)}
                                className={`relative shadow-2xl rounded-sm ${currentPageIdx === idx ? "ring-2 ring-indigo-500/60" : ""}`}
                                style={{ transform: `scale(${zoom})`, transformOrigin: "top center", maxWidth: "100%" }}
                            >
                                {/* Wrapper where Fabric mounts its canvas */}
                                <div
                                    ref={el => setWrapperRef(p.pageNum, el as HTMLDivElement | null)}
                                    style={{ width: p.width, height: p.height, maxWidth: "100%", touchAction: "none" }}
                                />
                                <div className="absolute -bottom-5 left-0 right-0 text-center pointer-events-none">
                                    <span className="text-xs text-slate-600">{isHi ? `पेज ${p.pageNum}` : `Page ${p.pageNum}`}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT sidebar — desktop only ── */}
                <aside className="hidden sm:flex w-48 shrink-0 flex-col gap-4 px-3 py-3 bg-slate-900/80 border-l border-white/10 sticky top-[7.5rem] h-[calc(100vh-7.5rem)] overflow-y-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Properties</p>
                    <div>
                        <label className="text-xs text-slate-400">Font {fontSize}px</label>
                        <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full h-1.5 accent-indigo-500 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Stroke {strokeWidth}px</label>
                        <input type="range" min={1} max={12} value={strokeWidth} onChange={e => setStrokeWidth(+e.target.value)} className="w-full h-1.5 accent-indigo-500 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Opacity {opacity}%</label>
                        <input type="range" min={10} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full h-1.5 accent-indigo-500 mt-1" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400">Zoom {Math.round(zoom * 100)}%</label>
                        <div className="flex gap-1 mt-1">
                            <button onClick={() => setZoom(z => Math.max(0.4, +(z - 0.1).toFixed(1)))} className="flex-1 bg-white/5 hover:bg-white/10 rounded text-slate-400 text-sm py-0.5">−</button>
                            <button onClick={() => setZoom(1)} className="flex-1 bg-white/5 hover:bg-white/10 rounded text-slate-500 text-xs py-0.5">1:1</button>
                            <button onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(1)))} className="flex-1 bg-white/5 hover:bg-white/10 rounded text-slate-400 text-sm py-0.5">+</button>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pages</p>
                        <div className="space-y-1">
                            {pages.map((p, idx) => (
                                <button key={p.pageNum} onClick={() => {
                                    setCurrentPageIdx(idx);
                                    document.getElementById(`page-${p.pageNum}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                }} className={`w-full text-left text-xs px-2 py-1.5 rounded transition-all ${currentPageIdx === idx ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/10"}`}>
                                    Page {p.pageNum}
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-xs">{error}</div>}
                </aside>
            </div>

            {/* ── BOTTOM TOOLBAR — mobile only ── */}
            <div className="sm:hidden sticky bottom-0 z-40 bg-slate-900/98 border-t border-white/10 backdrop-blur">
                <div className="flex overflow-x-auto gap-1 px-2 py-2 no-scrollbar">
                    {tools.map(t => (
                        <button key={t.mode} onClick={() => handleTool(t.mode)}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs shrink-0 transition-all active:scale-95
                                ${mode === t.mode ? "bg-indigo-600 text-white" : "text-slate-400 bg-white/5"}`}>
                            <span className="text-lg">{t.icon}</span>
                            <span className="text-[10px]">{t.label}</span>
                        </button>
                    ))}
                    <div className="w-px bg-white/10 mx-1 shrink-0" />
                    <button onClick={undo} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs shrink-0 text-slate-400 bg-white/5 active:scale-95">
                        <span className="text-lg">↩</span><span className="text-[10px]">Undo</span>
                    </button>
                    <button onClick={deleteSelected} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs shrink-0 text-slate-400 bg-white/5 active:scale-95">
                        <span className="text-lg">🗑</span><span className="text-[10px]">Delete</span>
                    </button>
                </div>
            </div>

            {/* Hidden inputs */}
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) addImage(f); }} />
        </div>
    );
}
