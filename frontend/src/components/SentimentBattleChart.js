import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { Swords, TrendingUp, TrendingDown } from 'lucide-react';

const SentimentBattleChart = ({ battleMetrics, loading = false }) => {
  // Process data for the diverging bar chart
  const chartData = React.useMemo(() => {
    if (!battleMetrics?.sentiment_scores) return [];

    return Object.entries(battleMetrics.sentiment_scores).map(([ticker, score]) => {
      // Convert 0-1 scale to -1 to 1 scale for diverging chart
      const normalizedScore = (score - 0.5) * 2;
      
      return {
        ticker,
        sentiment: normalizedScore,
        rawScore: score,
        label: normalizedScore > 0.2 ? 'Bullish' : 
               normalizedScore < -0.2 ? 'Bearish' : 'Neutral',
        color: normalizedScore > 0.2 ? '#10B981' : 
               normalizedScore < -0.2 ? '#F43F5E' : '#94A3B8'
      };
    }).sort((a, b) => b.sentiment - a.sentiment); // Sort by sentiment score
  }, [battleMetrics]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-400">Sentiment:</span> {data.label}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Score:</span> {(data.rawScore * 100).toFixed(0)}%
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Normalized:</span> {data.sentiment.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom bar shape for diverging bars
  const CustomBar = (props) => {
    const { fill, ...rest } = props;
    return <Bar {...rest} fill={props.payload?.color || fill} />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Swords className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Sentiment Battle</h2>
        </div>
        
        <div className="h-80 bg-slate-800 rounded animate-pulse flex items-center justify-center">
          <div className="text-slate-500">Loading battle chart...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Swords className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Sentiment Battle</h2>
        </div>
        
        <div className="h-80 bg-slate-800 rounded flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sentiment data available</p>
            <p className="text-sm mt-2">Battle chart will appear when tickers are analyzed</p>
          </div>
        </div>
      </div>
    );
  }

  // Find the winner
  const winner = chartData[0];
  const isWinnerBullish = winner.sentiment > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 border border-slate-700 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Swords className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Sentiment Battle</h2>
        </div>
        
        {/* Winner indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          isWinnerBullish ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {isWinnerBullish ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="font-medium text-sm">
            {winner.ticker} leads ({winner.label})
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number"
              domain={[-1, 1]}
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value === -1) return 'Bearish';
                if (value === 0) return 'Neutral';
                if (value === 1) return 'Bullish';
                return '';
              }}
            />
            <YAxis 
              type="category"
              dataKey="ticker"
              stroke="#9CA3AF"
              fontSize={14}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Reference line at center (neutral) */}
            <ReferenceLine x={0} stroke="#64748B" strokeDasharray="2 2" />
            
            {/* Bars */}
            <Bar dataKey="sentiment" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and Stats */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                <span className="text-slate-400">Bullish Sentiment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded"></div>
                <span className="text-slate-400">Bearish Sentiment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-400 rounded"></div>
                <span className="text-slate-400">Neutral Sentiment</span>
              </div>
            </div>
          </div>

          {/* Battle Stats */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Battle Stats</h4>
            <div className="space-y-1 text-xs text-slate-400">
              <div>
                Bullish: {chartData.filter(d => d.sentiment > 0.2).length} ticker{chartData.filter(d => d.sentiment > 0.2).length !== 1 ? 's' : ''}
              </div>
              <div>
                Bearish: {chartData.filter(d => d.sentiment < -0.2).length} ticker{chartData.filter(d => d.sentiment < -0.2).length !== 1 ? 's' : ''}
              </div>
              <div>
                Neutral: {chartData.filter(d => d.sentiment >= -0.2 && d.sentiment <= 0.2).length} ticker{chartData.filter(d => d.sentiment >= -0.2 && d.sentiment <= 0.2).length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Sentiment Scores</h4>
            <div className="space-y-1 text-xs">
              {chartData.map((item) => (
                <div key={item.ticker} className="flex justify-between">
                  <span className="text-slate-400">{item.ticker}:</span>
                  <span className={`font-medium ${
                    item.sentiment > 0.2 ? 'text-emerald-400' :
                    item.sentiment < -0.2 ? 'text-rose-400' : 'text-slate-400'
                  }`}>
                    {(item.rawScore * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Description */}
        <div className="mt-4 text-xs text-slate-500 text-center">
          Diverging bar chart • Center line represents neutral sentiment • Longer bars indicate stronger sentiment
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentBattleChart;