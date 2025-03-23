
import * as Human from '@vladmandic/human';
import { human } from './humanInstance';
import { warmupModel } from './modelLoader';

/**
 * Detect pose in an image/video frame with improved performance
 */
export const detectPose = async (input: HTMLVideoElement | HTMLImageElement) => {
  if (!human.models.loaded()) {
    console.warn('Models not loaded. Loading now...');
    try {
      await warmupModel();
    } catch (error) {
      console.error('Failed to load models for detection:', error);
      return null;
    }
  }
  
  try {
    // Run detection with a timeout
    const detectionPromise = human.detect(input);
    
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 5000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;
    
    // Clean up tensors to prevent memory leaks
    if (human.tf && human.tf.engine) {
      const numTensors = human.tf.engine().state.numTensors;
      if (numTensors > 300) {
        console.warn(`High tensor count (${numTensors}), cleaning up`);
        human.tf.engine().disposeVariables();
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error during pose detection:', error);
    
    // Clean up tensors on error to prevent memory leaks
    if (human.tf && human.tf.engine) {
      const tensors = human.tf.engine().state.numTensors;
      if (tensors > 200) {
        console.warn(`High tensor count (${tensors}) after error, cleaning up`);
        human.tf.engine().disposeVariables();
      }
    }
    
    return null;
  }
};
