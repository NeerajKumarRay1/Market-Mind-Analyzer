import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import Analyzer from './components/Analyzer';
import Portfolio from './components/Portfolio';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup', 'dashboard'
  const [activeView, setActiveView] = useState('dashboard'); // dashboard views
  const [user, setUser] = useState(null); // Store user data

  const handleEnterApp = () => {
    setCurrentView('login');
  };

  const handleLogin = (userData = null) => {
    // For login, we might not have full user data, so use default or stored data
    if (userData) {
      setUser(userData);
    } else {
      // Default user for login (you can modify this based on your login API response)
      setUser({
        firstName: 'User',
        lastName: '',
        email: 'user@example.com'
      });
    }
    setCurrentView('dashboard');
  };

  const handleSignUp = (userData) => {
    // Store the user data from signup
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null); // Clear user data
    setCurrentView('landing');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleBackToLanding = () => {
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
        return <Portfolio />;
      default:
        return <DashboardHome />;
    }
  };

  // Render based on current view
  if (currentView === 'landing') {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToSignup={handleSwitchToSignup}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignUp 
        onSignUp={handleSignUp}
        onSwitchToLogin={handleSwitchToLogin}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <DashboardLayout 
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        user={user}
      >
        {renderDashboardContent()}
      </DashboardLayout>
    );
  }

  // Default fallback
  return <LandingPage onEnterApp={handleEnterApp} />;
}

export default App;