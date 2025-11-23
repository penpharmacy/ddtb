import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Medications from './components/Medications';
import SideEffects from './components/SideEffects';
import PharmacistReport from './components/PharmacistReport';
import BottomNav from './components/BottomNav';
import { ViewState } from './types';
import { initializeDailyLogs } from './services/storageService';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('dashboard');

  useEffect(() => {
    // Ensure daily logs exist on app load
    initializeDailyLogs();
    
    // Request notification permission roughly on load if supported
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'medications': return <Medications />;
      case 'side_effects': return <SideEffects />;
      case 'pharmacist': return <PharmacistReport />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="mx-auto max-w-md bg-white min-h-screen shadow-2xl overflow-hidden relative">
         {renderView()}
      </main>
      <BottomNav currentView={currentView} setView={setView} />
    </div>
  );
};

export default App;
