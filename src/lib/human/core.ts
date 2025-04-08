
/**
 * Human.js library core integration
 * This file provides a singleton instance of the Human library
 */

import * as Human from '@vladmandic/human';
import humanConfig from './config';

// Create a singleton instance of Human
export const human = new Human.Human(humanConfig);

// Flag to track if the model has been loaded
let modelLoaded = false;

// Override the load method to track loading status
const originalLoad = human.load.bind(human);
human.load = async (...args): Promise<void> => {
  console.log('Loading Human.js models...');
  try {
    await originalLoad(...args);
    console.log('Human.js models loaded successfully');
    modelLoaded = true;
  } catch (error) {
    console.error('Error loading Human.js models:', error);
    modelLoaded = false;
    throw error;
  }
};

// Check if model is loaded
export const isModelLoaded = () => modelLoaded;

// Export the Human library for direct access if needed
export { Human };
