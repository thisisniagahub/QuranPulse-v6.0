import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, AlertTriangle, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        aria-label="Kembali"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <RotateCcw className="text-raudhah-teal" size={20} />
                            Polisi Pemulangan & Bayaran Balik
                        </h1>
                        <p className="text-xs text-slate-400">Dikemaskini: Januari 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto px-6 py-12 space-y-12"
            >
                {/* Introduction */}
                <section className="prose prose-invert prose-teal max-w-none">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        Terima kasih kerana melanggan QuranPulse. Kami menghargai kepercayaan anda dalam
                        menggunakan perkhidmatan kami. Kami juga ingin memastikan anda mempunyai pengalaman
                        yang memuaskan semasa meneroka dan menggunakan produk kami.
                    </p>
                </section>

                {/* Definitions */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Definisi dan Terma Utama</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { term: 'Syarikat', definition: 'Merujuk kepada QuranPulse Sdn Bhd yang bertanggungjawab ke atas Polisi ini.' },
                            { term: 'Pelanggan', definition: 'Syarikat, organisasi atau individu yang mendaftar untuk menggunakan Perkhidmatan QuranPulse.' },
                            { term: 'Perkhidmatan', definition: 'Merujuk kepada perkhidmatan yang disediakan oleh QuranPulse termasuk langganan Premium.' },
                            { term: 'Anda', definition: 'Individu atau entiti yang berdaftar dengan QuranPulse untuk menggunakan Perkhidmatan.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-raudhah-teal mb-1">{item.term}</h3>
                                <p className="text-sm text-slate-300">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Main Policy */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Polisi Pemulangan & Bayaran Balik</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <p className="text-slate-300 leading-relaxed">
                            Kami di QuranPulse komited untuk melayani pelanggan kami dengan perkhidmatan
                            terbaik. Setiap langganan yang anda pilih disediakan dengan penuh teliti dan
                            kualiti yang terjamin.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Dalam situasi tertentu di mana kami mungkin menghadapi masalah teknikal atau
                            sistem, kami akan memaklumkan anda terlebih dahulu. Jika anda telah membuat
                            pembayaran dalam talian, bayaran balik akan diproses setelah pasukan kami
                            mengesahkan permintaan anda.
                        </p>
                    </div>
                </section>

                {/* Policy Points */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Dasar Kami</h2>
                    <div className="space-y-3">
                        {[
                            { text: 'Langganan yang telah diaktifkan TIDAK boleh dipulangkan atau dibayar balik.', type: 'warning' },
                            { text: 'Pembatalan langganan akan berkuatkuasa pada akhir tempoh langganan semasa.', type: 'info' },
                            { text: 'Tiada bayaran balik untuk tempoh langganan yang belum digunakan.', type: 'warning' },
                            { text: 'Pembelian dalam aplikasi (In-App Purchases) adalah MUKTAMAD.', type: 'warning' },
                            { text: 'Kami berhak untuk membatalkan akaun yang melanggar terma penggunaan tanpa bayaran balik.', type: 'warning' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-3 p-4 rounded-xl border ${item.type === 'warning'
                                        ? 'bg-amber-900/20 border-amber-500/20'
                                        : 'bg-teal-900/20 border-raudhah-teal/20'
                                    }`}
                            >
                                <AlertTriangle className={`flex-shrink-0 ${item.type === 'warning' ? 'text-amber-400' : 'text-raudhah-teal'
                                    }`} size={20} />
                                <p className="text-sm text-slate-300">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exceptions */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Pengecualian</h2>
                    <div className="bg-gradient-to-br from-emerald-900/30 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                        <p className="text-slate-300 mb-4">
                            Bayaran balik BOLEH dipertimbangkan dalam situasi berikut:
                        </p>
                        <ul className="space-y-2">
                            {[
                                'Pembatalan dibuat dalam tempoh 24 jam selepas pembelian DAN langganan belum digunakan',
                                'Masalah teknikal yang berpunca daripada pihak kami yang tidak dapat diselesaikan',
                                'Caj berganda yang tidak sengaja (duplicate charge)',
                                'Pembelian yang tidak dibenarkan (unauthorized purchase) - dengan bukti',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-emerald-400 text-xs">✓</span>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Subscription Cancellation */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Pembatalan Langganan</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <p className="text-slate-300 leading-relaxed">
                            Anda boleh membatalkan langganan pada bila-bila masa melalui tetapan akaun anda
                            atau melalui App Store / Google Play Store. Selepas pembatalan:
                        </p>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-raudhah-teal"></div>
                                Anda masih boleh menggunakan ciri Premium sehingga akhir tempoh langganan semasa
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-raudhah-teal"></div>
                                Langganan tidak akan diperbaharui secara automatik
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-raudhah-teal"></div>
                                Data anda akan disimpan dan boleh diakses semula jika melanggan kembali
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Consent */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Persetujuan Anda</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Dengan menggunakan aplikasi kami, mendaftar akaun, atau membuat pembelian, anda
                        dengan ini bersetuju dengan Polisi Pemulangan & Bayaran Balik kami dan bersetuju
                        dengan termanya.
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Hubungi Kami</h2>
                    <p className="text-slate-300 mb-4">
                        Jika anda mempunyai sebarang pertanyaan tentang Polisi ini atau ingin membuat
                        permohonan bayaran balik, sila hubungi kami:
                    </p>
                    <div className="space-y-3">
                        <a href="mailto:support@quranpulse.my" className="flex items-center gap-3 text-raudhah-teal hover:text-raudhah-teal transition-colors">
                            <Mail size={18} />
                            <span>support@quranpulse.my</span>
                        </a>
                        <a href="tel:+60321234567" className="flex items-center gap-3 text-raudhah-teal hover:text-raudhah-teal transition-colors">
                            <Phone size={18} />
                            <span>+603 2123 4567</span>
                        </a>
                    </div>
                </section>

                {/* Footer Note */}
                <div className="text-center text-xs text-slate-500 pt-8 border-t border-white/5">
                    <p>© 2026 QuranPulse Sdn Bhd. Hak cipta terpelihara.</p>
                    <p className="mt-1">Dikemaskini terakhir: Januari 2026</p>
                </div>
            </motion.div>
        </div>
    );
};

export default RefundPolicy;
