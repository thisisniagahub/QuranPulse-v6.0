import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Shield, MapPin } from 'lucide-react';

interface TrustStat {
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
}

const TRUST_STATS: TrustStat[] = [
    {
        icon: <Users className="w-5 h-5" />,
        value: "50,000+",
        label: "Keluarga Muslim",
        color: "#22D3EE"
    },
    {
        icon: <Star className="w-5 h-5" />,
        value: "4.8★",
        label: "Rating Pengguna",
        color: "#FBBF24"
    },
    {
        icon: <Shield className="w-5 h-5" />,
        value: "100%",
        label: "Patuh JAKIM",
        color: "#10B981"
    },
    {
        icon: <MapPin className="w-5 h-5" />,
        value: "🇲🇾",
        label: "Dibina di Malaysia",
        color: "#EC4899"
    }
];

const TrustBar: React.FC = () => {
    return (
        <section className="py-12 bg-transparent relative overflow-hidden">
            {/* Subtle gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent"></div>

                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#0c224b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"      
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
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 dynamic-bg-15 dynamic-border-30 dynamic-text"
                                                    style={{ '--dynamic-color': stat.color } as React.CSSProperties}
                                                >
                                                    {stat.icon}
                                                </div>
                                                <div>
                                                    <div
                                                        className="text-2xl md:text-3xl font-bold font-[Poppins] dynamic-text drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"        
                                                        style={{ '--dynamic-color': stat.color } as React.CSSProperties}
                                                    >
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>        </section>
    );
};

export default TrustBar;
