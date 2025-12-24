'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function FinancePage() {
    const [showKeys, setShowKeys] = useState(false)

    return (
        <div className="p-8 space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
                <p className="text-slate-400">Track MRR, Infaq, and Subscription Health.</p>
            </div>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-sm text-slate-400">Monthly Recurring Revenue</div>
                    <div className="text-3xl font-bold text-emerald-400 mt-2">RM 14,230</div>
                    <div className="text-xs text-emerald-600 mt-1">+12.5% vs last month</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-sm text-slate-400">Total Infaq Received</div>
                    <div className="text-3xl font-bold text-blue-400 mt-2">RM 5,100</div>
                    <div className="text-xs text-slate-500 mt-1">100% disbursed to causes</div>
                </div>
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-sm text-slate-400">Churn Rate</div>
                    <div className="text-3xl font-bold text-red-400 mt-2">2.4%</div>
                    <div className="text-xs text-red-600 mt-1">Caution: Increased from 1.8%</div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium mb-4">Transaction History</h3>
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/20">
                                    <td className="px-6 py-4 font-mono text-slate-300">txn_823{i}92</td>
                                    <td className="px-6 py-4">user_{i}@gmail.com</td>
                                    <td className="px-6 py-4">Subscription (PRO)</td>
                                    <td className="px-6 py-4">RM 9.90</td>
                                    <td className="px-6 py-4"><span className="text-emerald-400">Success</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Merchant Management */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium">Merchant Integrations</h3>
                        <button
                            onClick={() => setShowKeys(!showKeys)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* ToyyibPay */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">ToyyibPay (Malaysia)</label>
                            <div className="p-3 rounded bg-slate-950 border border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock size={14} className="text-emerald-500" />
                                    <span className="font-mono text-sm text-slate-300">
                                        {showKeys ? 'toyyib-8fa291b...' : '••••••••••••••••'}
                                    </span>
                                </div>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Active</span>
                            </div>
                        </div>

                        {/* Stripe */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Stripe (Global)</label>
                            <div className="p-3 rounded bg-slate-950 border border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Lock size={14} className="text-indigo-500" />
                                    <span className="font-mono text-sm text-slate-300">
                                        {showKeys ? 'sk_live_51J2...' : '••••••••••••••••'}
                                    </span>
                                </div>
                                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded">Active</span>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-medium transition-colors">
                            Rotate API Keys
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
