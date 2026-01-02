import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import Analyzer from './components/Analyzer';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'dashboard'
  const [activeView, setActiveView] = useState('dashboard'); // dashboard views

  const handleEnterApp = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const renderDashboardContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome />;
      case 'analyzer':
        return <Analyzer />;
      case 'portfolio':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Portfolio Manager</h1>
            <p className="text-gray-400 mb-8">Manage your holdings and sync data</p>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center">
              <p className="text-gray-300">Portfolio management features coming soon...</p>
            </div>
          </div>
        );
      case 'feed':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">Market Feed</h1>
            <p className="text-gray-400 mb-8">Curated news and market insights</p>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center">
              <p className="text-gray-300">Market feed features coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  if (currentView === 'landing') {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  if (currentView === 'dashboard') {
    return (
      <DashboardLayout 
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      >
        {renderDashboardContent()}
      </DashboardLayout>
    );
  }

  // Fallback to old dashboard for compatibility
  return (
    <div className="App min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Universal Market Sentiment Analysis</h1>
            <p className="text-blue-100 mt-2">AI-powered sentiment analysis for stocks, crypto, commodities, real estate & exchanges</p>
          </div>
          <button 
            onClick={() => setCurrentView('landing')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            ← Back to Landing
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
      
      <footer className="bg-gray-800 text-white text-center py-4 mt-12">
        <p>&copy; 2024 Universal Market Sentiment Analysis. Powered by AI.</p>
      </footer>
    </div>
  );
}

export default App;