import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { motion } from 'framer-motion';
import { Users, CreditCard, Ticket, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  proUsers: number;
  monthlyRevenue: number;
  pendingTickets: number;
}

const LiveAnalytics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpiData = [
    { 
      label: 'Total Ummah', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-raudhah-teal', 
      bg: 'bg-raudhah-teal/10',
      trend: '+12% vs last month'
    },
    { 
      label: 'Pro Subscribers', 
      value: stats?.proUsers || 0, 
      icon: TrendingUp, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10',
      trend: '+5% vs last week'
    },
    { 
      label: 'Revenue (MRR)', 
      value: `RM ${stats?.monthlyRevenue.toLocaleString() || 0}`, 
      icon: CreditCard, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10',
      trend: '+RM 1,200 today'
    },
    { 
      label: 'Open Tickets', 
      value: stats?.pendingTickets || 0, 
      icon: Ticket, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10',
      trend: '3 critical alerts'
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-raudhah-teal/20 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-slate-400 text-sm font-medium mb-1">{kpi.label}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{kpi.value}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {kpi.trend.split(' ')[0]}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest">
              {kpi.trend.split(' ').slice(1).join(' ')}
            </p>

            {/* Subtle Pulse Decoration */}
            <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-gradient-to-br from-raudhah-teal/10 to-transparent blur-2xl group-hover:bg-raudhah-teal/10 transition-all"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Mission Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-raudhah-teal" />
              Pulse Activity Stream
            </h3>
            <span className="text-[10px] text-raudhah-teal animate-pulse font-mono font-black">● LIVE</span>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-raudhah-teal shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-bold text-raudhah-teal">User @ahmad</span> just completed Iqra 1 Page 5
                  </p>
                  <p className="text-[10px] text-slate-500">2 minutes ago • Selangor, MY</p>
                </div>
                <div className="text-[10px] font-mono text-slate-600">EVT-9923</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status / Quick Actions */}
        <div className="space-y-8">
          <div className="rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6">
            <h3 className="text-white font-bold mb-4">Service Status</h3>
            <div className="space-y-4">
              {[
                { name: 'Gemini AI API', status: 'Healthy', color: 'text-emerald-400' },
                { name: 'Supabase DB', status: 'Healthy', color: 'text-emerald-400' },
                { name: 'WhatsApp Bot', status: 'Operational', color: 'text-emerald-400' },
                { name: 'Edge Functions', status: 'Healthy', color: 'text-emerald-400' },
                { name: 'JAKIM API Relay', status: 'Latent', color: 'text-amber-400' },
              ].map((svc) => (
                <div key={svc.name} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{svc.name}</span>
                  <span className={`text-[10px] font-bold uppercase ${svc.color}`}>{svc.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-teal-600/20 to-emerald-700/20 border border-raudhah-teal/20 p-6 relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-white font-bold mb-2">Broadcast Alert</h3>
                <p className="text-xs text-slate-300 mb-4">Send an emergency message to all active users across Malaysia.</p>
                <button className="w-full py-2 bg-raudhah-teal text-white rounded-lg text-xs font-bold hover:bg-raudhah-teal transition-colors shadow-lg shadow-teal-500/20">
                  Compose Alert
                </button>
             </div>
             <i className="fa-solid fa-bullhorn absolute -bottom-4 -right-4 text-6xl text-raudhah-teal/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAnalytics;