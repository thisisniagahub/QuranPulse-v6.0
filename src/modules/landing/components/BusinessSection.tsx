import React from 'react';
import { TiltCard } from './TiltCard';

export const BusinessSection = () => (
    <section id="business" className="py-20 bg-gradient-to-b from-black to-slate-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="bg-gradient-to-r from-slate-900 to-black border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold font-serif text-white mb-4">Partner with <span className="text-cyan-400">QuranPulse</span></h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        We are building the future of Islamic Technology. Whether you are an investor, a mosque committee, or a developer, we want to collaborate.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                            <i className="fa-solid fa-file-pdf"></i>
                            Download Pitch Deck
                        </button>
                        <button className="px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                            Contact CEO
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <TiltCard>
                        <div className="aspect-[4/5] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,transparent)]"></div>
                            <i className="fa-solid fa-handshake text-6xl text-white/50"></i>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
                                <p className="text-xs text-cyan-400 font-mono mb-1">GROWTH METRIC</p>
                                <p className="text-xl font-bold text-white">+1000% <span className="text-xs font-normal text-slate-400">YoY</span></p>
                            </div>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </div>
    </section>
);
