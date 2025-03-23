
import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

// Initialize the Human.js instance with configuration
export const human = new Human.Human(humanConfig);

// Log when the instance is created
console.log('Human.js instance created with config:', {
  backend: humanConfig.backend,
  modelBasePath: humanConfig.modelBasePath,
  body: {
    enabled: humanConfig.body.enabled,
    modelPath: humanConfig.body.modelPath
  }
});
