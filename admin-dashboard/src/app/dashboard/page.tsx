import { TrendingUp, TrendingDown, Users, Wallet, CreditCard, Activity, CheckCircle2, AlertTriangle, Clock, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
    const stats = [
        {
            label: 'Total Users',
            value: '12,345',
            trend: '+12%',
            trendUp: true,
            icon: Users,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Monthly Revenue',
            value: 'RM 14,203',
            trend: '+8.2%',
            trendUp: true,
            icon: Wallet,
            color: 'from-emerald-500 to-green-500'
        },
        {
            label: 'Active Subs',
            value: '1,203',
            trend: '+4%',
            trendUp: true,
            icon: CreditCard,
            color: 'from-purple-500 to-indigo-500'
        },
        {
            label: 'AI Queries (24h)',
            value: '45.2k',
            trend: '+23%',
            trendUp: true,
            icon: Activity,
            color: 'from-amber-500 to-orange-500'
        },
    ]

    const complianceItems = [
        { check: 'JAKIM Prayer Times', status: 'Synced', time: '3 mins ago', safe: true, icon: CheckCircle2 },
        { check: 'Quran Text Integrity', status: 'Verified', time: 'Hash Valid', safe: true, icon: CheckCircle2 },
        { check: 'AI Fatwa Filters', status: 'Active', time: 'Strict Mode', safe: true, icon: CheckCircle2 },
        { check: 'E-Solat API', status: 'Connected', time: 'Live', safe: true, icon: CheckCircle2 },
    ]

    const recentActivity = [
        { action: 'New user registered', user: 'ahmad.shah@gmail.com', time: '2 mins ago', type: 'user' },
        { action: 'Infaq received', user: 'RM 50.00', time: '15 mins ago', type: 'payment' },
        { action: 'AI flag raised', user: 'chat_29481', time: '32 mins ago', type: 'warning' },
        { action: 'Subscription upgraded', user: 'siti_nurhaliza@yahoo.com', time: '1 hour ago', type: 'upgrade' },
    ]

    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
                    <p className="text-slate-400 mt-1">Welcome back, <span className="text-cyan-400">Super Admin</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 border border-emerald-500/20 glow-pulse">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        System Healthy
                    </div>
                    <div className="text-xs text-slate-500">
                        Last sync: <span className="text-slate-400">Just now</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`stat-card glass-card animate-fade-in stagger-${i + 1}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                            <div className="text-3xl font-bold text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Chart Section */}
                <div className="lg:col-span-4 glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
                            <p className="text-sm text-slate-400">Monthly Recurring Revenue (MRR)</p>
                        </div>
                        <select className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50">
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Last year</option>
                        </select>
                    </div>

                    {/* Simple Bar Chart Visualization */}
                    <div className="h-[280px] flex items-end justify-between gap-2 px-4">
                        {[65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 70, 88].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-500 hover:from-cyan-500 hover:to-cyan-300"
                                    style={{ height: `${value * 2.5}px` }}
                                ></div>
                                <span className="text-[10px] text-slate-500">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span className="text-xs text-slate-400">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-xs text-slate-400">Target</span>
                            </div>
                        </div>
                        <span className="text-xs text-slate-500">Updated real-time</span>
                    </div>
                </div>

                {/* Compliance Watch */}
                <div className="lg:col-span-3 glass-card rounded-xl p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Compliance Watch</h3>
                        <span className="badge badge-success">All Clear</span>
                    </div>
                    <div className="space-y-3">
                        {complianceItems.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                        <item.icon className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{item.check}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-emerald-400 block">{item.status}</span>
                                    <span className="text-[10px] text-slate-500">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors text-sm font-medium">
                        View Full Report <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-xl p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">View all</button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {recentActivity.map((activity, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                        >
                            <div className={`p-2 rounded-lg ${activity.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                                    activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                                        activity.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-purple-500/10 text-purple-400'
                                }`}>
                                {activity.type === 'user' && <Users className="h-4 w-4" />}
                                {activity.type === 'payment' && <Wallet className="h-4 w-4" />}
                                {activity.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                                {activity.type === 'upgrade' && <TrendingUp className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                                <p className="text-xs text-slate-400 truncate">{activity.user}</p>
                                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" /> {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
