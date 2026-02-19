import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "Adakah jawapan Ustazah AI boleh dipercayai?",
        a: "Ya. Ustazah AI diprogramkan dengan lapisan keselamatan 'Strict Shafi'i' yang merujuk kepada Al-Quran, Hadis Sahih, dan garis panduan JAKIM. Ia tidak akan mengeluarkan fatwa tanpa rujukan yang sahih."
    },
    {
        q: "Mazhab apa yang digunakan sebagai rujukan?",
        a: "Secara lalai, Ustazah AI merujuk kepada Mazhab Syafi'i, selaras dengan amalan rasmi umat Islam di Malaysia. Namun, ia juga boleh menerangkan pandangan jumhur ulama jika diperlukan untuk konteks tertentu."
    },
    {
        q: "Adakah akses 'Genesis' benar-benar percuma?",
        a: "Benar. 1,000 pendaftar terawal (Genesis Batch) akan mendapat akses PRO selamanya sebagai tanda penghargaan kami terhadap penyokong awal visi 'Teknologi untuk Taqwa'."
    },
    {
        q: "Bolehkah saya belajar mengaji dari peringkat asas?",
        a: "Sudah tentu. Modul 'Iqra Digital' kami direka khusus untuk membimbing anda dari mengenal huruf hijaiyah sehinggalah lancar membaca ayat Al-Quran dengan tajwid yang betul."
    }
];

export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 relative z-10 bg-raudhah-ivory">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-grid"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-raudhah text-raudhah-ink mb-4">Soalan Lazim</h2>
                    <p className="text-raudhah-ink/60 font-medium">Penjelasan telus untuk ketenangan jiwa anda.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border border-transparent rounded-2xl glass-v7 overflow-hidden transition-all duration-500 hover:border-raudhah-teal/20 shadow-xl shadow-raudhah-teal/5 border-raudhah-gradient">
                            <button
                                onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <span className={`font-bold font-raudhah ${activeIndex === idx ? 'text-raudhah-teal' : 'text-raudhah-ink'}`}>{faq.q}</span>
                                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-raudhah-teal' : 'text-raudhah-ink/30'}`}></i>
                            </button>
                            <AnimatePresence>
                                {activeIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-raudhah-ink/60 text-sm leading-relaxed border-t border-raudhah-teal/5 pt-4 font-normal">
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
