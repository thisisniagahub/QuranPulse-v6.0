'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Lock, TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, RefreshCw } from 'lucide-react'

export default function FinancePage() {
    const [showKeys, setShowKeys] = useState(false)

    const transactions = [
        { id: 'txn_82391', user: 'ahmad@gmail.com', type: 'Subscription (PRO)', amount: 'RM 9.90', status: 'success', time: '2 mins ago' },
        { id: 'txn_82392', user: 'siti@yahoo.com', type: 'Subscription (Family)', amount: 'RM 19.90', status: 'success', time: '15 mins ago' },
        { id: 'txn_82393', user: 'ali@baba.com', type: 'Infaq', amount: 'RM 50.00', status: 'success', time: '1 hour ago' },
        { id: 'txn_82394', user: 'nurul@test.com', type: 'Subscription (PRO)', amount: 'RM 9.90', status: 'pending', time: '2 hours ago' },
        { id: 'txn_82395', user: 'hafiz@test.com', type: 'Refund', amount: '-RM 9.90', status: 'processed', time: '1 day ago' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
                    <p className="text-slate-400 mt-1">Track MRR, Infaq, and Subscription Health.</p>
                </div>
                <button className="btn-ghost flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sync Data
                </button>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Monthly Recurring Revenue</p>
                            <p className="text-3xl font-bold text-emerald-400 mt-2">RM 14,230</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400">
                                <TrendingUp className="h-3 w-3" />
                                +12.5% vs last month
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <Wallet className="h-6 w-6 text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Infaq Received</p>
                            <p className="text-3xl font-bold text-blue-400 mt-2">RM 5,100</p>
                            <p className="text-xs text-slate-500 mt-2">100% disbursed to causes</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <CreditCard className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Churn Rate</p>
                            <p className="text-3xl font-bold text-red-400 mt-2">2.4%</p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                                <TrendingDown className="h-3 w-3" />
                                Increased from 1.8%
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <ArrowUpRight className="h-6 w-6 text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Transactions Table */}
                <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-800/50">
                        <h3 className="text-lg font-semibold">Transaction History</h3>
                    </div>
                    <div className="overflow-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>User</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="font-mono text-slate-300">{txn.id}</td>
                                        <td className="text-slate-400">{txn.user}</td>
                                        <td>{txn.type}</td>
                                        <td className={txn.amount.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}>
                                            {txn.amount}
                                        </td>
                                        <td>
                                            <span className={`badge ${txn.status === 'success' ? 'badge-success' :
                                                    txn.status === 'pending' ? 'badge-warning' :
                                                        'badge-info'
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Merchant Management */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Merchant Integrations</h3>
                        <button
                            onClick={() => setShowKeys(!showKeys)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                        >
                            {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* ToyyibPay */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ToyyibPay (Malaysia)</label>
                            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                        <Lock size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="font-mono text-sm text-slate-300">
                                        {showKeys ? 'toyyib-8fa291b4c2...' : '••••••••••••••••'}
                                    </span>
                                </div>
                                <span className="badge badge-success">Active</span>
                            </div>
                        </div>

                        {/* Stripe */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stripe (Global)</label>
                            <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-indigo-500/10">
                                        <Lock size={14} className="text-indigo-500" />
                                    </div>
                                    <span className="font-mono text-sm text-slate-300">
                                        {showKeys ? 'sk_live_51J2Kf...' : '••••••••••••••••'}
                                    </span>
                                </div>
                                <span className="badge badge-pro">Active</span>
                            </div>
                        </div>

                        <button className="btn-ghost w-full mt-4 flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Rotate API Keys
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
