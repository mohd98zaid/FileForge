import type { Metadata } from "next";

import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';

const BASE_URL = "https://forgetech.vercel.app";

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await params;
    const isHindi = locale === 'hi';

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: isHindi
                ? "FileForge — मुफ़्त चित्र और PDF टूल्स"
                : "FileForge — Free Image & PDF Tools Online",
            template: "%s | FileForge",
        },
        description: isHindi
            ? "मुफ़्त ऑनलाइन चित्र और PDF टूल्स। रिसाइज़, कंप्रेस, कन्वर्ट करें। SSC, UPSC, Railway परीक्षा फ़ोटो रिसाइज़र। बिना साइन-अप, 100% मुफ़्त।"
            : "Free online image & PDF tools for India. Resize, compress & convert images. Merge, split & eSign PDFs. SSC, UPSC, Railway exam photo resizer. No sign-up, 100% free.",
        keywords:
            "image resize, compress image, PDF merge, PDF split, OCR, image to PDF, passport photo maker India, eSign PDF, free online tools, SSC photo resize, UPSC photo, exam photo resizer, चित्र रिसाइज़, PDF मर्ज, फ़ोटो कंप्रेस",
        openGraph: {
            title: isHindi
                ? "FileForge — मुफ़्त चित्र और PDF टूल्स"
                : "FileForge — Free Image & PDF Tools",
            description: isHindi
                ? "ऑल-इन-वन मुफ़्त चित्र और PDF टूल्स। बिना साइन-अप के उपयोग करें।"
                : "All-in-one image & PDF utility platform for India & worldwide. No sign-up required.",
            type: "website",
            url: BASE_URL,
            siteName: "FileForge",
            locale: isHindi ? "hi_IN" : "en_IN",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "FileForge — Free Image & PDF Tools Online",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isHindi
                ? "FileForge — मुफ़्त चित्र और PDF टूल्स"
                : "FileForge — Free Image & PDF Tools",
            description:
                "Free online image & PDF tools. Resize, compress, convert images. Merge, split PDFs. No sign-up required.",
            images: ["/og-image.png"],
        },
        alternates: {
            canonical: isHindi ? `${BASE_URL}/hi` : BASE_URL,
            languages: {
                "en-IN": BASE_URL,
                "en": BASE_URL,
                "hi": `${BASE_URL}/hi`,
                "x-default": BASE_URL,
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        icons: {
            icon: [
                { url: "/logo.png", type: "image/png", sizes: "32x32" },
                { url: "/logo.png", type: "image/png", sizes: "192x192" },
            ],
            apple: { url: "/logo.png", sizes: "180x180", type: "image/png" },
            shortcut: "/logo.png",
        },
    };
}

// JSON-LD Structured Data for the website
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FileForge",
    url: BASE_URL,
    description:
        "Free online image & PDF tools. Resize, compress, convert images. Merge, split, eSign PDFs. No sign-up required.",
    potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FileForge",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
        "Free, open-source image & PDF processing tools. No sign-up. No AI. Just code.",
};


export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'hi' }];
}


export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();
    const tLayout = await getTranslations('Layout');
    const tNav = await getTranslations('Navigation');

    return (
        <html lang={locale} className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
                />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body className="min-h-screen bg-dark-950 text-dark-200 antialiased" suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    {/* Background gradient blobs */}
                    <div className="fixed inset-0 -z-10 overflow-hidden">
                        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
                        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-600/5 blur-[100px]" />
                    </div>

                    {/* Navigation */}
                    <nav className="sticky top-0 z-50 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <Link href="/" className="flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/logo.png" alt="FileForge Logo" className="h-10 w-auto rounded-lg" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                                        FileForge
                                    </span>
                                </Link>

                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex items-center gap-6 text-sm">
                                        <Link href={"/#image-tools" as any} className="text-slate-400 hover:text-white transition-colors">{tNav('image')}</Link>
                                        <Link href={"/#pdf-tools" as any} className="text-slate-400 hover:text-white transition-colors">{tNav('pdf')}</Link>
                                        <Link href={"/#office-tools" as any} className="text-slate-400 hover:text-white transition-colors">Office</Link>
                                        <Link href={"/#audio-tools" as any} className="text-slate-400 hover:text-white transition-colors">{tNav('audio')}</Link>
                                        <Link href={"/#dev-tools" as any} className="text-slate-400 hover:text-white transition-colors">{tNav('dev')}</Link>
                                        <Link href="/about" className="text-slate-400 hover:text-white transition-colors">{tNav('about')}</Link>
                                    </div>
                                    <div className="flex gap-2">
                                        <LocaleSwitcher currentLocale={locale} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-white/5 bg-dark-950/50 mt-20">
                        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="grid gap-8 md:grid-cols-5">
                                {/* Brand */}
                                <div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/logo.png" alt="FileForge Logo" className="h-8 w-auto mb-3" />
                                    <h3 className="font-bold text-white mb-3">FileForge</h3>
                                    <p className="text-sm text-slate-500 mb-4">{tLayout('footerDesc')}</p>
                                    <Link href="/about" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">{tLayout('aboutPrivacy')}</Link>
                                </div>

                                {/* Image Tools */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3">{tLayout('imageTools')}</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><Link href="/resize-image" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'चित्र का आकार बदलें' : 'Resize Image'}</Link></li>
                                        <li><Link href="/compress-image" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'चित्र कंप्रेस करें' : 'Compress Image'}</Link></li>
                                        <li><Link href="/convert-image" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'चित्र कन्वर्ट करें' : 'Convert Image'}</Link></li>
                                        <li><Link href="/passport-photo-maker" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'पासपोर्ट फ़ोटो' : 'Passport Photo'}</Link></li>
                                        <li><Link href="/remove-bg" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'बैकग्राउंड हटाएँ' : 'Remove Background'}</Link></li>
                                        <li><Link href="/bulk-resize" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'बल्क रिसाइज़' : 'Bulk Resize'}</Link></li>
                                        <li><Link href="/gif-maker" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'GIF बनाएँ' : 'GIF Maker'}</Link></li>
                                    </ul>
                                </div>

                                {/* PDF Tools */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3">{tLayout('pdfTools')}</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><Link href="/pdf-merge" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF मर्ज करें' : 'Merge PDF'}</Link></li>
                                        <li><Link href="/pdf-split" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF स्प्लिट करें' : 'Split PDF'}</Link></li>
                                        <li><Link href="/pdf-to-image" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF से चित्र' : 'PDF to Image'}</Link></li>
                                        <li><Link href="/esign-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF पर हस्ताक्षर' : 'eSign PDF'}</Link></li>
                                        <li><Link href="/reorder-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF पेज क्रम बदलें' : 'Reorder PDF'}</Link></li>
                                        <li><Link href="/page-numbers-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF पेज नंबर' : 'Page Numbers'}</Link></li>
                                        <li><Link href="/extract-images-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'चित्र निकालें' : 'Extract Images'}</Link></li>
                                    </ul>
                                </div>

                                {/* Office Docs */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3">{locale === 'hi' ? 'ऑफ़िस डॉक्स' : 'Office Docs'}</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><Link href="/pdf-to-word" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF से Word' : 'PDF to Word'}</Link></li>
                                        <li><Link href="/word-to-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'Word से PDF' : 'Word to PDF'}</Link></li>
                                        <li><Link href="/pdf-to-powerpoint" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF से PowerPoint' : 'PDF to PowerPoint'}</Link></li>
                                        <li><Link href="/pdf-to-excel" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF से Excel' : 'PDF to Excel'}</Link></li>
                                        <li><Link href="/edit-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF एडिट करें' : 'Edit PDF'}</Link></li>
                                        <li><Link href="/html-to-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'HTML से PDF' : 'HTML to PDF'}</Link></li>
                                        <li><Link href="/translate-pdf" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'PDF अनुवाद करें' : 'Translate PDF'}</Link></li>
                                    </ul>
                                </div>

                                {/* Audio & Dev */}
                                <div>
                                    <h4 className="font-semibold text-white mb-3">{tLayout('audioDevTools')}</h4>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li><Link href="/audio-converter" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'ऑडियो कन्वर्टर' : 'Audio Converter'}</Link></li>
                                        <li><Link href="/video-to-audio" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'वीडियो से ऑडियो' : 'Video to Audio'}</Link></li>
                                        <li><Link href="/qr-generator" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'QR कोड' : 'QR Generator'}</Link></li>
                                        <li><Link href="/markdown-editor" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'मार्कडाउन एडिटर' : 'Markdown Editor'}</Link></li>
                                        <li><Link href="/unit-converter" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'इकाई कन्वर्टर' : 'Unit Converter'}</Link></li>
                                        <li><Link href="/currency-converter" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'मुद्रा कन्वर्टर' : 'Currency Converter'}</Link></li>
                                        <li><Link href="/image-to-text" className="hover:text-indigo-400 transition-colors">{locale === 'hi' ? 'चित्र से टेक्स्ट (OCR)' : 'Image to Text (OCR)'}</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 border-t border-white/5 pt-8 text-center text-sm text-slate-600">
                                {tLayout('copyright', { year: new Date().getFullYear() })}
                            </div>
                        </div>
                    </footer>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
