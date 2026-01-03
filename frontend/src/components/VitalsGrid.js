import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, AlertTriangle } from 'lucide-react';

const VitalsGrid = ({ financialData, aiVerdict, loading = false }) => {
  // Format large numbers (market cap, etc.)
  const formatLargeNumber = (num) => {
    if (!num || num === 0) return 'N/A';
    
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  // Format currency
  const formatCurrency = (price) => {
    if (!price || price === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Get P/E ratio context
  const getPERatioContext = (peRatio) => {
    if (!peRatio || peRatio <= 0) return { label: 'N/A', color: 'text-slate-400', icon: null };
    
    if (peRatio < 15) {
      return { label: 'Low (Value)', color: 'text-emerald-400', icon: TrendingDown };
    } else if (peRatio < 25) {
      return { label: 'Moderate', color: 'text-blue-400', icon: Target };
    } else if (peRatio < 35) {
      return { label: 'High', color: 'text-yellow-400', icon: TrendingUp };
    } else {
      return { label: 'Very High', color: 'text-rose-400', icon: AlertTriangle };
    }
  };

  // Get AI verdict styling
  const getVerdictStyling = (verdict) => {
    const verdictLower = (verdict || '').toLowerCase();
    
    if (verdictLower.includes('strong buy')) {
      return { color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', icon: Award };
    } else if (verdictLower.includes('buy')) {
      return { color: 'text-emerald-300', bgColor: 'bg-emerald-500/10', icon: TrendingUp };
    } else if (verdictLower.includes('hold')) {
      return { color: 'text-blue-400', bgColor: 'bg-blue-500/10', icon: Target };
    } else if (verdictLower.includes('sell')) {
      return { color: 'text-rose-400', bgColor: 'bg-rose-500/10', icon: TrendingDown };
    } else {
      return { color: 'text-slate-400', bgColor: 'bg-slate-500/10', icon: Target };
    }
  };

  const peContext = getPERatioContext(financialData?.pe_ratio);
  const verdictStyling = getVerdictStyling(aiVerdict);
  const PEIcon = peContext.icon;
  const VerdictIcon = verdictStyling.icon;

  // Vital card component
  const VitalCard = ({ title, value, subtitle, icon: Icon, delay = 0, loading = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-5 h-5 text-slate-400" />}
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm text-slate-400">
              {subtitle}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <VitalCard title="P/E Ratio" loading={true} icon={TrendingUp} delay={0} />
        <VitalCard title="Market Cap" loading={true} icon={DollarSign} delay={0.1} />
        <VitalCard title="52-Week High" loading={true} icon={TrendingUp} delay={0.2} />
        <VitalCard title="AI Verdict" loading={true} icon={Award} delay={0.3} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* P/E Ratio */}
      <VitalCard
        title="P/E Ratio"
        value={financialData?.pe_ratio ? financialData.pe_ratio.toFixed(2) : 'N/A'}
        subtitle={
          <div className={`flex items-center space-x-2 ${peContext.color}`}>
            {PEIcon && <PEIcon className="w-4 h-4" />}
            <span>{peContext.label}</span>
          </div>
        }
        icon={TrendingUp}
        delay={0}
      />

      {/* Market Cap */}
      <VitalCard
        title="Market Cap"
        value={formatLargeNumber(financialData?.market_cap)}
        subtitle={
          financialData?.market_cap ? (
            <div className="text-slate-400">
              {financialData.market_cap >= 200e9 ? 'Large Cap' :
               financialData.market_cap >= 10e9 ? 'Mid Cap' :
               financialData.market_cap >= 2e9 ? 'Small Cap' : 'Micro Cap'}
            </div>
          ) : null
        }
        icon={DollarSign}
        delay={0.1}
      />

      {/* 52-Week High */}
      <VitalCard
        title="52-Week High"
        value={formatCurrency(financialData?.fifty_two_week_high)}
        subtitle={
          financialData?.fifty_two_week_high && financialData?.current_price ? (
            <div className="text-slate-400">
              {((financialData.current_price / financialData.fifty_two_week_high) * 100).toFixed(1)}% of high
            </div>
          ) : null
        }
        icon={TrendingUp}
        delay={0.2}
      />

      {/* AI Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`${verdictStyling.bgColor} border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {VerdictIcon && <VerdictIcon className="w-5 h-5 text-slate-400" />}
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              AI Verdict
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className={`text-2xl font-bold ${verdictStyling.color}`}>
            {aiVerdict || 'Analyzing...'}
          </div>
          <div className="text-sm text-slate-400">
            Based on financial & sentiment analysis
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VitalsGrid;