import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log("🚀 Login: Start handleLogin for", email);

        if (!email || !password) {
            setError("Sila isi emel dan kata laluan.");
            return;
        }

        // --- DEV BYPASS (Explicit Check) ---
        if (email === 'dev@qp.com' && password === 'dev123') {
            console.log("🚧 Login: Dev Bypass Triggered");
            handleDevBypass();
            return;
        }

        setLoading(true);

        try {
            console.log("🔌 Login: Calling AuthContext login...");
            const { error } = await login({ email, password });

            if (error) {
                console.error("❌ Login: AuthContext login returned error:", error);
                throw error;
            }

            console.log("✅ Login: AuthContext login success. Navigating...");
            setLoginSuccess(true);

            // Handle Remember Me
            if (rememberMe) {
                localStorage.setItem('qp_remember_email', email);
            } else {
                localStorage.removeItem('qp_remember_email');
            }

            // Success (wait a moment for the user to see the success state)
            setTimeout(() => navigate('/'), 800);
        } catch (err: any) {
            console.error("❌ Login: Caught error in handleLogin:", err);
            if (err.message && err.message.includes("fetch")) {
                setError("Gagal menyambung ke server Supabase. Sila semak internet atau API Keys.");
            } else if (err.message && err.message.includes("Invalid login credentials") || err.message?.includes("Invalid login")) {
                setError("Emel atau kata laluan salah.");
            } else if (err.message && err.message.includes("Email not confirmed")) {
                setError("Emel belum disahkan. Sila semak peti masuk emel anda.");
            } else {
                setError(err.message || "Log masuk gagal. Sila cuba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Google OAuth Login
    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/',
                }
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err.message || "Log masuk Google gagal.");
            setLoading(false);
        }
    };

    // Apple OAuth Login (placeholder)
    const handleAppleLogin = async () => {
        setError("Log masuk Apple akan datang!");
    };

    // Temporary Bypass for Demo/Dev
    const handleDevBypass = () => {
        localStorage.setItem('auth_token', 'dev-token');
        localStorage.setItem('auth_user', JSON.stringify({ name: 'Dev User', email: 'dev@qp.com', id: 'dev-user-id' }));
        window.location.href = '/';
    };

    // Load remembered email on mount
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('qp_remember_email');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop"
                    alt="Nebula"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
            </div>

            {/* Floating Glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-sheet/50 backdrop-blur-2xl border border-white rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto flex items-center justify-center mb-6 group relative">
                        <div className="absolute inset-0 bg-primary blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <img src="/logo-full.png" alt="Quran Pulse" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(90,185,255,0.5)]" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-1">
                        Quran <span className="text-primary">Pulse</span>
                    </h2>
                    <p className="text-white/60 text-sm">Teruskan perjalanan rohani anda.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 py-3 bg-surface-dark/50 hover:bg-surface-dark border border-white rounded-xl text-white text-sm font-medium transition-all group disabled:opacity-50"
                        >
                            <i className="fa-brands fa-google text-red-400 group-hover:text-red-300 transition-colors"></i>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={handleAppleLogin}
                            className="flex items-center justify-center gap-2 py-3 bg-surface-dark/50 hover:bg-surface-dark border border-white rounded-xl text-white text-sm font-medium transition-all group"
                        >
                            <i className="fa-brands fa-apple text-white group-hover:text-white transition-colors"></i>
                            Apple
                        </button>
                    </div>

                    <div className="relative flex items-center gap-4 mb-6">
                        <div className="h-px bg-white/20 flex-1"></div>
                        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">ATAU</span>
                        <div className="h-px bg-white/20 flex-1"></div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Emel</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fa-solid fa-envelope text-white/40 group-focus-within:text-primary transition-colors"></i>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-dark/50 border border-white rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-white/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                                placeholder="nama@email.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider">Kata Laluan</label>
                            <a href="#" className="text-xs text-primary hover:text-white transition-colors">Lupa?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fa-solid fa-lock text-white/40 group-focus-within:text-primary transition-colors"></i>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-dark/50 border border-white rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-white/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center justify-between">
                        <label htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer group select-none">
                            <div className="relative">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-primary border-primary' : 'bg-surface-dark border-white/50 group-hover:border-white'}`}>
                                    <i className={`fa-solid fa-check text-xs text-background-dark transition-transform duration-200 ${rememberMe ? 'scale-100' : 'scale-0'}`}></i>
                                </div>
                            </div>
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors">Ingat Saya</span>
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2"
                        >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-background-dark font-bold rounded-xl shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                                Memproses...
                            </>
                        ) : loginSuccess ? (
                            <>
                                <i className="fa-solid fa-check-circle"></i>
                                Berjaya! Sedang masuk...
                            </>
                        ) : (
                            <>
                                Log Masuk
                                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-white/60">
                    Belum ada akaun? <span className="text-primary font-bold cursor-pointer hover:underline">Daftar Sekarang</span>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 text-center">
                    <a
                        onClick={() => navigate('/privacy')}
                        className="text-[10px] text-white/30 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest"
                    >
                        Polisi Privasi & Adab Data
                    </a>
                </div>

            </motion.div>
        </div>
    );
};

export default Login;
