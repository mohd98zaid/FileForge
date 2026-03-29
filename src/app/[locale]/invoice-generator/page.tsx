"use client";

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FiDownload, FiPlus, FiTrash2, FiPrinter } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    gstPercent: number;
}

export default function InvoiceGeneratorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    // Company Info
    const [companyName, setCompanyName] = useState('Your Company LLC');
    const [companyAddress, setCompanyAddress] = useState('123 Business Rd.\nTech City, 10001');
    const [companyEmail, setCompanyEmail] = useState('billing@yourcompany.com');
    const [gstIn, setGstIn] = useState('');

    // Client Info
    const [clientName, setClientName] = useState('Acme Corp');
    const [clientAddress, setClientAddress] = useState('456 Client St.\nIndustry Town, 90210');
    
    // Invoice Meta
    const [invoiceNum, setInvoiceNum] = useState('INV-2024-001');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    
    const [currency, setCurrency] = useState('₹');

    // Line Items
    const [items, setItems] = useState<LineItem[]>([
        { id: crypto.randomUUID(), description: 'Web Development Services', quantity: 1, rate: 10000, gstPercent: 18 },
        { id: crypto.randomUUID(), description: 'Server Hosting (1 Year)', quantity: 1, rate: 5000, gstPercent: 18 }
    ]);

    const printRef = useRef<HTMLDivElement>(null);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    const handleAddItem = () => {
        setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, gstPercent: 0 }]);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
        setItems(items.map(i => {
            if (i.id !== id) return i;
            if (field === 'description') return { ...i, description: value as string };
            return { ...i, [field]: Number(value) || 0 };
        }));
    };

    const formatCurrency = (val: number) => {
        if (currency === '₹') {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
        }
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val).replace('$', currency);
    };

    const calculateTotals = () => {
        let subtotal = 0;
        let totalGstAmount = 0;

        items.forEach(item => {
            const rowTotal = item.quantity * item.rate;
            const rowGst = rowTotal * (item.gstPercent / 100);
            subtotal += rowTotal;
            totalGstAmount += rowGst;
        });

        return {
            subtotal,
            gstAmount: totalGstAmount,
            total: subtotal + totalGstAmount
        };
    };

    const { subtotal, gstAmount, total } = calculateTotals();

    const handlePrint = () => {
        const style = document.createElement('style');
        style.type = 'text/css';
        // Hide EVERYTHING except the A4 preview box during printing
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #a4-invoice-preview, #a4-invoice-preview * {
                    visibility: visible;
                }
                #a4-invoice-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 210mm;
                    height: auto;
                    min-height: 297mm;
                    transform: scale(1) !important;
                    margin: 0 !important;
                    padding: 20mm !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: white !important;
                    color: black !important;
                }
                /* Ensure background colors print */
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
    };

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Invoice Generator"
            description="Create professional, printable, and calculating invoices directly in your browser without any watermarks."
        >
            <div className="flex flex-col xl:flex-row gap-6">
                
                {/* ─── LEFT: EDIT FORM ─────────────────────────────────────── */}
                <div className="w-full xl:w-[45%] flex flex-col gap-6">
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Company & Client</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Your Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">From</h3>
                                <Input 
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Your Company Name"
                                    className="font-medium"
                                />
                                <textarea 
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    placeholder="Company Address"
                                    rows={3}
                                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                                />
                                <Input 
                                    value={companyEmail}
                                    onChange={(e) => setCompanyEmail(e.target.value)}
                                    placeholder="Email Address"
                                />
                                <Input 
                                    value={gstIn}
                                    onChange={(e) => setGstIn(e.target.value)}
                                    placeholder="GSTIN/Tax ID (Optional)"
                                />
                            </div>

                            {/* Client Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Bill To</h3>
                                <Input 
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Client Name"
                                    className="font-medium"
                                />
                                <textarea 
                                    value={clientAddress}
                                    onChange={(e) => setClientAddress(e.target.value)}
                                    placeholder="Client Address"
                                    rows={3}
                                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-6"></div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Invoice #</label>
                                <Input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Invoice Date</label>
                                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Due Date</label>
                                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Currency</label>
                                <select 
                                    value={currency} 
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-[1px]"
                                >
                                    <option value="₹">₹ INR</option>
                                    <option value="$">$ USD</option>
                                    <option value="€">€ EUR</option>
                                    <option value="£">£ GBP</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                Line Items
                            </h2>
                            <Button variant="secondary" size="sm" onClick={handleAddItem} className="gap-1 border border-slate-300 dark:border-slate-600">
                                <FiPlus size={16} /> Add Item
                            </Button>
                        </div>

                        <div className="p-4 space-y-4 overflow-x-auto">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-12 gap-3 mb-2 px-1">
                                    <div className="col-span-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</div>
                                    <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</div>
                                    <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</div>
                                    <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider" title="Tax Percentage">Tax %</div>
                                    <div className="col-span-1 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right pr-2"></div>
                                </div>
                                
                                <div className="space-y-2">
                                    {items.map((item, idx) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                                            <div className="col-span-6">
                                                <Input 
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                    placeholder="Item description"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input 
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity || ''}
                                                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2 relative">
                                                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">{currency}</span>
                                                <Input 
                                                    type="number"
                                                    min="0"
                                                    value={item.rate || ''}
                                                    onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                                                    className="pl-7 pr-2 font-mono"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <Input 
                                                    type="number"
                                                    min="0" max="100"
                                                    value={item.gstPercent || ''}
                                                    onChange={(e) => handleItemChange(item.id, 'gstPercent', e.target.value)}
                                                    className="font-mono px-2 text-center"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-2"
                                                    title="Remove Item"
                                                    disabled={items.length === 1}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col items-end gap-3 text-right">
                            <div className="flex w-64 justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Subtotal:</span>
                                <span>{currency} {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex w-64 justify-between text-sm text-slate-600 dark:text-slate-400">
                                <span>Tax/GST:</span>
                                <span>{currency} {gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="w-64 h-px bg-slate-300 dark:bg-slate-700 my-1"></div>
                            <div className="flex w-64 justify-between text-lg font-bold text-slate-800 dark:text-slate-100">
                                <span>Total:</span>
                                <span className={currency === '₹' ? 'font-sans' : ''}>{formatCurrency(total)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ─── RIGHT: A4 PREVIEW ───────────────────────────────────── */}
                <div className="w-full xl:w-[55%] flex flex-col items-center">
                    
                    <div className="w-full flex justify-end mb-4">
                        <Button 
                            variant="primary" 
                            className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-lg"
                            onClick={handlePrint}
                        >
                            <FiPrinter size={18} /> Print / Save PDF
                        </Button>
                    </div>

                    <div className="relative w-full max-w-[210mm] shadow-2xl rounded-sm overflow-hidden border border-slate-300 bg-white" 
                         style={{ aspectRatio: '210/297' }}>
                        
                        {/* THE A4 INVOICE */}
                        <div 
                            id="a4-invoice-preview"
                            className="bg-white text-black p-[20mm] font-sans w-full h-full absolute inset-0 text-[11pt]"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 border-b-2 border-slate-800 pb-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 uppercase mb-2">Invoice</h1>
                                    <div className="text-[10pt] text-slate-500">
                                        <div className="flex gap-2"><span className="font-semibold w-24 text-slate-700">Invoice No:</span> {invoiceNum || '-'}</div>
                                        <div className="flex gap-2"><span className="font-semibold w-24 text-slate-700">Date:</span> {invoiceDate || '-'}</div>
                                        {dueDate && <div className="flex gap-2"><span className="font-semibold w-24 text-slate-700">Due Date:</span> {dueDate}</div>}
                                    </div>
                                </div>
                                <div className="text-right max-w-xs">
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">{companyName || 'Your Company'}</h2>
                                    <p className="whitespace-pre-wrap leading-tight text-slate-600">{companyAddress}</p>
                                    <p className="text-slate-600 mt-1">{companyEmail}</p>
                                    {gstIn && <p className="text-slate-600 font-semibold mt-1">Tax ID/GSTIN: {gstIn}</p>}
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Bill To</h3>
                                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                                    <div className="font-bold text-lg text-slate-800">{clientName || 'Client Name'}</div>
                                    <div className="whitespace-pre-wrap text-slate-700 leading-snug break-words">
                                        {clientAddress || 'Client Address'}
                                    </div>
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <table className="w-full mb-8 text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-slate-300 text-sm">
                                        <th className="py-2 text-slate-700 font-bold uppercase w-[50%]">Description</th>
                                        <th className="py-2 text-slate-700 font-bold uppercase text-center">Qty</th>
                                        <th className="py-2 text-slate-700 font-bold uppercase text-right">Rate</th>
                                        <th className="py-2 text-slate-700 font-bold uppercase text-right">Tax %</th>
                                        <th className="py-2 text-slate-700 font-bold uppercase text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, i) => (
                                        <tr key={i} className="border-b border-slate-200 text-sm">
                                            <td className="py-3 font-medium text-slate-800 whitespace-pre-wrap break-words pr-4">{item.description}</td>
                                            <td className="py-3 text-center text-slate-700">{item.quantity}</td>
                                            <td className="py-3 text-right text-slate-700 tabular-nums">{currency} {Number(item.rate).toFixed(2)}</td>
                                            <td className="py-3 text-right text-slate-700">{item.gstPercent > 0 ? `${item.gstPercent}%` : '-'}</td>
                                            <td className="py-3 text-right font-medium text-slate-800 tabular-nums">{currency} {(item.quantity * item.rate).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-72 bg-slate-50 border border-slate-200 rounded-sm p-4">
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-slate-600 font-medium">Subtotal:</span>
                                        <span className="text-slate-800 tabular-nums">{currency} {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-3 text-sm">
                                        <span className="text-slate-600 font-medium">Tax:</span>
                                        <span className="text-slate-800 tabular-nums">{currency} {gstAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t-2 border-slate-800 pt-3 text-lg font-bold text-indigo-900">
                                        <span>Total:</span>
                                        <span className="tabular-nums">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-slate-200 pt-4 text-center text-[9pt] text-slate-500">
                                This is a computer-generated invoice. Thank you for your business!
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </ToolLayout>
    );
}
