
import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

/**
 * Global Human.js instance 
 */
const human = new Human.Human(humanConfig);

// Track loading state
let isModelLoading = false;
let modelLoadingPromise: Promise<boolean> | null = null;

/**
 * Initializes and warms up the Human model with improved error handling and timeout
 */
export const warmupModel = async (): Promise<boolean> => {
  // If already loading, return the existing promise
  if (isModelLoading && modelLoadingPromise) {
    console.log('Model already loading, returning existing promise');
    return modelLoadingPromise;
  }
  
  // If models are already loaded, return immediately
  if (human.models.loaded()) {
    console.log('Human.js models already loaded');
    return true;
  }
  
  isModelLoading = true;
  console.log('Starting Human.js model loading...');
  
  // Create a promise with timeout
  modelLoadingPromise = new Promise(async (resolve, reject) => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.error('Human.js model loading timed out after 20s');
      isModelLoading = false;
      // Don't reject, instead try to continue with what we have
      resolve(false);
    }, 20000);
    
    try {
      console.log('Loading Human.js model...');
      
      // Force cleanup any existing TensorFlow memory before loading
      if (human.tf && human.tf.engine) {
        console.log('Cleaning up TensorFlow memory...');
        human.tf.engine().disposeVariables();
      }
      
      // First check if models are already available in cache
      // Removed the models.check() call since it doesn't exist in the API
      const modelsCached = human.models.loaded();
      console.log('Models cached status:', modelsCached);
      
      // Load the model with more specific error handling
      const loadResult = await human.load();
      console.log('Human.js models loaded successfully:', loadResult);
      
      // Initialize with a minimal warmup (only body detection)
      // We need to create a proper warmup configuration without the 'warmup' property
      const warmupConfig = {...human.config};
      
      // Perform the warmup with the standard config
      const result = await human.warmup(warmupConfig);
      console.log('Human.js model warmed up:', result);
      
      clearTimeout(timeout);
      isModelLoading = false;
      resolve(true);
    } catch (error) {
      clearTimeout(timeout);
      isModelLoading = false;
      console.error('Error initializing Human.js model:', error);
      
      // Try one more time with minimal configuration
      try {
        console.log('Attempting fallback model load with minimal config...');
        const minimalConfig = {...human.config};
        minimalConfig.body = {enabled: true, modelPath: 'blazepose.json'};
        await human.load(minimalConfig);
        console.log('Fallback model load succeeded');
        resolve(true);
      } catch(fallbackError) {
        console.error('Fallback model load failed:', fallbackError);
        reject(error);
      }
    }
  });
  
  return modelLoadingPromise;
};

/**
 * Detect pose in an image/video frame with fallback handling
 */
export const detectPose = async (input: HTMLVideoElement | HTMLImageElement) => {
  if (!human.models.loaded()) {
    console.warn('Models not loaded. Loading now...');
    try {
      await warmupModel();
    } catch (error) {
      console.error('Failed to load models for detection:', error);
      return null;
    }
  }
  
  try {
    // Run detection with a timeout
    const detectionPromise = human.detect(input);
    
    // Add a timeout to prevent hanging - increase to 5 seconds for more reliable detection
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 5000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;
    
    return result;
  } catch (error) {
    console.error('Error during pose detection:', error);
    
    // Clean up tensors on error to prevent memory leaks
    if (human.tf && human.tf.engine) {
      const tensors = human.tf.engine().state.numTensors;
      if (tensors > 200) {
        console.warn(`High tensor count (${tensors}) after error, cleaning up`);
        human.tf.engine().disposeVariables();
      }
    }
    
    return null;
  }
};

// Reset model if needed
export const resetModel = async () => {
  try {
    console.log('Resetting Human.js model...');
    
    // Clean up tensors first
    if (human.tf && human.tf.engine) {
      human.tf.engine().disposeVariables();
    }
    
    await human.reset();
    isModelLoading = false;
    modelLoadingPromise = null;
    console.log('Human.js model reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting model:', error);
    return false;
  }
};

export { human };
