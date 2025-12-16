import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "Adakah jawapan Ustaz AI boleh dipercayai?",
        a: "Ya. Ustaz AI diprogramkan dengan 'Strict Safety Layer' yang hanya membenarkan rujukan daripada Al-Quran, Hadis Sahih (Bukhari/Muslim), dan garis panduan JAKIM. Ia TIDAK akan mengeluarkan fatwa sendiri."
    },
    {
        q: "Mazhab apa yang digunakan?",
        a: "Secara lalai (default), Ustaz AI berpegang kepada Mazhab Syafi'i, selaras dengan amalan rasmi umat Islam di Malaysia. Namun, ia juga boleh menerangkan pandangan jumhur jika diminta."
    },
    {
        q: "Adakah app ini percuma?",
        a: "QuranPulse adalah PERCUMA untuk kegunaan asas (Quran, Waktu Solat, Kiblat, Iqra Level 1). Ciri premium seperti Unlimited AI Chat dan Iqra Full Level memerlukan langganan mampu milik."
    },
    {
        q: "Bolehkah saya belajar mengaji dari kosong?",
        a: "Sudah tentu! Modul 'Iqra Digital' kami direka khusus untuk pemula. Ia bermula dari kenal huruf (Alif, Ba, Ta) sehinggalah lancar membaca ayat."
    }
];

export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 relative z-10 bg-gradient-to-b from-[#020617] to-black">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">Soalan Lazim</h2>
                    <p className="text-slate-400">Keraguan anda, kami jawab.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-white/10 rounded-2xl bg-slate-900/30 overflow-hidden transition-all hover:border-cyan-500/30">
                            <button 
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <span className={`font-bold ${activeIndex === idx ? 'text-cyan-400' : 'text-slate-200'}`}>{faq.q}</span>
                                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`}></i>
                            </button>
                            <AnimatePresence>
                                {activeIndex === idx && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
