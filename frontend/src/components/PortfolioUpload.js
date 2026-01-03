import React, { useState, useRef } from 'react';
import { Upload, Camera, FileImage, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const PortfolioUpload = ({ onAnalysisComplete, onError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

  const validateFile = (file) => {
    // Check file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `Unsupported file format. Please upload PNG, JPG, or JPEG images.`
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 10MB.`
      };
    }

    // Check if file is empty
    if (file.size === 0) {
      return {
        valid: false,
        error: 'Empty file. Please select a valid image.'
      };
    }

    return { valid: true };
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('Making request to:', 'http://localhost:8000/api/portfolio/analyze-image');

      // Upload to backend
      const response = await fetch('http://localhost:8000/api/portfolio/analyze-image', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', response.status, response.statusText);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      if (result.success && result.result) {
        // Success - call the callback with the analysis result
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          onAnalysisComplete(result.result);
        }, 500);
      } else {
        throw new Error(result.message || 'Analysis failed');
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
      
      if (onError) {
        onError(err.message);
      }
    }
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    uploadFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${dragActive 
            ? 'border-[#00D4FF] bg-[#00D4FF]/5' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer hover:bg-gray-900/30'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? openFileDialog : undefined}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Upload Content */}
        <div className="space-y-4">
          {uploading ? (
            <>
              {/* Loading State */}
              <div className="flex justify-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-[#00D4FF] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  🤖 AI is scanning and analyzing your portfolio...
                </h3>
                <p className="text-gray-400">
                  This may take a few seconds while we extract your holdings
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div 
                    className="bg-[#00D4FF] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Upload Icon */}
              <div className="flex justify-center space-x-4">
                <div className="p-4 bg-[#00D4FF]/10 rounded-full">
                  <Camera className="w-8 h-8 text-[#00D4FF]" />
                </div>
                <div className="p-4 bg-[#00D4FF]/10 rounded-full">
                  <Upload className="w-8 h-8 text-[#00D4FF]" />
                </div>
              </div>

              {/* Upload Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Smart Portfolio Scan
                </h3>
                <p className="text-gray-300 text-lg">
                  Upload a screenshot of your brokerage app portfolio
                </p>
                <p className="text-gray-400 text-sm">
                  AI will extract your holdings and provide investment analysis
                </p>
              </div>

              {/* Upload Instructions */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-center space-x-2 text-[#00D4FF]">
                  <FileImage className="w-5 h-5" />
                  <span className="font-medium">Drag & drop or click to upload</span>
                </div>
                <p className="text-gray-500 text-sm">
                  Supports PNG, JPG, JPEG • Max 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">Upload Error</span>
          </div>
          <p className="text-red-200 mt-2">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Tips */}
      {!uploading && !error && (
        <div className="mt-6 p-4 bg-gray-900/30 border border-gray-700/50 rounded-xl">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
            Tips for best results:
          </h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Ensure all ticker symbols and quantities are clearly visible</li>
            <li>• Use a high-resolution screenshot for better accuracy</li>
            <li>• Include the full portfolio view with all holdings</li>
            <li>• Avoid screenshots with overlapping windows or notifications</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PortfolioUpload;