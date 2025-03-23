
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
 * Validate model exists at the expected path
 */
const validateModelPath = async (): Promise<boolean> => {
  try {
    // Check if model file is accessible
    const modelUrl = `${humanConfig.modelBasePath}${humanConfig.body.modelPath}`;
    console.log('Validating model path:', modelUrl);
    
    const response = await fetch(modelUrl, { method: 'HEAD', cache: 'no-store' });
    
    if (!response.ok) {
      console.error(`Model file not found: ${modelUrl} (Status: ${response.status})`);
      return false;
    }
    
    console.log('Model file accessible:', modelUrl);
    return true;
  } catch (error) {
    console.error('Error validating model path:', error);
    return false;
  }
};

/**
 * Get an alternative model path if the primary one fails
 */
const getAlternativeModelPath = (attempt: number): { basePath: string, modelPath: string } => {
  // Try different CDN paths and model versions based on the attempt number
  if (attempt === 1) {
    return {
      basePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human@latest/dist/models/',
      modelPath: 'blazepose.json'
    };
  } else {
    return {
      basePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human@3.0.0/dist/models/',
      modelPath: 'blazepose.json'
    };
  }
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
    
    // Validate original model path
    const isValidPath = await validateModelPath();
    
    if (!isValidPath) {
      console.warn('Original model path not valid, trying alternative paths');
      // Try alternative model path
      const altPath = getAlternativeModelPath(loadAttempts);
      human.config.modelBasePath = altPath.basePath;
      human.config.body.modelPath = altPath.modelPath;
      
      console.log('Using alternative model path:', 
                 human.config.modelBasePath + human.config.body.modelPath);
    }
    
    modelLoadProgress = 30;
    
    // Check tensor count before loading
    let beforeTensors = 0;
    if (human.tf) {
      beforeTensors = human.tf.engine().state.numTensors;
      console.log('Tensor count before model load:', beforeTensors);
    }
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Model load timeout')), 20000); // Increased timeout
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
    
    // If models not loaded, verify by trying a simple detection
    if (!modelsLoaded) {
      console.warn('Models object empty, verifying by running detection');
      
      // Create a dummy canvas
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Try detection on dummy image
        try {
          const result = await human.detect(canvas);
          console.log('Test detection result:', result ? 'Success' : 'Failed');
        } catch (e) {
          console.error('Test detection failed:', e);
          throw new Error('Model verification failed');
        }
      }
    }
    
    modelLoadProgress = 100;
    loadAttempts = 0;
    
    return Boolean(loaded) && (modelsLoaded || Boolean(loaded));
  } catch (error) {
    console.error('Error warming up model:', error);
    loadAttempts++;
    
    if (loadAttempts >= MAX_LOAD_ATTEMPTS) {
      resetTrackingVars();
      throw error;
    } else {
      // Try again with a different model path on next attempt
      console.log(`Model load attempt ${loadAttempts} failed, will try different path next`);
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
