import { useState, useEffect } from 'react';
import TradingViewMarketSummary from './TradingViewMarketSummary';
import TradingViewEconomicCalendar from './TradingViewEconomicCalendar';
import { TrendingUp, TrendingDown, Minus, Calendar, Clock } from 'lucide-react';

const DashboardHome = () => {
  const [marketCommentary, setMarketCommentary] = useState(null);

  useEffect(() => {
    // Generate dynamic market commentary based on current date
    const generateMarketCommentary = () => {
      const today = new Date();
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
      const date = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Generate realistic market movements (this would typically come from an API)
      const movements = [
        {
          index: 'S&P 500',
          change: (Math.random() * 4 - 2).toFixed(2), // -2% to +2%
          direction: Math.random() > 0.5 ? 'up' : 'down'
        },
        {
          index: 'NASDAQ',
          change: (Math.random() * 6 - 3).toFixed(2), // -3% to +3%
          direction: Math.random() > 0.5 ? 'up' : 'down'
        },
        {
          index: 'Dow Jones',
          change: (Math.random() * 3 - 1.5).toFixed(2), // -1.5% to +1.5%
          direction: Math.random() > 0.5 ? 'up' : 'down'
        }
      ];

      // Determine overall market sentiment
      const positiveCount = movements.filter(m => parseFloat(m.change) > 0).length;
      const overallSentiment = positiveCount >= 2 ? 'positive' : positiveCount === 1 ? 'mixed' : 'negative';

      const sentimentDescriptions = {
        positive: [
          "Markets are showing strong momentum today with broad-based gains across major indices.",
          "Investor optimism is driving markets higher as economic indicators remain supportive.",
          "Risk-on sentiment prevails as markets advance on positive economic developments."
        ],
        mixed: [
          "Markets are showing mixed performance today with selective sector rotation.",
          "Trading remains choppy as investors weigh conflicting economic signals.",
          "Markets are consolidating with divergent performance across different sectors."
        ],
        negative: [
          "Markets are under pressure today as investors remain cautious amid economic uncertainties.",
          "Risk-off sentiment is weighing on markets with broad-based declines.",
          "Markets are retreating as concerns over economic headwinds persist."
        ]
      };

      const randomDescription = sentimentDescriptions[overallSentiment][
        Math.floor(Math.random() * sentimentDescriptions[overallSentiment].length)
      ];

      return {
        date,
        dayOfWeek,
        movements,
        overallSentiment,
        description: randomDescription,
        lastUpdated: today.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
    };

    setMarketCommentary(generateMarketCommentary());
  }, []);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'negative':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
        <p className="text-gray-400">Your daily market briefing</p>
      </div>

      {/* Market Summary - Full Width */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Market Summary</h3>
        <TradingViewMarketSummary />
      </div>

      {/* Market Commentary and Economic Calendar Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side - Today's Market Movement (2/3 width) */}
        <div className="xl:col-span-2">
          {marketCommentary && (
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  {getSentimentIcon(marketCommentary.overallSentiment)}
                  <span className="ml-2">Today's Market Movement</span>
                </h3>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated {marketCommentary.lastUpdated}</span>
                </div>
              </div>

              {/* Date and Overall Sentiment */}
              <div className="flex items-center mb-4">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-300">{marketCommentary.dayOfWeek}, {marketCommentary.date}</span>
                <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(marketCommentary.overallSentiment)}`}>
                  {marketCommentary.overallSentiment.charAt(0).toUpperCase() + marketCommentary.overallSentiment.slice(1)} Sentiment
                </div>
              </div>

              {/* Market Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {marketCommentary.description}
              </p>

              {/* Key Index Movements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketCommentary.movements.map((movement, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">{movement.index}</span>
                      <div className={`flex items-center ${
                        parseFloat(movement.change) > 0 ? 'text-green-400' : 
                        parseFloat(movement.change) < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {parseFloat(movement.change) > 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : parseFloat(movement.change) < 0 ? (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        ) : (
                          <Minus className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-semibold">
                          {parseFloat(movement.change) > 0 ? '+' : ''}{movement.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">
                  * Market commentary is generated for demonstration purposes. For real-time analysis, please consult professional financial sources.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Economic Calendar (1/3 width) */}
        <div className="xl:col-span-1">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 h-full">
            <h3 className="text-lg font-bold text-white mb-4">Economic Events</h3>
            <TradingViewEconomicCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;