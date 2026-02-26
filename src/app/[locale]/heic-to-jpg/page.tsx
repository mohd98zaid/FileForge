"use client";

import { useLocale } from "next-intl";

import { useState } from "react";
// heic2any imported dynamically
import ToolLinks from "@/components/ToolLinks";
import { ALL_TOOLS } from "@/lib/tools";
import FAQSection from "@/components/FAQSection";
import FileUpload from "@/components/FileUpload";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";

const faqs = [
    { question: "What is HEIC?", questionHi: "HEIC क्या है?", answer: "HEIC is Apple's image format used by iPhones and iPads.", answerHi: "HEIC Apple का इमेज फ़ॉर्मेट है जो iPhone और iPad में इस्तेमाल होता है।" },
    { question: "Why convert to JPG?", questionHi: "JPG में क्यों बदलें?", answer: "JPG is universally supported — Windows, Android, websites, social media.", answerHi: "JPG हर जगह सपोर्ट होता है — Windows, Android, वेबसाइट, सोशल मीडिया।" },
];

export default function HeicToJpgPage() {
    const locale = useLocale();
    const isHi = locale === "hi";

    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resultBlob, setResultBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState<"jpeg" | "png">("jpeg");

    const handleFile = (files: File[]) => {
        if (files.length) {
            setFile(files[0]);
            setResultBlob(null);
            setPreviewUrl(null);
            setProgress(0);
        }
    };

    const convert = async () => {
        if (!file) return;
        setIsConverting(true);
        setProgress(30);

        try {
            // Dynamically import heic2any to avoid SSR issues
            const heic2any = (await import("heic2any")).default;

            const result = await heic2any({
                blob: file,
                toType: `image/${targetFormat}`,
                quality: 0.9,
            });

            const blob = Array.isArray(result) ? result[0] : result;
            setResultBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob));
            setProgress(100);
        } catch (e) {
            console.error(e);
            alert(isHi ? "कनवर्ज़न विफल। कृपया दूसरी फ़ाइल चुनें।" : "Conversion failed. Please try a different file.");
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <FAQSection items={faqs} />
            <ToolLinks current="/heic-to-jpg" tools={ALL_TOOLS} />
        </div>
    );
}
