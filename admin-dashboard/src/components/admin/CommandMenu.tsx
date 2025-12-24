'use client'

import * as React from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import {
    Calculator,
    User,
    CreditCard,
    Settings,
    Smile,
    LayoutDashboard,
    FileText,
    LogOut,
    Moon,
    Sun,
    Laptop
} from 'lucide-react'

export function CommandMenu({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    return (
        <>
            {children}
            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Command Menu"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-[99999]"
                onClick={() => setOpen(false)} // Close when clicking backdrop if possible, relying on Dialog behavior usually
            >
                <div className="flex items-center border-b border-slate-800 px-3">
                    <Command.Input
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 text-slate-100"
                        placeholder="Type a command or search..."
                    />
                </div>

                <Command.List className="h-[300px] overflow-y-auto p-2 scrollbar-hide">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-medium text-slate-500">
                        <CommandItem onSelect={() => router.push('/dashboard')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </CommandItem>
                        <CommandItem onSelect={() => router.push('/dashboard/users')}>
                            <User className="mr-2 h-4 w-4" />
                            User Management
                        </CommandItem>
                        <CommandItem onSelect={() => router.push('/dashboard/finance')}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Finance
                        </CommandItem>
                        <CommandItem onSelect={() => router.push('/dashboard/content')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Content Ops
                        </CommandItem>
                    </Command.Group>

                    <Command.Group heading="Tools" className="px-2 py-1.5 text-xs font-medium text-slate-500">
                        <CommandItem onSelect={() => router.push('/dashboard/tools')}>
                            <Calculator className="mr-2 h-4 w-4" />
                            Terminal & Tools
                        </CommandItem>
                        <CommandItem onSelect={() => router.push('/dashboard/ai-oversight')}>
                            <Smile className="mr-2 h-4 w-4" />
                            AI Oversight
                        </CommandItem>
                    </Command.Group>

                    <Command.Group heading="System" className="px-2 py-1.5 text-xs font-medium text-slate-500">
                        <CommandItem onSelect={() => console.log('Toggle Theme')}>
                            <Moon className="mr-2 h-4 w-4" />
                            Toggle Dark Mode
                        </CommandItem>
                        <CommandItem onSelect={() => router.push('/login')}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </CommandItem>
                    </Command.Group>
                </Command.List>

                <div className="border-t border-slate-800 py-2 px-4 text-[10px] text-slate-500 flex justify-between">
                    <span>Mission Control v1.0</span>
                    <span className="flex items-center gap-1">
                        <kbd className="bg-slate-800 px-1 rounded">Esc</kbd> to close
                    </span>
                </div>
            </Command.Dialog>

            {/* Backdrop overlay override if cmdk doesn't provide one automatically or for extra styling */}
            {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]" />}
        </>
    )
}

function CommandItem({ children, onSelect }: { children: React.ReactNode, onSelect?: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center px-2 py-2 rounded-lg text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer aria-selected:bg-emerald-500/10 aria-selected:text-emerald-400 transition-colors"
        >
            {children}
        </Command.Item>
    )
}
