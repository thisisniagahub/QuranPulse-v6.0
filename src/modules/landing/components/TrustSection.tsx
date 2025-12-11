import React from 'react';
import { motion } from 'framer-motion';

export const TrustSection: React.FC = () => {
    return (
        <section className="py-20 bg-slate-950 border-y border-white/5 relative overflow-hidden">
             <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <p className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-2">Trusted Globally</p>
                <h3 className="text-2xl font-bold text-white">Join 2 Million+ Muslims Improving Their Deen</h3>
            </div>
            
            {/* Infinite Marquee */}
            <div className="relative flex overflow-x-hidden group">
                <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
                    {[1, 2, 3, 4, 1, 2, 3, 4].map((n, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-600 font-bold text-xl px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <i className="fa-solid fa-mosque text-3xl"></i>
                            <span>ISLAMIC CENTER {n}</span>
                        </div>
                    ))}
                    {[1, 2, 3, 4, 1, 2, 3, 4].map((n, i) => (
                         <div key={`dup-${i}`} className="flex items-center gap-2 text-slate-600 font-bold text-xl px-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <i className="fa-solid fa-mosque text-3xl"></i>
                            <span>ISLAMIC CENTER {n}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
             <div className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Dr. Aminah Lee", role: "Islamic Scholar", text: "The most authentic and verified AI companion I have come across." },
                    { name: "Yusuf Ahmed", role: "Software Engineer", text: "The UI is absolutely world-class. It feels like a premium OS for my faith." },
                    { name: "Sarah Malik", role: "Student", text: "Smart Tafsir helped me understand Surahs I've been reciting for years." }
                ].map((t, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        key={i} 
                        className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors"
                    >
                         <div className="flex text-amber-500 text-xs mb-4 gap-1">
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                            <i className="fa-solid fa-star"></i>
                        </div>
                        <p className="text-slate-300 italic mb-6">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-cyan-400">
                                {t.name.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                 <p className="text-slate-500 text-xs">{t.role}</p>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
