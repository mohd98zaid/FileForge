"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiPlay, FiRefreshCw, FiSave, FiAward, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { toast } from 'react-hot-toast';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
}

export default function QuizCreatorPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    
    // Modes: 'build' | 'take' | 'results'
    const [mode, setMode] = useState<'build' | 'take' | 'results'>('build');
    const [hasLoaded, setHasLoaded] = useState(false);

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState(0);

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem('fileforge_quiz');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setQuestions(parsed);
                } else {
                    initializeDefaultQuiz();
                }
            } catch (e) {
                initializeDefaultQuiz();
            }
        } else {
            initializeDefaultQuiz();
        }
        setHasLoaded(true);
    }, []);

    const initializeDefaultQuiz = () => {
        setQuestions([
            { 
                id: crypto.randomUUID(), 
                question: 'What does CSS stand for?', 
                options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
                correctIndex: 2
            },
            { 
                id: crypto.randomUUID(), 
                question: 'Which of these is not a JavaScript framework?', 
                options: ['React', 'Angular', 'Django', 'Vue'],
                correctIndex: 2
            }
        ]);
    };

    const handleSave = () => {
        localStorage.setItem('fileforge_quiz', JSON.stringify(questions));
        toast.success('Quiz saved to your browser!');
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to delete all questions?')) {
            setQuestions([{ id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correctIndex: 0 }]);
            localStorage.removeItem('fileforge_quiz');
            toast('Quiz cleared', { icon: '🧹' });
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { 
            id: crypto.randomUUID(), 
            question: '', 
            options: ['', '', '', ''], 
            correctIndex: 0 
        }]);
    };

    const handleRemoveQuestion = (id: string) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestionText = (id: string, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, question: text } : q));
    };

    const updateOptionText = (qId: string, optIndex: number, text: string) => {
        setQuestions(questions.map(q => {
            if (q.id !== qId) return q;
            const newOpts = [...q.options];
            newOpts[optIndex] = text;
            return { ...q, options: newOpts };
        }));
    };

    const updateCorrectAnswer = (qId: string, idx: number) => {
        setQuestions(questions.map(q => q.id === qId ? { ...q, correctIndex: idx } : q));
    };

    const startQuiz = () => {
        // Validate
        const isValid = questions.every(q => q.question.trim() && q.options.every(o => o.trim()));
        if (!isValid) {
            toast.error('Please fill out all questions and options before starting.');
            return;
        }
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(questions.length).fill(-1));
        setScore(0);
        setMode('take');
    };

    const submitAnswer = (optionIdx: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = optionIdx;
        setUserAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Calculate Score & Finish
            let finalScore = 0;
            questions.forEach((q, i) => {
                if (newAnswers[i] === q.correctIndex) finalScore++;
            });
            setScore(finalScore);
            setMode('results');
        }
    };

    if (!hasLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Quiz Creator"
            description="Build interactive multiple-choice quizzes and test yourself instantly."
        >
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm gap-4">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Total Questions: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{questions.length}</span>
                    </div>
                    
                    <div className="flex gap-3">
                        {mode === 'build' ? (
                            <>
                                <Button variant="secondary" onClick={handleClear} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900 dark:hover:bg-rose-500/10 dark:text-rose-400">
                                    <FiTrash2 size={16} className="mr-2" /> Clear All
                                </Button>
                                <Button variant="secondary" onClick={handleSave} className="gap-2">
                                    <FiSave size={16} /> Save Quiz
                                </Button>
                                <Button variant="primary" onClick={startQuiz} className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-md">
                                    <FiPlay size={16} fill="currentColor" /> Start Quiz
                                </Button>
                            </>
                        ) : (
                            <Button variant="primary" onClick={() => setMode('build')} className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 gap-2 shadow-md">
                                <FiRefreshCw size={16} /> Edit Quiz
                            </Button>
                        )}
                    </div>
                </div>

                {mode === 'build' && <div className="text-xs text-center text-slate-400 -mt-2"><FiAlertCircle className="inline mr-1 mb-0.5" /> Quizzes are saved locally to your current browser using <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">localStorage</code>.</div>}

                {/* ─── BUILDER MODE ────────────────────────────────────────── */}
                {mode === 'build' && (
                    <div className="space-y-6">
                        {questions.map((q, qIdx) => (
                            <Card key={q.id} className="p-0 overflow-hidden relative group transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md">
                                
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Question {qIdx + 1}</span>
                                    <button 
                                        onClick={() => handleRemoveQuestion(q.id)}
                                        disabled={questions.length === 1}
                                        className="text-slate-400 hover:text-rose-500 disabled:opacity-50 transition-colors"
                                        title="Delete Question"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>

                                <div className="p-5 lg:p-6 bg-white dark:bg-slate-900 space-y-5">
                                    <div>
                                        <TextArea 
                                            value={q.question}
                                            onChange={(e) => updateQuestionText(q.id, e.target.value)}
                                            placeholder="Enter your question here..."
                                            rows={2}
                                            className="resize-none font-medium text-lg text-slate-800 dark:text-slate-200"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-3">
                                                <input 
                                                    type="radio" 
                                                    name={`correct-${q.id}`} 
                                                    checked={q.correctIndex === optIdx}
                                                    onChange={() => updateCorrectAnswer(q.id, optIdx)}
                                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5 shrink-0"
                                                    title="Mark as correct answer"
                                                />
                                                <div className={`flex-1 relative ${q.correctIndex === optIdx ? 'ring-1 ring-green-500 rounded-md shadow-sm' : ''}`}>
                                                    <Input 
                                                        value={opt}
                                                        onChange={(e) => updateOptionText(q.id, optIdx, e.target.value)}
                                                        placeholder={`Option ${optIdx + 1}`}
                                                        className={`h-9 ${q.correctIndex === optIdx ? 'border-transparent focus:ring-0 bg-green-50/50 dark:bg-green-500/10 text-green-900 dark:text-green-100 font-medium' : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 ml-7 italic">Select the radio button next to the correct answer.</div>
                                </div>
                            </Card>
                        ))}
                        
                        <div className="flex justify-center pt-2 pb-10">
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                className="w-full max-w-sm gap-2 border-dashed border-2 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                                onClick={handleAddQuestion}
                            >
                                <FiPlus size={20} /> Add New Question
                            </Button>
                        </div>
                    </div>
                )}

                {/* ─── QUIZ PLAY MODE ───────────────────────────────────────── */}
                {mode === 'take' && questions.length > 0 && (
                    <div className="max-w-2xl mx-auto w-full py-8">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-semibold text-slate-500 tracking-wider">
                                QUESTION {currentQuestionIndex + 1} OF {questions.length}
                            </span>
                            <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-300"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <Card className="p-8 lg:p-10 shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-full relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                            
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-8">
                                {questions[currentQuestionIndex].question}
                            </h2>

                            <div className="space-y-4">
                                {questions[currentQuestionIndex].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => submitAnswer(idx)}
                                        className="w-full text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-200 font-medium text-lg transition-all"
                                    >
                                        <span className="inline-block w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mr-4 text-sm font-bold shadow-inner">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* ─── RESULTS MODE ────────────────────────────────────────── */}
                {mode === 'results' && (
                    <div className="max-w-3xl mx-auto w-full py-8">
                        <Card className="p-10 text-center shadow-xl border-t-8 border-indigo-500 bg-white dark:bg-slate-900 mb-8">
                            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6">
                                <FiAward size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Quiz Completed!</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">Here is how you did.</p>

                            <div className="flex justify-center items-end gap-2 mb-8">
                                <span className="text-7xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{Math.round((score / questions.length) * 100)}%</span>
                            </div>
                            
                            <p className="font-medium text-slate-700 dark:text-slate-300 mb-8">
                                You answered <strong className="text-indigo-600 dark:text-indigo-400">{score}</strong> out of <strong className="text-slate-800 dark:text-white">{questions.length}</strong> questions correctly.
                            </p>

                            <div className="flex justify-center gap-4">
                                <Button size="lg" variant="secondary" onClick={startQuiz} className="w-40 gap-2">
                                    <FiRefreshCw size={18} /> Retake
                                </Button>
                                <Button size="lg" variant="primary" onClick={() => setMode('build')} className="w-40 bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900">
                                    Edit Quiz
                                </Button>
                            </div>
                        </Card>

                        {/* Review Answers */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 px-2">Review Answers</h3>
                            {questions.map((q, i) => {
                                const isCorrect = userAnswers[i] === q.correctIndex;
                                return (
                                    <div key={q.id} className={`p-5 rounded-xl border ${isCorrect ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-500/5' : 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-500/5'}`}>
                                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{i+1}. {q.question}</h4>
                                        <div className="space-y-2 pl-2">
                                            {q.options.map((opt, optIdx) => {
                                                const isUserChoice = userAnswers[i] === optIdx;
                                                const isActualCorrect = q.correctIndex === optIdx;
                                                
                                                let badge = null;
                                                let style = "text-slate-600 dark:text-slate-400";

                                                if (isActualCorrect) {
                                                    style = "text-green-700 dark:text-green-400 font-bold flex items-center gap-2";
                                                    badge = <span className="text-[10px] bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Correct Answer</span>;
                                                } else if (isUserChoice && !isActualCorrect) {
                                                    style = "text-rose-600 dark:text-rose-400 font-bold line-through flex items-center gap-2";
                                                    badge = <span className="text-[10px] bg-rose-200 dark:bg-rose-800 text-rose-800 dark:text-rose-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Your Answer</span>;
                                                }

                                                return (
                                                    <div key={optIdx} className={style}>
                                                        • {opt} {badge}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
}
