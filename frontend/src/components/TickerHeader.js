import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TickerHeader = ({ ticker, currentPrice, sentiment, loading = false }) => {
  // Determine sentiment badge properties
  const getSentimentBadge = (sentimentScore) => {
    if (sentimentScore > 0.6) {
      return {
        label: 'Bullish',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-100',
        icon: TrendingUp,
        pulseColor: 'animate-pulse bg-emerald-400'
      };
    } else if (sentimentScore < 0.4) {
      return {
        label: 'Bearish',
        color: 'bg-rose-500',
        textColor: 'text-rose-100',
        icon: TrendingDown,
        pulseColor: 'animate-pulse bg-rose-400'
      };
    } else {
      return {
        label: 'Neutral',
        color: 'bg-slate-500',
        textColor: 'text-slate-100',
        icon: Minus,
        pulseColor: 'animate-pulse bg-slate-400'
      };
    }
  };

  const sentimentBadge = getSentimentBadge(sentiment || 0.5);
  const SentimentIcon = sentimentBadge.icon;

  // Format price with proper currency formatting
  const formatPrice = (price) => {
    if (!price || price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Skeleton ticker symbol */}
            <div className="h-16 w-32 bg-slate-700 rounded animate-pulse"></div>
            {/* Skeleton price */}
            <div className="h-12 w-40 bg-slate-700 rounded animate-pulse"></div>
          </div>
          {/* Skeleton sentiment badge */}
          <div className="h-12 w-24 bg-slate-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900 border border-slate-700 rounded-lg p-8 mb-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        {/* Left side: Ticker and Price */}
        <div className="flex items-center space-x-8">
          {/* Ticker Symbol */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-white tracking-tight">
              {ticker || 'N/A'}
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">
              Stock Symbol
            </p>
          </motion.div>

          {/* Current Price */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-center"
          >
            <div className="text-4xl font-semibold text-white">
              {formatPrice(currentPrice)}
            </div>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider">
              Current Price
            </p>
          </motion.div>
        </div>

        {/* Right side: Sentiment Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative"
        >
          {/* Pulsing background effect */}
          <div className={`absolute inset-0 rounded-full ${sentimentBadge.pulseColor} opacity-75`}></div>
          
          {/* Main sentiment badge */}
          <div className={`relative ${sentimentBadge.color} ${sentimentBadge.textColor} px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg`}>
            <SentimentIcon className="w-6 h-6" />
            <span className="font-semibold text-lg">
              {sentimentBadge.label}
            </span>
          </div>

          {/* Sentiment score indicator */}
          {sentiment !== undefined && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="text-xs text-slate-400 text-center">
                Score: {(sentiment * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional info row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 pt-4 border-t border-slate-700"
      >
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-6">
            <span>Real-time data</span>
            <span>•</span>
            <span>AI-powered sentiment</span>
          </div>
          <div className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TickerHeader;