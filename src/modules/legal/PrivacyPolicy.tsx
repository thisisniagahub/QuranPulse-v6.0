import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-maze opacity-[0.03]" />
            </div>

            {/* Header / Navigation */}
            <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center group-hover:border-cyan-500/40 transition-all">
                            <i className="fa-solid fa-arrow-left text-cyan-400"></i>
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">Kembali ke Utama</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                            <i className="fa-solid fa-shield-halved text-cyan-400 text-sm"></i>
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-500/80">Compliance Verified</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    {/* Hero Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            Polisi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Privasi</span>
                        </h1>
                        <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.2em]">
                            Last Updated: 21 Disember 2025
                        </p>
                    </div>

                    {/* Content Glass Cards */}
                    <div className="space-y-8 text-lg leading-relaxed">
                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md hover:border-cyan-500/20 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">01</span>
                                Mukadimah
                            </h2>
                            <p>
                                Selamat datang ke **QuranPulse**. Kami amat menghargai kepercayaan anda dan komited untuk melindungi data peribadi anda selaras dengan **Akta Perlindungan Data Peribadi 2010 (PDPA)** di Malaysia dan prinsip-prinsip etika data Islamik.
                            </p>
                        </section>

                        <section className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                                <h3 className="text-xl font-bold text-white mb-4">Maklumat yang Kami Kumpul</h3>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-cyan-500 mt-1"></i> Akaun & Profil (Emel/Telefon)</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-cyan-500 mt-1"></i> Telegram ID & WhatsApp ID</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-cyan-500 mt-1"></i> Kemajuan Ibadah (Quran/Iqra/Solat)</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-cyan-500 mt-1"></i> Sejarah Perbualan Ustazah AI</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                                <h3 className="text-xl font-bold text-white mb-4">Tujuan Penggunaan</h3>
                                <ul className="space-y-3 text-sm text-slate-400">
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-purple-500 mt-1"></i> Penyatuan Ekosistem Web & Bot</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-purple-500 mt-1"></i> Personalisasi Bimbingan Agama</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-purple-500 mt-1"></i> Notifikasi Waktu Solat & Streak</li>
                                    <li className="flex gap-3"><i className="fa-solid fa-check text-purple-500 mt-1"></i> Keselamatan Akaun (OTP)</li>
                                </ul>
                            </div>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">02</span>
                                Kongsian Pihak Ketiga
                            </h2>
                            <p className="mb-6">
                                Kami **tidak menjual** data anda. Data hanya diproses oleh rakan teknologi kami untuk kefungsian sistem:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                                    <div className="text-cyan-400 font-bold mb-1">Supabase</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-50 text-white">Cloud Database</div>
                                </div>
                                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                                    <div className="text-purple-400 font-bold mb-1">Gemini / Groq</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-50 text-white">AI Engine</div>
                                </div>
                                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                                    <div className="text-amber-400 font-bold mb-1">ElevenLabs</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-50 text-white">Audio Synthesis</div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm">03</span>
                                Adab & Amanah Data
                            </h2>
                            <p className="text-slate-300 italic">
                                "Sebagai platform Islamik, kami memegang prinsip **Amanah** dalam menguruskan data anda. Kami memastikan penggunaan AI dan data tidak melanggar adab-adab Islamiah dan sentiasa mengutamakan privasi pengguna di ruang digital."
                            </p>
                        </section>

                        <div className="text-center pt-8">
                            <p className="text-slate-500 text-sm mb-4">Sebarang persoalan? Hubungi sokongan kami</p>
                            <a
                                href="mailto:support@quranpulse.my"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all hover:scale-105"
                            >
                                <i className="fa-solid fa-envelope text-cyan-400"></i>
                                support@quranpulse.my
                            </a>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer Minimal */}
            <footer className="relative z-10 border-t border-white/5 py-12 text-center">
                <p className="text-slate-600 text-xs tracking-widest uppercase">
                    © 2025 QuranPulse Ecosystem. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
