import { TerminalSandbox } from '@/components/admin/TerminalSandbox'
import { Activity, Database, Server, Zap, Globe, Cpu } from 'lucide-react'

export default function AdvancedToolsPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Advanced System Tools</h2>
                <p className="text-slate-400">Direct database access, background jobs, and system health monitoring.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Terminal Area */}
                <div className="lg:col-span-2 space-y-6">
                    <TerminalSandbox />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h3 className="font-medium text-slate-200">Trigger.dev Jobs</h3>
                            </div>
                            <div className="space-y-2">
                                {['sync-prayers-daily', 'generate-weekly-reports', 'cleanup-audio-cache'].map((job) => (
                                    <div key={job} className="flex justify-between items-center text-sm p-2 rounded bg-slate-800/50">
                                        <span className="text-slate-400 font-mono">{job}</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Running</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <h3 className="font-medium text-slate-200">System Health (Sentry)</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Error Rate (24h)</span>
                                    <span className="text-emerald-400">0.02%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Avg Latency</span>
                                    <span className="text-slate-200">145ms</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Active Sessions</span>
                                    <span className="text-slate-200">42</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Innovation Modules (Beta) */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">BETA</span>
                            Innovation Modules
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded border border-slate-700 bg-slate-800/30">
                                <div className="flex items-center gap-2 mb-2 text-slate-200">
                                    <Globe className="h-4 w-4 text-cyan-400" />
                                    <span className="font-medium">Digital Masjid Scraper</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Automated event scraping from masjid.islam.gov.my for local community feeds.
                                </p>
                                <button className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors w-full">
                                    Configure Scraper
                                </button>
                            </div>
                            <div className="p-4 rounded border border-slate-700 bg-slate-800/30">
                                <div className="flex items-center gap-2 mb-2 text-slate-200">
                                    <Cpu className="h-4 w-4 text-purple-400" />
                                    <span className="font-medium">Wakaf Node Fleet</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Manage Raspberry Pi servers deployed in rural areas (IoT Dashboard).
                                </p>
                                <button className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors w-full">
                                    View Node Status
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Side Panel Info */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-400" /> Database Status
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded bg-slate-950 border border-slate-800">
                                <div className="text-xs text-slate-500 uppercase">Provider</div>
                                <div className="text-sm font-medium text-white">Supabase (PostgreSQL 15)</div>
                            </div>
                            <div className="p-3 rounded bg-slate-950 border border-slate-800">
                                <div className="text-xs text-slate-500 uppercase">Region</div>
                                <div className="text-sm font-medium text-white">ap-southeast-1 (Singapore)</div>
                            </div>
                            <div className="p-3 rounded bg-slate-950 border border-slate-800">
                                <div className="text-xs text-slate-500 uppercase">Pool Size</div>
                                <div className="text-sm font-medium text-white">15 / 20 Connections</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <Server className="h-4 w-4 text-purple-400" /> Compute (Edge)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'chat-proxy', status: 'Healthy', calls: '12.4k' },
                                { name: 'payment-webhook', status: 'Healthy', calls: '1.2k' },
                                { name: 'generate-audio', status: 'Cold Start', calls: '45' },
                            ].map((fn) => (
                                <div key={fn.name} className="flex items-center justify-between text-sm">
                                    <div className="font-mono text-slate-400">{fn.name}</div>
                                    <div className={`text-xs px-2 py-0.5 rounded ${fn.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{fn.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
