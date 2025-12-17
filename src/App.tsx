import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './services/DataContext';
import { QueryProvider } from './services/QueryProvider';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Login } from './modules/auth/Login'; // Import Login

// Lazy load modules
const Dashboard = lazy(() => import('./modules/dashboard')); 
const Quran = lazy(() => import('./modules/quran')); 
const SmartDeen = lazy(() => import('./modules/smart-deen/SmartDeen'));
const Ibadah = lazy(() => import('./modules/ibadah/Ibadah'));
const Iqra = lazy(() => import('./modules/iqra'));
const Souq = lazy(() => import('./modules/souq/Souq'));
const MediaStudio = lazy(() => import('./modules/media/MediaStudio'));
const Profile = lazy(() => import('./modules/profile/Profile'));
const InfaqPage = lazy(() => import('./modules/barakah/InfaqPage'));
const LandingPage = lazy(() => import('./modules/landing/LandingPage'));
const VerseStudio = lazy(() => import('./modules/quran/components/VerseStudio')); // Test Route
const AdminDashboard = lazy(() => import('./modules/admin/AdminDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050505] to-black"></div>
    
    {/* Animated Rings */}
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute inset-3 border-2 border-purple-500/20 border-r-purple-400 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        <div className="absolute inset-6 border-2 border-amber-500/20 border-b-amber-400 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
        <div className="relative z-10 w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/20 animate-pulse">
            <i className="fa-solid fa-cube text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"></i>
        </div>
        <div className="absolute inset-0 bg-cyan-400/10 blur-2xl rounded-full animate-pulse"></div>
    </div>

    {/* Text */}
    <div className="text-center relative z-10 space-y-3">
      <h3 className="text-2xl font-bold text-white tracking-widest font-serif">
        QURAN<span className="text-cyan-400">PULSE</span>
      </h3>
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

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <LoadingFallback />;

    if (!user) {
        // Redirect to Login, saving the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

  const AppContent: React.FC = () => {
  // Removed artificial splash delay for performance
  const { user, isLoading, logout, updateProfile, updatePassword, uploadAvatar } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root Route: Decides between Landing and Dashboard */}
          <Route path="/" element={
              user ? <Layout /> : <LandingPage onGetStarted={() => navigate('/login')} />
          }>
            {/* Nested Protected Routes (Only rendered if user exists via Layout) */}
            <Route index element={
              <ErrorBoundary>
                <Dashboard user={user} onNavigate={(path) => navigate(path)} />
              </ErrorBoundary>
            } />
            <Route path="quran" element={<ErrorBoundary><Quran /></ErrorBoundary>} />
            <Route path="smart-deen" element={<ErrorBoundary><SmartDeen /></ErrorBoundary>} />
            <Route path="ibadah" element={<ErrorBoundary><Ibadah /></ErrorBoundary>} />
            <Route path="iqra" element={<ErrorBoundary><Iqra /></ErrorBoundary>} />
            <Route path="souq" element={<ErrorBoundary><Souq /></ErrorBoundary>} />
            <Route path="barakah" element={<ErrorBoundary><InfaqPage /></ErrorBoundary>} />
            <Route path="media" element={<ErrorBoundary><MediaStudio /></ErrorBoundary>} />
            <Route path="admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            <Route path="profile" element={
                <ErrorBoundary>
                    <Profile 
                        user={user!} 
                        onUpdateUser={updateProfile} 
                        onUpdatePassword={updatePassword}
                        onUploadAvatar={uploadAvatar}
                        onSignOut={logout} 
                    />
                </ErrorBoundary>
            } />
            {/* Direct Test Route for Verse Studio */}
            <Route path="verse-studio" element={<VerseStudio isOpen={true} onClose={() => navigate('/')} />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
                                    {/* AI Chatbot Widget */}

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
