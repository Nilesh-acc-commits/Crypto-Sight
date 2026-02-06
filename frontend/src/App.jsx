import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PredictionPage from './pages/PredictionPage';

function App() {
  const [currentView, setCurrentView] = useState('prediction');

  // Mock user for hackathon demo - no authentication needed
  const user = {
    email: 'demo@cryptosight.ai',
    name: 'Demo User'
  };

  return (
    <div
      className="min-h-screen text-slate-100 overflow-x-hidden relative"
    >
      <div className="fixed inset-0 w-full h-full bg-grid-overlay pointer-events-none z-0"></div>

      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={() => window.location.reload()}
        user={user}
      />
      <PredictionPage user={user} />
    </div>
  );
}
export default App;
