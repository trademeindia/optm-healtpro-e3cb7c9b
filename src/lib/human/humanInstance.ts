
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

// Ensure segmentation is disabled (this is critical to avoid errors)
if (human.config.segmentation) {
  human.config.segmentation.enabled = false;
  console.log('Explicitly disabled segmentation in instance');
}

// Force lite model for better performance
if (human.config.body) {
  human.config.body.modelPath = 'blazepose-lite.json';
  console.log('Set body model to lite version for better performance');
}
