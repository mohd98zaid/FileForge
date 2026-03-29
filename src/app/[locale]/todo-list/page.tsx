"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiAlertCircle } from 'react-icons/fi';
import ToolLayout from '@/components/ToolLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    createdAt: number;
}

export default function TodoListPage() {
    const t = useTranslations('Tools');

    // ─── STATE ─────────────────────────────────────────────────────────────
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTaskText, setNewTaskText] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [hasLoaded, setHasLoaded] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // ─── LOGIC ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const saved = localStorage.getItem('fileforge_todos');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTodos(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                setTodos([]);
            }
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (!hasLoaded) return;
        localStorage.setItem('fileforge_todos', JSON.stringify(todos));
    }, [todos, hasLoaded]);

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newTaskText.trim();
        if (!trimmed) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: trimmed,
            completed: false,
            priority,
            createdAt: Date.now()
        };

        setTodos([newTodo, ...todos]);
        setNewTaskText('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        const active = todos.filter(t => !t.completed);
        if (active.length === todos.length) return;
        setTodos(active);
        toast.success('Cleared completed tasks');
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-800';
            case 'medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800';
            case 'low': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800';
            default: return 'text-slate-500';
        }
    };

    const filteredTodos = todos.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    }).sort((a, b) => {
        if (a.completed === b.completed) return b.createdAt - a.createdAt;
        return a.completed ? 1 : -1;
    });

    const activeCount = todos.filter(t => !t.completed).length;

    if (!hasLoaded) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // ─── RENDER ────────────────────────────────────────────────────────────
    return (
        <ToolLayout
            title="Todo List"
            description="A minimal, robust todo list with priority levels that saves locally to your browser."
        >
            <div className="max-w-2xl mx-auto flex flex-col gap-6">

                {/* Info Alert */}
                <div className="text-xs text-center text-slate-400 -mt-2">
                    <FiAlertCircle className="inline mr-1 mb-0.5" /> Tasks are saved locally to your current browser using <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">localStorage</code>.
                </div>

                <Card className="p-0 overflow-hidden shadow-xl border-t-4 border-indigo-500 dark:bg-slate-900 border-x border-b border-x-slate-200 dark:border-x-slate-800 border-b-slate-200 dark:border-b-slate-800">
                    
                    {/* Add Task Form */}
                    <div className="p-6 pb-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <form onSubmit={handleAddTodo} className="flex gap-3">
                            <div className="flex-1 flex gap-2">
                                <Input 
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="h-12 text-lg shadow-sm"
                                    autoFocus
                                />
                                <div className="hidden sm:flex rounded-md shadow-sm border border-slate-200 dark:border-slate-700 p-1 shrink-0 bg-white dark:bg-slate-800">
                                    {(['low', 'medium', 'high'] as const).map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`px-3 py-1 text-xs font-semibold capitalize rounded transition-colors ${
                                                priority === p ? getPriorityColor(p) : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" variant="primary" className="h-12 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shrink-0">
                                <FiPlus size={18} /> Add
                            </Button>
                        </form>
                    </div>

                    {/* Todo List Header / Filters */}
                    {todos.length > 0 && (
                        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-medium">
                            <div className="text-slate-500 dark:text-slate-400">
                                {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
                            </div>
                            <div className="flex gap-4">
                                {(['all', 'active', 'completed'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`capitalize transition-colors ${filter === f ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Todo List */}
                    <div className="bg-white dark:bg-slate-900 max-h-[60vh] overflow-y-auto">
                        {todos.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 flex flex-col items-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                                    <FiCheckCircle size={32} />
                                </div>
                                <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-1">All caught up!</p>
                                <p className="text-sm">Enjoy your day or add a new task above.</p>
                            </div>
                        ) : filteredTodos.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                No {filter} tasks found.
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredTodos.map(todo => (
                                    <li 
                                        key={todo.id} 
                                        className={`group flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                                            todo.completed ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                            <button 
                                                onClick={() => toggleTodo(todo.id)}
                                                className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-green-500' : 'text-slate-300 hover:text-indigo-400 dark:text-slate-600 dark:hover:text-indigo-500'}`}
                                            >
                                                {todo.completed ? <FiCheckCircle size={24} /> : <FiCircle size={24} />}
                                            </button>
                                            
                                            <span 
                                                className={`text-lg truncate transition-all ${
                                                    todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200 font-medium'
                                                }`}
                                            >
                                                {todo.text}
                                            </span>
                                            
                                            {!todo.completed && (
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityColor(todo.priority)}`}>
                                                    {todo.priority}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => deleteTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md"
                                            title="Delete Task"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {/* Footer */}
                    {todos.some(t => t.completed) && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <button 
                                onClick={clearCompleted}
                                className="text-sm text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                            >
                                Clear completed
                            </button>
                        </div>
                    )}
                </Card>

            </div>
        </ToolLayout>
    );
}
