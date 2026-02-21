'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Users,
    FileText,
    ShieldAlert,
    Wallet,
    LayoutDashboard,
    TerminalSquare,
    LogOut,
    BookOpen,
    Activity,
    Settings
} from 'lucide-react'

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'User Management', icon: Users, href: '/dashboard/users' },
    { name: 'Content Ops', icon: FileText, href: '/dashboard/content' },
    { name: 'Iqra Ops', icon: BookOpen, href: '/dashboard/iqra' },
    { name: 'AI Oversight', icon: ShieldAlert, href: '/dashboard/ai-oversight' },
    { name: 'Finance', icon: Wallet, href: '/dashboard/finance' },
    { name: 'Advanced Tools', icon: TerminalSquare, href: '/dashboard/tools' },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col glass-panel border-r border-slate-800/50">
            {/* Logo Section */}
            <div className="flex h-16 items-center border-b border-slate-800/50 px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-raudhah-teal to-cyan-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-raudhah-teal neon-text">
                            Mission Control
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">QuranPulse v6.0</p>
                    </div>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="px-4 py-3 border-b border-slate-800/50">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-3 mb-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3">Navigation</p>
                </div>
                <nav className="space-y-1 px-3">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname?.startsWith(item.href))
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                                    animate-fade-in stagger-${Math.min(index + 1, 4)}
                                    ${isActive
                                        ? 'bg-raudhah-teal/10 text-raudhah-teal shadow-[inset_3px_0_0_var(--neon-cyan)]'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                                    }
                                `}
                            >
                                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-raudhah-teal' : ''}`} />
                                {item.name}
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-raudhah-teal glow-pulse"></span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User Section */}
            <div className="border-t border-slate-800/50 p-4 space-y-3">
                {/* Admin Profile */}
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/30">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        SA
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">Super Admin</p>
                        <p className="text-xs text-slate-500 truncate">admin@quranpulse.my</p>
                    </div>
                    <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors" title="Settings" aria-label="Settings">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>

                {/* Logout Button */}
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all duration-200">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}
