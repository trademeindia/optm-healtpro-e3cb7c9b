
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { BodyAngles, MotionState } from '@/lib/human/types';
import { determineMotionState } from './motionStateUtils';

/**
 * Performs pose detection on a video element
 */
export const performDetection = async (video: HTMLVideoElement) => {
  const detectionResult = await human.detect(video);
  
  // Extract angles and biomarkers (simplified for demo)
  const extractedAngles = {
    kneeAngle: 170,
    hipAngle: 160,
    shoulderAngle: 180,
    elbowAngle: 170,
    ankleAngle: 90,
    neckAngle: 160
  };
  
  const extractedBiomarkers = {
    balance: 0.85,
    stability: 0.9,
    symmetry: 0.8
  };
  
  // Determine motion state based on knee angle
  const newMotionState = determineMotionState(extractedAngles);
  
  return {
    result: detectionResult,
    angles: extractedAngles,
    biomarkers: extractedBiomarkers,
    newMotionState
  };
};
