'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Users, DollarSign, Brain, AlertTriangle, TrendingUp,
    BookOpen, Activity, Clock, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

// Import server actions
import { getUsers } from '@/actions/users'
import { getTransactionStats } from '@/actions/finance'
import { getAIStats } from '@/actions/ai'
import BotControlCenter from '@/components/BotControlCenter'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        mrr: 0,
        aiQueries: 0,
        pendingReview: 0
    })
    const [loading, setLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        setLoading(true)
        try {
            const [usersData, financeData, aiData] = await Promise.all([
                getUsers(1, 1), // Just to get total count
                getTransactionStats(),
                getAIStats()
            ])

            setStats({
                totalUsers: usersData.total,
                mrr: financeData.mrr,
                aiQueries: aiData.totalQueries,
                pendingReview: aiData.pending
            })
        } catch (err) {
            console.error('Failed to fetch stats:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const kpiCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            trend: '+12%',
            link: '/dashboard/users'
        },
        {
            label: 'Monthly Revenue',
            value: `RM ${stats.mrr.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            trend: '+8%',
            link: '/dashboard/finance'
        },
        {
            label: 'AI Queries',
            value: stats.aiQueries.toLocaleString(),
            icon: Brain,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            trend: '+24%',
            link: '/dashboard/ai-oversight'
        },
        {
            label: 'Pending Review',
            value: stats.pendingReview,
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            trend: stats.pendingReview > 0 ? 'Action Required' : 'All Clear',
            link: '/dashboard/ai-oversight'
        },
    ]

    const quickActions = [
        { label: 'User Management', icon: Users, href: '/dashboard/users', color: 'text-blue-400' },
        { label: 'Content Ops', icon: BookOpen, href: '/dashboard/content', color: 'text-emerald-400' },
        { label: 'Finance', icon: DollarSign, href: '/dashboard/finance', color: 'text-purple-400' },
        { label: 'AI Oversight', icon: Brain, href: '/dashboard/ai-oversight', color: 'text-cyan-400' },
        { label: 'Iqra Digital', icon: BookOpen, href: '/dashboard/iqra', color: 'text-pink-400' },
        { label: 'System Tools', icon: Activity, href: '/dashboard/tools', color: 'text-amber-400' },
    ]

    const recentActivity = [
        { type: 'user', message: 'New user registered', time: '2 mins ago', icon: Users },
        { type: 'payment', message: 'Pro subscription activated', time: '15 mins ago', icon: DollarSign },
        { type: 'ai', message: 'AI response flagged for review', time: '1 hour ago', icon: AlertTriangle },
        { type: 'content', message: 'Knowledge base updated', time: '2 hours ago', icon: BookOpen },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tight">Mission Control</h2>
                <p className="text-slate-400 mt-1">Welcome back, Admin. Here's your system overview.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {kpiCards.map((card, i) => (
                    <Link
                        key={i}
                        href={card.link}
                        className="glass-card rounded-xl p-5 hover:border-slate-600 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} group-hover:scale-110 transition-transform`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <span className={`text-xs font-medium ${card.trend.includes('+') ? 'text-emerald-400' :
                                card.trend === 'Action Required' ? 'text-amber-400' : 'text-slate-400'
                                }`}>
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">{card.label}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>
                            {loading ? '...' : card.value}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Quick Actions */}
                <div className="lg:col-span-2 glass-card rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {quickActions.map((action, i) => (
                            <Link
                                key={i}
                                href={action.href}
                                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all group"
                            >
                                <action.icon className={`h-6 w-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
                                <p className="text-sm font-medium text-slate-300 group-hover:text-white">{action.label}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-cyan-400" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${item.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                                    item.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                                        item.type === 'ai' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-purple-500/10 text-purple-400'
                                    }`}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-300">{item.message}</p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bot Control Center */}
            <div className="animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-robot text-cyan-400"></i>
                    Neural Bot Network
                </h3>
                <BotControlCenter />
            </div>

            {/* System Status */}
            <div className="glass-card rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">System Status</h3>
                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { name: 'Database', status: 'Healthy', icon: CheckCircle2 },
                        { name: 'AI Engine', status: 'Healthy', icon: CheckCircle2 },
                        { name: 'Payment Gateway', status: 'Healthy', icon: CheckCircle2 },
                        { name: 'Edge Functions', status: 'Healthy', icon: CheckCircle2 },
                    ].map((service, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                            <service.icon className="h-5 w-5 text-emerald-400" />
                            <div>
                                <p className="text-sm font-medium text-slate-200">{service.name}</p>
                                <p className="text-xs text-emerald-400">{service.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
