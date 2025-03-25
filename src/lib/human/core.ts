
import * as Human from '@vladmandic/human';
import { human } from './index';

/**
 * Warm up the Human.js model to improve initial detection performance
 */
export const warmupModel = async (): Promise<void> => {
  try {
    // Create a small canvas for model warmup
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill with black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Run a detection to initialize the model
      await human.detect(canvas);
      console.log('Human.js model warmed up successfully');
    }
  } catch (err) {
    console.error('Error warming up Human.js model:', err);
  }
};

/**
 * Reset the Human.js model and free up resources
 */
export const resetModel = (): void => {
  try {
    human.reset();
    console.log('Human.js model reset successfully');
  } catch (err) {
    console.error('Error resetting Human.js model:', err);
  }
};
