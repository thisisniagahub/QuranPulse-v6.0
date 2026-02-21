'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Brain, AlertTriangle, CheckCircle2, BookOpen, Clock, Zap,
    ThumbsUp, ThumbsDown, GraduationCap, Trash2, Send, AlertCircle
} from 'lucide-react'
import {
    getFlaggedChats, getAIStats, approveFlaggedChat, rejectFlaggedChat,
    addToTraining, deleteFlaggedChat, testPrompt
} from '@/actions/ai'
import type { FlaggedChat } from '@/types/crud'

export default function AIOversightPage() {
    const [flagged, setFlagged] = useState<FlaggedChat[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [stats, setStats] = useState({ totalQueries: 0, pending: 0, approved: 0, trained: 0, avgResponseTime: 0 })

    // Prompt testing
    const [systemPrompt, setSystemPrompt] = useState('You are Ustaz AI, an Islamic knowledge assistant...')
    const [userInput, setUserInput] = useState('')
    const [testResult, setTestResult] = useState<{ output: string; tokensUsed: number; latency: number } | null>(null)
    const [testLoading, setTestLoading] = useState(false)

    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [flaggedData, statsData] = await Promise.all([
                getFlaggedChats(),
                getAIStats()
            ])
            setFlagged(flaggedData.flagged)
            setTotal(flaggedData.total)
            setStats(statsData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleApprove = async (id: string) => {
        setActionLoading(id)
        try {
            await approveFlaggedChat(id, 'admin') // Would use real user ID
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to approve')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (id: string) => {
        setActionLoading(id)
        try {
            await rejectFlaggedChat(id, 'admin')
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reject')
        } finally {
            setActionLoading(null)
        }
    }

    const handleAddToTraining = async (id: string) => {
        setActionLoading(id)
        try {
            await addToTraining(id, 'admin')
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add to training')
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id: string) => {
        setActionLoading(id)
        try {
            await deleteFlaggedChat(id)
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setActionLoading(null)
        }
    }

    const handleTestPrompt = async () => {
        if (!userInput.trim()) return
        setTestLoading(true)
        try {
            const result = await testPrompt(systemPrompt, userInput)
            setTestResult(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to test prompt')
        } finally {
            setTestLoading(false)
        }
    }

    const severityColor = (s: string) => {
        switch (s) {
            case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20'
            case 'medium': return 'badge-warning'
            case 'low': return 'badge-info'
            default: return 'bg-slate-500/10 text-slate-400'
        }
    }

    const statCards = [
        { label: 'Total Queries', value: stats.totalQueries.toLocaleString(), icon: Brain, color: 'text-raudhah-teal', bg: 'bg-raudhah-teal/10' },
        { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Added to Training', value: stats.trained, icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tight">AI Oversight</h2>
                <p className="text-slate-400 mt-1">Monitor AI responses, review flagged content, and manage training data</p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-red-400 border-red-500/30">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-300" aria-label="Dismiss error">×</button>
                </div>
            )}

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Flagged Queue */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-400" />
                            Flagged for Review
                            <span className="badge badge-warning">{total}</span>
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin h-8 w-8 border-2 border-raudhah-teal border-t-transparent rounded-full"></div>
                        </div>
                    ) : flagged.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No flagged items to review</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {flagged.map((item) => (
                                <div key={item.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 group">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className={`badge ${severityColor(item.severity)}`}>
                                            {item.severity.toUpperCase()}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-2 line-clamp-2">{item.snippet}</p>
                                    <p className="text-xs text-slate-500 mb-3">Trigger: {item.trigger}</p>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleApprove(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="flex-1 btn-ghost text-xs py-1.5 text-emerald-400 hover:bg-emerald-500/10"
                                        >
                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAddToTraining(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="flex-1 btn-ghost text-xs py-1.5 text-purple-400 hover:bg-purple-500/10"
                                        >
                                            <GraduationCap className="h-3 w-3 mr-1" />
                                            Train
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="btn-ghost text-xs py-1.5 text-red-400 hover:bg-red-500/10"
                                            title="Delete"
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Prompt Tester */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-raudhah-teal" />
                        Prompt Monitor (Test)
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="system-prompt" className="block text-sm text-slate-400 mb-1.5">System Prompt</label>
                            <textarea
                                id="system-prompt"
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="input-modern w-full h-24 font-mono text-xs"
                                placeholder="Enter system prompt..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1.5">User Input</label>
                            <div className="flex gap-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Test a query..."
                                    className="input-modern flex-1"
                                    onKeyDown={(e) => e.key === 'Enter' && handleTestPrompt()}
                                />
                                <button
                                    onClick={handleTestPrompt}
                                    disabled={testLoading}
                                    className="btn-primary"
                                >
                                    {testLoading ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {testResult && (
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500">AI Response</span>
                                    <div className="flex gap-3 text-xs text-slate-500">
                                        <span>{testResult.tokensUsed} tokens</span>
                                        <span>{testResult.latency}ms</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-300">{testResult.output}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
