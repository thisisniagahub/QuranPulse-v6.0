import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  duration?: number;
}

const StatItem: React.FC<StatItemProps> = ({ value, suffix, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center group"
    >
      <div className="relative">
        <span className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white">
          {value >= 1000000 ? formatNumber(count) : count}
        </span>
        <span className="text-3xl md:text-4xl font-bold text-cyan-400 ml-1">{suffix}</span>
        
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-cyan-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <p className="text-slate-400 text-sm md:text-base mt-2 uppercase tracking-widest font-medium">{label}</p>
    </motion.div>
  );
};

export const AnimatedStats = () => {
  const stats = [
    { value: 2000000, suffix: '+', label: 'Muslim Users' },
    { value: 114, suffix: '', label: 'Complete Surahs' },
    { value: 99, suffix: '.9%', label: 'Accuracy Rate' },
    { value: 4, suffix: '.9★', label: 'User Rating' },
  ];

  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs mb-2 block">Trusted Worldwide</span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
            Powered by the <span className="text-cyan-400">Ummah</span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              duration={2 + index * 0.3}
            />
          ))}
        </div>

        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </div>
    </section>
  );
};

export default AnimatedStats;
