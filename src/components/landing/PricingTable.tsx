import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Users, Sparkles } from 'lucide-react';

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
    color: string;
}

const PRICING_TIERS: PricingTier[] = [
    {
        name: "Asas",
        nameEn: "Basic",
        price: { monthly: 0, yearly: 0 },
        description: "Percuma selamanya",
        icon: <Sparkles className="w-5 h-5" />,
        color: "#94A3B8",
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
        color: "#22D3EE",
        popular: true,
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
        color: "#8B5CF6",
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
        <section id="pricing" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-200/20 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[#22d3ee] text-xs font-bold tracking-widest uppercase mb-6">
                        <Crown className="w-3 h-3" />
                        Pelan Harga
                    </span>
                    <h2 className="text-4xl md:text-5xl font-[Montserrat] font-bold text-slate-800 mb-4 tracking-tight">
                        Pilih <span className="text-cyan-600">Pelan Anda</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-xl mx-auto mb-8 font-medium">
                        Mulakan percuma, upgrade bila-bila masa. Boleh batal bila-bila.
                    </p>

                    {/* Period Toggle */}
                    <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setPeriod('monthly')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${period === 'monthly'
                                ? 'bg-[#22d3ee] text-[#020617]'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Bulanan
                        </button>
                        <button
                            onClick={() => setPeriod('yearly')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${period === 'yearly'
                                ? 'bg-[#22d3ee] text-[#020617]'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Tahunan
                            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
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
                            className={`relative rounded-[2rem] p-8 transition-all duration-300 ${tier.popular
                                ? 'bg-white border-2 border-cyan-500 scale-105 z-10 shadow-2xl shadow-cyan-200'
                                : 'bg-white/60 border border-white/80 hover:bg-white/80 shadow-sm'
                                }`}
                        >
                            {/* Popular Badge */}
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#22d3ee] text-[#020617] px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Paling Popular
                                </div>
                            )}

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div
                                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border dynamic-bg-15 dynamic-border-30 dynamic-text"
                                    style={{ '--dynamic-color': tier.color } as React.CSSProperties}
                                >
                                    {tier.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-1">{tier.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{tier.description}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-2xl text-slate-400">RM</span>
                                    <span
                                        className="text-5xl font-bold font-[Montserrat] dynamic-text"
                                        style={{ '--dynamic-color': tier.color } as React.CSSProperties}
                                    >
                                        {tier.price[period]}
                                    </span>
                                    {tier.price[period] > 0 && (
                                        <span className="text-slate-600 font-medium">
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
                                            <Check
                                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                                style={{ color: tier.color }}
                                            />
                                        ) : (
                                            <X className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={`text-sm ${feature.included
                                            ? feature.highlight
                                                ? 'text-slate-900 font-bold'
                                                : 'text-slate-700'
                                            : 'text-slate-400 line-through'
                                            }`}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${tier.popular
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 hover:scale-[1.02]'
                                    : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-white hover:border-cyan-300'
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <p className="text-center text-slate-500 text-sm mt-12">
                    Semua harga dalam Ringgit Malaysia (RM). Tiada yuran tersembunyi.
                </p>
            </div>
        </section>
    );
};

export default PricingTable;
