import { UserTable } from '@/components/admin/UserTable'
import { UserPlus, Download, Upload } from 'lucide-react'

export default function UsersPage() {
    return (
        <div className="p-8 space-y-8 text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">User Management</h2>
                    <p className="text-slate-400 mt-1">Manage users, subscriptions, and roles across the platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-ghost flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
                {[
                    { label: 'Total Users', value: '12,345', change: '+234 this week', positive: true },
                    { label: 'Active Now', value: '1,023', change: 'Real-time', positive: true },
                    { label: 'Pro Subscribers', value: '2,150', change: '+12% MoM', positive: true },
                    { label: 'Churned', value: '45', change: '-8% from last month', positive: true },
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                        <p className="text-sm text-slate-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        <p className={`text-xs mt-1 ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* User Table */}
            <UserTable />
        </div>
    )
}
