
// Export Human.js related utilities from a central location

// Export the human instance
export { human } from './humanInstance';

// Export configuration
export { humanConfig } from './config';

// Export core functions
export { 
  warmupModel,
  resetModel,
  getModelLoadProgress
} from './modelLoader';

// Export detector functions
export { 
  detectPose,
  resetDetector
} from './detector';

// Export initialization functions
export {
  initHuman
} from './core';
