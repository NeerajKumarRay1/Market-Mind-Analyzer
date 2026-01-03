import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import TickerHeader from './TickerHeader';
import VitalsGrid from './VitalsGrid';
import PriceChart from './PriceChart';
import NewsFeed from './NewsFeed';

const DeepDiveDashboard = ({ ticker, onBack, onTickerChange }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch detailed analysis for the ticker
  const fetchAnalysis = async (tickerSymbol) => {
    if (!tickerSymbol) return;

    setLoading(true);
    setError(null);

    try {
      // Call the FastAPI backend endpoint
      const response = await fetch('/api/analyze/detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: tickerSymbol }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Analysis fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analysis when ticker changes
  useEffect(() => {
    if (ticker) {
      fetchAnalysis(ticker);
    }
  }, [ticker]);

  // Handle refresh
  const handleRefresh = () => {
    if (ticker) {
      fetchAnalysis(ticker);
    }
  };

  // Extract data for components
  const financialData = analysisData?.financial_data;
  const priceHistory = analysisData?.price_history;
  const sentimentAnalysis = analysisData?.sentiment_analysis;
  const newsArticles = analysisData?.news_articles || [];
  const aiVerdict = analysisData?.ai_verdict;
  const derivedMetrics = analysisData?.derived_metrics;

  // Calculate sentiment score for header
  const sentimentScore = derivedMetrics?.sentiment_score || 0.5;

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
            <h1 className="text-xl font-semibold">Deep Dive Analysis</h1>
          </div>

          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-slate-400">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
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
                <h3 className="text-rose-400 font-medium">Analysis Error</h3>
                <p className="text-rose-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ticker Header */}
        <TickerHeader
          ticker={ticker}
          currentPrice={financialData?.current_price}
          sentiment={sentimentScore}
          loading={loading && !analysisData}
        />

        {/* Vitals Grid */}
        <VitalsGrid
          financialData={financialData}
          aiVerdict={aiVerdict}
          loading={loading && !analysisData}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PriceChart
              priceHistory={priceHistory}
              newsEvents={newsArticles}
              loading={loading && !analysisData}
              ticker={ticker}
            />
          </div>

          {/* News Feed - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <div className="h-96 lg:h-full">
              <NewsFeed
                articles={newsArticles}
                loading={loading && !analysisData}
                ticker={ticker}
              />
            </div>
          </div>
        </div>

        {/* Additional Analysis Details */}
        {analysisData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-slate-900 border border-slate-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Confidence Score */}
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {(analysisData.confidence_score * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400 mt-1">AI Confidence</div>
              </div>

              {/* Sentiment Distribution */}
              {sentimentAnalysis?.sentiment_distribution && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {sentimentAnalysis.sentiment_distribution.positive || 0}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Positive Articles</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rose-400">
                      {sentimentAnalysis.sentiment_distribution.negative || 0}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Negative Articles</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-400">
                      {sentimentAnalysis.sentiment_distribution.neutral || 0}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">Neutral Articles</div>
                  </div>
                </>
              )}
            </div>

            {/* Sector and Industry Info */}
            {(financialData?.sector || financialData?.industry) && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center space-x-6 text-sm">
                  {financialData.sector && (
                    <div>
                      <span className="text-slate-400">Sector:</span>
                      <span className="text-white ml-2">{financialData.sector}</span>
                    </div>
                  )}
                  {financialData.industry && (
                    <div>
                      <span className="text-slate-400">Industry:</span>
                      <span className="text-white ml-2">{financialData.industry}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeepDiveDashboard;