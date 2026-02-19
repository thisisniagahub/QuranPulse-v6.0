/**
 * 💎 Subscription Page — Pro Plan Selection & Payment
 * 
 * Displays pricing cards for QuranPulse Pro plans
 * and initiates ToyyibPay payment flow.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Users, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { SUBSCRIPTION_PLANS, toyyibPay, ToyyibPayService } from '../../services/toyyibPayService';
import type { PaymentPlan } from '../../services/toyyibPayService';

const SubscriptionPage: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubscribe = async (plan: PaymentPlan) => {
        setIsProcessing(true);
        setError(null);
        setSelectedPlan(plan);

        try {
            const bill = await toyyibPay.createBill(plan, 'current-user-id', 'user@email.com');
            // Redirect to payment page
            window.location.href = bill.billUrl;
        } catch (err) {
            setError('Gagal memproses pembayaran. Sila cuba lagi.');
            setIsProcessing(false);
        }
    };

    const getPlanIcon = (planId: string) => {
        switch (planId) {
            case 'pro_monthly': return <Crown className="w-6 h-6" />;
            case 'pro_yearly': return <Sparkles className="w-6 h-6" />;
            case 'family_monthly': return <Users className="w-6 h-6" />;
            default: return <Zap className="w-6 h-6" />;
        }
    };

    const getPlanGradient = (planId: string) => {
        switch (planId) {
            case 'pro_monthly': return 'from-cyan-500 to-blue-600';
            case 'pro_yearly': return 'from-purple-500 to-pink-600';
            case 'family_monthly': return 'from-emerald-500 to-teal-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full text-cyan-400 text-sm mb-4"
                >
                    <Sparkles className="w-4 h-4" />
                    Premium
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-bold text-white mb-4"
                >
                    Tingkatkan Pengalaman{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        QuranPulse
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg"
                >
                    Akses penuh AI, Semantic Search, dan ciri premium lain.
                    <br />
                    Bayar secara selamat melalui FPX atau kad kredit.
                </motion.p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                {SUBSCRIPTION_PLANS.map((plan, index) => {
                    const isPopular = plan.id === 'pro_yearly';

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`relative rounded-2xl border p-6 transition-all ${isPopular
                                    ? 'bg-gradient-to-b from-purple-500/10 to-slate-900 border-purple-500/50 scale-105 shadow-xl shadow-purple-500/10'
                                    : 'bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/30'
                                }`}
                        >
                            {/* Popular Badge */}
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-xs font-bold text-white">
                                    PALING JIMAT
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanGradient(plan.id)} flex items-center justify-center text-white mb-4`}>
                                {getPlanIcon(plan.id)}
                            </div>

                            {/* Name & Price */}
                            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold text-white">
                                    {ToyyibPayService.formatPrice(plan.price)}
                                </span>
                                <span className="text-slate-400 text-sm">
                                    /{plan.interval === 'monthly' ? 'bulan' : 'tahun'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={isProcessing && selectedPlan?.id === plan.id}
                                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isPopular
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                        : 'bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25'
                                    } disabled:opacity-50`}
                            >
                                {isProcessing && selectedPlan?.id === plan.id ? (
                                    <span className="animate-spin">⏳</span>
                                ) : (
                                    <>
                                        Langgan Sekarang
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 max-w-3xl mx-auto">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Pembayaran selamat via FPX
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Batal bila-bila masa
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Jaminan wang dikembalikan 7 hari
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 max-w-md mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center text-red-400 text-sm"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};

export default SubscriptionPage;
