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
    BookOpen
} from 'lucide-react'

// Mock cn function since clsx/tailwind-merge might not be installed yet
function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'User Management', icon: Users, href: '/dashboard/users' },
    { name: 'Content Ops', icon: FileText, href: '/dashboard/content' },
    { name: 'Iqra Ops', icon: BookOpen, href: '/dashboard/iqra' }, // Added Iqra Ops
    { name: 'AI Oversight', icon: ShieldAlert, href: '/dashboard/ai-oversight' },
    { name: 'Finance', icon: Wallet, href: '/dashboard/finance' },
    { name: 'Advanced Tools', icon: TerminalSquare, href: '/dashboard/tools' },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-950 text-slate-100">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <h1 className="text-xl font-bold tracking-tight text-emerald-400">
                    QP Mission Control
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/20">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}
