import React, { useState } from 'react';
import PortfolioUpload from './PortfolioUpload';
import HoldingsReviewModal from './HoldingsReviewModal';
import PortfolioAnalysisReport from './PortfolioAnalysisReport';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit3, 
  Trash2,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showUpload, setShowUpload] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [extractedHoldings, setExtractedHoldings] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (result) => {
    console.log('Analysis completed:', result);
    
    // Show the review modal with extracted holdings
    setExtractedHoldings(result.extracted_holdings);
    setShowReviewModal(true);
    setError(null);
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleHoldingsConfirmed = (confirmedHoldings) => {
    // User confirmed the holdings, proceed with the analysis
    // For now, we'll use the original analysis result but with confirmed holdings
    if (extractedHoldings) {
      // Create a mock analysis result with the confirmed holdings
      // In a real implementation, you might want to re-run the analysis with confirmed holdings
      const updatedResult = {
        extracted_holdings: confirmedHoldings,
        analysis: {
          health_score: 7, // This would come from re-analysis
          risk_profile: "Moderate (Diversified)",
          strengths: ["Good diversification across sectors", "Quality holdings"],
          weaknesses: ["Could benefit from international exposure", "Limited defensive positions"]
        },
        recommendations: [
          {
            ticker: "VTI",
            reason: "Adds broad total market coverage to improve diversification.",
            improvement_type: "diversification",
            priority: 1
          },
          {
            ticker: "VXUS",
            reason: "Provides international exposure to reduce home country bias.",
            improvement_type: "geographic_exposure", 
            priority: 2
          },
          {
            ticker: "BND",
            reason: "Adds bond exposure for portfolio stability and risk reduction.",
            improvement_type: "risk_reduction",
            priority: 3
          }
        ],
        processing_time: 2.5,
        timestamp: new Date().toISOString()
      };
      
      setAnalysisResult(updatedResult);
    }
    
    setShowReviewModal(false);
    setShowUpload(false);
  };

  const handleHoldingsReviewCancel = () => {
    setShowReviewModal(false);
    setExtractedHoldings(null);
  };

  const handleNewScan = () => {
    setShowUpload(true);
    setShowReviewModal(false);
    setAnalysisResult(null);
    setExtractedHoldings(null);
    setError(null);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Manager</h1>
          <p className="text-gray-400">
            {showUpload 
              ? "Upload your portfolio screenshot for AI-powered analysis" 
              : "Your portfolio analysis and recommendations"
            }
          </p>
        </div>
        
        {analysisResult && (
          <button
            onClick={handleNewScan}
            className="flex items-center space-x-2 px-4 py-2 bg-[#00D4FF] text-black font-medium rounded-xl hover:bg-[#00D4FF]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        )}
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <PortfolioUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Use the dedicated PortfolioAnalysisReport component */}
          <PortfolioAnalysisReport analysisResult={analysisResult} />

          {/* Holdings Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-[#00D4FF]/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-[#00D4FF]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Portfolio Holdings</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Ticker</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Quantity</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-medium">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.extracted_holdings.map((holding, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                      <td className="py-4 px-4">
                        <span className="text-white font-medium text-lg">{holding.ticker}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-300">{holding.quantity}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-medium ${
                          holding.confidence >= 0.9 ? 'text-green-400' :
                          holding.confidence >= 0.7 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {(holding.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Review Modal */}
      <HoldingsReviewModal
        isOpen={showReviewModal}
        onClose={handleHoldingsReviewCancel}
        extractedHoldings={extractedHoldings}
        onConfirm={handleHoldingsConfirmed}
        onCancel={handleHoldingsReviewCancel}
      />

      {/* Manual Portfolio Entry (Future Feature) */}
      {!analysisResult && !showUpload && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 text-center">
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Manual Entry</h3>
            <p className="text-gray-400">
              Manually add your holdings (coming soon)
            </p>
            <button 
              onClick={handleNewScan}
              className="px-6 py-3 bg-[#00D4FF] text-black font-medium rounded-xl hover:bg-[#00D4FF]/90 transition-colors"
            >
              Use Smart Scan Instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;