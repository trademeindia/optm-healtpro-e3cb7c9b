
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human } from '@/lib/human';
import { extractBodyAngles } from '@/lib/human/angles';
import { extractBiomarkers } from '@/lib/human/biomarkers';

// Default empty angles object for when detection fails
const emptyAngles = {
  kneeAngle: null,
  hipAngle: null,
  shoulderAngle: null,
  elbowAngle: null,
  ankleAngle: null,
  neckAngle: null
};

/**
 * Performs pose detection on a video frame and returns processed results
 * with improved error handling
 */
export const performDetection = async (
  videoElement: HTMLVideoElement
): Promise<DetectionResult> => {
  if (!videoElement || !videoElement.readyState || videoElement.readyState < 2) {
    console.warn('Video element is not ready for detection');
    return {
      result: null,
      angles: emptyAngles,
      biomarkers: {},
      newMotionState: null
    };
  }

  try {
    // Check if model is loaded first
    if (!human.models.loaded()) {
      console.warn('Human model not loaded, attempting to load now');
      try {
        await human.load();
        console.log('Human model loaded successfully');
      } catch (e) {
        console.error('Failed to load Human model:', e);
      }
    }
    
    // Add a timeout for detection to prevent hanging
    const detectionPromise = human.detect(videoElement);
    
    // Increase timeout to 5 seconds for initial detections, then reduce to 3 seconds
    const timeoutDuration = human.tf.engine().state.numTensors > 100 ? 5000 : 3000;
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), timeoutDuration);
    });
    
    // Log more details about the detection process
    console.log(`Starting detection with ${timeoutDuration}ms timeout, tensors: ${human.tf.engine().state.numTensors}`);
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;

    if (!result || !result.body || result.body.length === 0) {
      console.log('No body detected in frame');
      return {
        result: null,
        angles: emptyAngles,
        biomarkers: {},
        newMotionState: null
      };
    }

    // Log successful detection
    console.log(`Body detected: ${result.body.length} bodies, ${result.body[0].keypoints.length} keypoints`);

    // Calculate joint angles
    const angles = extractBodyAngles(result);
    
    // Calculate biomarkers based on detection and angles
    const biomarkers = extractBiomarkers(result, angles);

    // Log the calculated angles for debugging
    console.log('Calculated angles:', 
      JSON.stringify({
        knee: angles.kneeAngle, 
        hip: angles.hipAngle, 
        shoulder: angles.shoulderAngle
      })
    );

    // Determine motion state based on knee angle
    let newMotionState = null;
    
    // We'll add proper motion state detection in a follow-up step
    // This is handled elsewhere in the codebase

    return {
      result,
      angles,
      biomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in detection:', error);
    
    // Clean up any lingering tensors to prevent memory leaks
    try {
      if (human.tf && human.tf.engine) {
        const tensors = human.tf.engine().state.numTensors;
        if (tensors > 500) {
          console.warn(`High tensor count (${tensors}), cleaning up`);
          human.tf.engine().disposeVariables();
        }
      }
    } catch (e) {
      console.error('Error cleaning up tensors:', e);
    }
    
    // Return a valid result even on error to prevent crashes
    return {
      result: null,
      angles: emptyAngles,
      biomarkers: {},
      newMotionState: null
    };
  }
};
