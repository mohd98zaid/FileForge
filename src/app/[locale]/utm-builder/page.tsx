"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiCopy, FiCheck, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function UtmBuilderPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [baseUrl, setBaseUrl] = useState('');
    const [source, setSource] = useState('');
    const [medium, setMedium] = useState('');
    const [campaign, setCampaign] = useState('');
    const [term, setTerm] = useState('');
    const [content, setContent] = useState('');

    const [generatedUrl, setGeneratedUrl] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        buildUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, source, medium, campaign, term, content]);

    const buildUrl = () => {
        if (!baseUrl) {
            setGeneratedUrl('');
            return;
        }

        try {
            // Check if user typed "example.com" instead of "https://example.com"
            const urlToConstruct = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
            const url = new URL(urlToConstruct);

            if (source) url.searchParams.set('utm_source', source.trim());
            if (medium) url.searchParams.set('utm_medium', medium.trim());
            if (campaign) url.searchParams.set('utm_campaign', campaign.trim());
            if (term) url.searchParams.set('utm_term', term.trim());
            if (content) url.searchParams.set('utm_content', content.trim());

            setGeneratedUrl(url.toString());
        } catch (e) {
            // Invalid URL handling (User might still be typing)
            // Fallback to simple string concatenation for live typing UX
            let fallback = baseUrl;
            const params = [];
            if (source) params.push(`utm_source=${encodeURIComponent(source.trim())}`);
            if (medium) params.push(`utm_medium=${encodeURIComponent(medium.trim())}`);
            if (campaign) params.push(`utm_campaign=${encodeURIComponent(campaign.trim())}`);
            if (term) params.push(`utm_term=${encodeURIComponent(term.trim())}`);
            if (content) params.push(`utm_content=${encodeURIComponent(content.trim())}`);

            if (params.length > 0) {
                const separator = fallback.includes('?') ? '&' : '?';
                fallback += separator + params.join('&');
            }
            setGeneratedUrl(fallback);
        }
    };

    const handleCopy = () => {
        if (!generatedUrl) return;
        navigator.clipboard.writeText(generatedUrl);
        setIsCopied(true);
        toast.success('UTM URL copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleClear = () => {
        setBaseUrl('');
        setSource('');
        setMedium('');
        setCampaign('');
        setTerm('');
        setContent('');
        toast('Form cleared', { icon: '🧹' });
    };

    const isUrlValid = () => {
        try {
            new URL(generatedUrl);
            return true;
        } catch (_) {
            return false;
        }
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="UTM Builder"
            description="Add custom campaign parameters to your URLs so you can track custom campaigns in Google Analytics."
        >
            <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
                
                {/* ─── LEFT PANEL (Inputs) ─────────────────────────────────── */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                Campaign Parameters
                            </h2>
                            <button onClick={handleClear} className="text-sm text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors">
                                <FiRefreshCw size={14} /> Clear All
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Website URL <span className="text-rose-500">*</span>
                                </label>
                                <Input 
                                    value={baseUrl}
                                    onChange={(e) => setBaseUrl(e.target.value)}
                                    placeholder="https://www.example.com"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">The full website URL (e.g. https://www.example.com)</p>
                            </div>

                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Campaign Source <span className="text-rose-500">*</span>
                                </label>
                                <Input 
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    placeholder="google, newsletter, facebook"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">The referrer: (e.g. google, newsletter)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Campaign Medium
                                </label>
                                <Input 
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    placeholder="cpc, banner, email"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">Marketing medium: (e.g. cpc, banner, email)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Campaign Name
                                </label>
                                <Input 
                                    value={campaign}
                                    onChange={(e) => setCampaign(e.target.value)}
                                    placeholder="spring_sale, product_launch"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">Product, promo code, or slogan</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Campaign Term
                                </label>
                                <Input 
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                    placeholder="running+shoes"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">Identify the paid keywords</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Campaign Content
                                </label>
                                <Input 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="logolink, textlink"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">Use to differentiate ads</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ─── RIGHT PANEL (Output) ────────────────────────────────── */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="sticky top-6">
                        <Card className="p-0 overflow-hidden border border-indigo-100 dark:border-indigo-500/30">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 px-6 py-4 border-b border-indigo-100 dark:border-indigo-500/30 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
                                    Generated URL
                                </h2>
                                {isUrlValid() && generatedUrl && (
                                    <a 
                                        href={generatedUrl} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        Test Link <FiExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-slate-900 flex flex-col items-center justify-center min-h-[300px]">
                                {!generatedUrl ? (
                                    <div className="text-center text-slate-400 dark:text-slate-500 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                            <FiCheck size={24} />
                                        </div>
                                        <p>Enter a Website URL to begin building.</p>
                                    </div>
                                ) : (
                                    <div className="w-full space-y-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 break-all font-mono text-sm text-slate-800 dark:text-slate-200 leading-relaxed min-h-[120px]">
                                            {generatedUrl}
                                        </div>
                                        
                                        <Button 
                                            variant="primary" 
                                            size="lg" 
                                            className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" 
                                            onClick={handleCopy}
                                        >
                                            {isCopied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                                            {isCopied ? 'URL Copied!' : 'Copy Full URL'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                        
                        {/* Explanation Box */}
                        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">How do UTM tags work?</h3>
                            <p className="mb-2">UTM (Urchin Tracking Module) parameters are five variants of URL parameters used by marketers to track the effectiveness of online marketing campaigns.</p>
                            <p>When users click on the generated link, Google Analytics reads the tags and attributes the traffic to the specific campaign, letting you see exactly which posts or ads are driving visits.</p>
                        </div>
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
