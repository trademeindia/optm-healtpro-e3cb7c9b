
import * as Human from '@vladmandic/human';
import { DetectionResult } from '../hooks/types';
import { human } from '@/lib/human';
import { calculateAngles } from '@/lib/human/angles';
import { calculateBiomarkers } from '@/lib/human/biomarkers';

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
        angles: {},
        biomarkers: {},
        timestamp: Date.now(),
      };
    }

    // Calculate joint angles
    const angles = calculateAngles(result);
    
    // Calculate biomarkers based on detection and angles
    const biomarkers = calculateBiomarkers(result, angles);

    return {
      result,
      angles,
      biomarkers,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error in detection:', error);
    throw new Error('Failed to perform detection');
  }
};
