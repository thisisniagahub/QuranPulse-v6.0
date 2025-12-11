import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from './TiltCard';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <TiltCard>
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 border border-white/10 hover:border-cyan-500/30 transition-all duration-500 group h-full overflow-hidden">
        {/* Background glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
        
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${gradient} bg-opacity-20 border border-white/10`}>
          <i className={`${icon} text-2xl text-white`} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {description}
        </p>

        {/* Hover arrow */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fa-solid fa-arrow-right text-cyan-400" />
        </motion.div>
      </div>
    </TiltCard>
  </motion.div>
);

export const FeaturesShowcase = () => {
  const features = [
    {
      icon: 'fa-solid fa-robot',
      title: 'Smart Deen AI',
      description: 'Ask any Islamic question and get instant, authentic answers with Quran and Hadith references.',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
    },
    {
      icon: 'fa-solid fa-book-quran',
      title: 'Premium Quran',
      description: 'Beautiful recitation with word-by-word translation, Tajweed rules, and multiple Qari options.',
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
    {
      icon: 'fa-solid fa-mosque',
      title: 'Precision Prayer',
      description: 'Accurate prayer times with Qibla compass, Adhan notifications, and masjid finder.',
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      title: 'Iqra Academy',
      description: 'Learn to read Quran from scratch with AI pronunciation feedback and progress tracking.',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
  ];

  return (
    <section id="features" className="relative z-10 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs mb-2 block">Core Features</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
            Everything You Need for Your <span className="text-cyan-400">Deen</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A complete spiritual toolkit designed with modern Muslims in mind. Premium features, zero compromise.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
