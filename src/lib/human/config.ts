
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library
export const humanConfig: Human.Config = {
  // Required core configuration
  backend: 'webgl',
  modelBasePath: '/',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/',
  debug: false,
  async: true,
  warmup: 'full',
  cacheModels: true,
  cacheSensitivity: 0.7,
  skipAllowed: false,
  deallocate: false,
  
  // Filter configuration
  filter: { 
    enabled: true, 
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
    skipFrames: 2
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
