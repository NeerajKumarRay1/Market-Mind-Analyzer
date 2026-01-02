import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Camera, 
  Shield, 
  Search, 
  TrendingUp, 
  Zap,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const LandingPage = ({ onEnterApp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAnalyzing(true);
    setShowResult(false);
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      setTimeout(() => setShowModal(true), 2000);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00FF41] to-[#00D4FF] bg-clip-text text-transparent">
                MarketMind
              </span>
            </motion.div>

            {/* Center Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-[#00FF41] transition-colors">
                How it Works
              </a>
              <a href="#features" className="text-gray-300 hover:text-[#00FF41] transition-colors">
                Features
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEnterApp}
                className="px-6 py-2 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00FF41]/25 transition-all duration-300"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF41]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#00FF41] via-[#00D4FF] to-[#00FF41] bg-clip-text text-transparent">
              Investing, Decoded by AI.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Stop guessing. Use institutional-grade sentiment analysis to scan 
            <span className="text-[#00FF41]"> Stocks</span>, 
            <span className="text-[#00D4FF]"> Crypto</span>, and 
            <span className="text-[#FF3131]"> Forex</span> in seconds.
          </motion.p>

          {/* Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="flex items-center bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search Asset (e.g., Tesla, BTC, Gold)"
                  className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none text-lg"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-8 py-3 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#00FF41]/25 transition-all duration-300 flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                      />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Analyze</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* AI Scanning Animation */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="flex items-center space-x-2 text-[#00FF41]">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <span className="text-lg font-medium">AI Scanning Markets...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result Card */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 w-full max-w-md"
                  >
                    <div className="bg-gray-900/80 backdrop-blur-xl border border-[#00FF41]/30 rounded-2xl p-6 shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">
                          {searchQuery || 'Asset'} Analysis
                        </h3>
                        <div className="flex items-center space-x-2 text-[#00FF41]">
                          <TrendingUp className="w-5 h-5" />
                          <span className="font-bold">Bullish</span>
                        </div>
                      </div>
                      
                      {/* Blurred Content */}
                      <div className="space-y-3 filter blur-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sentiment Score:</span>
                          <span className="text-[#00FF41] font-bold">+0.73</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">News Sources:</span>
                          <span className="text-white">247 articles</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-[#00FF41] font-bold">94%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <div className="text-gray-400">Join 10,000+ traders making smarter decisions</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEnterApp}
              className="px-8 py-3 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00FF41]/25 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#00FF41] to-[#00D4FF] bg-clip-text text-transparent">
                Institutional-Grade Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to make data-driven investment decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:border-[#00FF41]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#00FF41]/20 to-[#00D4FF]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-[#00FF41]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Universal Analysis</h3>
              <p className="text-gray-300 text-lg">
                From Bitcoin to Brent Crude, if it's in the news, we analyze it. 
                Our AI processes thousands of sources in real-time.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:border-[#00D4FF]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#00D4FF]/20 to-[#00FF41]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-[#00D4FF]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Screenshot Portfolio</h3>
              <p className="text-gray-300 text-lg">
                Too lazy to type? Upload a screenshot of your brokerage app, 
                and we'll build your portfolio instantly using AI vision.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="group bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 hover:border-[#FF3131]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF3131]/20 to-[#00FF41]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-[#FF3131]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Risk-Adjusted Tips</h3>
              <p className="text-gray-300 text-lg">
                We don't just give data. We give advice tailored to your risk tolerance 
                and investment timeline.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-xl border-t border-gray-800/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-[#00FF41] to-[#00D4FF] bg-clip-text text-transparent">
                  MarketMind
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                AI-powered sentiment analysis for smarter investment decisions.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-6 h-6 text-gray-400 hover:text-[#00FF41] cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-[#00D4FF] cursor-pointer transition-colors" />
                <MessageCircle className="w-6 h-6 text-gray-400 hover:text-[#FF3131] cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#00FF41] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#00FF41] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#00FF41] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#00D4FF] transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#00D4FF] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#00D4FF] transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#FF3131] transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#FF3131] transition-colors">Sales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#FF3131] transition-colors">Partnerships</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MarketMind. All rights reserved. Built with ❤️ for traders.
            </p>
          </div>
        </div>
      </footer>

      {/* Signup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Want the Full Breakdown?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join 10,000+ traders getting institutional-grade analysis. 
                  See detailed sentiment scores, news breakdowns, and risk assessments.
                </p>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowModal(false);
                      onEnterApp();
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00FF41]/25 transition-all duration-300"
                  >
                    Sign Up to Unlock
                  </motion.button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;