import { UserTable } from '@/components/admin/UserTable'

export default function UsersPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage users, subscriptions, and roles.</p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 dark:bg-emerald-600 dark:text-slate-50 dark:hover:bg-emerald-600/90">
                    Add User
                </button>
            </div>

            <UserTable />
        </div>
    )
}
