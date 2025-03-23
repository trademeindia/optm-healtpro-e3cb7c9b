
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library optimized for body tracking
export const humanConfig: Human.Config = {
  // Core configuration
  backend: 'webgl', // Use WebGL for hardware acceleration
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
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
  
  flags: {
    useWorker: false, // Disable worker threads to prevent compatibility issues
  }, 
  
  softwareKernels: true,
  
  // Filter configuration
  filter: { 
    enabled: true, 
    equalization: false,
    // Use the right property for filtering according to Human.js type definition
    strength: 0.5, // Add temporal smoothing for more stable tracking
  },
  
  // Disable face detection to improve performance
  face: { 
    enabled: false 
  },
  
  // Enable and optimize body pose detection
  body: { 
    enabled: true,
    modelPath: 'blazepose-lite.json', // Use lite model for better performance
    minConfidence: 0.3, // Lower threshold for better detection
    skipFrames: 2, // Skip fewer frames for smoother tracking
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
