import React from 'react';
import { TiltCard } from './TiltCard';

export const AdvancedTools = () => (
    <section className="py-32 bg-black relative z-10 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    R&D Labs
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6 tracking-tight">The Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Frontier</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Architecting the future of digital faith. We are building ecosystems that transcend traditional apps.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tool 1: Legacy Guardian */}
                <TiltCard>
                    <div className="bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-raudhah-teal/50 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-raudhah-teal/5 rounded-full blur-3xl group-hover:bg-raudhah-teal/10 transition-all"></div>
                        <div className="w-14 h-14 rounded-2xl bg-teal-900/20 border border-raudhah-teal/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                            <i className="fa-solid fa-file-contract text-2xl text-raudhah-teal"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-raudhah-teal transition-colors">Legacy Guardian</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Algorithmic inheritance distribution using Smart Contracts. Secure your Wasiat & Hibah on the blockchain.
                        </p>
                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                            <div className="px-2 py-1 rounded bg-teal-950/50 border border-raudhah-teal/20 text-[10px] text-raudhah-teal font-mono">PROTO-01</div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Engineering Phase</span>
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 2: Wealth OS */}
                <TiltCard>
                    <div className="bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                            <i className="fa-solid fa-chart-pie text-2xl text-emerald-400"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Barakah Wealth OS</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Autonomous Zakat purification engine. Connects directly to banks & crypto wallets for real-time cleansing.
                        </p>
                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                            <div className="px-2 py-1 rounded bg-emerald-950/50 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">PROTO-02</div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">API Integration</span>
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 3: Sunnah Vision */}
                <TiltCard>
                    <div className="bg-gradient-to-b from-slate-900 to-black border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-900/20 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                            <i className="fa-solid fa-eye text-2xl text-amber-400"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Sunnah Vision AR</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Neural food analysis. Detects Haram additives & Tayyiban nutritional scores via camera instantly.
                        </p>
                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                            <div className="px-2 py-1 rounded bg-amber-950/50 border border-amber-500/20 text-[10px] text-amber-400 font-mono">PROTO-03</div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Model Training</span>
                        </div>
                    </div>
                </TiltCard>
            </div>
        </div>
    </section>
);
