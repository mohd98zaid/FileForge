"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/Button";
import { QrCode, Download, Image as ImageIcon } from "lucide-react";
import { QRCode } from "react-qrcode-logo";

export default function QrWithLogoTool() {
    const [value, setValue] = useState("https://fileforge.app");
    const [logo, setLogo] = useState<string>("");
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [logoSize, setLogoSize] = useState(80);
    const [logoPadding, setLogoPadding] = useState(2);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(URL.createObjectURL(file));
        }
    };

    const downloadQr = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `qr_${Date.now()}.png`;
            link.click();
        }
    };

    return (
        <ToolLayout title="QR Code with Logo" description="Create personalized QR codes containing your own logo or image.">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Controls */}
                <div className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
                    <div>
                        <label className="font-semibold block mb-2">QR Code Content (URL or Text)</label>
                        <textarea 
                            value={value} 
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full p-4 border rounded-xl"
                            rows={3}
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Foreground Color</label>
                            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-12 border rounded-lg cursor-pointer" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Background Color</label>
                            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-12 border rounded-lg cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold block mb-2">Upload Logo (Inner Image)</label>
                        <div className="flex items-center gap-4">
                            <input type="file" accept="image/*" id="logoUpload" onChange={handleLogoUpload} className="hidden" />
                            <Button variant="secondary" onClick={() => document.getElementById("logoUpload")?.click()} className="gap-2">
                                <ImageIcon className="w-4 h-4" /> Select Image
                            </Button>
                            {logo && <Button variant="secondary" onClick={() => setLogo("")} className="text-red-500">Remove</Button>}
                        </div>
                    </div>

                    {logo && (
                        <div className="space-y-4 pt-4 border-t">
                            <div>
                                <label className="text-sm flex justify-between">
                                    <span>Logo Size</span>
                                    <span>{logoSize}px</span>
                                </label>
                                <input type="range" min="20" max="150" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full" />
                            </div>
                            <div>
                                <label className="text-sm flex justify-between">
                                    <span>Logo Padding</span>
                                    <span>{logoPadding}px</span>
                                </label>
                                <input type="range" min="0" max="10" value={logoPadding} onChange={(e) => setLogoPadding(Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border">
                    <div ref={qrRef} className="bg-white p-4 rounded-2xl shadow-lg border">
                        <QRCode 
                            value={value || "https://fileforge.app"}
                            size={250}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            logoImage={logo}
                            logoWidth={logoSize}
                            logoHeight={logoSize}
                            logoPadding={logoPadding}
                            qrStyle="dots"
                            eyeRadius={[10, 10, 10]}
                            quietZone={10}
                        />
                    </div>
                    
                    <Button onClick={downloadQr} className="mt-8 gap-2 bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold">
                        <Download className="w-5 h-5"/> Download High-Res PNG
                    </Button>
                </div>
            </div>
        </ToolLayout>
    );
}
