
import * as Human from '@vladmandic/human';

/**
 * Configuration for Human.js
 */
export const humanConfig: Partial<Human.Config> = {
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
  filter: { enabled: true, equalization: false, width: 0 },
  face: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  body: {
    enabled: true,
    modelPath: 'blazepose-heavy.json',
    minConfidence: 0.5,
    maxDetected: 1,
  },
  segmentation: { enabled: false },
  debug: false,
  async: true,
  warmup: 'none',
  backend: 'webgl',
  // useWebGPU: false, // Removing this property to fix the error
  cacheSensitivity: 0,
  deallocate: true,
  profile: false,
};
