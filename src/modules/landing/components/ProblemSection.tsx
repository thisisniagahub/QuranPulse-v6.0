import React from 'react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
  const problems = [
    {
      icon: "fa-rectangle-ad",
      title: "Apps Penuh Iklan",
      desc: "Tengah khusyuk baca Quran, tiba-tiba keluar iklan game judi. Hilang mood & barakah."
    },
    {
      icon: "fa-layer-group",
      title: "Terpaksa Download 5 Apps",
      desc: "Satu app untuk Waktu Solat, satu untuk Quran, satu untuk Kiblat. Phone penuh, serabut nak urus."
    },
    {
      icon: "fa-user-slash",
      title: "Tiada Tempat Rujuk",
      desc: "Bila ada soalan agama, nak tanya siapa? Google selalunya bagi jawapan mengelirukan."
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden bg-[#020617]">
      {/* Background Ornate Pattern (Very Subtle) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='white' stroke-width='0.5' /%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>

      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-slate-950/80 to-[#020617] z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-red-500 font-bold tracking-widest uppercase text-xs mb-2 block animate-pulse">The Current Reality</span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">
            Why is practicing Digital Deen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">so frustrating?</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light">
            We analyzed 50+ Islamic apps. They all share the same problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-slate-900/50 border border-red-500/10 hover:border-red-500/30 rounded-3xl p-8 transition-all duration-300 hover:bg-red-950/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-2xl text-red-500`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>

              {/* X Mark */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-xmark text-red-500 text-xl"></i>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Solution Bridge */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="h-16 w-px bg-gradient-to-b from-red-500/0 via-red-500/50 to-cyan-500/50"></div>
            <div className="px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              There is a better way.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
