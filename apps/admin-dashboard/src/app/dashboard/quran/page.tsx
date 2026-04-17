'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    BookOpen, TrendingUp, Users, Clock, Award, Target,
    BarChart3, PieChart, Activity, Eye, Volume2, Bookmark,
    ChevronRight, RefreshCw, Download, Calendar
} from 'lucide-react'

// Types
interface QuranStats {
    totalReaders: number
    activeToday: number
    versesRead: number
    avgReadingTime: number
    completions: number
    mostReadSurah: string
}

interface PopularSurah {
    number: number
    name: string
    nameAr: string
    reads: number
    avgTime: string
}

interface ReadingSession {
    userId: string
    userName: string
    surahName: string
    duration: string
    verses: number
    timestamp: string
}

interface FeatureUsage {
    feature: string
    users: number
    sessions: number
    trend: number
}

export default function QuranAnalyticsPage() {
    const [stats, setStats] = useState<QuranStats>({
        totalReaders: 0,
        activeToday: 0,
        versesRead: 0,
        avgReadingTime: 0,
        completions: 0,
        mostReadSurah: ''
    })
    const [popularSurahs, setPopularSurahs] = useState<PopularSurah[]>([])
    const [recentSessions, setRecentSessions] = useState<ReadingSession[]>([])
    const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week')

    // Mock data loader
    const fetchStats = useCallback(async () => {
        setLoading(true)
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setStats({
            totalReaders: 8432,
            activeToday: 247,
            versesRead: 156789,
            avgReadingTime: 18,
            completions: 42,
            mostReadSurah: 'Al-Baqarah'
        })

        setPopularSurahs([
            { number: 2, name: 'Al-Baqarah', nameAr: 'البقرة', reads: 4521, avgTime: '25 min' },
            { number: 1, name: 'Al-Fatiha', nameAr: 'الفاتحة', reads: 3876, avgTime: '2 min' },
            { number: 36, name: 'Yasin', nameAr: 'يس', reads: 2943, avgTime: '18 min' },
            { number: 67, name: 'Al-Mulk', nameAr: 'الملك', reads: 2156, avgTime: '12 min' },
            { number: 18, name: 'Al-Kahf', nameAr: 'الكهف', reads: 1987, avgTime: '45 min' },
        ])

        setRecentSessions([
            { userId: '1', userName: 'Ahmad bin Ali', surahName: 'Al-Baqarah', duration: '45:20', verses: 50, timestamp: '2 min ago' },
            { userId: '2', userName: 'Fatimah Zahra', surahName: 'Yasin', duration: '22:15', verses: 83, timestamp: '5 min ago' },
            { userId: '3', userName: 'Muhammad Iman', surahName: 'Al-Mulk', duration: '15:30', verses: 30, timestamp: '12 min ago' },
            { userId: '4', userName: 'Aisyah Nurul', surahName: 'Al-Fatiha', duration: '03:45', verses: 7, timestamp: '18 min ago' },
        ])

        setFeatureUsage([
            { feature: 'Semantic Search', users: 1245, sessions: 3456, trend: 24 },
            { feature: 'Tadabbur AI', users: 876, sessions: 2134, trend: 45 },
            { feature: 'Voice Reader', users: 543, sessions: 1298, trend: 18 },
            { feature: 'Word Root Explorer', users: 321, sessions: 876, trend: 12 },
            { feature: 'Mushaf View', users: 1567, sessions: 4532, trend: 32 },
            { feature: 'Khatam Tracker', users: 2345, sessions: 5678, trend: 8 },
        ])

        setLoading(false)
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats, period])

    const kpiCards = [
        { label: 'Total Readers', value: stats.totalReaders.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12%' },
        { label: 'Active Today', value: stats.activeToday.toLocaleString(), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+5%' },
        { label: 'Verses Read', value: stats.versesRead.toLocaleString(), icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+18%' },
        { label: 'Avg Reading (min)', value: stats.avgReadingTime, icon: Clock, color: 'text-raudhah-teal', bg: 'bg-raudhah-teal/10', trend: '+3%' },
        { label: 'Khatam Completed', value: stats.completions, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+8%' },
        { label: 'Most Read', value: stats.mostReadSurah, icon: Target, color: 'text-pink-400', bg: 'bg-pink-500/10', trend: '' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quran Analytics</h2>
                    <p className="text-slate-400 mt-1">Reading patterns and feature usage insights</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="flex bg-slate-800/50 rounded-lg p-1">
                        {(['today', 'week', 'month'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${period === p
                                        ? 'bg-raudhah-teal/10 text-raudhah-teal'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchStats}
                        className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
                        title="Refresh data"
                    >
                        <RefreshCw className={`h-4 w-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        className="flex items-center gap-2 px-3 py-2 bg-raudhah-teal/10 text-raudhah-teal border border-raudhah-teal/20 rounded-lg hover:bg-raudhah-teal/10 transition-colors"
                        title="Export report"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 animate-fade-in">
                {kpiCards.map((card, i) => (
                    <div
                        key={i}
                        className="glass-card rounded-xl p-4 hover:border-slate-600 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${card.bg}`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                            {card.trend && (
                                <span className="text-xs text-emerald-400">{card.trend}</span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400">{card.label}</p>
                        <p className={`text-xl font-bold ${card.color}`}>
                            {loading ? '...' : card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Popular Surahs */}
                <div className="lg:col-span-2 glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-400" />
                            Popular Surahs
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {popularSurahs.map((surah, i) => (
                            <div
                                key={surah.number}
                                className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-semibold text-sm">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{surah.name}</span>
                                        <span className="text-slate-500 text-lg font-arabic">{surah.nameAr}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">Avg reading: {surah.avgTime}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-raudhah-teal">{surah.reads.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">reads</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Usage */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-raudhah-teal" />
                        Feature Usage
                    </h3>
                    <div className="space-y-3">
                        {featureUsage.map((item) => (
                            <div key={item.feature} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">{item.feature}</p>
                                    <p className="text-xs text-slate-500">{item.users} users • {item.sessions} sessions</p>
                                </div>
                                <span className={`text-xs ${item.trend > 20 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                    +{item.trend}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Sessions */}
            <div className="glass-card rounded-xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-400" />
                        Recent Reading Sessions
                    </h3>
                    <button className="text-sm text-raudhah-teal hover:text-raudhah-teal flex items-center gap-1">
                        View all <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                                <th className="pb-3">User</th>
                                <th className="pb-3">Surah</th>
                                <th className="pb-3">Duration</th>
                                <th className="pb-3">Verses</th>
                                <th className="pb-3">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {recentSessions.map((session, i) => (
                                <tr key={i} className="hover:bg-slate-800/30">
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-raudhah-teal to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                {session.userName.charAt(0)}
                                            </div>
                                            <span className="text-sm text-white">{session.userName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-slate-300">{session.surahName}</td>
                                    <td className="py-3 text-sm text-raudhah-teal">{session.duration}</td>
                                    <td className="py-3 text-sm text-purple-400">{session.verses} ayat</td>
                                    <td className="py-3 text-sm text-slate-500">{session.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
