import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, Zap, Bell, Heart, Sparkles } from 'lucide-react';

const OrbitNode = ({ icon: Icon, delay = 0, radius = 150, duration = 20, color = "teal" }: { icon: any, delay?: number, radius?: number, duration?: number, color?: "teal" | "gold" }) => (
    <motion.div
        animate={{
            rotate: [0, 360],
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay
        }}
        className="absolute top-1/2 left-1/2"
        style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
    >
        <motion.div
            animate={{
                rotate: [0, -360],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay
            }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 p-4 rounded-full border shadow-2xl backdrop-blur-3xl ${color === 'teal' ? 'bg-raudhah-teal/10 border-raudhah-teal/20 text-raudhah-teal' : 'bg-raudhah-gold/10 border-raudhah-gold/20 text-raudhah-gold'}`}
        >
            <Icon className="w-6 h-6" />
        </motion.div>
    </motion.div>
);

export const OpenClawShowcase: React.FC = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Environmental Layer */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-raudhah-teal/[0.02] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center relative z-10">
                {/* LEFT: INFORMATION WITH STAGGERED REVEAL */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 text-[10px] font-bold tracking-[0.3em] uppercase text-raudhah-teal/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-raudhah-teal animate-pulse"></div>
                        Omnichannel Intelligence
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-raudhah font-bold text-raudhah-ink leading-tight tracking-tighter">
                        Ustazah AI <br />
                        <span className="text-raudhah-teal italic"> Tanpa Sempadan.</span>
                    </h2>

                    <p className="text-raudhah-ink/70 text-xl md:text-2xl leading-relaxed max-w-xl font-medium">
                        Bukan sekadar aplikasi. Integrasi rohani yang melangkaui peranti—hadir secara proaktif di <span className="text-raudhah-teal">WhatsApp, Telegram, and Discord</span> anda.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: <Bell />, title: "Proactive Heartbeats", desc: "Nudge automatik untuk zikir & bacaan Al-Quran." },
                            { icon: <Heart />, title: "Contextual Memory", desc: "Mengingati sejarah hafalan & perjalanan anda." },
                            { icon: <Sparkles />, title: "Visual Intelligence", desc: "Menerima bimbingan visual terus dalam chat." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="flex gap-6 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-raudhah-teal/5 border border-raudhah-teal/10 backdrop-blur-xl flex items-center justify-center text-raudhah-teal group-hover:scale-110 transition-transform shadow-lg">
                                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                                </div>
                                <div>
                                    <h4 className="font-bold text-raudhah-ink text-lg mb-1">{item.title}</h4>
                                    <p className="text-sm text-raudhah-ink/50 leading-relaxed max-w-md">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT: THE INTELLIGENCE FIELD (The Antigravity Nadi) */}
                <div className="relative h-[600px] flex items-center justify-center">
                    {/* Atmospheric Glows */}
                    <div className="absolute inset-0 bg-raudhah-teal/[0.03] blur-[150px] rounded-full animate-pulse-slow"></div>

                    {/* CENTRAL NADI */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            y: [0, -10, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 w-48 h-48 bg-white/80 backdrop-blur-[50px] rounded-[3rem] border border-raudhah-teal/10 shadow-[0_50px_100px_-20px_rgba(27,107,90,0.4)] flex items-center justify-center p-10 group"
                    >
                        <img src="/logo-primary.png" className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(27,107,90,0.5)] group-hover:scale-110 transition-transform duration-700" alt="Nadi" />
                        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-raudhah-teal/5 to-transparent opacity-30"></div>
                    </motion.div>

                    {/* ORBITING NODES */}
                    <OrbitNode icon={MessageSquare} radius={180} duration={25} delay={0} />
                    <OrbitNode icon={Zap} radius={240} duration={35} delay={1} color="gold" />
                    <OrbitNode icon={ShieldCheck} radius={210} duration={30} delay={2} />

                    {/* SVG Connectivity Lines (Subtle) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                        <circle cx="50%" cy="50%" r="180" fill="none" stroke="currentColor" className="text-raudhah-teal" strokeWidth="1" strokeDasharray="5 5" />
                        <circle cx="50%" cy="50%" r="240" fill="none" stroke="currentColor" className="text-raudhah-gold" strokeWidth="1" strokeDasharray="10 10" />
                    </svg>

                    {/* Wisdom Cards Floating in 3D */}
                    <motion.div
                        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                        transition={{ duration: 7, repeat: Infinity }}
                        className="absolute top-10 right-0 p-4 rounded-2xl bg-white/80 backdrop-blur-2xl border border-raudhah-teal/10 shadow-2xl z-30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                            <span className="text-[11px] font-bold text-raudhah-ink/80 tracking-widest uppercase">Ustazah AI: Active</span>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                        transition={{ duration: 9, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-10 left-0 p-5 rounded-2xl bg-raudhah-gold/5 backdrop-blur-2xl border border-raudhah-gold/10 shadow-2xl z-30"
                    >
                        <p className="text-[10px] font-medium text-raudhah-gold/80 italic leading-snug">"Tadabbur session ready for Surah Al-Mulk."</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
