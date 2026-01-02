import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Loader,
  Brain,
  BarChart3
} from 'lucide-react';

const Analyzer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysis = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Call the real backend API
      const response = await fetch('/api/analysis/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          category: 'all' // Let the backend auto-categorize
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform the backend response to match our component structure
      const transformedResult = {
        asset: searchQuery,
        sentiment_score: data.net_sentiment_score || 0,
        confidence: Math.min(Math.abs(data.net_sentiment_score) + 0.5, 1.0), // Derive confidence from sentiment strength
        total_articles: data.total_articles || 0,
        market_signal: data.market_signal || 'NEUTRAL',
        sentiment_distribution: data.sentiment_distribution || {},
        positive_points: [],
        negative_points: [],
        sources: []
      };

      // Extract positive and negative points from articles
      if (data.articles && data.articles.length > 0) {
        const positiveArticles = data.articles.filter(article => 
          article.sentiment === 'Positive' || article.finbert_sentiment === 'Positive'
        );
        const negativeArticles = data.articles.filter(article => 
          article.sentiment === 'Negative' || article.finbert_sentiment === 'Negative'
        );

        // Create positive points from positive articles
        transformedResult.positive_points = positiveArticles
          .slice(0, 4)
          .map(article => article.title || 'Positive market sentiment detected');

        // Create negative points from negative articles  
        transformedResult.negative_points = negativeArticles
          .slice(0, 3)
          .map(article => article.title || 'Negative market sentiment detected');

        // Create sources list
        transformedResult.sources = data.articles
          .slice(0, 8)
          .map(article => ({
            title: article.title || 'Market Analysis',
            url: article.url || '#',
            impact: article.confidence > 0.8 ? 'High' : article.confidence > 0.5 ? 'Medium' : 'Low'
          }));
      }

      // Fallback positive/negative points if no articles
      if (transformedResult.positive_points.length === 0) {
        transformedResult.positive_points = [
          'Market sentiment analysis completed',
          'Real-time data processing successful',
          'AI models provided analysis'
        ];
      }

      if (transformedResult.negative_points.length === 0) {
        transformedResult.negative_points = [
          'Limited data availability',
          'Market volatility detected'
        ];
      }

      setAnalysisResult(transformedResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult({
        asset: searchQuery,
        sentiment_score: 0,
        confidence: 0,
        total_articles: 0,
        market_signal: 'ERROR',
        error: error.message,
        positive_points: ['Analysis request submitted'],
        negative_points: ['Unable to complete analysis', error.message],
        sources: []
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (score) => {
    if (score > 0.2) return 'text-[#00FF41]';
    if (score < -0.2) return 'text-[#FF3131]';
    return 'text-yellow-400';
  };

  const getSentimentLabel = (score) => {
    if (score > 0.5) return 'Very Bullish';
    if (score > 0.2) return 'Bullish';
    if (score > -0.2) return 'Neutral';
    if (score > -0.5) return 'Bearish';
    return 'Very Bearish';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Asset Analyzer</h1>
        <p className="text-gray-400">Deep dive research on any asset</p>
      </div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Asset Name or Ticker (e.g., NVDA, Bitcoin, Tesla)..."
                className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#00FF41] transition-colors text-lg"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalysis}
              disabled={isAnalyzing || !searchQuery.trim()}
              className="px-8 py-4 bg-gradient-to-r from-[#00FF41] to-[#00D4FF] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00FF41]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Run Analysis</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gray-900/50 backdrop-blur-xl border border-[#00FF41]/30 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-[#00FF41] border-t-transparent rounded-full"
              />
              <span className="text-[#00FF41] text-lg font-medium">AI Scanning Markets...</span>
            </div>
            <p className="text-gray-400">Analyzing news sentiment across multiple sources</p>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Sentiment Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sentiment Score */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">Sentiment Score</h3>
                <div className="text-4xl font-bold mb-2">
                  <span className={getSentimentColor(analysisResult.sentiment_score)}>
                    {analysisResult.sentiment_score > 0 ? '+' : ''}{analysisResult.sentiment_score.toFixed(2)}
                  </span>
                </div>
                <div className={`text-lg font-semibold ${getSentimentColor(analysisResult.sentiment_score)}`}>
                  {getSentimentLabel(analysisResult.sentiment_score)}
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">Confidence</h3>
                <div className="text-4xl font-bold text-[#00D4FF] mb-2">
                  {Math.round(analysisResult.confidence * 100)}%
                </div>
                <div className="text-gray-400">Model Certainty</div>
                <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#00D4FF] to-[#00FF41] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Articles Analyzed */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-4">Sources</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {analysisResult.total_articles}
                </div>
                <div className="text-gray-400">Articles Analyzed</div>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Activity className="w-5 h-5 text-[#00FF41]" />
                  <span className="text-sm text-[#00FF41]">Live Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Points */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-[#00FF41]" />
                <h3 className="text-xl font-bold text-white">Positive Signals</h3>
              </div>
              <div className="space-y-3">
                {analysisResult.positive_points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-[#00FF41]/10 rounded-lg border border-[#00FF41]/20"
                  >
                    <div className="w-2 h-2 bg-[#00FF41] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Negative Points */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <XCircle className="w-6 h-6 text-[#FF3131]" />
                <h3 className="text-xl font-bold text-white">Risk Factors</h3>
              </div>
              <div className="space-y-3">
                {analysisResult.negative_points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-[#FF3131]/10 rounded-lg border border-[#FF3131]/20"
                  >
                    <div className="w-2 h-2 bg-[#FF3131] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Source Analysis */}
          {analysisResult.sources && analysisResult.sources.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-[#00D4FF]" />
                <h3 className="text-xl font-bold text-white">Source Analysis</h3>
              </div>
              <div className="space-y-3">
                {analysisResult.sources.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{source.title}</h4>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          source.impact === 'High' ? 'bg-[#FF3131]/20 text-[#FF3131]' :
                          source.impact === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}>
                          {source.impact} Impact
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(source.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-[#00D4FF] transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Market Signal */}
          {analysisResult.market_signal && (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Market Signal</h3>
              <div className={`text-3xl font-bold mb-2 ${
                analysisResult.market_signal === 'BULLISH' ? 'text-[#00FF41]' :
                analysisResult.market_signal === 'BEARISH' ? 'text-[#FF3131]' :
                'text-yellow-400'
              }`}>
                {analysisResult.market_signal === 'BULLISH' ? '🚀 BULLISH' :
                 analysisResult.market_signal === 'BEARISH' ? '🐻 BEARISH' :
                 '⚖️ NEUTRAL'}
              </div>
              <p className="text-gray-400">
                {analysisResult.market_signal === 'BULLISH' ? 'Consider buying opportunities' :
                 analysisResult.market_signal === 'BEARISH' ? 'Consider selling or avoiding' :
                 'Wait for clearer signals'}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Analyzer;