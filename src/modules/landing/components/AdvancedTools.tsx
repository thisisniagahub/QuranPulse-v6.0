import React from 'react';
import { TiltCard } from './TiltCard';

export const AdvancedTools = () => (
    <section className="py-24 bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs mb-2 block">Coming Soon</span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">Future <span className="text-purple-500">Intelligence</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">We are constantly pushing the boundaries of Islamic Tech. Here is what's next.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tool 1: Faraid */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
                        <i className="fa-solid fa-calculator text-4xl text-cyan-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">AI Faraid Calculator</h3>
                        <p className="text-slate-400 text-sm mb-4">Complex inheritance calculations solved instantly with Shariah-compliant algorithms.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 2: Zakat AI */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-green-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-colors"></div>
                        <i className="fa-solid fa-hand-holding-dollar text-4xl text-green-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">Smart Zakat AI</h3>
                        <p className="text-slate-400 text-sm mb-4">Connect your bank accounts and investment portfolios for automated Zakat purification.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>

                {/* Tool 3: Halal Scanner */}
                <TiltCard>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 h-full relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                        <i className="fa-solid fa-barcode text-4xl text-amber-500 mb-6"></i>
                        <h3 className="text-xl font-bold text-white mb-2">AR Halal Scanner</h3>
                        <p className="text-slate-400 text-sm mb-4">Point your camera at any product to instantly verify its Halal status and ingredients.</p>
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            In Development
                        </div>
                    </div>
                </TiltCard>
            </div>
        </div>
    </section>
);
