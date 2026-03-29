"use client";

import { useLocale } from "next-intl";
import { useState, useRef } from "react";
import FAQSection from "@/components/FAQSection";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";

function sanitizeSvg(svg: string): string {
    return svg
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
        .replace(/on\w+\s*=\s*'[^']*'/gi, '')
        .replace(/on\w+\s*=[^\s>]*/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/xlink:href\s*=\s*"javascript:[^"]*"/gi, '')
        .replace(/xlink:href\s*=\s*'javascript:[^']*'/gi, '');
}

const faqs = [
    { question: "What does this optimizer do?", questionHi: "यह ऑप्टिमाइज़र क्या करता है?", answer: "Vector editors like Illustrator, Sketch, or Figma often export SVGs with hidden metadata, editor-specific tags, empty groups, and overly precise decimal points. This tool strips all that away to severely reduce file size while keeping the visual identical.", answerHi: "इलस्ट्रेटर, स्केच, या फिग्मा जैसे वेक्टर संपादक अक्सर छिपे हुए मेटाडेटा, संपादक-विशिष्ट टैग, खाली समूहों और अत्यधिक सटीक दशमलव बिंदुओं के साथ SVG निर्यात करते हैं। यह उपकरण दृश्य को समान रखते हुए फ़ाइल आकार को कम करने के लिए वह सब हटा देता है।" },
    { question: "Is it safe to reduce path precision?", questionHi: "क्या पथ (Path) सटीकता कम करना सुरक्षित है?", answer: "Usually, yes. By default, editors export 6 decimal places (e.g., 10.123456). We round this to 2 places (10.12). Unless your SVG is incredibly tiny, the visual difference is perfectly negligible, but the file size savings are massive.", answerHi: "आमतौर पर, हाँ। डिफ़ॉल्ट रूप से, संपादक 6 दशमलव स्थान (उदा., 10.123456) निर्यात करते हैं। हम इसे 2 स्थानों (10.12) तक गोल करते हैं। जब तक कि आपका SVG अविश्वसनीय रूप से छोटा न हो, दृश्य अंतर पूरी तरह से नगण्य है, लेकिन फ़ाइल आकार की बचत बड़े पैमाने पर होती है।" },
    { question: "Does my SVG leave my browser?", questionHi: "क्या मेरी SVG मेरे ब्राउज़र से बाहर जाती है?", answer: "No. The parsing and cleanup is done entirely client-side using native browser DOM engines. No server interactions occur.", answerHi: "नहीं। पार्सिंग और क्लीनअप पूरी तरह से क्लाइंट-साइड नेटिव ब्राउज़र DOM इंजन का उपयोग करके किया जाता है। कोई सर्वर इंटरैक्शन नहीं होता है।" },
];

// Reusable formatBytes utility
const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function SvgOptimizerPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [inputSvg, setInputSvg] = useState("");
    const [outputSvg, setOutputSvg] = useState("");
    
    const [originalSize, setOriginalSize] = useState(0);
    const [optimizedSize, setOptimizedSize] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const [copied, setCopied] = useState(false);
    
    // Options
    const [precision, setPrecision] = useState(2);
    const [removeMetadata, setRemoveMetadata] = useState(true);
    const [removeEmptyGroups, setRemoveEmptyGroups] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "image/svg+xml" && !file.name.endsWith(".svg")) {
            setErrorMsg(isHi ? "कृपया केवल .svg फ़ाइल चुनें।" : "Please select an .svg file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const raw = e.target?.result as string;
            setInputSvg(raw);
            optimizeSvg(raw, precision, removeMetadata, removeEmptyGroups);
        };
        reader.readAsText(file);
    };

    const handlePaste = (val: string) => {
        setInputSvg(val);
        optimizeSvg(val, precision, removeMetadata, removeEmptyGroups);
    };

    // Client-side DOM SVG Parse & Cleanup
    const optimizeSvg = (raw: string, prec: number, cleanMeta: boolean, cleanGroups: boolean) => {
        setErrorMsg("");
        if (!raw.trim().startsWith("<svg") && !raw.trim().startsWith("<?xml")) {
            setOutputSvg("");
            setOriginalSize(0);
            setOptimizedSize(0);
            return;
        }

        try {
            setOriginalSize(new Blob([raw]).size);

            const parser = new DOMParser();
            const doc = parser.parseFromString(raw, "image/svg+xml");
            
            // Check for parse errors
            const parserError = doc.querySelector("parsererror");
            if (parserError) {
                setErrorMsg(isHi ? "SVG पार्स करने में त्रुटि।" : "Invalid SVG format.");
                return;
            }

            const svgElement = doc.querySelector("svg");
            if (!svgElement) {
                setErrorMsg(isHi ? "स्वच्छ SVG नहीं मिला।" : "No <svg> tag found.");
                return;
            }

            // --- 1. Strip Metadata & Comments ---
            if (cleanMeta) {
                // Remove elements
                const tagsToRemove = ['title', 'desc', 'metadata', 'defs > style:empty', 'script'];
                tagsToRemove.forEach(tag => {
                    const els = svgElement.querySelectorAll(tag);
                    els.forEach(el => el.remove());
                });

                // Remove editor specific namespaces and attributes
                ['sodipodi:docname', 'sodipodi:version', 'inkscape:version', 'inkscape:export-xdpi', 'inkscape:export-ydpi'].forEach(attr => {
                    svgElement.removeAttribute(attr);
                });
                
                // Recursively remove comments
                const removeComments = (node: ChildNode) => {
                    for (let i = node.childNodes.length - 1; i >= 0; i--) {
                        const child = node.childNodes[i];
                        if (child.nodeType === 8) { // COMMENT_NODE
                            node.removeChild(child);
                        } else if (child.nodeType === 1) { // ELEMENT_NODE
                            removeComments(child);
                        }
                    }
                };
                removeComments(svgElement);
            }

            // --- 2. Remove Empty Groups ---
            if (cleanGroups) {
                let foundEmpty = true;
                while (foundEmpty) {
                    foundEmpty = false;
                    const gs = svgElement.querySelectorAll("g");
                    gs.forEach(g => {
                        if (g.children.length === 0 && Array.from(g.attributes).every(attr => attr.name !== 'id')) {
                            g.remove();
                            foundEmpty = true;
                        }
                    });
                }
            }

            // Convert processed DOM back to string
            const serializer = new XMLSerializer();
            let optimizedRaw = serializer.serializeToString(svgElement);

            // --- 3. Number Precision Minification (Regex based) ---
            // Finds number sequences (path data, transforms) and rounds them
            const numberRegex = /([+-]?\d*\.\d+)/g;
            optimizedRaw = optimizedRaw.replace(numberRegex, (match) => {
                const num = parseFloat(match);
                if (isNaN(num)) return match;
                // Round to precision, remove trailing zeros
                return parseFloat(num.toFixed(prec)).toString();
            });

            // Minor string cleanups
            optimizedRaw = optimizedRaw
                .replace(/\n\s*\n/g, '\n') // Remove empty lines
                .replace(/\s+/g, ' ')      // Collapse multi-spaces
                .replace(/>\s+</g, '><');  // Remove space between tags

            setOutputSvg(optimizedRaw);
            setOptimizedSize(new Blob([optimizedRaw]).size);

        } catch (error) {
            console.error(error);
            setErrorMsg(isHi ? "क्षमा करें, इस SVG को प्रोसेस नहीं किया जा सका।" : "Failed to parse SVG.");
        }
    };

    // Replay optimization if options change
    const updateOptions = (prec: number, meta: boolean, groups: boolean) => {
        setPrecision(prec);
        setRemoveMetadata(meta);
        setRemoveEmptyGroups(groups);
        if (inputSvg) {
            optimizeSvg(inputSvg, prec, meta, groups);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputSvg);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadSvg = () => {
        const blob = new Blob([outputSvg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "optimized.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const savedPercent = originalSize ? Math.round(((originalSize - optimizedSize) / originalSize) * 100) : 0;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "✂️ SVG ऑप्टिमाइज़र" : "✂️ SVG Optimizer"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "डेटा को साफ़ करके और पथ सटीकता को कम करके SVG फ़ाइल का आकार कम करें" : "Reduce SVG file size by cleaning up garbage data and minifying path precision"}</p>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
                
                {/* Error Banner */}
                {errorMsg && (
                    <div className="w-full p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center font-bold">
                        {errorMsg}
                    </div>
                )}

                {/* Configuration Bar */}
                <div className="w-full glass-card flex flex-col sm:flex-row flex-wrap items-center justify-between gap-6 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-slate-300">{isHi ? "दशमलव सटीकता:" : "Path Precision:"}</label>
                        <select 
                            value={precision}
                            onChange={(e) => updateOptions(Number(e.target.value), removeMetadata, removeEmptyGroups)}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-indigo-500"
                        >
                            <option value={0}>0 (Smallest)</option>
                            <option value={1}>1</option>
                            <option value={2}>2 (Recommended)</option>
                            <option value={3}>3</option>
                            <option value={4}>4 (High)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={removeMetadata} 
                                onChange={(e) => updateOptions(precision, e.target.checked, removeEmptyGroups)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-2"
                            />
                            {isHi ? "मेटाडेटा और टिप्पणियाँ हटाएं" : "Strip Metadata & Comments"}
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={removeEmptyGroups} 
                                onChange={(e) => updateOptions(precision, removeMetadata, e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-2"
                            />
                            {isHi ? "खाली समूह (<g>) हटाएं" : "Remove Empty Groups (<g>)"}
                        </label>
                    </div>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left: Input */}
                    <div className="flex flex-col gap-4 h-[600px]">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-200">{isHi ? "कच्चा SVG दर्ज करें" : "Paste Raw SVG"}</h3>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors"
                            >
                                {isHi ? ".svg फ़ाइल अपलोड करें" : "Upload .svg File"}
                            </button>
                            <input 
                                type="file" 
                                accept=".svg,image/svg+xml" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload}
                            />
                        </div>
                        
                        <textarea
                            value={inputSvg}
                            onChange={(e) => handlePaste(e.target.value)}
                            placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...'
                            className="w-full flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-xs focus:border-indigo-500 outline-none resize-none"
                            spellCheck={false}
                        />
                        
                        {originalSize > 0 && (
                            <div className="flex justify-between text-xs font-mono text-slate-400">
                                <span>Original Size:</span>
                                <span className="font-bold text-slate-300">{formatBytes(originalSize)}</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Output */}
                    <div className="flex flex-col gap-4 h-[600px]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-slate-200">{isHi ? "ऑप्टिमाइज़ किया हुआ" : "Optimized Code"}</h3>
                                {savedPercent > 0 && (
                                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold border border-green-500/30">
                                        -{savedPercent}%
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={copyToClipboard}
                                    disabled={!outputSvg}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs transition-colors flex items-center gap-1"
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button 
                                    onClick={downloadSvg}
                                    disabled={!outputSvg}
                                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs transition-colors flex items-center gap-1"
                                >
                                    Download
                                </button>
                            </div>
                        </div>

                        <textarea
                            value={outputSvg}
                            readOnly
                            placeholder={isHi ? "परिणाम यहाँ दिखाई देगा..." : "Output will appear here..."}
                            className="w-full flex-1 bg-[#0b1021] border border-green-500/30 rounded-xl p-4 text-green-400 font-mono text-xs outline-none resize-none shadow-inner"
                        />

                        {optimizedSize > 0 && (
                            <div className="flex justify-between text-xs font-mono text-slate-400">
                                <span>Optimized Size:</span>
                                <span className="font-bold text-green-400">{formatBytes(optimizedSize)}</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Visual Verification Preview */}
                {outputSvg && (
                    <div className="w-full glass-card">
                        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-6 text-center">{isHi ? "दृश्य सत्यापन (कोई गुणवत्ता हानि नहीं दिखनी चाहिए)" : "Visual Verification Preview (Should test identical)"}</h4>
                        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
                            <div className="w-48 h-48 border border-slate-700 bg-slate-900/50 rounded-xl flex items-center justify-center p-4 shadow-inner relative">
                                <div className="absolute top-2 left-2 bg-slate-800 text-[10px] text-slate-400 px-1 rounded">Original</div>
                                <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(inputSvg) }} className="max-w-full max-h-full flex items-center justify-center opacity-80" />
                            </div>
                            
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            
                            <div className="w-48 h-48 border border-green-500/30 bg-green-900/10 rounded-xl flex items-center justify-center p-4 shadow-inner relative">
                                <div className="absolute top-2 left-2 bg-green-500/20 text-[10px] text-green-400 px-1 rounded">Optimized</div>
                                <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(outputSvg) }} className="max-w-full max-h-full flex items-center justify-center" />
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/svg-optimizer" tools={ALL_TOOLS} />
        </div>
    );
}
