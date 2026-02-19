import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/Button';
import { SpotlightCard } from '../ui/SpotlightCard';
import { Magnet } from '../ui/Magnet';

const QUICK_FEATURES = [
    {
        id: 'tafsir',
        title: 'Tafsir Intelligence',
        desc: 'Bukan sekadar terjemahan, tapi tadabbur mendalam bersama kecerdasan Ustazah AI.',
        icon: 'lucide:brain-circuit',
        color: 'teal'
    },
    {
        id: 'hafalan',
        title: 'Hafalan Berpusat',
        desc: 'Sistem pengulangan pintar (SRS) yang disesuaikan dengan nadi rohani anda.',
        icon: 'lucide:calendar-check',
        color: 'gold'
    },
    {
        id: 'komunitas',
        title: 'Ummah Circle 2.0',
        desc: 'Sertai ukhuwah digital global yang bermatlamat & berintegriti tinggi.',
        icon: 'lucide:users-2',
        color: 'teal'
    }
];

const FeatureQuickGrid: React.FC = () => {
    return (
        <section className="relative py-12 px-6 max-w-7xl mx-auto w-full z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {QUICK_FEATURES.map((feature, idx) => (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col h-full"
                    >
                        <SpotlightCard
                            className="h-full p-6 flex flex-col items-center text-center shadow-warm group hover:scale-[1.02] transition-all relative overflow-hidden"
                            spotlightColor={feature.color === 'gold' ? 'rgba(196, 151, 42, 0.15)' : 'rgba(27, 107, 90, 0.15)'}
                        >
                            {/* Suble background pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-pattern-grid pointer-events-none"></div>

                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-inner ${feature.color === 'gold' ? 'bg-raudhah-gold text-white' : 'bg-raudhah-teal text-white'
                                }`}>
                                <Icon icon={feature.icon} width="28" />
                            </div>
                            <h3 className="text-xl font-bold font-raudhah text-raudhah-teal mb-3">{feature.title}</h3>
                            <p className="text-sm text-raudhah-ink/60 leading-relaxed">
                                {feature.desc}
                            </p>
                        </SpotlightCard>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
            >
                <Magnet strength={0.4}>
                    <Button
                        variant="primary"
                        size="lg"
                        className="bg-raudhah-teal hover:bg-raudhah-teal/90 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-xl shadow-raudhah-teal/30 hover:shadow-raudhah-teal/50 transition-all hover:scale-[1.05] flex items-center gap-4 border-2 border-raudhah-gold/20"
                    >
                        Elevate Your Spiritual Pulse
                        <Icon icon="lucide:sparkles" width="24" className="text-raudhah-gold animate-pulse" />
                    </Button>
                </Magnet>
            </motion.div>
        </section>
    );
};

export default FeatureQuickGrid;
