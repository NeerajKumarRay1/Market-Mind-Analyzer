import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Swords, RefreshCw, AlertCircle, Play } from 'lucide-react';
import TickerSelector from './TickerSelector';
import SentimentBattleChart from './SentimentBattleChart';
import FundamentalRadar from './FundamentalRadar';

const BattleMode = ({ onBack }) => {
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [hasStartedBattle, setHasStartedBattle] = useState(false);

  // Fetch comparison analysis
  const fetchComparison = async (tickers) => {
    if (!tickers || tickers.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setComparisonData(data);
      setLastUpdated(new Date());
      setHasStartedBattle(true);
    } catch (err) {
      console.error('Comparison fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle ticker selection changes
  const handleTickersChange = (newTickers) => {
    setSelectedTickers(newTickers);
    // Clear previous data when tickers change
    if (comparisonData) {
      setComparisonData(null);
      setHasStartedBattle(false);
    }
  };

  // Start battle
  const startBattle = () => {
    if (selectedTickers.length >= 2) {
      fetchComparison(selectedTickers);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    if (selectedTickers.length >= 2) {
      fetchComparison(selectedTickers);
    }
  };

  // Auto-start battle when we have enough tickers
  useEffect(() => {
    if (selectedTickers.length >= 2 && !hasStartedBattle && !loading) {
      // Small delay to let user see the selection
      const timer = setTimeout(() => {
        startBattle();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedTickers, hasStartedBattle, loading]);

  const canStartBattle = selectedTickers.length >= 2 && !loading;
  const battleMetrics = comparisonData?.battle_metrics;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header Navigation */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-3">
              <Swords className="w-6 h-6 text-rose-400" />
              <h1 className="text-xl font-semibold">Battle Mode</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-slate-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            {hasStartedBattle && (
              <button
                onClick={handleRefresh}
                disabled={loading || selectedTickers.length < 2}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Battle</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <div>
                <h3 className="text-rose-400 font-medium">Battle Error</h3>
                <p className="text-rose-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ticker Selection */}
        <TickerSelector
          selectedTickers={selectedTickers}
          onTickersChange={handleTickersChange}
          maxTickers={3}
        />

        {/* Battle Start Button */}
        <AnimatePresence>
          {canStartBattle && !hasStartedBattle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 text-center"
            >
              <button
                onClick={startBattle}
                disabled={loading}
                className="bg-gradient-to-r from-rose-600 to-emerald-600 hover:from-rose-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                <span>Start Battle!</span>
                <Swords className="w-6 h-6" />
              </button>
              <p className="text-slate-400 text-sm mt-3">
                Compare {selectedTickers.length} tickers across sentiment and fundamentals
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Battle Results */}
        <AnimatePresence>
          {(hasStartedBattle || loading) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 space-y-8"
            >
              {/* Battle Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-rose-500/10 to-emerald-500/10 border border-slate-600 rounded-full px-6 py-3"
                >
                  <Swords className="w-6 h-6 text-slate-300" />
                  <span className="text-xl font-semibold">
                    {selectedTickers.join(' vs ')} Battle
                  </span>
                  <Swords className="w-6 h-6 text-slate-300 rotate-180" />
                </motion.div>
                
                {loading && (
                  <p className="text-slate-400 text-sm mt-3">
                    Analyzing {selectedTickers.length} tickers... This may take up to 15 seconds.
                  </p>
                )}
              </div>

              {/* Battle Charts Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Sentiment Battle Chart */}
                <SentimentBattleChart
                  battleMetrics={battleMetrics}
                  loading={loading}
                />

                {/* Fundamental Radar Chart */}
                <FundamentalRadar
                  battleMetrics={battleMetrics}
                  loading={loading}
                />
              </div>

              {/* Battle Summary */}
              {comparisonData && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-6 text-center">
                    Battle Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Overall Winner */}
                    <div className="text-center bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">
                        {/* Calculate overall winner based on average scores */}
                        {(() => {
                          const tickers = Object.keys(battleMetrics?.sentiment_scores || {});
                          const overallScores = tickers.map(ticker => {
                            const sentiment = battleMetrics?.sentiment_scores?.[ticker] || 0;
                            const growth = battleMetrics?.growth_scores?.[ticker] || 0;
                            const safety = battleMetrics?.safety_scores?.[ticker] || 0;
                            const hype = battleMetrics?.hype_scores?.[ticker] || 0;
                            const average = (sentiment + growth + safety + hype) / 4;
                            return { ticker, score: average };
                          });
                          const winner = overallScores.sort((a, b) => b.score - a.score)[0];
                          return winner?.ticker || 'N/A';
                        })()}
                      </div>
                      <div className="text-sm text-slate-400">Overall Winner</div>
                    </div>

                    {/* Category Winners */}
                    {[
                      { key: 'sentiment_scores', label: 'Sentiment Leader', color: 'text-rose-400' },
                      { key: 'growth_scores', label: 'Growth Leader', color: 'text-blue-400' },
                      { key: 'safety_scores', label: 'Safety Leader', color: 'text-emerald-400' }
                    ].map(({ key, label, color }) => {
                      const scores = battleMetrics?.[key] || {};
                      const leader = Object.entries(scores).sort(([,a], [,b]) => b - a)[0];
                      
                      return (
                        <div key={key} className="text-center bg-slate-800/50 border border-slate-600 rounded-lg p-4">
                          <div className={`text-2xl font-bold ${color} mb-1`}>
                            {leader?.[0] || 'N/A'}
                          </div>
                          <div className="text-sm text-slate-400">{label}</div>
                          {leader && (
                            <div className="text-xs text-slate-500 mt-1">
                              {(leader[1] * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Individual Analysis Links */}
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <h4 className="text-sm font-medium text-slate-300 mb-3 text-center">
                      Individual Analysis Available
                    </h4>
                    <div className="flex justify-center space-x-4">
                      {selectedTickers.map(ticker => (
                        <div key={ticker} className="text-center">
                          <div className="text-white font-medium">{ticker}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            Click ticker for deep dive
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {selectedTickers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <Swords className="w-16 h-16 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-300 mb-4">
              Ready for Battle?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Select 2-3 stock tickers above to compare their sentiment analysis and fundamental metrics. 
              See which stock comes out on top in our AI-powered battle arena!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BattleMode;