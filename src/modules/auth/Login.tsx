import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* 🌌 Background Atmosphere (Animated) */}
            <div className="absolute inset-0 z-0">
                {/* Mesh Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-cyan-300/30 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-400/40 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>

                {/* Starfield Overlay - assuming we have a CSS class or image for this, if not, using simple dots */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
            </div>

            {/* 🕌 GIANT KUFI LOGO BACKGROUND (Watermark) */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-[0.05]">
                <img
                    src="/logo-primary.png"
                    alt="Quran Pulse Kufi"
                    className="w-[120vw] max-w-none h-auto object-cover rotate-12 blur-sm"
                />
            </div>

            {/* Floating Glows */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-[80px] animate-bounce-slow"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Glass Card */}
                <div className="bg-white/80 backdrop-blur-2xl border border-cyan-200/50 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden group">

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                    {/* Header */}
                    <div className="text-center mb-10 relative">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-40 h-40 mx-auto flex items-center justify-center mb-4 relative"
                        >
                            <div className="absolute inset-0 bg-primary/50 blur-xl rounded-full animate-pulse-slow"></div>
                            <img
                                src="/logo-primary.png"
                                alt="Quran Pulse"
                                className="w-full h-full object-cover scale-150 relative z-10 drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]"
                            />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-black text-slate-900 mb-2 font-heading tracking-tight"
                        >
                            Quran <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Pulse</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-600 text-sm font-medium tracking-wide"
                        >
                            Sistem Operasi Rohani Anda
                        </motion.p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-400 rounded-xl text-slate-700 text-sm font-medium transition-all duration-300 group disabled:opacity-50 shadow-sm"
                            >
                                <i className="fa-brands fa-google text-red-500 text-lg group-hover:scale-110 transition-transform"></i>
                                Google
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                type="button"
                                onClick={handleAppleLogin}
                                className="flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-400 rounded-xl text-slate-700 text-sm font-medium transition-all duration-300 group shadow-sm"
                            >
                                <i className="fa-brands fa-apple text-white text-lg group-hover:scale-110 transition-transform"></i>
                                Apple
                            </motion.button>
                        </div>

                        <div className="relative flex items-center gap-4 my-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ATAU</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1"></div>
                        </div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-1.5"
                        >
                            <label className="text-xs font-bold text-cyan-600 uppercase tracking-wider ml-1">Emel</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-envelope text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300"></i>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl py-4 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-sm"
                                    placeholder="nama@email.com"
                                    autoComplete="email"
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-1.5"
                        >
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Kata Laluan</label>
                                <a href="#" className="text-xs text-slate-600 hover:text-cyan-600 transition-colors">Lupa?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-cyan-600 transition-colors duration-300"></i>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl py-4 pl-11 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 text-sm font-medium backdrop-blur-sm shadow-sm"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Remember Me Checkbox */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center justify-between"
                        >
                            <label htmlFor="remember-me" className="flex items-center gap-3 cursor-pointer group select-none">
                                <div className="relative">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-cyan-500 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}>
                                        <i className={`fa-solid fa-check text-[10px] text-white transition-transform duration-200 ${rememberMe ? 'scale-100' : 'scale-0'}`}></i>
                                    </div>
                                </div>
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Ingat Saya</span>
                            </label>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-sm"
                            >
                                <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    Memproses...
                                </>
                            ) : loginSuccess ? (
                                <>
                                    <i className="fa-solid fa-check-circle text-lg"></i>
                                    Berjaya!
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Log Masuk</span>
                                    <i className="fa-solid fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform"></i>
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="mt-8 text-center text-sm text-slate-600"
                    >
                        Belum ada akaun? <span className="text-cyan-600 font-bold cursor-pointer hover:text-cyan-700 hover:underline transition-colors">Daftar Sekarang</span>
                    </motion.div>
                </div>

                {/* Footer Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-8 text-center"
                >
                    <a
                        onClick={() => navigate('/privacy')}
                        className="text-[10px] text-slate-400 hover:text-cyan-600 transition-colors cursor-pointer uppercase tracking-[0.2em] hover:tracking-[0.3em] duration-300"
                    >
                        Polisi Privasi & Adab Data
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
