# Requirements Document

## Introduction

An advanced Investment Research Terminal that transforms the existing MarketMind analyzer into a professional-grade financial analysis platform. The system integrates real-time financial data with AI-powered sentiment analysis to provide comprehensive investment insights through two primary modes: Deep Dive Dashboard for single asset analysis and Battle Mode for multi-asset comparison.

## Glossary

- **Investment_Research_Terminal**: The complete upgraded analyzer system providing professional investment analysis capabilities
- **Deep_Dive_Dashboard**: Single asset analysis view showing comprehensive financial and sentiment data for one ticker
- **Battle_Mode**: Multi-asset comparison tool allowing side-by-side analysis of up to 3 tickers
- **Dashboard_Endpoint**: Unified API endpoint providing market mood, AI stock picks, and portfolio movers for quick market assessment
- **Market_Mood**: Fear & Greed index calculated from S&P 500 and Bitcoin momentum over 5-day period, scored 0-100
- **AI_Stock_Pick**: Algorithmically selected stock recommendation based on sentiment analysis and user risk profile
- **Portfolio_Movers**: Top 3 assets from user portfolio sorted by absolute percentage price change in last 24 hours
- **Risk_Profile**: User investment preference categorized as Aggressive, Moderate, or Conservative
- **Financial_Data_Service**: Backend service integrating yfinance for live stock data and fundamental metrics
- **Sentiment_Badge**: Visual indicator showing bullish/bearish sentiment with pulsing animation
- **Vitals_Grid**: 4-column display showing key financial metrics (P/E, Market Cap, 52-Week High, AI Verdict)
- **Price_Chart**: Interactive line chart displaying 1-month price history with optional news overlay
- **News_Feed**: Scrollable sidebar displaying analyzed headlines with sentiment indicators
- **Sentiment_Battle_Chart**: Diverging bar chart comparing sentiment scores across multiple assets
- **Fundamental_Radar**: Spider chart comparing assets across 4 axes (Growth, Safety, Hype, Sentiment)
- **Ticker_Symbol**: Stock symbol identifier (e.g., AAPL, MSFT, NVDA)

## Requirements

### Requirement 1

**User Story:** As an investor, I want to analyze individual stocks in detail through a Deep Dive Dashboard, so that I can make informed decisions about specific investments.

#### Acceptance Criteria

1. WHEN a user searches for a single ticker THEN the Investment_Research_Terminal SHALL display the Deep_Dive_Dashboard view
2. WHEN displaying the header THEN the Investment_Research_Terminal SHALL show large ticker symbol, current price, and animated Sentiment_Badge
3. WHEN showing the Sentiment_Badge THEN the Investment_Research_Terminal SHALL use green for bullish and red for bearish with pulsing animation
4. WHEN displaying vitals THEN the Investment_Research_Terminal SHALL show Vitals_Grid with P/E ratio, market cap, 52-week high, and AI verdict
5. WHERE P/E ratio is displayed THEN the Investment_Research_Terminal SHALL provide context indicators (High/Low relative to sector)

### Requirement 2

**User Story:** As an investor, I want to see interactive price charts with news correlation, so that I can understand how market events affect stock prices.

#### Acceptance Criteria

1. WHEN displaying price data THEN the Investment_Research_Terminal SHALL show interactive Price_Chart with 1-month history
2. WHEN rendering the Price_Chart THEN the Investment_Research_Terminal SHALL use Recharts library for interactive functionality
3. WHERE news correlation is available THEN the Investment_Research_Terminal SHALL overlay colored dots on price line indicating news events
4. WHEN user hovers over chart points THEN the Investment_Research_Terminal SHALL display detailed price and date information
5. WHEN chart is displayed on mobile THEN the Investment_Research_Terminal SHALL resize appropriately for smaller screens

### Requirement 3

**User Story:** As an investor, I want to see analyzed news headlines alongside financial data, so that I can understand market sentiment context.

#### Acceptance Criteria

1. WHEN displaying Deep_Dive_Dashboard THEN the Investment_Research_Terminal SHALL show News_Feed in right sidebar
2. WHEN rendering News_Feed THEN the Investment_Research_Terminal SHALL display scrollable list of analyzed headlines
3. WHEN showing individual headlines THEN the Investment_Research_Terminal SHALL include sentiment indicators and confidence scores
4. WHEN news analysis is unavailable THEN the Investment_Research_Terminal SHALL display appropriate placeholder message
5. WHEN News_Feed is displayed THEN the Investment_Research_Terminal SHALL maintain readability with proper spacing and typography

### Requirement 4

**User Story:** As an investor, I want to compare multiple stocks side-by-side through Battle Mode, so that I can evaluate investment alternatives effectively.

#### Acceptance Criteria

1. WHEN user selects Battle Mode THEN the Investment_Research_Terminal SHALL display multi-ticker input interface
2. WHEN user adds tickers THEN the Investment_Research_Terminal SHALL accept up to 3 ticker symbols for comparison
3. WHEN displaying comparison THEN the Investment_Research_Terminal SHALL show Sentiment_Battle_Chart and Fundamental_Radar
4. WHEN rendering Sentiment_Battle_Chart THEN the Investment_Research_Terminal SHALL use diverging bars with center at 0
5. WHERE sentiment is bullish THEN the Investment_Research_Terminal SHALL extend bars right in green, bearish left in red

### Requirement 5

