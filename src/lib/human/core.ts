
import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

/**
 * Global Human.js instance 
 */
const human = new Human.Human(humanConfig);

/**
 * Initializes and warms up the Human model
 */
export const warmupModel = async () => {
  try {
    // Check if models are already loaded
    if (!human.models.loaded()) {
      console.log('Loading Human.js model...');
      await human.load();
      console.log('Human.js model loaded successfully');
    }
    
    // Warmup the model with an empty tensor to initialize the backend
    await human.warmup();
    console.log('Human.js model warmed up and ready for detection');
    
    return true;
  } catch (error) {
    console.error('Error initializing Human.js model:', error);
    throw new Error('Failed to initialize pose detection');
  }
};

/**
 * Detect pose in an image/video frame
 */
export const detectPose = async (input: HTMLVideoElement | HTMLImageElement) => {
  if (!human.models.loaded()) {
    console.warn('Models not loaded. Loading now...');
    await human.load();
  }
  
  try {
    // Run detection
    const result = await human.detect(input);
    return result;
  } catch (error) {
    console.error('Error during pose detection:', error);
    return null;
  }
};

export { human };
