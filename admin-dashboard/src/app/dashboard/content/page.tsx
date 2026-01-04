import { CheckCircle2, AlertTriangle, Clock, Database, FileText, Upload, RefreshCw, ExternalLink } from 'lucide-react'

export default function ContentPage() {
    const syncSources = [
        { name: 'JAKIM E-Solat (Prayer Times)', source: 'e-solat.gov.my/api', status: 'live', statusText: 'Live', lastSync: 'Real-time' },
        { name: 'Halal Directory (SmartHalal)', source: 'myehalal.halal.gov.my', status: 'warning', statusText: 'Delay', lastSync: '2 hours ago' },
        { name: 'E-Fatwa Repository', source: 'e-smaf.islam.gov.my', status: 'synced', statusText: 'Synced', lastSync: 'Daily at 00:00' },
        { name: 'Mosque Database', source: 'jakim.gov.my/masjid', status: 'synced', statusText: 'Synced', lastSync: '6 hours ago' },
    ]

    const documents = [
        { name: 'GARIS PANDUAN FATWA MALAYSIA.pdf', size: '651 KB', status: 'Indexed', chunks: 124 },
        { name: 'GP_Perhotelan_Perlancongan.pdf', size: '293 KB', status: 'Indexed', chunks: 56 },
        { name: 'Social_Media_ICT_dalam_Islam.pdf', size: '7.9 MB', status: 'Processing', chunks: 0 },
        { name: 'nasihat.pdf', size: '2.9 MB', status: 'Indexed', chunks: 89 },
        { name: 'Fiqh_Muamalat_2024.pdf', size: '4.2 MB', status: 'Queued', chunks: 0 },
    ]

    const complianceChecks = [
        { name: 'Uthmani Text Verified', desc: 'MD5: a4f...21b', status: true, icon: '✅' },
        { name: 'Qibla Algo Validated', desc: 'vs JAKIM Geo', status: true, icon: '🕌' },
        { name: 'Audio Recitation', desc: 'Qari: Mishary', status: true, icon: '🎙️' },
        { name: 'Translation Source', desc: 'JAKIM Official', status: true, icon: '📖' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Content Operations</h2>
                    <p className="text-slate-400 mt-1">Manage Quran metadata, Tafsir, and official JAKIM data syncs.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-ghost flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload PDF
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Sync All
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Sync Status Card */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Database className="h-5 w-5 text-cyan-400" />
                            Official Data Sync (JAKIM)
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {syncSources.map((source, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors">
                                <div>
                                    <div className="font-medium text-slate-200">{source.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                        <ExternalLink className="h-3 w-3" />
                                        {source.source}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <span className={`text-xs font-medium ${source.status === 'live' ? 'text-emerald-400' :
                                                source.status === 'warning' ? 'text-amber-400' :
                                                    'text-slate-400'
                                            }`}>{source.statusText}</span>
                                        <div className="text-[10px] text-slate-500">{source.lastSync}</div>
                                    </div>
                                    <span className={`flex h-2.5 w-2.5 rounded-full ${source.status === 'live' ? 'bg-emerald-500 animate-pulse' :
                                            source.status === 'warning' ? 'bg-amber-500' :
                                                'bg-blue-500'
                                        }`}></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Knowledge Base Sources */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            Knowledge Base (RAG)
                        </h3>
                        <span className="text-xs text-slate-500">269 chunks indexed</span>
                    </div>
                    <div className="space-y-2">
                        {documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10">
                                        <FileText className="h-4 w-4 text-indigo-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-300 truncate max-w-[180px]">{doc.name}</div>
                                        <div className="text-[10px] text-slate-500">{doc.size} • {doc.chunks} chunks</div>
                                    </div>
                                </div>
                                <span className={`badge ${doc.status === 'Indexed' ? 'badge-success' :
                                        doc.status === 'Processing' ? 'badge-warning' :
                                            'badge-info'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance Checker */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            Compliance Verification
                        </h3>
                        <span className="badge badge-success">All Passed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {complianceChecks.map((check, i) => (
                            <div key={i} className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl mb-2">{check.icon}</span>
                                <span className="text-sm font-medium text-emerald-400">{check.name}</span>
                                <span className="text-[10px] text-emerald-600 mt-0.5">{check.desc}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-amber-950/20 border border-amber-900/30">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="font-medium text-amber-200">Pending Review</span>
                        </div>
                        <p className="text-xs text-amber-400/80">3 new AI Chat flags require RLHF review.</p>
                    </div>
                </div>

                {/* Database Stats */}
                <div className="glass-card rounded-xl p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Database className="h-5 w-5 text-purple-400" />
                        Database Statistics
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Mosques Verified', value: '6,432' },
                            { label: 'Halal Products', value: '12,891' },
                            { label: 'Fatwa Entries', value: '2,456' },
                            { label: 'Hadith Collection', value: '7,563' },
                            { label: 'AI Knowledge Cache', value: '45,231 entries' },
                        ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30">
                                <span className="text-sm text-slate-400">{stat.label}</span>
                                <span className="text-sm font-mono text-slate-200">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
