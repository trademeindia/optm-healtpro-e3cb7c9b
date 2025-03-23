
import * as Human from '@vladmandic/human';
import { human } from '@/lib/human';
import { MotionState } from '@/lib/human/types';
import { extractBodyAngles } from '@/lib/human/angles';
import { extractBiomarkers } from '@/lib/human/biomarkers';

// Perform detection on video frame
export const performDetection = async (video: HTMLVideoElement) => {
  // Check if video is ready
  if (video.readyState !== 4) {
    throw new Error('Video not ready for detection');
  }
  
  try {
    // Perform detection with Human.js
    console.log('Performing human detection on video frame');
    const detectionResult = await human.detect(video);
    
    // Extract angles from detection result
    const extractedAngles = extractBodyAngles(detectionResult);
    
    // Extract biomarkers
    const extractedBiomarkers = extractBiomarkers(detectionResult, extractedAngles);
    
    // Determine motion state based on knee angle
    const kneeAngle = extractedAngles.kneeAngle;
    let newMotionState = MotionState.STANDING;
    
    if (kneeAngle !== null) {
      if (kneeAngle < 100) {
        newMotionState = MotionState.FULL_MOTION;
      } else if (kneeAngle < 150) {
        newMotionState = MotionState.MID_MOTION;
      }
    }
    
    return {
      result: detectionResult,
      angles: extractedAngles,
      biomarkers: extractedBiomarkers,
      newMotionState
    };
  } catch (error) {
    console.error('Error in performDetection:', error);
    throw error;
  }
};

// Check if a body is detected
export const isBodyDetected = (result: Human.Result | null): boolean => {
  if (!result || !result.body || result.body.length === 0) {
    return false;
  }
  
  const body = result.body[0];
  
  // Check if the body has a minimum score
  return body.score !== undefined && body.score > 0.3;
};

// Count detected keypoints with sufficient confidence
export const countDetectedKeypoints = (result: Human.Result | null): number => {
  if (!result || !result.body || result.body.length === 0) {
    return 0;
  }
  
  const body = result.body[0];
  
  if (!body.keypoints) return 0;
  
  return body.keypoints.filter(keypoint => keypoint.score > 0.5).length;
};
