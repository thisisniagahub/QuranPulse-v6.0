'use client'

import React, { useState } from 'react'
import { Search, MoreHorizontal, UserPlus, Mail, Shield, Ban, Eye, ChevronDown } from 'lucide-react'

const users = [
    { id: 'usr_1', name: 'Ahmad Albab', email: 'ahmad@gmail.com', role: 'admin', subscription: 'FAMILY', status: 'active', lastActive: '2 mins ago', avatar: 'AA' },
    { id: 'usr_2', name: 'Siti Saleha', email: 'siti@yahoo.com', role: 'user', subscription: 'PRO', status: 'active', lastActive: '1 hour ago', avatar: 'SS' },
    { id: 'usr_3', name: 'Ali Baba', email: 'ali@baba.com', role: 'user', subscription: 'FREE', status: 'inactive', lastActive: '3 days ago', avatar: 'AB' },
    { id: 'usr_4', name: 'Nurul Iman', email: 'nurul@test.com', role: 'user', subscription: 'PRO', status: 'active', lastActive: '5 mins ago', avatar: 'NI' },
    { id: 'usr_5', name: 'Hafiz Rahman', email: 'hafiz@test.com', role: 'user', subscription: 'FREE', status: 'active', lastActive: '1 day ago', avatar: 'HR' },
    { id: 'usr_6', name: 'Fatimah Zahra', email: 'fatimah@gmail.com', role: 'moderator', subscription: 'PRO', status: 'active', lastActive: '30 mins ago', avatar: 'FZ' },
]

export function UserTable() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleImpersonate = (userId: string) => {
        alert(`Impersonating User: ${userId}. Generating Magic Link...`)
    }

    const getSubscriptionBadge = (sub: string) => {
        switch (sub) {
            case 'PRO': return 'badge-pro'
            case 'FAMILY': return 'badge-family'
            default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'badge-danger'
            case 'moderator': return 'badge-warning'
            default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }
    }

    return (
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-modern pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Moderator</option>
                        <option>User</option>
                    </select>
                    <select className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50">
                        <option>All Plans</option>
                        <option>Family</option>
                        <option>Pro</option>
                        <option>Free</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="relative w-full overflow-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-12">
                                <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                            </th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Subscription</th>
                            <th>Status</th>
                            <th>Last Active</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                            {user.avatar}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${getSubscriptionBadge(user.subscription)}`}>
                                        {user.subscription}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                        <span className={user.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}>
                                            {user.status}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-slate-400">{user.lastActive}</span>
                                </td>
                                <td className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleImpersonate(user.id)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                                            title="Impersonate"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                                            title="More Actions"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    Showing {filteredUsers.length} of {users.length} users
                </span>
                <div className="flex items-center gap-2">
                    <button className="btn-ghost px-3 py-1.5 text-xs">Previous</button>
                    <button className="btn-ghost px-3 py-1.5 text-xs">Next</button>
                </div>
            </div>
        </div>
    )
}
