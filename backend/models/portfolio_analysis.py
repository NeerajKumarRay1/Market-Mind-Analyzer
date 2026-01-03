"""
Pydantic models for Smart Portfolio Scan feature.
Defines data structures for portfolio holdings, analysis, and recommendations.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from enum import Enum

class RiskProfile(str, Enum):
    """Enumeration of portfolio risk profiles"""
    CONSERVATIVE = "Conservative"
    MODERATE = "Moderate"
    AGGRESSIVE = "Aggressive"

class ImprovementType(str, Enum):
    """Types of portfolio improvements"""
    DIVERSIFICATION = "diversification"
    RISK_REDUCTION = "risk_reduction"
    SECTOR_BALANCE = "sector_balance"
    GEOGRAPHIC_EXPOSURE = "geographic_exposure"

class PortfolioHolding(BaseModel):
    """
    Represents a single portfolio holding extracted from image analysis.
    """
    ticker: str = Field(..., description="Stock ticker symbol (e.g., AAPL, TSLA)")
    quantity: float = Field(..., gt=0, description="Number of shares held")
    confidence: Optional[float] = Field(
        default=1.0, 
        ge=0.0, 
        le=1.0, 
        description="AI extraction confidence score (0-1)"
    )
    
    @validator('ticker')
    def validate_ticker(cls, v):
        """Validate ticker symbol format"""
        if not v or not isinstance(v, str):
            raise ValueError('Ticker must be a non-empty string')
        
        # Clean and uppercase ticker
        ticker = v.strip().upper()
        
        # Basic ticker validation (1-5 characters, alphanumeric)
        if not ticker.replace('-', '').replace('.', '').isalnum():
            raise ValueError('Ticker must contain only alphanumeric characters, hyphens, and dots')
        
        if len(ticker) < 1 or len(ticker) > 10:
            raise ValueError('Ticker must be between 1 and 10 characters')
        
        return ticker
    
    @validator('quantity')
    def validate_quantity(cls, v):
        """Validate quantity is positive"""
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v

class InvestmentRecommendation(BaseModel):
    """
    Represents an AI-generated investment recommendation.
    """
    ticker: str = Field(..., description="Recommended stock ticker symbol")
    reason: str = Field(..., min_length=10, description="Explanation for the recommendation")
    improvement_type: ImprovementType = Field(..., description="Type of portfolio improvement")
    priority: int = Field(..., ge=1, le=3, description="Recommendation priority (1=highest, 3=lowest)")
    
    @validator('ticker')
    def validate_ticker(cls, v):
        """Validate ticker symbol format"""
        if not v or not isinstance(v, str):
            raise ValueError('Ticker must be a non-empty string')
        return v.strip().upper()
    
    @validator('reason')
    def validate_reason(cls, v):
        """Validate reason is meaningful"""
        if not v or len(v.strip()) < 10:
            raise ValueError('Reason must be at least 10 characters long')
        return v.strip()

class PortfolioAnalysis(BaseModel):
    """
    Represents the AI analysis of a portfolio's health and characteristics.
    """
    health_score: int = Field(..., ge=1, le=10, description="Portfolio diversification score (1-10)")
    risk_profile: str = Field(..., description="Overall risk classification")
    strengths: List[str] = Field(default_factory=list, description="Portfolio strengths")
    weaknesses: List[str] = Field(default_factory=list, description="Portfolio weaknesses")
    total_value: Optional[float] = Field(default=None, ge=0, description="Total portfolio value if available")
    
    @validator('health_score')
    def validate_health_score(cls, v):
        """Ensure health score is within valid range"""
        if not isinstance(v, int) or v < 1 or v > 10:
            raise ValueError('Health score must be an integer between 1 and 10')
        return v
    
    @validator('risk_profile')
    def validate_risk_profile(cls, v):
        """Validate risk profile format"""
        if not v or not isinstance(v, str):
            raise ValueError('Risk profile must be a non-empty string')
        return v.strip()
    
    @validator('strengths', 'weaknesses')
    def validate_string_lists(cls, v):
        """Validate strength and weakness lists"""
        if not isinstance(v, list):
            return []
        
        # Filter out empty strings and strip whitespace
        return [item.strip() for item in v if item and isinstance(item, str) and item.strip()]

class PortfolioAnalysisResult(BaseModel):
    """
    Complete result of portfolio image analysis including holdings, analysis, and recommendations.
    """
    extracted_holdings: List[PortfolioHolding] = Field(..., description="Holdings extracted from image")
    analysis: PortfolioAnalysis = Field(..., description="Portfolio health analysis")
    recommendations: List[InvestmentRecommendation] = Field(..., description="Investment recommendations")
    processing_time: float = Field(..., ge=0, description="Analysis processing time in seconds")
    timestamp: datetime = Field(default_factory=datetime.now, description="Analysis timestamp")
    
    @validator('extracted_holdings')
    def validate_holdings(cls, v):
        """Validate holdings list"""
        if not isinstance(v, list):
            raise ValueError('Holdings must be a list')
        
        if len(v) == 0:
            raise ValueError('At least one holding must be extracted')
        
        # Check for duplicate tickers
        tickers = [holding.ticker for holding in v]
        if len(tickers) != len(set(tickers)):
            raise ValueError('Duplicate tickers found in holdings')
        
        return v
    
    @validator('recommendations')
    def validate_recommendations(cls, v):
        """Validate recommendations list"""
        if not isinstance(v, list):
            raise ValueError('Recommendations must be a list')
        
        if len(v) != 3:
            raise ValueError('Exactly 3 recommendations must be provided')
        
        # Check priorities are 1, 2, 3
        priorities = sorted([rec.priority for rec in v])
        if priorities != [1, 2, 3]:
            raise ValueError('Recommendations must have priorities 1, 2, and 3')
        
        return v
    
    @validator('processing_time')
    def validate_processing_time(cls, v):
        """Validate processing time is non-negative"""
        if v < 0:
            raise ValueError('Processing time cannot be negative')
        return v

class PortfolioScanRequest(BaseModel):
    """
    Request model for portfolio scanning API endpoint.
    """
    filename: Optional[str] = Field(default=None, description="Original filename")
    file_size: Optional[int] = Field(default=None, ge=0, description="File size in bytes")
    
class PortfolioScanResponse(BaseModel):
    """
    Response model for portfolio scanning API endpoint.
    """
    success: bool = Field(..., description="Whether the scan was successful")
    message: str = Field(..., description="Response message")
    result: Optional[PortfolioAnalysisResult] = Field(default=None, description="Analysis result if successful")
    error_code: Optional[str] = Field(default=None, description="Error code if failed")

# Utility functions for model validation and conversion

def validate_gemini_response(response_data: dict) -> PortfolioAnalysisResult:
    """
    Validate and convert Gemini API response to PortfolioAnalysisResult.
    
    Args:
        response_data: Raw response from Gemini Vision API
        
    Returns:
        Validated PortfolioAnalysisResult instance
        
    Raises:
        ValueError: If response data is invalid
    """
    try:
        # Extract holdings
        holdings_data = response_data.get('extracted_holdings', [])
        holdings = [
            PortfolioHolding(
                ticker=h.get('ticker', ''),
                quantity=float(h.get('qty', 0)),
                confidence=1.0  # Default confidence for Gemini extractions
            )
            for h in holdings_data
        ]
        
        # Extract analysis
        analysis_data = response_data.get('analysis', {})
        analysis = PortfolioAnalysis(
            health_score=int(analysis_data.get('health_score', 5)),
            risk_profile=analysis_data.get('risk_profile', 'Moderate'),
            strengths=analysis_data.get('strengths', []),
            weaknesses=analysis_data.get('weaknesses', [])
        )
        
        # Extract recommendations
        suggestions_data = analysis_data.get('suggestions', [])
        recommendations = []
        for i, suggestion in enumerate(suggestions_data[:3]):  # Limit to 3
            recommendations.append(
                InvestmentRecommendation(
                    ticker=suggestion.get('ticker', ''),
                    reason=suggestion.get('reason', ''),
                    improvement_type=ImprovementType.DIVERSIFICATION,  # Default type
                    priority=i + 1
                )
            )
        
        # Create result
        result = PortfolioAnalysisResult(
            extracted_holdings=holdings,
            analysis=analysis,
            recommendations=recommendations,
            processing_time=0.0,  # Will be set by caller
            timestamp=datetime.now()
        )
        
        return result
        
    except Exception as e:
        raise ValueError(f"Invalid Gemini response format: {str(e)}")

def create_mock_analysis_result() -> PortfolioAnalysisResult:
    """
    Create a mock analysis result for testing purposes.
    
    Returns:
        Mock PortfolioAnalysisResult instance
    """
    holdings = [
        PortfolioHolding(ticker="AAPL", quantity=10.0, confidence=0.95),
        PortfolioHolding(ticker="TSLA", quantity=5.0, confidence=0.90),
        PortfolioHolding(ticker="MSFT", quantity=8.0, confidence=0.98)
    ]
    
    analysis = PortfolioAnalysis(
        health_score=6,
        risk_profile="Aggressive (Tech heavy)",
        strengths=["Strong growth potential", "High-quality companies"],
        weaknesses=["Concentrated in technology sector", "No defensive positions"]
    )
    
    recommendations = [
        InvestmentRecommendation(
            ticker="VTI",
            reason="Adds broad total market coverage to reduce concentration risk.",
            improvement_type=ImprovementType.DIVERSIFICATION,
            priority=1
        ),
        InvestmentRecommendation(
            ticker="JNJ",
            reason="Provides stable healthcare dividend exposure for balance.",
            improvement_type=ImprovementType.SECTOR_BALANCE,
            priority=2
        ),
        InvestmentRecommendation(
            ticker="GLD",
            reason="Hedge against market uncertainty and inflation.",
            improvement_type=ImprovementType.RISK_REDUCTION,
            priority=3
        )
    ]
    
    return PortfolioAnalysisResult(
        extracted_holdings=holdings,
        analysis=analysis,
        recommendations=recommendations,
        processing_time=2.5,
        timestamp=datetime.now()
    )