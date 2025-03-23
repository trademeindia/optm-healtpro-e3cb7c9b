
/**
 * Configuration for Human.js library
 */
export const humanConfig = {
  // Use backend based on user's device capabilities
  backend: 'webgl',
  
  // Path for models
  modelBasePath: '/',
  
  // Skip warmup for better startup performance
  warmup: 'none',
  
  // Enable body pose detection
  body: {
    enabled: true,
    modelPath: 'blazepose.json',
    minConfidence: 0.2,
    maxDetected: 1,
  },
  
  // Disable components we don't need
  face: { enabled: false },
  hand: { enabled: false },
  gesture: { enabled: false },
  object: { enabled: false },
  
  // Performance settings
  filter: { enabled: true },
  segmentation: { enabled: false },
};
