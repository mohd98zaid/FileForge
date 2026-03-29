"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiCopy, FiCheck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { toast } from 'react-hot-toast';

export default function MetaTagGeneratorPage() {
    // We'll use inline translations like previous tools to ensure rapid delivery 
    // without needing to touch external en.json/hi.json files right now.
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    
    // Robot directives
    const [index, setIndex] = useState(true);
    const [follow, setFollow] = useState(true);
    
    // Language & Charset
    const [language, setLanguage] = useState('en');
    const [charset, setCharset] = useState('UTF-8');

    // Output code
    const [generatedCode, setGeneratedCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        generateTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, description, keywords, author, imageUrl, pageUrl, index, follow, language, charset]);

    const generateTags = () => {
        let code = `<meta charset="${charset}">\n`;
        code += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
        
        if (title) {
            code += `<title>${title}</title>\n`;
            code += `<meta name="title" content="${title}">\n`;
        }
        
        if (description) {
            code += `<meta name="description" content="${description}">\n`;
        }
        
        if (keywords) {
            code += `<meta name="keywords" content="${keywords}">\n`;
        }
        
        const robotsContent = `${index ? 'index' : 'noindex'}, ${follow ? 'follow' : 'nofollow'}`;
        code += `<meta name="robots" content="${robotsContent}">\n`;
        
        if (author) {
            code += `<meta name="author" content="${author}">\n`;
        }
        
        if (language) {
            code += `<meta name="language" content="${language}">\n`;
        }

        // Open Graph / Facebook
        code += `\n<!-- Open Graph / Facebook -->\n`;
        code += `<meta property="og:type" content="website">\n`;
        if (pageUrl) code += `<meta property="og:url" content="${pageUrl}">\n`;
        if (title) code += `<meta property="og:title" content="${title}">\n`;
        if (description) code += `<meta property="og:description" content="${description}">\n`;
        if (imageUrl) code += `<meta property="og:image" content="${imageUrl}">\n`;

        // Twitter
        code += `\n<!-- Twitter -->\n`;
        code += `<meta property="twitter:card" content="summary_large_image">\n`;
        if (pageUrl) code += `<meta property="twitter:url" content="${pageUrl}">\n`;
        if (title) code += `<meta property="twitter:title" content="${title}">\n`;
        if (description) code += `<meta property="twitter:description" content="${description}">\n`;
        if (imageUrl) code += `<meta property="twitter:image" content="${imageUrl}">\n`;

        setGeneratedCode(code.trim());
    };

    const handleCopy = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        setIsCopied(true);
        toast.success('Tags copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleClear = () => {
        setTitle('');
        setDescription('');
        setKeywords('');
        setAuthor('');
        setImageUrl('');
        setPageUrl('');
        setIndex(true);
        setFollow(true);
        setLanguage('en');
        setCharset('UTF-8');
        toast('Form cleared', { icon: '🧹' });
    };

    // ─── VALIDATION ────────────────────────────────────────────────────────
    const isTitleTooLong = title.length > 60;
    const isDescTooLong = description.length > 160;

    return (
        <ToolLayout
            title="Meta Tag Generator"
            description="Generate perfect SEO meta tags, Open Graph, and Twitter Cards for your website."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* ─── LEFT: INPUT FORM ──────────────────────────────────────── */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center justify-between">
                            <span>Basic SEO Information</span>
                            <button onClick={handleClear} className="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors">
                                <FiRefreshCw size={14} /> Clear All
                            </button>
                        </h2>
                        
                        <div className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Site / Page Title <span className="text-rose-500">*</span>
                                </label>
                                <Input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="FileForge - Free Browser Tools"
                                    className={isTitleTooLong ? 'border-amber-500 focus:ring-amber-500' : ''}
                                />
                                <div className="flex justify-between mt-1 text-xs">
                                    <span className="text-slate-500">Recommended: ~60 chars</span>
                                    <span className={isTitleTooLong ? 'text-amber-500 font-medium' : 'text-slate-500'}>
                                        {title.length} chars
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Meta Description <span className="text-rose-500">*</span>
                                </label>
                                <TextArea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A collection of 100% free, client-side browser tools for developers and creators."
                                    rows={3}
                                    className={isDescTooLong ? 'border-amber-500 focus:ring-amber-500' : ''}
                                />
                                <div className="flex justify-between mt-1 text-xs">
                                    <span className="text-slate-500">Recommended: ~160 chars</span>
                                    <span className={isDescTooLong ? 'text-amber-500 font-medium' : 'text-slate-500'}>
                                        {description.length} chars
                                    </span>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Keywords (Comma separated)
                                </label>
                                <Input 
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="tools, utilities, pdf maker, file converter, seo"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Author
                                </label>
                                <Input 
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                            Social & Advanced
                        </h2>
                        
                        <div className="space-y-5">
                            {/* URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Canonical URL
                                </label>
                                <Input 
                                    value={pageUrl}
                                    onChange={(e) => setPageUrl(e.target.value)}
                                    placeholder="https://example.com/my-tool"
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Social Banner Image URL (OG / Twitter)
                                </label>
                                <Input 
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/banner.jpg"
                                />
                            </div>

                            {/* Robots */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Allow Search Engines (Index)?
                                    </label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button 
                                            onClick={() => setIndex(true)}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${index ? 'bg-white shadow-sm dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            Yes (Index)
                                        </button>
                                        <button 
                                            onClick={() => setIndex(false)}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${!index ? 'bg-white shadow-sm dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Allow Link Following?
                                    </label>
                                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button 
                                            onClick={() => setFollow(true)}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${follow ? 'bg-white shadow-sm dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            Yes (Follow)
                                        </button>
                                        <button 
                                            onClick={() => setFollow(false)}
                                            className={`flex-1 text-sm py-1.5 rounded-md transition-all ${!follow ? 'bg-white shadow-sm dark:bg-slate-700 text-rose-600 dark:text-rose-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ─── RIGHT: PREVIEW & OUTPUT ───────────────────────────────── */}
                <div className="w-full lg:w-1/2 space-y-6">
                    
                    {/* Google SERP Preview */}
                    <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="bg-slate-100 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-2 text-xs font-mono text-slate-500 tracking-wider uppercase">Google Search Preview</span>
                        </div>
                        
                        <div className="p-6">
                            <div className="font-sans max-w-xl">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs shadow-inner">🌐</div>
                                    <div>
                                        <div className="text-sm text-slate-800 dark:text-slate-200 leading-tight">Your Website Name</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{pageUrl || 'https://example.com'}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer truncate mb-1">
                                    {title || 'Your Page Title Appears Here'}
                                </h3>
                                <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-snug break-words line-clamp-2">
                                    {description || 'This is where your meta description will appear in search results. It should clearly explain what your page is about to encourage users to click.'}
                                </p>
                            </div>
                        </div>
                        
                        {(isTitleTooLong || isDescTooLong) && (
                            <div className="px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border-t border-amber-200 dark:border-amber-500/20 flex items-start gap-2 text-amber-800 dark:text-amber-400">
                                <FiAlertCircle className="mt-0.5 shrink-0" />
                                <div className="text-sm">
                                    {isTitleTooLong && <p>Your title exceeds 60 characters and may be truncated by Google.</p>}
                                    {isDescTooLong && <p>Your description exceeds 160 characters and may be truncated by Google.</p>}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Code Output */}
                    <Card className="p-0 overflow-hidden flex flex-col h-[400px]">
                        <div className="bg-slate-800 text-slate-200 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                            <span className="text-sm font-semibold tracking-wide">Output HTML (`{'<head>'}`)</span>
                            <Button 
                                size="sm" 
                                variant="primary" 
                                className="h-8 gap-2 bg-indigo-500 hover:bg-indigo-600 border-none" 
                                onClick={handleCopy}
                            >
                                {isCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                {isCopied ? 'Copied!' : 'Copy Tags'}
                            </Button>
                        </div>
                        <div className="flex-1 bg-slate-900 p-4 overflow-auto">
                            <pre className="text-sm text-amber-200/90 font-mono whitespace-pre-wrap leading-relaxed">
                                <code>{generatedCode}</code>
                            </pre>
                        </div>
                    </Card>
                </div>

            </div>
        </ToolLayout>
    );
}
