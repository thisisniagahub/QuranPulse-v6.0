/**
 * 🏆 Leaderboard Component — Global & Friends Ranking
 * 
 * Shows XP rankings with animated entries,
 * user rank highlighting, and time filters.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Users, Globe, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useGamificationState } from '../../contexts/GamificationContext';

interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    xp: number;
    level: number;
    streak: number;
    isCurrentUser: boolean;
}

type LeaderboardScope = 'global' | 'friends' | 'mosque';
type TimeFilter = 'all' | 'monthly' | 'weekly' | 'daily';

const SCOPE_CONFIG = {
    global: { icon: Globe, label: 'Global' },
    friends: { icon: Users, label: 'Rakan' },
    mosque: { icon: Building2, label: 'Masjid' },
};

const Leaderboard: React.FC = () => {
    const [scope, setScope] = useState<LeaderboardScope>('global');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('weekly');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const gamification = useGamificationState();

    useEffect(() => {
        loadLeaderboard();
    }, [scope, timeFilter]);

    const loadLeaderboard = async () => {
        setIsLoading(true);
        try {
            // Try Supabase first
            const { data, error } = await supabase
                .from('user_leaderboard')
                .select('user_id, display_name, avatar_url, xp, level, streak')
                .order('xp', { ascending: false })
                .limit(50);

            if (!error && data && data.length > 0) {
                setEntries(data.map((row: any, index: number) => ({
                    rank: index + 1,
                    userId: row.user_id,
                    displayName: row.display_name || `Pengguna ${index + 1}`,
                    avatarUrl: row.avatar_url,
                    xp: row.xp,
                    level: row.level || 1,
                    streak: row.streak || 0,
                    isCurrentUser: false, // Would check against auth user
                })));
            } else {
                // Mock data for demo
                setEntries(generateMockLeaderboard());
            }
        } catch {
            setEntries(generateMockLeaderboard());
        } finally {
            setIsLoading(false);
        }
    };

    const generateMockLeaderboard = (): LeaderboardEntry[] => {
        const names = [
            'Ahmad Hafiz', 'Siti Nurhaliza', 'Muhammad Iqbal', 'Aisyah Humaira',
            'Zulkifli Rahman', 'Fatimah Zahra', 'Umar Hadi', 'Khadijah Amin',
            'Ibrahim Syukri', 'Maryam Safiya', 'Yusuf Hakim', 'Aminah Raihana',
            'Ali Imran', 'Zainab Qistina', 'Hassan Basri',
        ];

        return names.map((name, i) => ({
            rank: i + 1,
            userId: `user_${i}`,
            displayName: name,
            xp: Math.max(50, Math.floor(5000 - (i * 300) + Math.random() * 200)),
            level: Math.max(1, Math.floor((5000 - i * 300) / 150)),
            streak: Math.floor(Math.random() * 30),
            isCurrentUser: i === 4, // Demo: current user at rank 5
        }));
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
            case 2: return <Medal className="w-5 h-5 text-slate-300" />;
            case 3: return <Medal className="w-5 h-5 text-amber-600" />;
            default: return <span className="text-sm text-slate-500 w-5 text-center">{rank}</span>;
        }
    };

    const getRankBg = (rank: number, isCurrentUser: boolean) => {
        if (isCurrentUser) return 'bg-raudhah-teal/10 border-raudhah-teal/20';
        switch (rank) {
            case 1: return 'bg-yellow-500/5 border-yellow-500/20';
            case 2: return 'bg-slate-400/5 border-slate-400/20';
            case 3: return 'bg-amber-600/5 border-amber-600/20';
            default: return 'bg-slate-800/30 border-slate-700/30';
        }
    };

    return (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-raudhah-teal/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">Papan Pendahulu</h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Level {gamification.level}</span>
                    <span className="text-raudhah-teal font-bold">{gamification.xp} XP</span>
                </div>
            </div>

            {/* Scope Tabs */}
            <div className="flex gap-2 mb-4">
                {(Object.keys(SCOPE_CONFIG) as LeaderboardScope[]).map(s => {
                    const config = SCOPE_CONFIG[s];
                    const Icon = config.icon;
                    return (
                        <button
                            key={s}
                            onClick={() => setScope(s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${scope === s
                                ? 'bg-raudhah-teal/10 text-raudhah-teal border border-raudhah-teal/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {config.label}
                        </button>
                    );
                })}
            </div>

            {/* Time Filter */}
            <div className="flex gap-2 mb-6">
                {(['daily', 'weekly', 'monthly', 'all'] as TimeFilter[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTimeFilter(t)}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${timeFilter === t
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        {t === 'all' ? 'Sepanjang Masa' : t === 'monthly' ? 'Bulan Ini' : t === 'weekly' ? 'Minggu Ini' : 'Hari Ini'}
                    </button>
                ))}
            </div>

            {/* Entries */}
            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-400">
                        <div className="animate-spin w-6 h-6 border-2 border-raudhah-teal border-t-transparent rounded-full mx-auto mb-2" />
                        Memuatkan...
                    </div>
                ) : (
                    <AnimatePresence>
                        {entries.map((entry, index) => (
                            <motion.div
                                key={entry.userId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${getRankBg(entry.rank, entry.isCurrentUser)}`}
                            >
                                <div className="flex items-center gap-3">
                                    {getRankIcon(entry.rank)}

                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-raudhah-teal to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                                        {entry.displayName.charAt(0)}
                                    </div>

                                    <div>
                                        <p className={`text-sm font-medium ${entry.isCurrentUser ? 'text-raudhah-teal' : 'text-white'}`}>
                                            {entry.displayName}
                                            {entry.isCurrentUser && <span className="text-xs text-raudhah-teal/60 ml-2">(Anda)</span>}
                                        </p>
                                        <p className="text-xs text-slate-500">Level {entry.level} • 🔥 {entry.streak} hari</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold text-raudhah-teal">{entry.xp.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">XP</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
