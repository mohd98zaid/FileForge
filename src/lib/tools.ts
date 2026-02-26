export interface Tool {
    name: string;
    nameHi: string;
    href: string;
    icon: string;
    description: string;
    descriptionHi: string;
    category: string;
    disabled?: boolean;
}

export const ALL_TOOLS: Tool[] = [
    // ── Image Tools ────────────────────────────────────────────────────────────
    { name: "Resize Image", nameHi: "इमेज रिसाइज़ करें", href: "/resize-image", icon: "📐", description: "Resize by dimensions or target file size", descriptionHi: "साइज़ या डाइमेंशन के हिसाब से बदलें", category: "image" },
    { name: "Compress Image", nameHi: "इमेज कंप्रेस करें", href: "/compress-image", icon: "🗜️", description: "Reduce file size with quality slider", descriptionHi: "क्वालिटी स्लाइडर से फ़ाइल साइज़ कम करें", category: "image" },
    { name: "Convert Image", nameHi: "इमेज कन्वर्ट करें", href: "/convert-image", icon: "🔄", description: "PNG ↔ JPG, WebP ↔ PNG, HEIC → JPG", descriptionHi: "PNG ↔ JPG, WebP ↔ PNG, HEIC → JPG", category: "image" },
    { name: "Crop / Rotate", nameHi: "क्रॉप / रोटेट करें", href: "/crop-rotate", icon: "✂️", description: "Crop, rotate, or flip images", descriptionHi: "इमेज क्रॉप, रोटेट या फ़्लिप करें", category: "image" },
    { name: "Remove Background", nameHi: "बैकग्राउंड हटाएँ", href: "/remove-bg", icon: "🎭", description: "Remove image background automatically", descriptionHi: "इमेज का बैकग्राउंड ऑटोमैटिक हटाएँ", category: "image" },
    { name: "Watermark Image", nameHi: "इमेज पर वॉटरमार्क", href: "/watermark-image", icon: "💧", description: "Add text watermark to images", descriptionHi: "इमेज पर टेक्स्ट वॉटरमार्क लगाएँ", category: "image" },
    { name: "Social Resize", nameHi: "सोशल मीडिया रिसाइज़", href: "/social-resize", icon: "📱", description: "Resize for Instagram, Facebook, etc.", descriptionHi: "Instagram, Facebook आदि के लिए साइज़ बदलें", category: "image" },
    { name: "Bulk Resize", nameHi: "एक साथ कई इमेज रिसाइज़", href: "/bulk-resize", icon: "📐", description: "Resize up to 10 images at once", descriptionHi: "एक बार में 10 इमेज रिसाइज़ करें", category: "image" },
    { name: "Change DPI", nameHi: "DPI बदलें", href: "/change-dpi", icon: "📏", description: "Change image DPI for print or web", descriptionHi: "प्रिंट या वेब के लिए इमेज DPI बदलें", category: "image" },
    { name: "Remove Metadata", nameHi: "मेटाडेटा हटाएँ", href: "/remove-metadata", icon: "🧹", description: "Strip EXIF data, GPS, camera info", descriptionHi: "EXIF, GPS, कैमरा जानकारी हटाएँ", category: "image" },
    { name: "GIF Maker", nameHi: "GIF बनाएँ", href: "/gif-maker", icon: "🎞️", description: "Create animated GIFs from images", descriptionHi: "कई इमेज से एनिमेटेड GIF बनाएँ", category: "image" },
    { name: "Color Palette", nameHi: "कलर पैलेट", href: "/color-palette", icon: "🎨", description: "Extract color palette from images", descriptionHi: "इमेज से कलर पैलेट निकालें", category: "image" },
    { name: "HEIC to JPG", nameHi: "HEIC से JPG", href: "/heic-to-jpg", icon: "🖼️", description: "Convert iPhone HEIC photos to JPG/PNG", descriptionHi: "iPhone की HEIC फ़ोटो को JPG/PNG में बदलें", category: "image" },
    { name: "Passport Photo", nameHi: "पासपोर्ट फ़ोटो", href: "/passport-photo-maker", icon: "📸", description: "Indian format 35×45mm, white background", descriptionHi: "भारतीय फ़ॉर्मेट 35×45mm, सफ़ेद बैकग्राउंड", category: "image" },
    { name: "Exam Photo", nameHi: "परीक्षा फ़ोटो", href: "/exam-photo", icon: "🎓", description: "SSC, UPSC, Railway, Banking — validate & prepare", descriptionHi: "SSC, UPSC, रेलवे, बैंकिंग — चेक करें, तैयार करें", category: "image" },

    // ── PDF Tools ──────────────────────────────────────────────────────────────
    { name: "Merge PDF", nameHi: "PDF जोड़ें (मर्ज)", href: "/pdf-merge", icon: "📎", description: "Combine multiple PDFs into one", descriptionHi: "कई PDF को एक में मिलाएँ", category: "pdf" },
    { name: "Split PDF", nameHi: "PDF अलग करें (स्प्लिट)", href: "/pdf-split", icon: "✂️", description: "Extract page ranges from a PDF", descriptionHi: "PDF से ज़रूरी पेज अलग निकालें", category: "pdf" },
    { name: "Compress PDF", nameHi: "PDF कंप्रेस करें", href: "/compress-pdf", icon: "📦", description: "Reduce PDF file size", descriptionHi: "PDF की फ़ाइल साइज़ कम करें", category: "pdf" },
    { name: "PDF to Image", nameHi: "PDF से इमेज बनाएँ", href: "/pdf-to-image", icon: "🖼️", description: "Convert PDF pages to JPG, PNG, WebP & more", descriptionHi: "PDF पेज को JPG, PNG, WebP में बदलें", category: "pdf" },
    { name: "Image to PDF", nameHi: "इमेज से PDF बनाएँ", href: "/image-to-pdf", icon: "📄", description: "Convert one or multiple images to PDF", descriptionHi: "एक या कई इमेज को PDF में बदलें", category: "pdf" },
    { name: "Reorder PDF", nameHi: "PDF पेज का क्रम बदलें", href: "/reorder-pdf", icon: "🔀", description: "Reorder, delete & rotate PDF pages", descriptionHi: "PDF पेज का क्रम बदलें, हटाएँ या घुमाएँ", category: "pdf" },
    { name: "Page Numbers", nameHi: "पेज नंबर जोड़ें", href: "/page-numbers-pdf", icon: "🔢", description: "Add page numbers to PDF", descriptionHi: "PDF में पेज नंबर लगाएँ", category: "pdf" },
    { name: "Watermark PDF", nameHi: "PDF पर वॉटरमार्क", href: "/watermark-pdf", icon: "💧", description: "Add text watermark to PDF pages", descriptionHi: "PDF के पेज पर वॉटरमार्क लगाएँ", category: "pdf" },
    { name: "Password PDF", nameHi: "PDF पासवर्ड लगाएँ", href: "/password-pdf", icon: "🔒", description: "Password protect or unlock PDFs", descriptionHi: "PDF को पासवर्ड से लॉक या अनलॉक करें", category: "pdf" },
    { name: "eSign PDF", nameHi: "PDF पर ई-साइन करें", href: "/esign-pdf", icon: "✍️", description: "Add signature to any page", descriptionHi: "किसी भी पेज पर अपने हस्ताक्षर लगाएँ", category: "pdf" },
    { name: "Extract Images", nameHi: "इमेज निकालें", href: "/extract-images-pdf", icon: "🖼️", description: "Extract all images from PDF", descriptionHi: "PDF में से सारी इमेज निकालें", category: "pdf" },
    { name: "PDF Metadata", nameHi: "PDF मेटाडेटा हटाएँ", href: "/pdf-metadata-remover", icon: "🧹", description: "Remove hidden metadata from PDFs", descriptionHi: "PDF से छिपा हुआ मेटाडेटा साफ़ करें", category: "pdf" },

    // ── Office Docs ────────────────────────────────────────────────────────────
    { name: "PDF to Word", nameHi: "PDF से Word बनाएँ", href: "/pdf-to-word", icon: "📝", description: "Convert PDF to editable Word (.docx)", descriptionHi: "PDF को एडिट करने लायक Word (.docx) में बदलें", category: "office" },
    { name: "Word to PDF", nameHi: "Word से PDF बनाएँ", href: "/word-to-pdf", icon: "📄", description: "Convert Word documents to PDF", descriptionHi: "Word डॉक्यूमेंट को PDF में बदलें", category: "office" },
    { name: "PDF to PowerPoint", nameHi: "PDF से PowerPoint", href: "/pdf-to-powerpoint", icon: "📊", description: "Convert PDF pages to editable slides (.pptx)", descriptionHi: "PDF को एडिटेबल PowerPoint (.pptx) में बदलें", category: "office" },
    { name: "PowerPoint to PDF", nameHi: "PowerPoint से PDF", href: "/powerpoint-to-pdf", icon: "📉", description: "Convert PPT/PPTX presentations to PDF", descriptionHi: "PPT/PPTX प्रेज़ेंटेशन को PDF में बदलें", category: "office" },
    { name: "PDF to Excel", nameHi: "PDF से Excel", href: "/pdf-to-excel", icon: "📈", description: "Extract tables from PDF into .xlsx spreadsheet", descriptionHi: "PDF से टेबल निकालकर Excel (.xlsx) में बदलें", category: "office" },
    { name: "Excel to PDF", nameHi: "Excel से PDF", href: "/excel-to-pdf", icon: "📋", description: "Convert Excel spreadsheets to PDF", descriptionHi: "Excel स्प्रेडशीट को PDF में बदलें", category: "office" },
    { name: "Edit PDF", nameHi: "PDF एडिट करें", href: "/edit-pdf", icon: "✏️", description: "Add text, draw, and annotate PDF pages", descriptionHi: "PDF पर टेक्स्ट लिखें, ड्रॉ करें और नोट्स लगाएँ", category: "office" },
    { name: "HTML to PDF", nameHi: "HTML से PDF", href: "/html-to-pdf", icon: "🌐", description: "Paste HTML or a URL and convert to PDF", descriptionHi: "HTML या URL से PDF बनाएँ", category: "office" },
    { name: "Translate PDF", nameHi: "PDF अनुवाद करें", href: "/translate-pdf", icon: "🌍", description: "Translate PDF text into 20+ languages", descriptionHi: "PDF का टेक्स्ट 20+ भाषाओं में अनुवाद करें", category: "office", disabled: true },

    // ── OCR ────────────────────────────────────────────────────────────────────
    { name: "Image to Text", nameHi: "इमेज से टेक्स्ट निकालें", href: "/image-to-text", icon: "🔍", description: "OCR — extract text in English & Hindi", descriptionHi: "OCR — अंग्रेज़ी और हिंदी में टेक्स्ट निकालें", category: "ocr" },

    // ── Audio & Video ──────────────────────────────────────────────────────────
    { name: "Audio Converter", nameHi: "ऑडियो कन्वर्टर", href: "/audio-converter", icon: "🎵", description: "Convert MP3 to WAV (Privacy-first)", descriptionHi: "MP3 को WAV में बदलें (ब्राउज़र में, सुरक्षित)", category: "audio" },
    { name: "Video to Audio", nameHi: "वीडियो से ऑडियो निकालें", href: "/video-to-audio", icon: "🔉", description: "Extract MP3 from Video (Privacy-first)", descriptionHi: "वीडियो से MP3 निकालें (ब्राउज़र में, सुरक्षित)", category: "audio" },

    // ── Developer Tools ────────────────────────────────────────────────────────
    { name: "QR Code", nameHi: "QR कोड बनाएँ", href: "/qr-generator", icon: "📱", description: "Generate custom QR codes", descriptionHi: "अपना कस्टम QR कोड बनाएँ", category: "dev" },
    { name: "JSON <> CSV", nameHi: "JSON ↔ CSV कन्वर्टर", href: "/json-csv", icon: "📊", description: "Convert JSON to CSV and back", descriptionHi: "JSON को CSV में और CSV को JSON में बदलें", category: "dev" },
    { name: "SQL Formatter", nameHi: "SQL फ़ॉर्मेटर", href: "/sql-formatter", icon: "💾", description: "Prettify SQL queries", descriptionHi: "SQL क्वेरी को सुंदर और पढ़ने लायक बनाएँ", category: "dev" },
    { name: "Diff Checker", nameHi: "डिफ़ चेकर", href: "/diff-checker", icon: "⚖️", description: "Compare text differences", descriptionHi: "दो टेक्स्ट के बीच का फ़र्क देखें", category: "dev" },
    { name: "Markdown Editor", nameHi: "मार्कडाउन एडिटर", href: "/markdown-editor", icon: "📝", description: "Live preview Markdown editor", descriptionHi: "लाइव प्रीव्यू मार्कडाउन एडिटर", category: "dev" },
    { name: "Password Gen", nameHi: "पासवर्ड जनरेटर", href: "/password-generator", icon: "🔑", description: "Generate secure, random passwords", descriptionHi: "मज़बूत और सुरक्षित पासवर्ड बनाएँ", category: "dev" },
    { name: "Lorem Ipsum", nameHi: "लोरेम इप्सम", href: "/lorem-ipsum", icon: "📝", description: "Generate placeholder text", descriptionHi: "डमी/प्लेसहोल्डर टेक्स्ट बनाएँ", category: "dev" },
    { name: "Unit Converter", nameHi: "यूनिट कन्वर्टर", href: "/unit-converter", icon: "🧮", description: "Convert Length, Weight, Temp, etc.", descriptionHi: "लंबाई, वज़न, तापमान आदि बदलें", category: "dev" },
    { name: "Timestamp Converter", nameHi: "टाइमस्टैम्प कन्वर्टर", href: "/timestamp-converter", icon: "⏱️", description: "Epoch <-> Human Date", descriptionHi: "Epoch ↔ तारीख़ / समय में बदलें", category: "dev" },
    { name: "Currency Converter", nameHi: "करेंसी कन्वर्टर", href: "/currency-converter", icon: "💱", description: "Real-time exchange rates", descriptionHi: "लाइव एक्सचेंज रेट के साथ मुद्रा बदलें", category: "dev" },
];