**User Story:** As an investor, I want to see fundamental analysis through radar charts, so that I can compare assets across multiple dimensions simultaneously.

#### Acceptance Criteria

1. WHEN displaying Battle Mode THEN the Investment_Research_Terminal SHALL show Fundamental_Radar with 4 axes
2. WHEN rendering radar chart THEN the Investment_Research_Terminal SHALL display Growth, Safety, Hype, and Sentiment axes
3. WHEN calculating Growth metric THEN the Investment_Research_Terminal SHALL derive values from P/E ratios
4. WHEN calculating Safety metric THEN the Investment_Research_Terminal SHALL derive values from market capitalization
5. WHEN calculating Hype metric THEN the Investment_Research_Terminal SHALL derive values from trading volume and news count

### Requirement 6

**User Story:** As a developer, I want the backend to integrate financial data seamlessly with existing sentiment analysis, so that the system provides comprehensive market insights.

#### Acceptance Criteria

1. WHEN processing analysis requests THEN the Financial_Data_Service SHALL use yfinance library for live stock data
2. WHEN fetching ticker data THEN the Financial_Data_Service SHALL retrieve price history, P/E ratio, market cap, and sector information
3. WHEN API receives detailed analysis request THEN the Financial_Data_Service SHALL return combined sentiment and financial data
4. WHEN API receives comparison request THEN the Financial_Data_Service SHALL return side-by-side data for multiple tickers
5. WHEN financial data is unavailable THEN the Financial_Data_Service SHALL provide graceful fallback with available information

### Requirement 7

**User Story:** As a user, I want the interface to follow Bloomberg Terminal aesthetics with modern design, so that I have a professional and intuitive experience.

#### Acceptance Criteria

1. WHEN displaying any interface THEN the Investment_Research_Terminal SHALL use dark mode with minimalist Bloomberg-style design
2. WHEN using colors THEN the Investment_Research_Terminal SHALL use emerald green (#10B981) for bullish/positive indicators
3. WHEN using colors THEN the Investment_Research_Terminal SHALL use rose red (#F43F5E) for bearish/negative indicators
4. WHEN using colors THEN the Investment_Research_Terminal SHALL use slate gray (#94A3B8) for neutral text and backgrounds
5. WHEN displaying on any device THEN the Investment_Research_Terminal SHALL maintain responsive design with proper chart resizing

### Requirement 8

**User Story:** As a user, I want fast and reliable data updates, so that I can make timely investment decisions based on current information.

#### Acceptance Criteria

1. WHEN requesting analysis THEN the Investment_Research_Terminal SHALL complete processing within 10 seconds for single ticker
2. WHEN requesting comparison THEN the Investment_Research_Terminal SHALL complete processing within 15 seconds for multiple tickers
3. WHEN financial data is cached THEN the Investment_Research_Terminal SHALL use cached data for improved performance
4. WHEN real-time updates are needed THEN the Investment_Research_Terminal SHALL refresh financial data appropriately
5. WHEN system is under load THEN the Investment_Research_Terminal SHALL maintain performance through efficient resource management

### Requirement 9

**User Story:** As a user, I want comprehensive error handling and data validation, so that I receive reliable analysis even when some data sources are unavailable.

#### Acceptance Criteria

1. WHEN invalid ticker symbols are entered THEN the Investment_Research_Terminal SHALL display clear error messages with suggestions
2. WHEN yfinance data is unavailable THEN the Investment_Research_Terminal SHALL provide analysis with available data sources
3. WHEN network requests fail THEN the Investment_Research_Terminal SHALL retry with exponential backoff
4. WHEN displaying incomplete data THEN the Investment_Research_Terminal SHALL clearly indicate which metrics are unavailable
5. WHEN system errors occur THEN the Investment_Research_Terminal SHALL log errors appropriately for debugging

### Requirement 10

**User Story:** As an investor, I want a unified dashboard endpoint that provides market mood, AI stock picks, and portfolio movers, so that I can quickly assess market conditions and get actionable investment insights.

#### Acceptance Criteria

1. WHEN requesting dashboard data THEN the Investment_Research_Terminal SHALL calculate Market_Mood using S&P 500 and Bitcoin momentum over 5 days
2. WHEN calculating Market_Mood THEN the Investment_Research_Terminal SHALL return a score from 0 (Fear) to 100 (Greed) with appropriate label
3. WHEN generating AI stock pick THEN the Investment_Research_Terminal SHALL analyze candidate tickers based on user risk profile and return highest sentiment scorer
4. WHEN user has Aggressive risk profile THEN the Investment_Research_Terminal SHALL analyze NVDA, BTC-USD, and TSLA for AI pick
5. WHEN user has Moderate risk profile THEN the Investment_Research_Terminal SHALL analyze AAPL, MSFT, and GOOGL for AI pick
6. WHEN user has Conservative risk profile THEN the Investment_Research_Terminal SHALL analyze VTI, KO, and JNJ for AI pick
7. WHEN calculating portfolio movers THEN the Investment_Research_Terminal SHALL fetch live price changes for user portfolio tickers
8. WHEN displaying portfolio movers THEN the Investment_Research_Terminal SHALL sort by absolute percentage change and return top 3 movers
9. WHEN processing dashboard request THEN the Investment_Research_Terminal SHALL execute all calculations in parallel to complete within 3 seconds
10. WHEN dashboard data is unavailable THEN the Investment_Research_Terminal SHALL provide graceful fallbacks with available information