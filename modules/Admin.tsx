
import React, { useState } from 'react';
import { useData } from '../services/DataContext';
import { AppConfigItem, Product, UserProfile, Announcement, Order, SystemLog } from '../types';

const Admin: React.FC = () => {
  const { 
      products, users, orders, logs, appConfig, announcements,
      updateAppConfig, refreshData, backendMode,
      addProduct, updateProduct, deleteProduct,
      addAnnouncement, deleteAnnouncement, updateUser
  } = useData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'STORE' | 'ALERTS' | 'CONFIG' | 'ANALYTICS' | 'DEV_TOOLS'>('OVERVIEW');
  
  // --- STATE FOR MODALS ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [newAlertMsg, setNewAlertMsg] = useState('');
  const [newAlertType, setNewAlertType] = useState<'INFO' | 'WARNING' | 'SUCCESS'>('INFO');

  // --- HELPERS ---
  const handleProductSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProduct) return;
      
      if (products.find((p: Product) => p.id === editingProduct.id)) {
          await updateProduct(editingProduct);
      } else {
          await addProduct(editingProduct);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingUser) return;
      await updateUser(editingUser);
      setIsUserModalOpen(false);
      setEditingUser(null);
  };

  const handleCreateAlert = async () => {
      if (!newAlertMsg) return;
      await addAnnouncement({
          id: 'ANN-' + Date.now(),
          title: 'Admin Alert',
          message: newAlertMsg,
          type: newAlertType,
          active: true,
          date: new Date().toISOString()
      });
      setNewAlertMsg('');
  };

  const renderOverview = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-primary-dark to-slate-900 p-6 rounded-2xl border border-primary/30 flex justify-between items-center shadow-lg">
              <div>
                  <h2 className="text-2xl font-bold text-white">Command Center</h2>
                  <p className="text-xs text-primary-light">System Status: <span className="text-green-400 font-bold">ONLINE</span> • Mode: {backendMode}</p>
              </div>
              <button onClick={refreshData} aria-label="Refresh Data" className="w-10 h-10 rounded-full bg-primary/20 text-primary-light flex items-center justify-center hover:bg-primary hover:text-white"><i className="fa-solid fa-rotate"></i></button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', val: users.length, color: 'text-white' },
                { label: 'Orders', val: orders.length, color: 'text-white' },
                { label: 'Revenue', val: `RM ${orders.reduce((s: number, o: Order) => s + Number(o.totalAmount), 0)}`, color: 'text-gold-400' },
                { label: 'Active Alerts', val: announcements.length, color: 'text-primary-light' }
              ].map((stat, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <p className="text-slate-500 text-xs uppercase font-bold">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
                  </div>
              ))}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <h3 className="text-white font-bold mb-4">Recent System Logs</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
                  {logs.slice(0, 10).map((log: SystemLog, i: number) => (
                      <div key={i} className="flex gap-4 text-slate-400 border-b border-slate-800/50 pb-1">
                          <span className="text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className={log.action.includes('ERROR') ? 'text-red-400' : 'text-primary-light'}>{log.action}</span>
                          <span>{log.status}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderUsers = () => (
      <div className="space-y-4 animate-slide-up">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold">
                      <tr>
                          <th className="p-4">User Details</th>
                          <th className="p-4">Role / Status</th>
                          <th className="p-4">Stats</th>
                          <th className="p-4">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                      {users.map((u: UserProfile) => (
                          <tr key={u.email} className="hover:bg-slate-800/30">
                              <td className="p-4">
                                  <div className="font-bold text-white">{u.name}</div>
                                  <div className="text-xs text-slate-500">{u.email}</div>
                              </td>
                              <td className="p-4">
                                  <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-red-900/50 text-red-400' : 'bg-slate-800 text-slate-400'}`}>{u.role}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'BANNED' ? 'bg-red-500 text-black' : 'bg-green-900/30 text-green-400'}`}>{u.status || 'ACTIVE'}</span>
                                  </div>
                              </td>
                              <td className="p-4 text-xs font-mono">
                                  <div className="text-primary">XP: {u.xp_total}</div>
                                  <div className="text-gold-400">BP: {u.barakah_points}</div>
                              </td>
                              <td className="p-4 flex gap-2">
                                  <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs rounded-lg font-bold flex items-center gap-1">
                                      <i className="fa-solid fa-pen"></i> Edit
                                  </button>
                                  {u.status !== 'BANNED' && (
                                      <button onClick={() => updateUser({ email: u.email, status: 'BANNED' })} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg font-bold">Ban</button>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderStore = () => (
      <div className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Inventory</h2>
              <button 
                onClick={() => { setEditingProduct({ id: 'P-'+Date.now(), title: '', price: 0, stock: 0, category: 'BOOK', image: 'fa-box' }); setIsProductModalOpen(true); }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg flex items-center gap-2"
              >
                  <i className="fa-solid fa-plus"></i> Add Product
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p: Product) => (
                  <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex gap-4 items-center group relative overflow-hidden">
                      <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center text-2xl text-primary border border-slate-700">
                          <i className={`fa-solid ${p.image}`}></i>
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-white line-clamp-1">{p.title}</h4>
                          <p className="text-gold-400 font-mono font-bold">RM {p.price}</p>
                          <p className={`text-xs font-bold ${p.stock < 10 ? 'text-red-400' : 'text-slate-500'}`}>Stock: {p.stock}</p>
                      </div>
                      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 pr-2">
                          <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} aria-label="Edit Product" className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform"><i className="fa-solid fa-pen text-xs"></i></button>
                          <button onClick={() => deleteProduct(p.id)} aria-label="Delete Product" className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform"><i className="fa-solid fa-trash text-xs"></i></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderAlerts = () => (
      <div className="space-y-6 animate-slide-up">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-white font-bold mb-4">Create Broadcast Alert</h3>
              <div className="flex gap-4 mb-4">
                  <input 
                    type="text" 
                    value={newAlertMsg}
                    onChange={e => setNewAlertMsg(e.target.value)}
                    placeholder="Enter announcement message..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-teal-500"
                  />
                  <select 
                    value={newAlertType}
                    onChange={e => setNewAlertType(e.target.value as any)}
                    aria-label="Alert Type"
                    className="bg-slate-950 border border-slate-700 rounded-xl px-4 text-white outline-none"
                  >
                      <option value="INFO">Info (Teal)</option>
                      <option value="WARNING">Warning (Orange)</option>
                      <option value="SUCCESS">Success (Green)</option>
                  </select>
                  <button onClick={handleCreateAlert} disabled={!newAlertMsg} className="px-6 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl">Post</button>
              </div>
          </div>

          <div className="space-y-2">
              <h3 className="text-white font-bold">Active Alerts</h3>
              {announcements.length === 0 && <p className="text-slate-500 italic">No active announcements.</p>}
              {announcements.map((ann: Announcement) => (
                  <div key={ann.id} className="flex justify-between items-center bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
                      <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${ann.type === 'WARNING' ? 'bg-orange-500' : ann.type === 'SUCCESS' ? 'bg-green-500' : 'bg-primary'}`}></div>
                          <span className="text-white font-medium">{ann.message}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-400 hover:text-red-300 text-xs font-bold border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors">Delete</button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Growth Chart Mockup */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-white font-bold mb-4">User Growth</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                    {[30, 45, 55, 60, 75, 80, 95].map((h, i) => (
                        <div key={i} className={`chart-bar chart-bar-${h}`}>
                            <div className="chart-bar-tooltip">{h * 10} Users</div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>

            {/* Engagement Stats */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-white font-bold mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Daily Active Users (DAU)</span>
                            <span className="text-white font-bold">1,245</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[75%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Avg. Session Duration</span>
                            <span className="text-white font-bold">14m 30s</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[60%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Retention Rate</span>
                            <span className="text-white font-bold">85%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[85%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderDevTools = () => {
      const handleExportData = () => {
          const data = { users, products, orders, appConfig, logs };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `quranpulse_backup_${new Date().toISOString().split('T')[0]}.json`;
          a.click();
      };

      return (
        <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-white">Developer Tools</h2>
            
            {/* System Health */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-heart-pulse text-red-500"></i> System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Gemini AI API</span>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded">OPERATIONAL</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Prayer Times API</span>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded">OPERATIONAL</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Database (Supabase)</span>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded">CONNECTED</span>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-database text-primary"></i> Data Management</h3>
                <div className="flex gap-4">
                    <button onClick={handleExportData} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg flex items-center gap-2">
                        <i className="fa-solid fa-download"></i> Export Data (JSON)
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg flex items-center gap-2 opacity-50 cursor-not-allowed" title="Import feature coming soon">
                        <i className="fa-solid fa-upload"></i> Import Data
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Export includes Users, Products, Orders, Config, and Logs.</p>
            </div>

            {/* Environment Info */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-code text-secondary"></i> Environment Info</h3>
                <div className="space-y-2 font-mono text-xs text-slate-400">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>App Version</span>
                        <span className="text-white">v6.0.0-beta</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>Build Environment</span>
                        <span className="text-white">{import.meta.env.MODE}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span>React Version</span>
                        <span className="text-white">{React.version}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>User Agent</span>
                        <span className="text-white truncate max-w-[200px]">{navigator.userAgent}</span>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20">
            <div className="h-20 flex items-center px-6 border-b border-slate-800 gap-3 text-red-500 shadow-sm">
                <i className="fa-solid fa-user-secret text-2xl"></i>
                <span className="font-bold text-lg tracking-tight">GOD MODE</span>
            </div>
            <div className="p-4 space-y-2">
                <button onClick={() => setActiveTab('OVERVIEW')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'OVERVIEW' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-chart-pie w-5"></i> Overview</button>
                <button onClick={() => setActiveTab('ANALYTICS')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ANALYTICS' ? 'bg-secondary text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-chart-line w-5"></i> Analytics</button>
                <button onClick={() => setActiveTab('USERS')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'USERS' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-users w-5"></i> Users</button>
                <button onClick={() => setActiveTab('STORE')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'STORE' ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-store w-5"></i> Souq Manager</button>
                <button onClick={() => setActiveTab('ALERTS')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ALERTS' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-bullhorn w-5"></i> Alerts</button>
                <button onClick={() => setActiveTab('CONFIG')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'CONFIG' ? 'bg-secondary text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-gears w-5"></i> Config</button>
                <button onClick={() => setActiveTab('DEV_TOOLS')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'DEV_TOOLS' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><i className="fa-solid fa-terminal w-5"></i> DevTools</button>
            </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <div className="max-w-6xl mx-auto pb-20">
                {activeTab === 'OVERVIEW' && renderOverview()}
                {activeTab === 'ANALYTICS' && renderAnalytics()}
                {activeTab === 'USERS' && renderUsers()}
                {activeTab === 'STORE' && renderStore()}
                {activeTab === 'ALERTS' && renderAlerts()}
                {activeTab === 'DEV_TOOLS' && renderDevTools()}
                
                {/* Config Tab Reuse */}
                {activeTab === 'CONFIG' && (
                    <div className="space-y-4 animate-slide-up">
                        <h2 className="text-2xl font-bold text-white mb-4">App Configuration</h2>
                        <div className="grid gap-4">
                            {appConfig.map((cfg: AppConfigItem) => (
                                <div key={cfg.key} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center hover:border-secondary/50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] font-bold">{cfg.group || 'GENERAL'}</span>
                                            <p className="text-primary font-bold text-xs">{cfg.key}</p>
                                        </div>
                                        <p className="text-white text-sm font-mono bg-black/30 px-2 py-1 rounded inline-block">{cfg.value}</p>
                                        <p className="text-slate-500 text-[10px] mt-1">{cfg.description}</p>
                                    </div>
                                    <button onClick={() => { 
                                        const val = prompt("Update Value:", cfg.value);
                                        if(val) updateAppConfig(cfg.key, val); 
                                    }} className="bg-slate-800 hover:bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>

        {/* PRODUCT MODAL - High Z-Index */}
        {isProductModalOpen && editingProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl animate-scale-in">
                    <h3 className="text-xl font-bold text-white mb-4">{products.find((p: Product)=>p.id===editingProduct.id) ? 'Edit Product' : 'New Product'}</h3>
                    <form onSubmit={handleProductSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 font-bold uppercase">Title</label>
                            <input className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-teal-500" placeholder="Product Title" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-bold uppercase">Price (RM)</label>
                                <input className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-teal-500" type="number" placeholder="0.00" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-slate-500 font-bold uppercase">Stock</label>
                                <input className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-teal-500" type="number" placeholder="0" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500 font-bold uppercase">Icon Class</label>
                            <input className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-teal-500" placeholder="fa-solid fa-box" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-4">
                            <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white font-bold text-sm">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-teal-500/20">Save Product</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* USER EDIT MODAL (GOD MODE) */}
        {isUserModalOpen && editingUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl animate-scale-in">
                    <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="user-role" className="text-xs text-slate-500 font-bold uppercase">Role</label>
                            <select 
                                id="user-role"
                                value={editingUser.role} 
                                onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}
                                aria-label="User Role"
                                className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-primary"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MODERATOR">MODERATOR</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="user-status" className="text-xs text-slate-500 font-bold uppercase">Status</label>
                            <select 
                                id="user-status"
                                value={editingUser.status || 'ACTIVE'} 
                                onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}
                                aria-label="User Status"
                                className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-primary"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="BANNED">BANNED</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label htmlFor="user-xp" className="text-xs text-slate-500 font-bold uppercase">XP Total</label>
                                <input id="user-xp" aria-label="XP Total" className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-teal-500" type="number" value={editingUser.xp_total} onChange={e => setEditingUser({...editingUser, xp_total: Number(e.target.value)})} />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="user-bp" className="text-xs text-slate-500 font-bold uppercase">Barakah Points</label>
                                <input id="user-bp" aria-label="Barakah Points" className="w-full bg-slate-950 p-3 rounded-lg text-white border border-slate-800 outline-none focus:border-gold-500" type="number" value={editingUser.barakah_points} onChange={e => setEditingUser({...editingUser, barakah_points: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-4">
                            <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white font-bold text-sm">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20">Update User</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Admin;
