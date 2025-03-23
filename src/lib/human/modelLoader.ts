
import { human } from './humanInstance';
import { humanConfig } from './config';

// Track loading progress
let modelLoadProgress = 0;

/**
 * Get the current model loading progress (0-100)
 */
export const getModelLoadProgress = (): number => {
  return modelLoadProgress;
};

/**
 * Warm up the model to ensure it's ready for detection
 */
export const warmupModel = async () => {
  try {
    console.log('Warming up Human.js model...');
    modelLoadProgress = 10;
    
    // Ensure model path is set correctly
    if (human.config.body.modelPath !== humanConfig.body.modelPath) {
      console.log('Updating model path configuration');
      human.config.body.modelPath = humanConfig.body.modelPath;
    }
    
    // Load the model
    modelLoadProgress = 30;
    const loaded = await human.load();
    console.log('Human.js model load status:', loaded);
    
    modelLoadProgress = 70;
    
    // Check if models are actually loaded
    const modelsLoaded = Object.keys(human.models).length > 0;
    console.log('Human.js models loaded:', modelsLoaded);
    
    modelLoadProgress = 100;
    return Boolean(loaded) && modelsLoaded;
  } catch (error) {
    console.error('Error warming up model:', error);
    return false;
  }
};

/**
 * Reset the model and clean up resources
 */
export const resetModel = async () => {
  if (human.tf) {
    const tensors = human.tf.engine().state.numTensors;
    console.log(`Current tensor count before reset: ${tensors}`);
    
    if (tensors > 100) {
      try {
        console.log('Disposing variables');
        human.tf.engine().disposeVariables();
      } catch (e) {
        console.error('Error disposing variables:', e);
      }
    }
  }
  
  try {
    console.log('Resetting model...');
    await human.reset();
    console.log('Model reset complete');
  } catch (error) {
    console.error('Error resetting model:', error);
  }
};
