
import * as Human from '@vladmandic/human';
import { BodyAngles } from './types';

/**
 * Extracts biomechanical markers from pose data
 */
export const extractBiomarkers = (
  result: Human.Result | null,
  angles: BodyAngles
): Record<string, number> => {
  if (!result || !result.body || result.body.length === 0) {
    return {
      postureScore: 0,
      balanceScore: 0,
      shoulderSymmetry: 0,
      kneeStability: 0
    };
  }
  
  // Extract body data
  const body = result.body[0];
  const confidence = body.score || 0;
  
  // Calculate biomarkers
  
  // Posture score based on shoulder, hip, and knee alignment
  const postureScore = calculatePostureScore(angles);
  
  // Balance score based on body center and distribution
  const balanceScore = calculateBalanceScore(result);
  
  // Shoulder symmetry
  const shoulderSymmetry = calculateShoulderSymmetry(result);
  
  // Knee stability
  const kneeStability = calculateKneeStability(result, angles);
  
  return {
    postureScore,
    balanceScore,
    shoulderSymmetry,
    kneeStability,
    confidence: confidence * 100
  };
};

// Calculate posture score based on ideal alignment
const calculatePostureScore = (angles: BodyAngles): number => {
  let score = 80; // Start with a default score
  
  // Penalize for knee angles far from ideal during squats (around 90 degrees at bottom)
  if (angles.kneeAngle !== null) {
    // For squats, ideal knee angle at bottom is around 90 degrees
    // Higher scores for angles closer to 90 when in full squat
    // If standing (around 170+), don't penalize
    if (angles.kneeAngle < 170 && angles.kneeAngle > 70) {
      const kneeDiff = Math.abs(angles.kneeAngle - 90);
      score -= Math.min(20, kneeDiff * 0.5); // Penalize up to 20 points
    }
  }
  
  // Penalize for hip angle issues (should be around 90-110 at bottom of squat)
  if (angles.hipAngle !== null) {
    const hipDiff = Math.abs(angles.hipAngle - 100);
    score -= Math.min(15, hipDiff * 0.3); // Penalize up to 15 points
  }
  
  // Penalize for shoulder angle issues
  if (angles.shoulderAngle !== null) {
    // Shoulders should be relatively straight in most exercises
    const shoulderDiff = Math.abs(angles.shoulderAngle - 180);
    score -= Math.min(10, shoulderDiff * 0.2); // Penalize up to 10 points
  }
  
  return Math.max(0, Math.min(100, score));
};

// Calculate balance score
const calculateBalanceScore = (result: Human.Result): number => {
  // Simple placeholder implementation
  // In a real implementation, this would analyze center of gravity
  return 85; // Default value for demo
};

// Calculate shoulder symmetry
const calculateShoulderSymmetry = (result: Human.Result): number => {
  // Simple placeholder implementation
  // In a real implementation, this would compare left/right shoulder positions
  return 90; // Default value for demo
};

// Calculate knee stability
const calculateKneeStability = (result: Human.Result, angles: BodyAngles): number => {
  // Simple placeholder implementation
  // In a real implementation, this would analyze knee tracking over ankles
  if (angles.kneeAngle !== null && angles.kneeAngle < 150) {
    // If knees are bent, slightly reduce stability score
    return 80;
  }
  return 95; // Default value when standing
};
