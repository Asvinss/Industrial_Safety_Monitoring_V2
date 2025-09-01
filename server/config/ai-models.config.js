'use strict';

/**
 * AI Models Configuration
 * This file contains the configuration for AI models used in the application.
 * You can modify the model paths here for testing with Postman.
 */
module.exports = {
  // Base path for AI models
  basePath: process.env.AI_MODELS_PATH || './models',
  
  // Individual model configurations
  models: {
    ppeDetection: {
      path: '/ppe-detection',
      version: '1.0.0',
      file: 'ppe-detection-model.pb',
      enabled: true
    },
    fallDetection: {
      path: '/fall-detection',
      version: '1.0.0',
      file: 'fall-detection-model.pb',
      enabled: true
    },
    fireSmokeDetection: {
      path: '/fire-smoke-detection',
      version: '1.0.0',
      file: 'fire-smoke-detection-model.pb',
      enabled: true
    },
    restrictedAreaDetection: {
      path: '/restricted-area-detection',
      version: '1.0.0',
      file: 'restricted-area-detection-model.pb',
      enabled: true
    }
  },
  
  // Detection thresholds
  thresholds: {
    ppeDetection: 0.75,       // 75% confidence threshold
    fallDetection: 0.80,       // 80% confidence threshold
    fireSmokeDetection: 0.70,  // 70% confidence threshold
    restrictedAreaDetection: 0.85 // 85% confidence threshold
  },
  
  // Processing settings
  processing: {
    frameInterval: 1000,       // Process a frame every 500ms
    maxConcurrentCameras: 12, // Maximum number of cameras to process concurrently
    timeout: 5000            // Timeout for model inference in milliseconds
  }
};