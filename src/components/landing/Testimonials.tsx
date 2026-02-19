import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    location: string;
    quote: string;
    rating: number;
    avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: "Puan Aisha",
        role: "Ibu 3 Anak",
        location: "Selangor",
        quote: "Anak saya dah boleh baca Iqra 3 dalam sebulan! AI Ustaz sangat sabar dan membantu. Syukur ada app macam ni.",
        rating: 5,
        avatar: "/testimonial-mother.png"
    },
    {
        id: 2,
        name: "Ustaz Ahmad",
        role: "Guru Tahfiz",
        location: "Kelantan",
        quote: "AI yang patuh syarak dan mazhab Syafi'i. Saya recommend kepada semua murid saya. Ini teknologi untuk taqwa.",
        rating: 5,
        avatar: "/testimonial-ustaz.png"
    },
    {
        id: 3,
        name: "Akhil Rahman",
        role: "Software Engineer",
        location: "Kuala Lumpur",
        quote: "Sesuai untuk professional sibuk macam saya. Boleh belajar mengaji dalam masa singkat. Q-WER score memang accurate!",
        rating: 5,
        avatar: "/testimonial-professional.png"
    },
    {
        id: 4,
        name: "Siti Nurhaliza",
        role: "Mualaf",
        location: "Johor Bahru",
        quote: "Sebagai mualaf, app ini sangat membantu. AI Ustaz jawab semua soalan saya dengan dalil. Alhamdulillah.",
        rating: 5,
        avatar: "/testimonial-mualaf.png"
    }
];

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    return (
        <section id="testimonials" className="py-32 relative overflow-hidden">
            {/* Subtle background glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-raudhah-teal/5 rounded-full blur-[150px] -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-raudhah-gold/5 rounded-full blur-[150px] translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-raudhah-gold/10 border border-raudhah-gold/20 text-raudhah-gold text-xs font-bold tracking-widest uppercase mb-6">
                        <Star className="w-3 h-3 fill-current" />
                        Testimoni
                    </span>
                    <h2 className="text-4xl md:text-5xl font-raudhah font-bold text-raudhah-ink mb-4 tracking-tight">
                        Dipercayai <span className="text-raudhah-teal">Ribuan Keluarga</span>
                    </h2>
                    <p className="text-raudhah-ink/50 text-lg max-w-xl mx-auto font-medium">
                        Dengar sendiri pengalaman pengguna QuranPulse dari seluruh Malaysia.
                    </p>
                </motion.div>

                {/* Testimonial Carousel */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/80 backdrop-blur-xl border border-raudhah-teal/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-raudhah-teal/5"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-8 right-8 w-16 h-16 text-raudhah-teal/5" />

                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-raudhah-teal/10 to-transparent border border-raudhah-teal/15 overflow-hidden shadow-lg shadow-raudhah-teal/5">
                                        <img loading="lazy"
                                            src={TESTIMONIALS[currentIndex].avatar}
                                            alt={TESTIMONIALS[currentIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    {/* Rating */}
                                    <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                                        {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-raudhah-gold fill-current" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="text-xl md:text-2xl text-raudhah-ink/80 font-light leading-relaxed mb-6 italic">
                                        "{TESTIMONIALS[currentIndex].quote}"
                                    </blockquote>
                                    {/* Author */}
                                    <div>
                                        <div className="font-bold text-raudhah-ink text-lg tracking-tight font-raudhah">
                                            {TESTIMONIALS[currentIndex].name}
                                        </div>
                                        <div className="text-sm text-raudhah-ink/40 font-medium uppercase tracking-wider">
                                            {TESTIMONIALS[currentIndex].role} • {TESTIMONIALS[currentIndex].location}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={goToPrevious}
                            className="w-12 h-12 rounded-full bg-white border border-raudhah-teal/10 flex items-center justify-center text-raudhah-ink/30 hover:bg-raudhah-teal/5 hover:text-raudhah-teal hover:border-raudhah-teal/20 transition-all shadow-sm"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-2">
                            {TESTIMONIALS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsAutoPlaying(false);
                                        setCurrentIndex(index);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-raudhah-teal w-6'
                                        : 'bg-raudhah-ink/10 w-2 hover:bg-raudhah-ink/20'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={goToNext}
                            className="w-12 h-12 rounded-full bg-white border border-raudhah-teal/10 flex items-center justify-center text-raudhah-ink/30 hover:bg-raudhah-teal/5 hover:text-raudhah-teal hover:border-raudhah-teal/20 transition-all shadow-sm"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
