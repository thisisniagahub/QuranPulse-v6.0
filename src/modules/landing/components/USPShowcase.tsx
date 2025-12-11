import React from 'react';
import { motion } from 'framer-motion';

export const USPShowcase = () => {
  const usps = [
    {
      icon: 'fa-robot',
      title: 'AI Ustaz 24/7',
      subtitle: 'Tanya apa sahaja tentang Islam',
      description: 'Jawapan tepat dengan dalil Quran & Hadith',
      gradient: 'from-purple-500 to-purple-700',
      glow: 'shadow-purple-500/30',
      badge: 'POWERED BY AI',
    },
    {
      icon: 'fa-book-open-reader',
      title: 'Iqra 1-6 Lengkap',
      subtitle: 'Satu-satunya app dengan kurikulum penuh',
      description: 'Belajar mengaji dari A hingga Z',
      gradient: 'from-cyan-500 to-blue-600',
      glow: 'shadow-cyan-500/30',
      badge: 'EKSKLUSIF',
    },
    {
      icon: 'fa-microphone-lines',
      title: 'Feedback Tajwid',
      subtitle: 'AI mendengar dan membetulkan',
      description: 'Real-time pronunciation correction',
      gradient: 'from-emerald-500 to-teal-600',
      glow: 'shadow-emerald-500/30',
      badge: 'REAL-TIME',
    },
    {
      icon: 'fa-award',
      title: 'JAKIM Compliant',
      subtitle: 'Selaras dengan Mazhab Syafie',
      description: 'Dibuat khas untuk Muslim Malaysia',
      gradient: 'from-amber-500 to-orange-600',
      glow: 'shadow-amber-500/30',
      badge: 'MALAYSIA',
    },
  ];

  return (
    <section className="relative z-10 py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-cyan-500/10 to-transparent blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/30 backdrop-blur-md mb-6">
            <i className="fa-solid fa-star text-amber-400 text-xs" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              Kenapa QuranPulse?
            </span>
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
            Bukan Sekadar App <span className="text-cyan-400">Mengaji</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Ini adalah <span className="text-white font-semibold">Islamic Super App</span> — 
            gabungan 10+ aplikasi Islam dalam satu platform AI-powered.
          </p>
        </motion.div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {usps.map((usp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`
                relative p-6 rounded-3xl h-full
                bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90
                border border-white/10 hover:border-white/20
                backdrop-blur-xl overflow-hidden
                transition-all duration-500
                hover:shadow-xl ${usp.glow}
              `}>
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`
                    text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full
                    bg-gradient-to-r ${usp.gradient} text-white
                  `}>
                    {usp.badge}
                  </span>
                </div>
                
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                  bg-gradient-to-br ${usp.gradient}
                  shadow-lg ${usp.glow}
                  group-hover:scale-110 transition-transform duration-500
                `}>
                  <i className={`fa-solid ${usp.icon} text-2xl text-white`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-1">{usp.title}</h3>
                <p className="text-cyan-400 text-sm font-medium mb-3">{usp.subtitle}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{usp.description}</p>

                {/* Hover glow */}
                <div className={`
                  absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100
                  bg-gradient-to-r ${usp.gradient} blur-xl -z-10
                  transition-opacity duration-500
                `} style={{ opacity: 0.15 }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-sm mb-4">
            Semua dalam satu app. <span className="text-cyan-400 font-semibold">Gratis untuk bermula.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default USPShowcase;
