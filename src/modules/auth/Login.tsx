import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
        setError("Sila isi emel dan kata laluan.");
        return;
    }

    // --- DEV BYPASS (Explicit Check) ---
    if (email === 'dev@qp.com' && password === 'dev123') {
        handleDevBypass();
        return;
    }

    setLoading(true);
    
    try {
        const { error } = await login({ email, password });
        if (error) throw error;
        
        // Success
        navigate('/');
    } catch (err: any) {
        console.error("Login Error:", err);
        if (err.message && err.message.includes("fetch")) {
             setError("Gagal menyambung ke server Supabase. Sila semak internet atau API Keys.");
        } else if (err.message && err.message.includes("Invalid login")) {
             setError("Emel atau kata laluan salah.");
        } else {
             setError(err.message || "Log masuk gagal. Sila cuba lagi.");
        }
    } finally {
        setLoading(false);
    }
  };

  // Temporary Bypass for Demo/Dev
  const handleDevBypass = () => {
      // Manually set fake auth for demo purposes if Supabase fails
      localStorage.setItem('auth_token', 'dev-token');
      localStorage.setItem('auth_user', JSON.stringify({ name: 'Dev User', email: 'dev@qp.com', id: 'dev-user-id' }));
      window.location.href = '/'; // Force reload to pick up storage
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop" 
                alt="Nebula" 
                className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>
        </div>
        
        {/* Floating Glows */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
        >
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-black rounded-3xl border border-white/10 mx-auto flex items-center justify-center shadow-lg shadow-cyan-900/20 mb-6 group relative overflow-hidden">
                    <img src="/logo-full.png" alt="QP" className="w-12 h-12 object-contain relative z-10" />
                    <div className="absolute inset-0 bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Selamat Kembali</h2>
                <p className="text-slate-400 text-sm">Teruskan perjalanan rohani anda bersama QuranPulse.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all group">
                        <i className="fa-brands fa-google text-slate-300 group-hover:text-white transition-colors"></i>
                        Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all group">
                        <i className="fa-brands fa-apple text-slate-300 group-hover:text-white transition-colors"></i>
                        Apple
                    </button>
                </div>

                <div className="relative flex items-center gap-4 mb-6">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">ATAU</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Emel</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-envelope text-slate-400 group-focus-within:text-cyan-400 transition-colors"></i>
                        </div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm font-medium"
                            placeholder="nama@email.com"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Kata Laluan</label>
                        <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Lupa?</a>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-lock text-slate-400 group-focus-within:text-cyan-400 transition-colors"></i>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm font-medium"
                            placeholder="••••••••"
                        />
                    </div>
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
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                            Memproses...
                        </>
                    ) : (
                        <>
                            Log Masuk
                            <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
                Belum ada akaun? <span className="text-cyan-400 font-bold cursor-pointer hover:underline cursor-pointer">Daftar Sekarang</span>
            </div>


        </motion.div>
    </div>
  );
};

export default Login;
