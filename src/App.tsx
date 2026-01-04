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
import AdminRoute from './modules/admin/components/AdminRoute';

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
const VerseStudio = lazy(() => import('./modules/quran/features/studio/VerseStudio')); // Test Route
const AdminDashboard = lazy(() => import('./modules/admin/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./modules/legal/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./modules/legal/TermsOfService'));
const RefundPolicy = lazy(() => import('./modules/legal/RefundPolicy'));
const Umrah = lazy(() => import('./modules/umrah')); // Umrah Companion Module
import GuideViewer from './modules/iqra/components/GuideViewer';


// Loading fallback component
import SplashScreen from './components/SplashScreen';

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f9ff] relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-cyan-50/30 to-transparent"></div>

    {/* Rings Removed */}
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
      <div className="relative z-10 w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/20 animate-pulse">
        <i className="fa-solid fa-cube text-4xl text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]"></i>
      </div>
    </div>

    {/* Text */}
    <div className="text-center relative z-10 space-y-3">
      <h3 className="text-2xl font-bold text-slate-800 tracking-widest font-serif">
        QURAN<span className="text-cyan-600">PULSE</span>
      </h3>
      <p className="text-lg text-cyan-700/80 font-arabic animate-pulse">جاري التحميل...</p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce"></span>
      </div>
      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.3em] mt-6 font-bold">Initializing Genesis Engine</p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    // Redirect to Login, saving the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent: React.FC = () => {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const { user, isLoading, logout, updateProfile, updatePassword, uploadAvatar } = useAuth();
  const navigate = useNavigate();

  // Handle Splash Complete
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (isLoading) {
    // Temporary Bypass: If stuck loading for too long, just show the app
    // This is a fail-safe for the demo
    // return <LoadingFallback />;
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />

          {/* Root Route: Decides between Landing and Dashboard */}
          <Route path="/" element={
            user ? <Layout /> : <LandingPage onGetStarted={() => navigate('/login')} />
          }>
            {/* Nested Protected Routes (Only rendered if user exists via Layout) */}
            <Route index element={
              <ErrorBoundary>
                {user ? <Dashboard user={user} onNavigate={(path) => navigate(path)} /> : <LoadingFallback />}
              </ErrorBoundary>
            } />
            <Route path="quran" element={<ErrorBoundary><Quran /></ErrorBoundary>} />
            <Route path="smart-deen" element={<ErrorBoundary><SmartDeen /></ErrorBoundary>} />
            <Route path="ibadah" element={<ErrorBoundary><Ibadah /></ErrorBoundary>} />
            <Route path="iqra" element={<ErrorBoundary><Iqra /></ErrorBoundary>} />
            <Route path="souq" element={<ErrorBoundary><Souq /></ErrorBoundary>} />
            <Route path="barakah" element={<ErrorBoundary><InfaqPage /></ErrorBoundary>} />
            <Route path="media" element={<ErrorBoundary><MediaStudio /></ErrorBoundary>} />
            <Route path="umrah" element={<ErrorBoundary><Umrah /></ErrorBoundary>} />
            <Route path="admin" element={<AdminRoute><ErrorBoundary><AdminDashboard /></ErrorBoundary></AdminRoute>} />
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
            {/* Guide Viewer Route */}
            <Route path="iqra/guides" element={<GuideViewer />} />

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
