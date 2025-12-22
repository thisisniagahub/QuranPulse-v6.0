import { supabase } from '../../lib/supabase';
import { Package, ShoppingCart, Users, Activity } from 'lucide-react';

// Card Component
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  // Fetch stats (Parallel)
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={productsCount || 0}
          icon={Package}
          color="bg-blue-500 shadow-lg shadow-blue-500/20"
        />
        <StatCard
          title="Total Orders"
          value={ordersCount || 0}
          icon={ShoppingCart}
          color="bg-purple-500 shadow-lg shadow-purple-500/20"
        />
        <StatCard
          title="Total Users"
          value={usersCount || 0}
          icon={Users}
          color="bg-emerald-500 shadow-lg shadow-emerald-500/20"
        />
        <StatCard
          title="System Health"
          value="98%"
          icon={Activity}
          color="bg-orange-500 shadow-lg shadow-orange-500/20"
        />
      </div>

      {/* Recent Activity Section could go here */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
        <h3 className="text-lg font-bold mb-4">Recent System Logs</h3>
        <div className="flex items-center justify-center h-64 text-slate-400">
          Chart or Table Placeholder
        </div>
      </div>
    </div>
  );
}
