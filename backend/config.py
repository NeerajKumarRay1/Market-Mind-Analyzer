"""
Configuration settings for the Investment Research Terminal
"""

import os
from typing import List

class Config:
    """Base configuration class"""
    
    # API settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # Redis settings (for future caching)
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CACHE_EXPIRATION = int(os.environ.get('CACHE_EXPIRATION', '3600'))  # 1 hour
    
    # Financial data settings
    MAX_WORKERS = int(os.environ.get('MAX_WORKERS', '5'))
    REQUEST_TIMEOUT = int(os.environ.get('REQUEST_TIMEOUT', '10'))
    
    # Performance settings
    DASHBOARD_TIMEOUT = int(os.environ.get('DASHBOARD_TIMEOUT', '3'))  # 3 seconds
    
    # Google Gemini API settings for portfolio scanning
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    
    # Salesforce API settings
    SALESFORCE_USERNAME = os.environ.get('SALESFORCE_USERNAME')
    SALESFORCE_PASSWORD = os.environ.get('SALESFORCE_PASSWORD')
    SALESFORCE_TOKEN = os.environ.get('SALESFORCE_TOKEN')
    SALESFORCE_DOMAIN = os.environ.get('SALESFORCE_DOMAIN', 'login')
    
    # Portfolio scanning settings
    MAX_FILE_SIZE_MB = int(os.environ.get('MAX_FILE_SIZE_MB', '10'))
    SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png']
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    
class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    MAX_WORKERS = 2

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}