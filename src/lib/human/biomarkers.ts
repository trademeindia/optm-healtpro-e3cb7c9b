
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts key biomarkers from Human.js detection results and angle calculations
 */
export const extractBiomarkers = (
  result: Human.Result | null,
  angles: BodyAngles
): Record<string, any> => {
  if (!result || !result.body || result.body.length === 0) {
    return {};
  }
  
  const body = result.body[0];
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 15) {
    return {};
  }
  
  try {
    // Create basic biomarkers based on available data
    const biomarkers: Record<string, any> = {
      // Body position metrics
      bodyPosture: calculatePostureSymmetry(keypoints),
      balanceScore: calculateBalanceScore(keypoints),
      
      // Joint metrics based on angles
      kneeFlexion: angles.kneeAngle !== null 
        ? calculateKneeFlexionQuality(angles.kneeAngle) 
        : null,
      hipHinge: angles.hipAngle !== null 
        ? calculateHipHingeQuality(angles.hipAngle) 
        : null,
      shoulderStability: angles.shoulderAngle !== null 
        ? calculateShoulderStability(angles.shoulderAngle) 
        : null,
        
      // Dynamic measures
      bodyAlignment: calculateBodyAlignment(keypoints),
      
      // Additional metadata
      confidenceScore: body.score,
      keypointsDetected: keypoints.filter(kp => kp.score > 0.3).length,
      detectionTimestamp: Date.now()
    };
    
    return biomarkers;
  } catch (error) {
    console.error('Error extracting biomarkers:', error);
    return {
      error: 'Failed to extract biomarkers',
      keypointsDetected: keypoints.filter(kp => kp.score > 0.3).length,
      confidenceScore: body.score
    };
  }
};

// Calculate posture symmetry (0-100%)
function calculatePostureSymmetry(keypoints: any[]): number | null {
  try {
    // Find matching left/right keypoints
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    
    // If we don't have enough points, return null
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return null;
    }
    
    // Calculate shoulder height difference (normalized)
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Calculate hip height difference (normalized)
    const hipDiff = Math.abs(leftHip.y - rightHip.y);
    
    // Calculate average difference and convert to symmetry score (0-100)
    const avgDiff = (shoulderDiff + hipDiff) / 2;
    const symmetryScore = Math.max(0, 100 - (avgDiff * 1000));
    
    return Math.min(100, symmetryScore);
  } catch (error) {
    return null;
  }
}

// Calculate balance score (0-100%)
function calculateBalanceScore(keypoints: any[]): number | null {
  try {
    // Find ankle and hip keypoints
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    
    if (!leftAnkle || !rightAnkle || !leftHip || !rightHip) {
      return null;
    }
    
    // Calculate midpoints
    const ankleMidX = (leftAnkle.x + rightAnkle.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    
    // Calculate horizontal offset (normalized)
    const horizontalOffset = Math.abs(ankleMidX - hipMidX);
    
    // Convert to balance score (0-100)
    const balanceScore = Math.max(0, 100 - (horizontalOffset * 1000));
    
    return Math.min(100, balanceScore);
  } catch (error) {
    return null;
  }
}

// Evaluate knee flexion quality (0-100%)
function calculateKneeFlexionQuality(kneeAngle: number): number {
  // Optimal knee angle for most exercises is around 90-120 degrees
  if (kneeAngle < 90) {
    // Too much flexion
    return Math.max(0, 50 + ((kneeAngle - 60) / 30) * 50);
  } else if (kneeAngle > 120) {
    // Not enough flexion
    return Math.max(0, 100 - ((kneeAngle - 120) / 60) * 100);
  } else {
    // Optimal range
    const distanceFromOptimal = Math.abs(kneeAngle - 105);
    return 100 - (distanceFromOptimal / 15) * 20;
  }
}

// Evaluate hip hinge quality (0-100%)
function calculateHipHingeQuality(hipAngle: number): number {
  // Optimal hip angle depends on exercise, around 90-110 for squat
  if (hipAngle < 90) {
    // Too much flexion
    return Math.max(0, 50 + ((hipAngle - 60) / 30) * 50);
  } else if (hipAngle > 110) {
    // Not enough flexion
    return Math.max(0, 100 - ((hipAngle - 110) / 70) * 100);
  } else {
    // Optimal range
    const distanceFromOptimal = Math.abs(hipAngle - 100);
    return 100 - (distanceFromOptimal / 10) * 20;
  }
}

// Evaluate shoulder stability (0-100%)
function calculateShoulderStability(shoulderAngle: number): number {
  // For most exercises, shoulders should be roughly at 180 degrees (straight)
  const deviation = Math.abs(180 - shoulderAngle);
  return Math.max(0, 100 - (deviation / 30) * 100);
}

// Calculate overall body alignment (0-100%)
function calculateBodyAlignment(keypoints: any[]): number | null {
  try {
    // Find key points for alignment
    const nose = keypoints.find(kp => kp.part === 'nose');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    
    if (!nose || !leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      return null;
    }
    
    // Calculate midpoints 
    const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    const ankleMidX = (leftAnkle.x + rightAnkle.x) / 2;
    
    // Calculate vertical alignment deviations
    const shoulderDeviation = Math.abs(nose.x - shoulderMidX);
    const hipDeviation = Math.abs(shoulderMidX - hipMidX);
    const ankleDeviation = Math.abs(hipMidX - ankleMidX);
    
    // Calculate overall deviation (normalized)
    const totalDeviation = (shoulderDeviation + hipDeviation + ankleDeviation) / 3;
    
    // Convert to alignment score (0-100)
    const alignmentScore = Math.max(0, 100 - (totalDeviation * 1000));
    
    return Math.min(100, alignmentScore);
  } catch (error) {
    return null;
  }
}
