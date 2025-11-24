
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/apiClient';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    processLogin('email');
  };

  const handleSocialLogin = (provider: string) => {
    processLogin(provider);
  };

  const processLogin = (method: string) => {
    setIsLoading(true);
    
    // Mock API Call simulation
    setTimeout(async () => {
      let mockUser: UserProfile = {
        id: 'user_' + Date.now(),
        email: email || `user@${method}.com`,
        name: name || (method === 'email' ? 'Muslim User' : `${method.charAt(0).toUpperCase() + method.slice(1)} User`),
        xp_total: 1250,
        barakah_points: 100, // v6.0 Currency
        streak: 1,
        last_read_surah: 1,
        last_read_ayah: 1,
        iqra_progress: {},
        role: 'USER',
        status: 'ACTIVE'
      };
      
      // V6.0 Feature: Sync User to Cloud Backend if connected
      await api.syncUser(mockUser);

      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-islamic-dark relative overflow-hidden">
      
      {/* Background Elements & Animations */}
      <div className="absolute inset-0 bg-maze-strong opacity-30 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-islamic-dark/80 via-islamic-dark/90 to-islamic-dark z-0 pointer-events-none"></div>
      
      {/* Rotating Decorative Stars */}
      <div className="absolute -top-32 -right-32 w-96 h-96 opacity-10 pointer-events-none animate-[spin_60s_linear_infinite]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#14b8a6" d="M100 0 L122.5 77.5 L200 100 L122.5 122.5 L100 200 L77.5 122.5 L0 100 L77.5 77.5 Z" />
        </svg>
      </div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 opacity-5 pointer-events-none animate-[spin_50s_linear_infinite_reverse]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#F59E0B" d="M100 0 L122.5 77.5 L200 100 L122.5 122.5 L100 200 L77.5 122.5 L0 100 L77.5 77.5 Z" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-teal-pulse/30 shadow-[0_0_40px_rgba(20,184,166,0.15)] animate-fade-in relative z-10 transition-all duration-500">
        <div className="text-center mb-8">
          {/* Logo Container - Ensuring placement as per screenshot */}
          <div className="w-32 h-32 mx-auto mb-4 relative group flex items-center justify-center">
             {/* Glow effect */}
             <div className="absolute inset-0 bg-teal-pulse/20 blur-2xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
             
             {/* The Logo Image (logo.png) */}
             <img 
               src="logo.png" 
               alt="QuranPulse" 
               className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(20,184,166,0.3)] relative z-10 transform group-hover:scale-105 transition-transform duration-500 animate-pulse-glow"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
                 const fallback = document.getElementById('auth-fallback-logo');
                 if (fallback) fallback.style.display = 'flex';
               }}
             />
             {/* Fallback if image fails */}
             <div id="auth-fallback-logo" className="hidden w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-pulse to-teal-dark items-center justify-center shadow-[0_0_25px_rgba(20,184,166,0.5)] absolute z-0 animate-pulse-glow">
                <i className="fa-solid fa-cube text-4xl text-white"></i>
             </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-1 tracking-tight font-serif">QuranPulse</h2>
          <p className="text-teal-pulse/80 text-xs font-bold tracking-[0.2em] uppercase">Genesis Master Edition</p>
        </div>

        {/* Animated Tab Switcher */}
        <div className="flex p-1 bg-slate-950/60 rounded-xl mb-6 border border-white/5 relative isolate">
          <div 
            className={`absolute top-1 bottom-1 rounded-lg bg-teal-pulse shadow-lg shadow-teal-500/20 transition-all duration-300 ease-out -z-10 ${
                isLogin ? 'left-1 right-1/2 mr-0.5' : 'left-1/2 right-1 ml-0.5'
            }`}
          ></div>
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${isLogin ? 'text-black' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors ${!isLogin ? 'text-black' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Animated Name Field */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isLogin ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
                <div className="space-y-1.5">
                    <label className="text-[10px] text-teal-pulse ml-1 uppercase font-extrabold tracking-wider">Full Name</label>
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-pulse to-teal-600 rounded-xl blur opacity-20 group-focus-within:opacity-70 transition duration-500"></div>
                        <input
                            type="text"
                            required={!isLogin}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="relative w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-pulse/50 placeholder:text-slate-600 transition-colors"
                            placeholder="e.g. Ahmad Ali"
                        />
                    </div>
                </div>
            </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] text-teal-pulse ml-1 uppercase font-extrabold tracking-wider">Email Address</label>
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-pulse to-teal-600 rounded-xl blur opacity-20 group-focus-within:opacity-70 transition duration-500"></div>
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-pulse/50 placeholder:text-slate-600 transition-colors"
                placeholder="you@example.com"
                />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-teal-pulse ml-1 uppercase font-extrabold tracking-wider">Password</label>
             <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-pulse to-teal-600 rounded-xl blur opacity-20 group-focus-within:opacity-70 transition duration-500"></div>
                <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-teal-pulse/50 placeholder:text-slate-600 transition-colors"
                placeholder="••••••••"
                />
            </div>
          </div>

          {/* Options Row */}
          <div className={`flex items-center justify-between pt-1 transition-all duration-300 ${!isLogin ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        checked={rememberMe} 
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe ? 'bg-teal-pulse border-teal-pulse' : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'}`}>
                        <i className={`fa-solid fa-check text-[10px] text-black transition-transform duration-200 ${rememberMe ? 'scale-100' : 'scale-0'}`}></i>
                    </div>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-xs text-teal-pulse hover:text-teal-400 transition-colors font-semibold">
                Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-teal-pulse to-teal-600 hover:from-teal-400 hover:to-teal-500 text-black font-bold rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.3)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none mt-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                </>
                ) : (
                isLogin ? 'Sign In' : 'Create Account'
                )}
            </span>
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="relative py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-900/80 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest backdrop-blur-sm">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5"
              >
                <i className="fa-brands fa-google text-red-500"></i>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold rounded-xl border border-transparent shadow-lg shadow-blue-900/10 hover:shadow-blue-900/30 transition-all hover:-translate-y-0.5"
              >
                <i className="fa-brands fa-facebook-f"></i>
                <span>Facebook</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSocialLogin('whatsapp')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-xl border border-transparent shadow-lg shadow-green-900/10 hover:shadow-green-900/30 transition-all transform hover:-translate-y-0.5 group"
            >
              <i className="fa-brands fa-whatsapp text-xl group-hover:rotate-12 transition-transform"></i>
              <span>Login with WhatsApp</span>
            </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-500 hover:text-slate-400 transition-colors cursor-pointer">
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
