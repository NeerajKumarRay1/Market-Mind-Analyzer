import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const PriceChart = ({ priceHistory, newsEvents = [], loading = false, ticker }) => {
  // Process price data for Recharts
  const chartData = useMemo(() => {
    if (!priceHistory?.prices || priceHistory.prices.length === 0) {
      return [];
    }

    return priceHistory.prices.map(price => ({
      date: new Date(price.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: new Date(price.date),
      price: price.close,
      open: price.open,
      high: price.high,
      low: price.low,
      volume: price.volume
    }));
  }, [priceHistory]);

  // Process news events for overlay
  const processedNewsEvents = useMemo(() => {
    if (!newsEvents || newsEvents.length === 0 || chartData.length === 0) {
      return [];
    }

    return newsEvents.map(event => {
      const eventDate = new Date(event.date);
      // Find the closest price point
      const closestPrice = chartData.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.fullDate - eventDate);
        const currDiff = Math.abs(curr.fullDate - eventDate);
        return currDiff < prevDiff ? curr : prev;
      });

      return {
        ...event,
        x: closestPrice.date,
        y: closestPrice.price,
        sentiment: event.sentiment || 'neutral'
      };
    });
  }, [newsEvents, chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
          <p className="text-slate-300 font-medium mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-white">
              <span className="text-slate-400">Close:</span> ${data.price.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Open:</span> ${data.open.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">High:</span> ${data.high.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Low:</span> ${data.low.toFixed(2)}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400">Volume:</span> {data.volume.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom news event dot
  const NewsEventDot = ({ cx, cy, payload }) => {
    const getEventColor = (sentiment) => {
      switch (sentiment) {
        case 'positive':
        case 'bullish':
          return '#10B981'; // emerald-500
        case 'negative':
        case 'bearish':
          return '#F43F5E'; // rose-500
        default:
          return '#94A3B8'; // slate-400
      }
    };

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={getEventColor(payload.sentiment)}
        stroke="#1E293B"
        strokeWidth={2}
        className="animate-pulse"
      />
    );
  };

  // Calculate price change
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return { amount: 0, percentage: 0, isPositive: true };
    
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const amount = lastPrice - firstPrice;
    const percentage = (amount / firstPrice) * 100;
    
    return {
      amount,
      percentage,
      isPositive: amount >= 0
    };
  }, [chartData]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Price Chart</h2>
          </div>
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse"></div>
        </div>
        
        <div className="h-96 bg-slate-800 rounded animate-pulse flex items-center justify-center">
          <div className="text-slate-500">Loading chart data...</div>
        </div>
      </motion.div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Price Chart</h2>
        </div>
        
        <div className="h-96 bg-slate-800 rounded flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No price data available</p>
            <p className="text-sm mt-2">Chart will appear when data is loaded</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">
            {ticker ? `${ticker} ` : ''}Price Chart (1 Month)
          </h2>
        </div>
        
        {/* Price change indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          priceChange.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          <TrendingUp className={`w-4 h-4 ${priceChange.isPositive ? '' : 'rotate-180'}`} />
          <span className="font-medium">
            {priceChange.isPositive ? '+' : ''}${priceChange.amount.toFixed(2)} 
            ({priceChange.isPositive ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Main price line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#065F46' }}
            />

            {/* News event overlays */}
            {processedNewsEvents.map((event, index) => (
              <ReferenceDot
                key={index}
                x={event.x}
                y={event.y}
                r={4}
                fill={
                  event.sentiment === 'positive' || event.sentiment === 'bullish' ? '#10B981' :
                  event.sentiment === 'negative' || event.sentiment === 'bearish' ? '#F43F5E' :
                  '#94A3B8'
                }
                stroke="#1E293B"
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-6 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-emerald-500"></div>
            <span>Price Movement</span>
          </div>
          {processedNewsEvents.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span>News Events ({processedNewsEvents.length})</span>
            </div>
          )}
        </div>
        
        <div className="text-xs text-slate-500">
          Interactive chart • Hover for details
        </div>
      </div>
    </motion.div>
  );
};

export default PriceChart;