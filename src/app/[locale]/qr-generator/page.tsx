"use client";

import { useLocale } from "next-intl";

import { useState, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import { downloadFromUrl } from "@/lib/api";

const faqs = [
    { question: "Is this free to use?", questionHi: "क्या यह मुफ़्त है?", answer: "Yes, 100% free with no limits.", answerHi: "हाँ, 100% मुफ़्त, कोई लिमिट नहीं।" },
    { question: "Does it work for WiFi?", questionHi: "क्या WiFi के लिए काम करता है?", answer: "Yes! Use the 'WiFi' tab to generate a code that connects devices to your network instantly.", answerHi: "हाँ! WiFi टैब से कोड बनाएँ जो डिवाइस को सीधे नेटवर्क से जोड़ देता है।" },
    { question: "Can I add a logo?", questionHi: "क्या लोगो लगा सकते हैं?", answer: "Absolutely. Upload your logo and it will be centered in the QR code.", answerHi: "बिल्कुल! अपना लोगो अपलोड करें, यह QR कोड के बीच में आ जाएगा।" },
];

export default function QrGeneratorPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [text, setText] = useState("https://file-forge-frontend.vercel.app");
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [logo, setLogo] = useState<string | undefined>(undefined);
    const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");
    const [size, setSize] = useState(300);
    const [padding, setPadding] = useState(10);
    const qrRef = useRef<any>(null);

    const handleDownload = (format: "png" | "jpg") => {
        const canvas = document.getElementById("react-qrcode-logo") as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL(`image/${format}`);
            downloadFromUrl(url, `qrcode.${format}`);
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setLogo(ev.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="section-title">{isHi ? "📱 QR कोड बनाएँ" : "📱 Custom QR Code Generator"}</h1>
                <p className="mt-2 text-slate-400">{isHi ? "अपना कस्टम QR कोड बनाएँ" : "Create free QR codes with logos, colors, and custom styles"}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Controls */}
                <div className="glass-card space-y-6">
                    <div>
                        <label className="label">{isHi ? "सामग्री / URL" : "Content / URL"}</label>
                        <textarea
                            className="input-field h-24"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={isHi ? "URL या टेक्स्ट दर्ज करें..." : "Enter URL or text..."}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">{isHi ? "आगे का रंग (Foreground)" : "Foreground Color"}</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-10 bg-transparent cursor-pointer rounded overflow-hidden" />
                                <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="input-field" />
                            </div>
                        </div>
                        <div>
                            <label className="label">{isHi ? "पीछे का रंग (Background)" : "Background Color"}</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-10 bg-transparent cursor-pointer rounded overflow-hidden" />
                                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="label">{isHi ? "लोगो इमेज (वैकल्पिक)" : "Logo Image (Optional)"}</label>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 text-slate-300" />
                        {logo && <button onClick={() => setLogo(undefined)} className="text-xs text-red-400 ml-2">{isHi ? "लोगो हटाएं" : "Remove Logo"}</button>}
                    </div>

                    <div>
                        <label className="label">{isHi ? "त्रुटि सुधार स्तर (Error Correction)" : "Error Correction Level"}</label>
                        <div className="flex space-x-2">
                            {["L", "M", "Q", "H"].map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => setEcLevel(lvl as any)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${ecLevel === lvl ? "bg-indigo-600 border-indigo-500 text-white" : "border-slate-700 hover:bg-slate-800 text-slate-300"}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{isHi ? "उच्च स्तर अधिक लोगो की अनुमति देते हैं लेकिन कोड को सघन बनाते हैं।" : "Higher levels allow more damage/logos but make the code denser."}</p>
                    </div>

                    <div>
                        <label className="label">{isHi ? "आकार" : "Size"}: {size}px</label>
                        <input type="range" min="100" max="1000" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
                    </div>
                </div>

                {/* Preview */}
                <div className="glass-card flex flex-col items-center justify-center space-y-6 bg-slate-200/5">
                    <div className="bg-white p-4 rounded-xl shadow-2xl">
                        <QRCode
                            value={text}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            logoImage={logo}
                            logoWidth={size * 0.2}
                            logoHeight={size * 0.2}
                            qrStyle="dots"
                            eyeRadius={10}
                            ecLevel={ecLevel}
                            quietZone={padding}
                            id="react-qrcode-logo"
                            ref={qrRef}
                        />
                    </div>

                    <div className="flex gap-4 w-full">
                        <button onClick={() => handleDownload("png")} className="btn-primary flex-1">
                            {isHi ? "PNG डाउनलोड करें" : "Download PNG"}
                        </button>
                        <button onClick={() => handleDownload("jpg")} className="px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors flex-1">
                            {isHi ? "JPG डाउनलोड करें" : "Download JPG"}
                        </button>
                    </div>
                </div>
            </div>

            <FAQSection items={faqs} />
            <ToolLinks current="/qr-generator" tools={ALL_TOOLS} />
        </div>
    );
}
