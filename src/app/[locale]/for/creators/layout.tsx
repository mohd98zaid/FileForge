import { Metadata } from "next";

const BASE_URL = "https://forgetech.vercel.app";

export const metadata: Metadata = {
    title: "Free Online Tools for Creators & Designers — FileForge",
    description:
        "Free creative tools for designers, YouTubers, and content creators. Remove backgrounds, resize for Instagram, create GIFs, generate QR codes, add watermarks, and more.",
    keywords:
        "tools for creators, Instagram image resizer, remove background free, gif maker, watermark image, youtube thumbnail size, content creator tools, design tools free, social media resizer",
    alternates: {
        canonical: `${BASE_URL}/for/creators`,
        languages: {
            "en": `${BASE_URL}/for/creators`,
            "en-IN": `${BASE_URL}/for/creators`,
            "hi": `${BASE_URL}/hi/for/creators`,
            "x-default": `${BASE_URL}/for/creators`,
        },
    },
    openGraph: {
        title: "Free Tools for Creators & Designers — FileForge",
        description:
            "Remove backgrounds, resize for Instagram, create GIFs, add watermarks. Free tools for content creators.",
        url: `${BASE_URL}/for/creators`,
        siteName: "FileForge",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "FileForge — Free Tools for Creators",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Tools for Creators & Designers — FileForge",
        description:
            "Remove backgrounds, resize for Instagram, create GIFs, add watermarks. Free tools for content creators.",
        images: ["/og-image.png"],
    },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
