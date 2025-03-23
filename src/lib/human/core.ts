
import * as Human from '@vladmandic/human';
import { human } from './humanInstance';
import { humanConfig } from './config';

/**
 * Initialize Human model with proper configuration
 */
export const initHuman = () => {
  try {
    // Ensure we're using the latest config
    Object.assign(human.config, humanConfig);
    
    // Make sure segmentation is disabled to prevent errors
    if (human.config.segmentation) {
      human.config.segmentation.enabled = false;
    }
    
    // Make sure we're using the lite model for better performance
    if (human.config.body) {
      human.config.body.modelPath = 'blazepose-lite.json';
      human.config.body.skipFrames = 5; // Increase frame skipping for better performance
    }
    
    // Log the model path being used
    console.log('Using body model path:', human.config.body.modelPath);
    
    return true;
  } catch (error) {
    console.error('Error initializing Human:', error);
    return false;
  }
};

/**
 * Check for and handle potential segmentation error in config
 */
const checkForSegmentationIssue = () => {
  try {
    // Force disable segmentation to avoid "activation_segmentation" error
    if (human.config.segmentation && human.config.segmentation.enabled) {
      console.warn('Disabling segmentation to prevent errors');
      human.config.segmentation.enabled = false;
    }
    return true;
  } catch (e) {
    console.error('Error checking segmentation config:', e);
    return false;
  }
};

/**
 * Warmup the model to ensure it's ready for detection
 */
export const warmupModel = async (): Promise<boolean> => {
  try {
    console.log('Warming up Human model...');
    
    // Ensure proper configuration
    initHuman();
    
    // Check for segmentation issue
    checkForSegmentationIssue();
    
    // Load only what we need to reduce memory usage and speed up loading
    const modelLoaded = await human.load();
    
    // Check that the model loaded successfully
    const loadSuccess = Boolean(modelLoaded);
    
    if (!loadSuccess) {
      console.error('Failed to load Human model');
      return false;
    }
    
    console.log('Human model warmed up successfully');
    
    // Check tensor count after loading
    if (human.tf && human.tf.engine) {
      const tensors = human.tf.engine().state.numTensors;
      console.log(`Current tensor count after warm-up: ${tensors}`);
      
      // Clean up if needed
      if (tensors > 50) { // Reduced threshold from 100
        console.log('Cleaning up tensors after model warm-up');
        human.tf.engine().disposeVariables();
        console.log(`Tensors after cleanup: ${human.tf.engine().state.numTensors}`);
      }
    }
    
    // Create a dummy canvas to run initial detection on
    const canvas = document.createElement('canvas');
    canvas.width = 64; // Reduced size for faster processing (from 128)
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Run a simple detection to initialize all internal tensors
      try {
        await human.detect(canvas, { 
          face: { enabled: false }, 
          body: { enabled: true },
          hand: { enabled: false },
          object: { enabled: false },
          gesture: { enabled: false },
          segmentation: { enabled: false }
        });
        console.log('Initial detection completed');
      } catch (e) {
        console.warn('Initial detection failed, but continuing:', e);
        // Still continue even if this fails, as the model may work on actual video
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error warming up Human model:', error);
    
    // Handle segmentation error specifically
    if (error instanceof Error && 
        (error.message.includes('activation_segmentation') || 
         error.message.includes('not found in the graph'))) {
      console.warn('Segmentation error during warm-up, resetting model with segmentation disabled');
      
      // Reset and try again with segmentation explicitly disabled
      await resetModel();
      human.config.segmentation = { enabled: false };
      
      // Try once more
      try {
        const result = await human.load();
        return Boolean(result);
      } catch (secondError) {
        console.error('Second attempt to load model failed:', secondError);
        return false;
      }
    }
    
    return false;
  }
};

/**
 * Reset and clean up the model
 */
export const resetModel = async (): Promise<void> => {
  try {
    if (human.tf && human.tf.engine) {
      console.log('Cleaning up tensors before reset');
      const beforeCount = human.tf.engine().state.numTensors;
      console.log(`Tensor count before cleanup: ${beforeCount}`);
      
      human.tf.engine().disposeVariables();
      
      const afterCount = human.tf.engine().state.numTensors;
      console.log(`Tensor count after cleanup: ${afterCount} (reduced by ${beforeCount - afterCount})`);
    }
    
    console.log('Resetting Human model');
    await human.reset();
    
    // Initialize again with proper config
    initHuman();
  } catch (error) {
    console.error('Error resetting Human model:', error);
  }
};

// Re-export for convenience
export { human };
export { getModelLoadProgress } from './modelLoader';
