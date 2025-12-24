export default function ContentPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Content Operations</h2>
                <p className="text-slate-400">Manage Quran metadata, Tafsir, and official JAKIM data syncs.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Sync Status Card */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium mb-4">Official Data Sync (JAKIM)</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div>
                                <div className="font-medium text-slate-200">JAKIM E-Solat (Prayer Times)</div>
                                <div className="text-xs text-slate-500">Source: e-solat.gov.my/api</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-400">Live</span>
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div>
                                <div className="font-medium text-slate-200">Halal Directory (SmartHalal)</div>
                                <div className="text-xs text-slate-500">Source: myehalal.halal.gov.my</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-amber-400">Scraper Delay (2h)</span>
                                <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div>
                                <div className="font-medium text-slate-200">E-Fatwa Repository</div>
                                <div className="text-xs text-slate-500">Source: e-smaf.islam.gov.my</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">Synced Daily</span>
                                <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Knowledge Base Sources (PDF) */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium mb-4">Knowledge Base Sources (PDF)</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'GARIS PANDUAN FATWA MALAYSIA.pdf', size: '651 KB', status: 'Indexed' },
                            { name: 'GP_Perhotelan_Perlancongan.pdf', size: '293 KB', status: 'Indexed' },
                            { name: 'Social_Media_ICT_dalam_Islam.pdf', size: '7.9 MB', status: 'Processing' },
                            { name: 'nasihat.pdf', size: '2.9 MB', status: 'Indexed' },
                        ].map((doc) => (
                            <div key={doc.name} className="flex items-center justify-between p-3 rounded bg-slate-800/30 border border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-300 truncate max-w-[150px]">{doc.name}</div>
                                        <div className="text-[10px] text-slate-500">{doc.size}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded ${doc.status === 'Indexed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                    {doc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance Checker */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium mb-4">Compliance Check Indicator</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl mb-2">✅</span>
                            <span className="text-sm font-medium text-emerald-400">Uthmani Text Verified</span>
                            <span className="text-[10px] text-emerald-600">MD5: a4f...21b</span>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900 flex flex-col items-center justify-center text-center">
                            <span className="text-2xl mb-2">🕌</span>
                            <span className="text-sm font-medium text-emerald-400">Qibla Algo Validated</span>
                            <span className="text-[10px] text-emerald-600">vs JAKIM Geo</span>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-amber-950/30 border border-amber-900">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-500">⚠️</span>
                            <span className="font-medium text-amber-200">Pending Review</span>
                        </div>
                        <p className="text-xs text-amber-400/80">3 new AI Chat flags require RLHF review.</p>
                    </div>
                    {/* Masjid Database Stats */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex justify-between text-sm text-slate-400">
                            <span>Total Mosques Verified:</span>
                            <span className="text-slate-200 font-mono">6,432</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Editor Placeholder */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 h-[400px] flex items-center justify-center text-slate-500 border-dashed">
                CMS Editor Component (Tiptap / JSON Editor)
            </div>
        </div>
    )
}
