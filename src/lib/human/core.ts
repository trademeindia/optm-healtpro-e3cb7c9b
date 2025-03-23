
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
    return modelLoadingPromise;
  }
  
  // If models are already loaded, return immediately
  if (human.models.loaded()) {
    console.log('Human.js models already loaded');
    return true;
  }
  
  isModelLoading = true;
  
  // Create a promise with timeout
  modelLoadingPromise = new Promise(async (resolve, reject) => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.error('Human.js model loading timed out after 15s');
      isModelLoading = false;
      reject(new Error('Model loading timed out'));
    }, 15000);
    
    try {
      console.log('Loading Human.js model...');
      
      // Force cleanup any existing TensorFlow memory before loading
      // @ts-ignore - TF internal API
      if (window.tf && window.tf.engine) {
        console.log('Cleaning up TensorFlow memory...');
        // @ts-ignore
        window.tf.engine().disposeVariables();
      }
      
      // Load the model with more specific error handling
      await human.load();
      console.log('Human.js model loaded successfully');
      
      // Initialize with a minimal warmup
      const result = await human.warmup();
      console.log('Human.js model warmed up:', result);
      
      clearTimeout(timeout);
      isModelLoading = false;
      resolve(true);
    } catch (error) {
      clearTimeout(timeout);
      isModelLoading = false;
      console.error('Error initializing Human.js model:', error);
      reject(error);
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
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 3000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;
    
    return result;
  } catch (error) {
    console.error('Error during pose detection:', error);
    return null;
  }
};

// Reset model if needed
export const resetModel = async () => {
  try {
    console.log('Resetting Human.js model...');
    await human.reset();
    isModelLoading = false;
    modelLoadingPromise = null;
    return true;
  } catch (error) {
    console.error('Error resetting model:', error);
    return false;
  }
};

export { human };
