import { Metadata } from "next";

const BASE_URL = "https://forgetech.vercel.app";

/**
 * SEO metadata definitions for all tool pages.
 * Each key corresponds to a route directory under /app/.
 */
export const PAGE_SEO: Record<
  string,
  { title: string; description: string; keywords: string; titleHi?: string; descriptionHi?: string }
> = {
  "resize-image": {
    title:
      "Resize Image Online Free — Change Dimensions (PX, CM, MM) & File Size",
    description:
      "Resize images online for free. Set custom pixels, centimeters, or millimeters. Compress to 20KB, 50KB for SSC, UPSC exams & passport photos. No sign-up.",
    keywords:
      "image resizer free online, resize image online free, photo resizer online free, reduce image size online, shrink image file size, resize image, image resizer, resize photo, change photo size, resize image to 20kb, resize image to 50kb, ssc photo resizer, upsc photo resize, resize jpg, resize png, how to resize an image online for free",
  },
  "compress-image": {
    title: "Compress Image Online Free — Reduce JPG/PNG Size (KB/MB)",
    description:
      "Compress images to specific KB (20KB, 50KB, 100KB) without losing quality. Best for exam forms, email attachments & web speed. Free & secure.",
    keywords:
      "free online image compressor, compress image online free, photo compressor online free, compress jpeg online, compress png online, reduce image size online, compress image, reduce image size, image compressor, compress jpeg to 100kb, compress image to 20kb, photo compressor, reduce photo size, compress png, optimize images, image size reducer, how to compress an image without losing quality",
  },
  "convert-image": {
    title: "Convert Image Format Online — JPG, PNG, WebP, HEIC Converter",
    description:
      "Convert images between JPG, PNG, WebP, HEIC & PDF. Fast, free bulk converter. Works on mobile & desktop. Privacy-first.",
    keywords:
      "convert image, image converter, jpg to png, png to jpg, heic to jpg, webp to jpg, image format converter, photo converter online, free image converter, bulk image converter",
  },
  "image-to-pdf": {
    title: "Image to PDF Converter — Convert JPG/PNG to PDF Free",
    description:
      "Convert JPG, PNG, or HEIC images to high-quality PDF. Combine multiple photos into one PDF document. Fast & secure.",
    keywords:
      "image to pdf, jpg to pdf, png to pdf, photo to pdf, convert image to pdf, combine images to pdf, jpg to pdf converter, create pdf from images, free pdf creator",
  },
  "passport-photo-maker": {
    title: "Passport Photo Maker — Create ID Photos Online (India & Global)",
    description:
      "Create passport size photos (35x45mm, 2x2 inch) online. Auto-resize, white background. Perfect for Visa, Passport, PAN Card, Aadhaar. Free.",
    keywords:
      "passport photo maker, passport size photo, 35x45mm photo, 2x2 inch photo, visa photo maker, indian passport photo, us passport photo, id photo maker, passport photo online free, pan card photo size",
  },
  "image-to-text": {
    title: "Image to Text (OCR) — Extract Text from Images & Scans",
    description:
      "Free online OCR to extract text from images, scanned documents, and screenshots. Supports English, Hindi, and 100+ languages. Copy text instantly.",
    keywords:
      "image to text, ocr online, extract text from image, photo to text, picture to text, ocr scanner, convert image to text, copy text from image, free ocr tool, hindi ocr",
  },
  "pdf-merge": {
    title: "Merge PDF Online — Combine Multiple PDFs for Free",
    description:
      "Merge PDFs into one file online. Drag & drop to combine multiple PDF documents. Secure, fast, and 100% free. No watermarks.",
    keywords:
      "merge pdf, combine pdf, join pdf, pdf merger, merge pdf files, combine pdf online, pdf joiner, merge documents, free pdf merger",
  },
  "pdf-split": {
    title: "Split PDF Online — Extract Pages from PDF Free",
    description:
      "Split PDF files or extract specific pages online. Separate PDF documents instantly. Secure & privacy-first.",
    keywords:
      "split pdf, extract pdf pages, pdf splitter, separate pdf pages, cut pdf, split pdf online, pdf page extractor, free pdf splitter",
  },
  "pdf-to-image": {
    title: "PDF to Image Converter — Save PDF as JPG, PNG, WebP",
    description:
      "Convert PDF pages to high-quality images (JPG, PNG). Securely turn PDF documents into separate photos online. Free.",
    keywords:
      "pdf to image, pdf to jpg, pdf to png, convert pdf to jpg, save pdf as image, pdf to picture, pdf to photo, free pdf to image converter",
  },
  "compress-pdf": {
    title: "Compress PDF Online — Reduce PDF File Size Free",
    description:
      "Compress PDF files to 100KB, 200KB, or less. Optimize PDFs for email & web uploads. Maintain quality while reducing size.",
    keywords:
      "compress pdf, reduce pdf size, pdf compressor, shrink pdf, compress pdf online, reduce pdf file size, optimize pdf, pdf size reducer, compress pdf to 100kb",
  },
  "esign-pdf": {
    title: "eSign PDF Online — Create & Add Electronic Signatures",
    description:
      "Sign PDF documents online for free. Draw, type, or upload your signature. Secure, legally binding electronic signatures. No sign-up.",
    keywords:
      "esign pdf, sign pdf, electronic signature, digital signature free, sign pdf online, add signature to pdf, pdf signer, online signature maker",
  },
  "watermark-image": {
    title: "Add Watermark to Image — Protect Photos Online",
    description:
      "Add text or logo watermarks to images online. customizable font, color, transparency. Protect your photography copyright. Free.",
    keywords:
      "watermark image, add watermark, photo watermark, watermark maker, copyright image, protect photos, watermarker online",
  },
  "watermark-pdf": {
    title: "Add Watermark to PDF — Stamp & Protect PDFs",
    description:
      "Add text watermarks to PDF pages. Stamp confidential or draft labels. Batch process multiple files. Free & secure.",
    keywords:
      "watermark pdf, stamp pdf, add watermark to pdf, pdf watermark, protect pdf, pdf stamp online",
  },
  "password-pdf": {
    title: "Protect PDF — Encrypt & Lock PDF Files Online",
    description:
      "Password protect PDF files with strong encryption. Secure your confidential documents online. Free & private.",
    keywords:
      "password protect pdf, lock pdf, encrypt pdf, secure pdf, pdf security, add password to pdf, protect pdf file",
  },
  "social-resize": {
    title: "Social Media Image Resizer — Instagram, FB, Twitter, LinkedIn",
    description:
      "Resize images for all social media platforms. Presets for Instagram Post, Story, Facebook Cover, Twitter Header, YouTube Thumbnail.",
    keywords:
      "social media resizer, instagram size, facebook cover size, twitter header size, youtube thumbnail size, linkedin banner size, resize for instagram",
  },
  "crop-rotate": {
    title: "Crop & Rotate Image — Edit Photos Online",
    description:
      "Crop to specific aspect ratios (1:1, 16:9) and rotate images 90 degrees. Flip photos horizontally or vertically. Free online editor.",
    keywords:
      "crop image, rotate image, flip image, photo cropper, rotate photo, crop photo online, image editor free, cut photo",
  },
  "remove-bg": {
    title: "Remove Background — Free AI Background Remover",
    description:
      "Remove image backgrounds automatically with AI. Create transparent PNGs for e-commerce & profile pics. 100% Free & Unlimited.",
    keywords:
      "remove background, background remover, remove bg, transparent background, background eraser, ai background remover, free background removal, remove image background",
  },
  "change-dpi": {
    title: "Change DPI of Image — 72, 300 DPI Converter",
    description:
      "Change image DPI for printing or web. Convert to 300 DPI for high-quality prints. Works with JPG, PNG, TIFF.",
    keywords:
      "change dpi, image dpi, convert to 300 dpi, increase dpi, dpi converter, print quality image, photo dpi changer",
  },
  "remove-metadata": {
    title: "Remove Metadata (EXIF) — Clean Image Data",
    description:
      "Remove EXIF data, GPS location, and camera details from photos. Protect your privacy before sharing images online.",
    keywords:
      "remove metadata, remove exif, strip exif, clean image data, remove gps from photo, image privacy, exif remover",
  },
  "bulk-resize": {
    title: "Bulk Image Resizer — Resize Multiple Photos at Once",
    description:
      "Batch resize images online. Resize up to 20 photos simultaneously. Set width, height, and format for all. Fast & Free.",
    keywords:
      "batch image resizer online free, bulk resize, batch image resizer, mass resize photos, resize multiple images, bulk photo editor, batch resize",
  },
  "gif-maker": {
    title: "GIF Maker — Create GIFs from Images & Videos",
    description:
      "Make animated GIFs from JPG/PNG images. Control speed, loop, and sequence. Create memes and animations online.",
    keywords:
      "gif maker, create gif, make gif online, images to gif, animated gif creator, free gif maker, meme maker",
  },
  "exam-photo": {
    title: "Exam Photo Resizer & Signature Validator — SSC, UPSC, NEET, JEE",
    description:
      "Official-style photo resizer for SSC CGL, UPSC, Railway (RRB), IBPS, NEET, JEE. Resize photo & signature to exact dimensions (e.g. 200x230px, 20kb).",
    keywords:
      "exam photo resizer, ssc photo resize, upsc photo size, neet photo validator, rrb photo resize, ibps photo signature, passport photo india, exam photo compressor, resize image to 20kb, signature resizer",
  },
  "reorder-pdf": {
    title: "Reorder PDF Pages — Organize & Rearrange PDF",
    description:
      "Rearrange PDF pages by dragging and dropping. Delete unwanted pages or rotate valid pages. Save as a new PDF.",
    keywords:
      "reorder pdf, rearrange pdf pages, organize pdf, delete pdf pages, move pdf pages, pdf organizer",
  },
  "page-numbers-pdf": {
    title: "Add Page Numbers to PDF — Numbering Pages Online",
    description:
      "Insert page numbers into PDF documents. Custom position (header/footer) and formatting. Professional PDF numbering.",
    keywords:
      "page numbers pdf, add page numbers to pdf, number pdf pages, pdf pagination, insert page numbers",
  },
  "extract-images-pdf": {
    title: "Extract Images from PDF — Save PDF Photos",
    description:
      "Extract every image from a PDF file. Download all pictures in high quality (JPG/PNG). No quality loss.",
    keywords:
      "extract images from pdf, pdf image extractor, get photos from pdf, save images from pdf, pdf to jpg extraction",
  },
  "pdf-metadata-remover": {
    title: "Remove PDF Metadata — Clean PDF Properties",
    description:
      "Strip author, title, keywords, and creation date from PDF files. Anonymize your documents for privacy.",
    keywords:
      "remove pdf metadata, clean pdf, strip pdf properties, pdf privacy tool, remove pdf author",
  },
  about: {
    title: "About FileForge — The Privacy-First Swiss Army Knife for Files",
    description:
      "FileForge is a free, open-source platform for file manipulation. We process files locally in your browser. No server uploads (mostly). Safe & Private.",
    keywords:
      "about fileforge, privacy first tools, secure file tools, open source file tools, browser based tools",
  },
  "pdf-to-word": {
    title: "PDF to Word Converter — PDF to DOCX (Editable)",
    description:
      "Convert PDF to editable Word (DOCX) documents. Preserve formatting, tables, and text. Best free PDF to Word converter.",
    keywords:
      "pdf to word, convert pdf to docx, pdf to doc, editable pdf, pdf converter word, free pdf to word, online pdf to word",
  },
  "qr-generator": {
    title: "QR Code Generator — Create Custom QRs with Logo",
    description:
      "Free QR Code Generator for URLs, WiFi, Text, Email. Add logos, colors, and frames. High-resolution download.",
    keywords:
      "qr code generator, make qr code, create qr code free, wifi qr code, qr code with logo, custom qr code",
  },
  "json-csv": {
    title: "JSON to CSV Converter — JSON <-> CSV Formatter",
    description:
      "Convert JSON to CSV and CSV to JSON. View, format, and validate data structures. Essential tool for developers.",
    keywords:
      "json to csv, csv to json, json converter, csv converter, data converter, json formatter, developer tools",
  },
  "color-palette": {
    title: "Color Palette Generator — Extract Colors from Image",
    description:
      "Get the perfect color palette from any photo. Extract Hex, RGB, HSL codes. Generate schemes for design projects.",
    keywords:
      "color palette, extract colors, image to color, hex code picker, color scheme generator, design tools",
  },
  "audio-converter": {
    title: "Audio Converter — MP3, WAV, OGG Converter",
    description:
      "Convert audio files online. MP3 to WAV, WAV to MP3, and more. browser-based conversion for maximum privacy.",
    keywords:
      "audio converter, mp3 converter, wav converter, convert audio, sound converter, online audio tools",
  },
  "password-generator": {
    title: "Password Generator — Create Strong & Secure Passwords",
    description:
      "Generate random, uncrackable passwords instantly. Customize length and complexity. 100% client-side security.",
    keywords:
      "password generator, strong password, random password, secure password, password maker, security tools",
  },
  "lorem-ipsum": {
    title: "Lorem Ipsum Generator — Dummy Text for Design",
    description:
      "Generate placeholder text (Lorem Ipsum) for web design and publishing. Copy paragraphs, sentences, or words.",
    keywords:
      "lorem ipsum, dummy text, placeholder text, text generator, lipsum, design filler text",
  },
  "heic-to-jpg": {
    title: "HEIC to JPG Converter — Convert iPhone Photos",
    description:
      "Convert HEIC/HEIF images from iPhone/iPad to standard JPG or PNG. View and share Apple photos anywhere.",
    keywords:
      "heic to jpg, convert heic, iphone photo converter, heic to png, apple photo converter, heic file",
  },
  "sql-formatter": {
    title: "SQL Formatter — Beautify SQL Queries",
    description:
      "Format messy SQL code. Indent, align, and beautify SQL queries for better readability. Supports all dialects.",
    keywords:
      "sql formatter, beautify sql, sql prettifier, format sql, sql indenter, database tools",
  },
  "diff-checker": {
    title: "Diff Checker — Compare Text & Code Differences",
    description:
      "Compare two text or code snippets side-by-side. Highlight additions, removals, and changes. Essential for coding.",
    keywords:
      "diff checker, compare text, code comparison, find differences, text diff, diff tool online",
  },
  "unit-converter": {
    title: "Unit Converter — All-in-One Measurement Converter",
    description:
      "Convert Length, Weight, Temperature, Area, Volume, Speed and more. Simple, fast, and accurate conversions.",
    keywords:
      "unit converter, measurement converter, length converter, weight converter, all unit converter, metric to imperial",
  },
  "timestamp-converter": {
    title: "Timestamp Converter — Unix Epoch to Date",
    description:
      "Convert Unix Timestamps to human-readable dates and local time. Debug time issues easily.",
    keywords:
      "timestamp converter, unix time, epoch converter, date to timestamp, time tools, developer utilities",
  },
  "currency-converter": {
    title: "Currency Converter — Real-Time Exchange Rates",
    description:
      "Live currency exchange rates for USD, EUR, INR, GBP, JPY, and 150+ currencies. Calculate conversions instantly.",
    keywords:
      "currency converter, exchange rates, money converter, usd to inr, eur to usd, currency calculator, forex rates",
  },
  "video-to-audio": {
    title: "Video to Audio — Extract MP3 from Video",
    description:
      "Extract high-quality audio (MP3) from video files (MP4, MOV, WebM). Save music or speech from videos.",
    keywords:
      "video to audio, extract audio, mp4 to mp3, video to mp3, convert video to sound, audio extractor",
  },
  "markdown-editor": {
    title: "Markdown Editor — Online Preview & Export",
    description:
      "Write Markdown with real-time preview. Edit READMEs, notes, and docs. Export to HTML or copy.",
    keywords:
      "markdown editor, online markdown, readme editor, markdown preview, markdown writer, writing tools",
  },
  "edit-pdf": {
    title: "PDF Editor Free Online — Edit, Sign & Annotate PDFs",
    description:
      "Free online PDF editor to add text, shapes, highlights, and electronic signatures. Easy to use, secure, and no sign-up required. Edit PDF documents directly in your browser.",
    keywords:
      "pdf editor free online, free online pdf editor, edit pdf online free, online pdf editor, free pdf editor, edit pdf text, sign pdf online free, annotate pdf online, add text to pdf online, online tool to edit pdf",
  },
  "image-collage": {
    title: "Image Collage Maker — Create Photo Collages Online Free",
    description: "Create beautiful photo collages from multiple images online. Choose from grid, freestyle, and frame layouts. Free collage maker, no sign-up.",
    keywords: "image collage maker online free, photo collage, collage maker, image collage, create collage online, photo grid maker",
    titleHi: "इमेज कोलाज मेकर — ऑनलाइन फ़ोटो कोलाज बनाएँ",
    descriptionHi: "कई फ़ोटो से खूबसूरत कोलाज बनाएँ। ग्रिड, फ़्रीस्टाइल और फ़्रेम लेआउट में से चुनें। मुफ़्त, बिना साइन-अप।",
  },
  "image-splitter": {
    title: "Image Splitter — Split Image into Grid Parts Online",
    description: "Split any image into equal grid parts or custom sections online. Perfect for Instagram grid, social media posts, and puzzles. Free & fast.",
    keywords: "image splitter online, split image, image grid cutter, instagram grid splitter, divide image online, photo splitter",
    titleHi: "इमेज स्प्लिटर — ऑनलाइन इमेज को टुकड़ों में काटें",
    descriptionHi: "किसी भी इमेज को बराबर हिस्सों या कस्टम सेक्शन में काटें। Instagram ग्रिड, सोशल मीडिया पोस्ट के लिए बेस्ट। मुफ़्त।",
  },
  "image-border": {
    title: "Add Border to Image — Photo Frame Editor Online",
    description: "Add custom borders, frames, and shadows to your photos online. Choose colors, thickness, and rounded corners. Free image border tool.",
    keywords: "add border to image online, photo frame editor, image border tool, picture frame maker, add frame to photo",
    titleHi: "इमेज पर बॉर्डर लगाएँ — फ़ोटो फ़्रेम एडिटर",
    descriptionHi: "अपनी फ़ोटो पर कस्टम बॉर्डर, फ़्रेम और शैडो लगाएँ। रंग, मोटाई और राउंड कॉर्नर चुनें। मुफ़्त।",
  },
  "round-corners": {
    title: "Round Image Corners — Make Photos Rounded Online",
    description: "Round the corners of any image instantly online. Customize corner radius for a modern, polished look. Perfect for profile pictures and UI design.",
    keywords: "round image corners online, rounded photo, circular image, round corners tool, profile picture rounded, corner radius editor",
    titleHi: "इमेज के कोने गोल करें — फ़ोटो राउंडेड बनाएँ",
    descriptionHi: "किसी भी इमेज के कोने तुरंत गोल करें। प्रोफ़ाइल पिक्चर और UI डिज़ाइन के लिए बेस्ट। मुफ़्त।",
  },
  "image-histogram": {
    title: "Image Histogram — View Color Distribution & Analysis",
    description: "View and analyze RGB color histograms of any image online. Understand exposure, contrast, and color balance for better photo editing.",
    keywords: "image histogram viewer online, color histogram, RGB histogram, photo analysis tool, exposure analysis, color distribution",
    titleHi: "इमेज हिस्टोग्राम — रंग वितरण और विश्लेषण",
    descriptionHi: "किसी भी इमेज का RGB रंग हिस्टोग्राम देखें और विश्लेषण करें। एक्सपोज़र और कंट्रास्ट समझें। मुफ़्त।",
  },
  "steganography": {
    title: "Image Steganography — Hide Secret Messages in Images Online",
    description: "Hide secret text messages inside images using steganography. Encode and decode hidden data in PNG and BMP files. 100% client-side, secure.",
    keywords: "image steganography online, hide message in image, encode data in photo, steganography tool, secret message encoder, hide text in image",
    titleHi: "इमेज स्टेनोग्राफ़ी — इमेज में सीक्रेट मैसेज छिपाएँ",
    descriptionHi: "इमेज में सीक्रेट टेक्स्ट मैसेज छिपाएँ। PNG और BMP फ़ाइलों में हिडन डेटा एन्कोड और डिकोड करें। सुरक्षित।",
  },
  "thumbnail-generator": {
    title: "YouTube Thumbnail Generator — Create Custom Thumbnails Free",
    description: "Create eye-catching YouTube thumbnails online. Add text, images, backgrounds, and effects. Optimized for 1280x720 resolution. Free tool.",
    keywords: "youtube thumbnail generator free, custom thumbnail maker, youtube thumbnail creator, video thumbnail design, thumbnail editor online",
    titleHi: "YouTube थंबनेल जेनरेटर — कस्टम थंबनेल बनाएँ",
    descriptionHi: "YouTube के लिए आकर्षक थंबनेल ऑनलाइन बनाएँ। टेक्स्ट, इमेज और इफ़ेक्ट जोड़ें। 1280x720 रेज़ॉल्यूशन ऑप्टिमाइज़। मुफ़्त।",
  },
  "image-diff": {
    title: "Image Diff — Compare Two Images Side by Side Online",
    description: "Compare two images side-by-side and highlight pixel-level differences online. Useful for design review, QA testing, and code change detection.",
    keywords: "image diff online, compare two images, pixel comparison tool, image comparison side by side, find differences in images, design review tool",
    titleHi: "इमेज डिफ़ — दो इमेज की तुलना करें",
    descriptionHi: "दो इमेज की साइड-बाय-साइड तुलना करें और पिक्सेल-लेवल अंतर दिखाएँ। डिज़ाइन रिव्यू और QA के लिए बेस्ट।",
  },
  "panorama-preview": {
    title: "Panorama Viewer — Preview 360° Panoramic Images Online",
    description: "View and interact with 360° panoramic images online. Supports equirectangular and cylindrical panoramas. Immersive drag-to-explore experience.",
    keywords: "panorama viewer online, 360 image viewer, panoramic photo viewer, equirectangular viewer, interactive panorama, virtual tour preview",
    titleHi: "पैनोरमा व्यूअर — 360° पैनोरमिक इमेज देखें",
    descriptionHi: "360° पैनोरमिक इमेज ऑनलाइन देखें और इंटरैक्ट करें। इक्विरेक्टैंगुलर और सिलिंड्रिकल पैनोरमा सपोर्ट। मुफ़्त।",
  },
  "pixelator": {
    title: "Pixelate Image — Pixel Effect Editor Online Free",
    description: "Apply pixelation effects to images online. Control pixel size for mosaic, retro, and privacy-blur effects. Free pixel art and censoring tool.",
    keywords: "pixelate image online, pixel effect editor, mosaic maker, pixel art tool, censor image, blur face online, retro pixel effect",
    titleHi: "इमेज पिक्सलेट करें — पिक्सल इफ़ेक्ट एडिटर",
    descriptionHi: "इमेज पर पिक्सलेशन इफ़ेक्ट लगाएँ। मोज़ेक, रेट्रो और प्राइवेसी-ब्लर के लिए पिक्सल साइज़ कंट्रोल करें। मुफ़्त।",
  },
  "mirror-effect": {
    title: "Mirror Image — Flip & Reflect Photos Online",
    description: "Create mirror effects by flipping images horizontally or vertically online. Perfect for social media, art, and creative photo editing.",
    keywords: "mirror image online, flip photo horizontally, reflect image, mirror effect tool, photo flipper, create mirror photo",
    titleHi: "मिरर इमेज — फ़ोटो को फ़्लिप और रिफ़्लेक्ट करें",
    descriptionHi: "इमेज को हॉरिज़ॉन्टल या वर्टिकल फ़्लिप करके मिरर इफ़ेक्ट बनाएँ। सोशल मीडिया और क्रिएटिव एडिटिंग के लिए बेस्ट।",
  },
  "image-text-overlay": {
    title: "Add Text to Image — Text Overlay Tool Online",
    description: "Add custom text overlays to images online. Choose fonts, colors, size, shadow, and position. Perfect for social media posts, memes, and captions.",
    keywords: "add text to image online, text overlay tool, image caption maker, text on photo, meme text generator, photo text editor",
    titleHi: "इमेज पर टेक्स्ट लगाएँ — टेक्स्ट ओवरले टूल",
    descriptionHi: "इमेज पर कस्टम टेक्स्ट ओवरले लगाएँ। फ़ॉन्ट, रंग, साइज़ और पोज़िशन चुनें। सोशल मीडिया और मीम्स के लिए बेस्ट।",
  },
  "noise-generator": {
    title: "Noise Generator — Add Grain to Images Online",
    description: "Add noise, grain, and texture effects to photos online. Create film grain, vintage, and textured looks. Adjustable intensity and color noise.",
    keywords: "noise generator online, add grain to photo, film grain effect, image texture, vintage photo effect, noise overlay",
    titleHi: "नॉइज़ जेनरेटर — इमेज में ग्रेन लगाएँ",
    descriptionHi: "फ़ोटो में नॉइज़, ग्रेन और टेक्स्चर इफ़ेक्ट लगाएँ। फ़िल्म ग्रेन, विंटेज लुक बनाएँ। इन्टेंसिटी एडजस्ट करें। मुफ़्त।",
  },
  "make-transparent": {
    title: "Make Image Transparent — PNG Transparency Editor",
    description: "Make image backgrounds transparent online. Remove solid color backgrounds and export as PNG with alpha channel. Free background removal tool.",
    keywords: "make image transparent online, transparent background, remove background to transparent, PNG transparency, alpha channel editor",
    titleHi: "इमेज ट्रांसपेरेंट करें — PNG ट्रांसपेरेंसी एडिटर",
    descriptionHi: "इमेज बैकग्राउंड ट्रांसपेरेंट करें। सॉलिड कलर बैकग्राउंड हटाकर PNG में एक्सपोर्ट करें। मुफ़्त।",
  },
  "document-scan-cleaner": {
    title: "Document Scanner Cleaner — Clean & Enhance Scanned Docs",
    description: "Clean and enhance scanned documents online. Remove noise, straighten pages, increase contrast, and improve readability of old or poor-quality scans.",
    keywords: "document scanner cleaner online, scan cleaner, enhance scanned document, improve scan quality, document enhancement tool, clean scanned pages",
    titleHi: "डॉक्यूमेंट स्कैन क्लीनर — स्कैन सुधारें",
    descriptionHi: "स्कैन किए गए दस्तावेज़ ऑनलाइन साफ़ और बेहतर बनाएँ। नॉइज़ हटाएँ, पेज सीधे करें, कंट्रास्ट बढ़ाएँ। मुफ़्त।",
  },
  "pdf-to-text": {
    title: "PDF to Text — Extract Text from PDF Online Free",
    description: "Extract all text content from PDF files online. Supports multi-page PDFs, scanned documents (with OCR), and Hindi/Devanagari text. Free & secure.",
    keywords: "pdf to text online, extract text from pdf, pdf text extractor, pdf to txt converter, copy text from pdf, pdf reader online",
    titleHi: "PDF से टेक्स्ट — PDF से टेक्स्ट निकालें",
    descriptionHi: "PDF फ़ाइल से सारा टेक्स्ट ऑनलाइन निकालें। मल्टी-पेज PDF, स्कैन दस्तावेज़ और हिंदी टेक्स्ट सपोर्ट। मुफ़्त।",
  },
  "pdf-metadata-viewer": {
    title: "PDF Metadata Viewer — View PDF Properties & Info",
    description: "View PDF metadata, properties, and hidden information online. Check author, creation date, software used, and security settings. Free tool.",
    keywords: "pdf metadata viewer online, view pdf properties, pdf info checker, pdf document details, check pdf metadata, pdf inspector",
    titleHi: "PDF मेटाडेटा व्यूअर — PDF जानकारी देखें",
    descriptionHi: "PDF मेटाडेटा, प्रॉपर्टीज़ और छिपी जानकारी ऑनलाइन देखें। ऑथर, क्रिएशन डेट और सिक्योरिटी सेटिंग चेक करें। मुफ़्त।",
  },
  "pdf-grayscale": {
    title: "Convert PDF to Grayscale — Black & White PDF Online",
    description: "Convert PDF documents to grayscale (black & white) online. Reduce file size and save ink when printing. Batch process multiple pages. Free.",
    keywords: "pdf to grayscale online, black and white pdf, convert pdf grayscale, pdf grayscale converter, print grayscale, save ink pdf",
    titleHi: "PDF ग्रेस्केल में बदलें — ब्लैक एंड व्हाइट PDF",
    descriptionHi: "PDF दस्तावेज़ को ग्रेस्केल (ब्लैक एंड व्हाइट) में बदलें। प्रिंटिंग में स्याही बचाएँ। मल्टी-पेज सपोर्ट। मुफ़्त।",
  },
  "word-to-pdf": {
    title: "Word to PDF Converter — DOCX to PDF Online Free",
    description: "Convert Word documents (DOCX, DOC) to PDF online. Preserve formatting, images, and tables. Fast, secure, and free. No watermarks.",
    keywords: "word to pdf online free, docx to pdf converter, convert word to pdf, word document to pdf, doc to pdf, ms word to pdf",
    titleHi: "Word से PDF — DOCX को PDF में बदलें",
    descriptionHi: "Word दस्तावेज़ (DOCX, DOC) को PDF में बदलें। फ़ॉर्मेटिंग, इमेज और टेबल सुरक्षित रखें। तेज़, सुरक्षित, मुफ़्त।",
  },
  "pdf-to-powerpoint": {
    title: "PDF to PowerPoint — Convert PDF to PPT Online",
    description: "Convert PDF files to editable PowerPoint (PPT/PPTX) presentations online. Extract slides with formatting and images preserved. Free converter.",
    keywords: "pdf to powerpoint online, pdf to ppt converter, convert pdf to presentation, pdf to pptx, pdf slides, editable ppt from pdf",
    titleHi: "PDF से PowerPoint — PDF को PPT में बदलें",
    descriptionHi: "PDF फ़ाइल को एडिटेबल PowerPoint (PPT/PPTX) प्रेज़ेंटेशन में बदलें। फ़ॉर्मेटिंग सुरक्षित रखें। मुफ़्त।",
  },
  "powerpoint-to-pdf": {
    title: "PowerPoint to PDF — Convert PPT to PDF Online Free",
    description: "Convert PowerPoint presentations (PPT, PPTX) to PDF online. Preserve slides, images, and layout. Free, fast, and secure converter.",
    keywords: "powerpoint to pdf online free, ppt to pdf converter, convert ppt to pdf, pptx to pdf, presentation to pdf",
    titleHi: "PowerPoint से PDF — PPT को PDF में बदलें",
    descriptionHi: "PowerPoint प्रेज़ेंटेशन (PPT, PPTX) को PDF में बदलें। स्लाइड, इमेज और लेआउट सुरक्षित रखें। मुफ़्त।",
  },
  "pdf-to-excel": {
    title: "PDF to Excel — Extract Tables from PDF to Spreadsheet",
    description: "Extract tables from PDF files and convert to Excel (XLSX) online. Auto-detect table structure, rows, and columns. Free data extraction tool.",
    keywords: "pdf to excel online, extract table from pdf, pdf to xlsx, pdf table converter, pdf data extraction, convert pdf table to excel",
    titleHi: "PDF से Excel — PDF टेबल को स्प्रेडशीट में बदलें",
    descriptionHi: "PDF फ़ाइल से टेबल निकालकर Excel (XLSX) में बदलें। ऑटो-डिटेक्ट टेबल स्ट्रक्चर। मुफ़्त डेटा एक्सट्रैक्शन।",
  },
  "excel-to-pdf": {
    title: "Excel to PDF — Convert Spreadsheet to PDF Online",
    description: "Convert Excel spreadsheets (XLSX, XLS, CSV) to PDF online. Preserve formulas, charts, and formatting. Free and secure conversion.",
    keywords: "excel to pdf online, xlsx to pdf converter, spreadsheet to pdf, convert excel to pdf, xls to pdf, csv to pdf",
    titleHi: "Excel से PDF — स्प्रेडशीट को PDF में बदलें",
    descriptionHi: "Excel स्प्रेडशीट (XLSX, XLS, CSV) को PDF में बदलें। फ़ॉर्मूला, चार्ट और फ़ॉर्मेटिंग सुरक्षित। मुफ़्त।",
  },
  "html-to-pdf": {
    title: "HTML to PDF — Convert Webpage to PDF Online",
    description: "Convert HTML content or web pages to PDF online. Paste HTML code and generate a formatted PDF document instantly. Free developer tool.",
    keywords: "html to pdf online, webpage to pdf converter, convert html to pdf, html code to pdf, web page to pdf, developer pdf tool",
    titleHi: "HTML से PDF — वेबपेज को PDF में बदलें",
    descriptionHi: "HTML कंटेंट या वेबपेज को PDF में बदलें। HTML कोड पेस्ट करें और तुरंत PDF बनाएँ। मुफ़्त डेवलपर टूल।",
  },
  "translate-pdf": {
    title: "Translate PDF Online Free — Convert PDF to Any Language Instantly",
    description: "Translate PDF documents to 17 languages instantly — Hindi, Spanish, French, German, Arabic, Chinese, Japanese & more. 100% client-side, no upload needed. Auto-detect source language. Free PDF translator powered by AI.",
    keywords: "translate pdf online free, pdf translator, translate pdf to hindi, translate pdf to spanish, translate pdf to french, translate pdf to german, translate pdf to arabic, translate pdf to chinese, translate document online, pdf language translator, offline pdf translate, translate pdf without uploading, auto detect language pdf, free pdf translation tool, multilingual pdf converter, translate scanned pdf, pdf text translator, how to translate a pdf for free, translate pdf english to hindi, client side pdf translate",
    titleHi: "PDF अनुवाद करें — मुफ़्त ऑनलाइन PDF ट्रांसलेटर",
    descriptionHi: "PDF दस्तावेज़ का 17 भाषाओं में तुरंत अनुवाद करें — हिंदी, स्पेनिश, फ्रेंच, जर्मन, अरबी, चीनी, जापानी और अन्य। 100% ब्राउज़र में, अपलोड की ज़रूरत नहीं। ऑटो-डिटेक्ट भाषा। मुफ़्त AI PDF अनुवादक।",
  },
  "video-to-gif": {
    title: "Video to GIF — Convert Video Clips to Animated GIF Online",
    description: "Convert video clips (MP4, WebM, MOV) to animated GIF online. Control frame rate, quality, and dimensions. Free video to GIF converter.",
    keywords: "video to gif online, mp4 to gif converter, make gif from video, animated gif creator, video clip to gif, convert video to gif free",
    titleHi: "वीडियो से GIF — वीडियो को एनिमेटेड GIF में बदलें",
    descriptionHi: "वीडियो क्लिप (MP4, WebM) को एनिमेटेड GIF में बदलें। फ़्रेम रेट और क्वालिटी कंट्रोल करें। मुफ़्त।",
  },
  "video-trimmer": {
    title: "Video Trimmer — Cut & Trim Videos Online Free",
    description: "Trim and cut video files online in your browser. No upload required — 100% client-side processing. Supports MP4, WebM, MOV formats.",
    keywords: "video trimmer online free, cut video online, trim video, video cutter, clip video online, shorten video, cut mp4 online",
    titleHi: "वीडियो ट्रिमर — वीडियो ऑनलाइन काटें और ट्रिम करें",
    descriptionHi: "वीडियो फ़ाइल ब्राउज़र में ट्रिम और कट करें। अपलोड नहीं चाहिए — 100% क्लाइंट-साइड। MP4, WebM सपोर्ट। मुफ़्त।",
  },
  "audio-trimmer": {
    title: "Audio Trimmer — Cut & Trim Audio Files Online Free",
    description: "Trim audio files (MP3, WAV, AAC) online in your browser. Set start and end times precisely. No upload, fully offline processing.",
    keywords: "audio trimmer online free, cut audio online, trim mp3, audio cutter, shorten audio file, cut music online, trim sound",
    titleHi: "ऑडियो ट्रिमर — ऑडियो फ़ाइल ऑनलाइन काटें",
    descriptionHi: "ऑडियो फ़ाइल (MP3, WAV) ब्राउज़र में ट्रिम करें। स्टार्ट और एंड टाइम सेट करें। अपलोड नहीं, पूरी तरह ऑफ़लाइन। मुफ़्त।",
  },
  "meta-tag-generator": {
    title: "Meta Tag Generator — SEO Meta Tags Creator for Websites",
    description: "Generate SEO-optimized meta tags for your website. Create title, description, Open Graph, Twitter Card, and robots meta tags. Free tool.",
    keywords: "meta tag generator online, seo meta tags, html meta tags, open graph generator, twitter card meta, website seo tags",
    titleHi: "मेटा टैग जेनरेटर — SEO टैग बनाएँ",
    descriptionHi: "अपनी वेबसाइट के लिए SEO-ऑप्टिमाइज़्ड मेटा टैग बनाएँ। टाइटल, डिस्क्रिप्शन, Open Graph टैग। मुफ़्त।",
  },
  "sitemap-generator": {
    title: "XML Sitemap Generator — Create Sitemaps for SEO",
    description: "Generate XML sitemaps for your website for free. Enter URLs and create a Google-compatible sitemap.xml file. Essential for SEO and indexing.",
    keywords: "sitemap generator online, xml sitemap creator, google sitemap, create sitemap free, website sitemap generator, seo sitemap tool",
    titleHi: "XML साइटमैप जेनरेटर — SEO के लिए साइटमैप बनाएँ",
    descriptionHi: "अपनी वेबसाइट के लिए मुफ़्त XML साइटमैप बनाएँ। URL दर्ज करें और Google-कम्पैटिबल sitemap.xml फ़ाइल बनाएँ।",
  },
  "robots-txt-generator": {
    title: "Robots.txt Generator — Create Robots.txt File Online",
    description: "Generate a robots.txt file for your website. Control search engine crawler access, set sitemap location, and block unwanted bots. Free tool.",
    keywords: "robots.txt generator online, create robots txt, search engine crawler control, block bots, seo robots file, website robots",
    titleHi: "Robots.txt जेनरेटर — Robots.txt फ़ाइल बनाएँ",
    descriptionHi: "अपनी वेबसाइट के लिए robots.txt फ़ाइल बनाएँ। सर्च इंजन क्रॉलर एक्सेस कंट्रोल करें। मुफ़्त।",
  },
  "utm-builder": {
    title: "UTM Builder — Campaign URL Tracking Generator",
    description: "Create UTM tracking URLs for your marketing campaigns. Add source, medium, campaign, term, and content parameters. Free campaign URL builder.",
    keywords: "utm builder online, campaign url builder, utm tracking generator, marketing url parameters, google analytics utm, utm link creator",
    titleHi: "UTM बिल्डर — कैंपेन URL ट्रैकिंग जेनरेटर",
    descriptionHi: "मार्केटिंग कैंपेन के लिए UTM ट्रैकिंग URL बनाएँ। सोर्स, मीडियम और कैंपेन पैरामीटर जोड़ें। मुफ़्त।",
  },
  "privacy-policy-generator": {
    title: "Privacy Policy Generator — Create Privacy Policy Free",
    description: "Generate a professional privacy policy for your website or app. Customize for GDPR, CCPA, and Indian IT Act compliance. Free and instant.",
    keywords: "privacy policy generator free, create privacy policy, website privacy policy, gdpr policy generator, app privacy policy, indian it act policy",
    titleHi: "प्राइवेसी पॉलिसी जेनरेटर — मुफ़्त प्राइवेसी पॉलिसी बनाएँ",
    descriptionHi: "अपनी वेबसाइट या ऐप के लिए प्रोफ़ेशनल प्राइवेसी पॉलिसी बनाएँ। GDPR, CCPA और भारतीय IT Act के अनुसार। मुफ़्त।",
  },
  "random-generator": {
    title: "Random Number Generator — Generate Random Numbers Online",
    description: "Generate random numbers, dice rolls, coin flips, and lottery picks online. Set range, quantity, and uniqueness. True random generator tool.",
    keywords: "random number generator online, random picker, dice roller, coin flip, lottery number generator, random integer generator",
    titleHi: "रैंडम नंबर जेनरेटर — ऑनलाइन रैंडम नंबर बनाएँ",
    descriptionHi: "रैंडम नंबर, डाइस रोल, सिक्का उछाल और लॉटरी नंबर ऑनलाइन जेनरेट करें। रेंज और क्वांटिटी सेट करें। मुफ़्त।",
  },
  "regex-tester": {
    title: "Regex Tester — Test Regular Expressions Online",
    description: "Test and debug regular expressions (regex) online. Real-time matching, group highlighting, and cheat sheet. Supports JavaScript and PCRE flavors.",
    keywords: "regex tester online, regular expression tester, regex debugger, test regex pattern, regex match, javascript regex, pcre regex",
    titleHi: "Regex टेस्टर — रेगुलर एक्सप्रेशन टेस्ट करें",
    descriptionHi: "रेगुलर एक्सप्रेशन (regex) ऑनलाइन टेस्ट और डिबग करें। रियल-टाइम मैचिंग और ग्रुप हाइलाइटिंग। JavaScript और PCRE सपोर्ट।",
  },
  "regex-find-replace": {
    title: "Regex Find & Replace — Search Replace with Regex",
    description: "Find and replace text using regular expressions online. Supports global search, case-insensitive matching, and capture groups. Free developer tool.",
    keywords: "regex find replace online, search replace regex, regex substitution, text find replace, developer regex tool, regex replace",
    titleHi: "Regex खोजें और बदलें — रेगुलर एक्सप्रेशन से रिप्लेस करें",
    descriptionHi: "रेगुलर एक्सप्रेशन से टेक्स्ट खोजें और बदलें। ग्लोबल सर्च और कैप्चर ग्रुप सपोर्ट। मुफ़्त डेवलपर टूल।",
  },
  "text-case-converter": {
    title: "Text Case Converter — Uppercase, Lowercase, Title Case",
    description: "Convert text between uppercase, lowercase, title case, sentence case, and more online. Instant text transformation for writers and developers.",
    keywords: "text case converter online, uppercase converter, lowercase converter, title case, sentence case, text transformer, case changer",
    titleHi: "टेक्स्ट केस कन्वर्टर — बड़े/छोटे अक्षर बदलें",
    descriptionHi: "टेक्स्ट को अपरकेस, लोअरकेस, टाइटल केस आदि में बदलें। लेखक और डेवलपर के लिए तुरंत टेक्स्ट ट्रांसफ़ॉर्मेशन। मुफ़्त।",
  },
  "slug-generator": {
    title: "Slug Generator — Create URL-Friendly Slugs Online",
    description: "Generate SEO-friendly URL slugs from any text online. Removes special characters, replaces spaces with hyphens, and lowercases. Free tool.",
    keywords: "slug generator online, url slug creator, seo friendly slug, text to slug, url friendly text, permalink generator",
    titleHi: "स्लग जेनरेटर — URL-फ़्रेंडली स्लग बनाएँ",
    descriptionHi: "किसी भी टेक्स्ट से SEO-फ़्रेंडली URL स्लग बनाएँ। स्पेशल कैरेक्टर हटाएँ, स्पेस की जगह हाइफ़न। मुफ़्त।",
  },
  "remove-duplicate-lines": {
    title: "Remove Duplicate Lines — Deduplicate Text Online",
    description: "Remove duplicate lines from text online instantly. Paste your text and get unique lines only. Sort, count, and compare lines. Free tool.",
    keywords: "remove duplicate lines online, deduplicate text, unique lines, remove duplicates, text cleaner, duplicate line remover",
    titleHi: "डुप्लिकेट लाइन हटाएँ — टेक्स्ट डीडुप्लिकेट करें",
    descriptionHi: "टेक्स्ट से डुप्लिकेट लाइन तुरंत हटाएँ। टेक्स्ट पेस्ट करें और केवल यूनीक लाइन पाएँ। मुफ़्त।",
  },
  "sort-lines": {
    title: "Sort Lines — Sort Text Lines Alphabetically Online",
    description: "Sort text lines alphabetically, numerically, or by length online. Supports ascending and descending order. Reverse lines. Free text tool.",
    keywords: "sort lines online, alphabetical sort, text line sorter, sort text, order lines, reverse lines, numeric sort",
    titleHi: "लाइन सॉर्ट करें — टेक्स्ट लाइन वर्णमाला क्रम में",
    descriptionHi: "टेक्स्ट लाइन वर्णमाला, संख्या या लंबाई के क्रम में सॉर्ट करें। आरोही और अवरोही क्रम सपोर्ट। मुफ़्त।",
  },
  "extract-emails": {
    title: "Extract Emails — Find Email Addresses in Text Online",
    description: "Extract all email addresses from text or documents online. Paste any content and get a clean list of emails. Free bulk email extractor tool.",
    keywords: "extract emails from text online, email extractor, find email addresses, email scraper, bulk email extractor, email list generator",
    titleHi: "ईमेल निकालें — टेक्स्ट से ईमेल एड्रेस खोजें",
    descriptionHi: "टेक्स्ट या डॉक्यूमेंट से सभी ईमेल एड्रेस ऑनलाइन निकालें। कंटेंट पेस्ट करें और साफ़ ईमेल लिस्ट पाएँ। मुफ़्त।",
  },
  "extract-urls": {
    title: "Extract URLs — Find Links in Text Online",
    description: "Extract all URLs and links from any text online. Paste content and get a clean list of web addresses. Free bulk URL extractor tool.",
    keywords: "extract urls from text online, url extractor, find links in text, link scraper, bulk url extractor, web address finder",
    titleHi: "URL निकालें — टेक्स्ट से लिंक खोजें",
    descriptionHi: "किसी भी टेक्स्ट से सभी URL और लिंक ऑनलाइन निकालें। कंटेंट पेस्ट करें और साफ़ URL लिस्ट पाएँ। मुफ़्त।",
  },
  "extract-phones": {
    title: "Extract Phone Numbers — Find Mobile Numbers in Text",
    description: "Extract phone numbers and mobile numbers from text online. Supports Indian (+91) and international formats. Free bulk phone number extractor.",
    keywords: "extract phone numbers online, phone number extractor, find mobile numbers, indian phone number, +91 number extractor, contact extractor",
    titleHi: "फ़ोन नंबर निकालें — टेक्स्ट से मोबाइल नंबर खोजें",
    descriptionHi: "टेक्स्ट से फ़ोन नंबर और मोबाइल नंबर ऑनलाइन निकालें। भारतीय (+91) और इंटरनेशनल फ़ॉर्मेट सपोर्ट। मुफ़्त।",
  },
  "csv-to-json": {
    title: "CSV to JSON Converter — Convert CSV Data to JSON Online",
    description: "Convert CSV data to JSON format online. Supports custom delimiters, headers, and nested objects. Free data format converter for developers.",
    keywords: "csv to json online converter, csv to json, convert csv, csv json tool, data converter, csv parser online, developer tools",
    titleHi: "CSV से JSON — CSV डेटा को JSON में बदलें",
    descriptionHi: "CSV डेटा को JSON फ़ॉर्मेट में ऑनलाइन बदलें। कस्टम डिलिमिटर और हेडर सपोर्ट। डेवलपर के लिए मुफ़्त डेटा कन्वर्टर।",
  },
  "xml-to-json": {
    title: "XML to JSON Converter — Convert XML to JSON Online",
    description: "Convert XML data to JSON format online. Parse XML strings and get clean, structured JSON output. Free developer data conversion tool.",
    keywords: "xml to json online converter, convert xml to json, xml parser, xml json converter, data format converter, developer tools",
    titleHi: "XML से JSON — XML को JSON में बदलें",
    descriptionHi: "XML डेटा को JSON फ़ॉर्मेट में ऑनलाइन बदलें। XML स्ट्रिंग पार्स करें और साफ़ JSON आउटपुट पाएँ। मुफ़्त।",
  },
  "jwt-generator": {
    title: "JWT Generator — Create JSON Web Tokens Online",
    description: "Generate JSON Web Tokens (JWT) online. Create HS256, HS384, HS512 signed tokens with custom claims and expiry. Free developer authentication tool.",
    keywords: "jwt generator online, json web token creator, jwt token generator, generate jwt, authentication token, developer jwt tool",
    titleHi: "JWT जेनरेटर — JSON Web Token ऑनलाइन बनाएँ",
    descriptionHi: "JSON Web Token (JWT) ऑनलाइन बनाएँ। HS256, HS384, HS512 साइन्ड टोकन कस्टम क्लेम्स के साथ। मुफ़्त डेवलपर टूल।",
  },
  "html-entity": {
    title: "HTML Entity Encoder/Decoder — Encode Special Characters",
    description: "Encode and decode HTML entities online. Convert special characters to HTML entities and vice versa. Free developer tool for web encoding.",
    keywords: "html entity encoder decoder online, encode html, decode html entities, html special characters, web encoding tool, html character converter",
    titleHi: "HTML एन्टिटी एनकोडर/डिकोडर — स्पेशल कैरेक्टर एन्कोड करें",
    descriptionHi: "HTML एन्टिटी ऑनलाइन एन्कोड और डिकोड करें। स्पेशल कैरेक्टर को HTML एन्टिटी में बदलें। मुफ़्त वेब एन्कोडिंग टूल।",
  },
  "code-beautifier": {
    title: "Code Beautifier — Format & Beautify Code Online",
    description: "Beautify and format code online. Supports JavaScript, CSS, HTML, JSON, SQL, and more. Indent, prettify, and make code readable. Free tool.",
    keywords: "code beautifier online, code formatter, prettify code, format code online, javascript beautifier, css formatter, html beautifier",
    titleHi: "कोड ब्यूटीफ़ायर — कोड ऑनलाइन फ़ॉर्मेट करें",
    descriptionHi: "कोड ऑनलाइन ब्यूटीफ़ाय और फ़ॉर्मेट करें। JavaScript, CSS, HTML, JSON, SQL सपोर्ट। इंडेंट, प्रिटीफ़ाई और पढ़ने योग्य बनाएँ। मुफ़्त।",
  },
  "unix-permissions": {
    title: "Unix Permissions Calculator — File Permission Calculator",
    description: "Calculate Unix/Linux file permissions online. Convert between symbolic (rwx) and octal (755) formats. Visual permission breakdown. Free tool.",
    keywords: "unix permissions calculator online, linux file permissions, chmod calculator, rwx to octal, file permission converter, chmod generator",
    titleHi: "Unix परमिशन कैलकुलेटर — फ़ाइल परमिशन कैलकुलेटर",
    descriptionHi: "Unix/Linux फ़ाइल परमिशन ऑनलाइन कैलकुलेट करें। सिम्बोलिक (rwx) और ऑक्टल (755) में कन्वर्ट करें। मुफ़्त।",
  },
  "file-hash-compare": {
    title: "File Hash Compare — Compare File Checksums Online",
    description: "Compare file hashes and checksums online. Generate MD5, SHA-1, SHA-256 hashes to verify file integrity and detect duplicates. Free tool.",
    keywords: "file hash compare online, checksum generator, md5 sha256 hash, file integrity checker, duplicate file detector, hash verifier",
    titleHi: "फ़ाइल हैश तुलना — फ़ाइल चेकसम ऑनलाइन तुलना करें",
    descriptionHi: "फ़ाइल हैश और चेकसम ऑनलाइन तुलना करें। MD5, SHA-1, SHA-256 हैश जेनरेट करें। फ़ाइल इंटेग्रिटी वेरिफ़ाई करें। मुफ़्त।",
  },
  "cron-builder": {
    title: "Cron Expression Builder — Visual Cron Schedule Generator",
    description: "Build and test cron expressions online with a visual builder. Generate schedules for Linux crontab, Node.js, and Quartz. Free developer tool.",
    keywords: "cron builder online, cron expression generator, crontab schedule, visual cron, cron syntax, scheduled task builder",
    titleHi: "Cron बिल्डर — विज़ुअल Cron शेड्यूल जेनरेटर",
    descriptionHi: "विज़ुअल बिल्डर से cron एक्सप्रेशन ऑनलाइन बनाएँ और टेस्ट करें। Linux crontab, Node.js और Quartz के लिए शेड्यूल। मुफ़्त।",
  },
  "xml-formatter": {
    title: "XML Formatter — Format & Beautify XML Online",
    description: "Format and beautify XML data online. Pretty-print XML with proper indentation and structure. Validate XML syntax. Free developer tool.",
    keywords: "xml formatter online, xml beautifier, format xml, pretty print xml, xml validator, xml indent, xml prettifier",
    titleHi: "XML फ़ॉर्मेटर — XML ऑनलाइन फ़ॉर्मेट करें",
    descriptionHi: "XML डेटा ऑनलाइन फ़ॉर्मेट और ब्यूटीफ़ाय करें। सही इंडेंटेशन के साथ प्रिटी-प्रिंट। XML सिंटैक्स वैलिडेट करें। मुफ़्त।",
  },
  "json-formatter": {
    title: "JSON Formatter — Format, Validate & Beautify JSON Online",
    description: "Format and beautify JSON data online. Pretty-print, validate syntax, and fix JSON errors instantly. Supports large JSON files. Free developer tool.",
    keywords: "json formatter online, json beautifier, format json, validate json, pretty print json, json validator, json prettifier",
    titleHi: "JSON फ़ॉर्मेटर — JSON ऑनलाइन फ़ॉर्मेट और वैलिडेट करें",
    descriptionHi: "JSON डेटा ऑनलाइन फ़ॉर्मेट और ब्यूटीफ़ाय करें। सिंटैक्स वैलिडेट, एरर ठीक करें। बड़ी JSON फ़ाइल सपोर्ट। मुफ़्त।",
  },
  "json-minifier": {
    title: "JSON Minifier — Compress & Minify JSON Online",
    description: "Minify and compress JSON data online. Remove whitespace and comments to reduce JSON file size. Fast, free, and supports large files.",
    keywords: "json minifier online, compress json, minify json, json compressor, reduce json size, json optimizer, compact json",
    titleHi: "JSON मिनिफ़ायर — JSON ऑनलाइन कंप्रेस करें",
    descriptionHi: "JSON डेटा ऑनलाइन मिनिफ़ाय और कंप्रेस करें। व्हाइटस्पेस हटाकर फ़ाइल साइज़ कम करें। तेज़ और मुफ़्त।",
  },
  "json-validator": {
    title: "JSON Validator — Validate JSON Syntax Online",
    description: "Validate JSON syntax and find errors online. Instantly detect missing commas, brackets, and invalid characters. Line-by-line error reporting.",
    keywords: "json validator online, validate json, json syntax checker, json error finder, json lint, validate json data, json parser",
    titleHi: "JSON वैलिडेटर — JSON सिंटैक्स ऑनलाइन वैलिडेट करें",
    descriptionHi: "JSON सिंटैक्स वैलिडेट करें और एरर ऑनलाइन खोजें। मिसिंग कॉमा, ब्रैकेट और इनवैलिड कैरेक्टर तुरंत डिटेक्ट करें। मुफ़्त।",
  },
  "word-counter": {
    title: "Word Counter — Count Words, Characters & Sentences Online",
    description: "Count words, characters, sentences, and paragraphs online. Real-time counting as you type. Reading time estimation. Free writing tool.",
    keywords: "word counter online, character counter, sentence counter, word count tool, text statistics, reading time calculator, writing tool",
    titleHi: "वर्ड काउंटर — शब्द, अक्षर और वाक्य गिनें",
    descriptionHi: "शब्द, अक्षर, वाक्य और पैराग्राफ़ ऑनलाइन गिनें। टाइप करते समय रियल-टाइम गिनती। रीडिंग टाइम अनुमान। मुफ़्त।",
  },
  "base64": {
    title: "Base64 Encoder/Decoder — Encode & Decode Base64 Online",
    description: "Encode text to Base64 and decode Base64 to text online. Supports file-to-Base64 conversion. Free developer tool for encoding/decoding.",
    keywords: "base64 encoder decoder online, encode base64, decode base64, base64 converter, text to base64, file to base64, developer encoding tool",
    titleHi: "Base64 एनकोडर/डिकोडर — Base64 एन्कोड और डिकोड करें",
    descriptionHi: "टेक्स्ट को Base64 में एन्कोड और Base64 को टेक्स्ट में डिकोड करें। फ़ाइल-टू-Base64 कन्वर्शन सपोर्ट। मुफ़्त।",
  },
  "url-encoder": {
    title: "URL Encoder/Decoder — Encode & Decode URLs Online",
    description: "Encode and decode URLs online. Convert special characters to URL-safe format (percent-encoding). Free developer tool for URL encoding.",
    keywords: "url encoder decoder online, encode url, decode url, percent encoding, url safe converter, url escape, developer url tool",
    titleHi: "URL एनकोडर/डिकोडर — URL एन्कोड और डिकोड करें",
    descriptionHi: "URL ऑनलाइन एन्कोड और डिकोड करें। स्पेशल कैरेक्टर को URL-सेफ़ फ़ॉर्मेट में बदलें। मुफ़्त डेवलपर टूल।",
  },
  "gradient-generator": {
    title: "CSS Gradient Generator — Create Linear & Radial Gradients",
    description: "Create beautiful CSS gradients online. Generate linear, radial, and conic gradients with live preview. Copy CSS code instantly. Free design tool.",
    keywords: "css gradient generator online, linear gradient, radial gradient, gradient maker, css background gradient, color gradient tool",
    titleHi: "CSS ग्रेडिएंट जेनरेटर — लीनियर और रेडियल ग्रेडिएंट बनाएँ",
    descriptionHi: "खूबसूरत CSS ग्रेडिएंट ऑनलाइन बनाएँ। लीनियर, रेडियल और कॉनिक ग्रेडिएंट। लाइव प्रिव्यू और CSS कॉपी। मुफ़्त।",
  },
  "box-shadow-generator": {
    title: "CSS Box Shadow Generator — Create Shadow Effects Online",
    description: "Generate CSS box-shadow code online. Customize offset, blur, spread, color, and inset shadows. Live preview. Free CSS shadow tool.",
    keywords: "css box shadow generator online, shadow maker, box shadow code, css shadow tool, shadow effect generator, web design shadow",
    titleHi: "CSS बॉक्स शैडो जेनरेटर — शैडो इफ़ेक्ट बनाएँ",
    descriptionHi: "CSS बॉक्स-शैडो कोड ऑनलाइन जेनरेट करें। ऑफ़सेट, ब्लर, स्प्रेड और कलर कस्टमाइज़ करें। लाइव प्रिव्यू। मुफ़्त।",
  },
  "glassmorphism-generator": {
    title: "Glassmorphism Generator — Create Glass Effect CSS Online",
    description: "Create glassmorphism (frosted glass) CSS effects online. Customize blur, transparency, and border. Live preview and copy CSS. Free design tool.",
    keywords: "glassmorphism generator online, glass effect css, frosted glass ui, glassmorphism design, blur effect css, modern ui design",
    titleHi: "ग्लासमॉर्फ़िज़्म जेनरेटर — ग्लास इफ़ेक्ट CSS बनाएँ",
    descriptionHi: "ग्लासमॉर्फ़िज़्म (फ़्रॉस्टेड ग्लास) CSS इफ़ेक्ट ऑनलाइन बनाएँ। ब्लर, ट्रांसपेरेंसी और बॉर्डर कस्टमाइज़ करें। मुफ़्त।",
  },
  "hash-generator": {
    title: "Hash Generator — Generate MD5, SHA-1, SHA-256 Hashes",
    description: "Generate cryptographic hashes online. Create MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Free developer security tool.",
    keywords: "hash generator online, md5 generator, sha256 hash, sha1 generator, cryptographic hash, hash calculator, developer security tool",
    titleHi: "हैश जेनरेटर — MD5, SHA-1, SHA-256 हैश बनाएँ",
    descriptionHi: "क्रिप्टोग्राफ़िक हैश ऑनलाइन जेनरेट करें। टेक्स्ट या फ़ाइल से MD5, SHA-1, SHA-256 हैश बनाएँ। मुफ़्त।",
  },
  "password-strength": {
    title: "Password Strength Checker — Test Password Security",
    description: "Check the strength and security of your passwords online. Test against common patterns, dictionary words, and length requirements. Free tool.",
    keywords: "password strength checker online, password security test, strong password checker, password analyzer, password security meter, test password strength",
    titleHi: "पासवर्ड स्ट्रेंथ चेकर — पासवर्ड सुरक्षा जाँचें",
    descriptionHi: "अपने पासवर्ड की ताकत और सुरक्षा ऑनलाइन जाँचें। कॉमन पैटर्न, डिक्शनरी वर्ड्स और लंबाई टेस्ट करें। मुफ़्त।",
  },
  "jwt-decoder": {
    title: "JWT Decoder — Decode JSON Web Tokens Online",
    description: "Decode and inspect JSON Web Tokens (JWT) online. View header, payload, and signature. Verify token claims. Free developer authentication tool.",
    keywords: "jwt decoder online, decode json web token, jwt inspector, jwt payload viewer, json web token decoder, developer auth tool",
    titleHi: "JWT डिकोडर — JSON Web Token ऑनलाइन डिकोड करें",
    descriptionHi: "JSON Web Token (JWT) ऑनलाइन डिकोड और इंस्पेक्ट करें। हेडर, पेलोड और सिग्नेचर देखें। मुफ़्त।",
  },
  "invoice-generator": {
    title: "Invoice Generator — Create Professional Invoices Free",
    description: "Create professional invoices online for free. Customize company details, items, GST, and download as PDF. Perfect for freelancers and small businesses in India.",
    keywords: "invoice generator free, create invoice online, gst invoice generator, professional invoice, pdf invoice maker, freelancer invoice india",
    titleHi: "इनवॉइस जेनरेटर — मुफ़्त प्रोफ़ेशनल इनवॉइस बनाएँ",
    descriptionHi: "ऑनलाइन मुफ़्त प्रोफ़ेशनल इनवॉइस बनाएँ। कंपनी डिटेल, आइटम, GST कस्टमाइज़ करें और PDF में डाउनलोड करें।",
  },
  "resume-builder": {
    title: "Resume Builder — Create Professional Resume Online Free",
    description: "Build a professional resume/CV online for free. Choose templates, add sections, and download as PDF. Perfect for Indian job seekers and freshers.",
    keywords: "resume builder free online, cv maker, professional resume, create resume, resume template, job resume india, freshers resume",
    titleHi: "रिज़्यूमे बिल्डर — मुफ़्त प्रोफ़ेशनल रिज़्यूमे बनाएँ",
    descriptionHi: "मुफ़्त प्रोफ़ेशनल रिज़्यूमे/CV ऑनलाइन बनाएँ। टेम्पलेट चुनें, सेक्शन जोड़ें, PDF में डाउनलोड करें।",
  },
  "decision-matrix": {
    title: "Decision Matrix — Weighted Decision Making Tool",
    description: "Make better decisions with a weighted decision matrix online. Compare options, assign weights, and calculate scores. Free business analysis tool.",
    keywords: "decision matrix online, weighted decision matrix, decision making tool, compare options, business analysis, decision calculator",
    titleHi: "डिसीज़न मैट्रिक्स — वेटेड डिसीज़न मेकिंग टूल",
    descriptionHi: "वेटेड डिसीज़न मैट्रिक्स से बेहतर निर्णय लें। विकल्प तुलना, वेट असाइन और स्कोर कैलकुलेट करें। मुफ़्त।",
  },
  "todo-list": {
    title: "Todo List — Online Task Manager & Productivity Tool",
    description: "Organize tasks with a free online todo list. Add, edit, complete, and prioritize tasks. Data saved locally in your browser. No sign-up needed.",
    keywords: "todo list online free, task manager, task list, productivity tool, organize tasks, checklist online, todo app",
    titleHi: "टू-डू लिस्ट — ऑनलाइन टास्क मैनेजर",
    descriptionHi: "मुफ़्त ऑनलाइन टू-डू लिस्ट से टास्क व्यवस्थित करें। टास्क जोड़ें, एडिट करें, पूरा करें। डेटा ब्राउज़र में सेव। बिना साइन-अप।",
  },
  "habit-tracker": {
    title: "Habit Tracker — Track Daily Habits Online Free",
    description: "Track your daily habits and build streaks online. Monitor progress with a visual calendar. Free habit tracking for health, study, and productivity.",
    keywords: "habit tracker online free, daily habit tracker, habit streak, habit calendar, track habits, build habits, productivity tracker",
    titleHi: "हैबिट ट्रैकर — दैनिक आदतें ऑनलाइन ट्रैक करें",
    descriptionHi: "दैनिक आदतें ट्रैक करें और स्ट्रीक बनाएँ। विज़ुअल कैलेंडर से प्रगति मॉनिटर करें। स्वास्थ्य, पढ़ाई और उत्पादकता के लिए। मुफ़्त।",
  },
  "note-pad": {
    title: "Online Notepad — Free Text Editor in Browser",
    description: "Write and save notes online in a free browser notepad. Auto-saves locally, no sign-up. Dark mode, word count, and export. Perfect for quick notes.",
    keywords: "online notepad free, browser text editor, quick notes online, free note taking, write notes online, notepad app, text editor",
    titleHi: "ऑनलाइन नोटपैड — ब्राउज़र में मुफ़्त टेक्स्ट एडिटर",
    descriptionHi: "मुफ़्त ब्राउज़र नोटपैड में नोट लिखें और सेव करें। ऑटो-सेव, डार्क मोड, वर्ड काउंट। बिना साइन-अप।",
  },
  "flashcard-creator": {
    title: "Flashcard Creator — Make Study Flashcards Online",
    description: "Create and study flashcards online for free. Perfect for exam preparation (SSC, UPSC, NEET, JEE). Flip cards, track progress, and study smart.",
    keywords: "flashcard creator online free, study flashcards, exam preparation cards, ssc upsc flashcards, memory cards, study tool india",
    titleHi: "फ़्लैशकार्ड क्रिएटर — स्टडी फ़्लैशकार्ड ऑनलाइन बनाएँ",
    descriptionHi: "मुफ़्त ऑनलाइन फ़्लैशकार्ड बनाएँ और पढ़ें। SSC, UPSC, NEET, JEE परीक्षा तैयारी के लिए बेस्ट। फ़्लिप करें, प्रगति ट्रैक करें।",
  },
  "quiz-creator": {
    title: "Quiz Creator — Create Online Quizzes Free",
    description: "Create interactive quizzes online for free. Add multiple choice, true/false, and fill-in-the-blank questions. Share and test knowledge. Free tool.",
    keywords: "quiz creator online free, create quiz, online quiz maker, multiple choice quiz, exam quiz, test maker, educational quiz tool",
    titleHi: "क्विज़ क्रिएटर — मुफ़्त ऑनलाइन क्विज़ बनाएँ",
    descriptionHi: "मुफ़्त इंटरैक्टिव क्विज़ ऑनलाइन बनाएँ। मल्टीपल चॉइस, ट्रू/फ़ॉल्स सवाल जोड़ें। शेयर करें। मुफ़्त।",
  },
  "pomodoro": {
    title: "Pomodoro Timer — Free Focus & Productivity Timer",
    description: "Boost productivity with a free online Pomodoro timer. 25-minute focus sessions with 5-minute breaks. Track work sessions. No sign-up needed.",
    keywords: "pomodoro timer online free, focus timer, productivity timer, 25 minute timer, work timer, study timer, time management tool",
    titleHi: "पोमोडोरो टाइमर — मुफ़्त फ़ोकस और उत्पादकता टाइमर",
    descriptionHi: "मुफ़्त ऑनलाइन पोमोडोरो टाइमर से उत्पादकता बढ़ाएँ। 25 मिनट फ़ोकस, 5 मिनट ब्रेक। वर्क सेशन ट्रैक करें। बिना साइन-अप।",
  },
  "age-calculator": {
    title: "Age Calculator — Calculate Your Age in Years, Months, Days",
    description: "Calculate exact age in years, months, and days online. Enter your date of birth and get detailed age breakdown. Free age calculator for India.",
    keywords: "age calculator online, calculate age, age in years months days, date of birth calculator, my age calculator, exact age finder",
    titleHi: "उम्र कैलकुलेटर — वर्ष, महीने, दिन में उम्र जानें",
    descriptionHi: "ऑनलाइन सटीक उम्र वर्ष, महीने और दिन में कैलकुलेट करें। जन्म तिथि दर्ज करें और विस्तृत उम्र जानें। मुफ़्त।",
  },
  "date-difference": {
    title: "Date Difference Calculator — Days Between Two Dates",
    description: "Calculate the difference between two dates online. Get exact days, weeks, months, and years. Free date calculator for planning and deadlines.",
    keywords: "date difference calculator online, days between dates, date calculator, days counter, date interval, how many days between",
    titleHi: "तारीख़ अंतर कैलकुलेटर — दो तारीख़ों के बीच दिन",
    descriptionHi: "दो तारीख़ों के बीच अंतर ऑनलाइन कैलकुलेट करें। सटीक दिन, हफ़्ते, महीने और साल जानें। प्लानिंग और डेडलाइन के लिए। मुफ़्त।",
  },
  "timezone-converter": {
    title: "Timezone Converter — Convert Time Between Timezones",
    description: "Convert time between different timezones online. Supports IST, EST, PST, GMT, and all world timezones. Meeting planner. Free tool.",
    keywords: "timezone converter online, time conversion, ist to est, world time converter, meeting time planner, timezone calculator",
    titleHi: "टाइमज़ोन कन्वर्टर — टाइमज़ोन के बीच समय बदलें",
    descriptionHi: "अलग-अलग टाइमज़ोन के बीच समय ऑनलाइन बदलें। IST, EST, PST, GMT सपोर्ट। मीटिंग प्लानर। मुफ़्त।",
  },
  "sip-calculator": {
    title: "SIP Calculator — Calculate SIP Returns Online India",
    description: "Calculate SIP (Systematic Investment Plan) returns online. See projected wealth growth with monthly investments in mutual funds. Free India finance tool.",
    keywords: "sip calculator online india, sip returns calculator, mutual fund sip calculator, systematic investment plan, sip maturity calculator, investment calculator",
    titleHi: "SIP कैलकुलेटर — SIP रिटर्न ऑनलाइन कैलकुलेट करें",
    descriptionHi: "SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) रिटर्न ऑनलाइन कैलकुलेट करें। मंथली इन्वेस्टमेंट से वेल्थ ग्रोथ देखें। मुफ़्त।",
  },
  "emi-calculator": {
    title: "EMI Calculator — Loan EMI Calculator Online India",
    description: "Calculate loan EMI (Equated Monthly Installment) online. Home loan, car loan, personal loan EMI with amortization schedule. Free India finance tool.",
    keywords: "emi calculator online india, loan emi calculator, home loan emi, car loan emi, personal loan emi, emi calculator with amortization",
    titleHi: "EMI कैलकुलेटर — लोन EMI ऑनलाइन कैलकुलेट करें",
    descriptionHi: "लोन EMI (इक्वेटेड मंथली इंस्टॉलमेंट) ऑनलाइन कैलकुलेट करें। होम लोन, कार लोन, पर्सनल लोन EMI। अमॉर्टाइज़ेशन शेड्यूल। मुफ़्त।",
  },
  "bmi-calculator": {
    title: "BMI Calculator — Body Mass Index Calculator Online",
    description: "Calculate your Body Mass Index (BMI) online. Enter height and weight to check if you're underweight, normal, overweight, or obese. Free health tool.",
    keywords: "bmi calculator online, body mass index, bmi checker, health calculator, weight calculator, bmi chart, ideal weight calculator",
    titleHi: "BMI कैलकुलेटर — बॉडी मास इंडेक्स कैलकुलेटर",
    descriptionHi: "अपना बॉडी मास इंडेक्स (BMI) ऑनलाइन कैलकुलेट करें। हाइट और वेट दर्ज करें, अंडरवेट/नॉर्मल/ओवरवेट चेक करें। मुफ़्त।",
  },
  "gst-calculator": {
    title: "GST Calculator — Calculate GST Online India (18%, 12%, 5%)",
    description: "Calculate GST (Goods and Services Tax) online for India. Add or remove GST from prices. Supports 5%, 12%, 18%, 28% slabs. Free finance tool.",
    keywords: "gst calculator online india, gst calculator, goods and services tax, gst 18 percent, gst amount calculator, add remove gst, indian tax calculator",
    titleHi: "GST कैलकुलेटर — GST ऑनलाइन कैलकुलेट करें (18%, 12%, 5%)",
    descriptionHi: "भारत के लिए GST (वस्तु एवं सेवा कर) ऑनलाइन कैलकुलेट करें। 5%, 12%, 18%, 28% स्लैब सपोर्ट। मुफ़्त।",
  },
  "income-tax-calculator": {
    title: "Income Tax Calculator — Calculate Tax Online India FY 2025-26",
    description: "Calculate income tax online for India. Compare old vs new tax regime. Supports FY 2025-26 slabs, deductions under 80C, HRA. Free tax tool.",
    keywords: "income tax calculator india, tax calculator online, income tax fy 2025-26, old vs new tax regime, 80c deductions, indian tax calculator",
    titleHi: "इनकम टैक्स कैलकुलेटर — भारत टैक्स ऑनलाइन कैलकुलेट करें",
    descriptionHi: "भारत के लिए इनकम टैक्स ऑनलाइन कैलकुलेट करें। पुरानी vs नई टैक्स व्यवस्था तुलना करें। 80C, HRA डिडक्शन सपोर्ट। मुफ़्त।",
  },
  "tdee-calculator": {
    title: "TDEE Calculator — Total Daily Energy Expenditure",
    description: "Calculate your TDEE (Total Daily Energy Expenditure) online. Find your daily calorie needs based on activity level. Free fitness and diet tool.",
    keywords: "tdee calculator online, total daily energy expenditure, calorie calculator, daily calorie needs, fitness calculator, diet planner calorie",
    titleHi: "TDEE कैलकुलेटर — कुल दैनिक ऊर्जा व्यय",
    descriptionHi: "अपना TDEE (कुल दैनिक ऊर्जा व्यय) ऑनलाइन कैलकुलेट करें। एक्टिविटी लेवल के अनुसार दैनिक कैलोरी ज़रूरत जानें। मुफ़्त।",
  },
  "barcode-generator": {
    title: "Barcode Generator — Create Barcodes & QR Codes Online",
    description: "Generate barcodes online for products, inventory, and shipping. Supports Code128, EAN-13, UPC-A, and more. Download as PNG. Free barcode tool.",
    keywords: "barcode generator online, create barcode, product barcode, ean 13 generator, upc barcode, code128 generator, inventory barcode",
    titleHi: "बारकोड जेनरेटर — ऑनलाइन बारकोड बनाएँ",
    descriptionHi: "प्रोडक्ट, इन्वेंटरी और शिपिंग के लिए बारकोड ऑनलाइन जेनरेट करें। Code128, EAN-13, UPC-A सपोर्ट। PNG में डाउनलोड। मुफ़्त।",
  },
  "zip-creator": {
    title: "ZIP Creator — Create ZIP Archives Online Free",
    description: "Create ZIP files from multiple files online. Compress and bundle files into a single ZIP archive. Free, fast, and works in your browser.",
    keywords: "zip creator online, create zip file, zip archive maker, compress files to zip, file bundler, zip compressor online",
    titleHi: "ZIP क्रिएटर — ऑनलाइन ZIP आर्काइव बनाएँ",
    descriptionHi: "कई फ़ाइलों से ZIP फ़ाइल ऑनलाइन बनाएँ। फ़ाइल कंप्रेस और बंडल करें। तेज़, मुफ़्त, ब्राउज़र में काम करता है।",
  },
  "zip-extractor": {
    title: "ZIP Extractor — Extract ZIP Files Online Free",
    description: "Extract and unzip ZIP files online. View contents and download individual files. Supports ZIP, RAR, 7Z, TAR formats. Free archive extractor.",
    keywords: "zip extractor online, unzip file, extract zip, zip viewer, archive extractor, rar extractor, 7z extractor, decompress zip",
    titleHi: "ZIP एक्सट्रैक्टर — ZIP फ़ाइल ऑनलाइन खोलें",
    descriptionHi: "ZIP फ़ाइल ऑनलाइन एक्सट्रैक्ट और अनज़िप करें। कंटेंट देखें और इंडिविजुअल फ़ाइल डाउनलोड करें। ZIP, RAR, 7Z सपोर्ट। मुफ़्त।",
  },
  "zip-password-protector": {
    title: "ZIP Password Protector — Password Protect ZIP Files",
    description: "Add password protection to ZIP files online. Encrypt your archives with AES-256 encryption. Secure sensitive files before sharing. Free tool.",
    keywords: "zip password protector online, encrypt zip, password protect zip file, zip encryption, secure zip archive, protect files with password",
    titleHi: "ZIP पासवर्ड प्रोटेक्टर — ZIP फ़ाइल पासवर्ड सुरक्षित करें",
    descriptionHi: "ZIP फ़ाइल में ऑनलाइन पासवर्ड प्रोटेक्शन जोड़ें। AES-256 एन्क्रिप्शन से आर्काइव एन्क्रिप्ट करें। शेयर करने से पहले सुरक्षित करें। मुफ़्त।",
  },
  "color-picker": {
    title: "Color Picker — Pick Colors from Image & Get HEX, RGB",
    description: "Pick colors from any image or use the color wheel online. Get HEX, RGB, HSL codes instantly. Copy color codes. Free design and developer tool.",
    keywords: "color picker online, pick color from image, hex color picker, rgb color picker, color code generator, color wheel, eyedropper tool",
    titleHi: "कलर पिकर — इमेज से रंग चुनें, HEX, RGB पाएँ",
    descriptionHi: "किसी भी इमेज से रंग चुनें या कलर व्हील इस्तेमाल करें। HEX, RGB, HSL कोड तुरंत पाएँ। कॉपी करें। मुफ़्त।",
  },
  "css-generator": {
    title: "CSS Generator — Generate CSS Code Online Free",
    description: "Generate CSS code for common styles online. Create buttons, cards, layouts, and animations with visual editors. Copy CSS instantly. Free tool.",
    keywords: "css generator online, generate css code, css button generator, css card generator, css animation, web design tool, css creator",
    titleHi: "CSS जेनरेटर — CSS कोड ऑनलाइन जेनरेट करें",
    descriptionHi: "कॉमन स्टाइल के लिए CSS कोड ऑनलाइन जेनरेट करें। बटन, कार्ड, लेआउट और एनिमेशन विज़ुअल एडिटर से बनाएँ। मुफ़्त।",
  },
  "color-contrast": {
    title: "Color Contrast Checker — WCAG Accessibility Checker",
    description: "Check color contrast ratio for WCAG accessibility compliance online. Verify AA and AAA levels for text readability. Free accessibility tool.",
    keywords: "color contrast checker online, wcag contrast checker, accessibility contrast, text readability, color accessibility, aa aaa contrast",
    titleHi: "कलर कंट्रास्ट चेकर — WCAG एक्सेसिबिलिटी चेकर",
    descriptionHi: "WCAG एक्सेसिबिलिटी के लिए कलर कंट्रास्ट रेश्यो ऑनलाइन चेक करें। AA और AAA लेवल वेरिफ़ाई करें। मुफ़्त।",
  },
  "palette-generator": {
    title: "Color Palette Generator — Generate Color Schemes Online",
    description: "Generate beautiful color palettes and schemes online. Create harmonious, complementary, and analogous color combinations. Free design tool.",
    keywords: "color palette generator online, color scheme generator, create color palette, color harmony, design colors, palette maker",
    titleHi: "कलर पैलेट जेनरेटर — कलर स्कीम ऑनलाइन बनाएँ",
    descriptionHi: "खूबसूरत कलर पैलेट और स्कीम ऑनलाइन जेनरेट करें। हार्मोनियस और कॉम्प्लिमेंट्री कलर कॉम्बिनेशन। मुफ़्त।",
  },
  "favicon-generator": {
    title: "Favicon Generator — Create Favicon.ico from Image",
    description: "Generate favicons (favicon.ico) from any image online. Create multiple sizes for browser tabs, bookmarks, and mobile. Free tool.",
    keywords: "favicon generator online, create favicon, ico generator, favicon maker, website icon generator, browser icon, favicon from image",
    titleHi: "फ़ेविकॉन जेनरेटर — इमेज से Favicon.ico बनाएँ",
    descriptionHi: "किसी भी इमेज से फ़ेविकॉन (favicon.ico) ऑनलाइन जेनरेट करें। ब्राउज़र टैब, बुकमार्क और मोबाइल के लिए कई साइज़। मुफ़्त।",
  },
  "color-blindness-simulator": {
    title: "Color Blindness Simulator — Test Color Accessibility",
    description: "Simulate how colorblind users see your designs online. Test for protanopia, deuteranopia, and tritanopia. Free accessibility design tool.",
    keywords: "color blindness simulator online, color blind test, accessibility design, protanopia simulator, deuteranopia, color vision deficiency",
    titleHi: "कलर ब्लाइंडनेस सिम्युलेटर — कलर एक्सेसिबिलिटी टेस्ट",
    descriptionHi: "देखें कि कलर ब्लाइंड यूज़र आपका डिज़ाइन कैसे देखते हैं। प्रोटैनोपिया, ड्यूटेरैनोपिया टेस्ट करें। मुफ़्त।",
  },
  "svg-optimizer": {
    title: "SVG Optimizer — Compress & Minify SVG Online Free",
    description: "Optimize and compress SVG files online. Strip metadata, remove empty groups, reduce decimal precision. Keep visuals identical. Free tool.",
    keywords: "svg optimizer online, compress svg, minify svg, svg cleaner, reduce svg size, svg compression tool, optimize svg for web",
    titleHi: "SVG ऑप्टिमाइज़र — SVG ऑनलाइन कंप्रेस करें",
    descriptionHi: "SVG फ़ाइल ऑनलाइन ऑप्टिमाइज़ और कंप्रेस करें। मेटाडेटा हटाएँ, खाली ग्रुप हटाएँ, दशमलव कम करें। दृश्य समान। मुफ़्त।",
  },
  "world-clock": { title: "World Clock", description: "View world time.", keywords: "world clock" },
  "countdown-timer": { title: "Countdown Timer", description: "Countdown timer.", keywords: "countdown" },
  "stopwatch": { title: "Stopwatch", description: "Stopwatch timer.", keywords: "stopwatch" },
  "sunrise-sunset": { title: "Sunrise Sunset Calculator", description: "Calculate sunrise/sunset.", keywords: "sunrise sunset" },
  "calendar-generator": { title: "Calendar Generator", description: "Generate calendars.", keywords: "calendar" },
  "object-detection": { title: "Object Detection — AI", description: "Detect objects.", keywords: "object detection" },
  "face-detection": { title: "Face Detection — AI", description: "Detect faces.", keywords: "face detection" },
  "pose-estimation": { title: "Pose Estimation — AI", description: "Estimate poses.", keywords: "pose estimation" },
  "image-classifier": { title: "Image Classifier — AI", description: "Classify images.", keywords: "image classifier" },
  "instagram-filters": { title: "Instagram Filters", description: "Apply filters.", keywords: "instagram filters" },
  "pan-validator": { title: "PAN Card Validator", description: "Validate PAN.", keywords: "pan validator" },
  "gstin-validator": { title: "GSTIN Validator", description: "Validate GSTIN.", keywords: "gstin" },
  "ifsc-validator": { title: "IFSC Validator", description: "Validate IFSC.", keywords: "ifsc" },
  "aadhaar-mask": { title: "Aadhaar Mask", description: "Mask Aadhaar.", keywords: "aadhaar mask" },
  "uuid-generator": { title: "UUID Generator", description: "Generate UUIDs.", keywords: "uuid" },
  "mongo-objectid": { title: "MongoDB ObjectId", description: "Generate ObjectId.", keywords: "mongodb" },
  "bcrypt-generator": { title: "Bcrypt Generator", description: "Generate bcrypt.", keywords: "bcrypt" },
  "json-to-sql": { title: "JSON to SQL", description: "Convert to SQL.", keywords: "json to sql" },
  "csv-to-sql": { title: "CSV to SQL", description: "Convert to SQL.", keywords: "csv to sql" },
  "yaml-to-json": { title: "YAML to JSON", description: "Convert YAML to JSON.", keywords: "yaml to json" },
  "pdf-form-filler": { title: "PDF Form Filler", description: "Fill PDF forms.", keywords: "pdf form" },
  "pdf-redaction": { title: "PDF Redaction", description: "Redact PDFs.", keywords: "pdf redaction" },
  "audio-recorder": { title: "Audio Recorder", description: "Record audio.", keywords: "audio recorder" },
  "audio-waveform-viewer": { title: "Audio Waveform Viewer", description: "View waveforms.", keywords: "waveform" },
  "audio-visualizer": { title: "Audio Visualizer", description: "Visualize audio.", keywords: "visualizer" },
  "audio-mixer": { title: "Audio Mixer", description: "Mix audio.", keywords: "audio mixer" },
  "bpm-counter": { title: "BPM Counter", description: "Find BPM.", keywords: "bpm counter" },
  "video-compressor": { title: "Video Compressor", description: "Compress video.", keywords: "video compressor" },
  "video-thumbnail-extract": { title: "Video Thumbnail Extract", description: "Extract thumbnails.", keywords: "video thumbnail" },
  "video-watermark": { title: "Video Watermark", description: "Add watermark.", keywords: "video watermark" },
  "video-green-screen": { title: "Green Screen", description: "Remove green screen.", keywords: "green screen" },
  "video-mute": { title: "Mute Video", description: "Remove audio.", keywords: "video mute" },
  "burn-subtitles": { title: "Burn Subtitles", description: "Burn subtitles.", keywords: "burn subtitles" },
  "qr-with-logo": { title: "QR Code with Logo", description: "QR with logo.", keywords: "qr logo" },
  "qr-decoder": { title: "QR Decoder", description: "Decode QR.", keywords: "qr decoder" },
  "archive-extractor": { title: "Archive Extractor", description: "Extract archives.", keywords: "archive" },
  "archive-preview": { title: "Archive Preview", description: "Preview archives.", keywords: "archive preview" },
  "dummy-image-generator": { title: "Dummy Image Generator", description: "Generate dummy images.", keywords: "dummy image" },
  "json-to-excel": { title: "JSON to Excel", description: "Convert to Excel.", keywords: "json excel" },
  "excel-to-json": { title: "Excel to JSON", description: "Convert to JSON.", keywords: "excel json" },
  "simple-paint": { title: "Simple Paint", description: "Draw online.", keywords: "simple paint" },
  "ics-generator": { title: "ICS Generator", description: "Generate ICS.", keywords: "ics generator" },
  "time-tracker": { title: "Time Tracker", description: "Track time.", keywords: "time tracker" },
  "panchang": { title: "Panchang", description: "Hindu calendar.", keywords: "panchang" },
  "compound-interest": { title: "Compound Interest Calculator", description: "Calculate interest.", keywords: "compound interest" },
  "matrix-calculator": { title: "Matrix Calculator", description: "Calculate matrices.", keywords: "matrix" },
  "graphing-calculator": { title: "Graphing Calculator", description: "Plot graphs.", keywords: "graphing" },
  "statistics-calculator": { title: "Statistics Calculator", description: "Calculate stats.", keywords: "statistics" },
  "image-effects": { title: "Image Effects", description: "Apply effects.", keywords: "image effects" },
  "style-transfer": { title: "Style Transfer — AI", description: "Transfer style.", keywords: "style transfer" },
};

/**
 * Helper to generate standard Metadata for a tool page.
 */
export function getToolMetadata(slug: string): Metadata {
  const seo = PAGE_SEO[slug];
  if (!seo) return {};

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
      languages: {
        en: `${BASE_URL}/${slug}`,
        "en-IN": `${BASE_URL}/${slug}`,
        hi: `${BASE_URL}/hi/${slug}`,
        "x-default": `${BASE_URL}/${slug}`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${BASE_URL}/${slug}`,
      siteName: "FileForge",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og-image.png"],
    },
  };
}

/**
 * Helper to generate SoftwareApplication JSON-LD schema.
 */
export function getToolSchema(slug: string) {
  const seo = PAGE_SEO[slug];
  if (!seo) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: seo.title.split("—")[0].trim(), // Base title
    operatingSystem: "Web",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: seo.description,
    url: `${BASE_URL}/${slug}`,
  };
}
