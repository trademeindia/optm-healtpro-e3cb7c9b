
import * as Human from '@vladmandic/human';

// Create a partial config that we'll extend with Human.js defaults
export const humanConfig: Partial<Human.Config> = {
  // Set backend to use WebGL for better performance
  backend: 'webgl',
  
  // Model paths
  modelBasePath: '/',
  
  // Optimizations
  warmup: 'none',
  
  // Media settings
  filter: { enabled: false },
  
  // Detection settings
  face: { enabled: false },
  hand: { enabled: false },
  body: {
    enabled: true,
    modelPath: 'blazepose-lite.json',
    minConfidence: 0.3,
    maxDetected: 1
  },
  
  // Advanced settings
  segmentation: { enabled: false },
  gesture: { enabled: false },
  
  // Debugging settings
  debug: false
};

// Default human export with configuration
export default humanConfig;
