
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human, warmupModel } from '@/lib/human';
import { extractBodyAngles } from '@/lib/human/angles';
import { extractBiomarkers } from '@/lib/human/biomarkers';
import { determineMotionState } from './motionStateUtils';
import { MotionState } from '@/components/exercises/posture-monitor/types';

// Default empty angles object for when detection fails
const emptyAngles = {
  kneeAngle: null,
  hipAngle: null,
  shoulderAngle: null,
  elbowAngle: null,
  ankleAngle: null,
  neckAngle: null
};

// Track detection performance metrics for adaptive frame skipping
let consecutiveFailures = 0;
let lastSuccessfulDetection = 0;

/**
 * Performs pose detection on a video frame and returns processed results
 * with improved error handling and adaptive frame skipping
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
        const loaded = await warmupModel();
        if (!loaded) {
          console.warn('Failed to load Human model completely');
        } else {
          console.log('Human model loaded successfully');
        }
      } catch (e) {
        console.error('Failed to load Human model:', e);
      }
    }
    
    // Use adaptive timeout based on past performance
    const timeoutDuration = consecutiveFailures === 0 ? 5000 : 3000; // Shorter timeout after failures
    
    // Run detection with appropriate timeout
    const detectionPromise = human.detect(videoElement);
    
    console.log(`Starting detection with ${timeoutDuration}ms timeout`);
    if (human.tf) {
      console.log(`Current tensor count: ${human.tf.engine().state.numTensors}`);
    }
    
    // Race the detection against the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), timeoutDuration);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;

    // Clean up tensors after successful detection (regardless of body detection)
    if (human.tf) {
      const tensorCount = human.tf.engine().state.numTensors;
      if (tensorCount > 200) { // Lower threshold for cleanup
        console.log(`Cleaning up tensors (count: ${tensorCount})`);
        human.tf.engine().disposeVariables();
      }
    }

    // Reset failure tracking on successful API call
    consecutiveFailures = 0;
    lastSuccessfulDetection = Date.now();

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

    // Determine motion state based on angles and the current state
    const newMotionState = determineMotionState(angles, MotionState.STANDING);

    return {
      result,
      angles,
      biomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in detection:', error);
    
    // Track consecutive failures for adaptive performance
    consecutiveFailures++;
    
    // Clean up any lingering tensors to prevent memory leaks
    try {
      if (human.tf && human.tf.engine) {
        const tensors = human.tf.engine().state.numTensors;
        if (tensors > 100) { // Lower threshold for cleanup on error
          console.warn(`High tensor count: ${tensors}, cleaning up`);
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
