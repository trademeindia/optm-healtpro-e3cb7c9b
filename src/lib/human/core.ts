
import { human } from './index';
import { toast } from '@/hooks/use-toast';

/**
 * Initializes and warms up the Human.js model
 */
export const warmupModel = async (): Promise<boolean> => {
  try {
    console.log('Warming up Human.js model...');
    
    // Load model and run a simple warmup detection
    await human.load();
    
    // Create a simple canvas to run warmup on
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill with black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Run a test detection
      await human.detect(canvas);
      
      console.log('Human.js model warmed up successfully');
      return true;
    } else {
      console.error('Failed to create context for warmup');
      return false;
    }
  } catch (error) {
    console.error('Error warming up Human.js model:', error);
    toast({
      title: 'Error initializing AI model',
      description: 'There was an issue loading the pose detection model.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Resets the Human.js model and frees resources
 */
export const resetModel = async (): Promise<void> => {
  try {
    // Free WASM memory and remove cached tensors
    // Use the correct method to clean up resources based on Human.js API
    await human.cleanup();
    
    console.log('Human.js model reset successfully');
  } catch (error) {
    console.error('Error resetting Human.js model:', error);
  }
};
