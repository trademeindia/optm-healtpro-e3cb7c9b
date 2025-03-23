
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
    
    // Log the model path being used
    console.log('Using body model path:', human.config.body.modelPath);
    
    return true;
  } catch (error) {
    console.error('Error initializing Human:', error);
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
    
    // Load only what we need to reduce memory usage and speed up loading
    const modelLoaded = await human.load();
    
    // Check that the model loaded successfully
    const loadSuccess = Boolean(modelLoaded);
    
    if (!loadSuccess) {
      console.error('Failed to load Human model');
      return false;
    }
    
    console.log('Human model warmed up successfully');
    
    // Create a dummy canvas to run initial detection on
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Run a simple detection to initialize all internal tensors
      await human.detect(canvas, { face: { enabled: false }, body: { enabled: true } });
      console.log('Initial detection completed');
    }
    
    return true;
  } catch (error) {
    console.error('Error warming up Human model:', error);
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
      human.tf.engine().disposeVariables();
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
