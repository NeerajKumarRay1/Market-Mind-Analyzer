"""
Google Gemini Vision integration for portfolio image analysis.
Handles AI-powered extraction of holdings from brokerage app screenshots.
"""

import os
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime

try:
    import google.generativeai as genai
    from google.generativeai.types import HarmCategory, HarmBlockThreshold
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from config import Config

# Configure logging
logger = logging.getLogger(__name__)

class VisionEngineError(Exception):
    """Custom exception for vision engine errors"""
    pass

class ConfigurationError(VisionEngineError):
    """Raised when API configuration is invalid"""
    pass

class APIError(VisionEngineError):
    """Raised when Gemini API calls fail"""
    pass

class VisionEngine:
    """
    Google Gemini Vision integration for portfolio analysis.
    Handles image processing and AI-powered holdings extraction.
    """
    
    def __init__(self):
        self.model = None
        self.api_key = None
        self._configure_client()
    
    def _configure_client(self) -> None:
        """
        Configure the Gemini client with API key validation.
        
        Raises:
            ConfigurationError: If API key is missing or Gemini is unavailable
        """
        if not GEMINI_AVAILABLE:
            raise ConfigurationError(
                "Google Generative AI library not available. "
                "Please install: pip install google-generativeai"
            )
        
        # Get API key from environment
        self.api_key = Config.GOOGLE_API_KEY
        if not self.api_key:
            raise ConfigurationError(
                "GOOGLE_API_KEY environment variable is required for portfolio scanning. "
                "Please set your Google Gemini API key in the environment."
            )
        
        try:
            # Configure the API key
            genai.configure(api_key=self.api_key)
            
            # Initialize the model with safety settings
            self.model = genai.GenerativeModel(
                'gemini-1.5-flash',
                safety_settings={
                    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                }
            )
            
            logger.info("Gemini Vision client configured successfully")
            
        except Exception as e:
            logger.error(f"Failed to configure Gemini client: {e}")
            raise ConfigurationError(f"Failed to configure Gemini API: {str(e)}")
    
    def analyze_portfolio_image(self, image_bytes: bytes) -> Dict:
        """
        Analyze a portfolio screenshot using Gemini Vision.
        
        Args:
            image_bytes: Raw image data as bytes
            
        Returns:
            Dict containing extracted holdings and analysis
            
        Raises:
            APIError: If the Gemini API call fails
            VisionEngineError: If response parsing fails
        """
        if not self.model:
            raise ConfigurationError("Gemini client not configured")
        
        # Create the system prompt for portfolio analysis
        prompt = self._create_portfolio_prompt()
        
        try:
            logger.info("Starting portfolio image analysis with Gemini Vision")
            
            # Prepare the image for Gemini
            image_part = {
                "mime_type": "image/jpeg",  # Assume JPEG for now
                "data": image_bytes
            }
            
            # Generate content with the image and prompt
            response = self.model.generate_content([prompt, image_part])
            
            if not response.text:
                raise APIError("Empty response from Gemini API")
            
            logger.info("Received response from Gemini Vision")
            
            # Parse the JSON response
            try:
                result = json.loads(response.text.strip())
                logger.info(f"Successfully parsed portfolio analysis: {len(result.get('extracted_holdings', []))} holdings found")
                return result
                
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Gemini response as JSON: {e}")
                logger.error(f"Raw response: {response.text[:500]}...")
                raise VisionEngineError(f"Invalid JSON response from AI: {str(e)}")
        
        except Exception as e:
            if isinstance(e, (APIError, VisionEngineError)):
                raise
            
            logger.error(f"Gemini API call failed: {e}")
            raise APIError(f"Portfolio analysis failed: {str(e)}")
    
    def _create_portfolio_prompt(self) -> str:
        """
        Create the structured prompt for portfolio analysis.
        This prompt ensures consistent JSON output format.
        
        Returns:
            Formatted prompt string for Gemini Vision
        """
        return """You are a veteran Senior Portfolio Manager and Financial Analyst.

Your task is two-fold based on the provided image of an investment portfolio:

TASK 1: EXTRACTION
Identify the asset tickers (e.g., AAPL, BTC, VTI) and quantities held. Ignore cash balances or UI elements.

TASK 2: ANALYSIS & ADVICE
Analyze the extracted holdings. Rate the portfolio's diversification on a scale of 1-10. Identify risk level and missing sectors. Suggest exactly 3 specific assets to add that would improve diversification or balance risk.

OUTPUT FORMAT:
You MUST return ONLY raw JSON. Do not use markdown blocks. The JSON must follow this exact structure:

{
  "extracted_holdings": [
    {"ticker": "AAPL", "qty": 10.5},
    {"ticker": "TSLA", "qty": 5.0}
  ],
  "analysis": {
    "health_score": 7,
    "risk_profile": "Aggressive (Tech heavy)",
    "strengths": ["Strong growth potential"],
    "weaknesses": ["Zero exposure to defensive sectors or bonds"],
    "suggestions": [
      {"ticker": "VTI", "reason": "Adds broad total market coverage to de-risk."},
      {"ticker": "JNJ", "reason": "Adds stable healthcare dividend exposure."},
      {"ticker": "GLD", "reason": "Hedge against market uncertainty."}
    ]
  }
}"""

def configure_gemini_client() -> VisionEngine:
    """
    Factory function to create and configure a VisionEngine instance.
    
    Returns:
        Configured VisionEngine instance
        
    Raises:
        ConfigurationError: If configuration fails
    """
    return VisionEngine()

# Test function for development
def test_vision_engine():
    """Test function to verify Gemini configuration"""
    try:
        engine = configure_gemini_client()
        logger.info("Vision engine test: Configuration successful")
        return True
    except Exception as e:
        logger.error(f"Vision engine test failed: {e}")
        return False

if __name__ == "__main__":
    # Test the configuration when run directly
    logging.basicConfig(level=logging.INFO)
    success = test_vision_engine()
    print(f"Vision engine test: {'PASSED' if success else 'FAILED'}")