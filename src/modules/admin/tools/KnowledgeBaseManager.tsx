import React from 'react';
import { motion } from 'framer-motion';

const KnowledgeBaseManager: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
        
        {/* 1. HEADER STATS */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Vector Count</p>
                <h3 className="text-3xl font-black text-raudhah-teal mt-1">14,502</h3>
                <p className="text-[10px] text-slate-400 mt-2">Kitab Turath & Fatwa</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Cache Hit Rate</p>
                <h3 className="text-3xl font-black text-emerald-400 mt-1">82%</h3>
                <p className="text-[10px] text-slate-400 mt-2">Queries served from DB</p>
            </div>
            <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl">
                <p className="text-xs text-slate-500 uppercase font-bold">Pending Ingestion</p>
                <h3 className="text-3xl font-black text-amber-400 mt-1">3</h3>
                <p className="text-[10px] text-slate-400 mt-2">Files processing...</p>
            </div>
        </div>

        {/* 2. INGESTION ZONE */}
        <div className="bg-slate-900/30 border-2 border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-raudhah-teal/20 hover:bg-slate-900/50 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-raudhah-teal/10 rounded-full flex items-center justify-center text-raudhah-teal mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-white">Upload Knowledge Source</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">Drag & drop PDF (Kitab), CSV, or TXT files here. The system will auto-vectorize them for Ustaz AI.</p>
        </div>

        {/* 3. CACHE EXPLORER */}
        <div className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 bg-slate-900/80 flex justify-between items-center">
                <h3 className="font-bold text-white text-sm">Recent Queries</h3>
                <button className="text-xs text-raudhah-teal hover:text-white transition-colors">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-black/20 font-bold">
                        <tr>
                            <th className="p-4">Query</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Confidence</th>
                            <th className="p-4">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                            { q: "Hukum trade forex?", c: "Fiqh Muamalat", s: "98%", t: "2m ago" },
                            { q: "Niat puasa ganti", c: "Ibadah", s: "99%", t: "15m ago" },
                            { q: "Sejarah Perang Uhud", c: "Seerah", s: "85%", t: "1h ago" },
                            { q: "Cara mandi wajib", c: "Ibadah", s: "97%", t: "3h ago" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-slate-200">{row.q}</td>
                                <td className="p-4 text-slate-400">{row.c}</td>
                                <td className="p-4">
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold">{row.s}</span>
                                </td>
                                <td className="p-4 text-slate-500">{row.t}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
  );
};

export default KnowledgeBaseManager;
