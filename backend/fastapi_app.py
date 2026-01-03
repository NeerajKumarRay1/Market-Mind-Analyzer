"""
FastAPI application for Investment Research Terminal
Enhanced endpoints for financial data integration and portfolio scanning
"""
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
import logging
import time
from datetime import datetime

# Import portfolio scanning components
from models.portfolio_analysis import (
    PortfolioAnalysisResult, 
    PortfolioScanRequest, 
    PortfolioScanResponse,
    validate_gemini_response,
    create_mock_analysis_result
)
from vision_engine import VisionEngine, VisionEngineError, ConfigurationError, APIError
from salesforce_service import get_salesforce_service
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Investment Research Terminal API",
    description="Enhanced financial analysis with portfolio scanning",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize configuration
config = Config()

# Initialize vision engine for portfolio scanning
try:
    vision_engine = VisionEngine()
    logger.info("Vision engine initialized successfully")
except Exception as e:
    logger.warning(f"Vision engine initialization failed: {e}")
    vision_engine = None

# Initialize Salesforce connection
try:
    salesforce_service = get_salesforce_service()
    logger.info("Salesforce service initialized successfully")
except Exception as e:
    logger.warning(f"Salesforce service initialization failed: {e}")
    salesforce_service = None


# Request/Response models for basic functionality
class BasicRequest(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    error: str
    timestamp: str
    suggestions: Optional[List[str]] = None


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """System health check endpoint"""
    try:
        return {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'service': 'investment-research-terminal-api',
            'version': '1.0.0',
            'portfolio_scanning_available': vision_engine is not None,
            'salesforce_connected': salesforce_service.is_connected() if salesforce_service else False
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")


@app.get("/api/salesforce/status")
async def salesforce_status():
    """Check Salesforce connection status"""
    if not salesforce_service:
        return {
            "connected": False,
            "error": "Salesforce service not initialized"
        }
    
    status = salesforce_service.test_connection()
    return {
        **status,
        "message": "Salesforce integration is configured and ready",
        "note": "SOAP API may need to be enabled in Salesforce org for full functionality"
    }


@app.get("/api/test-connection")
async def test_connection():
    """Simple test endpoint to verify frontend-backend connection"""
    return {
        "status": "connected",
        "message": "Frontend can reach backend successfully",
        "timestamp": datetime.utcnow().isoformat()
    }


# Portfolio scanning endpoints
@app.post("/api/portfolio/analyze-image")
async def analyze_portfolio_image(file: UploadFile = File(...)):
    """
    Analyze a portfolio screenshot using Google Gemini Vision.
    Extracts holdings and provides investment recommendations.
    """
    start_time = time.time()
    
    try:
        logger.info(f"Portfolio image analysis requested: {file.filename}")
        
        # Check if vision engine is available
        if not vision_engine:
            raise HTTPException(
                status_code=503,
                detail={
                    'error': 'Portfolio scanning service unavailable. Please check Google API configuration.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'VISION_SERVICE_UNAVAILABLE'
                }
            )
        
        # Validate file format
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail={
                    'error': f'Invalid file format: {file.content_type}. Please upload PNG, JPG, or JPEG images.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'INVALID_FILE_FORMAT'
                }
            )
        
        # Check supported formats
        supported_formats = Config.SUPPORTED_IMAGE_FORMATS
        if file.content_type not in supported_formats:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': f'Unsupported image format: {file.content_type}. Supported formats: {", ".join(supported_formats)}',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'UNSUPPORTED_FORMAT'
                }
            )
        
        # Read file content
        try:
            image_bytes = await file.read()
        except Exception as e:
            logger.error(f"Failed to read uploaded file: {e}")
            raise HTTPException(
                status_code=400,
                detail={
                    'error': 'Failed to read uploaded file. Please try again.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'FILE_READ_ERROR'
                }
            )
        
        # Validate file size
        file_size = len(image_bytes)
        max_size_bytes = Config.MAX_FILE_SIZE_MB * 1024 * 1024
        
        if file_size > max_size_bytes:
            raise HTTPException(
                status_code=413,
                detail={
                    'error': f'File too large: {file_size / (1024*1024):.1f}MB. Maximum size: {Config.MAX_FILE_SIZE_MB}MB',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'FILE_TOO_LARGE'
                }
            )
        
        if file_size == 0:
            raise HTTPException(
                status_code=400,
                detail={
                    'error': 'Empty file uploaded. Please select a valid image.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'EMPTY_FILE'
                }
            )
        
        logger.info(f"Processing image: {file.filename}, size: {file_size / 1024:.1f}KB")
        
        # Analyze image with Gemini Vision
        try:
            gemini_response = vision_engine.analyze_portfolio_image(image_bytes)
            logger.info("Gemini analysis completed successfully")
            
        except ConfigurationError as e:
            logger.error(f"Configuration error: {e}")
            raise HTTPException(
                status_code=500,
                detail={
                    'error': 'Service configuration error. Please contact support.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'CONFIGURATION_ERROR'
                }
            )
            
        except APIError as e:
            logger.error(f"Gemini API error: {e}")
            raise HTTPException(
                status_code=502,
                detail={
                    'error': 'AI analysis service temporarily unavailable. Please try again later.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'AI_SERVICE_ERROR'
                }
            )
            
        except VisionEngineError as e:
            logger.error(f"Vision engine error: {e}")
            raise HTTPException(
                status_code=422,
                detail={
                    'error': 'Unable to analyze the uploaded image. Please ensure it shows a clear portfolio view.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'ANALYSIS_FAILED'
                }
            )
        
        # Validate and convert response
        try:
            processing_time = time.time() - start_time
            result = validate_gemini_response(gemini_response)
            result.processing_time = processing_time
            
            logger.info(f"Portfolio analysis completed: {len(result.extracted_holdings)} holdings, {processing_time:.2f}s")
            
            return PortfolioScanResponse(
                success=True,
                message=f"Successfully analyzed portfolio with {len(result.extracted_holdings)} holdings",
                result=result
            )
            
        except ValueError as e:
            logger.error(f"Invalid Gemini response: {e}")
            raise HTTPException(
                status_code=422,
                detail={
                    'error': 'AI returned invalid analysis. Please try with a clearer portfolio image.',
                    'timestamp': datetime.utcnow().isoformat(),
                    'error_code': 'INVALID_AI_RESPONSE'
                }
            )
        
    except HTTPException:
        raise
    except Exception as e:
        processing_time = time.time() - start_time
        logger.error(f"Unexpected error in portfolio analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                'error': f'Portfolio analysis failed: {str(e)}',
                'timestamp': datetime.utcnow().isoformat(),
                'processing_time': processing_time,
                'error_code': 'INTERNAL_ERROR'
            }
        )


