
import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../services/DataContext';
import { AppConfigItem, Product, UserProfile, Announcement, CartItem, ChatMessage, Order } from '../types';
import { askAdminAssistant, generateAnnouncementDraft, generateContentFromIdea } from '../services/geminiService';
import { WhatsAppBridge, WAStatus } from '../services/whatsappBridge';

// --- THEME CONSTANTS ---
const THEME = {
  bg: "bg-[#0B0C15]", // Deep dark background
  panel: "bg-[#151621]/80 backdrop-blur-xl border border-white/5 shadow-2xl", // Glass panel
  accent: "text-cyan-400",
  border: "border-white/10",
  textMain: "text-slate-200",
  textDim: "text-slate-500"
};

const Admin: React.FC = () => {
  const { 
      products, users, orders, logs, appConfig, announcements,
      updateAppConfig, refreshData, backendMode,
      addProduct, updateProduct, deleteProduct,
      addAnnouncement, deleteAnnouncement, updateUser,
      updateOrderStatus
  } = useData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USERS' | 'ORDERS' | 'STORE' | 'ALERTS' | 'CONFIG' | 'TOOLS' | 'COMMS' | 'PLUGINS'>('OVERVIEW');
  
  // --- STATE FOR MODALS ---
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [newAlertMsg, setNewAlertMsg] = useState('');
  const [newAlertType, setNewAlertType] = useState<'INFO' | 'WARNING' | 'SUCCESS'>('INFO');
  const [isGeneratingAlert, setIsGeneratingAlert] = useState(false);

  // --- AI ASSISTANT STATE ---
  const [showAi, setShowAi] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiScrollRef = useRef<HTMLDivElement>(null);

  // --- TOOLS STATE ---
  const [toolContentTopic, setToolContentTopic] = useState('');
  const [toolContentType, setToolContentType] = useState<'KHUTBAH' | 'QUIZ' | 'MARKETING'>('MARKETING');
  const [toolContentResult, setToolContentResult] = useState('');
  const [isToolGenerating, setIsToolGenerating] = useState(false);
  const [healthStats, setHealthStats] = useState({ cpu: 12, ram: 45, latency: 200, network: 86 });

  // --- WHATSAPP BOT STATE ---
  const [waStatus, setWaStatus] = useState<WAStatus>('OFFLINE');
  const [waQr, setWaQr] = useState('');
  const [waLogs, setWaLogs] = useState<string[]>([]);
  const [waBroadcastMsg, setWaBroadcastMsg] = useState('');
  const waLogRef = useRef<HTMLDivElement>(null);

  // --- PLUGINS STATE ---
  const [activePlugin, setActivePlugin] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState([
      { id: 'f1', name: 'backup_v6_full.json', size: '2.4 MB', type: 'JSON', date: '2025-03-10' },
      { id: 'f2', name: 'logo_assets.zip', size: '15.0 MB', type: 'ZIP', date: '2025-02-28' },
      { id: 'f3', name: 'users_export.csv', size: '450 KB', type: 'CSV', date: '2025-03-09' }
  ]);
  const [driveStorage, setDriveStorage] = useState(17.85); // GB

  // --- OVERVIEW INSIGHTS ---
  const [aiInsight, setAiInsight] = useState<string>('');
  
  // --- DASHBOARD SIMULATION (VISUALS) ---
  const [chartData, setChartData] = useState<number[]>(new Array(20).fill(50));
  const [systemTime, setSystemTime] = useState(new Date());

  useEffect(() => {
      if (aiScrollRef.current) aiScrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
      if (waLogRef.current) waLogRef.current.scrollTop = waLogRef.current.scrollHeight;
  }, [waLogs]);

  // Init WhatsApp Bridge Listener
  useEffect(() => {
      WhatsAppBridge.init({
          onStatusChange: (s) => setWaStatus(s),
          onQR: (url) => setWaQr(url),
          onLog: (l) => setWaLogs(prev => [...prev, l])
      });
  }, []);

  // Simulate Health Monitor Data Updates & Clock
  useEffect(() => {
      const interval = setInterval(() => {
          setSystemTime(new Date());
          
          // Simulate live metrics
          setHealthStats({
              cpu: Math.floor(Math.random() * 20) + 40,
              ram: Math.floor(Math.random() * 10) + 70,
              latency: Math.floor(Math.random() * 50) + 20,
              network: Math.floor(Math.random() * 15) + 80
          });

          // Update chart data
          setChartData(prev => {
              const newData = [...prev.slice(1), Math.floor(Math.random() * 40) + 30];
              return newData;
          });
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      // Generate initial insight on load
      if (users.length > 0 && orders.length > 0 && !aiInsight) {
          const summary = {
              total_revenue: orders.reduce((acc, o) => acc + Number(o.totalAmount), 0),
              active_users: users.filter(u => u.status === 'ACTIVE').length
          };
          askAdminAssistant(summary, "Provide a 1-sentence executive summary of the app performance.").then(res => setAiInsight(res));
      }
  }, [users, orders]);

  const handleAiSend = async () => {
      if (!aiInput.trim()) return;
      const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: aiInput, timestamp: Date.now() };
      setAiMessages(prev => [...prev, userMsg]);
      setAiInput('');
      setIsAiThinking(true);

      const summary = {
          users_count: users.length,
          orders_today: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
          total_revenue: orders.reduce((acc, o) => acc + Number(o.totalAmount), 0),
          low_stock_products: products.filter(p => p.stock < 5).map(p => p.title),
          recent_logs: logs.slice(0, 5).map(l => `${l.action}: ${l.status}`),
          app_mode: appConfig.find(c => c.key === 'maintenance_mode')?.value === 'true' ? 'MAINTENANCE' : 'LIVE'
      };

      const reply = await askAdminAssistant(summary, userMsg.content);
      
      const aiMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'assistant', content: reply, timestamp: Date.now() };
      setAiMessages(prev => [...prev, aiMsg]);
      setIsAiThinking(false);
  };

  const handleGenerateAlert = async () => {
      if (!newAlertMsg.trim()) return;
      setIsGeneratingAlert(true);
      const drafted = await generateAnnouncementDraft(newAlertMsg);
      setNewAlertMsg(drafted);
      setIsGeneratingAlert(false);
  }

  const handleToolGenerate = async () => {
      if(!toolContentTopic) return;
      setIsToolGenerating(true);
      const res = await generateContentFromIdea(toolContentType, toolContentTopic);
      setToolContentResult(res);
      setIsToolGenerating(false);
  };

  const handleWABroadcast = () => {
      if(!waBroadcastMsg) return;
      WhatsAppBridge.log(`>> BROADCAST INITIATED: "${waBroadcastMsg}"`);
      WhatsAppBridge.log(`>> Target: ${users.length} Users`);
      WhatsAppBridge.log(`>> Sending...`);
      setWaBroadcastMsg('');
  };

  // --- PLUGIN LOGIC ---
  const handleDriveUpload = () => {
      const newFile = {
          id: 'f' + Date.now(),
          name: 'manual_backup_' + new Date().toISOString().split('T')[0] + '.json',
          size: '1.2 MB',
          type: 'JSON',
          date: new Date().toISOString().split('T')[0]
      };
      setDriveFiles(prev => [newFile, ...prev]);
      alert("File uploaded to Google Drive successfully!");
  };

  const handleDriveDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this file from Drive?")) {
          setDriveFiles(prev => prev.filter(f => f.id !== id));
      }
  };

  // --- HELPERS ---
  const handleProductSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProduct) return;
      
      if (products.find(p => p.id === editingProduct.id)) {
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

  // --- UI COMPONENTS ---
  const MetricCard = ({ label, value, subtext, icon, color }: any) => (
      <div className={`${THEME.panel} p-4 rounded-xl relative overflow-hidden group`}>
          <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
              <i className={`fa-solid ${icon} text-4xl text-white`}></i>
          </div>
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{label}</p>
          <div className="flex items-end gap-2">
              <span className={`text-2xl font-bold ${color} font-mono`}>{value}</span>
              <span className="text-[10px] text-slate-400 mb-1">{subtext}</span>
          </div>
          {/* Decorative bar */}
          <div className="w-full h-1 bg-slate-800 mt-3 rounded-full overflow-hidden">
             <div className={`h-full bg-current ${color.replace('text-', 'bg-')} opacity-50 w-2/3`}></div>
          </div>
      </div>
  );

  const renderOverview = () => (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* --- TOP ROW: SYSTEM OVERVIEW --- */}
          <div className="lg:col-span-8 space-y-6">
              
              {/* HEADER / LIVE GRAPH */}
              <div className={`${THEME.panel} p-6 rounded-2xl`}>
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                              <i className="fa-solid fa-wave-square text-cyan-400"></i> System Overview
                          </h2>
                          <p className="text-xs text-slate-500">Live Backend Metrics • Mode: {backendMode}</p>
                      </div>
                      <div className="flex gap-2">
                          <span className="px-2 py-1 bg-cyan-900/30 text-cyan-400 text-[10px] font-bold rounded border border-cyan-500/30 animate-pulse">● LIVE</span>
                          <button onClick={refreshData} className="text-slate-400 hover:text-white"><i className="fa-solid fa-rotate"></i></button>
                      </div>
                  </div>

                  {/* CARDS */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-[#0f1019] p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-400">CPU Usage</span>
                              <i className="fa-solid fa-microchip text-cyan-500/50"></i>
                          </div>
                          <p className="text-2xl font-bold text-white font-mono">{healthStats.cpu}%</p>
                          <p className="text-[10px] text-slate-500">3.8 GHz | 12 Cores</p>
                      </div>
                      <div className="bg-[#0f1019] p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-400">Memory</span>
                              <i className="fa-solid fa-memory text-purple-500/50"></i>
                          </div>
                          <p className="text-2xl font-bold text-white font-mono">{healthStats.ram}%</p>
                          <p className="text-[10px] text-slate-500">16.4 GB / 24 GB</p>
                      </div>
                      <div className="bg-[#0f1019] p-4 rounded-xl border border-white/5">
                          <div className="flex justify-between mb-2">
                              <span className="text-xs text-slate-400">Network</span>
                              <i className="fa-solid fa-wifi text-emerald-500/50"></i>
                          </div>
                          <p className="text-2xl font-bold text-white font-mono">{healthStats.network}%</p>
                          <p className="text-[10px] text-slate-500">1.2 GB/s | {healthStats.latency}ms</p>
                      </div>
                  </div>

                  {/* FAKE GRAPH VISUALIZER */}
                  <div className="h-40 flex items-end justify-between gap-1 mt-4 border-t border-white/5 pt-4">
                      {chartData.map((val, i) => (
                          <div 
                            key={i} 
                            className="w-full bg-cyan-500/20 rounded-t-sm transition-all duration-300 relative group"
                            style={{ height: `${val}%` }}
                          >
                             <div className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* SECURITY & ALERTS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Security Status Panel */}
                  <div className={`${THEME.panel} p-6 rounded-2xl`}>
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-shield-halved text-emerald-400"></i> Security Status
                      </h3>
                      <div className="space-y-4">
                          {[
                              { label: "Firewall", status: "Active", color: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-500/10" },
                              { label: "Intrusion Detection", status: "Active", color: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-500/10" },
                              { label: "Encryption", status: "Active", color: "text-emerald-400", border: "border-emerald-500/30 bg-emerald-500/10" },
                              { label: "Threat Database", status: "Updated 12 min ago", color: "text-blue-400", border: "" }
                          ].map((item, i) => (
                              <div key={i} className="flex justify-between items-center py-1">
                                  <span className="text-slate-400 text-sm">{item.label}</span>
                                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.border || ''} ${item.color}`}>
                                      {item.status}
                                  </span>
                              </div>
                          ))}
                          <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex justify-between text-xs mb-1">
                                  <span className="text-white font-bold">Security Level</span>
                                  <span className="text-cyan-400">75%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[75%]"></div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* System Alerts (Logs) Panel */}
                  <div className={`${THEME.panel} p-6 rounded-2xl`}>
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                          <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i> System Alerts
                      </h3>
                      <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                          {logs.length > 0 ? logs.slice(0, 6).map((log, i) => (
                              <div key={i} className="flex gap-3 items-start border-l-2 border-slate-700 pl-3 py-1">
                                  <i className={`fa-solid mt-1 text-[10px] ${
                                      log.action.includes('ERROR') ? 'fa-xmark text-red-500' : 'fa-info text-blue-500'
                                  }`}></i>
                                  <div>
                                      <p className="text-xs font-bold text-slate-200">{log.action}</p>
                                      <p className="text-[10px] text-slate-500">{log.status} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                                  </div>
                              </div>
                          )) : (
                              <div className="text-slate-500 text-xs italic">System nominal. No active alerts.</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* --- RIGHT COLUMN: QUICK STATS & ACTIONS --- */}
          <div className="lg:col-span-4 space-y-6">
               
               {/* CLOCK / TIME */}
               <div className={`${THEME.panel} p-8 rounded-2xl text-center`}>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-2">System Time</p>
                    <h1 className="text-4xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                    </h1>
                    <p className="text-xs text-slate-400 mt-2">{systemTime.toDateString()}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                            <p className="text-[10px] text-slate-500">Uptime</p>
                            <p className="text-xs text-white font-mono">14d 06:42:18</p>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-white/5">
                            <p className="text-[10px] text-slate-500">Time Zone</p>
                            <p className="text-xs text-white font-mono">UTC+08:00</p>
                        </div>
                    </div>
               </div>

               {/* QUICK ACTIONS GRID */}
               <div className={`${THEME.panel} p-6 rounded-2xl`}>
                    <h3 className="text-white font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => {/* Scan Logic */}} className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all group text-center">
                             <i className="fa-solid fa-shield text-cyan-500 text-xl mb-2 group-hover:scale-110 transition-transform"></i>
                             <p className="text-xs font-bold text-white">Security Scan</p>
                         </button>
                         <button onClick={refreshData} className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all group text-center">
                             <i className="fa-solid fa-rotate text-cyan-500 text-xl mb-2 group-hover:spin transition-transform"></i>
                             <p className="text-xs font-bold text-white">Sync Data</p>
                         </button>
                         <button onClick={() => setActivePlugin('DRIVE')} className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all group text-center">
                             <i className="fa-solid fa-download text-white text-xl mb-2"></i>
                             <p className="text-xs font-bold text-white">Backup</p>
                         </button>
                         <button onClick={() => setShowAi(true)} className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all group text-center">
                             <i className="fa-solid fa-terminal text-white text-xl mb-2"></i>
                             <p className="text-xs font-bold text-white">Console</p>
                         </button>
                    </div>
               </div>

               {/* RESOURCE ALLOCATION (Real Data) */}
               <div className={`${THEME.panel} p-6 rounded-2xl`}>
                   <h3 className="text-white font-bold mb-4">Resource Allocation</h3>
                   
                   <div className="space-y-4">
                       <div>
                           <div className="flex justify-between text-xs mb-1">
                               <span className="text-slate-400">Processing Power (Revenue)</span>
                               <span className="text-cyan-400 font-mono">RM {orders.reduce((s,o) => s + Number(o.totalAmount), 0)}</span>
                           </div>
                           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 w-[42%]"></div>
                           </div>
                       </div>
                       
                       <div>
                           <div className="flex justify-between text-xs mb-1">
                               <span className="text-slate-400">Memory Allocation (Users)</span>
                               <span className="text-purple-400 font-mono">{users.length} Active</span>
                           </div>
                           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 w-[68%]"></div>
                           </div>
                       </div>

                       <div>
                           <div className="flex justify-between text-xs mb-1">
                               <span className="text-slate-400">Network Bandwidth (Orders)</span>
                               <span className="text-blue-400 font-mono">{orders.length} Trans.</span>
                           </div>
                           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-blue-700 to-indigo-500 w-[35%]"></div>
                           </div>
                       </div>

                       <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Priority Level</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-3 bg-slate-700 rounded-full relative">
                                    <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-xs font-bold text-cyan-400">3/5</span>
                            </div>
                       </div>
                   </div>
               </div>
          </div>
      </div>
  );

  const renderUsers = () => (
      <div className="space-y-4 animate-slide-up">
          <div className={`${THEME.panel} p-6 rounded-2xl`}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management Protocols</h2>
                <div className="text-xs font-mono text-cyan-500 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-500/20">DB_STATUS: ONLINE</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-white/5 text-slate-500 uppercase text-xs font-bold font-mono">
                      <tr>
                          <th className="p-4 rounded-l-lg">Identity</th>
                          <th className="p-4">Access Level</th>
                          <th className="p-4">Telemetry</th>
                          <th className="p-4 rounded-r-lg">Directives</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                          <tr key={u.email} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                  <div className="font-bold text-white font-mono">{u.name}</div>
                                  <div className="text-[10px] text-slate-500 tracking-wider">{u.email}</div>
                              </td>
                              <td className="p-4">
                                  <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>{u.role}</span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${u.status === 'BANNED' ? 'bg-red-500 text-black border-red-600' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>{u.status || 'ACTIVE'}</span>
                                  </div>
                              </td>
                              <td className="p-4 text-xs font-mono">
                                  <div className="text-cyan-400">XP: {u.xp_total}</div>
                                  <div className="text-yellow-500">BP: {u.barakah_points}</div>
                              </td>
                              <td className="p-4 flex gap-2">
                                  <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-cyan-600 hover:text-black text-white rounded transition-colors">
                                      <i className="fa-solid fa-pen text-xs"></i>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
          </div>
      </div>
  );

  const renderStore = () => (
      <div className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Inventory Grid</h2>
              <button 
                onClick={() => { setEditingProduct({ id: 'P-'+Date.now(), title: '', price: 0, stock: 0, category: 'BOOK', image: 'fa-box' }); setIsProductModalOpen(true); }}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              >
                  <i className="fa-solid fa-plus"></i> Add Item
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                  <div key={p.id} className={`${THEME.panel} p-4 rounded-xl flex gap-4 items-center group relative overflow-hidden`}>
                      <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-2xl text-cyan-500 border border-slate-700 shadow-inner">
                          <i className={`fa-solid ${p.image}`}></i>
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-white line-clamp-1 font-mono">{p.title}</h4>
                          <p className="text-yellow-400 font-mono font-bold">RM {p.price}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className={`text-[10px] font-bold ${p.stock < 10 ? 'text-red-400' : 'text-slate-500'}`}>QTY: {p.stock}</p>
                            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, p.stock)}%` }}></div>
                            </div>
                          </div>
                      </div>
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 pr-2">
                          <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="text-cyan-400 hover:text-white"><i className="fa-solid fa-pen text-xs"></i></button>
                          <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-white"><i className="fa-solid fa-trash text-xs"></i></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  // --- REUSED RENDER FUNCTIONS (With Theme Applied via wrapper or classes) ---
  
  return (
    <div className={`flex h-screen w-full ${THEME.bg} text-slate-200 font-sans overflow-hidden relative`}>
        
        {/* Background Ambient Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Sidebar */}
        <aside className="w-64 bg-[#080910] border-r border-white/5 flex flex-col shrink-0 z-20 backdrop-blur-xl relative">
            {/* --- SIDEBAR BACKGROUND PATTERN --- */}
            <div className="absolute inset-0 bg-pattern-main opacity-10 pointer-events-none"></div>

            <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3 relative overflow-hidden group z-10">
                {/* --- ADMIN LOGO IMPLEMENTATION --- */}
                <img 
                    src="/logo.png" 
                    alt="Admin Logo" 
                    className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-300 logo-glow" 
                />
                <div>
                    <span className="font-bold text-white tracking-wide block group-hover:text-cyan-400 transition-colors">NEXUS</span>
                    <span className="text-[9px] text-cyan-500 tracking-[0.2em] font-mono">SYS.ADMIN</span>
                </div>
            </div>
            
            <div className="p-4 space-y-1 relative z-10">
                <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 mt-2">Main Module</p>
                {[
                    { id: 'OVERVIEW', label: 'Dashboard', icon: 'fa-chart-pie' },
                    { id: 'USERS', label: 'Identity', icon: 'fa-users' },
                    { id: 'ORDERS', label: 'Logistics', icon: 'fa-box' },
                    { id: 'STORE', label: 'Inventory', icon: 'fa-database' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)} 
                        className={`w-full text-left px-4 py-3 rounded-lg font-bold text-xs flex items-center gap-3 transition-all duration-200 group ${
                            activeTab === item.id 
                            ? `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]` 
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                        <i className={`fa-solid ${item.icon} w-5 group-hover:text-cyan-400 transition-colors`}></i> {item.label}
                    </button>
                ))}

                <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 mt-6">Sub-Systems</p>
                {[
                    { id: 'ALERTS', label: 'Broadcasts', icon: 'fa-bullhorn' },
                    { id: 'TOOLS', label: 'Diagnostics', icon: 'fa-toolbox' },
                    { id: 'COMMS', label: 'Comms Uplink', icon: 'fa-satellite-dish' },
                    { id: 'PLUGINS', label: 'Extensions', icon: 'fa-puzzle-piece' },
                    { id: 'CONFIG', label: 'Sys Config', icon: 'fa-gears' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)} 
                        className={`w-full text-left px-4 py-3 rounded-lg font-bold text-xs flex items-center gap-3 transition-all duration-200 group ${
                            activeTab === item.id 
                            ? `bg-cyan-500/10 text-cyan-400 border border-cyan-500/20` 
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                        }`}
                    >
                         <i className={`fa-solid ${item.icon} w-5 group-hover:text-cyan-400 transition-colors`}></i> {item.label}
                    </button>
                ))}
            </div>
            
            <div className="mt-auto p-6 border-t border-white/5 relative z-10">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center overflow-hidden">
                             <img src="/logo.png" className="w-5 h-5 opacity-50" alt="sys" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#080910]"></div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white">Admin Node</p>
                        <p className="text-[10px] text-emerald-500 font-mono">SECURE_CONN</p>
                    </div>
                </div>
            </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
            {/* Context Header for Tabs (Except Overview) */}
            {activeTab !== 'OVERVIEW' && (
                <div className="mb-6 flex items-center gap-2 text-slate-500 text-xs uppercase font-bold tracking-widest">
                    <span>NEXUS</span>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className="text-cyan-400">{activeTab}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto pb-20">
                {activeTab === 'OVERVIEW' && renderOverview()}
                {activeTab === 'USERS' && renderUsers()}
                {activeTab === 'STORE' && renderStore()}
                
                {activeTab === 'ORDERS' && (
                    <div className={`${THEME.panel} p-6 rounded-2xl`}>
                         {/* Kanban Logic Re-implemented here for consistent display */}
                         {(() => {
                            const pendingOrders = orders.filter(o => o.status === 'PENDING');
                            const paidOrders = orders.filter(o => o.status === 'PAID');
                            const shippedOrders = orders.filter(o => o.status === 'SHIPPED');
                            const KanbanColumn = ({ title, items, color, status }: any) => (
                                <div className="flex-1 bg-black/20 rounded-xl border border-white/5 flex flex-col h-[600px]">
                                    <div className={`p-4 border-b border-white/5 ${color} font-bold uppercase text-xs tracking-wider flex justify-between items-center`}>
                                        {title} <span className="bg-white/10 text-white px-2 py-0.5 rounded-full">{items.length}</span>
                                    </div>
                                    <div className="p-2 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                        {items.map((order: any) => (
                                            <div key={order.id} className="bg-[#1a1b26] p-3 rounded-lg border border-white/5 hover:border-cyan-500/50 transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-mono text-slate-500">{order.id.slice(-6)}</span>
                                                    <span className="text-cyan-400 font-bold text-xs">RM {order.totalAmount}</span>
                                                </div>
                                                <p className="text-white font-bold text-sm mb-1">{order.customerName}</p>
                                                <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity mt-2">
                                                    {status === 'PENDING' && <button onClick={() => updateOrderStatus(order.id, 'PAID')} className="flex-1 py-1 text-[10px] bg-cyan-600 text-black rounded font-bold">Paid</button>}
                                                    {status === 'PAID' && <button onClick={() => updateOrderStatus(order.id, 'SHIPPED')} className="flex-1 py-1 text-[10px] bg-emerald-600 text-white rounded font-bold">Ship</button>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                            return (
                                <div className="flex gap-4 h-full">
                                    <KanbanColumn title="Pending" items={pendingOrders} color="text-slate-400" status="PENDING" />
                                    <KanbanColumn title="Processing" items={paidOrders} color="text-blue-400" status="PAID" />
                                    <KanbanColumn title="Complete" items={shippedOrders} color="text-emerald-400" status="SHIPPED" />
                                </div>
                            );
                         })()}
                    </div>
                )}

                {activeTab === 'ALERTS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`${THEME.panel} p-6 rounded-2xl`}>
                            <h3 className="text-white font-bold mb-4">Create Broadcast</h3>
                            <textarea 
                                value={newAlertMsg} 
                                onChange={e => setNewAlertMsg(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-cyan-500 h-32 resize-none"
                                placeholder="Enter system message..."
                            />
                             <div className="flex gap-2 mt-4">
                                <button onClick={handleGenerateAlert} className="px-4 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/40">{isGeneratingAlert ? '...' : <i className="fa-solid fa-wand-sparkles"></i>}</button>
                                <button onClick={handleCreateAlert} className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-lg shadow-cyan-500/20">Broadcast</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                             {announcements.map(a => (
                                 <div key={a.id} className={`${THEME.panel} p-4 rounded-xl flex justify-between items-center`}>
                                     <span className="text-white text-sm">{a.message}</span>
                                     <button onClick={() => deleteAnnouncement(a.id)} className="text-red-500 hover:text-white"><i className="fa-solid fa-trash"></i></button>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
                
                {/* Fallback for other tabs */}
                {(activeTab === 'TOOLS' || activeTab === 'PLUGINS' || activeTab === 'COMMS' || activeTab === 'CONFIG') && (
                     <div className={`${THEME.panel} p-8 rounded-2xl text-center`}>
                         <i className="fa-solid fa-layer-group text-4xl text-slate-700 mb-4"></i>
                         <h3 className="text-xl text-white font-bold mb-2">Module Loaded: {activeTab}</h3>
                         <p className="text-slate-500 text-sm mb-6">Rendering sub-system interface...</p>
                         
                         {activeTab === 'CONFIG' && (
                             <div className="max-w-xl mx-auto text-left space-y-4">
                                  {appConfig.map(cfg => (
                                      <div key={cfg.key} className="flex justify-between items-center p-3 bg-black/30 rounded border border-white/5">
                                          <span className="text-cyan-400 font-mono text-xs">{cfg.key}</span>
                                          <span className="text-white text-sm">{cfg.value}</span>
                                      </div>
                                  ))}
                             </div>
                         )}

                         {activeTab === 'COMMS' && (
                             <div className="max-w-2xl mx-auto bg-black border border-white/10 rounded-xl p-4 font-mono text-left text-xs h-64 overflow-y-auto">
                                 {waLogs.map((l, i) => <div key={i} className="text-green-400 border-b border-white/5 py-1">{l}</div>)}
                                 {waLogs.length === 0 && <span className="text-slate-600">Waiting for logs... (Start server)</span>}
                             </div>
                         )}
                     </div>
                )}
            </div>
        </main>

        {/* --- AI ADMIN ASSISTANT (FLOATING OVERLAY) --- */}
        {showAi && (
            <div className="absolute right-8 bottom-8 w-96 bg-[#0f1019] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] z-50 flex flex-col overflow-hidden animate-slide-up h-[500px]">
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 flex justify-between items-center border-b border-cyan-500/30">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-robot text-cyan-400"></i>
                        <h3 className="font-bold text-white tracking-widest text-sm">AI.ASSISTANT</h3>
                    </div>
                    <button onClick={() => setShowAi(false)} className="text-white hover:text-cyan-400"><i className="fa-solid fa-xmark"></i></button>
                </div>
                
                <div className="flex-1 bg-black/50 p-4 overflow-y-auto space-y-3 font-mono text-xs">
                    {aiMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isAiThinking && <div className="text-cyan-500 animate-pulse">Processing query...</div>}
                    <div ref={aiScrollRef}></div>
                </div>

                <div className="p-3 bg-black border-t border-white/10 flex gap-2">
                    <input 
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                        placeholder="Command..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-cyan-500 font-mono"
                    />
                    <button onClick={handleAiSend} className="bg-cyan-600 text-black w-10 rounded-lg flex items-center justify-center hover:bg-cyan-500">
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        )}
        
        {/* PRODUCT MODAL */}
        {isProductModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
                 <div className={`${THEME.panel} p-8 rounded-2xl w-full max-w-md`}>
                     <h2 className="text-white font-bold text-xl mb-4">Edit Inventory Record</h2>
                     <form onSubmit={handleProductSubmit} className="space-y-4">
                         <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Title" value={editingProduct?.title} onChange={e => setEditingProduct({...editingProduct!, title: e.target.value})} />
                         <div className="flex gap-4">
                            <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" type="number" placeholder="Price" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} />
                            <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" type="number" placeholder="Stock" value={editingProduct?.stock} onChange={e => setEditingProduct({...editingProduct!, stock: Number(e.target.value)})} />
                         </div>
                         <div className="flex justify-end gap-2 mt-4">
                             <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                             <button type="submit" className="px-6 py-2 bg-cyan-600 text-black font-bold rounded">Save</button>
                         </div>
                     </form>
                 </div>
            </div>
        )}
    </div>
  );
};

export default Admin;