import React, { useState, useEffect } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          name: currentUser.displayName || currentUser.email.split('@')[0],
          uid: currentUser.uid,
          photoURL: currentUser.photoURL
        });
        setShowLanding(false); // Skip landing if logged in
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading once auth check is done
    });
    return () => unsubscribe();
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
              signOut(auth).then(() => {
                setUser(null);
                setShowLanding(true);
              });
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
