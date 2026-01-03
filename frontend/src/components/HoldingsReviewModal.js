import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';

const HoldingsReviewModal = ({ 
  isOpen, 
  onClose, 
  extractedHoldings, 
  onConfirm,
  onCancel 
}) => {
  const [holdings, setHoldings] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [showConfidenceScores, setShowConfidenceScores] = useState(false);

  // Initialize holdings when modal opens
  useEffect(() => {
    if (isOpen && extractedHoldings) {
      setHoldings([...extractedHoldings]);
      setErrors({});
      setEditingIndex(null);
    }
  }, [isOpen, extractedHoldings]);

  // Validate ticker symbol
  const validateTicker = (ticker) => {
    if (!ticker || ticker.trim().length === 0) {
      return 'Ticker is required';
    }
    
    const cleanTicker = ticker.trim().toUpperCase();
    
    // Basic ticker validation
    if (!/^[A-Z0-9.-]{1,10}$/.test(cleanTicker)) {
      return 'Invalid ticker format (1-10 characters, letters/numbers only)';
    }
    
    return null;
  };

  // Validate quantity
  const validateQuantity = (quantity) => {
    const num = parseFloat(quantity);
    if (isNaN(num) || num <= 0) {
      return 'Quantity must be a positive number';
    }
    return null;
  };

  // Handle ticker edit
  const handleTickerEdit = (index, newTicker) => {
    const updatedHoldings = [...holdings];
    updatedHoldings[index] = {
      ...updatedHoldings[index],
      ticker: newTicker.toUpperCase()
    };
    setHoldings(updatedHoldings);

    // Validate ticker
    const error = validateTicker(newTicker);
    setErrors(prev => ({
      ...prev,
      [`ticker_${index}`]: error
    }));
  };

  // Handle quantity edit
  const handleQuantityEdit = (index, newQuantity) => {
    const updatedHoldings = [...holdings];
    updatedHoldings[index] = {
      ...updatedHoldings[index],
      quantity: newQuantity
    };
    setHoldings(updatedHoldings);

    // Validate quantity
    const error = validateQuantity(newQuantity);
    setErrors(prev => ({
      ...prev,
      [`quantity_${index}`]: error
    }));
  };

  // Add new holding
  const addHolding = () => {
    const newHolding = {
      ticker: '',
      quantity: 0,
      confidence: 1.0 // Manual entries have full confidence
    };
    setHoldings([...holdings, newHolding]);
    setEditingIndex(holdings.length); // Start editing the new holding
  };

  // Remove holding
  const removeHolding = (index) => {
    const updatedHoldings = holdings.filter((_, i) => i !== index);
    setHoldings(updatedHoldings);
    
    // Clear errors for this holding
    const newErrors = { ...errors };
    delete newErrors[`ticker_${index}`];
    delete newErrors[`quantity_${index}`];
    setErrors(newErrors);
    
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  // Start editing
  const startEditing = (index) => {
    setEditingIndex(index);
  };

  // Stop editing
  const stopEditing = () => {
    setEditingIndex(null);
  };

  // Check if form is valid
  const isFormValid = () => {
    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== null);
    if (hasErrors) return false;

    // Check if all holdings have valid data
    return holdings.every(holding => 
      holding.ticker && 
      holding.ticker.trim().length > 0 && 
      holding.quantity > 0
    );
  };

  // Handle confirm
  const handleConfirm = () => {
    if (!isFormValid()) {
      // Validate all holdings and show errors
      const newErrors = {};
      holdings.forEach((holding, index) => {
        const tickerError = validateTicker(holding.ticker);
        const quantityError = validateQuantity(holding.quantity);
        
        if (tickerError) newErrors[`ticker_${index}`] = tickerError;
        if (quantityError) newErrors[`quantity_${index}`] = quantityError;
      });
      
      setErrors(newErrors);
      return;
    }

    onConfirm(holdings);
  };

  // Handle cancel
  const handleCancel = () => {
    onCancel();
  };

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Review Extracted Holdings</h2>
            <p className="text-gray-400 mt-1">
              Verify and edit your portfolio holdings before analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowConfidenceScores(!showConfidenceScores)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {showConfidenceScores ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm text-gray-300">
                  {showConfidenceScores ? 'Hide' : 'Show'} Confidence Scores
                </span>
              </button>
            </div>
            
            <button
              onClick={addHolding}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00D4FF] text-black font-medium rounded-lg hover:bg-[#00D4FF]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Holding</span>
            </button>
          </div>

          {/* Holdings Table */}
          <div className="bg-gray-800/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-300 font-medium">Ticker</th>
                  <th className="text-right py-4 px-4 text-gray-300 font-medium">Quantity</th>
                  {showConfidenceScores && (
                    <th className="text-right py-4 px-4 text-gray-300 font-medium">Confidence</th>
                  )}
                  <th className="text-center py-4 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    {/* Ticker */}
                    <td className="py-4 px-4">
                      {editingIndex === index ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={holding.ticker}
                            onChange={(e) => handleTickerEdit(index, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                            placeholder="Enter ticker"
                            autoFocus
                          />
                          {errors[`ticker_${index}`] && (
                            <p className="text-red-400 text-xs flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors[`ticker_${index}`]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium text-lg">{holding.ticker}</span>
                          {errors[`ticker_${index}`] && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4 text-right">
                      {editingIndex === index ? (
                        <div className="space-y-1">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={holding.quantity}
                            onChange={(e) => handleQuantityEdit(index, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none text-right"
                            placeholder="0.00"
                          />
                          {errors[`quantity_${index}`] && (
                            <p className="text-red-400 text-xs flex items-center justify-end">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {errors[`quantity_${index}`]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-gray-300">{holding.quantity}</span>
                          {errors[`quantity_${index}`] && (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </td>

                    {/* Confidence */}
                    {showConfidenceScores && (
                      <td className="py-4 px-4 text-right">
                        <span className={`font-medium ${getConfidenceColor(holding.confidence)}`}>
                          {(holding.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    )}

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        {editingIndex === index ? (
                          <button
                            onClick={stopEditing}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => startEditing(index)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4 text-gray-300" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => removeHolding(index)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {holdings.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-400">No holdings found. Add some holdings to continue.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {holdings.length > 0 && (
            <div className="mt-6 p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Summary</span>
              </div>
              <p className="text-gray-300">
                Found <span className="font-bold text-[#00D4FF]">{holdings.length}</span> holdings ready for analysis
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            {!isFormValid() && (
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Please fix errors before continuing</span>
              </div>
            )}
            
            <button
              onClick={handleConfirm}
              disabled={!isFormValid()}
              className={`px-6 py-3 font-medium rounded-xl transition-colors ${
                isFormValid()
                  ? 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm & Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsReviewModal;