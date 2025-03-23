
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
    if (!human.models.loaded()) {
      console.log('Loading Human.js model...');
      await human.load();
      console.log('Human.js model loaded successfully');
    }
    
    // Warmup the model with an empty tensor to initialize the backend
    await human.warmup();
  } catch (error) {
    console.error('Error initializing Human.js model:', error);
    throw new Error('Failed to initialize pose detection');
  }
};

export { human };
