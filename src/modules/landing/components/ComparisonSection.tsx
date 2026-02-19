import React from 'react';
import { motion } from 'framer-motion';

export const ComparisonSection = () => {
  const competitors = [
    { name: 'Muslim Pro', hasIqra: false, hasAI: false, hasTajwid: false, price: 'RM 19.90/bln' },
    { name: 'Qara\'a', hasIqra: false, hasAI: false, hasTajwid: true, price: 'RM 14.90/bln' },
    { name: 'App Biasa', hasIqra: false, hasAI: false, hasTajwid: false, price: 'Percuma' },
  ];

  return (
    <section className="relative z-10 py-20 md:py-28 bg-raudhah-ivory overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-grid"></div>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-raudhah text-raudhah-ink mb-4">
            Kenapa Pilih <span className="text-raudhah-teal">QuranPulse</span>?
          </h2>
          <p className="text-raudhah-ink/60 font-medium">Bandingkan keberkatan & kualiti bimbingan kami</p>
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
              <tr className="border-b border-raudhah-teal/5">
                <th className="py-4 px-4 text-left text-raudhah-ink/40 text-[10px] font-bold uppercase tracking-wider">Features</th>
                {/* QuranPulse Column - Highlighted */}
                <th className="py-4 px-4 text-center relative min-w-[150px]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-raudhah-gold text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                      Terbaik
                    </span>
                  </div>
                  <div className="bg-white border border-raudhah-teal/10 rounded-t-2xl pt-6 pb-4 shadow-sm">
                    <span className="text-raudhah-teal font-bold text-lg font-raudhah">QuranPulse</span>
                  </div>
                </th>
                {competitors.map((comp, i) => (
                  <th key={i} className="py-4 px-4 text-center text-raudhah-ink/40 text-xs font-medium">{comp.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Iqra 1-6 */}
              <tr className="border-b border-raudhah-teal/5">
                <td className="py-4 px-4 text-raudhah-ink/70 text-sm font-medium">Iqra' Digital 1-6</td>
                <td className="py-4 px-4 text-center bg-raudhah-teal/5">
                  <i className="fa-solid fa-circle-check text-raudhah-teal text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasIqra ? 'fa-circle-check text-raudhah-teal' : 'fa-circle-xmark text-raudhah-ink/10'}`} />
                  </td>
                ))}
              </tr>

              {/* AI Ustaz */}
              <tr className="border-b border-raudhah-teal/5">
                <td className="py-4 px-4 text-raudhah-ink/70 text-sm font-medium">AI Ustaz 24/7</td>
                <td className="py-4 px-4 text-center bg-raudhah-teal/5">
                  <i className="fa-solid fa-circle-check text-raudhah-teal text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasAI ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-raudhah-ink/15'}`} />
                  </td>
                ))}
              </tr>

              {/* Tajwid Feedback */}
              <tr className="border-b border-raudhah-teal/5">
                <td className="py-4 px-4 text-raudhah-ink/70 text-sm font-medium">Feedback Tajwid</td>
                <td className="py-4 px-4 text-center bg-raudhah-teal/5">
                  <i className="fa-solid fa-circle-check text-raudhah-teal text-lg" />
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className={`fa-solid ${comp.hasTajwid ? 'fa-circle-check text-green-500' : 'fa-circle-xmark text-raudhah-ink/15'}`} />
                  </td>
                ))}
              </tr>

              {/* Malaysia-First */}
              <tr className="border-b border-raudhah-teal/5">
                <td className="py-4 px-4 text-raudhah-ink/70 text-sm font-medium">JAKIM Compliant</td>
                <td className="py-4 px-4 text-center bg-raudhah-teal/5">
                  <i className="fa-solid fa-circle-check text-raudhah-teal text-lg" />
                </td>
                {competitors.map((_, i) => (
                  <td key={i} className="py-4 px-4 text-center">
                    <i className="fa-solid fa-circle-xmark text-raudhah-ink/15" />
                  </td>
                ))}
              </tr>

              {/* Price Row */}
              <tr>
                <td className="py-4 px-4 text-raudhah-ink/70 text-sm font-bold">Infaq / Harga</td>
                <td className="py-4 px-4 text-center bg-raudhah-teal/5">
                  <div className="text-raudhah-teal font-bold">
                    <span className="text-[10px] text-raudhah-ink/30 line-through block">RM 9.90/bulan</span>
                    <span className="text-raudhah-gold">PERCUMA*</span>
                  </div>
                </td>
                {competitors.map((comp, i) => (
                  <td key={i} className="py-4 px-4 text-center text-raudhah-ink/40 text-xs font-medium">{comp.price}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        <p className="text-center text-raudhah-ink/30 text-[10px] mt-6 font-mono uppercase tracking-widest">
          *Genesis Batch mendapat akses PRO percuma selamanya
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
