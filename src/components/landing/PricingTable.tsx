import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Users, Sparkles } from 'lucide-react';
import { Magnet } from '../ui/Magnet';

type PricingPeriod = 'monthly' | 'yearly';

interface PricingTier {
    name: string;
    nameEn: string;
    price: { monthly: number; yearly: number };
    description: string;
    features: { text: string; included: boolean; highlight?: boolean }[];
    cta: string;
    popular?: boolean;
    icon: React.ReactNode;
    accent: string; // tailwind accent class
}

const PRICING_TIERS: PricingTier[] = [
    {
        name: "Asas",
        nameEn: "Basic",
        price: { monthly: 0, yearly: 0 },
        description: "Percuma selamanya",
        icon: <Sparkles className="w-5 h-5" />,
        accent: "raudhah-ink/60",
        features: [
            { text: "Quran Reader Penuh", included: true },
            { text: "Waktu Solat & Kiblat", included: true },
            { text: "Koleksi Doa Asas", included: true },
            { text: "Iqra 1 Sahaja", included: true },
            { text: "50 Soalan AI/bulan", included: true, highlight: true },
            { text: "Mode Luar Talian", included: false },
            { text: "Tanpa Iklan", included: false }
        ],
        cta: "Mula Percuma"
    },
    {
        name: "Pro",
        nameEn: "Pro",
        price: { monthly: 9.90, yearly: 99 },
        description: "Paling popular",
        icon: <Zap className="w-5 h-5" />,
        popular: true,
        accent: "raudhah-teal",
        features: [
            { text: "Semua dalam Asas", included: true },
            { text: "Iqra 1-6 Lengkap", included: true, highlight: true },
            { text: "AI Ustaz Unlimited", included: true, highlight: true },
            { text: "Mode Luar Talian", included: true },
            { text: "Sijil Digital", included: true },
            { text: "Tanpa Iklan", included: true },
            { text: "Q-WER Analysis Pro", included: true }
        ],
        cta: "Pilih Pro"
    },
    {
        name: "Keluarga",
        nameEn: "Family",
        price: { monthly: 19.90, yearly: 199 },
        description: "Untuk 4 ahli",
        icon: <Users className="w-5 h-5" />,
        accent: "raudhah-gold",
        features: [
            { text: "Semua dalam Pro", included: true },
            { text: "4 Akaun Ahli", included: true, highlight: true },
            { text: "Dashboard Ibu Bapa", included: true, highlight: true },
            { text: "Laporan Kemajuan", included: true },
            { text: "Kawalan Kandungan", included: true },
            { text: "Priority Support", included: true },
            { text: "Jimat 67%", included: true }
        ],
        cta: "Pilih Keluarga"
    }
];

const PricingTable: React.FC = () => {
    const [period, setPeriod] = useState<PricingPeriod>('monthly');

    return (
        <section id="pricing" className="py-32 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-raudhah-teal/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-gold/10 border border-raudhah-gold/20 text-raudhah-gold text-xs font-bold tracking-widest uppercase mb-6">
                        <Crown className="w-3 h-3" />
                        Pelan Harga
                    </span>
                    <h2 className="text-4xl md:text-5xl font-raudhah font-bold text-raudhah-ink mb-4 tracking-tight">
                        Pilih <span className="text-raudhah-teal">Pelan Anda</span>
                    </h2>
                    <p className="text-raudhah-ink/50 text-lg max-w-xl mx-auto mb-8 font-medium">
                        Mulakan percuma, upgrade bila-bila masa. Boleh batal bila-bila.
                    </p>

                    {/* Period Toggle */}
                    <div className="inline-flex items-center bg-raudhah-ink/5 border border-raudhah-teal/10 rounded-2xl p-1.5">
                        <button
                            onClick={() => setPeriod('monthly')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${period === 'monthly'
                                ? 'bg-raudhah-teal text-white shadow-lg shadow-raudhah-teal/20'
                                : 'text-raudhah-ink/50 hover:text-raudhah-ink'
                                }`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setPeriod('yearly')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${period === 'yearly'
                                ? 'bg-raudhah-teal text-white shadow-lg shadow-raudhah-teal/20'
                                : 'text-raudhah-ink/50 hover:text-raudhah-ink'
                                }`}
                        >
                            Tahunan
                            <span className="text-[10px] bg-raudhah-gold text-white px-2 py-0.5 rounded-full font-bold">
                                Jimat 17%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {PRICING_TIERS.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-3xl p-8 transition-all duration-300 backdrop-blur-xl ${tier.popular
                                ? 'bg-white border-2 border-raudhah-teal/30 scale-105 z-10 shadow-2xl shadow-raudhah-teal/10'
                                : 'bg-white/80 border border-raudhah-teal/10 hover:bg-white hover:shadow-xl shadow-lg'
                                }`}
                        >
                            {/* Popular Badge */}
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-raudhah-teal text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-raudhah-teal/30">
                                    Paling Popular
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border transition-all duration-300 ${tier.popular
                                        ? 'bg-raudhah-teal/10 border-raudhah-teal/20 text-raudhah-teal'
                                        : tier.accent === 'raudhah-gold'
                                            ? 'bg-raudhah-gold/10 border-raudhah-gold/20 text-raudhah-gold'
                                            : 'bg-raudhah-ink/5 border-raudhah-ink/10 text-raudhah-ink/60'
                                    }`}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-xl font-bold text-raudhah-ink mb-1 tracking-tight font-raudhah">{tier.name}</h3>
                                <p className="text-sm text-raudhah-ink/40 font-medium">{tier.description}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-2xl text-raudhah-ink/30 font-mono">RM</span>
                                    <span className={`text-5xl font-bold font-raudhah ${tier.popular ? 'text-raudhah-teal' : tier.accent === 'raudhah-gold' ? 'text-raudhah-gold' : 'text-raudhah-ink'
                                        }`}>
                                        {tier.price[period]}
                                    </span>
                                    {tier.price[period] > 0 && (
                                        <span className="text-raudhah-ink/40 font-medium text-sm ml-1">
                                            /{period === 'monthly' ? 'bulan' : 'tahun'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? 'text-raudhah-teal' : 'text-raudhah-teal/70'
                                                }`} />
                                        ) : (
                                            <X className="w-5 h-5 text-raudhah-ink/15 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={`text-sm ${feature.included
                                            ? feature.highlight
                                                ? 'text-raudhah-ink font-bold'
                                                : 'text-raudhah-ink/70'
                                            : 'text-raudhah-ink/25 line-through'
                                            }`}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Magnet strength={0.2} className="w-full">
                                <button
                                    type="button"
                                    className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${tier.popular
                                        ? 'bg-raudhah-teal text-white shadow-lg shadow-raudhah-teal/20 hover:shadow-xl hover:scale-[1.02]'
                                        : 'bg-raudhah-ink/5 text-raudhah-ink border border-raudhah-teal/10 hover:bg-raudhah-teal/10 hover:border-raudhah-teal/30'
                                        }`}
                                >
                                    {tier.cta}
                                </button>
                            </Magnet>
                        </motion.div>
                    ))}
                </div>
                {/* Footer Note */}
                <p className="text-center text-raudhah-ink/30 text-sm mt-12">
                    Semua harga dalam Ringgit Malaysia (RM). Tiada yuran tersembunyi.
                </p>
            </div>
        </section>
    );
};

export default PricingTable;
