"use client";

import { useLocale } from "next-intl";
import { Link } from '@/i18n/navigation';
import { ALL_TOOLS } from "@/lib/tools";

const en = {
    title: "About FileForge",
    subtitle: "Your one-stop toolkit for images, PDFs, audio, and developer utilities — built with privacy at the core.",

    // Mission
    missionTitle: "Our Mission",
    missionText: "We believe everyday tools like image resizing, PDF editing, and file conversions should be free, fast, and private. No sign-ups, no hidden costs, no data collection. FileForge was born out of frustration with bloated, ad-heavy alternatives that sell your data. We built something better.",

    // Stats
    totalTools: "Total Tools",
    monthlyUsers: "Monthly Users",
    filesProcessed: "Files Processed",
    dataCollected: "Data Collected",
    monthlyUsersVal: "Growing",
    filesProcessedVal: "Millions",
    dataCollectedVal: "Zero",

    // Core Values
    privacyTitle: "🔒 Privacy First",
    privacyDesc: "Most of our tools run entirely in your browser — your files never leave your device. For server-side tasks like OCR or complex conversions, we use ephemeral processing: files are deleted immediately after use.",
    speedTitle: "⚡ Blazing Fast",
    speedDesc: "Client-side processing means no upload wait times. Even server tasks are optimized to complete in seconds, not minutes. We've benchmarked our tools to be faster than most paid alternatives.",
    freeTitle: "🆓 100% Free, Forever",
    freeDesc: "No premium tiers, no 'upgrade to unlock' tricks, no watermarks on output. Every tool works fully for everyone. We run this as an open-source project with no strings attached.",
    indianTitle: "🇮🇳 Made for India",
    indianDesc: "SSC, UPSC, Railway, Banking exam photo resizer. Passport-size photo maker. Hindi OCR support. Currency converter with INR. We've specifically built tools that Indian students and professionals need every day.",

    // What we offer
    offerTitle: "What We Offer",
    imageSection: "Image Tools (15+)",
    imageSectionDesc: "Resize, compress, convert, crop, rotate, change DPI, remove backgrounds, add watermarks, create GIFs, extract color palettes, and prepare photos for Indian exams and passports — all client-side.",
    pdfSection: "PDF Tools (12+)",
    pdfSectionDesc: "Merge, split, compress, add page numbers, watermark, eSign, extract images, reorder pages — all client-side with pdf-lib.",
    officeSection: "Office Docs (9+)",
    officeSectionDesc: "PDF to Word, PDF to PowerPoint, PDF to Excel, Word/PPT/Excel to PDF, Edit PDF (Sejda-style editor with shapes, text, highlights), HTML to PDF, and Translate PDF into 20+ languages.",
    devSection: "Developer & Utility Tools (10+)",
    devSectionDesc: "QR code generator, JSON↔CSV converter, SQL formatter, diff checker, unit converter, timestamp converter, currency converter, password generator, lorem ipsum, and a live Markdown editor.",
    audioSection: "Audio & Video Tools",
    audioSectionDesc: "Convert audio formats and extract audio from video files — processed locally using FFmpeg WebAssembly for complete privacy.",

    // Technology
    techTitle: "How It Works",
    techIntro: "FileForge uses a hybrid architecture that prioritizes privacy while delivering powerful features:",
    clientSide: "Browser Processing (Most Tools)",
    clientSideDesc: "We use libraries like pdf-lib, pica, browser-image-compression, and FFmpeg WASM to process your files directly in your browser tab. Nothing is uploaded. Nothing is stored. It's as if the tool lives on your computer.",
    serverSide: "Server Processing (When Needed)",
    serverSideDesc: "Some tasks — like PDF↔Word conversion or advanced OCR — require server-side processing. For these, we use stateless servers that process your file in memory and delete it immediately after returning the result.",

    // Open source
    openSourceTitle: "Open Source",
    openSourceDesc: "FileForge is open-source. You can inspect every line of code, verify our privacy claims, and even contribute improvements. We believe transparency builds trust.",
    githubLink: "View on GitHub",

    // CTA
    ctaTitle: "Start Using FileForge",
    ctaSubtitle: "No sign-up needed. Just pick a tool and go.",
};

