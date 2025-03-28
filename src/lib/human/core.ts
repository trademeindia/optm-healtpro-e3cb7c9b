
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
    // Use the correct method to clean up resources based on Human.js API
    // Note: Human.js uses cleanup instead of dispose
    if (human && typeof human.cleanup === 'function') {
      await human.cleanup();
    } else {
      // Fallback for different versions
      console.warn('Human.js cleanup method not found, trying alternative methods');
      
      // Try to reset config and tensors
      if (human.tf) {
        // @ts-ignore - Reset TensorFlow memory if available
        human.tf.disposeVariables?.();
        // @ts-ignore - Try to clear backend memory if available
        human.tf.engine?.().endScope?.();
      }
    }
    
    console.log('Human.js model reset successfully');
  } catch (error) {
    console.error('Error resetting Human.js model:', error);
  }
};
