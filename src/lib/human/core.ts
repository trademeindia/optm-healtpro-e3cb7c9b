
/**
 * Human.js core functionality
 * This file re-exports all the functionality from the modular components
 */

import { human } from './humanInstance';
import { warmupModel, getModelLoadProgress, resetModel } from './modelLoader';
import { detectPose } from './detector';

// Re-export everything
export {
  human,
  warmupModel,
  getModelLoadProgress,
  resetModel,
  detectPose
};
