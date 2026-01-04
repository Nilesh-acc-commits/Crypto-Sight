import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Loader from './components/Loader';
// import VantaBackground from './components/VantaBackground'; // Disabled for thermal performance
import { AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  // Temporary: Expose setUser for demo automation (Retry)
  useEffect(() => {
    window.demoLogin = (userData) => setUser(userData);
  }, []);

  return (
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden relative"
    >
      <div className="fixed inset-0 w-full h-full bg-grid-overlay pointer-events-none z-0"></div>

      <AnimatePresence>
        {loading && <Loader setLoading={setLoading} />}
      </AnimatePresence>

      {!loading && showLanding && (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      )}

      {!loading && !showLanding && !user && (
        <LoginPage onLoginSuccess={(response) => setUser(response)} />
      )}

      {!loading && !showLanding && user && (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={setCurrentView}
            onLogout={() => {
              setUser(null);
              setShowLanding(true); // Return to landing on logout
            }}
            user={user}
          />
          {currentView === 'dashboard' && <Dashboard user={user} />}
          {currentView === 'calculator' && <Calculator user={user} />}
          {currentView === 'compare' && <Compare user={user} />}
          {currentView === 'profile' && <Profile user={user} />}
        </>
      )}
    </div>
  );
}
export default App;
