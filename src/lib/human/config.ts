
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library
export const humanConfig: Human.Config = {
  // Required core configuration
  backend: 'webgl' as Human.BackendEnum,
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/',
  debug: false,
  async: true,
  warmup: 'none', // Skip warmup to avoid UI blocking
  cacheModels: true,
  cacheSensitivity: 0.7,
  skipAllowed: true,
  deallocate: true,
  
  // Additional required configs to satisfy TypeScript
  wasmPlatformFetch: false,
  validateModels: false,
  
  flags: {
    useWorker: false, // Disable worker threads to avoid compatibility issues
  }, 
  
  softwareKernels: true,
  
  // Filter configuration
  filter: { 
    enabled: false, // Disable filtering
    equalization: false 
  },
  
  // Only enable what we absolutely need
  face: { 
    enabled: false 
  },
  body: { 
    enabled: true,
    modelPath: 'blazepose-lite.json', // Use lite model for better performance
    minConfidence: 0.2,
    skipFrames: 4, // Skip frames for better performance
    maxDetected: 1, // Only track one person
  },
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
    enabled: false // Disable segmentation which was causing errors
  },
};
