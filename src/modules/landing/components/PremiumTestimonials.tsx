import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, avatar, rating }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group cursor-pointer"
    >
      <div 
        className={`
          relative p-6 md:p-8 rounded-3xl 
          bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90
          border border-white/10 hover:border-cyan-500/30
          backdrop-blur-xl
          shadow-2xl shadow-black/50
          transition-all duration-500
          ${isHovered ? 'shadow-cyan-500/10' : ''}
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Gloss/Reflection overlay */}
        <div 
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"
          style={{ transform: "translateZ(1px)" }}
        />

        {/* Content */}
        <div style={{ transform: "translateZ(30px)" }}>
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i} 
                className={`fa-solid fa-star text-sm ${i < rating ? 'text-amber-400' : 'text-slate-600'}`}
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 italic">
            "{quote}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500/30">
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{name}</p>
              <p className="text-cyan-400 text-xs">{role}</p>
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div 
          className={`
            absolute -inset-1 rounded-3xl 
            bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 
            blur-xl opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 -z-10
          `}
        />
      </div>
    </motion.div>
  );
};

export const PremiumTestimonials = () => {
  const testimonials = [
    {
      quote: "QuranPulse has transformed my daily Quran recitation. The AI Ustaz feature answers my questions instantly with authentic sources.",
      name: "Ahmad Razak",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/100?img=11",
      rating: 5,
    },
    {
      quote: "Finally, an Islamic app that feels premium and modern. The Tajweed highlighting is incredibly accurate.",
      name: "Fatimah Zahra",
      role: "University Student",
      avatar: "https://i.pravatar.cc/100?img=25",
      rating: 5,
    },
    {
      quote: "I use Iqra module to teach my children. The progress tracking and pronunciation guide are game-changers.",
      name: "Ibrahim Hassan",
      role: "Parent & Educator",
      avatar: "https://i.pravatar.cc/100?img=15",
      rating: 5,
    },
  ];

  return (
    <section className="relative z-10 py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-cyan-500 font-bold tracking-widest uppercase text-xs mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-white mb-4">
            Loved by the <span className="text-cyan-400">Ummah</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join millions of Muslims worldwide who trust QuranPulse for their spiritual journey.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 perspective-1000">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;
