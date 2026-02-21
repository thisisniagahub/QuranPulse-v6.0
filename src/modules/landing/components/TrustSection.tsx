import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const TrustSection: React.FC = () => {
    return (
        <section className="py-20 bg-slate-950 border-y border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                <p className="text-sm font-mono text-raudhah-teal tracking-widest uppercase mb-2">Powered By Next-Gen Tech</p>
                <h3 className="text-2xl font-bold text-white">Built for Speed, Privacy & Intelligence</h3>
            </div>

            {/* Infinite Marquee - Tech Stack */}
            <div className="relative flex overflow-x-hidden group py-4 bg-slate-900/50">
                <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                    {[
                        { name: 'Google Gemini', icon: 'logos:google-gemini' },
                        { name: 'React', icon: 'logos:react' },
                        { name: 'Supabase', icon: 'logos:supabase-icon' },
                        { name: 'Vercel', icon: 'logos:vercel-icon' },
                        { name: 'OpenAI', icon: 'logos:openai-icon' },
                        { name: 'Stripe', icon: 'logos:stripe' },
                        { name: 'TypeScript', icon: 'logos:typescript-icon' },
                        { name: 'Tailwind', icon: 'logos:tailwindcss-icon' }
                    ].map((tech, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer grayscale hover:grayscale-0">
                            <Icon icon={tech.icon} className="text-3xl" />
                            <span className="text-slate-400 font-bold text-lg hidden sm:block">{tech.name}</span>
                        </div>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {[
                        { name: 'Google Gemini', icon: 'logos:google-gemini' },
                        { name: 'React', icon: 'logos:react' },
                        { name: 'Supabase', icon: 'logos:supabase-icon' },
                        { name: 'Vercel', icon: 'logos:vercel-icon' },
                        { name: 'OpenAI', icon: 'logos:openai-icon' },
                        { name: 'Stripe', icon: 'logos:stripe' },
                        { name: 'TypeScript', icon: 'logos:typescript-icon' },
                        { name: 'Tailwind', icon: 'logos:tailwindcss-icon' }
                    ].map((tech, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-all cursor-pointer grayscale hover:grayscale-0">
                            <Icon icon={tech.icon} className="text-3xl" />
                            <span className="text-slate-400 font-bold text-lg hidden sm:block">{tech.name}</span>
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
                        className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-raudhah-teal/20 transition-colors"
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
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-raudhah-teal">
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
