import React from 'react';
import { motion } from 'framer-motion';

const BentoCard: React.FC<{
    title: string;
    description: string;
    icon: string;
    className?: string;
    delay?: number;
    gradient?: string;
    hasPattern?: boolean;
    stat?: string; // New: Add statistic
}> = ({ title, description, icon, className, delay = 0, gradient = "from-slate-800 to-slate-900", hasPattern = false, stat }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        viewport={{ once: true }}
        className={`group relative overflow-hidden rounded-3xl p-6 border border-white/5 bg-gradient-to-br ${gradient} hover:border-cyan-500/50 transition-all duration-700 shadow-2xl ${className}`}
    >
        {/* Subtle Pattern Overlay */}
        {hasPattern && (
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none bg-pattern-grid"></div>
        )}

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Icon Background (Large floating) */}
        <div className="absolute -right-4 -bottom-4 text-9xl text-white/5 group-hover:text-cyan-500/10 group-hover:scale-110 transition-all duration-700">
            <i className={`fa-solid ${icon}`}></i>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500`}>
                <i className={`fa-solid ${icon} text-lg`}></i>
            </div>
            <div>
                {stat && (
                    <div className="text-3xl font-black text-cyan-400 mb-1 tracking-tight">{stat}</div>
                )}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light group-hover:text-slate-300 transition-colors">{description}</p>
            </div>
        </div>
    </motion.div>
);

export const BentoGridFeatures: React.FC = () => {
    return (
        <section className="relative z-10 py-24 px-4 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Everything You Need</span>
                        <br className="hidden md:block" /> for Your Digital Deen
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        A complete ecosystem designed to elevate your spiritual journey with cutting-edge technology.
                    </p>
                </motion.div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:grid-cols-[2fr_1fr_1fr] lg:grid-rows-[300px_300px_300px] h-auto">

                    {/* Hero Feature: Quran */}
                    <BentoCard
                        title="Al-Quran Pro"
                        description="Experience the Holy Book like never before with 8+ professionally focused translations, Smart Tafsir AI, and authentic audio recitations."
                        icon="fa-book-quran"
                        className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-[#051324] via-[#0a192f] to-[#050b18]"
                        delay={0}
                        hasPattern={true}
                    />

                    {/* Smart Deen - Ustaz AI */}
                    <BentoCard
                        title="Ustaz AI 2.0"
                        description="Hybrid Cloud Intelligence with Neural Voice & Shafi'i Fiqh compliance."
                        icon="fa-user-astronaut"
                        className="lg:col-span-1 lg:row-span-2 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a]"
                        delay={1}
                        hasPattern={true}
                        stat="24/7"
                    />

                    {/* Iqra */}
                    <BentoCard
                        title="Iqra Learning"
                        description="Master Arabic reading with interactive voice recognition feedback."
                        icon="fa-graduation-cap"
                        className="lg:col-span-1 bg-gradient-to-br from-[#1e3a8a] to-[#1e1b4b]"
                        delay={3}
                        stat="6 Volumes"
                    />

                    {/* Prayer Stats */}
                    <BentoCard
                        title="Global Prayers"
                        description="Muslims praying on time worldwide with our precision GPS."
                        icon="fa-users"
                        className="lg:col-span-1 bg-gradient-to-br from-[#064e3b] to-[#022c22]"
                        delay={2}
                        stat="10k+"
                    />

                    {/* Audio Gen */}
                    <BentoCard
                        title="Neural Khatibs"
                        description="AI-generated Khutbah summaries delivered in immersive audio."
                        icon="fa-headphones-simple"
                        className="lg:col-span-1 bg-gradient-to-br from-[#4c1d95] to-[#2e1065]"
                        delay={4}
                    />

                    {/* Analytics */}
                    <BentoCard
                        title="Deen Analytics"
                        description="Track your spiritual growth with detailed charts and insights."
                        icon="fa-chart-pie"
                        className="md:col-span-2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
                        delay={5}
                        stat="Verified Growth"
                    />
                </div>
            </div>
        </section>
    );
};
