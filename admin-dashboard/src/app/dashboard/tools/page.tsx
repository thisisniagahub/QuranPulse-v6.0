import { TerminalSandbox } from '@/components/admin/TerminalSandbox'
import { Activity, Database, Server, Zap, Globe, Cpu, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdvancedToolsPage() {
    const jobs = [
        { name: 'sync-prayers-daily', status: 'Running', lastRun: '2 mins ago' },
        { name: 'generate-weekly-reports', status: 'Scheduled', lastRun: 'Tomorrow 00:00' },
        { name: 'cleanup-audio-cache', status: 'Running', lastRun: '5 mins ago' },
        { name: 'process-infaq-queue', status: 'Idle', lastRun: '1 hour ago' },
    ]

    const edgeFunctions = [
        { name: 'chat-proxy', status: 'Healthy', calls: '12.4k', latency: '145ms' },
        { name: 'mcp-worship', status: 'Healthy', calls: '8.2k', latency: '89ms' },
        { name: 'mcp-quran', status: 'Healthy', calls: '3.1k', latency: '112ms' },
        { name: 'payment-webhook', status: 'Healthy', calls: '1.2k', latency: '234ms' },
        { name: 'generate-audio', status: 'Cold Start', calls: '45', latency: '2.1s' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold tracking-tight">Advanced System Tools</h2>
                <p className="text-slate-400 mt-1">Direct database access, background jobs, and system health monitoring.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Terminal Area */}
                <div className="lg:col-span-2 space-y-6">
                    <TerminalSandbox />

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Jobs */}
                        <div className="glass-card rounded-xl p-5 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    <Zap className="h-5 w-5 text-indigo-400" />
                                </div>
                                <h3 className="font-semibold text-slate-200">Background Jobs</h3>
                            </div>
                            <div className="space-y-2">
                                {jobs.map((job) => (
                                    <div key={job.name} className="flex justify-between items-center text-sm p-3 rounded-lg bg-slate-800/30">
                                        <div>
                                            <span className="text-slate-300 font-mono text-xs">{job.name}</span>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{job.lastRun}</p>
                                        </div>
                                        <span className={`badge ${job.status === 'Running' ? 'badge-success' :
                                                job.status === 'Scheduled' ? 'badge-info' :
                                                    'bg-slate-700/50 text-slate-400 border-slate-600'
                                            }`}>
                                            {job.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Health */}
                        <div className="glass-card rounded-xl p-5 animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                    <Activity className="h-5 w-5 text-orange-400" />
                                </div>
                                <h3 className="font-semibold text-slate-200">System Health</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Error Rate (24h)', value: '0.02%', status: 'good' },
                                    { label: 'Avg Latency', value: '145ms', status: 'good' },
                                    { label: 'Active Sessions', value: '42', status: 'good' },
                                    { label: 'Memory Usage', value: '62%', status: 'warn' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-800/30">
                                        <span className="text-slate-400">{item.label}</span>
                                        <span className={
                                            item.status === 'good' ? 'text-emerald-400' :
                                                item.status === 'warn' ? 'text-amber-400' :
                                                    'text-red-400'
                                        }>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Innovation Modules */}
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <span className="badge badge-info text-xs">BETA</span>
                            Innovation Modules
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="h-5 w-5 text-cyan-400" />
                                    <span className="font-medium text-slate-200">Digital Masjid Scraper</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">
                                    Automated event scraping from masjid.islam.gov.my for local community feeds.
                                </p>
                                <button className="btn-ghost text-xs w-full">Configure Scraper</button>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Cpu className="h-5 w-5 text-purple-400" />
                                    <span className="font-medium text-slate-200">Wakaf Node Fleet</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">
                                    Manage Raspberry Pi servers deployed in rural areas (IoT Dashboard).
                                </p>
                                <button className="btn-ghost text-xs w-full">View Node Status</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-400" />
                            Database Status
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Provider', value: 'Supabase (PostgreSQL 15)' },
                                { label: 'Region', value: 'ap-southeast-1 (Singapore)' },
                                { label: 'Pool', value: '15 / 20 Connections' },
                                { label: 'Size', value: '2.4 GB / 8 GB' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 rounded-lg bg-slate-800/30">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</div>
                                    <div className="text-sm font-medium text-slate-200 mt-0.5">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Server className="h-5 w-5 text-purple-400" />
                            Edge Functions
                        </h3>
                        <div className="space-y-2">
                            {edgeFunctions.map((fn) => (
                                <div key={fn.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                                    <div>
                                        <div className="font-mono text-xs text-slate-300">{fn.name}</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{fn.calls} calls • {fn.latency}</div>
                                    </div>
                                    {fn.status === 'Healthy' ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-amber-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
