import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, BarChart3, Target, Waves, ArrowRight, CheckCircle2, AlertTriangle, Volume2 } from 'lucide-react';

interface QwerMetric {
    type: string;
    label: string;
    weight: string;
    severity: string;
    color: string;
    icon: React.ReactNode;
}

const METRICS: QwerMetric[] = [
    { type: 'makhraj', label: 'Makhraj', weight: '3.0x', severity: 'CRITICAL', color: '#EF4444', icon: <Target className="w-4 h-4" /> },
    { type: 'tajweed', label: 'Tajweed', weight: '2.5x', severity: 'HIGH', color: '#F59E0B', icon: <Waves className="w-4 h-4" /> },
    { type: 'harakat', label: 'Harakat', weight: '2.0x', severity: 'MEDIUM', color: '#22D3EE', icon: <BarChart3 className="w-4 h-4" /> },
    { type: 'rhythm', label: 'Rhythm', weight: '1.0x', severity: 'LOW', color: '#10B981', icon: <Volume2 className="w-4 h-4" /> },
];

const QwerDemoSection: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [waveformValues, setWaveformValues] = useState<number[]>(Array(20).fill(0.2));
    const [demoScore, setDemoScore] = useState(0);
    const [activeMetricIndex, setActiveMetricIndex] = useState(0);

    // Animated waveform during recording
    useEffect(() => {
        if (isRecording) {
            const interval = setInterval(() => {
                setWaveformValues(prev => prev.map(() => 0.2 + Math.random() * 0.8));
            }, 100);
            return () => clearInterval(interval);
        } else {
            setWaveformValues(Array(20).fill(0.2));
        }
    }, [isRecording]);

    // Auto-rotate metrics showcase
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetricIndex(prev => (prev + 1) % METRICS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRecordClick = () => {
        if (isRecording) {
            // Stop recording, start analysis
            setIsRecording(false);
            setIsAnalyzing(true);

            // Simulate analysis delay
            setTimeout(() => {
                setIsAnalyzing(false);
                setShowResult(true);
                setDemoScore(18.5); // Demo score
            }, 2000);
        } else {
            // Start recording
            setShowResult(false);
            setIsRecording(true);

            // Auto-stop after 5 seconds for demo
            setTimeout(() => {
                setIsRecording(false);
                setIsAnalyzing(true);
                setTimeout(() => {
                    setIsAnalyzing(false);
                    setShowResult(true);
                    setDemoScore(18.5);
                }, 2000);
            }, 5000);
        }
    };

    const resetDemo = () => {
        setShowResult(false);
        setDemoScore(0);
    };

    return (
        <section id="intelligence" className="py-24 bg-transparent relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-200/20 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-20"
                                >
                                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
                                        <BarChart3 className="w-3 h-3" />
                                        AI-Powered Analysis
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-[Poppins] font-bold text-white mb-6 tracking-tight">     
                                        <span className="text-slate-400">Q-WER</span>
                                        <span className="text-cyan-400"> Intelligence</span>
                                    </h2>
                                    <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                                        Bukan sekadar "betul atau salah". Kami ukur <span className="text-cyan-400 font-bold">ketepatan akustik</span> berdasarkan
                                        <span className="text-amber-500 font-bold"> berat teologi</span> — seperti ustaz manusia menilai. 
                                    </p>
                                </motion.div>
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-[#0c224b]/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
                            {/* Glow Effect */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#22d3ee]/10 blur-[80px] rounded-full group-hover:bg-[#22d3ee]/20 transition-all duration-700"></div>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center">
                                        <Mic className="w-5 h-5 text-[#22d3ee]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Live Demo</h4>
                                        <p className="text-xs text-slate-400 font-medium">Cuba analisis Q-WER sekarang</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                                    <span className="text-xs text-slate-400">{isRecording ? 'Recording...' : 'Ready'}</span>
                                </div>
                            </div>

                            {/* Reference Text Display */}
                            <div className="bg-black/20 rounded-2xl p-6 mb-6 border border-white/5 shadow-inner">       
                                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-bold">Reference Text</p>
                                <p className="text-2xl md:text-3xl font-arabic text-white text-center leading-relaxed" dir="rtl">
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                            </div>

                            {/* Waveform Visualizer */}
                            <div className="h-20 flex items-center justify-center gap-1 mb-8 bg-black/40 rounded-xl p-4 shadow-inner border border-white/5">
                                {waveformValues.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        className={`w-1.5 rounded-full ${isRecording ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}  
                                        animate={{ height: `${value * 100}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                ))}
                            </div>

                            {/* Control Buttons */}
                            <div className="flex gap-4">
                                <motion.button
                                    onClick={handleRecordClick}
                                    disabled={isAnalyzing}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${isRecording
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 font-bold'
                                        : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/40 hover:scale-[1.02]'
                                        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isRecording ? (
                                        <>
                                            <Square className="w-5 h-5 fill-current" />
                                            <span>Henti Rakaman</span>
                                        </>
                                    ) : isAnalyzing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"  
                                            />
                                            <span>Menganalisis...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="w-5 h-5" />
                                            <span>Mula Rakaman</span>
                                        </>
                                    )}
                                </motion.button>

                                {showResult && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onClick={resetDemo}
                                        className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors shadow-sm"
                                    >
                                        Reset
                                    </motion.button>
                                )}
                            </div>

                            {/* Result Display */}
                            <AnimatePresence>
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mt-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                <span className="font-bold text-emerald-400">Jayyid (Bagus)</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-white">{demoScore}</div>      
                                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Q-WER Score</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2 mt-4">
                                            {METRICS.map((metric, i) => (
                                                <div key={i} className="text-center p-2 rounded-lg bg-black/20 border border-white/5 shadow-sm">
                                                    <div className="text-[10px] text-slate-500 mb-1 font-bold uppercase">{metric.label}</div>
                                                    <div className="text-sm font-mono dynamic-text font-bold" style={{ '--dynamic-color': metric.color } as React.CSSProperties}>
                                                        {(Math.random() * 5 + 2).toFixed(1)}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right: Metrics Explanation */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Mengapa <span className="text-cyan-400">Q-WER</span> Berbeza?
                            </h3>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                Standard ASR (Whisper, Google) optimum untuk <span className="text-red-400/50 line-through">semantic meaning</span>.
                                Kami optimum untuk <span className="text-emerald-400 font-bold">ketepatan tajweed</span> — kerana dalam solat,
                                sebutan yang salah boleh ubah makna.
                            </p>
                        </div>

                        {/* Metrics Cards */}
                        <div className="space-y-4">
                            {METRICS.map((metric, index) => (
                                <motion.div
                                    key={metric.type}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-500 group cursor-pointer ${activeMetricIndex === index
                                        ? 'bg-white/10 border-cyan-500/30 shadow-lg shadow-cyan-600/10 scale-[1.02]'
                                        : 'bg-[#0c224b]/20 border-white/5 hover:bg-white/5'
                                        }`}
                                    onClick={() => setActiveMetricIndex(index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 dynamic-bg-15 dynamic-border-30 dynamic-text"
                                                style={{ '--dynamic-color': metric.color } as React.CSSProperties}        
                                            >
                                                {metric.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{metric.label}</h4>      
                                                <p className="text-xs text-slate-400">
                                                    {metric.type === 'makhraj' && 'Titik artikulasi huruf'}
                                                    {metric.type === 'tajweed' && 'Peraturan bacaan (Ghunnah, Idgham)'}   
                                                    {metric.type === 'harakat' && 'Baris dan tempoh bunyi'}
                                                    {metric.type === 'rhythm' && 'Kelancaran dan waqaf'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-mono font-bold dynamic-text" style={{ '--dynamic-color': metric.color } as React.CSSProperties}>
                                                {metric.weight}
                                            </div>
                                            <div
                                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full dynamic-bg-20 dynamic-text"
                                                style={{ '--dynamic-color': metric.color } as React.CSSProperties}        
                                            >
                                                {metric.severity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    <AnimatePresence>
                                        {activeMetricIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="mt-4 pt-4 border-t border-white/5"
                                            >
                                                <div className="flex items-start gap-2 text-sm text-slate-400">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                                    <p>
                                                        {metric.type === 'makhraj' && 'Kesalahan makhraj boleh menyebabkan Lahnan Jaliyy — berubah makna dan membatalkan solat dalam mazhab tertentu.'}
                                                        {metric.type === 'tajweed' && 'Ghunnah yang tertinggal atau Idgham yang tidak sempurna dikira sebagai Lahnan Khafiyy — tidak membatalkan tetapi mengurangi pahala.'}
                                                        {metric.type === 'harakat' && 'Kesalahan harakat seperti fathah menjadi dammah boleh ubah makna perkataan secara signifikan.'}
                                                        {metric.type === 'rhythm' && 'Kelancaran bacaan mempengaruhi kekhusyukan tetapi tidak membatalkan solat.'}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.a
                            href="#pricing"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 text-cyan-400 font-bold text-sm mt-6 group"        
                        >
                            Dapatkan Akses Penuh ke AI Ustaz
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                </div>

                {/* Comparison Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-gradient-to-r from-[#0c224b]/60 via-[#0c224b]/40 to-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl"
                >
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white mb-2 font-[Poppins]">18.5</div>
                            <div className="text-sm text-slate-400 font-medium">Average Q-WER Score</div>
                            <div className="text-xs text-emerald-400 font-bold mt-1 tracking-widest uppercase">INTERMEDIATE LEVEL</div>
                        </div>
                        <div className="text-center md:border-x border-white/5 px-8">
                            <div className="text-5xl font-bold text-cyan-400 mb-2 font-[Poppins]">&lt; 200ms</div>        
                            <div className="text-sm text-slate-400 font-medium">Analysis Latency</div>
                            <div className="text-xs text-cyan-400 font-bold mt-1 tracking-widest uppercase">REAL-TIME FEEDBACK</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-amber-500 mb-2 font-[Poppins]">4</div>
                            <div className="text-sm text-slate-400 font-medium">Error Categories</div>
                            <div className="text-xs text-amber-500 font-bold mt-1 tracking-widest uppercase">THEOLOGICAL WEIGHTED</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default QwerDemoSection;
