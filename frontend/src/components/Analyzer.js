import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ExternalLink,
  Calendar,
  BarChart3,
  AlertCircle,
  Loader2,
  PieChart,
  Activity,
  Plus,
  X,
  GitCompare
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analyzer = () => {
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Comparison functionality state
  const [comparisonStocks, setComparisonStocks] = useState(['AAPL', 'TSLA']);
  const [isComparingStocks, setIsComparingStocks] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonError, setComparisonError] = useState(null);

  const handleAnalyze = async () => {
    if (!stockSymbol.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      // Start analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbol: stockSymbol.trim().toUpperCase(),
          num_articles: 5
        })
      });

      const data = await response.json();
      
      if (data.status === 'started') {
        // Poll for results
        pollForResults();
      } else if (data.status === 'error') {
        setError(data.message);
        setIsAnalyzing(false);
      }
    } catch (err) {
      setError('Failed to start analysis: ' + err.message);
      setIsAnalyzing(false);
    }
  };

  const pollForResults = () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/analyze/status');
        const data = await response.json();

        if (!data.is_loading && data.articles && data.articles.length > 0) {
          clearInterval(pollInterval);
          setResults(data);
          setIsAnalyzing(false);
        } else if (data.error) {
          clearInterval(pollInterval);
          setError(data.error);
          setIsAnalyzing(false);
        }
      } catch (err) {
        clearInterval(pollInterval);
        setError('Failed to get results: ' + err.message);
        setIsAnalyzing(false);
      }
    }, 1500);

    // Set timeout to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isAnalyzing) {
        setError('Analysis is taking longer than expected. Please try again.');
        setIsAnalyzing(false);
      }
    }, 30000);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  // Comparison functionality
  const addComparisonStock = () => {
    if (comparisonStocks.length < 5) {
      setComparisonStocks([...comparisonStocks, '']);
    }
  };

  const removeComparisonStock = (index) => {
    if (comparisonStocks.length > 2) {
      const newStocks = comparisonStocks.filter((_, i) => i !== index);
      setComparisonStocks(newStocks);
    }
  };

  const updateComparisonStock = (index, value) => {
    const newStocks = [...comparisonStocks];
    newStocks[index] = value.toUpperCase();
    setComparisonStocks(newStocks);
  };

  const handleCompareStocks = async () => {
    const validStocks = comparisonStocks.filter(stock => stock.trim());
    if (validStocks.length < 2 || isComparingStocks) return;

    setIsComparingStocks(true);
    setComparisonError(null);
    setComparisonResults(null);

    try {
      const response = await fetch('/api/analyze/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock_symbols: validStocks
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setComparisonResults(data.results);
      } else {
        setComparisonError(data.message || 'Failed to compare stocks');
      }
      
      setIsComparingStocks(false);
    } catch (err) {
      setComparisonError('Failed to compare stocks: ' + err.message);
      setIsComparingStocks(false);
    }
  };

  const handleComparisonKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCompareStocks();
    }
  };

  // Chart data preparation functions
  const prepareSentimentBarData = () => {
    if (!results?.summary) return null;

    return {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          label: 'Article Count',
          data: [
            results.summary.Positive?.count || 0,
            results.summary.Negative?.count || 0,
            results.summary.Neutral?.count || 0,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(156, 163, 175, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)',
            'rgb(156, 163, 175)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  };

  const prepareSentimentDoughnutData = () => {
    if (!results?.summary) return null;

    return {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [
            results.summary.Positive?.percentage || 0,
            results.summary.Negative?.percentage || 0,
            results.summary.Neutral?.percentage || 0,
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(156, 163, 175, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(239, 68, 68)',
            'rgb(156, 163, 175)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const preparePolarityLineData = () => {
    if (!results?.articles) return null;

    const sortedArticles = [...results.articles].sort((a, b) => 
      new Date(a.published) - new Date(b.published)
    );

    return {
      labels: sortedArticles.map((_, index) => `Article ${index + 1}`),
      datasets: [
        {
          label: 'Sentiment Polarity',
          data: sortedArticles.map(article => article.polarity),
          borderColor: 'rgb(0, 255, 65)',
          backgroundColor: 'rgba(0, 255, 65, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(0, 255, 65)',
          pointBorderColor: 'rgb(0, 255, 65)',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(209, 213, 219)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Polarity: ${context.parsed.y.toFixed(3)}`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        min: -1,
        max: 1,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  };

  // Comparison chart preparation functions
  const prepareComparisonBarData = () => {
    if (!comparisonResults || comparisonResults.length === 0) return null;

    const stockLabels = comparisonResults.map(result => result.stock_symbol);
    
    return {
      labels: stockLabels,
      datasets: [
        {
          label: 'Positive Sentiment %',
          data: comparisonResults.map(result => result.summary.Positive?.percentage || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
        },
        {
          label: 'Negative Sentiment %',
          data: comparisonResults.map(result => result.summary.Negative?.percentage || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
        },
        {
          label: 'Neutral Sentiment %',
          data: comparisonResults.map(result => result.summary.Neutral?.percentage || 0),
          backgroundColor: 'rgba(156, 163, 175, 0.8)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 2,
        },
      ],
    };
  };

  const prepareComparisonPolarityData = () => {
    if (!comparisonResults || comparisonResults.length === 0) return null;

    const colors = [
      'rgb(0, 255, 65)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)',
      'rgb(153, 102, 255)',
    ];

    return {
      labels: Array.from({ length: Math.max(...comparisonResults.map(r => r.articles.length)) }, (_, i) => `Article ${i + 1}`),
      datasets: comparisonResults.map((result, index) => ({
        label: result.stock_symbol,
        data: result.articles.map(article => article.polarity),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: colors[index % colors.length],
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    };
  };

  const prepareComparisonSummaryData = () => {
    if (!comparisonResults || comparisonResults.length === 0) return null;

    const stockLabels = comparisonResults.map(result => result.stock_symbol);
    const avgPolarities = comparisonResults.map(result => {
      const totalPolarity = result.articles.reduce((sum, article) => sum + article.polarity, 0);
      return totalPolarity / result.articles.length;
    });

    return {
      labels: stockLabels,
      datasets: [
        {
          label: 'Average Sentiment Polarity',
          data: avgPolarities,
          backgroundColor: avgPolarities.map(polarity => 
            polarity > 0.1 ? 'rgba(34, 197, 94, 0.8)' :
            polarity < -0.1 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(156, 163, 175, 0.8)'
          ),
          borderColor: avgPolarities.map(polarity => 
            polarity > 0.1 ? 'rgb(34, 197, 94)' :
            polarity < -0.1 ? 'rgb(239, 68, 68)' : 'rgb(156, 163, 175)'
          ),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Stock Sentiment Analyzer</h1>
        <p className="text-gray-400">Real-time sentiment analysis of stock market news</p>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent"
              disabled={isAnalyzing}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !stockSymbol.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
              isAnalyzing || !stockSymbol.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#00FF41] hover:bg-[#00D435] transform hover:scale-105'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>💡 Try: AAPL, TSLA, MSFT, GOOGL, AMZN, META, NVDA, or any stock symbol</p>
        </div>
      </motion.div>

      {/* Stock Comparison Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
      >
        <div className="flex items-center mb-4">
          <GitCompare className="w-6 h-6 text-[#00FF41] mr-2" />
          <h3 className="text-xl font-bold text-white">Stock Comparison</h3>
        </div>
        
        <div className="space-y-4">
          {comparisonStocks.map((stock, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={stock}
                onChange={(e) => updateComparisonStock(index, e.target.value)}
                onKeyPress={handleComparisonKeyPress}
                placeholder={`Stock ${index + 1} (e.g., AAPL)`}
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00FF41] focus:border-transparent"
                disabled={isComparingStocks}
              />
              {comparisonStocks.length > 2 && (
                <button
                  onClick={() => removeComparisonStock(index)}
                  disabled={isComparingStocks}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex items-center gap-3">
            {comparisonStocks.length < 5 && (
              <button
                onClick={addComparisonStock}
                disabled={isComparingStocks}
                className="flex items-center px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </button>
            )}
            
            <button
              onClick={handleCompareStocks}
              disabled={isComparingStocks || comparisonStocks.filter(s => s.trim()).length < 2}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
                isComparingStocks || comparisonStocks.filter(s => s.trim()).length < 2
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-[#00FF41] hover:bg-[#00D435] transform hover:scale-105'
              }`}
            >
              {isComparingStocks ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  <span>Compare Stocks</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>📊 Compare sentiment analysis across multiple stocks (2-5 stocks)</p>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Analysis Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison Error Display */}
      {comparisonError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Comparison Error</h3>
              <p className="text-red-300">{comparisonError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sentiment Analysis for <span className="text-[#00FF41]">{results.stock_symbol}</span>
            </h2>
            <p className="text-gray-400">Based on recent news articles and market coverage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(results.summary).map(([sentiment, data]) => (
              <motion.div
                key={sentiment}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 text-center"
              >
                <div className="flex justify-center mb-3">
                  {getSentimentIcon(sentiment)}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{data.count}</div>
                <div className="text-gray-300 mb-1">{sentiment}</div>
                <div className="text-sm text-gray-400">{data.percentage}%</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Sentiment Distribution
              </h3>
              <div className="h-64">
                {prepareSentimentBarData() && (
                  <Bar data={prepareSentimentBarData()} options={chartOptions} />
                )}
              </div>
            </motion.div>

            {/* Doughnut Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <PieChart className="w-6 h-6 mr-2" />
                Sentiment Breakdown
              </h3>
              <div className="h-64">
                {prepareSentimentDoughnutData() && (
                  <Doughnut data={prepareSentimentDoughnutData()} options={doughnutOptions} />
                )}
              </div>
            </motion.div>

            {/* Line Chart - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2" />
                Sentiment Polarity Timeline
              </h3>
              <div className="h-64">
                {preparePolarityLineData() && (
                  <Line data={preparePolarityLineData()} options={lineOptions} />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p>Polarity ranges from -1 (very negative) to +1 (very positive). Values near 0 indicate neutral sentiment.</p>
              </div>
            </motion.div>
          </div>

          {/* Articles List */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Recent Articles ({results.articles.length})
            </h3>

            <div className="space-y-4">
              {results.articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-l-4 rounded-r-xl p-4 bg-gray-800/30 ${
                    article.sentiment === 'Positive' ? 'border-green-500' :
                    article.sentiment === 'Negative' ? 'border-red-500' : 'border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-semibold text-lg leading-tight flex-1 mr-4">
                      {article.title}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(article.sentiment)}`}>
                      {getSentimentIcon(article.sentiment)}
                      <span className="ml-1">{article.sentiment}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.published).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Polarity: {article.polarity.toFixed(3)}
                      </div>
                    </div>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-[#00FF41] hover:text-[#00D435] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read Article
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {results.last_updated && (
              <div className="text-center mt-6 text-sm text-gray-500">
                Last updated: {new Date(results.last_updated).toLocaleString()}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Comparison Results Section */}
      {comparisonResults && comparisonResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Stock Comparison Results
            </h2>
            <p className="text-gray-400">Sentiment analysis comparison across {comparisonResults.length} stocks</p>
          </div>

          {/* Comparison Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {comparisonResults.map((result, index) => {
              const avgPolarity = result.articles.reduce((sum, article) => sum + article.polarity, 0) / result.articles.length;
              const dominantSentiment = Object.entries(result.summary).reduce((a, b) => 
                result.summary[a[0]]?.count > result.summary[b[0]]?.count ? a : b
              )[0];
              
              return (
                <motion.div
                  key={result.stock_symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 text-center"
                >
                  <div className="text-xl font-bold text-[#00FF41] mb-2">{result.stock_symbol}</div>
                  <div className="flex justify-center mb-2">
                    {getSentimentIcon(dominantSentiment)}
                  </div>
                  <div className="text-sm text-gray-300 mb-1">Avg Polarity</div>
                  <div className="text-lg font-semibold text-white">{avgPolarity.toFixed(3)}</div>
                  <div className="text-xs text-gray-400">{result.articles.length} articles</div>
                </motion.div>
              );
            })}
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentiment Comparison Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Sentiment Comparison
              </h3>
              <div className="h-64">
                {prepareComparisonBarData() && (
                  <Bar data={prepareComparisonBarData()} options={chartOptions} />
                )}
              </div>
            </motion.div>

            {/* Average Polarity Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <PieChart className="w-6 h-6 mr-2" />
                Average Polarity
              </h3>
              <div className="h-64">
                {prepareComparisonSummaryData() && (
                  <Bar data={prepareComparisonSummaryData()} options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        min: -1,
                        max: 1,
                      }
                    }
                  }} />
                )}
              </div>
            </motion.div>

            {/* Polarity Timeline Comparison - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2" />
                Polarity Timeline Comparison
              </h3>
              <div className="h-64">
                {prepareComparisonPolarityData() && (
                  <Line data={prepareComparisonPolarityData()} options={lineOptions} />
                )}
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p>Compare sentiment polarity trends across different stocks over their recent articles.</p>
              </div>
            </motion.div>
          </div>

          {/* Comparison Summary Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Comparison Summary
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="pb-3 text-gray-300 font-semibold">Stock</th>
                    <th className="pb-3 text-gray-300 font-semibold">Articles</th>
                    <th className="pb-3 text-gray-300 font-semibold">Positive %</th>
                    <th className="pb-3 text-gray-300 font-semibold">Negative %</th>
                    <th className="pb-3 text-gray-300 font-semibold">Neutral %</th>
                    <th className="pb-3 text-gray-300 font-semibold">Avg Polarity</th>
                    <th className="pb-3 text-gray-300 font-semibold">Dominant</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonResults.map((result, index) => {
                    const avgPolarity = result.articles.reduce((sum, article) => sum + article.polarity, 0) / result.articles.length;
                    const dominantSentiment = Object.entries(result.summary).reduce((a, b) => 
                      result.summary[a[0]]?.count > result.summary[b[0]]?.count ? a : b
                    )[0];
                    
                    return (
                      <tr key={result.stock_symbol} className="border-b border-gray-800">
                        <td className="py-3 text-[#00FF41] font-semibold">{result.stock_symbol}</td>
                        <td className="py-3 text-white">{result.articles.length}</td>
                        <td className="py-3 text-green-400">{result.summary.Positive?.percentage.toFixed(1)}%</td>
                        <td className="py-3 text-red-400">{result.summary.Negative?.percentage.toFixed(1)}%</td>
                        <td className="py-3 text-gray-400">{result.summary.Neutral?.percentage.toFixed(1)}%</td>
                        <td className={`py-3 font-semibold ${
                          avgPolarity > 0.1 ? 'text-green-400' :
                          avgPolarity < -0.1 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {avgPolarity.toFixed(3)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(dominantSentiment)}`}>
                            {dominantSentiment}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analyzer;