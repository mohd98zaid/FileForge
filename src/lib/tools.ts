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
    { name: "Image Collage", nameHi: "इमेज कोलाज", href: "/image-collage", icon: "🖼️", description: "Combine multiple images into a grid", descriptionHi: "कई इमेजों को एक ग्रिड में मिलाएँ", category: "image" },
    { name: "Image Splitter", nameHi: "इमेज स्प्लिटर", href: "/image-splitter", icon: "✂️", description: "Split image into equal pieces", descriptionHi: "इमेज को बराबर टुकड़ों में काटें", category: "image" },
    { name: "Image Border", nameHi: "इमेज बॉर्डर", href: "/image-border", icon: "⬜", description: "Add solid borders & rounded inner corners", descriptionHi: "ठोस सीमाएँ और गोल आंतरिक कोने जोड़ें", category: "image" },
    { name: "Round Corners", nameHi: "गोल कोने", href: "/round-corners", icon: "🔄", description: "Apply rounded corners and download as PNG", descriptionHi: "गोल कोने लागू करें और PNG के रूप में डाउनलोड करें", category: "image" },
    { name: "Image Histogram", nameHi: "इमेज हिस्टोग्राम", href: "/image-histogram", icon: "📊", description: "View RGB color distribution", descriptionHi: "RGB रंग वितरण देखें", category: "image" },
    { name: "Steganography", nameHi: "स्टेग्नोग्राफ़ी", href: "/steganography", icon: "🕵️", description: "Hide & reveal secret text in images", descriptionHi: "इमेज में गुप्त टेक्स्ट छिपाएं और प्रकट करें", category: "image" },
    { name: "Thumbnails", nameHi: "थंबनेल जनरेटर", href: "/thumbnail-generator", icon: "🗂️", description: "Generate standard square thumbnails in a ZIP", descriptionHi: "ज़िप में मानक वर्गाकार थंबनेल उत्पन्न करें", category: "image" },
    { name: "Image Diff", nameHi: "इमेज तुलनित्र", href: "/image-diff", icon: "🔍", description: "Highlight pixel differences between two images", descriptionHi: "दो छवियों के बीच पिक्सेल अंतर को हाइलाइट करें", category: "image" },
    { name: "Panorama Preview", nameHi: "पैनोरमा पूर्वावलोकन", href: "/panorama-preview", icon: "👀", description: "Immersive viewer for ultra-wide images", descriptionHi: "अल्ट्रा-वाइड इमेजों के लिए इमर्सिव व्यूअर", category: "image" },
    { name: "Pixelator", nameHi: "पिक्सेलेटर", href: "/pixelator", icon: "👾", description: "Turn photos into retro 8-bit style pixel art", descriptionHi: "फ़ोटो को रेट्रो 8-बिट पिक्सेल कला में बदलें", category: "image" },
    { name: "Mirror Effect", nameHi: "मिरर इफ़ेक्ट", href: "/mirror-effect", icon: "🪞", description: "Create symmetrical reflections", descriptionHi: "सममित प्रतिबिंब बनाएँ", category: "image" },
    { name: "Meme Maker", nameHi: "मेम मेकर", href: "/image-text-overlay", icon: "🅰️", description: "Add text overlays with classic meme styling", descriptionHi: "क्लासिक मेम स्टाइलिंग के साथ टेक्स्ट जोड़ें", category: "image" },
    { name: "Noise Generator", nameHi: "नॉयस जेनरेटर", href: "/noise-generator", icon: "🎞️", description: "Add randomized static and retro film grain", descriptionHi: "यादृच्छिक स्थैतिक और रेट्रो फ़िल्म ग्रेन जोड़ें", category: "image" },
    { name: "Make Transparent", nameHi: "पारदर्शी बनाएँ", href: "/make-transparent", icon: "🧪", description: "Click any color to make it transparent", descriptionHi: "किसी भी रंग को पारदर्शी बनाने के लिए उस पर क्लिक करें", category: "image" },
    { name: "Scan Cleaner", nameHi: "स्कैन क्लीनर", href: "/document-scan-cleaner", icon: "📄", description: "Turn photos of paper into clean B&W scans", descriptionHi: "कागज़ की तस्वीरों को स्वच्छ B&W स्कैन में बदलें", category: "image" },

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
    { name: "PDF to Text", nameHi: "PDF से टेक्स्ट", href: "/pdf-to-text", icon: "📝", description: "Extract all readable text from a PDF", descriptionHi: "PDF से सभी पठनीय पाठ निकालें", category: "pdf" },
    { name: "PDF Metadata Viewer", nameHi: "PDF मेटाडेटा देखें", href: "/pdf-metadata-viewer", icon: "ℹ️", description: "View PDF document metadata and properties", descriptionHi: "PDF दस्तावेज़ मेटाडेटा देखें", category: "pdf" },
    { name: "PDF Grayscale", nameHi: "PDF ग्रेस्केल", href: "/pdf-grayscale", icon: "⬛", description: "Convert PDF pages to grayscale", descriptionHi: "PDF पेज को ग्रेस्केल में बदलें", category: "pdf" },

    // ── Office Docs ────────────────────────────────────────────────────────────
    { name: "PDF to Word", nameHi: "PDF से Word बनाएँ", href: "/pdf-to-word", icon: "📝", description: "Convert PDF to editable Word (.docx)", descriptionHi: "PDF को एडिट करने लायक Word (.docx) में बदलें", category: "office" },
    { name: "Word to PDF", nameHi: "Word से PDF बनाएँ", href: "/word-to-pdf", icon: "📄", description: "Convert Word documents to PDF", descriptionHi: "Word डॉक्यूमेंट को PDF में बदलें", category: "office" },
    { name: "PDF to PowerPoint", nameHi: "PDF से PowerPoint", href: "/pdf-to-powerpoint", icon: "📊", description: "Convert PDF pages to editable slides (.pptx)", descriptionHi: "PDF को एडिटेबल PowerPoint (.pptx) में बदलें", category: "office" },
    { name: "PowerPoint to PDF", nameHi: "PowerPoint से PDF", href: "/powerpoint-to-pdf", icon: "📉", description: "Convert PPT/PPTX presentations to PDF", descriptionHi: "PPT/PPTX प्रेज़ेंटेशन को PDF में बदलें", category: "office" },
    { name: "PDF to Excel", nameHi: "PDF से Excel", href: "/pdf-to-excel", icon: "📈", description: "Extract tables from PDF into .xlsx spreadsheet", descriptionHi: "PDF से टेबल निकालकर Excel (.xlsx) में बदलें", category: "office" },
    { name: "Excel to PDF", nameHi: "Excel से PDF", href: "/excel-to-pdf", icon: "📋", description: "Convert Excel spreadsheets to PDF", descriptionHi: "Excel स्प्रेडशीट को PDF में बदलें", category: "office" },
    { name: "Edit PDF", nameHi: "PDF एडिट करें", href: "/edit-pdf", icon: "✏️", description: "Add text, draw, and annotate PDF pages", descriptionHi: "PDF पर टेक्स्ट लिखें, ड्रॉ करें और नोट्स लगाएँ", category: "office" },
    { name: "HTML to PDF", nameHi: "HTML से PDF", href: "/html-to-pdf", icon: "🌐", description: "Paste HTML or a URL and convert to PDF", descriptionHi: "HTML या URL से PDF बनाएँ", category: "office" },
    { name: "Translate PDF", nameHi: "PDF अनुवाद करें", href: "/translate-pdf", icon: "🌍", description: "Translate PDF text into 16+ languages — 100% offline", descriptionHi: "PDF का टेक्स्ट 16+ भाषाओं में अनुवाद करें — पूरी तरह ऑफलाइन", category: "office" },

    // ── OCR ────────────────────────────────────────────────────────────────────
    { name: "Image to Text", nameHi: "इमेज से टेक्स्ट निकालें", href: "/image-to-text", icon: "🔍", description: "OCR — extract text in English & Hindi", descriptionHi: "OCR — अंग्रेज़ी और हिंदी में टेक्स्ट निकालें", category: "ocr" },

    // ── Audio & Video ──────────────────────────────────────────────────────────
    { name: "Video to GIF", nameHi: "वीडियो से GIF", href: "/video-to-gif", icon: "🎞️", description: "Convert video clips into high-quality animated GIFs directly in browser", descriptionHi: "ब्राउज़र में वीडियो क्लिप को उच्च गुणवत्ता वाले एनिमेटेड GIF में बदलें", category: "video" },
    { name: "Video Trimmer", nameHi: "वीडियो ट्रिमर", href: "/video-trimmer", icon: "✂️", description: "Cut and trim down large video files precisely in your browser offline", descriptionHi: "ऑफ़लाइन अपने ब्राउज़र में बड़ी वीडियो फ़ाइलों को ठीक से काटें और ट्रिम करें", category: "video" },
    { name: "Video to Audio", nameHi: "वीडियो से ऑडियो निकालें", href: "/video-to-audio", icon: "🔉", description: "Extract the raw audio layer securely inside your browser", descriptionHi: "अपने ब्राउज़र के अंदर सुरक्षित रूप से ऑडियो ट्रैक निकालें", category: "audio" },
    { name: "Audio Converter", nameHi: "ऑडियो कनवर्टर", href: "/audio-converter", icon: "🎵", description: "Convert audio formats (MP3, WAV, AAC, OGG) completely offline", descriptionHi: "ऑडियो प्रारूपों को पूरी तरह से ऑफ़लाइन कनवर्ट करें", category: "audio" },
    { name: "Audio Trimmer", nameHi: "ऑडियो ट्रिमर", href: "/audio-trimmer", icon: "✂️", description: "Cut and extract specific sections of audio files natively", descriptionHi: "मूल रूप से ऑडियो फ़ाइलों के विशिष्ट अनुभागों को काटें और निकालें", category: "audio" },

    // ── Developer & SEO Tools ────────────────────────────────────────────────────────
    { name: "Meta Tags", nameHi: "मेटा टैग्स", href: "/meta-tag-generator", icon: "🔍", description: "Generate SEO meta tags and social cards", descriptionHi: "SEO मेटा टैग और सोशल कार्ड बनाएँ", category: "dev" },
    { name: "XML Sitemap", nameHi: "XML साइटमैप", href: "/sitemap-generator", icon: "🗺️", description: "Build valid sitemap.xml files for your site", descriptionHi: "अपनी साइट के लिए वैध sitemap.xml फ़ाइलें बनाएँ", category: "dev" },
    { name: "Robots.txt", nameHi: "Robots.txt", href: "/robots-txt-generator", icon: "🤖", description: "Generate robots.txt crawl directives", descriptionHi: "robots.txt क्रॉल निर्देश उत्पन्न करें", category: "dev" },
    { name: "UTM Builder", nameHi: "UTM बिल्डर", href: "/utm-builder", icon: "🔗", description: "Add custom parameters to URLs for tracking", descriptionHi: "ट्रैकिंग के लिए URL में कस्टम पैरामीटर जोड़ें", category: "dev" },
    { name: "Privacy Policy", nameHi: "गोपनीयता नीति", href: "/privacy-policy-generator", icon: "📋", description: "Generate standard Privacy Policy HTML", descriptionHi: "मानक गोपनीयता नीति HTML बनाएँ", category: "dev" },
    { name: "Random Generator", nameHi: "रैंडम जेनरेटर", href: "/random-generator", icon: "🎲", description: "Generate random numbers, passwords, dice, and coins", descriptionHi: "यादृच्छिक संख्याएं, पासवर्ड, डाइस आदि बनाएं", category: "dev" },
    { name: "Regex Tester", nameHi: "रेगेक्स टेस्टर", href: "/regex-tester", icon: "🧪", description: "Test regular expressions with live matching", descriptionHi: "लाइव मिलान के साथ रेगुलर एक्सप्रेशन का परीक्षण करें", category: "dev" },
    { name: "Regex Find & Replace", nameHi: "रेगेक्स खोजें और बदलें", href: "/regex-find-replace", icon: "🔄", description: "Search and replace text using regex patterns", descriptionHi: "रेगेक्स पैटर्न से टेक्स्ट खोजें और बदलें", category: "dev" },
    { name: "Text Case Converter", nameHi: "टेक्स्ट केस कन्वर्टर", href: "/text-case-converter", icon: "🔤", description: "Convert between UPPERCASE, lowercase, camelCase, PascalCase, snake_case, kebab-case", descriptionHi: "विभिन्न टेक्स्ट केस में बदलें", category: "dev" },
    { name: "Slug Generator", nameHi: "स्लग जनरेटर", href: "/slug-generator", icon: "🔗", description: "Generate URL-friendly slugs from text", descriptionHi: "टेक्स्ट से URL-फ्रेंडली स्लग बनाएँ", category: "dev" },
    { name: "Remove Duplicate Lines", nameHi: "डुप्लिकेट लाइन हटाएँ", href: "/remove-duplicate-lines", icon: "🧹", description: "Remove duplicate lines from text", descriptionHi: "टेक्स्ट से डुप्लिकेट लाइन हटाएँ", category: "dev" },
    { name: "Sort Lines", nameHi: "लाइन क्रमबद्ध करें", href: "/sort-lines", icon: "📊", description: "Sort text lines alphabetically or numerically", descriptionHi: "टेक्स्ट लाइन क्रमबद्ध करें", category: "dev" },
    { name: "Extract Emails", nameHi: "ईमेल निकालें", href: "/extract-emails", icon: "📧", description: "Extract email addresses from text", descriptionHi: "टेक्स्ट से ईमेल पते निकालें", category: "dev" },
    { name: "Extract URLs", nameHi: "URL निकालें", href: "/extract-urls", icon: "🌐", description: "Extract URLs from text", descriptionHi: "टेक्स्ट से URL निकालें", category: "dev" },
    { name: "Extract Phone Numbers", nameHi: "फ़ोन नंबर निकालें", href: "/extract-phones", icon: "📱", description: "Extract phone numbers from text", descriptionHi: "टेक्स्ट से फ़ोन नंबर निकालें", category: "dev" },
    { name: "CSV to JSON", nameHi: "CSV से JSON", href: "/csv-to-json", icon: "📊", description: "Convert CSV data to JSON array", descriptionHi: "CSV डेटा को JSON में बदलें", category: "dev" },
    { name: "XML to JSON", nameHi: "XML से JSON", href: "/xml-to-json", icon: "📑", description: "Convert XML to JSON format", descriptionHi: "XML को JSON में बदलें", category: "dev" },
    { name: "JWT Generator", nameHi: "JWT जनरेटर", href: "/jwt-generator", icon: "🔑", description: "Generate signed JWT tokens", descriptionHi: "साइन्ड JWT टोकन बनाएँ", category: "dev" },
    { name: "HTML Entity", nameHi: "HTML एंटिटी", href: "/html-entity", icon: "🏷️", description: "Encode and decode HTML entities", descriptionHi: "HTML एंटिटी एन्कोड/डिकोड करें", category: "dev" },
    { name: "Code Beautifier", nameHi: "कोड ब्यूटिफायर", href: "/code-beautifier", icon: "✨", description: "Beautify and format JS, CSS, HTML, JSON code", descriptionHi: "कोड को सुंदर और पढ़ने लायक बनाएँ", category: "dev" },
    { name: "Unix Permissions", nameHi: "Unix अनुमतियाँ", href: "/unix-permissions", icon: "🔐", description: "Calculate Unix file permissions (rwx)", descriptionHi: "Unix फ़ाइल अनुमतियों की गणना करें", category: "dev" },
    { name: "File Hash Compare", nameHi: "फ़ाइल हैश तुलना", href: "/file-hash-compare", icon: "🔍", description: "Compare hashes of two files", descriptionHi: "दो फ़ाइलों के हैश की तुलना करें", category: "dev" },
    { name: "Cron Builder", nameHi: "क्रॉन बिल्डर", href: "/cron-builder", icon: "⏰", description: "Generate cron scheduling expressions", descriptionHi: "क्रॉन शेड्यूलिंग एक्सप्रेशन जनरेट करें", category: "dev" },
    { name: "XML Formatter", nameHi: "XML फ़ॉर्मेटर", href: "/xml-formatter", icon: "📑", description: "Format and prettify XML strings", descriptionHi: "XML स्ट्रिंग्स को फ़ॉर्मेट और पढ़ने लायक बनाएँ", category: "dev" },
    { name: "JSON Formatter", nameHi: "JSON फ़ॉर्मेटर", href: "/json-formatter", icon: "📐", description: "Prettify JSON data", descriptionHi: "JSON डेटा को पढ़ने लायक बनाएँ", category: "dev" },
    { name: "JSON Minifier", nameHi: "JSON मिनिफ़ायर", href: "/json-minifier", icon: "🗜️", description: "Remove whitespace from JSON", descriptionHi: "JSON से खाली जगह हटाएँ", category: "dev" },
    { name: "JSON Validator", nameHi: "JSON वैलिडेटर", href: "/json-validator", icon: "✔️", description: "Live JSON syntax checking", descriptionHi: "लाइव JSON सिंटैक्स जांच", category: "dev" },

    { name: "JSON <> CSV", nameHi: "JSON ↔ CSV कन्वर्टर", href: "/json-csv", icon: "📊", description: "Convert JSON to CSV and back", descriptionHi: "JSON को CSV में और CSV को JSON में बदलें", category: "dev" },
    { name: "SQL Formatter", nameHi: "SQL फ़ॉर्मेटर", href: "/sql-formatter", icon: "💾", description: "Prettify SQL queries", descriptionHi: "SQL क्वेरी को सुंदर और पढ़ने लायक बनाएँ", category: "dev" },
    { name: "Diff Checker", nameHi: "डिफ़ चेकर", href: "/diff-checker", icon: "⚖️", description: "Compare text differences", descriptionHi: "दो टेक्स्ट के बीच का फ़र्क देखें", category: "dev" },
    { name: "Markdown Editor", nameHi: "मार्कडाउन एडिटर", href: "/markdown-editor", icon: "📝", description: "Live preview Markdown editor", descriptionHi: "लाइव प्रीव्यू मार्कडाउन एडिटर", category: "dev" },
    { name: "Lorem Ipsum", nameHi: "लोरेम इप्सम", href: "/lorem-ipsum", icon: "📝", description: "Generate placeholder text", descriptionHi: "डमी/प्लेसहोल्डर टेक्स्ट बनाएँ", category: "dev" },
    { name: "Unit Converter", nameHi: "यूनिट कन्वर्टर", href: "/unit-converter", icon: "🧮", description: "Convert Length, Weight, Temp, etc.", descriptionHi: "लंबाई, वज़न, तापमान आदि बदलें", category: "dev" },
    { name: "Timestamp Converter", nameHi: "टाइमस्टैम्प कन्वर्टर", href: "/timestamp-converter", icon: "⏱️", description: "Epoch <-> Human Date", descriptionHi: "Epoch ↔ तारीख़ / समय में बदलें", category: "dev" },
    { name: "Currency Converter", nameHi: "करेंसी कन्वर्टर", href: "/currency-converter", icon: "💱", description: "Real-time exchange rates", descriptionHi: "लाइव एक्सचेंज रेट के साथ मुद्रा बदलें", category: "dev" },
    { name: "Word Counter", nameHi: "वर्ड काउंटर", href: "/word-counter", icon: "📝", description: "Count words, characters, and sentences", descriptionHi: "शब्द, अक्षर और वाक्य गिनें", category: "dev" },
    { name: "Base64 Encoder", nameHi: "Base64 एन्कोडर", href: "/base64", icon: "🔄", description: "Base64 encode & decode", descriptionHi: "Base64 एन्कोड और डिकोड करें", category: "dev" },
    { name: "URL Encoder", nameHi: "URL एन्कोडर", href: "/url-encoder", icon: "🔗", description: "Encode & decode URLs", descriptionHi: "URL एन्कोड और डिकोड करें", category: "dev" },

    // ── Design Tools ───────────────────────────────────────────────────────────
    { name: "Gradient Gen", nameHi: "ग्रेडिएंट जनरेटर", href: "/gradient-generator", icon: "🌈", description: "Create CSS gradients", descriptionHi: "CSS के लिए ग्रेडिएंट बनाएँ", category: "design" },
    { name: "Box Shadow", nameHi: "बॉक्स शैडो", href: "/box-shadow-generator", icon: "📦", description: "Create CSS box shadows", descriptionHi: "सुंदर CSS बॉक्स शैडो बनाएँ", category: "design" },
    { name: "Glassmorphism", nameHi: "ग्लासमॉर्फ़िज़्म", href: "/glassmorphism-generator", icon: "💠", description: "Frosted glass CSS effects", descriptionHi: "फ्रॉस्टेड ग्लास CSS प्रभाव", category: "design" },

    // ── Security Tools ─────────────────────────────────────────────────────────
    { name: "Hash Generator", nameHi: "हैश जनरेटर", href: "/hash-generator", icon: "🔐", description: "MD5, SHA-256 string hashing", descriptionHi: "MD5, SHA-256 स्ट्रिंग हैशिंग", category: "security" },
    { name: "Password Gen", nameHi: "पासवर्ड जनरेटर", href: "/password-generator", icon: "🔑", description: "Generate secure, random passwords", descriptionHi: "मज़बूत और सुरक्षित पासवर्ड बनाएँ", category: "security" },
    { name: "Password Strength", nameHi: "पासवर्ड स्ट्रेंथ", href: "/password-strength", icon: "🛡️", description: "Test password security offline", descriptionHi: "ऑफ़लाइन पासवर्ड सुरक्षा जांचें", category: "security" },
    { name: "JWT Decoder", nameHi: "JWT डिकोडर", href: "/jwt-decoder", icon: "🎫", description: "Decode JSON Web Tokens", descriptionHi: "JSON वेब टोकन डिकोड करें", category: "security" },

    // ── Career & Productivity Tools ──────────────────────────────────────────────────
    { name: "Invoice Generator", nameHi: "बिल जनरेटर", href: "/invoice-generator", icon: "🧾", description: "Create professional, calculating invoices", descriptionHi: "पेशेवर बिल और चालान बनाएँ", category: "productivity" },
    { name: "Resume Builder", nameHi: "बायोडाटा बिल्डर", href: "/resume-builder", icon: "📄", description: "Create professional ATS-friendly resumes", descriptionHi: "पेशेवर ATS-अनुकूल बायोडाटा बनाएँ", category: "productivity" },

    // ── Productivity Tools ─────────────────────────────────────────────────────
    { name: "Decision Matrix", nameHi: "निर्णय मैट्रिक्स", href: "/decision-matrix", icon: "⚖️", description: "Evaluate options based on weighted criteria", descriptionHi: "विकल्पों का मूल्यांकन करें", category: "productivity" },
    { name: "Todo List", nameHi: "टू-डू लिस्ट", href: "/todo-list", icon: "✅", description: "Minimal, priority-based task manager", descriptionHi: "प्राथमिकता-आधारित कार्य प्रबंधक", category: "productivity" },
    { name: "Habit Tracker", nameHi: "हैबिट ट्रैकर", href: "/habit-tracker", icon: "🌱", description: "Daily habit tracker with streaks", descriptionHi: "दैनिक आदत ट्रैकर", category: "productivity" },
    { name: "Note Pad", nameHi: "नोटपैड", href: "/note-pad", icon: "📝", description: "Online auto-saving notepad with txt export", descriptionHi: "ऑटो-सेविंग ऑनलाइन नोटपैड", category: "productivity" },
    { name: "Flashcards", nameHi: "फ़्लैशकार्ड", href: "/flashcard-creator", icon: "🃏", description: "Create and study flashcards offline", descriptionHi: "ऑफ़लाइन फ़्लैशकार्ड बनाएँ और अध्ययन करें", category: "productivity" },
    { name: "Quiz Creator", nameHi: "क्विज़ निर्माता", href: "/quiz-creator", icon: "❓", description: "Build and play multiple-choice quizzes", descriptionHi: "बहुविकल्पीय क्विज़ बनाएँ और खेलें", category: "productivity" },
    { name: "Pomodoro Timer", nameHi: "पोमोडोरो टाइमर", href: "/pomodoro", icon: "🍅", description: "Focus & break timer", descriptionHi: "फोकस और ब्रेक के लिए टाइमर", category: "productivity" },
    { name: "Age Calculator", nameHi: "आयु कैलकुलेटर", href: "/age-calculator", icon: "🎂", description: "Calculate accurate age in years, months, days", descriptionHi: "साल, महीने और दिन के साथ सटीक आयु गिनें", category: "productivity" },
    { name: "Date Difference", nameHi: "दिनांक अंतर", href: "/date-difference", icon: "📅", description: "Find the exact difference between two dates", descriptionHi: "दो तिथियों के बीच का सटीक अंतर निकालें", category: "productivity" },
    { name: "Timezone Converter", nameHi: "समय क्षेत्र परिवर्तक", href: "/timezone-converter", icon: "🌍", description: "Convert time across global timezones", descriptionHi: "विश्व स्तर पर समय क्षेत्रों के बीच समय बदलें", category: "productivity" },

    // ── Calculator Tools ─────────────────────────────────────────────────────
    { name: "SIP Calculator", nameHi: "SIP कैलकुलेटर", href: "/sip-calculator", icon: "📈", description: "Calculate mutual fund SIP returns", descriptionHi: "म्यूचुअल फंड SIP रिटर्न की गणना करें", category: "calculators" },
    { name: "EMI Calculator", nameHi: "EMI कैलकुलेटर", href: "/emi-calculator", icon: "🏦", description: "Calculate loan Equated Monthly Installments", descriptionHi: "ऋण की समान मासिक किस्तों (EMI) की गणना करें", category: "calculators" },
    { name: "BMI Calculator", nameHi: "BMI कैलकुलेटर", href: "/bmi-calculator", icon: "⚖️", description: "Check your Body Mass Index (BMI)", descriptionHi: "अपने बॉडी मास इंडेक्स (BMI) की जाँच करें", category: "calculators" },
    { name: "GST Calculator", nameHi: "GST कैलकुलेटर", href: "/gst-calculator", icon: "🧾", description: "Add or remove Goods and Services Tax", descriptionHi: "वस्तु एवं सेवा कर (GST) जोड़ें या निकालें", category: "calculators" },
    { name: "Income Tax Calculator", nameHi: "आयकर कैलकुलेटर", href: "/income-tax-calculator", icon: "🇮🇳", description: "Estimate Indian income tax (Old vs New)", descriptionHi: "भारतीय आयकर (Old vs New Regime) का अनुमान लगाएं", category: "calculators" },
    { name: "TDEE Calculator", nameHi: "TDEE कैलकुलेटर", href: "/tdee-calculator", icon: "🔥", description: "Calculate Total Daily Energy Expenditure", descriptionHi: "कुल दैनिक ऊर्जा व्यय (TDEE) और मैक्रोज़ की गणना करें", category: "calculators" },

    // ── Generator Tools ──────────────────────────────────────────────────────
    { name: "QR Generator", nameHi: "QR जनरेटर", href: "/qr-generator", icon: "📱", description: "Create custom QR codes instantly", descriptionHi: "तुरंत कस्टम QR कोड बनाएं", category: "generators" },
    { name: "Barcode Generator", nameHi: "बारकोड जनरेटर", href: "/barcode-generator", icon: "🛒", description: "Generate 1D barcodes like EAN, UPC, CODE128", descriptionHi: "EAN, UPC, CODE128 जैसे 1D बारकोड जनरेट करें", category: "generators" },

    // ── Archive Tools ────────────────────────────────────────────────────────
    { name: "ZIP Creator", nameHi: "ZIP निर्माता", href: "/zip-creator", icon: "🗜️", description: "Compress multiple files into a ZIP archive", descriptionHi: "एकाधिक फ़ाइलों को ZIP में संपीड़ित करें", category: "archive" },
    { name: "ZIP Extractor", nameHi: "ZIP एक्सट्रैक्टर", href: "/zip-extractor", icon: "📦", description: "Open and extract files from ZIP archives", descriptionHi: "ZIP अभिलेखागार से फ़ाइलें खोलें और निकालें", category: "archive" },
    { name: "ZIP Password Protector", nameHi: "ZIP पासवर्ड प्रोटेक्टर", href: "/zip-password-protector", icon: "🔐", description: "Create password-protected ZIP archives", descriptionHi: "पासवर्ड-सुरक्षित ZIP आर्काइव बनाएँ", category: "archive" },

    // ── Design & Developer Tools ─────────────────────────────────────────────
    { name: "Color Picker", nameHi: "कलर पिकर", href: "/color-picker", icon: "🎨", description: "Pick colors and convert HEX, RGB, HSL", descriptionHi: "रंग चुनें और HEX, RGB, HSL कन्वर्ट करें", category: "design" },
    { name: "CSS Generator", nameHi: "CSS जनरेटर", href: "/css-generator", icon: "✨", description: "Generate Box Shadows, Border Radiuses, and Glassmorphism", descriptionHi: "विभिन्न CSS प्रभाव जनरेट करें", category: "design" },
    { name: "Color Contrast", nameHi: "कलर कंट्रास्ट", href: "/color-contrast", icon: "👀", description: "Check text readability against WCAG standards", descriptionHi: "WCAG मानकों के अनुसार टेक्स्ट पठनीयता जांचें", category: "design" },
    { name: "Palette Generator", nameHi: "पैलेट जनरेटर", href: "/palette-generator", icon: "🌈", description: "Generate harmonious color schemes from a base color", descriptionHi: "आधार रंग से सामंजस्यपूर्ण रंग योजनाएं उत्पन्न करें", category: "design" },

    { name: "Favicon Generator", nameHi: "फ़ेविकॉन जनरेटर", href: "/favicon-generator", icon: "🌟", description: "Resize images to standard favicon sizes instantly", descriptionHi: "छवियों को तुरंत मानक फ़ेविकॉन आकारों में बदलें", category: "design" },
    { name: "Color Blindness", nameHi: "कलर ब्लाइंडनेस", href: "/color-blindness-simulator", icon: "👓", description: "Simulate color vision deficiencies on your images", descriptionHi: "अपनी छवियों पर रंग दृष्टि की कमी का अनुकरण करें", category: "design" },
    { name: "SVG Optimizer", nameHi: "SVG ऑप्टिमाइज़र", href: "/svg-optimizer", icon: "✂️", description: "Clean and minify your SVG graphics to save size", descriptionHi: "आकार बचाने के लिए अपने SVG ग्राफिक्स को साफ़ और छोटा करें", category: "design" },

    // ── Time & Date Tools ────────────────────────────────────────────────────
    { name: "World Clock", nameHi: "वर्ल्ड क्लॉक", href: "/world-clock", icon: "🌍", description: "Track exact timezones live across the globe", descriptionHi: "दुनिया भर में लाइव सटीक समयक्षेत्र ट्रैक करें", category: "time" },
    { name: "Countdown Timer", nameHi: "उलटी गिनती", href: "/countdown-timer", icon: "⏳", description: "Mathematical countdown to specific upcoming events", descriptionHi: "विशिष्ट आगामी घटनाओं के लिए गणितीय उलटी गिनती", category: "time" },
    { name: "Stopwatch", nameHi: "स्टॉपवॉच", href: "/stopwatch", icon: "⏱️", description: "Precision millisecond timer and lap recording", descriptionHi: "सटीक मिलीसेकंड टाइमर और लैप रिकॉर्डिंग", category: "time" },
    { name: "Sunrise & Sunset", nameHi: "सूर्योदय व सूर्यास्त", href: "/sunrise-sunset", icon: "🌅", description: "Precise astronomical solar times for any location", descriptionHi: "किसी भी स्थान के लिए सटीक खगोलीय सौर समय", category: "time" },
    { name: "Calendar Generator", nameHi: "कैलेंडर जेनरेटर", href: "/calendar-generator", icon: "📆", description: "Generate printable monthly calendars", descriptionHi: "प्रिंट करने योग्य मासिक कैलेंडर जेनरेट करें", category: "time" },

    // ── Edge AI Vision Tools ─────────────────────────────────────────────────
    { name: "Object Detection", nameHi: "ऑब्जेक्ट डिटेक्शन", href: "/object-detection", icon: "🔍", description: "Detect 80+ objects in images and webcams entirely offline", descriptionHi: "ऑफ़लाइन रूप से 80+ वस्तुओं का पता लगाएं", category: "ai" },
    { name: "Face Detection", nameHi: "फेस डिटेक्शन", href: "/face-detection", icon: "👤", description: "Detect faces and blur them for privacy offline", descriptionHi: "चेहरों का पता लगाएं और उन्हें धुंधला करें", category: "ai" },
    { name: "Pose Estimation", nameHi: "पोज़ एस्टीमेशन", href: "/pose-estimation", icon: "🏃‍♂️", description: "Detect human body joints and draw skeleton overlays", descriptionHi: "मानव शरीर के अंगों का पता लगाएं और कंकाल बनाएं", category: "ai" },
    { name: "Image Classifier", nameHi: "इमेज क्लासिफायर", href: "/image-classifier", icon: "🏷️", description: "Identify main subject of images across 1000 categories offline", descriptionHi: "ऑफ़लाइन 1000 श्रेणियों में छवियों के मुख्य विषय की पहचान करें", category: "ai" },
    { name: "Photo Filters", nameHi: "फोटो फिल्टर", href: "/instagram-filters", icon: "🎨", description: "Apply 15+ famous photo filters instantly in your browser", descriptionHi: "अपने ब्राउज़र में तुरंत 15+ प्रसिद्ध फोटो फिल्टर लागू करें", category: "ai" },

    // ── India-Specific & Career Tools ────────────────────────────────────────
    { name: "PAN Validator", nameHi: "पैन वैलिडेटर", href: "/pan-validator", icon: "💳", description: "Verify Indian PAN structures and decode the entity statuses", descriptionHi: "भारतीय पैन संरचनाओं को सत्यापित करें और स्थिति को डिकोड करें", category: "finance" },
    { name: "GSTIN Validator", nameHi: "जीएसटीआईएन वैलिडेटर", href: "/gstin-validator", icon: "🏢", description: "Verify 15-digit GSTIN structures and map state codes", descriptionHi: "15-अंकीय GSTIN संरचनाओं को सत्यापित करें", category: "finance" },
    { name: "IFSC Validator", nameHi: "आईएफएससी वैलिडेटर", href: "/ifsc-validator", icon: "🏦", description: "Verify 11-character bank branch codes for fund transfers", descriptionHi: "फंड ट्रांसफर के लिए 11-वर्ण वाले बैंक शाखा कोड सत्यापित करें", category: "finance" },
    { name: "Aadhaar Masker", nameHi: "आधार मास्क", href: "/aadhaar-mask", icon: "🛡️", description: "Securely hide the first 8 digits of your Aadhaar for safe sharing", descriptionHi: "सुरक्षित साझाकरण के लिए अपने आधार के पहले 8 अंकों को सुरक्षित रूप से छिपाएं", category: "finance" },

    // ── Database Utilities ───────────────────────────────────────────────────
    { name: "UUID Generator", nameHi: "UUID जेनरेटर", href: "/uuid-generator", icon: "🆔", description: "Generate v1 and v4 universally unique identifiers (UUID)", descriptionHi: "v1 और v4 पहचानकर्ता (UUID) उत्पन्न करें", category: "developer" },
    { name: "Mongo ObjectId", nameHi: "Mongo ObjectId", href: "/mongo-objectid", icon: "📦", description: "Generate ObjectIds and decode creation timestamps natively", descriptionHi: "ObjectId बनाएं और टाइमस्टैम्प को डिकोड करें", category: "developer" },
    { name: "Bcrypt Generator", nameHi: "Bcrypt जेनरेटर", href: "/bcrypt-generator", icon: "🔐", description: "Hash passwords and verify against bcrypt strings securely", descriptionHi: "पासवर्ड हैश करें और bcrypt स्ट्रिंग्स के खिलाफ सुरक्षित रूप से सत्यापित करें", category: "developer" },
    { name: "JSON to SQL", nameHi: "JSON से SQL", href: "/json-to-sql", icon: "📝", description: "Convert JSON arrays directly into SQL INSERT statements", descriptionHi: "JSON एरे को सीधे SQL INSERT स्टेटमेंट में बदलें", category: "developer" },
    { name: "CSV to SQL", nameHi: "CSV से SQL", href: "/csv-to-sql", icon: "📊", description: "Convert CSV data rows into formatted SQL inserts instantly", descriptionHi: "CSV डेटा को तुरंत SQL इंसर्ट में बदलें", category: "developer" },
    { name: "YAML to JSON", nameHi: "YAML से JSON", href: "/yaml-to-json", icon: "🔄", description: "Two-way live format converter between YAML and JSON", descriptionHi: "YAML और JSON के बीच लाइव प्रारूप कनवर्टर", category: "developer" },

    // ── Newly Added Tools ────────────────────────────────────────────────────
    { name: "PDF Form Filler", nameHi: "PDF फ़ॉर्म भरें", href: "/pdf-form-filler", icon: "✍️", description: "Fill interactive PDF forms", descriptionHi: "इंटरैक्टिव PDF फ़ॉर्म भरें", category: "pdf" },
    { name: "PDF Redaction", nameHi: "PDF रिडैक्शन", href: "/pdf-redaction", icon: "⬛", description: "Redact sensitive information from PDFs", descriptionHi: "PDF से संवेदनशील जानकारी छिपाएँ", category: "pdf" },
    { name: "Audio Recorder", nameHi: "ऑडियो रिकॉर्डर", href: "/audio-recorder", icon: "🎙️", description: "Record audio from your microphone", descriptionHi: "माइक्रोफ़ोन से ऑडियो रिकॉर्ड करें", category: "audio" },
    { name: "Waveform Viewer", nameHi: "वेवफ़ॉर्म व्यूअर", href: "/audio-waveform-viewer", icon: "〰️", description: "Visualize audio waveforms", descriptionHi: "ऑडियो वेवफ़ॉर्म देखें", category: "audio" },
    { name: "Audio Visualizer", nameHi: "ऑडियो विज़ुअलाइज़र", href: "/audio-visualizer", icon: "🎶", description: "Real-time audio visualizer", descriptionHi: "रियल-टाइम ऑडियो विज़ुअलाइज़र", category: "audio" },
    { name: "Audio Mixer", nameHi: "ऑडियो मिक्सर", href: "/audio-mixer", icon: "🎛️", description: "Mix multiple audio tracks", descriptionHi: "कई ऑडियो ट्रैक मिक्स करें", category: "audio" },
    { name: "BPM Counter", nameHi: "BPM काउंटर", href: "/bpm-counter", icon: "⏱️", description: "Tap to find the BPM of a song", descriptionHi: "गाने का BPM जानने के लिए टैप करें", category: "audio" },
    { name: "Video Compressor", nameHi: "वीडियो कंप्रेसर", href: "/video-compressor", icon: "🗜️", description: "Compress video files in browser", descriptionHi: "ब्राउज़र में वीडियो फ़ाइलें कंप्रेस करें", category: "video" },
    { name: "Extract Frames", nameHi: "फ्रेम निकालें", href: "/video-thumbnail-extract", icon: "🎞️", description: "Extract frames from a video", descriptionHi: "वीडियो से फ्रेम निकालें", category: "video" },
    { name: "Video Watermark", nameHi: "वीडियो वॉटरमार्क", href: "/video-watermark", icon: "💧", description: "Add image watermarks to videos", descriptionHi: "वीडियो पर इमेज वॉटरमार्क लगाएँ", category: "video" },
    { name: "Green Screen", nameHi: "ग्रीन स्क्रीन", href: "/video-green-screen", icon: "🟩", description: "Remove green screen from videos", descriptionHi: "वीडियो से ग्रीन स्क्रीन हटाएँ", category: "video" },
    { name: "Burn Subtitles", nameHi: "सबटाइटल बर्न करें", href: "/burn-subtitles", icon: "💬", description: "Hardcode subtitles into videos", descriptionHi: "वीडियो में सबटाइटल बर्न करें", category: "video" },
    { name: "Video Mute", nameHi: "वीडियो म्यूट", href: "/video-mute", icon: "🔇", description: "Remove audio from videos", descriptionHi: "वीडियो से ऑडियो हटाएँ", category: "video" },
    { name: "QR Generator (Logo)", nameHi: "कस्टम QR (लोगो)", href: "/qr-with-logo", icon: "📱", description: "Create QR codes with a custom logo", descriptionHi: "कस्टम लोगो के साथ QR कोड बनाएँ", category: "generators" },
    { name: "QR Decoder", nameHi: "QR डिकोडर", href: "/qr-decoder", icon: "🔍", description: "Scan and decode QR code images", descriptionHi: "QR कोड इमेज स्कैन और डिकोड करें", category: "dev" },
    { name: "Archive Extractor", nameHi: "आर्काइव एक्सट्रैक्टर", href: "/archive-extractor", icon: "📦", description: "Extract ZIP files in browser", descriptionHi: "ब्राउज़र में ZIP फ़ाइलें एक्सट्रैक्ट करें", category: "archive" },
    { name: "Archive Previewer", nameHi: "आर्काइव प्रीव्यूअर", href: "/archive-preview", icon: "👀", description: "View ZIP contents without extracting", descriptionHi: "बिना निकाले ZIP सामग्री देखें", category: "archive" },
    { name: "Dummy Image Gen", nameHi: "डमी इमेज", href: "/dummy-image-generator", icon: "🖼️", description: "Generate placeholder dummy images", descriptionHi: "प्लेसहोल्डर डमी इमेज जनरेट करें", category: "design" },
    { name: "JSON to Excel", nameHi: "JSON से Excel", href: "/json-to-excel", icon: "📊", description: "Convert JSON arrays to Excel files", descriptionHi: "JSON को Excel में बदलें", category: "developer" },
    { name: "Excel to JSON", nameHi: "Excel से JSON", href: "/excel-to-json", icon: "📄", description: "Convert Excel sheets to JSON", descriptionHi: "Excel को JSON में बदलें", category: "developer" },
    { name: "Simple Paint", nameHi: "सिंपल पेंट", href: "/simple-paint", icon: "🖌️", description: "Simple online drawing tool", descriptionHi: "सिंपल ऑनलाइन ड्रॉइंग टूल", category: "design" },
    { name: "ICS Generator", nameHi: "ICS जनरेटर", href: "/ics-generator", icon: "📅", description: "Generate iCalendar (.ics) files", descriptionHi: "iCalendar (.ics) फ़ाइलें बनाएँ", category: "time" },
    { name: "Time Tracker", nameHi: "टाइम ट्रैकर", href: "/time-tracker", icon: "⏱️", description: "Simple task time tracker", descriptionHi: "सिंपल टास्क टाइम ट्रैकर", category: "productivity" },
    { name: "Panchang", nameHi: "पंचांग", href: "/panchang", icon: "🕉️", description: "Daily Panchang and sun times", descriptionHi: "दैनिक पंचांग और सूर्य का समय", category: "time" },
    { name: "Compound Interest", nameHi: "चक्रवृद्धि ब्याज", href: "/compound-interest", icon: "📈", description: "Calculate compound interest", descriptionHi: "चक्रवृद्धि ब्याज की गणना करें", category: "calculators" },
    { name: "Matrix Calculator", nameHi: "मैट्रिक्स कैलकुलेटर", href: "/matrix-calculator", icon: "🧮", description: "Matrix addition, multiplication, det", descriptionHi: "मैट्रिक्स कैलकुलेटर", category: "calculators" },
    { name: "Graphing Calculator", nameHi: "ग्राफिंग कैलकुलेटर", href: "/graphing-calculator", icon: "📈", description: "Plot mathematical functions", descriptionHi: "गणितीय कार्यों को आलेखित करें", category: "calculators" },
    { name: "Statistics Calculator", nameHi: "सांख्यिकी कैलकुलेटर", href: "/statistics-calculator", icon: "📊", description: "Calculate mean, median, mode, etc.", descriptionHi: "सांख्यिकी कैलकुलेटर", category: "calculators" },
    { name: "Image Effects", nameHi: "इमेज इफ़ेक्ट", href: "/image-effects", icon: "✨", description: "Apply filters and effects to images", descriptionHi: "इमेज पर फ़िल्टर और प्रभाव लागू करें", category: "ai" },
    { name: "Style Transfer", nameHi: "स्टाइल ट्रांसफ़र", href: "/style-transfer", icon: "🎨", description: "Apply artistic styles to photos", descriptionHi: "फ़ोटो पर कलात्मक स्टाइल्स लागू करें", category: "ai" },
];
