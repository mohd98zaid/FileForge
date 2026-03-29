"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiDownload, FiCheck, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface RuleGroup {
    id: string;
    userAgent: string;
    allows: string[];
    disallows: string[];
    crawlDelay?: string;
}

export default function RobotsTxtGeneratorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [sitemapUrl, setSitemapUrl] = useState('https://example.com/sitemap.xml');
    
    // Default config starts with one "allow all" rule for all agents
    const [groups, setGroups] = useState<RuleGroup[]>([
        { id: 'default', userAgent: '*', allows: [], disallows: [], crawlDelay: '' }
    ]);
    
    const [generatedCode, setGeneratedCode] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    const handleAddGroup = () => {
        setGroups([...groups, { 
            id: crypto.randomUUID(), 
            userAgent: 'Googlebot', 
            allows: [], 
            disallows: ['/private/', '/tmp/'],
            crawlDelay: ''
        }]);
    };

    const handleRemoveGroup = (id: string) => {
        setGroups(groups.filter(g => g.id !== id));
    };

    const handleUpdateGroupAgent = (id: string, agent: string) => {
        setGroups(groups.map(g => g.id === id ? { ...g, userAgent: agent } : g));
    };
    
    const handleUpdateGroupDelay = (id: string, delay: string) => {
        setGroups(groups.map(g => g.id === id ? { ...g, crawlDelay: delay } : g));
    };

    const handlePathChange = (groupId: string, type: 'allow' | 'disallow', pathsStr: string) => {
        // split by comma or newline and clean up
        const paths = pathsStr.split(/[\n,]+/).map(p => p.trim()).filter(Boolean);
        setGroups(groups.map(g => {
            if (g.id !== groupId) return g;
            return type === 'allow' ? { ...g, allows: paths } : { ...g, disallows: paths };
        }));
    };

    const getPathsString = (paths: string[]) => paths.join('\n');

    const generateRobotsTxt = () => {
        let txt = '';
        
        for (const group of groups) {
            if (!group.userAgent) continue;
            
            txt += `User-agent: ${group.userAgent}\n`;
            
            if (group.crawlDelay) {
                txt += `Crawl-delay: ${group.crawlDelay}\n`;
            }
            
            for (const allow of group.allows) {
                txt += `Allow: ${allow}\n`;
            }
            
            for (const disallow of group.disallows) {
                txt += `Disallow: ${disallow}\n`;
            }
            
            // If they explicitly declared a group but added 0 rules, it technically allows everything natively, 
            // but explicitly writing Allow: / is clearer.
            if (group.allows.length === 0 && group.disallows.length === 0) {
                 txt += `Allow: /\n`;
            }
            
            txt += `\n`;
        }
        
        if (sitemapUrl) {
            txt += `Sitemap: ${sitemapUrl}\n`;
        }
        
        return txt.trim();
    };

    // Auto-update code preview whenever dependencies change
    React.useEffect(() => {
        setGeneratedCode(generateRobotsTxt());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups, sitemapUrl]);

    const handleDownload = () => {
        if (!generatedCode) return;
        setIsExporting(true);
        setTimeout(() => {
            try {
                const blob = new Blob([generatedCode], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'robots.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('robots.txt downloaded!');
            } catch (err) {
                toast.error('Failed to export file');
            }
            setIsExporting(false);
        }, 500);
    };

    const applyPreset = (type: 'allow-all' | 'disallow-all' | 'wordpress') => {
        if (type === 'allow-all') {
            setGroups([{ id: crypto.randomUUID(), userAgent: '*', allows: ['/'], disallows: [] }]);
        } else if (type === 'disallow-all') {
            setGroups([{ id: crypto.randomUUID(), userAgent: '*', allows: [], disallows: ['/'] }]);
        } else if (type === 'wordpress') {
            setGroups([
                { id: crypto.randomUUID(), userAgent: '*', allows: ['/wp-admin/admin-ajax.php'], disallows: ['/wp-admin/', '/wp-includes/'] }
            ]);
        }
        toast.success(`Applied ${type} preset`);
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Robots.txt Generator"
            description="Generate a compliant robots.txt file to instruct search engine crawlers on how to index your site."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* ─── LEFT PANEL (Builder) ─────────────────────────────────── */}
                <div className="w-full lg:w-3/5 flex flex-col gap-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <FiFileText className="text-indigo-500" /> Global Settings
                            </h2>
                            <div className="flex gap-2">
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="text-xs py-1 h-7"
                                    onClick={() => applyPreset('allow-all')}
                                >
                                    Allow All
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="text-xs py-1 h-7 text-rose-600 dark:text-rose-400"
                                    onClick={() => applyPreset('disallow-all')}
                                >
                                    Block All
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    size="sm" 
                                    className="text-xs py-1 h-7"
                                    onClick={() => applyPreset('wordpress')}
                                >
                                    WordPress
                                </Button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Default Sitemap URL (Optional)
                            </label>
                            <Input 
                                value={sitemapUrl}
                                onChange={(e) => setSitemapUrl(e.target.value)}
                                placeholder="https://yourwebsite.com/sitemap.xml"
                                className="font-mono text-sm"
                            />
                        </div>
                    </Card>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <h2 className="text-lg font-medium text-slate-700 dark:text-slate-300">Target Agents ({groups.length})</h2>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={handleAddGroup}
                                className="bg-indigo-500 hover:bg-indigo-600 border-none px-3"
                            >
                                <FiPlus size={16} /> Add Rule Group
                            </Button>
                        </div>
                        
                        {groups.map((group, idx) => (
                            <Card key={group.id} className="p-0 overflow-hidden relative border border-slate-200 dark:border-slate-800 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                                
                                {groups.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveGroup(group.id)}
                                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-900 rounded-md p-1 transition-colors"
                                        title="Remove Group"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                )}

                                <div className="bg-slate-50 dark:bg-slate-800/30 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pr-8">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">User Agent</label>
                                            <Input 
                                                value={group.userAgent}
                                                onChange={(e) => handleUpdateGroupAgent(group.id, e.target.value)}
                                                placeholder="*"
                                                className="font-mono text-sm h-9"
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase leading-tight">Use * for all robots, or specify (e.g. Googlebot, Bingbot)</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Crawl Delay (Seconds)</label>
                                            <Input 
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={group.crawlDelay || ''}
                                                onChange={(e) => handleUpdateGroupDelay(group.id, e.target.value)}
                                                placeholder="Optional (e.g., 10)"
                                                className="font-mono text-sm h-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900">
                                    {/* ALlows */}
                                    <div>
                                        <label className="block text-sm font-medium text-green-600 dark:text-green-500 mb-2">
                                            Allow these paths
                                        </label>
                                        <textarea 
                                            value={getPathsString(group.allows)}
                                            onChange={(e) => handlePathChange(group.id, 'allow', e.target.value)}
                                            placeholder="/public/&#10;/images/&#10;/"
                                            rows={4}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm shadow-sm transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono text-slate-800 dark:text-slate-200"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">One path per line.</p>
                                    </div>

                                    {/* Disallows */}
                                    <div>
                                        <label className="block text-sm font-medium text-rose-600 dark:text-rose-500 mb-2">
                                            Disallow these paths
                                        </label>
                                        <textarea 
                                            value={getPathsString(group.disallows)}
                                            onChange={(e) => handlePathChange(group.id, 'disallow', e.target.value)}
                                            placeholder="/private/&#10;/admin/&#10;/api/"
                                            rows={4}
                                            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm shadow-sm transition-colors focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-slate-800 dark:text-slate-200"
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">One path per line.</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ─── RIGHT PANEL (Preview & Export) ─────────────────────── */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <Card className="p-0 overflow-hidden flex flex-col h-[500px] lg:h-auto lg:flex-1 sticky top-6 sticky-safari">
                        <div className="bg-slate-800 text-slate-200 px-4 py-3 border-b border-slate-700 flex justify-between items-center shrinks-0">
                            <span className="text-sm font-semibold tracking-wide">Output (robots.txt)</span>
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="primary" 
                                    className="h-8 gap-2 bg-indigo-500 hover:bg-indigo-600 border-none" 
                                    onClick={handleDownload}
                                    disabled={!generatedCode || isExporting}
                                >
                                    {isExporting ? <FiCheck size={14} /> : <FiDownload size={14} />}
                                    Download
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-950 p-5 overflow-auto">
                            <pre className="text-sm text-amber-300/90 font-mono leading-relaxed">
                                {generatedCode}
                            </pre>
                            {!generatedCode && (
                                <div className="text-slate-600 italic mt-4 text-center">Output will appear here</div>
                            )}
                        </div>
                    </Card>
                </div>

            </div>
        </ToolLayout>
    );
}
