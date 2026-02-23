import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Handshake, CreditCard, Send, Copy, Check } from 'lucide-react';

interface InfaqModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfaqModal: React.FC<InfaqModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'infaq' | 'collab'>('infaq');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("860348XXXX"); // Example account
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-raudhah-teal">Support</span> & Collaborate
                            </h3>
                            <button
                                onClick={onClose}
                                title="Close Modal"
                                aria-label="Close Modal"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-2 gap-2 bg-black/20">
                            <button
                                onClick={() => setActiveTab('infaq')}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'infaq' ? 'bg-teal-600/20 text-raudhah-teal ring-1 ring-raudhah-teal/50' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Heart size={16} /> Infaq & Sedekah
                            </button>
                            <button
                                onClick={() => setActiveTab('collab')}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'collab' ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/50' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Handshake size={16} /> Collaboration
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {activeTab === 'infaq' ? (
                                <div className="space-y-6 text-center">
                                    <div className="w-16 h-16 mx-auto bg-raudhah-teal/10 rounded-full flex items-center justify-center text-raudhah-teal mb-4 animate-pulse">
                                        <Heart size={32} fill="currentColor" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Power the Ummah's Technology</h4>
                                    <p className="text-slate-400 text-sm">
                                        Your contribution helps sustain our AI servers, content creation, and keeps core features free for everyone.
                                        Be part of this <span className="text-raudhah-teal font-bold">Jariyah</span>.
                                    </p>

                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-6">
                                        <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Transfer via DuitNow / Bank</div>
                                        <div className="text-3xl font-mono text-white font-bold mb-4 tracking-wider">860348XXXX</div>
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={handleCopy}
                                                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                                            >
                                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                                {copied ? "Copied!" : "Copy Number"}
                                            </button>
                                        </div>
                                        <div className="mt-4 text-xs text-slate-500">Holder: QuranPulse Tech Solutions</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-teal-200/50">
                                        <div className="bg-teal-900/10 p-2 rounded-lg border border-raudhah-teal/10">Server Costs</div>
                                        <div className="bg-teal-900/10 p-2 rounded-lg border border-raudhah-teal/10">AI Tokens</div>
                                        <div className="bg-teal-900/10 p-2 rounded-lg border border-raudhah-teal/10">R&D</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mb-4">
                                            <Handshake size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Let's Build Together</h4>
                                        <p className="text-slate-400 text-sm">
                                            Are you a developer, designer, or content creator? We'd love to partner with you.
                                        </p>
                                    </div>

                                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name / Organization</label>
                                            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Kedai Buku Ali" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                                            <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="hello@example.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Message</label>
                                            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none" placeholder="We have an API that..." />
                                        </div>
                                        <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <Send size={16} /> Send Proposal
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
