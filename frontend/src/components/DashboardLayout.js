import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Briefcase, 
  Newspaper, 
  Settings, 
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';

const DashboardLayout = ({ children, activeView, onViewChange, onLogout }) => {
  const [riskProfile, setRiskProfile] = useState('Aggressive');
  const [showRiskDropdown, setShowRiskDropdown] = useState(false);

  const riskProfiles = [
    { name: 'Conservative', icon: '🛡️', color: 'text-blue-400' },
    { name: 'Moderate', icon: '⚖️', color: 'text-yellow-400' },
    { name: 'Aggressive', icon: '🚀', color: 'text-red-400' }
  ];

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, description: 'Overview' },
    { id: 'analyzer', name: 'Analyzer', icon: Search, description: 'Search Tool' },
    { id: 'portfolio', name: 'Portfolio', icon: Briefcase, description: 'Your Assets' },
    { id: 'feed', name: 'Market Feed', icon: Newspaper, description: 'Curated News' }
  ];

  const currentRisk = riskProfiles.find(r => r.name === riskProfile);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Fixed Sidebar */}
      <div className="w-80 bg-gray-900/50 backdrop-blur-xl border-r border-gray-800/50 flex flex-col">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">John Doe</h3>
              <div className="relative">
                <button
                  onClick={() => setShowRiskDropdown(!showRiskDropdown)}
                  className={`flex items-center space-x-2 ${currentRisk.color} hover:text-white transition-colors`}
                >
                  <span>{currentRisk.icon}</span>
                  <span className="text-sm font-medium">{riskProfile}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Risk Profile Dropdown */}
                {showRiskDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                  >
                    {riskProfiles.map((profile) => (
                      <button
                        key={profile.name}
                        onClick={() => {
                          setRiskProfile(profile.name);
                          setShowRiskDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                          profile.name === riskProfile ? 'bg-gray-700' : ''
                        }`}
                      >
                        <span>{profile.icon}</span>
                        <span className={`font-medium ${profile.color}`}>{profile.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#00FF41]/20 to-[#00D4FF]/20 border border-[#00FF41]/30 text-[#00FF41]' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-800/50 space-y-2">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </motion.button>
          
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;