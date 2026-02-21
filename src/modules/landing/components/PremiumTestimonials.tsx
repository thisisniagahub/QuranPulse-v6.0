import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import SplitText from '@/components/ui/SplitText';

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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group cursor-pointer"
    >
      <div
        className={`
          relative p-6 md:p-8 rounded-3xl
          bg-white/80 backdrop-blur-xl
          border border-raudhah-teal/10 hover:border-raudhah-teal/30
          shadow-xl shadow-raudhah-teal/5
          transition-all duration-500
          ${isHovered ? 'shadow-raudhah-teal/15 border-raudhah-gold/20' : ''}
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Gloss overlay */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-raudhah-teal/5 via-transparent to-raudhah-gold/5 opacity-50 pointer-events-none"
          style={{ transform: "translateZ(1px)" }}
        />

        {/* Content */}
        <div style={{ transform: "translateZ(20px)" }}>
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-raudhah-gold fill-raudhah-gold' : 'text-raudhah-ink/15'}`}
              />
            ))}
          </div>

          {/* Quote */}
          <p className="text-raudhah-ink/80 text-sm md:text-base leading-relaxed mb-6 italic">
            "{quote}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-raudhah-teal/20 bg-raudhah-ivory">
              <img loading="lazy" src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-raudhah-ink text-sm">{name}</p>
              <p className="text-raudhah-teal text-xs">{role}</p>
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div
          className={`
            absolute -inset-1 rounded-3xl
            bg-gradient-to-r from-raudhah-teal/10 via-raudhah-gold/10 to-raudhah-teal/10
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
      quote: "QuranPulse ubah cara saya membaca Al-Quran setiap hari. Ustaz AI jawab soalan saya serta-merta dengan rujukan sahih.",
      name: "Ahmad Razak",
      role: "Software Engineer",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#1B6B5A"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">AR</text></svg>')}`,
      rating: 5,
    },
    {
      quote: "Akhirnya ada aplikasi Islamik yang rasa premium dan moden. Tajweed highlighting sangat tepat dan membantu.",
      name: "Fatimah Zahra",
      role: "Pelajar Universiti",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#D4AF37"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">FZ</text></svg>')}`,
      rating: 5,
    },
    {
      quote: "Saya guna modul Iqra untuk ajar anak-anak. Progress tracking dan panduan sebutan memang game-changer.",
      name: "Ibrahim Hassan",
      role: "Ibu Bapa & Pendidik",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#2D2A26"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">IH</text></svg>')}`,
      rating: 5,
    },
    {
      quote: "Dalam 2 minggu, hafalan saya bertambah 3 surah. AI detection untuk tajwid sangat membantu perbaiki bacaan.",
      name: "Nurul Iman",
      role: "Hafizah",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#0D9488"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">NI</text></svg>')}`,
      rating: 5,
    },
    {
      quote: "Halaqah Komuniti buat saya rasa connected dengan ummah. Soalan-jawab dengan ustaz AI sangat bermakna.",
      name: "Mohd Firdaus",
      role: "Usahawan",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#1B6B5A"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">MF</text></svg>')}`,
      rating: 5,
    },
    {
      quote: "Notifikasi WhatsApp untuk solat dan zikir harian sangat berguna. Rasa macam ada sahabat yang ingatkan.",
      name: "Siti Khadijah",
      role: "Guru",
      avatar: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" rx="50" fill="#D4AF37"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="36" font-family="sans-serif" dominant-baseline="middle">SK</text></svg>')}`,
      rating: 5,
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-raudhah-ivory relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-grid bg-[size:80px_80px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-raudhah-teal/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-raudhah-teal/10 text-raudhah-teal font-bold tracking-widest uppercase text-xs mb-4 border border-raudhah-teal/20">
            Testimoni
          </span>
          <SplitText
            text="Dicintai Ummah Malaysia"
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-raudhah text-raudhah-ink tracking-tight"
            tag="h2"
            splitType="words"
            duration={0.7}
            staggerChildren={0.05}
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          />
          <p className="text-raudhah-ink/50 max-w-2xl mx-auto mt-4 text-base">
            Sertai ribuan Muslim Malaysia yang mempercayai QuranPulse untuk perjalanan rohani mereka.
          </p>
        </motion.div>

        {/* Cards Grid — 2 rows of 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;
