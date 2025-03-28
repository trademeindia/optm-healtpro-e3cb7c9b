
import { MotionBiomarkers, BodyAngles } from './types';

/**
 * Extracts motion biomarkers from a detection result and angles
 */
export const extractBiomarkers = (result: any, angles: BodyAngles): MotionBiomarkers => {
  const biomarkers: MotionBiomarkers = {
    postureScore: null,
    movementQuality: null,
    rangeOfMotion: null,
    stabilityScore: null,
    symmetry: null,
    balance: null
  };
  
  try {
    // Make sure we have body detection results
    if (!result.body || result.body.length === 0) {
      return biomarkers;
    }
    
    // Basic posture score - based on alignment of hip and shoulder
    if (angles.hipAngle !== null && angles.shoulderAngle !== null) {
      biomarkers.postureScore = calculatePostureScore(angles.hipAngle, angles.shoulderAngle);
    }
    
    // Range of motion - based on knee angle (lower is better for squats)
    if (angles.kneeAngle !== null) {
      biomarkers.rangeOfMotion = calculateRangeOfMotion(angles.kneeAngle);
    }
    
    // Stability score - based on consistency of movement
    if (result.body[0].score) {
      biomarkers.stabilityScore = Math.round(result.body[0].score * 100);
    }
    
    // Movement quality - combined score of posture, ROM, and stability
    if (biomarkers.postureScore !== null && 
        biomarkers.rangeOfMotion !== null && 
        biomarkers.stabilityScore !== null) {
      biomarkers.movementQuality = calculateMovementQuality(
        biomarkers.postureScore,
        biomarkers.rangeOfMotion,
        biomarkers.stabilityScore
      );
    }
    
    // Symmetry - comparison between left and right side (simplified)
    biomarkers.symmetry = 75; // Placeholder - would require comparing left/right keypoints
    
    // Balance - based on center of mass calculation (simplified)
    biomarkers.balance = 80; // Placeholder - would require calculation of center of mass
    
  } catch (error) {
    console.error('Error extracting biomarkers:', error);
  }
  
  return biomarkers;
};

/**
 * Calculate posture score based on hip and shoulder angles
 */
const calculatePostureScore = (hipAngle: number, shoulderAngle: number): number => {
  // For good posture in a squat:
  // - Hip angle should be around 120-170 degrees (avoids excessive leaning)
  // - Shoulder angle should be around 140-180 degrees (maintains upright torso)
  
  let hipScore = 0;
  if (hipAngle > 160) hipScore = 100;
  else if (hipAngle > 140) hipScore = 90;
  else if (hipAngle > 120) hipScore = 70;
  else if (hipAngle > 100) hipScore = 50;
  else hipScore = 30;
  
  let shoulderScore = 0;
  if (shoulderAngle > 160) shoulderScore = 100;
  else if (shoulderAngle > 140) shoulderScore = 80;
  else if (shoulderAngle > 120) shoulderScore = 60;
  else shoulderScore = 40;
  
  // Weighted average (shoulder alignment is more important for posture)
  return Math.round((hipScore * 0.4) + (shoulderScore * 0.6));
};

/**
 * Calculate range of motion score based on knee angle
 */
const calculateRangeOfMotion = (kneeAngle: number): number => {
  // For squats, deeper knee bend (smaller angle) indicates better ROM
  if (kneeAngle < 90) return 100; // Excellent ROM
  if (kneeAngle < 100) return 90;
  if (kneeAngle < 120) return 70;
  if (kneeAngle < 140) return 50;
  if (kneeAngle < 160) return 30;
  return 10; // Very limited ROM
};

/**
 * Calculate overall movement quality score
 */
const calculateMovementQuality = (postureScore: number, romScore: number, stabilityScore: number): number => {
  // Weighted average of component scores
  return Math.round((postureScore * 0.4) + (romScore * 0.4) + (stabilityScore * 0.2));
};
