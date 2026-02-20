import React from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Clock, Sparkles, CheckCheck, Zap } from 'lucide-react';
import SplitText from '../ui/SplitText';
import ShinyText from '../ui/ShinyText';
import { CountUp } from '../ui/CountUp';

/**
 * WhatsAppProactiveSection
 * "AI yang tak tunggu ko tanya — dia yang ingatkan ko."
 *
 * Showcases the proactive prayer reminder feature via WhatsApp/Telegram.
 * Animated chat bubble mockup + stats.
 */

const CHAT_MESSAGES = [
    {
        type: 'bot' as const,
        text: '🕐 Assalamualaikum! Asar masuk dalam 15 minit. Sudah berwudhu? 💧',
        time: '15:30',
        delay: 0.5,
    },
    {
        type: 'user' as const,
        text: 'Jazakallahu khayr, belum lagi!',
        time: '15:31',
        delay: 1.2,
    },
    {
        type: 'bot' as const,
        text: '🤲 InshaAllah dipermudahkan. Surah yang disyorkan hari ini: Al-Kahf ayat 10.\n\n"Wahai Tuhan kami, kurniakanlah kami rahmat dari sisi-Mu..."',
        time: '15:31',
        delay: 1.8,
    },
    {
        type: 'bot' as const,
        text: '🔥 Streak anda: 14 hari solat on-time! Jangan putus! 💪',
        time: '15:32',
        delay: 2.5,
    },
];

const ChatBubble: React.FC<{
    type: 'bot' | 'user';
    text: string;
    time: string;
    delay: number;
}> = ({ type, text, time, delay }) => {
    const isBot = type === 'bot';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}
        >
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative ${isBot
                    ? 'bg-white border border-raudhah-teal/10 text-raudhah-ink shadow-sm rounded-tl-md'
                    : 'bg-raudhah-teal text-white rounded-tr-md shadow-lg shadow-raudhah-teal/20'
                    }`}
            >
                <p className="whitespace-pre-line">{text}</p>
                <div className={`flex items-center gap-1 mt-1 ${isBot ? 'text-raudhah-ink/30' : 'text-white/60'}`}>
                    <span className="text-[10px]">{time}</span>
                    {!isBot && <CheckCheck className="w-3 h-3 text-blue-300" />}
                </div>
            </div>
        </motion.div>
    );
};

export const WhatsAppProactiveSection: React.FC = () => {
    return (
        <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-raudhah-ivory to-white">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-pattern-dots-raudhah" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-8">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <ShinyText
                                text="KILLER FEATURE"
                                speed={3}
                                color="rgba(34, 197, 94, 0.4)"
                                shineColor="rgba(34, 197, 94, 0.9)"
                                className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-700"
                            />
                        </div>

                        <SplitText
                            text="AI Yang Memimpin, Bukan Menunggu"
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-raudhah text-raudhah-ink mb-6 tracking-tight leading-tight"
                            tag="h2"
                            splitType="words"
                            duration={0.8}
                            staggerChildren={0.05}
                            from={{ opacity: 0, y: 25 }}
                            to={{ opacity: 1, y: 0 }}
                        />

                        <p className="text-lg text-raudhah-ink/60 mb-8 leading-relaxed max-w-lg">
                            QuranPulse tak tunggu kau buka app. Dia{' '}
                            <span className="text-raudhah-teal font-semibold">proaktif mengingatkan</span> kau
                            waktu solat, bacaan harian, dan milestone rohani — terus ke WhatsApp atau Telegram.
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 mb-10">
                            <div>
                                <div className="text-3xl font-bold text-raudhah-teal">
                                    <CountUp end={42000} suffix="+" duration={2.5} />
                                </div>
                                <div className="text-sm text-raudhah-ink/40 mt-1">Peringatan Solat Dihantar</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-raudhah-gold">
                                    <CountUp end={97} suffix="%" duration={2} />
                                </div>
                                <div className="text-sm text-raudhah-ink/40 mt-1">Kadar Buka Mesej</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-raudhah-teal">
                                    <CountUp end={24} suffix="/7" duration={1.5} />
                                </div>
                                <div className="text-sm text-raudhah-ink/40 mt-1">Sentiasa Berjaga</div>
                            </div>
                        </div>

                        {/* Features list */}
                        <div className="space-y-3">
                            {[
                                { icon: Bell, text: 'Peringatan solat 15 minit sebelum masuk waktu' },
                                { icon: Clock, text: 'Reminder bacaan harian & wirid malam' },
                                { icon: Zap, text: 'Notifikasi streak & pencapaian milestone' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3 text-sm text-raudhah-ink/70"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-raudhah-teal/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-4 h-4 text-raudhah-teal" />
                                    </div>
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: WhatsApp Chat Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Phone Frame */}
                        <div className="relative mx-auto max-w-sm">
                            {/* Glow behind phone */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-raudhah-teal/20 rounded-[3rem] blur-3xl -z-10" />

                            {/* Phone shell */}
                            <div className="bg-white rounded-[2.5rem] border border-raudhah-teal/10 shadow-2xl shadow-raudhah-teal/10 overflow-hidden">
                                {/* Status bar */}
                                <div className="bg-raudhah-teal px-6 py-3 flex items-center justify-between">
                                    <span className="text-white/60 text-xs">3:30 PM</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 bg-white/60 rounded-full" />
                                        <div className="w-1 h-1 bg-white/60 rounded-full" />
                                        <div className="w-1 h-1 bg-white/60 rounded-full" />
                                    </div>
                                </div>

                                {/* Chat header */}
                                <div className="bg-raudhah-teal/95 px-4 py-3 flex items-center gap-3 border-b border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">QuranPulse AI</div>
                                        <div className="text-white/60 text-xs flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                                            Online • Proactive Mode
                                        </div>
                                    </div>
                                </div>

                                {/* Chat area */}
                                <div className="p-4 min-h-[350px] bg-gradient-to-b from-raudhah-ivory to-white">
                                    {/* Date divider */}
                                    <div className="flex justify-center mb-4">
                                        <span className="text-[10px] text-raudhah-ink/30 bg-raudhah-teal/5 px-3 py-1 rounded-full">
                                            Hari ini
                                        </span>
                                    </div>

                                    {CHAT_MESSAGES.map((msg, i) => (
                                        <ChatBubble key={i} {...msg} />
                                    ))}
                                </div>

                                {/* Input bar */}
                                <div className="px-4 py-3 border-t border-raudhah-teal/5 flex items-center gap-3 bg-white">
                                    <div className="flex-1 h-9 rounded-full bg-raudhah-ivory border border-raudhah-teal/10 flex items-center px-4">
                                        <span className="text-xs text-raudhah-ink/30">Balas...</span>
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-raudhah-teal flex items-center justify-center">
                                        <MessageCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhatsAppProactiveSection;
