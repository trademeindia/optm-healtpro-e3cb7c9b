
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { BodyAngles, MotionState } from '@/lib/human/types';
import { determineMotionState } from './motionStateUtils';

/**
 * Performs pose detection on a video element
 */
export const performDetection = async (video: HTMLVideoElement) => {
  try {
    const detectionResult = await human.detect(video);
    
    // Extract angles from detection result
    const extractedAngles = calculateBodyAngles(detectionResult);
    
    // Calculate biomarkers based on pose data
    const extractedBiomarkers = calculateBiomarkers(detectionResult);
    
    // Determine motion state based on body angles
    const newMotionState = determineMotionState(extractedAngles);
    
    return {
      result: detectionResult,
      angles: extractedAngles,
      biomarkers: extractedBiomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error during detection:', error);
    // Return default values on error
    return {
      result: null,
      angles: getDefaultAngles(),
      biomarkers: getDefaultBiomarkers(),
      newMotionState: MotionState.STANDING
    };
  }
};

/**
 * Calculate body angles from detection result
 */
const calculateBodyAngles = (result: Human.Result): BodyAngles => {
  if (!result || !result.body || result.body.length === 0) {
    return getDefaultAngles();
  }
  
  // Get the first detected body
  const body = result.body[0];
  
  // For demonstration/testing, we're using simulated values
  // In a real implementation, calculate these from keypoints
  const kneeAngle = Math.random() > 0.7 ? 100 + Math.random() * 80 : 170;
  const hipAngle = kneeAngle < 150 ? 120 + Math.random() * 50 : 170;
  
  return {
    kneeAngle,
    hipAngle,
    shoulderAngle: 160 + Math.random() * 30,
    elbowAngle: 150 + Math.random() * 40,
    ankleAngle: 80 + Math.random() * 20,
    neckAngle: 150 + Math.random() * 20
  };
};

/**
 * Calculate biomarkers based on pose data
 */
const calculateBiomarkers = (result: Human.Result) => {
  // In a real implementation, calculate these from actual pose data
  return {
    balance: 0.7 + Math.random() * 0.3,
    stability: 0.75 + Math.random() * 0.25,
    symmetry: 0.8 + Math.random() * 0.2
  };
};

/**
 * Get default angles when no detection is available
 */
const getDefaultAngles = (): BodyAngles => {
  return {
    kneeAngle: 170,
    hipAngle: 160,
    shoulderAngle: 180,
    elbowAngle: 170,
    ankleAngle: 90,
    neckAngle: 160
  };
};

/**
 * Get default biomarkers when no detection is available
 */
const getDefaultBiomarkers = () => {
  return {
    balance: 0.85,
    stability: 0.9,
    symmetry: 0.8
  };
};
