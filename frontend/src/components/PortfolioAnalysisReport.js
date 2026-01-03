import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  TrendingUp,
  TrendingDown,
  Shield,
  Activity
} from 'lucide-react';

const PortfolioAnalysisReport = ({ analysisResult }) => {
  if (!analysisResult) return null;

  const getRiskColor = (riskProfile) => {
    if (riskProfile.toLowerCase().includes('aggressive')) return 'text-red-400';
    if (riskProfile.toLowerCase().includes('moderate')) return 'text-yellow-400';
    if (riskProfile.toLowerCase().includes('conservative')) return 'text-green-400';
    return 'text-gray-400';
  };

  const getRiskIcon = (riskProfile) => {
    if (riskProfile.toLowerCase().includes('aggressive')) return TrendingUp;
    if (riskProfile.toLowerCase().includes('moderate')) return Activity;
    if (riskProfile.toLowerCase().includes('conservative')) return Shield;
    return AlertTriangle;
  };

  const getHealthScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getHealthScoreGradient = (score) => {
    if (score >= 8) return 'from-green-500 to-green-400';
    if (score >= 6) return 'from-yellow-500 to-yellow-400';
    if (score >= 4) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  const getHealthScoreWidth = (score) => {
    return `${(score / 10) * 100}%`;
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'bg-green-500 text-white';
      case 2: return 'bg-yellow-500 text-black';
      case 3: return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'High Priority';
      case 2: return 'Medium Priority';
      case 3: return 'Low Priority';
      default: return 'Priority';
    }
  };

  const RiskIcon = getRiskIcon(analysisResult.analysis.risk_profile);

  return (
    <div className="space-y-6">
      {/* Portfolio Analysis Overview */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
            <BarChart3 className="w-6 h-6 text-[#00D4FF]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Portfolio Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Score Section */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full border-8 border-gray-700 flex items-center justify-center relative overflow-hidden">
                  {/* Background circle */}
                  <div className="absolute inset-0 rounded-full"></div>
                  
                  {/* Progress circle */}
                  <div 
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${getHealthScoreGradient(analysisResult.analysis.health_score)} opacity-20`}
                    style={{
                      background: `conic-gradient(from 0deg, ${
                        analysisResult.analysis.health_score >= 8 ? '#10b981' :
                        analysisResult.analysis.health_score >= 6 ? '#f59e0b' :
                        analysisResult.analysis.health_score >= 4 ? '#f97316' : '#ef4444'
                      } ${(analysisResult.analysis.health_score / 10) * 360}deg, transparent 0deg)`
                    }}
                  />
                  
                  {/* Score display */}
                  <div className="relative z-10 text-center">
                    <div className={`text-3xl font-bold ${getHealthScoreColor(analysisResult.analysis.health_score)}`}>
                      {analysisResult.analysis.health_score}
                    </div>
                    <div className="text-gray-400 text-sm">out of 10</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">Diversification Score</h3>
                <p className={`text-sm font-medium ${getHealthScoreColor(analysisResult.analysis.health_score)}`}>
                  {getHealthScoreLabel(analysisResult.analysis.health_score)}
                </p>
              </div>
            </div>

            {/* Progress Bar Alternative */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-medium">Portfolio Health</span>
                <span className={`text-lg font-bold ${getHealthScoreColor(analysisResult.analysis.health_score)}`}>
                  {analysisResult.analysis.health_score}/10
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${getHealthScoreGradient(analysisResult.analysis.health_score)}`}
                  style={{ width: getHealthScoreWidth(analysisResult.analysis.health_score) }}
                />
              </div>
            </div>
          </div>

          {/* Risk Profile Section */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50 border-2 border-gray-600 mb-4">
                <RiskIcon className={`w-12 h-12 ${getRiskColor(analysisResult.analysis.risk_profile)}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Risk Profile</h3>
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className={`font-bold text-lg ${getRiskColor(analysisResult.analysis.risk_profile)}`}>
                  {analysisResult.analysis.risk_profile}
                </span>
              </div>
            </div>

            {/* Risk Explanation */}
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <p className="text-gray-300 text-sm text-center">
                {analysisResult.analysis.risk_profile.toLowerCase().includes('aggressive') && 
                  "High growth potential with higher volatility. Suitable for long-term investors with risk tolerance."
                }
                {analysisResult.analysis.risk_profile.toLowerCase().includes('moderate') && 
                  "Balanced approach with moderate risk and return potential. Good for most investors."
                }
                {analysisResult.analysis.risk_profile.toLowerCase().includes('conservative') && 
                  "Lower risk with steady returns. Ideal for risk-averse investors seeking stability."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Strengths */}
          <div className="p-6 bg-green-900/10 border border-green-500/20 rounded-xl">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Portfolio Strengths
            </h3>
            <ul className="space-y-3">
              {analysisResult.analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-xl">
            <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {analysisResult.analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-300 flex items-start">
                  <span className="text-red-400 mr-3 mt-1">!</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Investment Recommendations */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
            <Target className="w-6 h-6 text-[#00D4FF]" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Investment Recommendations</h2>
        </div>

        <div className="space-y-4">
          {analysisResult.recommendations.map((rec, index) => (
            <div key={index} className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{rec.ticker}</h3>
                    <p className="text-sm text-gray-400">{getPriorityLabel(rec.priority)}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                  {rec.improvement_type.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-300 leading-relaxed">{rec.reason}</p>
              
              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <button className="text-[#00D4FF] hover:text-[#00D4FF]/80 text-sm font-medium transition-colors">
                  Research {rec.ticker} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Summary */}
        <div className="mt-6 p-4 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-[#00D4FF]" />
            <span className="text-white font-medium">Recommendation Summary</span>
          </div>
          <p className="text-gray-300 text-sm">
            These recommendations are designed to improve your portfolio's diversification and risk profile. 
            Consider your investment goals and risk tolerance before making any changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalysisReport;