
import * as Human from '@vladmandic/human';
import { human } from './humanInstance';

// Track loading state
let isModelLoading = false;
let modelLoadingPromise: Promise<boolean> | null = null;
let modelLoadProgress = 0;
let modelLoadVersion = 0; // Track load attempts for recovery

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
 * Verifies that the model is actually usable by doing a simple detection test
 */
const verifyModel = async (): Promise<boolean> => {
  if (!human.models.loaded()) return false;
  
  try {
    // Create a tiny canvas to test detection
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, 64, 64);
    }
    
    // Try a simple detection with very short timeout
    const testPromise = human.detect(canvas);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Model verification timeout')), 1000);
    });
    
    await Promise.race([testPromise, timeoutPromise]);
    console.log('Model verification successful');
    return true;
  } catch (e) {
    console.warn('Model verification failed:', e);
    return false;
  }
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
  
  // If models are already loaded, verify they're working properly
  if (human.models.loaded()) {
    console.log('Human.js models already loaded, verifying...');
    const verified = await verifyModel();
    if (verified) {
      console.log('Model verified successfully, ready to use');
      return true;
    } else {
      console.warn('Loaded model failed verification, will reload');
      // Continue to reload
    }
  }
  
  isModelLoading = true;
  modelLoadProgress = 0;
  modelLoadVersion++; // Increment version to track this specific load attempt
  const currentLoadVersion = modelLoadVersion;
  console.log(`Starting Human.js model loading (attempt #${currentLoadVersion})...`);
  
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
      
      // Override configuration to use the lightweight model for first load
      const loadConfig = {...human.config};
      loadConfig.body = {
        ...loadConfig.body,
        modelPath: 'blazepose-lite.json', // Use lite model for faster loading
        enabled: true,
      };
      // Disable all other modules
      loadConfig.face = { enabled: false };
      loadConfig.hand = { enabled: false };
      loadConfig.object = { enabled: false };
      loadConfig.segmentation = { enabled: false };
      
      // Load the model with more specific error handling
      const loadResult = await human.load(loadConfig);
      console.log('Human.js models loaded successfully:', loadResult);
      
      // Only perform a very minimal warmup to avoid freezing the UI
      const warmupConfig = {...human.config};
      warmupConfig.body = {
        ...warmupConfig.body,
        enabled: true,
      };
      warmupConfig.segmentation = { enabled: false };
      
      // Only run warmup if this is still the current load attempt
      if (currentLoadVersion === modelLoadVersion) {
        const result = await human.warmup(warmupConfig);
        console.log('Human.js model warmed up:', result);
      }
      
      // Verify the model works
      const verified = await verifyModel();
      
      // Clean up
      clearTimeout(timeout);
      isModelLoading = false;
      modelLoadProgress = 100;
      if (human.events) {
        human.events.removeEventListener('progress', updateProgress);
      }
      
      if (verified) {
        resolve(true);
      } else {
        console.warn('Model loaded but verification failed');
        resolve(false);
      }
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
          body: {
            enabled: true, 
            modelPath: 'blazepose-lite.json'
          },
          segmentation: { enabled: false }
        };
        await human.load(minimalConfig);
        console.log('Fallback model load succeeded');
        
        // Quick verification
        const verified = await verifyModel();
        if (verified) {
          console.log('Fallback model verified successfully');
          resolve(true);
        } else {
          console.warn('Fallback model loaded but verification failed');
          resolve(false);
        }
      } catch(fallbackError) {
        console.error('Fallback model load failed:', fallbackError);
        reject(error);
      }
    }
  });
  
  return modelLoadingPromise;
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
    modelLoadVersion++; // Increment version
    console.log('Human.js model reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting model:', error);
    return false;
  }
};
