import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Shield, MapPin } from 'lucide-react';

interface TrustStat {
    icon: React.ReactNode;
    value: string;
    label: string;
    iconClass: string;
}

const TRUST_STATS: TrustStat[] = [
    {
        icon: <Users className="w-5 h-5" />,
        value: "50,000+",
        label: "Keluarga Muslim",
        iconClass: "bg-raudhah-teal/10 border-raudhah-teal/20 text-raudhah-teal"
    },
    {
        icon: <Star className="w-5 h-5" />,
        value: "4.8★",
        label: "Rating Pengguna",
        iconClass: "bg-raudhah-gold/10 border-raudhah-gold/20 text-raudhah-gold"
    },
    {
        icon: <Shield className="w-5 h-5" />,
        value: "100%",
        label: "Patuh JAKIM",
        iconClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
    },
    {
        icon: <MapPin className="w-5 h-5" />,
        value: "🇲🇾",
        label: "Dibina di Malaysia",
        iconClass: "bg-rose-500/10 border-rose-500/20 text-rose-500"
    }
];

const TrustBar: React.FC = () => {
    return (
        <section className="py-16 relative overflow-hidden">
            {/* Subtle gradient lines */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-raudhah-teal/15 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-raudhah-teal/15 to-transparent"></div>

            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/60 backdrop-blur-xl border border-raudhah-teal/10 rounded-3xl p-6 md:p-8 shadow-lg shadow-raudhah-teal/5"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {TRUST_STATS.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${stat.iconClass}`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-2xl md:text-3xl font-bold font-raudhah text-raudhah-ink">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-raudhah-ink/40 mt-1 font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustBar;
