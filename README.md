# 🚀 Market Mind Analyzer

A comprehensive financial analysis platform with AI-powered portfolio scanning, Salesforce integration, and real-time market insights.

## ✨ Features

### 🔗 **Salesforce Integration**
- Complete Salesforce API integration with OAuth2 support
- Real-time data synchronization
- Configurable connection settings
- Status monitoring and health checks

### 📊 **Smart Portfolio Scan**
- AI-powered portfolio analysis using Google Gemini Vision
- Upload portfolio screenshots for instant analysis
- Investment recommendations and insights
- Holdings extraction and validation

### 📱 **Modern Dashboard**
- Interactive React-based interface
- TradingView widgets integration
- Real-time market data and charts
- Responsive design for all devices

### 🔐 **User Management**
- Secure login and signup system
- User session management
- Protected routes and authentication

### 📈 **Market Analysis**
- Real-time market data
- Economic calendar integration
- Ticker tape with live prices
- Sentiment analysis tools

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini Vision** - AI-powered image analysis
- **Salesforce API** - CRM integration
- **Python 3.12** - Modern Python features

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first styling
- **TradingView Widgets** - Professional market charts
- **Axios** - HTTP client for API calls

### Database & Storage
- **Local Storage** - Client-side data persistence
- **Salesforce** - Cloud-based CRM storage

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn
- Google Gemini API key
- Salesforce credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NeerajKumarRay1/Market-Mind-Analyzer.git
cd Market-Mind-Analyzer
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit the .env file with your credentials
# Required:
GOOGLE_API_KEY=your-google-gemini-api-key

# Optional (for Salesforce integration):
SALESFORCE_USERNAME=your-username@domain.com
SALESFORCE_PASSWORD=your-password
SALESFORCE_TOKEN=your-security-token
SALESFORCE_DOMAIN=login
```

### Running the Application

**Option 1: Use the development runner (Recommended)**
```bash
python run_dev.py
```

**Option 2: Run services separately**

Backend:
```bash
cd backend
python -m uvicorn fastapi_app:app --reload --host 0.0.0.0 --port 5000
```

Frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/docs

## 📋 API Endpoints

### Health & Status
- `GET /api/health` - System health check
- `GET /api/test-connection` - Test frontend-backend connection
- `GET /api/salesforce/status` - Salesforce connection status

### Portfolio Analysis
- `POST /api/portfolio/analyze-image` - Upload and analyze portfolio screenshots

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini Vision API key | Yes |
| `SALESFORCE_USERNAME` | Salesforce username | No |
| `SALESFORCE_PASSWORD` | Salesforce password | No |
| `SALESFORCE_TOKEN` | Salesforce security token | No |
| `SALESFORCE_DOMAIN` | Salesforce domain (usually 'login') | No |

### Salesforce Setup

To enable Salesforce integration:

1. **Enable API Access**
   - Go to Setup → API → API Access
   - Enable "Allow API Access"

2. **Get Security Token**
   - Go to Personal Settings → Reset My Security Token
   - Check your email for the token

3. **Update Environment Variables**
   - Add your credentials to the `.env` file

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_salesforce.py  # Test Salesforce connection
python -m pytest           # Run all tests
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
Market-Mind-Analyzer/
├── backend/
│   ├── models/           # Data models
│   ├── .env.example      # Environment template
│   ├── config.py         # Configuration management
│   ├── fastapi_app.py    # Main FastAPI application
│   ├── salesforce_service.py  # Salesforce integration
│   ├── vision_engine.py  # Google Gemini Vision
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main React app
│   │   └── index.js      # Entry point
│   ├── package.json      # Node.js dependencies
│   └── tailwind.config.js # Tailwind configuration
├── .kiro/specs/          # Feature specifications
├── run_dev.py            # Development runner
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/NeerajKumarRay1/Market-Mind-Analyzer/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- Google Gemini Vision for AI-powered analysis
- TradingView for market data widgets
- Salesforce for CRM integration
- FastAPI and React communities

---

**Made with ❤️ by [NeerajKumarRay1](https://github.com/NeerajKumarRay1)**