export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, Super Admin.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Sync Status Mockup */}
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Healthy
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Total Users', value: '12,345', trend: '+12%', color: 'bg-blue-500' },
                    { label: 'Monthly Revenue', value: 'RM 14,203', trend: '+8.2%', color: 'bg-emerald-500' },
                    { label: 'Active Subs', value: '1,203', trend: '+4%', color: 'bg-purple-500' },
                    { label: 'AI Queries', value: '45.2k', trend: '+23%', color: 'bg-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-sm">
                        <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                        <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                        <p className="text-xs text-emerald-400 mt-1">{stat.trend} from last month</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Financial Overview (MRR)</h3>
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-500">
                        Chart Component (Need Recharts)
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Compliance Watch</h3>
                    <div className="space-y-4">
                        {[
                            { check: 'JAKIM Prayer Times', status: 'Synced (3 mins ago)', safe: true },
                            { check: 'Quran Text Integrity', status: 'Verified', safe: true },
                            { check: 'AI Fatwa Filters', status: 'Active (Strict)', safe: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <span className="text-sm font-medium text-slate-200">{item.check}</span>
                                <span className="text-xs font-bold text-emerald-400">{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
