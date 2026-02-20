import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    BrainCircuit,
    GraduationCap,
    Users,
    Headphones,
    PieChart,
    Sparkles
} from 'lucide-react';

const BentoCard: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    className?: string;
    delay?: number;
    hasPattern?: boolean;
    stat?: string;
    accentColor?: 'teal' | 'gold';
}> = ({ title, description, icon: Icon, className, delay = 0, hasPattern = false, stat, accentColor = 'teal' }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        viewport={{ once: true }}
        className={`group relative overflow-hidden rounded-[2.5rem] p-8 glass-v7 hover:shadow-warm transition-all duration-700 ${className}`}
    >
        {/* Subtle Pattern Overlay */}
        {hasPattern && (
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none bg-pattern-grid"></div>
        )}

        {/* Raudhah Gradient Glow */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${accentColor === 'teal' ? 'from-raudhah-teal/5' : 'from-raudhah-gold/5'} via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

        {/* Icon Background (Large floating) */}
        <div className={`absolute -right-4 -bottom-4 text-9xl ${accentColor === 'teal' ? 'text-raudhah-teal/5' : 'text-raudhah-gold/5'} group-hover:scale-110 transition-all duration-700`}>
            <Icon size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 
                ${accentColor === 'teal'
                    ? 'bg-raudhah-teal/5 border-raudhah-teal/10 text-raudhah-teal group-hover:bg-raudhah-teal group-hover:text-white'
                    : 'bg-raudhah-gold/5 border-raudhah-gold/10 text-raudhah-gold group-hover:bg-raudhah-gold group-hover:text-white'}`}>
                <Icon size={24} />
            </div>
            <div>
                {stat && (
                    <div className={`text-3xl font-bold ${accentColor === 'teal' ? 'text-raudhah-teal' : 'text-raudhah-gold'} mb-1 tracking-tight font-raudhah`}>{stat}</div>
                )}
                <h3 className="text-xl font-bold text-raudhah-ink mb-2 group-hover:translate-x-1 transition-transform tracking-tight font-raudhah">{title}</h3>
                <p className="text-sm text-raudhah-ink/50 leading-relaxed font-medium group-hover:text-raudhah-ink/70 transition-colors">{description}</p>
            </div>
        </div>
    </motion.div>
);

export const BentoGridFeatures: React.FC = () => {
    return (
        <section className="relative z-10 py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 mb-6">
                        <Sparkles className="w-3 h-3 text-raudhah-teal" />
                        <span className="text-[10px] font-bold text-raudhah-teal uppercase tracking-[0.2em]">Ekosistem Lengkap</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-raudhah text-raudhah-ink mb-6 tracking-tight leading-tight">
                        Segalanya Untuk <span className="text-raudhah-teal italic">Digital Deen</span> Anda
                    </h2>
                    <p className="text-raudhah-ink/50 max-w-2xl mx-auto text-lg font-medium">
                        Satu platform bersepadu yang direka untuk meningkatkan kualiti ibadah harian anda dengan teknologi terkini.
                    </p>
                </motion.div>

                {/* Main Grid: Single col on mobile, complex bento on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-[340px]">

                    {/* Hero Feature: Quran */}
                    <BentoCard
                        title="Al-Quran Pro"
                        description="8+ Terjemahan, Smart Tafsir AI, & Audio Autentik."
                        icon={BookOpen}
                        className="md:col-span-2 lg:col-span-2 lg:row-span-2"
                        delay={0}
                        hasPattern={true}
                        accentColor="teal"
                    />

                    {/* Smart Deen - Ustaz AI */}
                    <BentoCard
                        title="Ustaz AI 2.5"
                        description="Hybrid Intelligence dengan Pematuhan Shafi'i."
                        icon={BrainCircuit}
                        className="lg:col-span-1 lg:row-span-2"
                        delay={1}
                        hasPattern={true}
                        stat="24/7"
                        accentColor="teal"
                    />

                    {/* Iqra */}
                    <BentoCard
                        title="Iqra Digital"
                        description="Pembelajaran interaktif dengan bimbingan AI."
                        icon={GraduationCap}
                        className="lg:col-span-1"
                        delay={3}
                        stat="1-6"
                        accentColor="gold"
                    />

                    {/* Prayer Stats */}
                    <BentoCard
                        title="Komuniti Global"
                        description="Ukhuwah digital dalam satu rangkaian."
                        icon={Users}
                        className="lg:col-span-1"
                        delay={2}
                        stat="10k+"
                        accentColor="teal"
                    />

                    {/* Audio Gen */}
                    <BentoCard
                        title="Neural Khatibs"
                        description="Ringkasan Khutbah dalam format audio premium."
                        icon={Headphones}
                        className="lg:col-span-1"
                        delay={4}
                        accentColor="gold"
                    />

                    {/* Analytics */}
                    <BentoCard
                        title="Analitik Ibadah"
                        description="Pantau kemajuan rohani dengan data tepat."
                        icon={PieChart}
                        className="md:col-span-2"
                        delay={5}
                        stat="Verified"
                        accentColor="teal"
                    />
                </div>
            </div>
        </section>
    );
};