@app.get("/api/portfolio/test-analysis")
async def test_portfolio_analysis():
    """
    Test endpoint that returns a mock portfolio analysis result.
    Useful for frontend development and testing.
    """
    try:
        logger.info("Mock portfolio analysis requested")
        
        # Create mock analysis result
        mock_result = create_mock_analysis_result()
        
        return PortfolioScanResponse(
            success=True,
            message="Mock portfolio analysis generated successfully",
            result=mock_result
        )
        
    except Exception as e:
        logger.error(f"Error generating mock analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                'error': f'Mock analysis failed: {str(e)}',
                'timestamp': datetime.utcnow().isoformat()
            }
        )


@app.get("/api/portfolio/vision-status")
async def get_vision_status():
    """
    Check the status of the vision engine and Google Gemini API configuration.
    """
    try:
        status = {
            'vision_engine_available': vision_engine is not None,
            'google_api_configured': Config.GOOGLE_API_KEY is not None,
            'supported_formats': Config.SUPPORTED_IMAGE_FORMATS,
            'max_file_size_mb': Config.MAX_FILE_SIZE_MB,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        if vision_engine:
            status['status'] = 'ready'
            status['message'] = 'Portfolio scanning is ready'
        elif not Config.GOOGLE_API_KEY:
            status['status'] = 'configuration_required'
            status['message'] = 'Google API key required. Set GOOGLE_API_KEY environment variable.'
        else:
            status['status'] = 'error'
            status['message'] = 'Vision engine initialization failed'
        
        return status
        
    except Exception as e:
        logger.error(f"Error checking vision status: {e}")
        return {
            'status': 'error',
            'message': f'Status check failed: {str(e)}',
            'vision_engine_available': False,
            'google_api_configured': False,
            'timestamp': datetime.utcnow().isoformat()
        }


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        'error': 'Endpoint not found',
        'timestamp': datetime.utcnow().isoformat()
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f'Internal server error: {exc}')
    return {
        'error': 'Internal server error',
        'timestamp': datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Investment Research Terminal API...")
    print("📍 Server running at: http://localhost:8000")
    print("🔗 Health check: http://localhost:8000/api/health")
    print("📊 Enhanced analysis with yfinance integration")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")