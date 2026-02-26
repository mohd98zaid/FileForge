"use client";
import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";

const faqs = [
    { question: "Can I convert a URL to PDF?", questionHi: "क्या मैं URL से PDF बना सकता हूँ?", answer: "Yes! Paste the full URL and click Convert.", answerHi: "हाँ! पूरा URL डालें और कन्वर्ट करें।" },
    { question: "What page sizes are supported?", questionHi: "कौन से पेज साइज़ सपोर्ट हैं?", answer: "A4 and Letter (US) with custom margin control.", answerHi: "A4 और Letter (US) — कस्टम मार्जिन के साथ।" },
];

type PageSize = "A4" | "Letter";

export default function HtmlToPdfPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const [htmlContent, setHtmlContent] = useState("");
    const [url, setUrl] = useState("");
    const [inputMode, setInputMode] = useState<"html" | "url">("html");
    const [pageSize, setPageSize] = useState<PageSize>("A4");
    const [margin, setMargin] = useState("20");
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleConvert = async () => {
        setError(null);
        setConverting(true);
        try {
            let content = htmlContent;

            if (inputMode === "url") {
                if (!url.startsWith("http")) throw new Error("Please enter a valid URL starting with http:// or https://");
                // For URL: open in new window and trigger print
                const win = window.open(url, "_blank");
                if (!win) throw new Error("Popup blocked. Please allow popups for this site.");
                setTimeout(() => { win.print(); win.close(); setConverting(false); }, 2000);
                return;
            }

            if (!content.trim()) throw new Error("Please enter some HTML content");

            // Wrap with styling if not full HTML
            if (!content.includes("<html")) {
                content = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @page { size: ${pageSize}; margin: ${margin}mm; }
  body { font-family: Arial, sans-serif; line-height: 1.6; }
</style></head><body>${content}</body></html>`;
            }

            // Write to iframe and print
            const iframe = iframeRef.current!;
            iframe.srcdoc = content;
            await new Promise(r => { iframe.onload = r; setTimeout(r, 1000); });
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

        } catch (e: any) {
            setError(e?.message || "Conversion failed");
        } finally {
            setConverting(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "🌐 HTML से PDF" : "🌐 HTML to PDF"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "HTML कोड या URL से PDF बनाएँ" : "Convert raw HTML or a website URL to PDF"}</p>
                <div className="mt-2 bg-emerald-500/10 text-emerald-400 text-xs py-1 px-3 rounded-full inline-block">🔒 In-Browser — Uses your browser's built-in print engine</div>
            </div>

            <div className="glass-card max-w-2xl mx-auto space-y-5">
                {/* Mode Toggle */}
                <div className="flex rounded-lg overflow-hidden border border-white/10">
                    {(["html", "url"] as const).map(m => (
                        <button key={m} onClick={() => setInputMode(m)} className={`flex-1 py-2 text-sm font-medium transition-all ${inputMode === m ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                            {m === "html" ? "📝 HTML Code" : "🌐 Website URL"}
                        </button>
                    ))}
                </div>

                {inputMode === "html" ? (
                    <textarea
                        value={htmlContent}
                        onChange={e => setHtmlContent(e.target.value)}
                        placeholder={`<h1>My Document</h1>\n<p>Hello, World!</p>`}
                        className="w-full h-56 bg-black/30 text-slate-200 font-mono text-sm rounded-lg p-4 border border-white/10 focus:border-indigo-500 focus:outline-none resize-y"
                    />
                ) : (
                    <input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full bg-black/30 text-slate-200 rounded-lg px-4 py-3 border border-white/10 focus:border-indigo-500 focus:outline-none"
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">{isHi ? "पेज साइज़" : "Page Size"}</label>
                        <select value={pageSize} onChange={e => setPageSize(e.target.value as PageSize)} className="w-full bg-black/30 text-white rounded-lg px-3 py-2 border border-white/10">
                            <option value="A4">A4</option>
                            <option value="Letter">Letter</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">{isHi ? "मार्जिन (mm)" : "Margin (mm)"}</label>
                        <input type="number" value={margin} onChange={e => setMargin(e.target.value)} min={0} max={50} className="w-full bg-black/30 text-white rounded-lg px-3 py-2 border border-white/10" />
                    </div>
                </div>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">{error}</div>}

                <button onClick={handleConvert} disabled={converting} className="btn-primary w-full">
                    {converting ? (isHi ? "प्रोसेस हो रहा है..." : "Processing...") : (isHi ? "🖨️ PDF में बदलें (Print)" : "🖨️ Convert to PDF (Print dialog)")}
                </button>

                <p className="text-slate-500 text-xs text-center">{isHi ? "ब्राउज़र का प्रिंट डायलॉग खुलेगा — 'Save as PDF' चुनें" : "Your browser print dialog will open — choose 'Save as PDF'"}</p>
            </div>

            {/* Hidden iframe for HTML rendering */}
            <iframe ref={iframeRef} className="hidden" title="PDF Preview" />

            <FAQSection items={faqs} />
            <ToolLinks current="/html-to-pdf" tools={ALL_TOOLS} />
        </div>
    );
}
