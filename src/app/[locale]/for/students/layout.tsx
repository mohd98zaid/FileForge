import { Metadata } from "next";

const BASE_URL = "https://forgetech.vercel.app";

export const metadata: Metadata = {
    title: "Free Online Tools for Students & Exam Aspirants — FileForge",
    description:
        "Free tools for SSC, UPSC, Railway, NEET, and JEE aspirants. Resize exam photos, compress images to 20KB/50KB, merge PDFs, and more. No sign-up required.",
    keywords:
        "student tools, exam photo resizer, ssc image resize, upsc photo resize, neet photo, compress image to 20kb, pdf merge for students, free tools for exams, notes to pdf, image to pdf",
    alternates: {
        canonical: `${BASE_URL}/for/students`,
        languages: {
            "en": `${BASE_URL}/for/students`,
            "en-IN": `${BASE_URL}/for/students`,
            "hi": `${BASE_URL}/hi/for/students`,
            "x-default": `${BASE_URL}/for/students`,
        },
    },
    openGraph: {
        title: "Free Tools for Students & Exam Aspirants — FileForge",
        description:
            "Resize exam photos (SSC, UPSC, Railway), compress images, merge PDFs. 100% free online tools for Indian students.",
        url: `${BASE_URL}/for/students`,
        siteName: "FileForge",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "FileForge — Free Tools for Students",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Tools for Students & Exam Aspirants — FileForge",
        description:
            "Resize exam photos, compress images, merge PDFs. Free online tools for Indian students.",
        images: ["/og-image.png"],
    },
};

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
