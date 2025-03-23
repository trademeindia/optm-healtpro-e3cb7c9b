
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human } from '@/lib/human';
import { extractBodyAngles } from '@/lib/human/angles';
import { extractBiomarkers } from '@/lib/human/biomarkers';

/**
 * Performs pose detection on a video frame and returns processed results
 */
export const performDetection = async (
  videoElement: HTMLVideoElement
): Promise<DetectionResult> => {
  if (!videoElement) {
    throw new Error('Video element is not available');
  }

  try {
    // Detect pose using Human.js
    const result = await human.detect(videoElement);

    if (!result || !result.body || result.body.length === 0) {
      return {
        result: null,
        angles: {
          kneeAngle: null,
          hipAngle: null,
          shoulderAngle: null,
          elbowAngle: null,
          ankleAngle: null,
          neckAngle: null
        },
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
    throw new Error('Failed to perform detection');
  }
};
