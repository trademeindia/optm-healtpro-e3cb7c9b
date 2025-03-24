
import type { Result } from '@vladmandic/human';
import { BodyAngles } from './types';

/**
 * Extract biomechanical markers from detection result
 */
export const extractBiomarkers = (result: Result, angles: BodyAngles) => {
  // Initialize biomarkers
  const biomarkers: Record<string, number | null> = {
    postureScore: null,
    balance: null,
    stability: null,
    symmetry: null,
    movementQuality: null,
    rangeOfMotion: null,
    stabilityScore: null
  };
  
  // Check if there's a valid body detection
  if (!result || !result.body || result.body.length === 0) {
    return biomarkers;
  }
  
  // Posture score (based on hip and shoulder alignment)
  if (angles.hipAngle !== null && angles.shoulderAngle !== null) {
    // Ideal posture has good alignment between hip and shoulder
    const posturalAlignment = 100 - Math.abs(angles.hipAngle - angles.shoulderAngle);
    biomarkers.postureScore = Math.min(100, Math.max(0, posturalAlignment));
  }
  
  // Range of motion (based on knee angle)
  if (angles.kneeAngle !== null) {
    // For knee flexion, lower angle means better range of motion (for exercises like squats)
    // A 90-degree knee bend is considered good for most exercises
    const kneeFlexion = angles.kneeAngle;
    if (kneeFlexion <= 90) {
      biomarkers.rangeOfMotion = 100; // Full range of motion
    } else if (kneeFlexion >= 170) {
      biomarkers.rangeOfMotion = 0; // Minimal range of motion
    } else {
      // Scale between 90 and 170 degrees
      biomarkers.rangeOfMotion = 100 - ((kneeFlexion - 90) / 80) * 100;
    }
  }
  
  // Movement quality (composite score of posture and range of motion)
  if (biomarkers.postureScore !== null && biomarkers.rangeOfMotion !== null) {
    biomarkers.movementQuality = (biomarkers.postureScore + biomarkers.rangeOfMotion) / 2;
  }
  
  // Stability score (based on keypoint jitter/movement consistency)
  // For simplicity, we're using a placeholder value
  // In a real implementation, this would track keypoint stability over time
  biomarkers.stabilityScore = 85;
  
  // Balance (based on left-right symmetry)
  // For simplicity, using a placeholder
  biomarkers.balance = 90;
  
  // Symmetry (left-right body symmetry)
  // For simplicity, using a placeholder
  biomarkers.symmetry = 85;
  
  return biomarkers;
};
