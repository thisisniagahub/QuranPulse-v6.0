import React from 'react';
import { motion } from 'framer-motion';
import {
    BrainCircuit, Mic, Target, Calculator, Users,
    Sparkles, ArrowRight, Shield
} from 'lucide-react';
import SplitText from '../ui/SplitText';
import ShinyText from '../ui/ShinyText';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Magnet } from '../ui/Magnet';

/**
 * AIAgentShowcase
 * Display the 5 QuranPulse AI agents with orbital visual + card grid.
 */

interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    spotlightColor: string;
    status: 'active' | 'beta' | 'coming';
}

const AGENTS: Agent[] = [
    {
        id: 'ustaz',
        name: 'Ustaz AI',
        role: 'Penasihat Fiqh',
        description: "Bimbingan berlandaskan mazhab Shafi'i, anti-hallucination, dengan rujukan sahih dari Quran & Hadith.",
        icon: <BrainCircuit className="w-6 h-6" />,
        color: '#1B6B5A',
        spotlightColor: 'rgba(27, 107, 90, 0.15)',
        status: 'active',
    },
    {
        id: 'qwer',
        name: 'Q-WER Coach',
        role: 'Jurulatih Tajwid',
        description: 'Kenal pasti makhraj, panjang-pendek & ghunnah melalui analisis suara real-time.',
        icon: <Mic className="w-6 h-6" />,
        color: '#C4972A',
        spotlightColor: 'rgba(196, 151, 42, 0.15)',
        status: 'active',
    },
    {
        id: 'deen',
        name: 'Deen Tracker',
        role: 'Pengurus Ibadah',
        description: 'Pantau solat, puasa sunat, zikir harian & capai streak milestone secara automatik.',
        icon: <Target className="w-6 h-6" />,
        color: '#1B6B5A',
        spotlightColor: 'rgba(27, 107, 90, 0.15)',
        status: 'active',
    },
    {
        id: 'zakat',
        name: 'Zakat Calculator',
        role: 'Penasihat Kewangan',
        description: 'Kiraan zakat pendapatan, simpanan, emas & saham mengikut nisab semasa Malaysia.',
        icon: <Calculator className="w-6 h-6" />,
        color: '#C4972A',
        spotlightColor: 'rgba(196, 151, 42, 0.15)',
        status: 'beta',
    },
    {
        id: 'halaqah',
        name: 'Halaqah Mod',
        role: 'Moderator Komuniti',
        description: 'Fasilitasi tadarus berkumpulan, moderasi kandungan, & jaringan ukhuwah global.',
        icon: <Users className="w-6 h-6" />,
        color: '#1B6B5A',
        spotlightColor: 'rgba(27, 107, 90, 0.15)',
        status: 'coming',
    },
];

const statusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Aktif
                </span>
            );
        case 'beta':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Beta
                </span>
            );
        case 'coming':
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/20 text-raudhah-teal text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-raudhah-teal/50" />
                    Segera
                </span>
            );
        default:
            return null;
    }
};

export const AIAgentShowcase: React.FC = () => {
    return (
        <section className="relative py-12 md:py-16 overflow-hidden">
            {/* Subtle gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-raudhah-ivory/50 to-white" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-grid" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-teal/5 border border-raudhah-teal/10 mb-8"
                    >
                        <Shield className="w-3 h-3 text-raudhah-teal" />
                        <ShinyText
                            text="5 AI AGENTS"
                            speed={3}
                            color="rgba(27, 107, 90, 0.4)"
                            shineColor="rgba(212, 175, 55, 0.9)"
                            className="text-[10px] font-bold uppercase tracking-[0.3em] text-raudhah-teal"
                        />
                    </motion.div>

                    <SplitText
                        text="Pasukan AI Yang Menjaga Deen Anda"
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-raudhah text-raudhah-ink mb-6 tracking-tight leading-[1.2]"
                        tag="h2"
                        splitType="words"
                        duration={0.8}
                        staggerChildren={0.05}
                        from={{ opacity: 0, y: 25, filter: 'blur(4px)' }}
                        to={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-raudhah-ink/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        Bukan satu AI — tapi <span className="text-raudhah-teal font-semibold">lima ejen khusus</span> yang
                        bekerjasama untuk menjadi asisten rohani peribadi anda.
                    </motion.p>
                </div>

                {/* Central Orb + Orbit Ring (Desktop decorative) */}
                <div className="relative">
                    {/* Decorative center orb — hidden on mobile */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none z-0">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-raudhah-teal/10 to-raudhah-gold/10 blur-3xl" />
                        <div className="absolute inset-6 rounded-full bg-white/80 backdrop-blur-xl border border-raudhah-teal/10 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-raudhah-teal/50" />
                        </div>
                    </div>

                    {/* Agent Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {AGENTS.map((agent, idx) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: '-30px' }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 60,
                                    damping: 15,
                                    delay: idx * 0.1,
                                }}
                                className={idx === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}
                            >
                                <Magnet strength={0.15}>
                                    <SpotlightCard
                                        className="h-full p-6 flex flex-col group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden"
                                        spotlightColor={agent.spotlightColor}
                                    >
                                        {/* Decorative grid pattern */}
                                        <div className="absolute inset-0 opacity-[0.02] bg-pattern-grid pointer-events-none" />

                                        <div className="flex items-start justify-between mb-5">
                                            {/* Icon */}
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                                                style={{
                                                    backgroundColor: `${agent.color}15`,
                                                    borderColor: `${agent.color}30`,
                                                    color: agent.color,
                                                }}
                                            >
                                                {agent.icon}
                                            </div>
                                            {statusBadge(agent.status)}
                                        </div>

                                        <h3 className="text-xl font-bold text-raudhah-ink mb-1 font-raudhah group-hover:text-raudhah-teal transition-colors">
                                            {agent.name}
                                        </h3>
                                        <div className="text-xs text-raudhah-ink/40 font-semibold uppercase tracking-wider mb-3">
                                            {agent.role}
                                        </div>
                                        <p className="text-sm text-raudhah-ink/60 leading-relaxed flex-1">
                                            {agent.description}
                                        </p>

                                        {/* Hover CTA */}
                                        <div className="flex items-center gap-2 mt-5 text-xs font-bold uppercase tracking-widest text-raudhah-teal opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            Terokai <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </SpotlightCard>
                                </Magnet>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIAgentShowcase;
