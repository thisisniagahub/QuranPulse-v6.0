
import React, { useState, useEffect, useRef } from 'react';
import { getPrayerTimes, getNextPrayer, getQiblaDirection, PrayerTimes } from '../services/prayerService';
import styles from './Ibadah.module.css';

// --- TYPES ---
interface BotLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'MSG_IN' | 'MSG_OUT' | 'ERROR';
  message: string;
}

const Ibadah: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TASBIH' | 'QIBLA' | 'PRAYER' | 'NOTIFY'>('TASBIH');
  
  // --- TASBIH STATE ---
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [isPressed, setIsPressed] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // --- QIBLA STATE ---
  const [heading, setHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const QIBLA_OFFSET = 292; // Approx for Malaysia/SE Asia.

  // --- PRAYER STATE ---
  const [prayerData, setPrayerData] = useState<PrayerTimes | null>(null);

  // --- WHATSAPP BOT STATE ---
  const [waStatus, setWaStatus] = useState<'DISCONNECTED' | 'QR_READY' | 'CONNECTED'>('DISCONNECTED');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [logs, setLogs] = useState<BotLog[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [botConfig, setBotConfig] = useState({
    prayerReminders: true,
    aiChat: true,
    dailyAyah: true
  });
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPrayerTimes(3.1390, 101.6869).then(data => setPrayerData(data.timings));
  }, []);

  useEffect(() => {
      // Auto-scroll logs
      if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [logs]);

  // Helper: Play Click Sound via Web Audio API
  const playClick = () => {
      try {
          if (!audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
          
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
          // Fallback or silence
      }
  };

  // Handle Tasbih
  const handleCount = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150); // Animation duration

    const newCount = count + 1;
    setCount(newCount);
    playClick();

    if (navigator.vibrate) {
        if (newCount === target) {
            navigator.vibrate([50, 50, 50, 50, 100]); // Long Pulse for Target
        } else {
            navigator.vibrate(15);
        }
    }
  };

  const handleReset = () => {
    if (confirm("Reset counter?")) setCount(0);
  };

  // Handle Qibla
  const startCompass = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          alert('Permission required for compass');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let compass = (e as any).webkitCompassHeading || Math.abs(e.alpha! - 360);
    setHeading(compass);
  };

  // --- WHATSAPP LIFECYCLE LOGIC (SIMULATION) ---
  
  const addLog = (type: BotLog['type'], message: string) => {
      setLogs(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          type,
          message
      }]);
  };

  const handleStartServer = () => {
      setWaStatus('DISCONNECTED'); // Reset briefly
      setLogs([]);
      addLog('INFO', 'Starting WhatsApp Server...');
      addLog('INFO', 'Initializing Puppeteer (Headless)...');
      
      // Simulate boot delay
      setTimeout(() => {
          setWaStatus('QR_READY');
          // Mock QR Code (Normally fetched from Backend via Socket.io)
          setQrCodeData('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=QuranPulseDemoSession'); 
          addLog('INFO', 'QR Code generated. Waiting for scan...');
      }, 1500);
  };

  const handleSimulateScan = () => {
      if (waStatus !== 'QR_READY') return;
      
      addLog('INFO', 'QR Code Scanned by device...');
      addLog('INFO', 'Authenticating...');
      
      setTimeout(() => {
          setWaStatus('CONNECTED');
          addLog('INFO', 'Client Authenticated!');
          addLog('INFO', 'Syncing contacts...');
          addLog('INFO', 'Ready to receive messages.');
          
          // Simulate incoming traffic for demo
          setTimeout(() => {
              addLog('MSG_IN', '+60123456789: Assalamualaikum, waktu Asar bila?');
              setTimeout(() => {
                  addLog('MSG_OUT', 'Bot: Waalaikumussalam. Waktu Asar adalah 16:32.');
              }, 1000);
          }, 2000);
      }, 1500);
  };

  const handleStopServer = () => {
      addLog('INFO', 'Stopping server...');
      setWaStatus('DISCONNECTED');
      setQrCodeData(null);
      addLog('ERROR', 'Server Stopped.');
  };

  const handleBroadcast = () => {
      if (!broadcastMsg) return;
      addLog('INFO', `Broadcasting to ALL users: "${broadcastMsg}"`);
      addLog('MSG_OUT', `Sent to 142 subscribers.`);
      setBroadcastMsg('');
  };

  return (
    <div className="p-4 pb-24 h-full animate-fade-in flex flex-col bg-[#020617]">
       {/* 3D Segmented Control */}
       <div className="flex bg-[#020617]/50 p-1.5 rounded-2xl mb-8 border border-cyan-500/20 shadow-inner overflow-x-auto no-scrollbar shrink-0">
           {['TASBIH', 'QIBLA', 'PRAYER', 'NOTIFY'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 min-w-[80px] py-3 text-xs font-bold rounded-xl transition-all duration-300 relative overflow-hidden ${
                    activeTab === tab 
                    ? 'text-cyan-400 shadow-lg shadow-cyan-500/10 bg-cyan-950/30 border border-cyan-500/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
               >
                   {activeTab === tab && (
                       <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl"></div>
                   )}
                   <span className="relative z-10">{tab === 'NOTIFY' ? 'WhatsApp Bot' : tab}</span>
               </button>
           ))}
       </div>

       {/* --- TASBIH UI --- */}
       {activeTab === 'TASBIH' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-slide-up">
               <div className="text-center">
                   <h2 className="text-white text-2xl font-bold mb-1 tracking-tight">Digital Tasbih</h2>
                   <p className="text-slate-400 text-sm">Target: <span className="text-teal-400 font-bold">{target}</span></p>
               </div>

               {/* 3D Mechanical Button */}
               <div className="relative group select-none">
                   <div className="absolute inset-0 bg-primary blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
                   <div className="w-72 h-72 rounded-full bg-black shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] border border-white/10 flex items-center justify-center p-4">
                       <div 
                         onClick={handleCount}
                         className={`
                            w-full h-full rounded-full bg-gradient-to-b from-space-light to-space-dark 
                            border-t border-slate-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]
                            flex flex-col items-center justify-center cursor-pointer relative transition-all duration-100 ease-in-out
                            ${isPressed ? 'translate-y-2 scale-[0.98] shadow-none' : 'shadow-[0_10px_20px_-5px_rgba(0,0,0,0.5),0_8px_0_#1e293b]'}
                         `}
                       >
                           <div className="absolute inset-4 rounded-full border border-slate-700/50 opacity-50"></div>
                           <div className="absolute inset-8 rounded-full border border-slate-800/80 opacity-50"></div>
                           <span className="text-8xl font-mono text-transparent bg-clip-text bg-gradient-to-b from-primary-light to-primary font-bold drop-shadow-sm select-none">
                               {count}
                           </span>
                           <span className="text-slate-500 text-xs mt-4 font-bold uppercase tracking-[0.2em]">Press</span>
                       </div>
                   </div>
               </div>

               {/* Controls */}
               <div className="flex gap-4">
                   <button 
                        onClick={handleReset} 
                        className="w-14 h-14 rounded-2xl bg-slate-800 text-red-400 flex items-center justify-center hover:bg-slate-700 hover:text-red-300 border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all"
                        title="Reset Counter"
                        aria-label="Reset Counter"
                    >
                       <i className="fa-solid fa-rotate-left"></i>
                   </button>
                   <button onClick={() => setTarget(target === 33 ? 99 : 33)} className="px-6 h-14 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 text-sm border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2">
                       <i className="fa-solid fa-bullseye text-primary"></i>
                       Target: {target}
                   </button>
               </div>
           </div>
       )}

       {/* --- QIBLA UI --- */}
       {activeTab === 'QIBLA' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-slide-up">
               {!permissionGranted ? (
                   <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10">
                       <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
                            <i className="fa-solid fa-compass text-4xl"></i>
                       </div>
                       <h3 className="text-white font-bold text-lg mb-2">Enable Sensors</h3>
                       <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">We need access to your device's gyroscope to show the Qibla direction accurately.</p>
                       <button onClick={startCompass} className="px-8 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl shadow-lg shadow-primary/20 transition-all">Allow Access</button>
                   </div>
               ) : (
                   <>
                        <div className="relative w-80 h-80">
                             <div className="absolute inset-0 bg-primary blur-[80px] opacity-10 rounded-full"></div>
                             {/* Dynamic CSS variable for real-time compass rotation based on device orientation */}
                             <div className={`w-full h-full rounded-full bg-gradient-to-br from-space-light to-black border-8 border-space-dark shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] relative transition-transform duration-500 ease-out flex items-center justify-center overflow-hidden rotate-[var(--compass-heading)]`} 
                             // eslint-disable-next-line
                             style={{ '--compass-heading': `${-heading}deg` } as React.CSSProperties}
                             >
                                 <div className="absolute inset-0 rounded-full border border-white/5 m-4"></div>
                                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                     <i className="fa-solid fa-crosshairs text-9xl text-white"></i>
                                 </div>
                                 <div className="absolute top-4 left-1/2 -translate-x-1/2 text-red-500 font-bold text-xl drop-shadow-md">N</div>
                                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 font-bold text-lg">S</div>
                                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">W</div>
                                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">E</div>
                                 {/* Dynamic CSS variable for Qibla direction pointer */}
                                 <div className={`absolute top-1/2 left-1/2 w-1 h-32 origin-bottom z-10 rotate-[var(--qibla-offset)]`} 
                                 // eslint-disable-next-line
                                 style={{ '--qibla-offset': `${QIBLA_OFFSET}deg` } as React.CSSProperties}
                                 >
                                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                         <span className="text-2xl drop-shadow-lg filter">🕋</span>
                                         <div className="w-1 h-20 bg-gradient-to-t from-transparent to-secondary rounded-full"></div>
                                     </div>
                                 </div>
                             </div>
                             <div 
                                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full pointer-events-none"
                            ></div>
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-secondary text-4xl z-20 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"><i className="fa-solid fa-caret-down"></i></div>
                        </div>
                        <div className="text-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Qibla Direction</h3>
                            <p className="text-white font-mono text-4xl font-bold tracking-tighter">{Math.round(heading)}°</p>
                        </div>
                   </>
               )}
           </div>
       )}

       {/* --- PRAYER TIMES UI --- */}
       {activeTab === 'PRAYER' && prayerData && (
           <div className="space-y-4 animate-slide-up overflow-y-auto">
               <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark to-slate-900 p-8 rounded-3xl text-center shadow-lg border border-white/5">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-overlay"></div>
                   <h2 className="text-white font-serif text-3xl font-bold relative z-10">Prayer Times</h2>
                   <div className="flex items-center justify-center gap-2 text-primary-light mt-2 relative z-10">
                       <i className="fa-solid fa-location-dot text-xs"></i>
                       <p className="text-sm font-bold">Kuala Lumpur</p>
                   </div>
               </div>
               
               <div className="bg-slate-900 rounded-3xl p-2 border border-slate-800">
                   {Object.entries(prayerData).filter(([k]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(k)).map(([name, time], idx) => (
                       <div key={name} className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0 group">
                           <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner ${name === 'Maghrib' ? 'bg-orange-900/40 text-orange-400' : 'bg-slate-800 text-slate-400'}`}>
                                   <i className={`fa-regular ${name === 'Sunrise' ? 'fa-sun' : 'fa-clock'}`}></i>
                               </div>
                               <span className="text-white font-bold text-lg">{name}</span>
                           </div>
                           <div className="px-4 py-1 rounded-lg bg-slate-800 group-hover:bg-primary/30 transition-colors">
                                <span className="text-primary font-mono font-bold text-lg">{time}</span>
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       )}

       {/* --- WHATSAPP 360 DASHBOARD (Command Center) --- */}
       {activeTab === 'NOTIFY' && (
           <div className="flex-1 flex flex-col h-full overflow-hidden animate-slide-up">
               {/* 1. Status Bar */}
               <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-4">
                   <div className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full animate-pulse ${
                           waStatus === 'CONNECTED' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
                           waStatus === 'QR_READY' ? 'bg-yellow-500' : 'bg-red-500'
                       }`}></div>
                       <div>
                           <p className="text-xs font-bold text-white uppercase tracking-wider">
                               {waStatus === 'CONNECTED' ? 'Bot Online' : waStatus === 'QR_READY' ? 'Scan QR' : 'Offline'}
                           </p>
                           <p className="text-[10px] text-slate-500">Instance: #QP-V6-NODE</p>
                       </div>
                   </div>
                   {/* Top Bar Toggle Button (Optional Redundancy) */}
                   <button 
                    onClick={waStatus === 'DISCONNECTED' ? handleStartServer : handleStopServer} 
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                        waStatus === 'DISCONNECTED' 
                        ? 'bg-primary/30 border-primary/30 text-primary hover:bg-primary/50' 
                        : 'bg-red-900/30 border-red-500/30 text-red-400 hover:bg-red-900/50'
                    }`}
                    title={waStatus === 'DISCONNECTED' ? 'Start Server' : 'Stop Server'}
                    aria-label={waStatus === 'DISCONNECTED' ? 'Start WhatsApp Bot Server' : 'Stop WhatsApp Bot Server'}
                    >
                       <i className={`fa-solid ${waStatus === 'DISCONNECTED' ? 'fa-power-off' : 'fa-stop'} mr-2`}></i>
                       {waStatus === 'DISCONNECTED' ? 'Start' : 'Stop'}
                   </button>
               </div>

               {/* 2. Main Content Area */}
               <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                   
                   {/* Left Col: Controls & Lifecycle */}
                   <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                       
                       {/* STATE: DISCONNECTED */}
                       {waStatus === 'DISCONNECTED' && (
                           <div className="text-center animate-fade-in z-10">
                               <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                   <i className="fa-brands fa-whatsapp text-4xl text-slate-600"></i>
                               </div>
                               <h3 className="text-white font-bold text-lg mb-2">WhatsApp Bot Server</h3>
                               <p className="text-sm text-slate-500 mb-6">Start the server to generate a QR code.</p>
                               
                               <button 
                                onClick={handleStartServer}
                                className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1"
                                title="Start Server"
                                aria-label="Start WhatsApp Bot Server"
                               >
                                   <i className="fa-solid fa-power-off mr-2"></i> Start Server
                               </button>
                           </div>
                       )}

                       {/* STATE: QR READY */}
                       {waStatus === 'QR_READY' && qrCodeData && (
                           <div className="text-center animate-fade-in z-10">
                               <div className="bg-white p-3 rounded-xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] mx-auto w-fit">
                                   <img src={qrCodeData} alt="QR Code" className="w-40 h-40" />
                               </div>
                               <p className="text-xs text-slate-400 mb-6">Open WhatsApp &gt; Linked Devices &gt; Scan</p>
                               
                               <button 
                                onClick={handleSimulateScan}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-primary text-white font-bold rounded-xl shadow-lg transition-all hover:brightness-110 flex items-center gap-2 mx-auto"
                                title="Simulate QR Code Scan"
                                aria-label="Simulate QR Code Scan"
                               >
                                   <i className="fa-solid fa-qrcode"></i> Simulate Scan QR Code
                               </button>
                           </div>
                       )}

                       {/* STATE: CONNECTED */}
                       {waStatus === 'CONNECTED' && (
                           <div className="w-full space-y-4 animate-fade-in z-10">
                               <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/20 rounded-xl mb-4">
                                   <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                        <i className="fa-solid fa-check text-green-400 text-xl"></i>
                                   </div>
                                   <div>
                                       <p className="text-white font-bold text-lg">Bot Connected</p>
                                       <p className="text-xs text-green-400">Syncing messages...</p>
                                   </div>
                               </div>

                               <div className="space-y-2 mb-6">
                                   <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-800">
                                       <span className="text-xs text-slate-400">Battery Level</span>
                                       <span className="text-xs text-green-400 font-bold">98%</span>
                                   </div>
                                   <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center border border-slate-800">
                                       <span className="text-xs text-slate-400">Uptime</span>
                                       <span className="text-xs text-white font-bold">00:01:24</span>
                                   </div>
                               </div>

                               <button 
                                onClick={handleStopServer}
                                className="w-full py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 font-bold rounded-xl border border-red-900/50 transition-colors flex items-center justify-center gap-2"
                                title="Stop Server"
                                aria-label="Stop WhatsApp Bot Server"
                               >
                                   <i className="fa-solid fa-power-off"></i> Stop Server
                               </button>
                           </div>
                       )}

                       {/* BG Decoration */}
                       <div className="absolute inset-0 bg-maze opacity-5 pointer-events-none"></div>
                   </div>

                   {/* Right Col: Terminal Logs & Broadcast */}
                   <div className="flex-1 flex flex-col gap-4">
                       
                       {/* Terminal */}
                       <div className="flex-1 bg-black rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-y-auto relative shadow-inner min-h-[200px]">
                           <div className="absolute top-2 right-2 text-[10px] text-slate-600 uppercase font-bold">System Log</div>
                           <div className="space-y-1.5 pb-2">
                               {logs.length === 0 && <span className="text-slate-700">Waiting for server start...</span>}
                               {logs.map((log) => (
                                   <div key={log.id} className="break-words">
                                       <span className="text-slate-500">[{log.timestamp}]</span>{' '}
                                       <span className={`font-bold ${
                                           log.type === 'INFO' ? 'text-blue-400' :
                                           log.type === 'MSG_IN' ? 'text-yellow-400' :
                                           log.type === 'MSG_OUT' ? 'text-green-400' : 'text-red-500'
                                       }`}>
                                           {log.type}
                                       </span>
                                       {' '}<span className="text-slate-300">{log.message}</span>
                                   </div>
                               ))}
                               <div ref={logsEndRef} />
                           </div>
                       </div>

                       {/* Broadcast Input */}
                       <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                           <div className="flex gap-2">
                               <input 
                                    type="text" 
                                    disabled={waStatus !== 'CONNECTED'}
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    placeholder="Broadcast message to all..."
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-primary text-xs disabled:opacity-50"
                                    onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                                    aria-label="Broadcast message input"
                               />
                               <button 
                                onClick={handleBroadcast}
                                disabled={waStatus !== 'CONNECTED' || !broadcastMsg}
                                className="bg-primary disabled:bg-slate-700 hover:bg-primary-hover text-white w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-lg"
                                title="Send Broadcast"
                                aria-label="Send Broadcast Message"
                               >
                                   <i className="fa-solid fa-paper-plane"></i>
                               </button>
                           </div>
                           <p className="text-[10px] text-slate-500 mt-2 pl-1">
                               Target: <span className="text-slate-300">142 Subscribers</span> • Delay: <span className="text-slate-300">2s (Anti-Ban)</span>
                           </p>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Ibadah;
