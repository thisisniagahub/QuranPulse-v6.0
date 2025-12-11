import React from 'react';
import { motion } from 'framer-motion';

export const ComparisonSection = () => {
  const competitors = [
    { name: 'Muslim Pro', hasIqra: false, hasAI: false, hasTajwid: false, price: 'RM 20/bulan' },
    { name: 'Qara\'a', hasIqra: false, hasAI: false, hasTajwid: true, price: 'RM 20/bulan' },
    { name: 'Free Apps', hasIqra: false, hasAI: false, hasTajwid: false, price: 'Percuma' },
  ];

  return (
    <section className="relative z-10 py-20 md:py-28 bg-black/40 backdrop-blur-lg overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Kenapa Pilih <span className="text-cyan-400">QuranPulse</span>?
          </h2>
          <p className="text-slate-400">Bandingkan sendiri dengan app lain di pasaran</p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-left text-slate-400 text-sm font-medium">Feature</th>
                {/* QuranPulse Column - Highlighted */}
                <th className="py-4 px-4 text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Recommended
                    </span>
                  </div>
                  <div className="bg-cyan-900/20 backdrop-blur-md border border-cyan-500/30 rounded-t-2xl pt-6 pb-4 shadow-[0_-5px_20px_rgba(6,182,212,0.1)]">
                    <span className="text-white font-bold text-lg drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">QuranPulse</span>
                  </div>
                </th>
                {competitors.map((comp, i) => (
                  <th key={i} className="py-4 px-4 text-center text-slate-400 text-sm">{comp.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Iqra 1-6 */}
              <tr className="border-b border-white/5">
                <td className="py-4 px-4 text-slate-300 text-sm">Iqra 1-6 Lengkap</td>
                <td className="py-4 px-4 text-center bg-cyan-500/5">
                  <i className="fa-solid fa-circle-check text-cyan-400 text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasIqra ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-slate-600'}`} />
                  </td>
                ))}
              </tr>
              
              {/* AI Ustaz */}
              <tr className="border-b border-white/5">
                <td className="py-4 px-4 text-slate-300 text-sm">AI Ustaz 24/7</td>
                <td className="py-4 px-4 text-center bg-cyan-500/5">
                  <i className="fa-solid fa-circle-check text-cyan-400 text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasAI ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-slate-600'}`} />
                  </td>
                ))}
              </tr>

              {/* Tajwid Feedback */}
              <tr className="border-b border-white/5">
                <td className="py-4 px-4 text-slate-300 text-sm">Feedback Tajwid</td>
                <td className="py-4 px-4 text-center bg-cyan-500/5">
                  <i className="fa-solid fa-circle-check text-cyan-400 text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasTajwid ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-slate-600'}`} />
                  </td>
                ))}
              </tr>

              {/* Malaysia-First */}
              <tr className="border-b border-white/5">
                <td className="py-4 px-4 text-slate-300 text-sm">JAKIM Compliant</td>
                <td className="py-4 px-4 text-center bg-cyan-500/5">
                  <i className="fa-solid fa-circle-check text-cyan-400 text-lg" />
                </td>
                {competitors.map((_, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className="fa-solid fa-circle-xmark text-slate-600" />
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="py-4 px-4 text-slate-300 text-sm font-medium">Harga</td>
                <td className="py-4 px-4 text-center bg-cyan-500/5">
                  <div className="text-cyan-400 font-bold">
                    <span className="text-xs text-slate-500 line-through block">RM 9.90/bulan</span>
                    <span className="text-green-400">PERCUMA*</span>
                  </div>
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center text-slate-400 text-sm">{comp.price}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        <p className="text-center text-slate-500 text-xs mt-4">
          *Genesis Batch mendapat akses percuma selamanya untuk features asas
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
