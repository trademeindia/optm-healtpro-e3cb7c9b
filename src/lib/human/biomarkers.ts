
import type { Result } from '@vladmandic/human';
import type { BodyAngles } from './types';

export interface MotionBiomarkers {
  postureScore: number | null;
  movementQuality: number | null;
  rangeOfMotion: number | null;
  stabilityScore: number | null;
  symmetryScore: number | null;
  balanceScore: number | null;
}

// Extract biomarkers from detection result and angles
export const extractBiomarkers = (result: Result, angles: BodyAngles): MotionBiomarkers => {
  // Initialize with null values
  const biomarkers: MotionBiomarkers = {
    postureScore: null,
    movementQuality: null,
    rangeOfMotion: null,
    stabilityScore: null,
    symmetryScore: null,
    balanceScore: null
  };
  
  // If no valid detection, return empty biomarkers
  if (!result.body || result.body.length === 0 || !result.body[0].keypoints) {
    return biomarkers;
  }
  
  const { kneeAngle, hipAngle, shoulderAngle } = angles;
  
  // Calculate posture score based on alignment between hips and shoulders
  if (hipAngle !== null && shoulderAngle !== null) {
    // For good posture, the hip and shoulder should be properly aligned
    // A value close to 180 for both generally indicates better alignment
    const hipPosture = hipAngle > 160 ? 100 : hipAngle > 130 ? 80 : 60;
    const shoulderPosture = shoulderAngle > 160 ? 100 : shoulderAngle > 130 ? 80 : 60;
    
    biomarkers.postureScore = Math.round((hipPosture + shoulderPosture) / 2);
  }
  
  // Calculate range of motion based on knee angle
  if (kneeAngle !== null) {
    // For squats, lower knee angle indicates better range of motion
    // Full range would be around 90 degrees or less
    if (kneeAngle < 90) {
      biomarkers.rangeOfMotion = 100; // Excellent range
    } else if (kneeAngle < 110) {
      biomarkers.rangeOfMotion = 80; // Good range
    } else if (kneeAngle < 130) {
      biomarkers.rangeOfMotion = 60; // Moderate range
    } else {
      biomarkers.rangeOfMotion = 40; // Limited range
    }
  }
  
  // Calculate movement quality as a composite score
  if (biomarkers.postureScore !== null && biomarkers.rangeOfMotion !== null) {
    biomarkers.movementQuality = Math.round(
      (biomarkers.postureScore * 0.6) + (biomarkers.rangeOfMotion * 0.4)
    );
  }
  
  // Calculate stability score based on keypoint movement variance
  if (result.body[0].score) {
    // Higher detection confidence usually indicates less movement/shaking
    const confidence = result.body[0].score;
    biomarkers.stabilityScore = Math.round(confidence * 100);
  }
  
  // Calculate symmetry score (simplified version)
  const keypoints = result.body[0].keypoints;
  const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
  const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
  
  if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
    // Check if shoulders are at similar height (y-coordinate)
    const heightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const widthRef = Math.abs(leftShoulder.x - rightShoulder.x); // Reference for normalization
    
    if (widthRef > 0) {
      const symmetryRatio = Math.min(heightDiff / widthRef, 1.0);
      biomarkers.symmetryScore = Math.round((1 - symmetryRatio) * 100);
    }
  }
  
  // Calculate balance score
  const keyPointsLowerBody = keypoints.filter(kp => 
    ['leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'].includes(kp.part)
  );
  
  if (keyPointsLowerBody.length >= 4) {
    // Calculate average confidence of lower body keypoints as a proxy for balance
    const avgConfidence = keyPointsLowerBody.reduce((sum, kp) => sum + kp.score, 0) / keyPointsLowerBody.length;
    biomarkers.balanceScore = Math.round(avgConfidence * 100);
  }
  
  return biomarkers;
};
