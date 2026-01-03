import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const NewsFeed = ({ articles = [], loading = false, ticker }) => {
  const [expandedArticle, setExpandedArticle] = useState(null);

  // Get sentiment styling
  const getSentimentStyling = (sentiment) => {
    if (!sentiment) return { color: 'text-slate-400', icon: Minus, bg: 'bg-slate-500/10' };

    const sentimentLower = sentiment.toLowerCase();
    
    if (sentimentLower.includes('positive') || sentimentLower.includes('bullish')) {
      return { 
        color: 'text-emerald-400', 
        icon: TrendingUp, 
        bg: 'bg-emerald-500/10',
        badge: 'bg-emerald-500/20 text-emerald-300'
      };
    } else if (sentimentLower.includes('negative') || sentimentLower.includes('bearish')) {
      return { 
        color: 'text-rose-400', 
        icon: TrendingDown, 
        bg: 'bg-rose-500/10',
        badge: 'bg-rose-500/20 text-rose-300'
      };
    } else {
      return { 
        color: 'text-slate-400', 
        icon: Minus, 
        bg: 'bg-slate-500/10',
        badge: 'bg-slate-500/20 text-slate-300'
      };
    }
  };

  // Format confidence score
  const formatConfidence = (confidence) => {
    if (!confidence) return 'N/A';
    return `${(confidence * 100).toFixed(0)}%`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-slate-700 rounded animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
              <div className="flex space-x-2">
                <div className="h-6 w-16 bg-slate-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-12 bg-slate-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-400 mb-2">No news available</h3>
      <p className="text-sm text-slate-500">
        {ticker ? `No recent news found for ${ticker}` : 'News will appear here when available'}
      </p>
    </div>
  );

  // Article item component
  const ArticleItem = ({ article, index }) => {
    const isExpanded = expandedArticle === index;
    const sentimentStyling = getSentimentStyling(
      article.content_sentiment?.label || article.headline_sentiment?.label
    );
    const SentimentIcon = sentimentStyling.icon;
    
    const confidence = article.content_sentiment?.confidence || 
                      (article.headline_sentiment?.score ? Math.abs(article.headline_sentiment.score) : null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`${sentimentStyling.bg} border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all cursor-pointer`}
        onClick={() => setExpandedArticle(isExpanded ? null : index)}
      >
        <div className="flex items-start space-x-3">
          {/* Sentiment indicator */}
          <div className={`${sentimentStyling.badge} p-2 rounded-full flex-shrink-0`}>
            <SentimentIcon className="w-4 h-4" />
          </div>

          {/* Article content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-white font-medium leading-tight mb-2 line-clamp-2">
              {article.title || 'Untitled Article'}
            </h3>

            {/* Metadata */}
            <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(article.published)}</span>
              </div>
              {confidence && (
                <div className="flex items-center space-x-1">
                  <span>Confidence: {formatConfidence(confidence)}</span>
                </div>
              )}
            </div>

            {/* Sentiment badges */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`${sentimentStyling.badge} px-2 py-1 rounded-full text-xs font-medium`}>
                {article.content_sentiment?.label || article.headline_sentiment?.label || 'Neutral'}
              </span>
              {article.source_type && (
                <span className="bg-slate-600/50 text-slate-300 px-2 py-1 rounded-full text-xs">
                  {article.source_type}
                </span>
              )}
            </div>

            {/* Expandable content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-600 pt-3 mt-3"
                >
                  {/* Article preview */}
                  {article.content && (
                    <p className="text-slate-300 text-sm mb-3 line-clamp-3">
                      {article.content.substring(0, 200)}...
                    </p>
                  )}

                  {/* Detailed sentiment info */}
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    {article.headline_sentiment && (
                      <div className="bg-slate-700/50 p-2 rounded">
                        <div className="text-slate-400 mb-1">Headline Sentiment</div>
                        <div className="text-white font-medium">
                          {article.headline_sentiment.label || 'N/A'}
                        </div>
                        <div className="text-slate-400">
                          Score: {article.headline_sentiment.score?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                    )}
                    {article.content_sentiment && (
                      <div className="bg-slate-700/50 p-2 rounded">
                        <div className="text-slate-400 mb-1">Content Sentiment</div>
                        <div className="text-white font-medium">
                          {article.content_sentiment.label || 'N/A'}
                        </div>
                        <div className="text-slate-400">
                          Confidence: {formatConfidence(article.content_sentiment.confidence)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* External link */}
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Read full article</span>
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand/collapse indicator */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-slate-500">
                Click to {isExpanded ? 'collapse' : 'expand'}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Newspaper className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">
            News Feed
            {ticker && <span className="text-slate-400 ml-2">• {ticker}</span>}
          </h2>
        </div>
        {articles.length > 0 && (
          <div className="text-sm text-slate-400">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {loading ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <ArticleItem key={index} article={article} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {articles.length > 0 && !loading && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            Sentiment analysis powered by AI • Real-time updates
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;