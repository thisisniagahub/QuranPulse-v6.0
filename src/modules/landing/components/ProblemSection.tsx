import React from 'react';
import { motion } from 'framer-motion';

export const ProblemSection = () => {
  const problems = [
    {
      icon: "fa-rectangle-ad",
      title: "Iklan Mengganggu Khushuk",
      desc: "Tengah bermunajat, tiba-tiba keluar iklan yang tidak sepatutnya. Hilang mood & barakah ibadah digital."
    },
    {
      icon: "fa-layer-group",
      title: "Lambakan App Berasingan",
      desc: "Satu app untuk Solat, satu untuk Quran. Phone serabut, memori penuh, dan sukar diurus secara bersepadu."
    },
    {
      icon: "fa-user-slash",
      title: "Tiada Bimbingan Sahih",
      desc: "Bila ada kemusykilan, sukar mencari rujukan yang pantas & berautoriti. Google sering memberi jawapan yang umum."
    }
  ];

  return (
    <section className="py-24 relative z-10 overflow-hidden bg-raudhah-ivory">
      {/* Background Ornate Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-grid"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-raudhah-teal font-bold tracking-widest uppercase text-[10px] mb-4 block font-mono">KEADAAN SEMASA</span>
          <h2 className="text-3xl md:text-5xl font-bold font-raudhah text-raudhah-ink mb-6">
            Kenapa Ibadah Digital <br />
            <span className="text-raudhah-teal">Sering Terganggu?</span>
          </h2>
          <p className="text-raudhah-ink/60 max-w-2xl mx-auto text-lg leading-relaxed font-normal">
            Kami menganalisis pelbagai platform gaya hidup Muslim. <br /> Majoritinya masih gagal memberi ketenangan yang hakiki.
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
              className="group relative bg-white border border-raudhah-teal/5 hover:border-raudhah-teal/20 rounded-3xl p-8 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-raudhah-teal/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${item.icon} text-2xl text-raudhah-teal`}></i>
              </div>
              <h3 className="text-xl font-bold text-raudhah-ink mb-3 group-hover:text-raudhah-teal transition-colors font-raudhah">{item.title}</h3>
              <p className="text-raudhah-ink/60 text-sm leading-relaxed">{item.desc}</p>

              {/* Status Mark */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-circle-exclamation text-raudhah-gold text-xl"></i>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Solution Bridge */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="h-16 w-px bg-gradient-to-b from-raudhah-teal/0 via-raudhah-teal/30 to-raudhah-teal/50"></div>
            <div className="px-6 py-2 rounded-full border border-raudhah-teal/20 bg-white text-raudhah-teal text-sm font-bold shadow-sm">
              Kini Hadir Penyelesaiannya.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
