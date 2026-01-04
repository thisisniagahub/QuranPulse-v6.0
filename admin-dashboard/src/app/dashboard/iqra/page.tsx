'use client'

import { BookOpen, Mic, RefreshCw, Upload, CheckCircle2, Clock, Play, Pause } from 'lucide-react'

export default function IqraOpsPage() {
    const volumes = [
        { volume: 'Iqra 1 (Huruf Tunggal)', status: 'Live', audio: '100%', digitized: true, pages: 30 },
        { volume: 'Iqra 2 (Sambung)', status: 'Live', audio: '100%', digitized: true, pages: 32 },
        { volume: 'Iqra 3 (Baris Bawah/Depan)', status: 'In Progress', audio: '45%', digitized: false, pages: 34 },
        { volume: 'Iqra 4 (Tanwin)', status: 'Pending', audio: '0%', digitized: false, pages: 36 },
        { volume: 'Iqra 5 (Tanda Waqaf)', status: 'Pending', audio: '0%', digitized: false, pages: 34 },
        { volume: 'Iqra 6 (Pengenalan Quran)', status: 'Pending', audio: '0%', digitized: false, pages: 38 },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Iqra Digital Ops</h2>
                    <p className="text-slate-400 mt-1">Manage curriculum structure, audio validation, and user progress.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-ghost flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Import Audio
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Validate All
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {[
                    { label: 'Total Lines', value: '1,420', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Audio Coverage', value: '89%', icon: Mic, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Verified by Ustaz', value: '100%', icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Active Learners', value: '2,847', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
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

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Syllabus Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-400" />
                            Syllabus Digitization
                        </h3>
                        <div className="space-y-3">
                            {volumes.map((vol) => (
                                <div key={vol.volume} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all">
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-200">{vol.volume}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex gap-4">
                                            <span className={vol.audio === '100%' ? 'text-emerald-400' : vol.audio === '0%' ? 'text-slate-500' : 'text-amber-400'}>
                                                Audio: {vol.audio}
                                            </span>
                                            <span className={vol.digitized ? 'text-blue-400' : 'text-slate-500'}>
                                                {vol.digitized ? 'JSON Ready' : 'Markdown Only'}
                                            </span>
                                            <span className="text-slate-500">{vol.pages} pages</span>
                                        </div>
                                    </div>
                                    <div>
                                        {vol.status === 'Live' ? (
                                            <span className="badge badge-success">Live</span>
                                        ) : vol.status === 'In Progress' ? (
                                            <button className="btn-primary text-xs px-3 py-1.5">Continue</button>
                                        ) : (
                                            <span className="badge bg-slate-700/50 text-slate-400 border-slate-600">Locked</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audio Proofer */}
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <Mic className="h-5 w-5 text-pink-400" />
                                Audio Validator
                                <span className="badge badge-warning text-xs">Iqra 3 - Page 4</span>
                            </h3>
                            <button className="btn-ghost p-2">
                                <RefreshCw size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-6">
                            {['BA-TI', 'BU-TA', 'BI-TU', 'TA-BI'].map((text, i) => (
                                <div key={text} className="aspect-square glass-card rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer group">
                                    <span className="text-3xl font-arabic mb-2 text-white group-hover:text-cyan-400 transition-colors">
                                        {text.replace('-', '')}
                                    </span>
                                    <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">{text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center gap-4">
                            <button className="h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                                <Play className="text-white h-5 w-5 ml-0.5" />
                            </button>
                            <div className="flex-1">
                                <div className="h-10 w-full bg-slate-800/50 rounded-lg flex gap-0.5 items-center px-3 overflow-hidden">
                                    {[...Array(30)].map((_, i) => (
                                        <div key={i} className="w-1 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full transition-all" style={{ height: `${20 + Math.random() * 60}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn-primary text-xs py-2">
                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                </button>
                                <button className="btn-ghost text-xs py-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-400" />
                            Batch Upload
                        </h3>
                        <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer">
                            <Upload className="h-10 w-10 mb-3 opacity-50" />
                            <span className="text-sm font-medium">Drop files here</span>
                            <span className="text-xs text-slate-600 mt-1">Markdown / PDF / Audio ZIP</span>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6 animate-fade-in">
                        <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-400" />
                            Pending Tasks
                        </h3>
                        <div className="space-y-3">
                            {[
                                { task: 'Record Iqra 3 Page 5-10', priority: 'high' },
                                { task: 'Verify Iqra 2 Makhraj', priority: 'medium' },
                                { task: 'Export JSON for Iqra 3', priority: 'low' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                                    <span className={`w-2 h-2 rounded-full ${item.priority === 'high' ? 'bg-red-500' :
                                            item.priority === 'medium' ? 'bg-amber-500' :
                                                'bg-blue-500'
                                        }`}></span>
                                    <span className="text-sm text-slate-300">{item.task}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
