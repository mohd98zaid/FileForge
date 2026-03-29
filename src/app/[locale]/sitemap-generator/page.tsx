"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiDownload, FiCheck, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface SitemapEntry {
    id: string;
    urlPath: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}

export default function SitemapGeneratorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [baseUrl, setBaseUrl] = useState('https://example.com');
    const [entries, setEntries] = useState<SitemapEntry[]>([
        { id: 'home', urlPath: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' },
        { id: 'about', urlPath: '/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
        { id: 'contact', urlPath: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'yearly', priority: '0.5' },
    ]);
    const [isExporting, setIsExporting] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    const handleAddEntry = () => {
        const newEntry: SitemapEntry = {
            id: crypto.randomUUID(),
            urlPath: '/new-page',
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.5'
        };
        setEntries([...entries, newEntry]);
    };

    const handleUpdateEntry = (id: string, field: keyof SitemapEntry, value: string) => {
        setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleRemoveEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const generateXml = () => {
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        for (const entry of entries) {
            const cleanPath = entry.urlPath.startsWith('/') ? entry.urlPath : '/' + entry.urlPath;
            const fullUrl = cleanBaseUrl + (cleanPath === '/' ? '' : cleanPath);
            
            xml += '  <url>\n';
            xml += `    <loc>${fullUrl.replace(/&/g, '&amp;')}</loc>\n`;
            if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
            if (entry.changefreq) xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
            if (entry.priority) xml += `    <priority>${entry.priority}</priority>\n`;
            xml += '  </url>\n';
        }
        
        xml += '</urlset>';
        return xml;
    };

    const handleDownload = () => {
        setIsExporting(true);
        setTimeout(() => {
            try {
                const xmlContent = generateXml();
                const blob = new Blob([xmlContent], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sitemap.xml';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('sitemap.xml downloaded!');
            } catch (err) {
                toast.error('Failed to generate sitemap');
            }
            setIsExporting(false);
        }, 500); // Tiny delay for UX
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="XML Sitemap Generator"
            description="Build a compliant sitemap.xml to help search engines crawl and index your website perfectly."
        >
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <FiFileText className="text-indigo-500" /> Site Configuration
                    </h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Base Domain URL
                        </label>
                        <Input 
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className="font-mono text-sm max-w-md"
                        />
                        <p className="text-xs text-slate-500 mt-1">This will be prepended to all URL paths below.</p>
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Pages & URLs ({entries.length})
                        </h2>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={handleAddEntry}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border-none px-3"
                        >
                            <FiPlus size={16} /> Add Page
                        </Button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                        {entries.length === 0 && (
                            <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                                No entries. Add a page to start building your sitemap.
                            </div>
                        )}
                        
                        {entries.map((entry, idx) => (
                            <div key={entry.id} className="flex gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 items-end transition-all hover:border-slate-300 dark:hover:border-slate-600">
                                
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">URL Path</label>
                                    <Input 
                                        value={entry.urlPath}
                                        onChange={(e) => handleUpdateEntry(entry.id, 'urlPath', e.target.value)}
                                        placeholder="/about-us"
                                        className="font-mono text-sm h-9"
                                    />
                                </div>
                                
                                <div className="w-36">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Priority</label>
                                    <select 
                                        value={entry.priority}
                                        onChange={(e) => handleUpdateEntry(entry.id, 'priority', e.target.value)}
                                        className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                    >
                                        <option value="1.0">1.0 (High)</option>
                                        <option value="0.9">0.9</option>
                                        <option value="0.8">0.8</option>
                                        <option value="0.7">0.7</option>
                                        <option value="0.6">0.6</option>
                                        <option value="0.5">0.5 (Default)</option>
                                        <option value="0.4">0.4</option>
                                        <option value="0.3">0.3</option>
                                        <option value="0.2">0.2</option>
                                        <option value="0.1">0.1</option>
                                        <option value="0.0">0.0 (Low)</option>
                                    </select>
                                </div>

                                <div className="w-40">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Change Freq</label>
                                    <select 
                                        value={entry.changefreq}
                                        onChange={(e) => handleUpdateEntry(entry.id, 'changefreq', e.target.value)}
                                        className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                    >
                                        <option value="always">Always</option>
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                        <option value="never">Never</option>
                                    </select>
                                </div>
                                
                                <div className="w-44">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Last Modified</label>
                                    <input 
                                        type="date"
                                        value={entry.lastmod}
                                        onChange={(e) => handleUpdateEntry(entry.id, 'lastmod', e.target.value)}
                                        className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                <button
                                    onClick={() => handleRemoveEntry(entry.id)}
                                    className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors shrink-0"
                                    title="Remove Page"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {entries.length > 0 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
                            <Button 
                                variant="primary"
                                onClick={handleDownload}
                                disabled={isExporting}
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 gap-2"
                            >
                                {isExporting ? <FiCheck size={18} /> : <FiDownload size={18} />}
                                {isExporting ? 'Generated' : 'Download sitemap.xml'}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </ToolLayout>
    );
}
