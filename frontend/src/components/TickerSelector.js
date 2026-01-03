import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const TickerSelector = ({ selectedTickers = [], onTickersChange, maxTickers = 3 }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const inputRef = useRef(null);

  // Popular ticker suggestions
  const popularTickers = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corporation' },
    { symbol: 'CRM', name: 'Salesforce Inc.' }
  ];

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = popularTickers.filter(ticker =>
        ticker.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        ticker.name.toLowerCase().includes(inputValue.toLowerCase())
      ).filter(ticker => !selectedTickers.includes(ticker.symbol));
      
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTickers]);

  // Validate ticker format
  const validateTicker = (ticker) => {
    if (!ticker || typeof ticker !== 'string') {
      return { valid: false, error: 'Ticker is required' };
    }
    
    const cleanTicker = ticker.trim().toUpperCase();
    
    if (cleanTicker.length < 1 || cleanTicker.length > 5) {
      return { valid: false, error: 'Ticker must be 1-5 characters' };
    }
    
    if (!/^[A-Z]+$/.test(cleanTicker)) {
      return { valid: false, error: 'Ticker must contain only letters' };
    }
    
    if (selectedTickers.includes(cleanTicker)) {
      return { valid: false, error: 'Ticker already selected' };
    }
    
    return { valid: true, ticker: cleanTicker };
  };

  // Validate ticker with backend
  const validateTickerWithBackend = async (ticker) => {
    try {
      const response = await fetch(`/api/validate/ticker/${ticker}`);
      const data = await response.json();
      
      if (data.valid) {
        return { valid: true, ticker: data.ticker };
      } else {
        return { 
          valid: false, 
          error: 'Invalid ticker symbol',
          suggestions: data.suggestions || []
        };
      }
    } catch (error) {
      console.error('Ticker validation error:', error);
      return { valid: false, error: 'Unable to validate ticker' };
    }
  };

  // Add ticker
  const addTicker = async (ticker) => {
    if (selectedTickers.length >= maxTickers) {
      setValidationErrors({ general: `Maximum ${maxTickers} tickers allowed` });
      return;
    }

    // Clear previous errors
    setValidationErrors({});
    
    // Basic validation
    const basicValidation = validateTicker(ticker);
    if (!basicValidation.valid) {
      setValidationErrors({ [ticker]: basicValidation.error });
      return;
    }

    const cleanTicker = basicValidation.ticker;
    setIsValidating(true);

    try {
      // Backend validation
      const backendValidation = await validateTickerWithBackend(cleanTicker);
      
      if (backendValidation.valid) {
        const newTickers = [...selectedTickers, backendValidation.ticker];
        onTickersChange(newTickers);
        setInputValue('');
        setShowSuggestions(false);
      } else {
        setValidationErrors({ 
          [cleanTicker]: backendValidation.error,
          suggestions: backendValidation.suggestions 
        });
      }
    } catch (error) {
      setValidationErrors({ [cleanTicker]: 'Validation failed' });
    } finally {
      setIsValidating(false);
    }
  };

  // Remove ticker
  const removeTicker = (ticker) => {
    const newTickers = selectedTickers.filter(t => t !== ticker);
    onTickersChange(newTickers);
    setValidationErrors({});
  };

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTicker(inputValue.trim());
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (ticker) => {
    addTicker(ticker.symbol);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (inputValue.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Select Tickers for Comparison</h2>
          <p className="text-sm text-slate-400 mt-1">
            Add up to {maxTickers} stock symbols to compare
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {selectedTickers.length}/{maxTickers} selected
        </div>
      </div>

      {/* Selected Tickers */}
      {selectedTickers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Selected Tickers:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTickers.map((ticker, index) => (
              <motion.div
                key={ticker}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-2 rounded-full flex items-center space-x-2"
              >
                <span className="font-medium">{ticker}</span>
                <button
                  onClick={() => removeTicker(ticker)}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="relative" ref={inputRef}>
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                onFocus={handleInputFocus}
                placeholder="Enter ticker symbol (e.g., AAPL)"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={selectedTickers.length >= maxTickers}
                maxLength={5}
              />
              {isValidating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10"
                >
                  {suggestions.map((ticker, index) => (
                    <button
                      key={ticker.symbol}
                      onClick={() => handleSuggestionClick(ticker)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{ticker.symbol}</div>
                          <div className="text-sm text-slate-400">{ticker.name}</div>
                        </div>
                        <Plus className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || selectedTickers.length >= maxTickers || isValidating}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            {isValidating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            <span>Add</span>
          </button>
        </form>

        {/* Validation Errors */}
        <AnimatePresence>
          {Object.keys(validationErrors).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {validationErrors.general && (
                    <p className="text-rose-300 text-sm">{validationErrors.general}</p>
                  )}
                  {Object.entries(validationErrors).map(([key, error]) => {
                    if (key === 'general' || key === 'suggestions') return null;
                    return (
                      <p key={key} className="text-rose-300 text-sm">
                        <span className="font-medium">{key}:</span> {error}
                      </p>
                    );
                  })}
                  {validationErrors.suggestions && validationErrors.suggestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-rose-300 text-sm mb-2">Did you mean:</p>
                      <div className="flex flex-wrap gap-2">
                        {validationErrors.suggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => addTicker(suggestion)}
                            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2 py-1 rounded text-sm transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Suggestions */}
      {selectedTickers.length === 0 && inputValue.length === 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Popular Tickers:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {popularTickers.slice(0, 10).map((ticker) => (
              <button
                key={ticker.symbol}
                onClick={() => addTicker(ticker.symbol)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white p-3 rounded-lg transition-colors text-left"
              >
                <div className="font-medium text-sm">{ticker.symbol}</div>
                <div className="text-xs text-slate-400 truncate">{ticker.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      {selectedTickers.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-300 text-sm">
              Ready for comparison! You can add {maxTickers - selectedTickers.length} more ticker{maxTickers - selectedTickers.length !== 1 ? 's' : ''}.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TickerSelector;