const hi = {
    title: "FileForge के बारे में",
    subtitle: "इमेज, PDF, ऑडियो और डेवलपर टूल्स के लिए आपका ऑल-इन-वन प्लेटफ़ॉर्म — प्राइवेसी हमारी प्राथमिकता है।",

    // Mission
    missionTitle: "हमारा मकसद",
    missionText: "हमारा मानना है कि इमेज रिसाइज़, PDF एडिटिंग और फ़ाइल कन्वर्शन जैसे रोज़ाना के काम मुफ़्त, तेज़ और सुरक्षित होने चाहिए। कोई साइन-अप नहीं, कोई छुपी फ़ीस नहीं, कोई डेटा कलेक्शन नहीं। FileForge उन भारी-भरकम और ads से भरी वेबसाइटों से तंग आकर बनाया गया है जो आपका डेटा बेचती हैं।",

    // Stats
    totalTools: "कुल टूल्स",
    monthlyUsers: "मासिक उपयोगकर्ता",
    filesProcessed: "फ़ाइलें प्रोसेस",
    dataCollected: "डेटा कलेक्शन",
    monthlyUsersVal: "बढ़ रहे हैं",
    filesProcessedVal: "लाखों",
    dataCollectedVal: "बिल्कुल नहीं",

    // Core Values
    privacyTitle: "🔒 प्राइवेसी सबसे पहले",
    privacyDesc: "ज़्यादातर टूल्स पूरी तरह आपके ब्राउज़र में चलते हैं — आपकी फ़ाइलें कहीं अपलोड नहीं होतीं। जिन कामों में सर्वर लगता है (जैसे OCR), वहाँ भी फ़ाइल प्रोसेस होते ही तुरंत डिलीट कर दी जाती है।",
    speedTitle: "⚡ बेहद तेज़",
    speedDesc: "ब्राउज़र में प्रोसेसिंग का मतलब है — कोई अपलोड वेटिंग नहीं। सर्वर वाले काम भी सेकंडों में पूरे होते हैं। हमारे टूल्स कई पेड विकल्पों से भी तेज़ हैं।",
    freeTitle: "🆓 पूरी तरह मुफ़्त, हमेशा",
    freeDesc: "कोई प्रीमियम प्लान नहीं, कोई 'अपग्रेड करें' का झंझट नहीं, आउटपुट पर कोई वॉटरमार्क नहीं। हर टूल पूरी तरह से सबके लिए खुला है।",
    indianTitle: "🇮🇳 भारत के लिए बनाया गया",
    indianDesc: "SSC, UPSC, रेलवे, बैंकिंग परीक्षा फ़ोटो रिसाइज़र। पासपोर्ट-साइज़ फ़ोटो मेकर। हिंदी OCR सपोर्ट। INR करेंसी कन्वर्टर। हमने ख़ास वो टूल्स बनाए हैं जो भारतीय छात्रों और प्रोफ़ेशनल्स को हर दिन चाहिए।",

    // What we offer
    offerTitle: "हम क्या देते हैं",
    imageSection: "इमेज टूल्स (15+)",
    imageSectionDesc: "रिसाइज़, कंप्रेस, कन्वर्ट, क्रॉप, रोटेट, DPI बदलें, बैकग्राउंड हटाएँ, वॉटरमार्क लगाएँ, GIF बनाएँ, कलर पैलेट निकालें, और परीक्षा व पासपोर्ट फ़ोटो तैयार करें — सब ब्राउज़र में।",
    pdfSection: "PDF टूल्स (12+)",
    pdfSectionDesc: "मर्ज, स्प्लिट, कंप्रेस, पेज नंबर लगाएँ, वॉटरमार्क, ई-साइन, इमेज निकालें, पेज का क्रम बदलें — सब कुछ pdf-lib से ब्राउज़र में।",
    officeSection: "ऑफ़िस डॉक्स (9+)",
    officeSectionDesc: "PDF से Word, PowerPoint, Excel में कन्वर्ट करें। Word/PPT/Excel से PDF बनाएँ। Sejda जैसा PDF एडिटर — शेप, टेक्स्ट, हाइलाइट के साथ। HTML से PDF और PDF का 20+ भाषाओं में अनुवाद।",
    devSection: "डेवलपर और यूटिलिटी टूल्स (10+)",
    devSectionDesc: "QR कोड जनरेटर, JSON↔CSV कन्वर्टर, SQL फ़ॉर्मेटर, डिफ़ चेकर, यूनिट कन्वर्टर, टाइमस्टैम्प कन्वर्टर, करेंसी कन्वर्टर, पासवर्ड जनरेटर, लोरेम इप्सम और लाइव मार्कडाउन एडिटर।",
    audioSection: "ऑडियो और वीडियो टूल्स",
    audioSectionDesc: "ऑडियो फ़ॉर्मेट कन्वर्ट करें और वीडियो से ऑडियो निकालें — FFmpeg WebAssembly के ज़रिए सब कुछ आपके ब्राउज़र में ही होता है।",

    // Technology
    techTitle: "यह कैसे काम करता है",
    techIntro: "FileForge एक हाइब्रिड सिस्टम पर चलता है जो प्राइवेसी को पहले रखता है:",
    clientSide: "ब्राउज़र में प्रोसेसिंग (ज़्यादातर टूल्स)",
    clientSideDesc: "हम pdf-lib, pica, browser-image-compression, और FFmpeg WASM जैसी लाइब्रेरी का इस्तेमाल करते हैं। आपकी फ़ाइल सीधे आपके ब्राउज़र टैब में प्रोसेस होती है। कुछ भी अपलोड नहीं होता, कुछ भी सेव नहीं होता।",
    serverSide: "सर्वर प्रोसेसिंग (जब ज़रूरी हो)",
    serverSideDesc: "कुछ काम — जैसे PDF↔Word कन्वर्शन या एडवांस OCR — में सर्वर की ज़रूरत होती है। इनके लिए हम स्टेटलेस सर्वर यूज़ करते हैं जो फ़ाइल को मेमोरी में प्रोसेस करके तुरंत डिलीट कर देते हैं।",

    // Open source
    openSourceTitle: "ओपन सोर्स",
    openSourceDesc: "FileForge ओपन-सोर्स है। आप कोड की हर लाइन देख सकते हैं, हमारे प्राइवेसी दावों को वेरिफ़ाई कर सकते हैं, और अपना योगदान भी दे सकते हैं। हमारा विश्वास है कि पारदर्शिता से भरोसा बनता है।",
    githubLink: "GitHub पर देखें",

    // CTA
    ctaTitle: "FileForge इस्तेमाल करें",
    ctaSubtitle: "कोई साइन-अप नहीं। बस टूल चुनें और शुरू करें।",
};

export default function AboutPage() {
    const locale = useLocale();
    const isHi = locale === "hi";
    const t = isHi ? hi : en;

    const toolCount = ALL_TOOLS.length;

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-16">
            {/* Hero */}
            <div className="text-center space-y-4 pt-4">
                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent leading-normal py-2">
                    {t.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    {t.subtitle}
                </p>
            </div>

            {/* Mission */}
            <div className="glass-card p-8 md:p-10 border-l-4 border-indigo-500">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span className="text-3xl">🎯</span> {t.missionTitle}
                </h2>
                <p className="text-slate-300 leading-relaxed text-base">
                    {t.missionText}
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: t.totalTools, value: `${toolCount}+`, color: "from-indigo-400 to-purple-400" },
                    { label: t.monthlyUsers, value: t.monthlyUsersVal, color: "from-emerald-400 to-teal-400" },
                    { label: t.filesProcessed, value: t.filesProcessedVal, color: "from-amber-400 to-orange-400" },
                    { label: t.dataCollected, value: t.dataCollectedVal, color: "from-red-400 to-pink-400" },
                ].map((s) => (
                    <div key={s.label} className="glass-card text-center py-6">
                        <p className={`text-2xl md:text-3xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                        <p className="mt-2 text-sm text-slate-500">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Core Values */}
            <div className="grid md:grid-cols-2 gap-6">
                {[
                    { title: t.privacyTitle, desc: t.privacyDesc, gradient: "from-blue-500/10 to-indigo-500/10" },
                    { title: t.speedTitle, desc: t.speedDesc, gradient: "from-yellow-500/10 to-amber-500/10" },
                    { title: t.freeTitle, desc: t.freeDesc, gradient: "from-emerald-500/10 to-green-500/10" },
                    { title: t.indianTitle, desc: t.indianDesc, gradient: "from-orange-500/10 to-red-500/10" },
                ].map((card) => (
                    <div key={card.title} className={`glass-card p-6 bg-gradient-to-br ${card.gradient} space-y-3`}>
                        <h3 className="text-xl font-bold text-white">{card.title}</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </div>

            {/* What We Offer */}
            <div>
                <h2 className="section-title mb-8">{t.offerTitle}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { title: t.imageSection, desc: t.imageSectionDesc, icon: "🖼️", color: "text-indigo-400" },
                        { title: t.pdfSection, desc: t.pdfSectionDesc, icon: "📄", color: "text-red-400" },
                        { title: t.officeSection, desc: t.officeSectionDesc, icon: "🗂️", color: "text-amber-400" },
                        { title: t.devSection, desc: t.devSectionDesc, icon: "🛠️", color: "text-emerald-400" },
                        { title: t.audioSection, desc: t.audioSectionDesc, icon: "🎵", color: "text-purple-400" },
                    ].map((section) => (
                        <div key={section.title} className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{section.icon}</span>
                                <h3 className={`text-lg font-bold ${section.color}`}>{section.title}</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">{section.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technology */}
            <div className="glass-card p-8 md:p-10 space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-3xl">⚙️</span> {t.techTitle}
                </h2>
                <p className="text-slate-300">{t.techIntro}</p>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
                        <h4 className="font-bold text-emerald-300">{t.clientSide}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t.clientSideDesc}</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
                        <h4 className="font-bold text-amber-300">{t.serverSide}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{t.serverSideDesc}</p>
                    </div>
                </div>
            </div>

            {/* Open Source */}
            <div className="glass-card p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold text-white">💻 {t.openSourceTitle}</h2>
                <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.openSourceDesc}</p>
                <a href="https://github.com/mohd98zaid/FileForge" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-indigo-500/30 transition-all">
                    <span>🔗</span> {t.githubLink}
                </a>
            </div>

            {/* CTA */}
            <div className="text-center py-10 space-y-6">
                <h3 className="text-3xl font-bold text-white">{t.ctaTitle}</h3>
                <p className="text-slate-400 text-lg">{t.ctaSubtitle}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href={"/#image-tools" as any} className="btn-primary text-lg px-8 py-3">🖼️ {isHi ? "इमेज टूल्स" : "Image Tools"}</Link>
                    <Link href={"/#pdf-tools" as any} className="btn-secondary text-lg px-8 py-3">📄 {isHi ? "PDF टूल्स" : "PDF Tools"}</Link>
                    <Link href={"/#office-tools" as any} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-8 py-3 text-lg font-semibold text-slate-300 transition-all duration-300 hover:bg-slate-700 hover:scale-105">🗂️ {isHi ? "ऑफ़िस डॉक्स" : "Office Docs"}</Link>
                </div>
            </div>
        </div>
    );
}
