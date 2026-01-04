'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    DollarSign, TrendingUp, TrendingDown, CreditCard, RefreshCw,
    ArrowUpRight, AlertCircle, Key, Eye, EyeOff, RotateCw
} from 'lucide-react'
import { DataTable, DeleteConfirm } from '@/components/ui'
import {
    getTransactions, getTransactionStats, processRefund,
    getMerchantKeys, rotateMerchantKey, getRevenueByMonth
} from '@/actions/finance'
import type { Transaction, CRUDColumn } from '@/types/crud'

const transactionColumns: CRUDColumn<Transaction>[] = [
    { key: 'id', label: 'ID', type: 'text', render: (v) => <span className="font-mono text-xs">{v.slice(0, 8)}...</span> },
    {
        key: 'type',
        label: 'Type',
        type: 'badge',
        sortable: true,
        options: [
            { value: 'subscription', label: 'Subscription', color: 'badge-pro' },
            { value: 'infaq', label: 'Infaq', color: 'badge-success' },
            { value: 'refund', label: 'Refund', color: 'badge-warning' },
        ]
    },
    {
        key: 'amount',
        label: 'Amount',
        type: 'number',
        sortable: true,
        render: (v, row) => (
            <span className={row.type === 'refund' ? 'text-red-400' : 'text-emerald-400'}>
                {row.type === 'refund' ? '-' : '+'}RM {v?.toFixed(2) || '0.00'}
            </span>
        )
    },
    {
        key: 'status',
        label: 'Status',
        type: 'badge',
        options: [
            { value: 'success', label: 'Success', color: 'badge-success' },
            { value: 'pending', label: 'Pending', color: 'badge-warning' },
            { value: 'failed', label: 'Failed', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
            { value: 'refunded', label: 'Refunded', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
        ]
    },
    { key: 'created_at', label: 'Date', type: 'date', sortable: true },
]

export default function FinancePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [stats, setStats] = useState({ mrr: 0, totalInfaq: 0, refundCount: 0, refundAmount: 0 })
    const [merchantKeys, setMerchantKeys] = useState<any[]>([])
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([])

    const [isRefundOpen, setIsRefundOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getTransactions(page, pageSize)
            setTransactions(data.transactions)
            setTotal(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
        } finally {
            setLoading(false)
        }
    }, [page, pageSize])

    const fetchStats = useCallback(async () => {
        try {
            const data = await getTransactionStats()
            setStats(data)
        } catch (err) {
            console.error('Failed to fetch stats:', err)
        }
    }, [])

    const fetchMerchantKeys = useCallback(async () => {
        try {
            const data = await getMerchantKeys()
            setMerchantKeys(data)
        } catch (err) {
            console.error('Failed to fetch merchant keys:', err)
        }
    }, [])

    const fetchRevenueData = useCallback(async () => {
        try {
            const data = await getRevenueByMonth()
            setRevenueData(data)
        } catch (err) {
            console.error('Failed to fetch revenue data:', err)
        }
    }, [])

    useEffect(() => {
        fetchTransactions()
        fetchStats()
        fetchMerchantKeys()
        fetchRevenueData()
    }, [fetchTransactions, fetchStats, fetchMerchantKeys, fetchRevenueData])

    const handleRefund = async () => {
        if (!selectedTransaction) return
        setActionLoading(true)
        try {
            await processRefund(selectedTransaction.id)
            setIsRefundOpen(false)
            setSelectedTransaction(null)
            fetchTransactions()
            fetchStats()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process refund')
        } finally {
            setActionLoading(false)
        }
    }

    const handleRotateKey = async (provider: string) => {
        try {
            await rotateMerchantKey(provider)
            fetchMerchantKeys()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to rotate key')
        }
    }

    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1)

    const statCards = [
        { label: 'Monthly Revenue', value: `RM ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+12%' },
        { label: 'Total Infaq', value: `RM ${stats.totalInfaq.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+8%' },
        { label: 'Refunds', value: stats.refundCount, icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: `-RM ${stats.refundAmount}` },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>
                    <p className="text-slate-400 mt-1">Manage transactions, subscriptions, and payment integrations</p>
                </div>
                <button onClick={fetchTransactions} className="btn-ghost flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-red-400 border-red-500/30">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto hover:text-red-300">×</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="glass-card rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Revenue Trend (6 Months)</h3>
                <div className="flex items-end gap-4 h-40">
                    {revenueData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-400/80 rounded-t relative group transition-all hover:from-cyan-400/60 hover:to-cyan-300/90 min-h-[8px]"
                                data-height={`${(data.revenue / maxRevenue) * 100}%`}
                                style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-cyan-400 whitespace-nowrap">
                                    RM {data.revenue.toLocaleString()}
                                </div>
                            </div>
                            <span className="text-xs text-slate-500">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="animate-fade-in">
                <DataTable<Transaction>
                    data={transactions}
                    columns={transactionColumns}
                    loading={loading}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    title="Transaction History"
                    searchPlaceholder="Search transactions..."
                    onEdit={(t) => {
                        if (t.status === 'success' && t.type !== 'refund') {
                            setSelectedTransaction(t)
                            setIsRefundOpen(true)
                        }
                    }}
                />
            </div>

            {/* Merchant Keys */}
            <div className="glass-card rounded-xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <Key className="h-5 w-5 text-amber-400" />
                        Payment Integrations
                    </h3>
                </div>
                <div className="space-y-3">
                    {merchantKeys.map((key, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${key.status === 'active' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                    <CreditCard className={`h-5 w-5 ${key.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`} />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-200">{key.name}</div>
                                    <div className="text-xs text-slate-500">Last rotated: {key.lastRotated}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <code className="px-3 py-1 bg-slate-900 rounded text-xs text-slate-400 font-mono">
                                    {showKeys[key.provider] ? `${key.keyPrefix}XXXX` : '••••••••••••'}
                                </code>
                                <button
                                    onClick={() => setShowKeys(p => ({ ...p, [key.provider]: !p[key.provider] }))}
                                    className="p-2 text-slate-400 hover:text-white"
                                >
                                    {showKeys[key.provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => handleRotateKey(key.provider)}
                                    className="btn-ghost text-xs flex items-center gap-1"
                                >
                                    <RotateCw className="h-3 w-3" />
                                    Rotate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Refund Confirm */}
            <DeleteConfirm
                isOpen={isRefundOpen}
                onClose={() => { setIsRefundOpen(false); setSelectedTransaction(null) }}
                onConfirm={handleRefund}
                title="Process Refund"
                message="Are you sure you want to process a refund for this transaction?"
                itemName={selectedTransaction ? `RM ${selectedTransaction.amount?.toFixed(2)}` : undefined}
                loading={actionLoading}
            />
        </div>
    )
}
