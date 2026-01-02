# Universal Market Sentiment Analysis

A comprehensive web application that analyzes market sentiment for any financial instrument using AI-powered news analysis. The system supports stocks, cryptocurrencies, commodities, real estate, exchanges, and more, providing actionable market insights through an intuitive interface.

## Features

- **Universal Search**: Analyze sentiment for stocks, crypto, commodities, real estate, exchanges
- **Smart Categorization**: Automatically categorizes financial instruments
- **Real-time Analysis**: Live sentiment analysis of current market news
- **AI-Powered**: Uses VADER and FinBERT models for accurate sentiment detection
- **Interactive Dashboard**: Modern React frontend with responsive design
- **Market Signals**: Clear bullish/bearish/neutral trading recommendations
- **Popular Searches**: Quick access to trending financial instruments
- **Category Filtering**: Filter by asset type (stocks, crypto, commodities, etc.)

## Supported Financial Instruments

### 📈 Stocks
- Individual stocks (Apple, Tesla, Microsoft, etc.)
- Stock indices (S&P 500, NASDAQ, Dow Jones)
- Sector ETFs and mutual funds

### ₿ Cryptocurrencies
- Major cryptocurrencies (Bitcoin, Ethereum, etc.)
- Altcoins and DeFi tokens
- Crypto exchanges and platforms

### 🥇 Commodities
- Precious metals (Gold, Silver, Platinum)
- Energy (Oil, Natural Gas, Coal)
- Agricultural products (Wheat, Corn, Coffee)

### 🏠 Real Estate
- Housing market trends
- REITs (Real Estate Investment Trusts)
- Commercial and residential property
- Mortgage and lending markets

### 🏛️ Exchanges
- Stock exchanges (NYSE, NASDAQ, LSE)
- Crypto exchanges (Binance, Coinbase)
- Commodity exchanges (CME, NYMEX)

## Architecture

- **Backend**: Python Flask with WebSocket support
- **Frontend**: React.js with Tailwind CSS
- **AI Models**: VADER (headlines) + FinBERT (content analysis)
- **Real-time**: Socket.IO for live updates
- **Caching**: Redis for performance optimization

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Redis (optional, for caching)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### Development

1. Start the backend server first
2. Start the frontend development server
3. Open `http://localhost:3000` in your browser
4. Click "Start Analysis" to begin sentiment analysis

## Project Structure

```
├── backend/
│   ├── app.py              # Flask application entry point
│   ├── config.py           # Configuration settings
│   ├── requirements.txt    # Python dependencies
│   ├── models/            # Data models
│   ├── services/          # Business logic
│   └── api/               # API routes
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   ├── package.json       # Node dependencies
│   └── tailwind.config.js # Styling configuration
└── README.md
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/analysis/start` - Start new analysis
- `GET /api/analysis/latest` - Get cached results

## WebSocket Events

- `connect` - Client connection
- `start_analysis` - Trigger analysis
- `analysis_progress` - Progress updates
- `analysis_complete` - Results ready
- `analysis_error` - Error occurred

## Configuration

Environment variables can be set to customize behavior:

- `FLASK_DEBUG` - Enable debug mode
- `REDIS_URL` - Redis connection string
- `ARTICLES_PER_QUERY` - Number of articles per search query
- `MAX_WORKERS` - Concurrent processing limit
- `ANALYSIS_TIMEOUT` - Maximum analysis time (seconds)

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests  
cd frontend
npm test
```

## Deployment

The application can be deployed using Docker, Heroku, or any cloud platform supporting Python and Node.js applications.

## License

MIT License - see LICENSE file for details.