'use client'

import React from 'react'

const users = [
    { id: 'usr_1', name: 'Ahmad Albab', email: 'ahmad@gmail.com', role: 'admin', subscription: 'FAMILY', status: 'active', lastActive: '2 mins ago' },
    { id: 'usr_2', name: 'Siti Saleha', email: 'siti@yahoo.com', role: 'user', subscription: 'PRO', status: 'active', lastActive: '1 hour ago' },
    { id: 'usr_3', name: 'Ali Baba', email: 'ali@baba.com', role: 'user', subscription: 'FREE', status: 'inactive', lastActive: '3 days ago' },
    { id: 'usr_4', name: 'User 004', email: 'user4@test.com', role: 'user', subscription: 'PRO', status: 'active', lastActive: '5 mins ago' },
    { id: 'usr_5', name: 'User 005', email: 'user5@test.com', role: 'user', subscription: 'FREE', status: 'active', lastActive: '1 day ago' },
]

export function UserTable() {

    // Mock Impersonate Function
    const handleImpersonate = (userId: string) => {
        alert(`Impersonating User: ${userId}. Generating Magic Link...`)
    }

    return (
        <div className="rounded-md border border-slate-800 bg-slate-900">
            <div className="p-4 border-b border-slate-800">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full max-w-sm rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b [&_tr]:border-slate-800">
                        <tr className="border-b transition-colors hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">User</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Role</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Subscription</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Status</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-slate-800 transition-colors hover:bg-slate-800/50">
                                <td className="p-4 align-middle font-medium text-slate-200">
                                    <div>{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </td>
                                <td className="p-4 align-middle text-slate-300">{user.role}</td>
                                <td className="p-4 align-middle">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.subscription === 'PRO' ? 'bg-indigo-500/10 text-indigo-400' :
                                            user.subscription === 'FAMILY' ? 'bg-purple-500/10 text-purple-400' :
                                                'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        {user.subscription}
                                    </span>
                                </td>
                                <td className="p-4 align-middle text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                        {user.status}
                                    </div>
                                </td>
                                <td className="p-4 align-middle text-right">
                                    <button
                                        onClick={() => handleImpersonate(user.id)}
                                        className="inline-flex h-8 items-center justify-center rounded-md border border-slate-700 bg-transparent px-3 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Impersonate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
