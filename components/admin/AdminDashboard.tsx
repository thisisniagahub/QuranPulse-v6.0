import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { whatsappService } from '../../services/whatsappService';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'WHATSAPP' | 'SETTINGS'>('OVERVIEW');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  // Load initial data
  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'USERS') {
      loadUsers();
    }
  }, [activeTab, userSearch]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Failed to load admin stats', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers(1, 50, userSearch);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };

  // --- RENDERERS ---

  const renderSidebar = () => (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 text-cyan-400">
        <i className="fa-solid fa-shield-halved text-xl"></i>
        <span className="font-bold text-lg tracking-tight">ADMIN PANEL</span>
      </div>
      
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button 
          onClick={() => setActiveTab('OVERVIEW')} 
          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'OVERVIEW' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <i className="fa-solid fa-chart-pie w-5 text-center"></i> Overview
        </button>
        
        <button 
          onClick={() => setActiveTab('USERS')} 
          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'USERS' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <i className="fa-solid fa-users w-5 text-center"></i> Users
        </button>

        <button 
          onClick={() => setActiveTab('WHATSAPP')} 
          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'WHATSAPP' ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <i className="fa-brands fa-whatsapp w-5 text-center"></i> WhatsApp
        </button>

        <button 
          onClick={() => setActiveTab('SETTINGS')} 
          className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'SETTINGS' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        >
          <i className="fa-solid fa-gears w-5 text-center"></i> Settings
        </button>
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold text-xs">A</div>
          <div>
            <p className="text-white text-xs font-bold">Admin User</p>
            <p className="text-slate-500 text-[10px]">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: stats?.totalUsers || 0, icon: 'fa-users', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'PRO Subscribers', val: stats?.proUsers || 0, icon: 'fa-crown', color: 'text-gold-400', bg: 'bg-yellow-500/10' },
          { label: 'Monthly Revenue', val: `RM ${stats?.monthlyRevenue || 0}`, icon: 'fa-wallet', color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Pending Tickets', val: stats?.pendingTickets || 0, icon: 'fa-ticket', color: 'text-red-400', bg: 'bg-red-500/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-bold mb-4">User Growth (Last 7 Days)</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[30, 45, 55, 60, 75, 80, 95].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div 
                  className="w-full bg-cyan-600/50 hover:bg-cyan-500 rounded-t-lg transition-all relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 10}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-bold mb-4">Revenue Trend</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[20, 35, 45, 30, 55, 65, 85].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div 
                  className="w-full bg-green-600/50 hover:bg-green-500 rounded-t-lg transition-all relative"
                  // eslint-disable-next-line
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    RM {h * 50}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white text-sm focus:border-cyan-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role || 'USER'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/30 text-green-400">
                      ACTIVE
                    </span>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold mr-3">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-xs font-bold">Ban</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWhatsApp = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">WhatsApp Integration</h2>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          API Connected
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <i className="fa-solid fa-paper-plane text-green-400"></i> Send Broadcast
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Target Audience</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-700 focus:border-green-500 focus:bg-green-900/20 transition-all">All Users</button>
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-700 focus:border-green-500 focus:bg-green-900/20 transition-all">PRO Only</button>
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg border border-slate-700 focus:border-green-500 focus:bg-green-900/20 transition-all">Free Tier</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Message Content</label>
                <textarea 
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm focus:border-green-500 outline-none resize-none"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2">
                  Send Broadcast <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-white font-bold mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {['Welcome Message', 'Subscription Reminder', 'Ramadan Greeting', 'Payment Confirmation'].map((t, i) => (
                <button key={i} className="w-full text-left p-3 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors group">
                  <p className="text-slate-300 text-sm font-bold group-hover:text-white">{t}</p>
                  <p className="text-slate-600 text-[10px] uppercase mt-1">Click to use</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
      
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
        <div>
          <h3 className="text-white font-bold mb-2">General Configuration</h3>
          <p className="text-slate-500 text-sm mb-4">Manage global application settings.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="text-white font-bold text-sm">Maintenance Mode</p>
                <p className="text-slate-500 text-xs">Disable access for non-admin users</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-slate-500 rounded-full absolute top-1 left-1 transition-all"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <p className="text-white font-bold text-sm">Allow New Registrations</p>
                <p className="text-slate-500 text-xs">Toggle user sign-up functionality</p>
              </div>
              <div className="w-12 h-6 bg-green-900/50 rounded-full relative cursor-pointer border border-green-500/30">
                <div className="w-4 h-4 bg-green-500 rounded-full absolute top-1 right-1 transition-all"></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-2">API Configuration</h3>
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-bold uppercase">WhatsApp API Key</label>
              <input type="password" value="************************" disabled className="w-full bg-slate-950 p-3 rounded-lg text-slate-500 border border-slate-800" aria-label="WhatsApp API Key" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-bold uppercase">Gemini AI Key</label>
              <input type="password" value="************************" disabled className="w-full bg-slate-950 p-3 rounded-lg text-slate-500 border border-slate-800" aria-label="Gemini AI Key" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      {renderSidebar()}
      
      <main className="pl-64">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-white">{activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}</h1>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors" aria-label="Notifications">
              <i className="fa-solid fa-bell"></i>
            </button>
            <button className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-lg transition-all">
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'OVERVIEW' && renderOverview()}
              {activeTab === 'WHATSAPP' && renderWhatsApp()}
              {activeTab === 'USERS' && renderUsers()}
              {activeTab === 'SETTINGS' && renderSettings()}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
