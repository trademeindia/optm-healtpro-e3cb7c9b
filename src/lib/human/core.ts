
import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

/**
 * Global Human.js instance 
 */
const human = new Human.Human(humanConfig);

// Track loading state
let isModelLoading = false;
let modelLoadingPromise: Promise<boolean> | null = null;
let modelLoadProgress = 0;

// Properly typed event handler for tracking model loading progress
const updateProgress = (event: Event) => {
  // Cast the event to any since Human.js uses custom event types
  const progressEvent = event as any;
  if (progressEvent && typeof progressEvent.progress === 'number') {
    modelLoadProgress = Math.floor(progressEvent.progress * 100);
    console.log(`Model loading progress: ${modelLoadProgress}%`, progressEvent.status || '');
  }
};

/**
 * Get current model loading progress (0-100)
 */
export const getModelLoadProgress = (): number => {
  return modelLoadProgress;
};

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
  modelLoadProgress = 0;
  console.log('Starting Human.js model loading...');
  
  // Register progress handler with correct type
  if (human.events) {
    human.events.addEventListener('progress', updateProgress);
  }
  
  // Create a promise with timeout
  modelLoadingPromise = new Promise(async (resolve, reject) => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.error('Human.js model loading timed out after 30s');
      isModelLoading = false;
      if (human.events) {
        human.events.removeEventListener('progress', updateProgress);
      }
      // Don't reject, instead try to continue with what we have
      resolve(false);
    }, 30000); // 30s timeout
    
    try {
      console.log('Loading Human.js model...');
      
      // Force cleanup any existing TensorFlow memory before loading
      if (human.tf && human.tf.engine) {
        console.log('Cleaning up TensorFlow memory...');
        human.tf.engine().disposeVariables();
      }
      
      // First check if models are already available in cache
      const modelsCached = human.models.loaded();
      console.log('Models cached status:', modelsCached);
      
      // Load the model with more specific error handling
      const loadResult = await human.load();
      console.log('Human.js models loaded successfully:', loadResult);
      
      // Only perform a very minimal warmup to avoid freezing the UI
      const warmupConfig = {...humanConfig};
      warmupConfig.body = {
        ...warmupConfig.body,
        enabled: true,
      };
      
      const result = await human.warmup(warmupConfig);
      console.log('Human.js model warmed up:', result);
      
      // Clean up
      clearTimeout(timeout);
      isModelLoading = false;
      modelLoadProgress = 100;
      if (human.events) {
        human.events.removeEventListener('progress', updateProgress);
      }
      resolve(true);
    } catch (error) {
      clearTimeout(timeout);
      isModelLoading = false;
      console.error('Error initializing Human.js model:', error);
      if (human.events) {
        human.events.removeEventListener('progress', updateProgress);
      }
      
      // Try one more time with minimal configuration
      try {
        console.log('Attempting fallback model load with minimal config...');
        const minimalConfig: Partial<Human.Config> = {
          backend: 'webgl' as Human.BackendEnum,
          body: {enabled: true, modelPath: 'blazepose.json'}
        };
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
 * Detect pose in an image/video frame with improved performance
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
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 5000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;
    
    // Clean up tensors to prevent memory leaks
    if (human.tf && human.tf.engine) {
      const numTensors = human.tf.engine().state.numTensors;
      if (numTensors > 300) {
        console.warn(`High tensor count (${numTensors}), cleaning up`);
        human.tf.engine().disposeVariables();
      }
    }
    
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
    modelLoadProgress = 0;
    console.log('Human.js model reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting model:', error);
    return false;
  }
};

export { human };
