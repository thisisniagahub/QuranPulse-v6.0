'use client'

import { BookOpen, Mic, RefreshCw, Upload } from 'lucide-react'

export default function IqraOpsPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Iqra Digital Ops</h2>
                    <p className="text-slate-400">Manage curriculum structure, audio validation, and user progress.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Syllabus Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-400" /> Syllabus Digitization
                        </h3>
                        <div className="space-y-4">
                            {[
                                { volume: 'Iqra 1 (Huruf Tunggal)', status: 'Live', audio: '100%', digitized: true },
                                { volume: 'Iqra 2 (Sambung)', status: 'Live', audio: '100%', digitized: true },
                                { volume: 'Iqra 3 (Baris Bawah/Depan)', status: 'In Progress', audio: '45%', digitized: false },
                                { volume: 'Iqra 4 (Tanwin)', status: 'Pending', audio: '0%', digitized: false },
                            ].map((vol) => (
                                <div key={vol.volume} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800 transition">
                                    <div>
                                        <div className="font-medium text-slate-200">{vol.volume}</div>
                                        <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                            <span className={vol.audio === '100%' ? 'text-emerald-500' : 'text-amber-500'}>Audio: {vol.audio}</span>
                                            <span className={vol.digitized ? 'text-blue-500' : 'text-slate-500'}>{vol.digitized ? 'JSON Ready' : 'Markdown Only'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {vol.status === 'Live' ? (
                                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">Live</span>
                                        ) : vol.status === 'In Progress' ? (
                                            <button className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-xs">Continue</button>
                                        ) : (
                                            <span className="px-2 py-1 rounded bg-slate-700 text-slate-400 text-xs">Locked</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Audio Proofer Mockup */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
                                <Mic className="h-5 w-5 text-pink-400" /> Audio Validator (Iqra 3 - Page 4)
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"><RefreshCw size={14} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                            {['BA-TI', 'BU-TA', 'BI-TU', 'TA-BI'].map((text) => (
                                <div key={text} className="aspect-square bg-slate-950 rounded border border-slate-800 flex flex-col items-center justify-center p-2 hover:border-indigo-500 cursor-pointer group hover:bg-slate-900">
                                    <span className="text-2xl font-arabic mb-2 text-white">{text.replace('-', '')}</span>
                                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-400">{text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-slate-950 rounded border border-slate-800 flex items-center gap-4">
                            <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
                                <Mic className="text-white h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <div className="h-8 w-full bg-slate-800 rounded flex gap-1 items-center px-2 overflow-hidden">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-1 bg-indigo-400 rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded">Approve</button>
                                <button className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/50 text-xs rounded">Reject</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-400" /> Batch Upload
                        </h3>
                        <div className="p-8 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center text-center text-slate-500 hover:border-slate-500 hover:bg-slate-800/30 transition cursor-pointer">
                            <Upload className="h-8 w-8 mb-2 opacity-50" />
                            <span className="text-xs">Drag Markdown / PDF / Audio Archive</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                        <h3 className="font-medium text-slate-200 mb-4">Validation Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Lines</span>
                                <span className="text-white">1,420</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Audio Covered</span>
                                <span className="text-emerald-400">89%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Verified by Ustaz</span>
                                <span className="text-blue-400">100% (Iqra 1-2)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
