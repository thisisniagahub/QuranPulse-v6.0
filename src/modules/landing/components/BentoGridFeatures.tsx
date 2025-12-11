import React from 'react';
import { motion } from 'framer-motion';

const BentoCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: string; 
    className?: string; 
    delay?: number;
    gradient?: string;
}> = ({ title, description, icon, className, delay = 0, gradient = "from-slate-800 to-slate-900" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        viewport={{ once: true }}
        className={`group relative overflow-hidden rounded-3xl p-6 border border-white/5 bg-gradient-to-br ${gradient} hover:border-cyan-500/30 transition-all duration-500 ${className}`}
    >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        
        {/* Icon Background */}
        <div className="absolute -right-4 -bottom-4 text-9xl text-white/5 group-hover:scale-110 transition-transform duration-700">
            <i className={`fa-solid ${icon}`}></i>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
            <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors`}>
                <i className={`fa-solid ${icon} text-xl`}></i>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{description}</p>
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
                        <br className="hidden md:block"/> for Your Digital Deen
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        A complete ecosystem designed to elevate your spiritual journey with cutting-edge technology.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:grid-cols-[2fr_1fr_1fr] lg:grid-rows-2 h-auto lg:h-[600px]">
                    
                    {/* Hero Feature: Quran */}
                    <BentoCard 
                        title="Al-Quran Pro"
                        description="Experience the Holy Book like never before with 8+ professionally focused translations, Smart Tafsir AI, and authentic audio recitations."
                        icon="fa-book-quran"
                        className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-cyan-900/40 to-slate-900"
                        delay={0}
                    />

                    {/* Smart Deen */}
                    <BentoCard 
                        title="Ustaz AI"
                        description="24/7 Personal Islamic Assistant trained on authentic sources."
                        icon="fa-user-astronaut"
                        className="lg:col-span-1 bg-gradient-to-br from-purple-900/40 to-slate-900"
                        delay={1}
                        gradient="from-purple-900/40 to-slate-900"
                    />

                    {/* Prayer & Adhan */}
                    <BentoCard 
                        title="Precision Prayer"
                        description="GPS-accurate times with beautiful Adhan notifications."
                        icon="fa-clock"
                        className="lg:col-span-1 bg-gradient-to-br from-amber-900/40 to-slate-900"
                        delay={2}
                    />

                     {/* Iqra */}
                     <BentoCard 
                        title="Iqra Learning"
                        description="Master Arabic reading with interactive voice recognition feedback."
                        icon="fa-graduation-cap"
                        className="lg:col-span-1 bg-gradient-to-br from-emerald-900/40 to-slate-900"
                        delay={3}
                    />

                    {/* Souq */}
                    <BentoCard 
                        title="Halal Souq"
                        description="Curated marketplace for premium Islamic lifestyle products."
                        icon="fa-shop"
                        className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-black"
                        delay={4}
                    />
                </div>
            </div>
        </section>
    );
};
