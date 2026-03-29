"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiPlay, FiRefreshCw, FiArrowRight, FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { toast } from 'react-hot-toast';

interface Flashcard {
    id: string;
    front: string;
    back: string;
}

export default function FlashcardCreatorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    // Load from local storage strictly on mount to avoid hydration mismatch
    useEffect(() => {
        const saved = localStorage.getItem('fileforge_flashcards');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setCards(parsed);
                } else {
                    initializeDefaultCards();
                }
            } catch (e) {
                initializeDefaultCards();
            }
        } else {
            initializeDefaultCards();
        }
        setHasLoaded(true);
    }, []);

    const initializeDefaultCards = () => {
        setCards([
            { id: crypto.randomUUID(), front: 'What does HTML stand for?', back: 'HyperText Markup Language' },
            { id: crypto.randomUUID(), front: 'What does CSS stand for?', back: 'Cascading Style Sheets' },
            { id: crypto.randomUUID(), front: 'Explain closure in JS.', back: 'A closure gives you access to an outer function\'s scope from an inner function.' }
        ]);
    };

    const handleSave = () => {
        localStorage.setItem('fileforge_flashcards', JSON.stringify(cards));
        toast.success('Deck saved to your browser!');
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to delete all flashcards? Your saved deck will also be cleared.')) {
            setCards([{ id: crypto.randomUUID(), front: '', back: '' }]);
            localStorage.removeItem('fileforge_flashcards');
            toast('Deck cleared', { icon: '🧹' });
        }
    };

    const handleAddCard = () => {
        setCards([...cards, { id: crypto.randomUUID(), front: '', back: '' }]);
    };

    const handleRemoveCard = (id: string) => {
        if (cards.length === 1) return;
        setCards(cards.filter(c => c.id !== id));
    };

    const handleUpdateCard = (id: string, side: 'front' | 'back', value: string) => {
        setCards(cards.map(c => c.id === id ? { ...c, [side]: value } : c));
    };

    // Study Mode logic
    const toggleMode = () => {
        if (!isStudyMode) {
            // Enter study mode
            const validCards = cards.filter(c => c.front.trim() && c.back.trim());
            if (validCards.length === 0) {
                toast.error('You need at least 1 valid card (front & back) to study.');
                return;
            }
            // Auto trim blanks
            setCards(validCards);
            setCurrentIndex(0);
            setIsFlipped(false);
        }
        setIsStudyMode(!isStudyMode);
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Prevent hydration issues by rendering skeleton initially
    if (!hasLoaded) {
        return <div className="min-h-screen bg-slate-50 dark:bg-[#0B1121] flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Flashcard Creator"
            description="Create, edit, save, and practice flashcards natively in your browser."
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Total Cards: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{cards.length}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        {!isStudyMode ? (
                            <>
                                <Button variant="secondary" onClick={handleClear} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900 dark:hover:bg-rose-500/10 dark:text-rose-400">
                                    <FiTrash2 size={16} className="mr-2" /> Clear All
                                </Button>
                                <Button variant="secondary" onClick={handleSave} className="gap-2">
                                    <FiSave size={16} /> Save Deck
                                </Button>
                                <Button variant="primary" onClick={toggleMode} className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-md">
                                    <FiPlay size={16} fill="currentColor" /> Study Mode
                                </Button>
                            </>
                        ) : (
                            <Button variant="primary" onClick={toggleMode} className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 gap-2 shadow-md">
                                <FiRefreshCw size={16} /> Edit Deck
                            </Button>
                        )}
                    </div>
                </div>

                {!isStudyMode && <div className="text-xs text-center text-slate-400 -mt-2"><FiAlertCircle className="inline mr-1 mb-0.5" /> Decks are saved locally to your current browser using <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">localStorage</code>. Clear your browser cache will erase them.</div>}

                {/* ─── BUILDER MODE ────────────────────────────────────────── */}
                {!isStudyMode && (
                    <div className="space-y-4">
                        {cards.map((card, idx) => (
                            <Card key={card.id} className="p-0 overflow-hidden relative group transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md">
                                
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleRemoveCard(card.id)}
                                        disabled={cards.length === 1}
                                        className="text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-900 rounded-full p-2 shadow-sm disabled:opacity-50"
                                        title="Delete Card"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                                    <div className="flex-1 p-5 lg:p-6 bg-white dark:bg-slate-900">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Front (Question)</label>
                                        <TextArea 
                                            value={card.front}
                                            onChange={(e) => handleUpdateCard(card.id, 'front', e.target.value)}
                                            placeholder="Enter term or question..."
                                            rows={3}
                                            className="resize-none font-medium text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="flex-1 p-5 lg:p-6 bg-slate-50 dark:bg-slate-800/30">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Back (Answer)</label>
                                        <TextArea 
                                            value={card.back}
                                            onChange={(e) => handleUpdateCard(card.id, 'back', e.target.value)}
                                            placeholder="Enter definition or answer..."
                                            rows={3}
                                            className="resize-none text-slate-700 dark:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                        
                        <div className="flex justify-center pt-4 pb-10">
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                className="w-full max-w-sm gap-2 border-dashed border-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                                onClick={handleAddCard}
                            >
                                <FiPlus size={20} /> Add New Card
                            </Button>
                        </div>
                    </div>
                )}

                {/* ─── STUDY MODE ──────────────────────────────────────────── */}
                {isStudyMode && cards.length > 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] py-10 px-4">
                        
                        <div className="text-sm font-semibold text-slate-500 tracking-wider mb-8">
                            CARD {currentIndex + 1} OF {cards.length}
                        </div>

                        {/* Flashcard container (Perspective) */}
                        <div 
                            className="w-full max-w-2xl h-[350px] relative cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Inner card containing Front & Back (Animated) */}
                            <div 
                                className={`w-full h-full transition-transform duration-500 relative rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700`}
                                style={{ 
                                    transformStyle: 'preserve-3d',
                                    transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)'
                                }}
                            >
                                {/* Front Face */}
                                <div 
                                    className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 lg:p-12 text-center bg-white dark:bg-slate-800 rounded-2xl"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                        {cards[currentIndex].front}
                                    </h3>
                                </div>

                                {/* Back Face */}
                                <div 
                                    className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 lg:p-12 text-center bg-indigo-50 dark:bg-indigo-900/40 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl"
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateX(180deg)'
                                    }}
                                >
                                    <p className="text-xl lg:text-2xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {cards[currentIndex].back}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-slate-400 mt-6 mb-10">Click card to flip</div>

                        {/* Navigation Controls */}
                        <div className="flex gap-4">
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                className="w-40 rounded-full bg-white dark:bg-slate-800"
                                onClick={prevCard}
                                disabled={currentIndex === 0}
                            >
                                <FiArrowLeft size={20} className="mr-2" /> Previous
                            </Button>
                            
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="w-40 rounded-full bg-indigo-600 hover:bg-indigo-700 border-none shadow-md"
                                onClick={nextCard}
                                disabled={currentIndex === cards.length - 1}
                            >
                                Next <FiArrowRight size={20} className="ml-2" />
                            </Button>
                        </div>

                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
