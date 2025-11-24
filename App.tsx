
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './modules/Dashboard';
import SmartDeen from './modules/SmartDeen';
import Iqra from './modules/Iqra';
import Quran from './modules/Quran';
import MediaStudio from './modules/MediaStudio';
import Auth from './modules/Auth';
import Profile from './modules/Profile';
import LandingPage from './modules/LandingPage';
import Ibadah from './modules/Ibadah';
import Souq from './modules/Souq';
import Admin from './modules/Admin';
import { NavView, UserProfile } from './types';
import { DataProvider } from './services/DataContext'; 

const AppContent: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<NavView>(NavView.DASHBOARD);
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

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser({ ...loggedInUser, iqra_progress: loggedInUser.iqra_progress || {} });
    setIsAuthenticated(true);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowLanding(true);
    setCurrentView(NavView.DASHBOARD);
    setUser({
        name: "Guest",
        email: "",
        xp_total: 0,
        barakah_points: 0,
        streak: 0,
        last_read_surah: 1,
        last_read_ayah: 1,
        iqra_progress: {}
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case NavView.DASHBOARD:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
      case NavView.SMART_DEEN:
        return <SmartDeen />;
      case NavView.IQRA:
        return <Iqra user={user} onUpdateUser={handleUpdateUser} />;
      case NavView.QURAN:
        return <Quran />;
      case NavView.IBADAH:
        return <Ibadah />;
      case NavView.SOUQ:
        return <Souq />;
      case NavView.ADMIN:
        return <Admin />;
      case NavView.MEDIA_STUDIO:
        return <MediaStudio />;
      case NavView.PROFILE:
        return <Profile user={user} onUpdateUser={handleUpdateUser} onSignOut={handleSignOut} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentView} />;
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <AppContent />
        </DataProvider>
    );
};

export default App;
