
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library optimized for body tracking
export const humanConfig: Human.Config = {
  // Core configuration
  backend: 'webgl', // Use WebGL for hardware acceleration
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human@3.0.0/dist/models/',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/',
  debug: false,
  async: true,
  warmup: 'none', // Skip warmup to prevent UI blocking
  cacheModels: true,
  cacheSensitivity: 0.7,
  skipAllowed: true,
  deallocate: true,
  
  // Required configs to satisfy TypeScript
  wasmPlatformFetch: false,
  validateModels: false,
  
  // Add missing required properties
  flags: {}, // Empty flags object
  softwareKernels: false, // Disable software kernels for better performance
  
  // Use a proper filter configuration that won't cause errors
  filter: {
    enabled: true,
    equalization: false,
    width: 0,
    height: 0,
    return: false,
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    blur: 0,
    saturation: 0,
    hue: 0,
    negative: false,
    sepia: false,
    vintage: false,
    kodachrome: false,
    technicolor: false,
    polaroid: false,
    pixelate: 0
  },
  
  // Disable face detection to improve performance
  face: { 
    enabled: false 
  },
  
  // Enable and optimize body pose detection
  body: { 
    enabled: true,
    modelPath: 'blazepose.json', // Use the standard model for balance of accuracy and speed
    minConfidence: 0.2, // Lower threshold for better detection in challenging conditions
    skipFrames: 1, // Skip fewer frames for smoother tracking
    maxDetected: 1, // Only track one person
  },
  
  // Disable other features to focus processing power
  hand: { 
    enabled: false 
  },
  object: { 
    enabled: false 
  },
  gesture: { 
    enabled: false 
  },
  segmentation: { 
    enabled: false 
  },
};
