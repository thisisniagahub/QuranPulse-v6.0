import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, User, Users, ChevronDown, Calculator } from 'lucide-react';
import { IHRAM_PROHIBITIONS } from '../data/damData';
import { IhramProhibition } from '../types';

const IhramChecker: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [genderFilter, setGenderFilter] = useState<'semua' | 'lelaki' | 'wanita'>('semua');

    const filteredProhibitions = IHRAM_PROHIBITIONS.filter(p => {
        if (genderFilter === 'semua') return true;
        return p.gender === 'semua' || p.gender === genderFilter;
    });

    const toggleExpand = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                    <AlertTriangle className="text-red-400" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">10 Larangan Ihram</h3>
                    <p className="text-xs text-slate-400">Perkara yang dilarang ketika berihram</p>
                </div>
            </div>

            {/* Gender Filter */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg">
                <button
                    onClick={() => setGenderFilter('semua')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-all ${genderFilter === 'semua'
                            ? 'bg-cyan-500 text-black font-medium'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <Users size={16} />
                    Semua
                </button>
                <button
                    onClick={() => setGenderFilter('lelaki')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-all ${genderFilter === 'lelaki'
                            ? 'bg-blue-500 text-white font-medium'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    👨 Lelaki
                </button>
                <button
                    onClick={() => setGenderFilter('wanita')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-md text-sm transition-all ${genderFilter === 'wanita'
                            ? 'bg-pink-500 text-white font-medium'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    👩 Wanita
                </button>
            </div>

            {/* Prohibitions List */}
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredProhibitions.map((prohibition, index) => (
                    <motion.div
                        key={prohibition.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
                    >
                        <button
                            onClick={() => toggleExpand(prohibition.id)}
                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/80 transition-all"
                        >
                            {/* Number Badge */}
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                                {prohibition.id}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{prohibition.name}</p>
                                    {prohibition.gender !== 'semua' && (
                                        <span className={`px-2 py-0.5 rounded text-xs ${prohibition.gender === 'lelaki'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-pink-500/20 text-pink-400'
                                            }`}>
                                            {prohibition.gender === 'lelaki' ? '♂️ Lelaki' : '♀️ Wanita'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-arabic text-amber-400/80 mt-0.5">{prohibition.nameAr}</p>
                            </div>

                            {/* Expand Icon */}
                            <motion.div
                                animate={{ rotate: expandedId === prohibition.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="text-slate-500" size={20} />
                            </motion.div>
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {expandedId === prohibition.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-slate-700"
                                >
                                    <div className="p-4 space-y-3">
                                        {/* Description */}
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Keterangan:</p>
                                            <p className="text-sm text-slate-300">{prohibition.description}</p>
                                        </div>

                                        {/* Dam Type */}
                                        <div className={`p-3 rounded-lg ${prohibition.damType === 'takhyir'
                                                ? 'bg-amber-500/10 border border-amber-500/30'
                                                : 'bg-red-500/10 border border-red-500/30'
                                            }`}>
                                            <p className="text-xs text-slate-500 mb-1">Jenis Denda:</p>
                                            <p className={`text-sm font-medium ${prohibition.damType === 'takhyir' ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                Dam {prohibition.damType === 'takhyir' ? 'Takhyir' : 'Tartib'}
                                            </p>
                                        </div>

                                        {/* Penalty */}
                                        <div className="bg-slate-900/50 rounded-lg p-3">
                                            <p className="text-xs text-slate-500 mb-1">Denda/Kifarat:</p>
                                            <p className="text-sm text-white">{prohibition.penalty}</p>
                                        </div>

                                        {/* Action Button */}
                                        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm">
                                            <Calculator size={16} />
                                            Kira Dam di Kalkulator
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Important Note */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400">
                    ⚠️ <strong>Peringatan:</strong> Jika terlupa atau terpaksa melanggar, segera bertaubat dan bayar denda (dam) yang ditetapkan. Rujuk ustaz untuk kepastian.
                </p>
            </div>
        </div>
    );
};

export default IhramChecker;
