
import * as Human from '@vladmandic/human';

// Configuration for the Human.js library
export const humanConfig: Human.Config = {
  // Model configuration
  modelBasePath: '/',
  filter: { enabled: true, equalization: false },
  face: { enabled: false },
  body: { 
    enabled: true,
    modelPath: 'blazepose.json',
    minConfidence: 0.2,
    skipFrames: 2
  },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
};
