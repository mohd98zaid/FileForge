"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiDownload, FiEdit3, FiSave } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
}

export default function NotePadPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem('fileforge_notes');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNotes(parsed);
                    setActiveNoteId(parsed[0].id);
                } else {
                    createNewNote();
                }
            } catch (e) {
                createNewNote();
            }
        } else {
            createNewNote();
        }
        setHasLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-save effect
    useEffect(() => {
        if (!hasLoaded) return;
        localStorage.setItem('fileforge_notes', JSON.stringify(notes));
    }, [notes, hasLoaded]);

    const activeNote = notes.find(n => n.id === activeNoteId);

    const createNewNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'Untitled Note',
            content: '',
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (notes.length === 1) {
            toast.error('You must have at least one note. Clearing instead.');
            updateActiveNote('title', 'Untitled Note');
            updateActiveNote('content', '');
            return;
        }

        const remaining = notes.filter(n => n.id !== id);
        setNotes(remaining);
        if (activeNoteId === id) {
            setActiveNoteId(remaining[0].id);
        }
    };

    const updateActiveNote = (field: 'title' | 'content', value: string) => {
        if (!activeNoteId) return;
        setNotes(notes.map(n => {
            if (n.id !== activeNoteId) return n;
            return {
                ...n,
                [field]: value,
                updatedAt: new Date().toISOString()
            };
        }));
    };

    const handleDownload = () => {
        if (!activeNote) return;
        const blob = new Blob([activeNote.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeNote.title.toLowerCase().replace(/\s+/g, '-') || 'note'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Note exported as .txt');
    };

    const formatDate = (isoStr: string) => {
        return new Date(isoStr).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Auto-resize textarea logic
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateActiveNote('content', e.target.value);
    };

    if (!hasLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Online Note Pad"
            description="A minimal, auto-saving text editor. Your notes are stored securely in your browser."
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)] min-h-[600px] max-w-7xl mx-auto">
                
                {/* ─── LEFT: SIDEBAR (Note List) ───────────────────────────── */}
                <Card className="w-full lg:w-72 p-0 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 shrink-0">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiEdit3 className="text-indigo-500" /> My Notes
                        </h2>
                        <button 
                            onClick={createNewNote}
                            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="New Note"
                        >
                            <FiPlus size={18} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto w-full p-2 space-y-1 bg-slate-50 dark:bg-slate-900/10">
                        {notes.map(note => (
                            <div 
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                className={`w-full group flex flex-col text-left px-3 py-3 rounded-lg cursor-pointer transition-all border ${
                                    activeNoteId === note.id 
                                    ? 'bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 shadow-sm' 
                                    : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className={`font-medium truncate pr-2 ${activeNoteId === note.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {note.title || 'Untitled'}
                                    </div>
                                    <button 
                                        onClick={(e) => deleteNote(note.id, e)}
                                        className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mt-1 -mr-1 rounded hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 ${activeNoteId === note.id ? 'text-slate-400' : 'text-slate-400'}`}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                                <div className="text-xs text-slate-500 truncate mb-1">
                                    {note.content.substring(0, 40) || <span className="italic opacity-60">No content...</span>}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                    {formatDate(note.updatedAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* ─── RIGHT: EDITOR AREA ──────────────────────────────────── */}
                <Card className="flex-1 p-0 flex flex-col overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
                    {activeNote ? (
                        <>
                            {/* Editor Header */}
                            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                                <input 
                                    type="text"
                                    value={activeNote.title}
                                    onChange={(e) => updateActiveNote('title', e.target.value)}
                                    placeholder="Note Title"
                                    className="text-xl font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                                
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-xs text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                        <FiSave size={12} className="text-green-500" /> Saved
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="secondary"
                                        onClick={handleDownload}
                                        className="h-8 gap-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <FiDownload size={14} /> .TXT
                                    </Button>
                                    <div className="text-xs font-mono text-slate-400 ml-2 hidden sm:block">
                                        {activeNote.content.length} chars
                                    </div>
                                </div>
                            </div>

                            {/* Editor Body */}
                            <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900/50 relative">
                                <textarea 
                                    className="absolute inset-0 w-full h-full resize-none p-6 outline-none bg-transparent text-slate-700 dark:text-slate-300 leading-relaxed CustomScrollbar"
                                    placeholder="Start typing your notes here..."
                                    value={activeNote.content}
                                    onChange={handleTextChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            Select a note to start editing
                        </div>
                    )}
                </Card>

            </div>
        </ToolLayout>
    );
}
