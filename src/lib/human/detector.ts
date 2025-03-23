
import * as Human from '@vladmandic/human';
import { human } from './humanInstance';
import { warmupModel, resetModel } from './modelLoader';

// Track tensor cleanup
let detectionCount = 0;
const CLEANUP_INTERVAL = 5; // Clean up every 5 detections
const TENSOR_THRESHOLD = 100; // Reduced threshold for earlier cleanup

/**
 * Clean up tensors periodically to prevent memory leaks
 */
const manageMemory = (force = false) => {
  if (!human.tf || !human.tf.engine) return;
  
  detectionCount++;
  const numTensors = human.tf.engine().state.numTensors;
  
  // Clean up if we've reached the interval, have too many tensors, or forced
  if (detectionCount >= CLEANUP_INTERVAL || numTensors > TENSOR_THRESHOLD || force) {
    console.log(`Managing memory - tensors before: ${numTensors}`);
    human.tf.engine().disposeVariables();
    detectionCount = 0;
    console.log(`Tensors after cleanup: ${human.tf.engine().state.numTensors}`);
  }
};

/**
 * Handle the segmentation error by disabling it and reloading the model
 */
const handleSegmentationError = async (error: any) => {
  if (error instanceof Error && 
      (error.message.includes('activation_segmentation') || 
       error.message.includes('not found in the graph'))) {
    console.warn('Segmentation error detected, disabling segmentation');
    
    // Ensure segmentation is disabled
    if (human.config.segmentation) {
      human.config.segmentation.enabled = false;
    }
    
    // Reset and reload model
    await resetModel();
    return await warmupModel();
  }
  return false;
};

/**
 * Detect pose in an image/video frame with improved performance
 */
export const detectPose = async (input: HTMLVideoElement | HTMLImageElement) => {
  // First check if input is valid
  if (!input) {
    console.error('Invalid input for detection');
    return null;
  }
  
  // For video elements, ensure they are playing and have dimensions
  if (input instanceof HTMLVideoElement) {
    if (input.paused || input.videoWidth === 0 || input.videoHeight === 0) {
      console.warn('Video not ready for detection:', {
        paused: input.paused,
        width: input.videoWidth,
        height: input.videoHeight
      });
      return null;
    }
  }
  
  // Check if models are loaded
  if (!human.models.loaded()) {
    console.warn('Models not loaded. Loading now...');
    try {
      await warmupModel();
    } catch (error) {
      console.error('Failed to load models for detection:', error);
      await handleSegmentationError(error);
      return null;
    }
  }
  
  try {
    // Run detection with a timeout
    const detectionPromise = human.detect(input, {
      face: { enabled: false },
      body: { enabled: true },
      hand: { enabled: false },
      object: { enabled: false },
      gesture: { enabled: false },
      segmentation: { enabled: false }
    });
    
    // Add a timeout to prevent hanging (shorter timeout for better UX)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 3000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;
    
    // Clean up tensors periodically
    manageMemory();
    
    return result;
  } catch (error) {
    console.error('Error during pose detection:', error);
    
    // Try to handle segmentation error
    await handleSegmentationError(error);
    
    // Clean up tensors on error to prevent memory leaks
    manageMemory(true);
    
    return null;
  }
};

/**
 * Reset detector state and clean up resources
 */
export const resetDetector = async () => {
  detectionCount = 0;
  
  // Clean up tensors
  if (human.tf && human.tf.engine) {
    human.tf.engine().disposeVariables();
  }
  
  // Reset model
  await resetModel();
};
