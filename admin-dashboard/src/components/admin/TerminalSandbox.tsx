'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Terminal, Send, RefreshCw, XCircle } from 'lucide-react'

interface Log {
    type: 'info' | 'success' | 'warning' | 'error' | 'command'
    message: string
    timestamp: string
}

export function TerminalSandbox() {
    const [command, setCommand] = useState('')
    const [logs, setLogs] = useState<Log[]>([
        { type: 'info', message: 'QuranPulse Admin CLI v1.0.0 initialized.', timestamp: new Date().toLocaleTimeString() },
        { type: 'warning', message: 'Connected to PRODUCTION environment.', timestamp: new Date().toLocaleTimeString() },
        { type: 'info', message: 'Type "help" for available commands.', timestamp: new Date().toLocaleTimeString() }
    ])
    const [isExecuting, setIsExecuting] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [logs])

    const executeCommand = async (cmd: string) => {
        if (!cmd.trim()) return

        const newLog: Log = { type: 'command', message: `> ${cmd}`, timestamp: new Date().toLocaleTimeString() }
        setLogs(prev => [...prev, newLog])
        setCommand('')
        setIsExecuting(true)

        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 800))

        let responseLog: Log

        switch (cmd.toLowerCase().trim()) {
            case 'help':
                responseLog = { type: 'info', message: 'Available commands: \n- sync:jakim (Sync Prayer Times)\n- clear:cache (Redis Flush)\n- db:seed (Seed Mock Data)\n- audit:users (Check Anomalies)\n- health (System Status)', timestamp: new Date().toLocaleTimeString() }
                break
            case 'sync:jakim':
                responseLog = { type: 'success', message: 'Successfully synced prayer times for 14 states from JAKIM e-Solat API.', timestamp: new Date().toLocaleTimeString() }
                break
            case 'clear:cache':
                responseLog = { type: 'success', message: 'Redis cache flushed. 420 keys removed.', timestamp: new Date().toLocaleTimeString() }
                break
            case 'health':
                responseLog = { type: 'info', message: 'System Healthy. CPU: 12%, Memory: 40%, DB Connections: 5/20.', timestamp: new Date().toLocaleTimeString() }
                break
            case 'db:seed':
                responseLog = { type: 'error', message: 'Error: Cannot run seeder in PRODUCTION mode. Use --force to override (Dangerous).', timestamp: new Date().toLocaleTimeString() }
                break
            default:
                responseLog = { type: 'error', message: `Command not found: ${cmd}`, timestamp: new Date().toLocaleTimeString() }
        }

        setLogs(prev => [...prev, responseLog])
        setIsExecuting(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            executeCommand(command)
        }
    }

    return (
        <div className="flex flex-col h-[500px] rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">
                <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="h-4 w-4" />
                    <span>Console / Production</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setLogs([])} className="p-1 hover:text-white text-slate-500" title="Clear"><XCircle className="h-4 w-4" /></button>
                </div>
            </div>

            {/* Terminal Output */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-300">
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${log.type === 'error' ? 'text-red-400' :
                            log.type === 'success' ? 'text-emerald-400' :
                                log.type === 'warning' ? 'text-amber-400' :
                                    log.type === 'command' ? 'text-blue-300 font-bold' :
                                        'text-slate-300'
                        }`}>
                        <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                        <span className="whitespace-pre-wrap">{log.message}</span>
                    </div>
                ))}
                {isExecuting && (
                    <div className="flex gap-2 text-slate-500 animate-pulse">
                        <span>_ processing...</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 p-3 border-t border-slate-800 bg-slate-900">
                <span className="text-emerald-500 font-bold">{`admin@quranpulse:~$`}</span>
                <input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600"
                    placeholder="Enter command..."
                    disabled={isExecuting}
                />
                <button
                    disabled={isExecuting}
                    onClick={() => executeCommand(command)}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
