import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { DataProvider } from './services/DataContext';
import { QueryProvider } from './services/QueryProvider';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import MiniPlayer from './components/MiniPlayer';
import ErrorBoundary from './components/ErrorBoundary';
import { NavView, UserProfile } from './types';

// Lazy load all modules for code splitting
// Lazy load all modules for code splitting
const Dashboard = lazy(() => import('./modules/dashboard')); // Points to index.tsx
const Quran = lazy(() => import('./modules/quran')); 
const SmartDeen = lazy(() => import('./modules/smart-deen/SmartDeen'));
const Ibadah = lazy(() => import('./modules/ibadah/Ibadah'));
const Iqra = lazy(() => import('./modules/iqra'));
const Souq = lazy(() => import('./modules/souq/Souq'));
const MediaStudio = lazy(() => import('./modules/media/MediaStudio'));
const Profile = lazy(() => import('./modules/profile/Profile'));
// const AdminDashboard = lazy(() => import('./modules/admin/AdminDashboard')); // Removed
const Auth = lazy(() => import('./modules/auth/Auth'));
const Community = lazy(() => import('./modules/social')); // Points to index.tsx
const LandingPage = lazy(() => import('./modules/landing/LandingPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050505] to-black"></div>
    
    {/* Animated Rings */}
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-[spin_3s_linear_infinite]"></div>
        {/* Middle Ring */}
        <div className="absolute inset-3 border-2 border-purple-500/20 border-r-purple-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        {/* Inner Ring */}
        <div className="absolute inset-6 border-2 border-amber-500/20 border-b-amber-400 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
        
        {/* Logo/Icon */}
        <div className="relative z-10 w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/20 animate-pulse">
            <i className="fa-solid fa-cube text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"></i>
        </div>
        
        {/* Core Glow */}
        <div className="absolute inset-0 bg-cyan-400/10 blur-2xl rounded-full animate-pulse"></div>
    </div>

    {/* Text */}
    <div className="text-center relative z-10 space-y-3">
      <h3 className="text-2xl font-bold text-white tracking-widest font-serif">
        QURAN<span className="text-cyan-400">PULSE</span>
      </h3>
      
      {/* Arabic Text with Shimmer */}
      <p className="text-lg text-amber-400/80 font-arabic animate-pulse">جاري التحميل...</p>

      <div className="flex items-center justify-center gap-2 mt-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce"></span>
      </div>
      
      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em] mt-6">Initializing Genesis Engine</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // TEMP: Auto-login for testing
  const navigate = useNavigate();

  // Enforce minimum splash screen time for "WOW" effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Mock User State (In a real app, this would come from AuthContext or DataContext)
  const [user, setUser] = useState<UserProfile>({
    name: "Guest",
    email: "guest@example.com",
    role: "USER",
    xp_total: 0,
    barakah_points: 0,
    streak: 0,
    last_read_surah: 1,
    last_read_ayah: 1,
    iqra_progress: {}
  });

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser({ ...user, name: userData.username || "User", role: userData.role || "USER" });
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowLanding(true);
    navigate('/');
  };

  // Compatibility function for legacy components using onNavigate
  const handleNavigate = (view: NavView) => {
    switch (view) {
      case NavView.DASHBOARD: navigate('/'); break;
      case NavView.QURAN: navigate('/quran'); break;
      case NavView.SMART_DEEN: navigate('/smart-deen'); break;
      case NavView.IBADAH: navigate('/ibadah'); break;
      case NavView.IQRA: navigate('/iqra'); break;
      case NavView.SOUQ: navigate('/souq'); break;
      case NavView.MEDIA_STUDIO: navigate('/media'); break;
      case NavView.PROFILE: navigate('/profile'); break;
      case NavView.ADMIN: window.location.href = 'http://localhost:3000'; break;
      default: navigate('/');
    }
  };

  if (showSplash) {
    return <LoadingFallback />;
  }

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ErrorBoundary>
                <Dashboard user={user} onNavigate={handleNavigate} />
              </ErrorBoundary>
            } />
            <Route path="quran" element={
              <ErrorBoundary>
                <Quran />
              </ErrorBoundary>
            } />
            <Route path="smart-deen" element={
              <ErrorBoundary>
                <SmartDeen />
              </ErrorBoundary>
            } />
            <Route path="ibadah" element={
              <ErrorBoundary>
                <Ibadah />
              </ErrorBoundary>
            } />
            <Route path="iqra" element={
              <ErrorBoundary>
                <Iqra />
              </ErrorBoundary>
            } />
            <Route path="souq" element={
              <ErrorBoundary>
                <Souq />
              </ErrorBoundary>
            } />
            <Route path="media" element={
              <ErrorBoundary>
                <MediaStudio />
              </ErrorBoundary>
            } />
            <Route path="profile" element={
              <ErrorBoundary>
                <Profile user={user} onUpdateUser={handleUpdateUser} onSignOut={handleSignOut} />
              </ErrorBoundary>
            } />
          </Route>
// AdminDashboard removed as per user request to use separate Next.js app
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};



// ... (imports)

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <DataProvider>
                <QueryProvider>
                    <AudioPlayerProvider>
                        <GamificationProvider>
                            <AuthProvider>
                                <BrowserRouter>
                                    <Suspense fallback={<LoadingFallback />}>
                                        <AppContent />
                                    </Suspense>
                                    {/* MiniPlayer removed - using QuranAudioPlayer in Quran module instead */}
                                    {/* PulseControlCenter removed - features moved to Admin Dashboard Settings */}
                                    {/* <PulseControlCenter /> */}
                                </BrowserRouter>
                            </AuthProvider>
                        </GamificationProvider>
                    </AudioPlayerProvider>
                </QueryProvider>
            </DataProvider>
        </ErrorBoundary>
    );
};

export default App;
