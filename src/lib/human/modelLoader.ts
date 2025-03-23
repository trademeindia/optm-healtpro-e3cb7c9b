
import { human } from './humanInstance';
import { humanConfig } from './config';

// Track loading progress
let modelLoadProgress = 0;
let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

/**
 * Get the current model loading progress (0-100)
 */
export const getModelLoadProgress = (): number => {
  return modelLoadProgress;
};

/**
 * Reset tracking variables for a fresh start
 */
const resetTrackingVars = () => {
  modelLoadProgress = 0;
  loadAttempts = 0;
};

/**
 * Warm up the model to ensure it's ready for detection
 */
export const warmupModel = async () => {
  try {
    console.log('Warming up Human.js model...');
    modelLoadProgress = 10;
    
    // Force segmentation to be disabled
    if (human.config.segmentation) {
      human.config.segmentation.enabled = false;
    }
    
    // Ensure correct model path
    if (human.config.body) {
      human.config.body.modelPath = 'blazepose-lite.json';
    }
    
    // Load the model
    modelLoadProgress = 30;
    
    // Check tensor count before loading
    let beforeTensors = 0;
    if (human.tf) {
      beforeTensors = human.tf.engine().state.numTensors;
      console.log('Tensor count before model load:', beforeTensors);
    }
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Model load timeout')), 15000);
    });
    
    // Race the model load against the timeout
    const loaded = await Promise.race([
      human.load(),
      timeoutPromise
    ]);
    
    console.log('Human.js model load status:', loaded);
    
    // Check tensor count after loading
    if (human.tf) {
      const afterTensors = human.tf.engine().state.numTensors;
      console.log('Tensor count after model load:', afterTensors, 
                 'Difference:', afterTensors - beforeTensors);
      
      // Clean up tensors immediately
      if (afterTensors > 50) {
        console.log('Cleaning up tensors after model load');
        human.tf.engine().disposeVariables();
        console.log('Tensors after cleanup:', human.tf.engine().state.numTensors);
      }
    }
    
    modelLoadProgress = 70;
    
    // Check if models are actually loaded
    const modelsLoaded = human.models && Object.keys(human.models).length > 0;
    console.log('Human.js models loaded:', modelsLoaded);
    
    modelLoadProgress = 100;
    loadAttempts = 0;
    
    return Boolean(loaded) && modelsLoaded;
  } catch (error) {
    console.error('Error warming up model:', error);
    loadAttempts++;
    
    if (loadAttempts >= MAX_LOAD_ATTEMPTS) {
      resetTrackingVars();
    }
    
    // Clean up after error
    if (human.tf) {
      console.log('Performing aggressive cleanup after error');
      human.tf.engine().disposeVariables();
    }
    
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
    
    try {
      console.log('Disposing variables');
      human.tf.engine().disposeVariables();
      console.log('Tensors after disposal:', human.tf.engine().state.numTensors);
    } catch (e) {
      console.error('Error disposing variables:', e);
    }
  }
  
  try {
    console.log('Resetting model...');
    await human.reset();
    console.log('Model reset complete');
  } catch (error) {
    console.error('Error resetting model:', error);
  }
  
  resetTrackingVars();
};
