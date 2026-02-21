import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Filter, Search, Save, RotateCcw } from 'lucide-react';
import { CHECKLIST_ITEMS, CHECKLIST_CATEGORIES } from '../data/checklistData';
import { ChecklistItem } from '../types';

const STORAGE_KEY = 'quranpulse_umrah_checklist';

const safeLoadChecklist = (): { items: ChecklistItem[]; gender: 'lelaki' | 'wanita' } | null => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const safeSaveChecklist = (payload: { items: ChecklistItem[]; gender: 'lelaki' | 'wanita' }): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // Ignore storage errors
    }
};

const PrepChecklist: React.FC = () => {
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [gender, setGender] = useState<'lelaki' | 'wanita'>('lelaki');

    // Load from localStorage
    useEffect(() => {
        const parsed = safeLoadChecklist();
        if (parsed) {
            setItems(parsed.items || CHECKLIST_ITEMS);
            setGender(parsed.gender || 'lelaki');
        } else {
            setItems(CHECKLIST_ITEMS);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (items.length > 0) {
            safeSaveChecklist({ items, gender });
        }
    }, [items, gender]);

    const toggleItem = (id: string) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const resetAll = () => {
        setItems(CHECKLIST_ITEMS.map(item => ({ ...item, checked: false })));
    };

    // Filter items based on gender and category
    const filteredItems = items.filter(item => {
        // Gender filter
        if (item.category === 'pakaian_lelaki' && gender !== 'lelaki') return false;
        if (item.category === 'pakaian_wanita' && gender !== 'wanita') return false;

        // Category filter
        if (filter !== 'all' && item.category !== filter) return false;

        // Search filter
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        return true;
    });

    // Group by category
    const groupedItems = filteredItems.reduce((acc, item) => {
        const cat = item.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, ChecklistItem[]>);

    // Stats
    const totalItems = items.filter(item => {
        if (item.category === 'pakaian_lelaki' && gender !== 'lelaki') return false;
        if (item.category === 'pakaian_wanita' && gender !== 'wanita') return false;
        return true;
    }).length;
    const checkedItems = items.filter(item => {
        if (item.category === 'pakaian_lelaki' && gender !== 'lelaki') return false;
        if (item.category === 'pakaian_wanita' && gender !== 'wanita') return false;
        return item.checked;
    }).length;
    const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Header with Progress */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Senarai Semak Umrah</h3>
                    <p className="text-sm text-slate-400">{checkedItems} / {totalItems} item selesai</p>
                </div>
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-slate-700"
                        />
                        <motion.circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={175.93}
                            initial={{ strokeDashoffset: 175.93 }}
                            animate={{ strokeDashoffset: 175.93 - (175.93 * progress) / 100 }}
                            transition={{ duration: 0.5 }}
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-raudhah-teal">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Gender Selector */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
                <button
                    onClick={() => setGender('lelaki')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${gender === 'lelaki'
                            ? 'bg-blue-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    👨 Lelaki
                </button>
                <button
                    onClick={() => setGender('wanita')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${gender === 'wanita'
                            ? 'bg-pink-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    👩 Wanita
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Cari item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-raudhah-teal"
                    />
                </div>
                <button
                    onClick={resetAll}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    title="Reset semua"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === 'all'
                            ? 'bg-raudhah-teal text-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    Semua
                </button>
                {Object.entries(CHECKLIST_CATEGORIES).map(([key, cat]) => {
                    // Hide gender-specific categories
                    if (key === 'pakaian_lelaki' && gender !== 'lelaki') return null;
                    if (key === 'pakaian_wanita' && gender !== 'wanita') return null;

                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === key
                                    ? 'bg-raudhah-teal text-black'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    );
                })}
            </div>

            {/* Checklist Items */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {Object.entries(groupedItems).map(([category, categoryItems]) => {
                    const cat = CHECKLIST_CATEGORIES[category as keyof typeof CHECKLIST_CATEGORIES];
                    if (!cat) return null;

                    return (
                        <div key={category}>
                            <h4 className={`flex items-center gap-2 text-sm font-semibold mb-2 ${cat.color}`}>
                                <span>{cat.icon}</span>
                                {cat.name}
                            </h4>
                            <div className="space-y-1">
                                {categoryItems.map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${item.checked
                                                ? 'bg-raudhah-teal/10 border border-raudhah-teal/20'
                                                : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                                            }`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.checked
                                                ? 'bg-raudhah-teal text-black'
                                                : 'border-2 border-slate-600'
                                            }`}>
                                            {item.checked && <CheckCircle size={14} />}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className={`text-sm ${item.checked ? 'text-raudhah-teal line-through' : 'text-white'}`}>
                                                {item.name}
                                                {item.required && <span className="text-red-400 ml-1">*</span>}
                                            </p>
                                            {item.description && (
                                                <p className="text-xs text-slate-500">{item.description}</p>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                    <span className="text-red-400">*</span> = Wajib
                </span>
                <span className="flex items-center gap-1">
                    <Save size={12} /> Auto-simpan
                </span>
            </div>
        </div>
    );
};

export default PrepChecklist;
