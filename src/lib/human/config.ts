
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library
export const humanConfig: Human.Config = {
  // Required core configuration
  backend: 'webgl' as Human.BackendEnum,
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/', // Use CDN for faster model loading
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/',
  debug: false,
  async: true,
  warmup: 'none', // Changed from 'full' to avoid blocking the UI during initial load
  cacheModels: true,
  cacheSensitivity: 0.7,
  skipAllowed: true, // Allow skipping frames for better performance
  deallocate: true, // Better memory management
  
  // Additional required configs to satisfy TypeScript
  wasmPlatformFetch: false,
  validateModels: false, // Skip validation for faster loading
  
  // Remove useWebGPU and useSimdWasm flags that were causing errors
  flags: {}, // Empty flags object to avoid errors
  
  softwareKernels: true, // Fallback to software implementation if needed
  
  // Filter configuration
  filter: { 
    enabled: false, // Disable filtering for better performance
    equalization: false 
  },
  
  // Detection modules configuration
  face: { 
    enabled: false 
  },
  body: { 
    enabled: true,
    modelPath: 'blazepose.json',
    minConfidence: 0.2,
    skipFrames: 1, // Skip every other frame to improve performance
    maxDetected: 1, // Only detect one person to improve performance
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
    enabled: false 
  },
};
