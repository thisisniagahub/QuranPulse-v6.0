import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
                            <FileText className="text-cyan-400" size={20} />
                            Terma & Polisi Privasi
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
                <section className="prose prose-invert prose-cyan max-w-none">
                    <p className="text-lg text-slate-300 leading-relaxed">
                        QuranPulse ("kami," "kita," atau "syarikat") komited untuk melindungi privasi anda.
                        Polisi Privasi ini menjelaskan bagaimana maklumat peribadi anda dikumpul, digunakan,
                        dan didedahkan oleh QuranPulse.
                    </p>
                    <p className="text-slate-400">
                        Polisi Privasi ini terpakai kepada laman web kami, dan subdomain yang berkaitan
                        (secara kolektif, "Perkhidmatan" kami) bersama dengan aplikasi QuranPulse.
                        Dengan mengakses atau menggunakan Perkhidmatan kami, anda menandakan bahawa anda
                        telah membaca, memahami, dan bersetuju dengan pengumpulan, penyimpanan, penggunaan,
                        dan pendedahan maklumat peribadi anda seperti yang diterangkan dalam Polisi Privasi
                        ini dan Terma Perkhidmatan kami.
                    </p>
                </section>

                {/* Definitions */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Scale className="text-cyan-400" size={24} />
                        Definisi dan Terma Utama
                    </h2>
                    <div className="space-y-4">
                        {[
                            { term: 'Syarikat', definition: 'Apabila polisi ini menyebut "Syarikat," "kami," "kita," atau "milik kami," ia merujuk kepada QuranPulse Sdn Bhd, yang bertanggungjawab ke atas maklumat anda di bawah Polisi Privasi ini.' },
                            { term: 'Negara', definition: 'Malaysia, di mana QuranPulse atau pemilik/pengasas QuranPulse berpangkalan.' },
                            { term: 'Pelanggan', definition: 'Merujuk kepada syarikat, organisasi atau individu yang mendaftar untuk menggunakan Perkhidmatan QuranPulse.' },
                            { term: 'Peranti', definition: 'Sebarang peranti yang disambungkan ke internet seperti telefon, tablet, komputer atau peranti lain yang boleh digunakan untuk melawat QuranPulse.' },
                            { term: 'Data Peribadi', definition: 'Sebarang maklumat yang secara langsung, tidak langsung, atau berkaitan dengan maklumat lain membolehkan pengenalpastian individu.' },
                            { term: 'Perkhidmatan', definition: 'Merujuk kepada perkhidmatan yang disediakan oleh QuranPulse seperti yang diterangkan dalam terma berkaitan dan platform ini.' },
                            { term: 'Cookie', definition: 'Sejumlah kecil data yang dijana oleh laman web dan disimpan oleh pelayar web anda. Ia digunakan untuk mengenal pasti pelayar anda dan menyediakan analitik.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="font-bold text-cyan-400 mb-2">{item.term}</h3>
                                <p className="text-sm text-slate-300">{item.definition}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Information Collection */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Shield className="text-cyan-400" size={24} />
                        Maklumat Yang Kami Kumpul
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                        <p className="text-slate-300">
                            Kami mengumpul maklumat daripada anda apabila anda melawat aplikasi kami,
                            mendaftar di laman kami, membuat pesanan, melanggan surat berita kami,
                            atau mengisi borang.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {['Nama / Nama Pengguna', 'Nombor Telefon', 'Alamat E-mel', 'Alamat Pengebilan', 'Kata Laluan'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    <span className="text-slate-300">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10">
                            <h3 className="font-bold text-white mb-3">Maklumat dari Peranti Mudah Alih</h3>
                            <p className="text-sm text-slate-400 mb-3">
                                Kami juga mengumpul maklumat dari peranti mudah alih untuk pengalaman pengguna yang lebih baik
                                (ciri-ciri ini sepenuhnya pilihan):
                            </p>
                            <div className="space-y-2">
                                {[
                                    { label: 'Lokasi (GPS)', desc: 'Untuk kiblat, waktu solat, dan ciri berasaskan lokasi' },
                                    { label: 'Kamera', desc: 'Untuk ciri scan barcode dan muat naik gambar' },
                                    { label: 'Mikrofon', desc: 'Untuk ciri Q-WER analisis bacaan dan Voice Coach' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5"></div>
                                        <div>
                                            <span className="text-white font-medium">{item.label}:</span>
                                            <span className="text-slate-400 ml-1">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How We Use Information */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Bagaimana Kami Menggunakan Maklumat</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Untuk memperibadikan pengalaman anda',
                            'Untuk menambah baik aplikasi kami',
                            'Untuk meningkatkan perkhidmatan pelanggan',
                            'Untuk memproses transaksi',
                            'Untuk menghantar e-mel berkala',
                            'Untuk mentadbir peraduan atau tinjauan',
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                                    {i + 1}
                                </div>
                                <span className="text-sm text-slate-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Data Protection */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Perlindungan Maklumat Anda</h2>
                    <div className="bg-gradient-to-br from-emerald-900/30 to-transparent border border-emerald-500/20 rounded-2xl p-6">
                        <p className="text-slate-300 leading-relaxed">
                            Kami melaksanakan pelbagai langkah keselamatan untuk menjaga keselamatan maklumat
                            peribadi anda. Kami menawarkan penggunaan pelayan yang selamat. Semua maklumat
                            sensitif dihantar melalui teknologi Secure Socket Layer (SSL) dan kemudian dienkripsi
                            ke dalam pangkalan data penyedia gerbang pembayaran kami.
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Shield className="text-emerald-400" size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-400">SSL Encryption</p>
                                <p className="text-xs text-slate-400">Semua data dienkripsi semasa penghantaran</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Cookies</h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <p className="text-slate-300 leading-relaxed mb-4">
                            QuranPulse menggunakan "Cookies" untuk mengenal pasti kawasan laman web kami yang
                            anda lawati. Cookie adalah sekeping data kecil yang disimpan pada komputer atau
                            peranti mudah alih anda oleh pelayar web anda. Kami menggunakan Cookies untuk
                            meningkatkan prestasi dan fungsi aplikasi kami tetapi tidak penting untuk penggunaannya.
                        </p>
                        <p className="text-sm text-slate-400">
                            Kebanyakan pelayar web boleh ditetapkan untuk melumpuhkan penggunaan Cookies.
                            Walau bagaimanapun, jika anda melumpuhkan Cookies, anda mungkin tidak dapat mengakses
                            fungsi pada laman web kami dengan betul. Kami tidak pernah meletakkan Maklumat
                            Pengenalan Peribadi dalam Cookies.
                        </p>
                    </div>
                </section>

                {/* PDPA Malaysia */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Akta Perlindungan Data Peribadi (PDPA) Malaysia</h2>
                    <div className="bg-gradient-to-br from-cyan-900/30 to-transparent border border-cyan-500/20 rounded-2xl p-6">
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Sebagai syarikat yang berpangkalan di Malaysia, kami mematuhi Akta Perlindungan Data
                            Peribadi 2010 (PDPA). Anda mempunyai hak untuk:
                        </p>
                        <ul className="space-y-2">
                            {[
                                'Mengakses data peribadi anda yang kami simpan',
                                'Membetulkan data peribadi anda yang tidak tepat',
                                'Menarik balik persetujuan anda untuk pemprosesan data',
                                'Membuat aduan kepada Pesuruhjaya Perlindungan Data Peribadi',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-cyan-400 text-xs">✓</span>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Changes */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6">Perubahan Kepada Polisi Privasi</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Kami boleh mengubah Perkhidmatan dan polisi kami, dan mungkin perlu membuat perubahan
                        kepada Polisi Privasi ini supaya ia mencerminkan Perkhidmatan dan polisi kami dengan tepat.
                        Melainkan dikehendaki selainnya oleh undang-undang, kami akan memberitahu anda sebelum
                        membuat perubahan kepada Polisi Privasi ini dan memberi anda peluang untuk menyemaknya
                        sebelum ia berkuatkuasa. Kemudian, jika anda terus menggunakan Perkhidmatan, anda akan
                        terikat dengan Polisi Privasi yang dikemas kini.
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Hubungi Kami</h2>
                    <p className="text-slate-300 mb-4">
                        Jika anda mempunyai sebarang soalan tentang Polisi Privasi ini, sila hubungi kami:
                    </p>
                    <div className="space-y-2 text-sm">
                        <p className="text-slate-400">
                            <span className="text-white font-medium">E-mel:</span> privacy@quranpulse.my
                        </p>
                        <p className="text-slate-400">
                            <span className="text-white font-medium">Alamat:</span> QuranPulse Sdn Bhd, Kuala Lumpur, Malaysia
                        </p>
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

export default TermsOfService;
