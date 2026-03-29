"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiDownload, FiCheck, FiCopy } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function PrivacyPolicyGeneratorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [companyName, setCompanyName] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [email, setEmail] = useState('');
    
    const [hasAccounts, setHasAccounts] = useState(false);
    const [hasAds, setHasAds] = useState(false);
    const [hasCookies, setHasCookies] = useState(true);

    const [isCopied, setIsCopied] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    const effectiveCompany = companyName || '[Your Company Name]';
    const effectiveWebsite = websiteName || '[Your Website Name]';
    const effectiveUrl = websiteUrl || '[Your Website URL]';
    const effectiveEmail = email || '[Your Contact Email]';
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const generatePolicyHTML = () => {
        let html = `<h1>Privacy Policy for ${effectiveWebsite}</h1>\n\n`;
        html += `<p><strong>Last updated:</strong> ${today}</p>\n\n`;
        
        html += `<p>At ${effectiveWebsite}, accessible from <a href="${effectiveUrl}">${effectiveUrl}</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ${effectiveCompany} and how we use it.</p>\n\n`;
        html += `<p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at ${effectiveEmail}.</p>\n\n`;

        html += `<h2>Consent</h2>\n`;
        html += `<p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>\n\n`;

        html += `<h2>Information we collect</h2>\n`;
        html += `<p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>\n`;
        html += `<p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>\n\n`;

        if (hasAccounts) {
            html += `<p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>\n\n`;
        }

        html += `<h2>How we use your information</h2>\n`;
        html += `<p>We use the information we collect in various ways, including to:</p>\n`;
        html += `<ul>\n`;
        html += `  <li>Provide, operate, and maintain our website</li>\n`;
        html += `  <li>Improve, personalize, and expand our website</li>\n`;
        html += `  <li>Understand and analyze how you use our website</li>\n`;
        html += `  <li>Develop new products, services, features, and functionality</li>\n`;
        html += `  <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>\n`;
        html += `  <li>Send you emails</li>\n`;
        html += `  <li>Find and prevent fraud</li>\n`;
        html += `</ul>\n\n`;

        if (hasCookies) {
            html += `<h2>Cookies and Web Beacons</h2>\n`;
            html += `<p>Like any other website, ${effectiveWebsite} uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>\n\n`;
        }

        if (hasAds) {
            html += `<h2>Advertising Partners Privacy Policies</h2>\n`;
            html += `<p>You may consult this list to find the Privacy Policy for each of the advertising partners of ${effectiveWebsite}.</p>\n`;
            html += `<p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ${effectiveWebsite}, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>\n`;
            html += `<p>Note that ${effectiveWebsite} has no access to or control over these cookies that are used by third-party advertisers.</p>\n\n`;
        }

        html += `<h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>\n`;
        html += `<p>Under the CCPA, among other rights, California consumers have the right to: Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers. Request that a business delete any personal data about the consumer that a business has collected. Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>\n\n`;

        html += `<h2>GDPR Data Protection Rights</h2>\n`;
        html += `<p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>\n`;
        html += `<ul>\n`;
        html += `  <li><strong>The right to access</strong> – You have the right to request copies of your personal data.</li>\n`;
        html += `  <li><strong>The right to rectification</strong> – You have the right to request that we correct any information you believe is inaccurate.</li>\n`;
        html += `  <li><strong>The right to erasure</strong> – You have the right to request that we erase your personal data, under certain conditions.</li>\n`;
        html += `  <li><strong>The right to restrict processing</strong> – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>\n`;
        html += `  <li><strong>The right to object to processing</strong> – You have the right to object to our processing of your personal data, under certain conditions.</li>\n`;
        html += `  <li><strong>The right to data portability</strong> – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>\n`;
        html += `</ul>\n`;

        return html;
    };

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(generatePolicyHTML());
        setIsCopied(true);
        toast.success('Privacy Policy HTML Copied!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownloadHtml = () => {
        const text = generatePolicyHTML();
        const blob = new Blob([text], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `privacy-policy-${effectiveWebsite.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded as HTML');
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Privacy Policy Generator"
            description="Generate a standard Privacy Policy for your app or website covering GDPR, CCPA, and standard cookie usage."
        >
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* ─── LEFT: INPUT FORM ──────────────────────────────────────── */}
                <div className="w-full lg:w-2/5 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                            Business Details
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Company Name
                                </label>
                                <Input 
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Acme Corp LLC"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Website Name
                                </label>
                                <Input 
                                    value={websiteName}
                                    onChange={(e) => setWebsiteName(e.target.value)}
                                    placeholder="e.g. Acme Services"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Website URL
                                </label>
                                <Input 
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="e.g. https://acmeservices.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Contact Email
                                </label>
                                <Input 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. privacy@acmeservices.com"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                            Features & Compliance
                        </h2>
                        
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-0.5">
                                    <input 
                                        type="checkbox" 
                                        checked={hasAccounts}
                                        onChange={(e) => setHasAccounts(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">User Accounts</div>
                                    <div className="text-xs text-slate-500">Do users create accounts on your site?</div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-0.5">
                                    <input 
                                        type="checkbox" 
                                        checked={hasCookies}
                                        onChange={(e) => setHasCookies(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Use of Cookies</div>
                                    <div className="text-xs text-slate-500">Do you use analytics, sessions, or tracking cookies?</div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-0.5">
                                    <input 
                                        type="checkbox" 
                                        checked={hasAds}
                                        onChange={(e) => setHasAds(e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Advertising</div>
                                    <div className="text-xs text-slate-500">Do you run Google AdSense or similar 3rd party ads?</div>
                                </div>
                            </label>
                        </div>
                    </Card>
                </div>

                {/* ─── RIGHT: PREVIEW ───────────────────────────────────────── */}
                <div className="w-full lg:w-3/5 flex flex-col">
                    <Card className="p-0 overflow-hidden flex flex-col h-[600px] lg:h-auto lg:flex-1">
                        <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center shrink-0">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Preview</span>
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="h-8 gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    onClick={handleCopyHtml}
                                >
                                    {isCopied ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                                    {isCopied ? 'Copied HTML' : 'Copy HTML'}
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="primary" 
                                    className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 border-none" 
                                    onClick={handleDownloadHtml}
                                >
                                    <FiDownload size={14} /> Download HTML
                                </Button>
                            </div>
                        </div>
                        
                        {/* Live rendered HTML preview */}
                        <div className="flex-1 overflow-auto bg-white p-6 sm:p-8 border-t-4 border-indigo-500">
                            <div 
                                className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-lg prose-a:text-indigo-600"
                                dangerouslySetInnerHTML={{ __html: generatePolicyHTML() }}
                            />
                        </div>
                    </Card>
                </div>

            </div>
        </ToolLayout>
    );
}
