
/**
 * Human.js configuration
 * 
 * This file contains the configuration for the Human.js library.
 * Adjust these settings to control detection accuracy, performance, and features.
 */

const humanConfig = {
  // Main options
  backend: 'webgl', // Use WebGL backend for best performance
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/', // CDN path for models
  
  // Performance
  async: true, // Use async operations for better UI responsiveness
  warmup: 'none', // No warmup needed for our use case
  
  // Detection settings
  face: {
    enabled: false, // Disable face detection for performance
  },
  body: {
    enabled: true, // Enable body detection
    modelPath: 'blazepose.json', // Use BlazePose model
    minConfidence: 0.2, // Lower confidence threshold for more results
    maxDetections: 1, // Only detect one person
  },
  hand: {
    enabled: false, // Disable hand detection for performance
  },
  
  // Advanced options
  filter: {
    enabled: true, // Enable result filtering
    equalization: false, // No equalization needed
    width: 0, // Auto
    height: 0, // Auto
  },
  
  // Debug options
  debug: false,
};

export default humanConfig;
