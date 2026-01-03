"""
Financial data models for the Investment Research Terminal.
"""
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional, List, Dict, Any
import json


@dataclass
class PricePoint:
    """Individual price data point."""
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'date': self.date.isoformat(),
            'open': self.open,
            'high': self.high,
            'low': self.low,
            'close': self.close,
            'volume': self.volume
        }


@dataclass
class PriceHistory:
    """Price history for a ticker."""
    ticker: str
    period: str
    prices: List[PricePoint]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'ticker': self.ticker,
            'period': self.period,
            'prices': [price.to_dict() for price in self.prices]
        }


@dataclass
class FundamentalMetrics:
    """Fundamental financial metrics."""
    pe_ratio: Optional[float] = None
    market_cap: Optional[float] = None
    revenue_growth: Optional[float] = None
    profit_margin: Optional[float] = None
    debt_to_equity: Optional[float] = None
    return_on_equity: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class TickerInfo:
    """Complete ticker information."""
    symbol: str
    current_price: float
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    volume: Optional[int] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class DerivedMetrics:
    """Derived metrics for radar chart display."""
    growth_score: float  # Derived from P/E ratio
    safety_score: float  # Derived from market cap
    hype_score: float    # Derived from volume and news count
    sentiment_score: float  # From sentiment analysis
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class DetailedAnalysisReport:
    """Complete analysis report for a single ticker."""
    ticker: str
    timestamp: datetime
    financial_data: TickerInfo
    price_history: PriceHistory
    fundamental_metrics: FundamentalMetrics
    derived_metrics: DerivedMetrics
    ai_verdict: str  # "Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"
    confidence_score: float
    sentiment_analysis: Optional[Dict[str, Any]] = None
    news_articles: Optional[List[Dict[str, Any]]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'ticker': self.ticker,
            'timestamp': self.timestamp.isoformat(),
            'financial_data': self.financial_data.to_dict(),
            'price_history': self.price_history.to_dict(),
            'fundamental_metrics': self.fundamental_metrics.to_dict(),
            'derived_metrics': self.derived_metrics.to_dict(),
            'ai_verdict': self.ai_verdict,
            'confidence_score': self.confidence_score,
            'sentiment_analysis': self.sentiment_analysis,
            'news_articles': self.news_articles or []
        }


@dataclass
class BattleMetrics:
    """Metrics for multi-ticker comparison."""
    sentiment_scores: Dict[str, float]  # ticker -> sentiment score
    growth_scores: Dict[str, float]     # derived from P/E ratios
    safety_scores: Dict[str, float]     # derived from market cap
    hype_scores: Dict[str, float]       # derived from volume/news
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class ComparisonAnalysisReport:
    """Analysis report for multiple tickers comparison."""
    tickers: List[str]
    timestamp: datetime
    individual_analyses: Dict[str, DetailedAnalysisReport]
    battle_metrics: BattleMetrics
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'tickers': self.tickers,
            'timestamp': self.timestamp.isoformat(),
            'individual_analyses': {
                ticker: analysis.to_dict() 
                for ticker, analysis in self.individual_analyses.items()
            },
            'battle_metrics': self.battle_metrics.to_dict()
        }


@dataclass
class MarketMood:
    """Market mood data based on S&P 500 and Bitcoin momentum."""
    score: int  # 0-100 scale
    label: str  # "Fear", "Neutral", "Greed"
    spy_change: float  # S&P 500 5-day percentage change
    btc_change: float  # Bitcoin 5-day percentage change
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class AIPick:
    """AI-selected stock recommendation."""
    ticker: str
    name: str
    sentiment_score: int  # 0-100 percentage
    price: float
    news_count: int
    recommendation: str  # "Strong Buy", "Buy", "Hold"
    confidence: float
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class PortfolioMover:
    """Portfolio asset with price movement data."""
    ticker: str
    price: float
    change: float  # percentage change
    trend: str  # "up" or "down"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class DashboardData:
    """Complete dashboard data response."""
    market_mood: MarketMood
    ai_pick: Optional[AIPick]
    movers: List[PortfolioMover]
    timestamp: datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            'market_mood': self.market_mood.to_dict(),
            'ai_pick': self.ai_pick.to_dict() if self.ai_pick else None,
            'movers': [mover.to_dict() for mover in self.movers],
            'timestamp': self.timestamp.isoformat()
        }