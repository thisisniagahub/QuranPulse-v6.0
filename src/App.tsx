import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { QueryProvider } from './contexts/QueryProvider';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Login } from './modules/auth/Login'; // Import Login
import AdminRoute from './modules/admin/components/AdminRoute';
import SplashScreen from './components/SplashScreen';
import { SkipToContent } from './components/ui/SkipToContent';
import { ToastProvider } from './components/ui/Toast';

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
const SurahQuest = lazy(() => import('./modules/quran/features/quest/SurahQuest'));
const Leaderboard = lazy(() => import('./modules/gamification/Leaderboard'));
const SubscriptionPage = lazy(() => import('./modules/subscription/SubscriptionPage'));
const GuideViewer = lazy(() => import('./modules/iqra/components/GuideViewer'));


import PWAInstallPrompt from './components/PWAInstallPrompt';
import OpenClawStatus from './components/OpenClawStatus';

let didInit = false;

const SURAH_QUEST_WORDS = [
  { id: 1, arabic: 'ٱلْحَمْدُ', transliteration: 'Alhamdu', translation: 'Segala puji', position: 1 },
  { id: 2, arabic: 'لِلَّهِ', transliteration: 'Lillahi', translation: 'bagi Allah', position: 2 },
  { id: 3, arabic: 'رَبِّ', transliteration: 'Rabbi', translation: 'Tuhan', position: 3 },
  { id: 4, arabic: 'ٱلْعَٰلَمِينَ', transliteration: "Al-'alamin", translation: 'sekalian alam', position: 4 },
  { id: 5, arabic: 'ٱلرَّحْمَٰنِ', transliteration: "Ar-Rahman", translation: 'Yang Maha Pemurah', position: 5 },
  { id: 6, arabic: 'ٱلرَّحِيمِ', transliteration: "Ar-Rahim", translation: 'Yang Maha Penyayang', position: 6 },
  { id: 7, arabic: 'مَٰلِكِ', transliteration: 'Maliki', translation: 'Pemilik', position: 7 },
  { id: 8, arabic: 'يَوْمِ', transliteration: 'Yawmi', translation: 'hari', position: 8 },
  { id: 9, arabic: 'ٱلدِّينِ', transliteration: 'Ad-Din', translation: 'pembalasan', position: 9 },
];

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-raudhah-ivory relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-raudhah-teal/5 via-raudhah-gold/5 to-transparent"></div>

    {/* Rings Removed */}
    <div className="relative w-32 h-32 flex items-center justify-center mb-8">
      <div className="relative z-10 w-20 h-20 bg-raudhah-teal/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-raudhah-teal/10 animate-pulse">
        <img src="/logo-primary.png" alt="Logo" className="w-12 h-12 object-contain" />
      </div>
    </div>

    {/* Text */}
    <div className="text-center relative z-10 space-y-3">
      <h3 className="text-2xl font-bold text-raudhah-teal tracking-widest font-raudhah">
        QURAN<span className="text-raudhah-gold">PULSE</span>
      </h3>
      <p className="text-lg text-raudhah-teal/60 font-arabic animate-pulse">جاري التحميل...</p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-raudhah-teal/40 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-raudhah-gold/40 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-raudhah-teal/20 animate-bounce"></span>
      </div>
      <p className="text-[10px] text-raudhah-ink/40 font-mono uppercase tracking-[0.3em] mt-6 font-bold">Mempersiapkan Kecerdasan Raudhah</p>
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
  const [showSplash, setShowSplash] = useState(false);
  const { user, isLoading, logout, updateProfile, updatePassword, uploadAvatar } = useAuth();
  const navigate = useNavigate();

  // Handle Splash Complete
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (didInit) return;
    didInit = true;
  }, []);

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
            <Route path="quest" element={<ErrorBoundary><SurahQuest surahId={1} surahName="Al-Fatihah" words={SURAH_QUEST_WORDS} /></ErrorBoundary>} />
            <Route path="surah-quest" element={<ErrorBoundary><SurahQuest surahId={1} surahName="Al-Fatihah" words={SURAH_QUEST_WORDS} /></ErrorBoundary>} />
            <Route path="leaderboard" element={<ErrorBoundary><Leaderboard /></ErrorBoundary>} />
            <Route path="subscribe" element={<ErrorBoundary><SubscriptionPage /></ErrorBoundary>} />
            <Route path="pro" element={<ErrorBoundary><SubscriptionPage /></ErrorBoundary>} />
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
            <Route path="verse-studio" element={<VerseStudio chapter={null} verse={{} as any} tab="CHAT" setTab={() => { }} onClose={() => navigate('/')} />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PWAInstallPrompt />
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
                <ToastProvider>
                  <BrowserRouter>
                    <SkipToContent />
                    <Suspense fallback={<LoadingFallback />}>
                      <AppContent />
                    </Suspense>
                    <OpenClawStatus />
                    {/* MiniPlayer removed - using QuranAudioPlayer in Quran module instead */}
                    {/* PulseControlCenter removed - features moved to Admin Dashboard Settings */}
                    {/* <PulseControlCenter /> */}
                    {/* AI Chatbot Widget */}

                  </BrowserRouter>
                </ToastProvider>
              </AuthProvider>
            </GamificationProvider>
          </AudioPlayerProvider>
        </QueryProvider>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;
