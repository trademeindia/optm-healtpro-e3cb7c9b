
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
      console.warn('Human model not loaded, detection may fail');
    }
    
    // Add a timeout for detection to prevent hanging
    const detectionPromise = human.detect(videoElement);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Detection timeout')), 3000);
    });
    
    // Race the detection against the timeout
    const result = await Promise.race([
      detectionPromise,
      timeoutPromise
    ]) as Human.Result;

    if (!result || !result.body || result.body.length === 0) {
      return {
        result: null,
        angles: emptyAngles,
        biomarkers: {},
        newMotionState: null
      };
    }

    // Calculate joint angles
    const angles = extractBodyAngles(result);
    
    // Calculate biomarkers based on detection and angles
    const biomarkers = extractBiomarkers(result, angles);

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
    // Return a valid result even on error to prevent crashes
    return {
      result: null,
      angles: emptyAngles,
      biomarkers: {},
      newMotionState: null
    };
  }
};
