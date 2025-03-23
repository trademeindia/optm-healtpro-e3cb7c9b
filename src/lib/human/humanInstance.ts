
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

// Set multiple potential model paths to try in sequence if loading fails
const possibleModels = [
  'blazepose.json',
  'blazepose-lite.json',
  'blazepose-heavy.json'
];

// Choose the best model based on device performance
// This will be checked during the warmup process
if (human.config.body) {
  // Default to the first option, the warmup process will try others if needed
  human.config.body.modelPath = possibleModels[0];
  console.log('Set initial body model to:', human.config.body.modelPath);
}
