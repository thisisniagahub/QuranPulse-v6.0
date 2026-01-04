import { AlertTriangle, CheckCircle2, XCircle, MessageSquare, Brain, Send, Play, RefreshCw } from 'lucide-react'

export default function AIOversightPage() {
    const flaggedChats = [
        { id: 'chat_29481', trigger: 'Keyword "Fatwa"', snippet: 'User asked about unauthorized fatwa regarding bitcoin investment...', severity: 'high', time: '5 mins ago' },
        { id: 'chat_29482', trigger: 'Negative Sentiment', snippet: 'AI answer was deemed "confusing" by user. Requested clarification.', severity: 'medium', time: '32 mins ago' },
        { id: 'chat_29483', trigger: 'Hallucination Check', snippet: 'Verse reference 2:256 did not match the actual quotation provided.', severity: 'low', time: '1 hour ago' },
        { id: 'chat_29484', trigger: 'Low Rating (1 star)', snippet: 'User complained about incomplete answer on zakat calculation.', severity: 'medium', time: '2 hours ago' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Oversight (RLHF)</h2>
                    <p className="text-slate-400 mt-1">Review Hallucinations, Flags, and User Feedback for <code className="text-cyan-400">Ustaz AI</code> training.</p>
                </div>
                <div className="flex gap-2">
                    <span className="badge badge-danger">12 Flagged</span>
                    <span className="badge badge-warning">5 Low Ratings</span>
                    <span className="badge badge-success">2.1k Today</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {[
                    { label: 'Total Queries (24h)', value: '45,231', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Auto-Resolved', value: '44,892', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Flagged for Review', value: '339', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Avg Response Time', value: '1.2s', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Flagged Conversations Queue */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Flagged for Review</h3>
                        <button className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" /> Refresh
                        </button>
                    </div>
                    <div className="space-y-3">
                        {flaggedChats.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-mono text-xs text-slate-500">{item.id}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500">{item.time}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.severity === 'high' ? 'bg-red-500 text-white' :
                                                item.severity === 'medium' ? 'bg-amber-500 text-black' :
                                                    'bg-blue-500 text-white'
                                            }`}>{item.severity}</span>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-slate-200 mb-1 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                                    {item.trigger}
                                </div>
                                <div className="text-xs text-slate-400 line-clamp-2 mb-3">"{item.snippet}"</div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="flex-1 py-1.5 text-xs bg-emerald-900/50 text-emerald-400 rounded-lg border border-emerald-900 hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Approve
                                    </button>
                                    <button className="flex-1 py-1.5 text-xs bg-indigo-900/50 text-indigo-400 rounded-lg border border-indigo-900 hover:bg-indigo-900 transition-colors flex items-center justify-center gap-1">
                                        <Brain className="h-3 w-3" /> Train (RLHF)
                                    </button>
                                    <button className="py-1.5 px-3 text-xs bg-red-900/50 text-red-400 rounded-lg border border-red-900 hover:bg-red-900 transition-colors">
                                        <XCircle className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prompt Engineering Playground */}
                <div className="glass-card rounded-xl p-6 flex flex-col animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">Prompt Monitor (Live)</h3>
                        <span className="badge badge-success">Connected</span>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 mb-4 font-mono text-xs overflow-y-auto max-h-[400px]">
                        <div className="text-slate-500 mb-1">// System Prompt</div>
                        <div className="mb-4 text-emerald-400 leading-relaxed">
                            You are Ustaz AI. You must adhere to JAKIM guidelines. For complex fatwa questions, always recommend consulting local religious authorities...
                        </div>

                        <div className="text-slate-500 mb-1">// User Input</div>
                        <div className="mb-4 text-white bg-slate-800/50 p-2 rounded">
                            Apakah hukum melabur dalam ASB?
                        </div>

                        <div className="text-slate-500 mb-1">// AI Output (Gemini-2.5-Flash)</div>
                        <div className="text-slate-300 bg-slate-800/50 p-2 rounded leading-relaxed">
                            Berdasarkan keputusan Muzakarah Jawatankuasa Fatwa Majlis Kebangsaan pada tahun 2008, pelaburan dalam ASB adalah <span className="text-cyan-400">HARUS</span> dengan syarat-syarat tertentu...
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <div className="text-slate-500 mb-1">// Source Citations</div>
                            <a href="#" className="text-blue-400 hover:underline">e-smaf.islam.gov.my?id=342</a>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            className="input-modern flex-1"
                            placeholder="Test a query against safety filters..."
                        />
                        <button className="btn-primary flex items-center gap-2">
                            <Play className="h-4 w-4" /> Test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
