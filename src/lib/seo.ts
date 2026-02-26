import { Metadata } from "next";

const BASE_URL = "https://forgetech.vercel.app";

/**
 * SEO metadata definitions for all tool pages.
 * Each key corresponds to a route directory under /app/.
 */
export const PAGE_SEO: Record<
  string,
  { title: string; description: string; keywords: string }
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
  "image-compressor": {
    title: "Image Compressor — Smart Compression for Web",
    description:
      "Smart image compression to minimize file size while maintaining quality. Batch process, preview, and download.",
    keywords:
      "bulk image compressor online free, image optimizer free, reduce image size online, image compressor, compress image settings, smart compression, web image optimizer",
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };
}
