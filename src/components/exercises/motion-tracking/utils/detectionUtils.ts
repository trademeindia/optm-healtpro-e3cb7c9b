
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human } from '@/lib/human';
import { extractBodyAngles } from '@/lib/human/angles';
import { extractBiomarkers } from '@/lib/human/biomarkers';
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

/**
 * Determines the current motion state based on body angles
 */
export const determineMotionState = (angles: any): MotionState => {
  const kneeAngle = angles?.kneeAngle || 180;
  
  if (kneeAngle < 100) {
    return MotionState.FULL_MOTION;
  } else if (kneeAngle < 160) {
    return MotionState.MID_MOTION;
  } else {
    return MotionState.STANDING;
  }
};

/**
 * Performs pose detection on a video frame and returns processed results
 * with improved error handling
 */
export const performDetection = async (
  videoElement: HTMLVideoElement
): Promise<DetectionResult | null> => {
  if (!videoElement || !videoElement.readyState || videoElement.readyState < 2) {
    console.warn('Video element is not ready for detection');
    return null;
  }

  try {
    // Check if model is loaded first
    if (!human.models.loaded()) {
      console.warn('Human model not loaded, detection may fail');
    }
    
    // Perform the detection
    const result = await human.detect(videoElement);

    if (!result || !result.body || result.body.length === 0) {
      return {
        result: null,
        angles: emptyAngles,
        biomarkers: {},
        newMotionState: MotionState.STANDING
      };
    }

    // Calculate joint angles
    const angles = extractBodyAngles(result);
    
    // Calculate biomarkers based on detection and angles
    const biomarkers = extractBiomarkers(result, angles);

    // Determine motion state based on knee angle
    const newMotionState = determineMotionState(angles);

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
      newMotionState: MotionState.STANDING
    };
  }
};
