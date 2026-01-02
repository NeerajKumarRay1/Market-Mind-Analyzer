import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Activity,
  Brain
} from 'lucide-react';

const DashboardHome = () => {
  const [marketMood, setMarketMood] = useState(0.3); // -1 to 1 scale
  const [portfolioData, setPortfolioData] = useState([
    { symbol: 'BTC', price: 45000, sentiment: 'bullish', change: '+5.2%', value: '$450,000' },
    { symbol: 'TSLA', price: 210, sentiment: 'bearish', change: '-3.1%', value: '$21,000' },
    { symbol: 'NVDA', price: 875, sentiment: 'bullish', change: '+8.7%', value: '$87,500' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketMood(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getMoodColor = (mood) => {
    if (mood > 0.2) return 'text-[#00FF41]';
    if (mood < -0.2) return 'text-[#FF3131]';
    return 'text-yellow-400';
  };

  const getMoodText = (mood) => {
    if (mood > 0.4) return 'Extreme Greed';
    if (mood > 0.2) return 'Greed';
    if (mood > -0.2) return 'Neutral';
    if (mood > -0.4) return 'Fear';
    return 'Extreme Fear';
  };

  const getSentimentIcon = (sentiment) => {
    return sentiment === 'bullish' ? (
      <TrendingUp className="w-5 h-5 text-[#00FF41]" />
    ) : (
      <TrendingDown className="w-5 h-5 text-[#FF3131]" />
    );
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Your daily market briefing</p>
      </div>

      {/* Daily Pulse Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Market Mood Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Market Mood</h3>
            <Activity className="w-6 h-6 text-[#00D4FF]" />
          </div>
          
          {/* Mood Gauge */}
          <div className="relative mb-6">
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF3131] via-yellow-400 to-[#00FF41] rounded-full"></div>
            </div>
            <div 
              className="absolute top-0 w-2 h-4 bg-white rounded-full shadow-lg transition-all duration-500"
              style={{ left: `${((marketMood + 1) / 2) * 100}%`, transform: 'translateX(-50%)' }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold ${getMoodColor(marketMood)}`}>
              {getMoodText(marketMood)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              S&P 500 & Bitcoin Sentiment
            </div>
          </div>
        </motion.div>

        {/* AI Pick of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI Pick of the Day</h3>
            <Brain className="w-6 h-6 text-[#00FF41]" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#00FF41]/20 to-[#00D4FF]/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#00FF41]" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">NVIDIA (NVDA)</div>
                <div className="text-sm text-[#00FF41]">88% Positive Sentiment</div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-[#00FF41] font-semibold">Suggestion:</span> Strong buy signal due to new AI chip announcements. 
                Sentiment analysis shows overwhelming positive coverage across 247 news sources. 
                Fits your <span className="text-[#FF3131]">🚀 Aggressive</span> risk strategy.
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Confidence Score</span>
              <span className="text-[#00FF41] font-bold">94%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Health Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white">Portfolio Health</h2>
        
        <div className="grid gap-6">
          {/* Portfolio Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800/50">
              <h3 className="text-lg font-bold text-white">Top 3 Movers</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Change</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Sentiment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((asset, index) => (
                    <motion.tr
                      key={asset.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#00FF41]/20 to-[#00D4FF]/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{asset.symbol}</span>
                          </div>
                          <span className="font-medium text-white">{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${asset.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          asset.change.startsWith('+') ? 'text-[#00FF41]' : 'text-[#FF3131]'
                        }`}>
                          {asset.change}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(asset.sentiment)}
                          <span className={`text-sm font-medium ${
                            asset.sentiment === 'bullish' ? 'text-[#00FF41]' : 'text-[#FF3131]'
                          }`}>
                            {asset.sentiment === 'bullish' ? 'Bullish' : 'Bearish'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {asset.value}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#FF3131]/10 to-[#FF3131]/5 border border-[#FF3131]/30 rounded-2xl p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#FF3131]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#FF3131]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-2">⚠️ Action Required</h4>
                <p className="text-gray-300 mb-4">
                  TSLA sentiment has flipped negative based on recent supply chain concerns and delivery miss reports. 
                  Consider reviewing your position or setting a stop-loss.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-[#FF3131] text-white font-semibold rounded-lg hover:bg-[#FF3131]/80 transition-colors"
                  >
                    Review Position
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    Dismiss
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;