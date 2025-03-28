
import * as Human from '@vladmandic/human';
import { human, extractBodyAngles, extractBiomarkers } from '@/lib/human';
import { MotionState } from '@/lib/human/types'; 
import { determineMotionState } from './motionStateUtils';

/**
 * Perform pose detection on a video frame and extract relevant data
 */
export const performDetection = async (videoElement: HTMLVideoElement) => {
  // Perform detection with Human.js
  const result = await human.detect(videoElement);
  
  // Extract angles from the detection
  const angles = extractBodyAngles(result);
  
  // Extract biomarkers for motion quality analysis
  const biomarkers = extractBiomarkers(result, angles);
  
  // Determine current motion state based on knee angle
  const newMotionState = determineMotionState(angles.kneeAngle);
  
  return {
    result,
    angles,
    biomarkers,
    newMotionState
  };
};
