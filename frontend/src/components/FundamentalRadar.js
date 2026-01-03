import React from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Target, TrendingUp, Shield, Zap, Heart } from 'lucide-react';

const FundamentalRadar = ({ battleMetrics, loading = false }) => {
  // Process data for radar chart
  const radarData = React.useMemo(() => {
    if (!battleMetrics) return [];

    const axes = ['Growth', 'Safety', 'Hype', 'Sentiment'];
    
    return axes.map(axis => {
      const dataPoint = { axis };
      
      // Add data for each ticker
      Object.keys(battleMetrics.sentiment_scores || {}).forEach(ticker => {
        let value = 0;
        
        switch (axis) {
          case 'Growth':
            value = (battleMetrics.growth_scores?.[ticker] || 0) * 100;
            break;
          case 'Safety':
            value = (battleMetrics.safety_scores?.[ticker] || 0) * 100;
            break;
          case 'Hype':
            value = (battleMetrics.hype_scores?.[ticker] || 0) * 100;
            break;
          case 'Sentiment':
            value = (battleMetrics.sentiment_scores?.[ticker] || 0) * 100;
            break;
          default:
            value = 0;
        }
        
        dataPoint[ticker] = Math.round(value);
      });
      
      return dataPoint;
    });
  }, [battleMetrics]);

  // Get ticker colors
  const getTickerColor = (index) => {
    const colors = ['#10B981', '#F43F5E', '#3B82F6', '#F59E0B', '#8B5CF6'];
    return colors[index % colors.length];
  };

  // Get tickers list
  const tickers = Object.keys(battleMetrics?.sentiment_scores || {});

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-slate-300">
                  {entry.dataKey}: {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get axis icon
  const getAxisIcon = (axis) => {
    switch (axis) {
      case 'Growth':
        return TrendingUp;
      case 'Safety':
        return Shield;
      case 'Hype':
        return Zap;
      case 'Sentiment':
        return Heart;
      default:
        return Target;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Fundamental Radar</h2>
        </div>
        
        <div className="h-96 bg-slate-800 rounded animate-pulse flex items-center justify-center">
          <div className="text-slate-500">Loading radar chart...</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!radarData || radarData.length === 0 || tickers.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Fundamental Radar</h2>
        </div>
        
        <div className="h-96 bg-slate-800 rounded flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comparison data available</p>
            <p className="text-sm mt-2">Radar chart will appear when tickers are analyzed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-slate-900 border border-slate-700 rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-white">Fundamental Radar</h2>
        <div className="text-sm text-slate-400">
          • 4-Axis Comparison
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="axis" 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              className="text-slate-400"
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickCount={6}
            />
            
            {/* Radar areas for each ticker */}
            {tickers.map((ticker, index) => (
              <Radar
                key={ticker}
                name={ticker}
                dataKey={ticker}
                stroke={getTickerColor(index)}
                fill={getTickerColor(index)}
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ fill: getTickerColor(index), strokeWidth: 2, r: 4 }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and Analysis */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Legend */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Tickers</h4>
            <div className="space-y-2">
              {tickers.map((ticker, index) => (
                <div key={ticker} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2"
                    style={{ 
                      backgroundColor: `${getTickerColor(index)}20`,
                      borderColor: getTickerColor(index)
                    }}
                  ></div>
                  <span className="text-white font-medium">{ticker}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Axis Explanations */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Metrics</h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'Growth', desc: 'Derived from P/E ratios (lower P/E = higher growth potential)', icon: TrendingUp },
                { name: 'Safety', desc: 'Based on market capitalization (larger = safer)', icon: Shield },
                { name: 'Hype', desc: 'Trading volume and news coverage intensity', icon: Zap },
                { name: 'Sentiment', desc: 'AI-analyzed news sentiment score', icon: Heart }
              ].map(({ name, desc, icon: Icon }) => (
                <div key={name} className="flex items-start space-x-2">
                  <Icon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-slate-300 font-medium">{name}</div>
                    <div className="text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Performance Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {['Growth', 'Safety', 'Hype', 'Sentiment'].map(metric => {
              const scores = tickers.map(ticker => {
                const dataPoint = radarData.find(d => d.axis === metric);
                return { ticker, score: dataPoint?.[ticker] || 0 };
              }).sort((a, b) => b.score - a.score);
              
              const leader = scores[0];
              
              return (
                <div key={metric} className="bg-slate-800/50 p-3 rounded-lg">
                  <div className="text-slate-400 mb-1">{metric} Leader</div>
                  <div className="text-white font-medium">{leader.ticker}</div>
                  <div className="text-slate-400">{leader.score}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Description */}
        <div className="mt-4 text-xs text-slate-500 text-center">
          Radar chart comparing 4 key metrics • Larger areas indicate stronger performance • Scale: 0-100%
        </div>
      </div>
    </motion.div>
  );
};

export default FundamentalRadar;