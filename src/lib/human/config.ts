
import * as Human from '@vladmandic/human';

// Create Human instance with optimized configuration for body pose analysis
export const humanConfig: Human.Config = {
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
  filter: { enabled: true, equalization: false },
  face: { enabled: false },
  body: { 
    enabled: true,
    modelPath: 'blazepose-heavy.json',
    maxDetected: 1, // Focus on one person at a time
    // @ts-ignore - scoreThreshold exists but is missing in types 
    scoreThreshold: 0.3,
    nmsRadius: 20,
  },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false }
};
