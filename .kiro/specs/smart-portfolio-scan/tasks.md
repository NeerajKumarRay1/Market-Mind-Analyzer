# Implementation Plan: Smart Portfolio Scan

## Overview

This implementation plan breaks down the Smart Portfolio Scan feature into discrete coding tasks that build incrementally. The approach focuses on backend API development first, followed by frontend integration, with testing integrated throughout to ensure correctness at each step.

## Tasks

- [x] 1. Setup dependencies and environment configuration
  - Install required Python packages: `google-generativeai`, `python-multipart`
  - Add environment variable handling for `GOOGLE_API_KEY`
  - Update requirements.txt with new dependencies
  - _Requirements: 6.1, 6.2_

- [ ]* 1.1 Write property test for environment configuration
  - **Property 12: Environment Variable Configuration**
  - **Validates: Requirements 6.1, 6.2**

- [x] 2. Implement Google Gemini Vision integration service
  - [x] 2.1 Create `backend/vision_engine.py` with Gemini client setup
    - Implement `configure_gemini_client()` function
    - Add API key validation and error handling
    - _Requirements: 6.1, 6.3_

  - [x] 2.2 Implement portfolio image analysis function
    - Create `analyze_portfolio_image()` with structured prompt
    - Handle Gemini API response parsing and validation
    - Add error handling for API failures
    - _Requirements: 2.1, 2.2, 6.4_

- [ ]* 2.3 Write property tests for vision engine
  - **Property 13: Configuration Error Handling**
  - **Property 14: API Error Handling**
  - **Validates: Requirements 6.3, 6.4**

- [x] 3. Create portfolio analysis data models
  - [x] 3.1 Define Pydantic models in `backend/models/portfolio_analysis.py`
    - Implement `PortfolioHolding`, `PortfolioAnalysis`, `InvestmentRecommendation`
    - Add `PortfolioAnalysisResult` composite model
    - Include field validation and constraints
    - _Requirements: 2.2, 4.1, 4.2, 5.1_

- [ ]* 3.2 Write property tests for data models
  - **Property 5: Extraction Data Structure**
  - **Property 8: Health Score Range**
  - **Property 9: Risk Profile Classification**
  - **Property 10: Recommendation Count**
  - **Validates: Requirements 2.2, 4.1, 4.2, 5.1**

- [x] 4. Implement FastAPI endpoints for portfolio analysis
  - [x] 4.1 Create file upload endpoint in `backend/main.py`
    - Add `POST /api/portfolio/analyze-image` endpoint
    - Implement file validation (format, size limits)
    - Add UploadFile handling and image processing
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Integrate vision engine with API endpoint
    - Connect file upload to Gemini Vision analysis
    - Add response formatting and error handling
    - Implement structured JSON response
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 4.3 Write property tests for file upload validation
  - **Property 1: File Format Validation**
  - **Property 2: File Size Validation**
  - **Property 3: Error Message Clarity**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 5. Checkpoint - Test backend API functionality
  - Ensure all backend tests pass
  - Test API endpoints with sample portfolio images
  - Verify Gemini integration works with valid API key
  - Ask the user if questions arise

- [x] 6. Implement React frontend portfolio upload component
  - [x] 6.1 Create `PortfolioUpload.js` component
    - Add drag-and-drop file upload interface
    - Implement file validation on frontend
    - Add upload progress and loading states
    - _Requirements: 1.1, 1.2, 1.4, 7.2_

  - [x] 6.2 Add portfolio upload to existing Portfolio page
    - Replace current upload button with Smart Scan area
    - Integrate with existing MarketMind styling
    - Add loading state: "🤖 AI is scanning and analyzing your portfolio..."
    - _Requirements: 1.4, 7.3_

- [ ]* 6.3 Write property tests for upload component
  - **Property 4: Loading State Display**
  - **Validates: Requirements 1.4, 7.2**

- [x] 7. Implement holdings review and confirmation modal
  - [x] 7.1 Create `HoldingsReviewModal.js` component
    - Display extracted holdings in editable table format
    - Add ticker symbol and quantity editing functionality
    - Implement "Edit" and "Confirm Import" buttons
    - _Requirements: 3.1, 3.2_

  - [x] 7.2 Add ticker symbol validation
    - Implement client-side ticker validation
    - Add validation feedback and error states
    - Connect to backend validation if needed
    - _Requirements: 3.3_

- [ ]* 7.3 Write property tests for holdings review
  - **Property 6: Holdings Confirmation Workflow**
  - **Property 7: Ticker Symbol Validation**
  - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 8. Implement portfolio analysis report display
  - [x] 8.1 Create `PortfolioAnalysisReport.js` component
    - Add health score visualization with progress bar
    - Display risk profile with visual indicators (⚠️ icons)
    - Show portfolio strengths and weaknesses
    - _Requirements: 4.3, 4.4_

  - [x] 8.2 Create investment recommendations section
    - Display exactly 3 stock recommendations
    - Show reasoning for each recommendation
    - Add professional styling consistent with MarketMind
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 8.3 Write property tests for analysis display
  - **Property 11: Recommendation Reasoning**
  - **Validates: Requirements 5.2, 5.3**

- [x] 9. Integrate complete workflow in Portfolio page
  - [x] 9.1 Wire all components together
    - Connect upload → review → analysis workflow
    - Add state management for analysis results
    - Implement error handling and user feedback
    - _Requirements: 3.4, 7.4_

  - [x] 9.2 Add analysis results to portfolio state
    - Save confirmed holdings to existing portfolio
    - Display analysis report above asset table
    - Maintain existing portfolio functionality
    - _Requirements: 3.4, 4.4_

- [ ]* 9.3 Write integration tests for complete workflow
  - Test end-to-end portfolio scan process
  - Verify error handling across all components
  - Test state management and data flow
  - _Requirements: 3.4, 7.4_

- [x] 10. Final checkpoint - Complete system testing
  - Ensure all property-based tests pass
  - Test complete workflow with various portfolio images
  - Verify error handling and edge cases
  - Confirm professional styling and user experience
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation builds incrementally: backend → frontend → integration