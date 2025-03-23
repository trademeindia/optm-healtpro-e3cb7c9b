
/**
 * Configuration for Human.js library
 */
export const humanConfig = {
  // Use WebGL backend for better performance
  backend: 'webgl' as const,
  
  // Path for models
  modelBasePath: '/models/',
  
  // Skip warmup for better startup performance
  warmup: 'none' as const,
  
  // Enable body pose detection with higher confidence
  body: {
    enabled: true,
    // Use lite model for better performance
    modelPath: 'blazepose-lite.json',
    minConfidence: 0.3,
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
