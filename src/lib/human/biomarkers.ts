
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts key biomarkers from Human.js detection results and angle calculations
 * with improved accuracy and detailed metrics for healthcare applications
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
    // Create comprehensive biomarkers with detailed health metrics
    const biomarkers: Record<string, any> = {
      // Core body metrics
      bodyPosture: calculatePostureSymmetry(keypoints),
      balanceScore: calculateBalanceScore(keypoints),
      stabilityIndex: calculateStabilityIndex(keypoints),
      
      // Joint-specific metrics based on angles
      kneeFlexion: angles.kneeAngle !== null 
        ? calculateKneeFlexionQuality(angles.kneeAngle) 
        : null,
      hipHinge: angles.hipAngle !== null 
        ? calculateHipHingeQuality(angles.hipAngle) 
        : null,
      shoulderMobility: angles.shoulderAngle !== null 
        ? calculateShoulderStability(angles.shoulderAngle) 
        : null,
      elbowExtension: angles.elbowAngle !== null
        ? calculateElbowExtensionQuality(angles.elbowAngle)
        : null,
      ankleRange: angles.ankleAngle !== null
        ? calculateAnkleRangeQuality(angles.ankleAngle)
        : null,
      neckAlignment: angles.neckAngle !== null
        ? calculateNeckAlignmentQuality(angles.neckAngle)
        : null,
        
      // Movement dynamics metrics
      bodyAlignment: calculateBodyAlignment(keypoints),
      weightDistribution: calculateWeightDistribution(keypoints),
      movementSymmetry: calculateMovementSymmetry(keypoints, angles),
      
      // Healthcare-specific risk indicators
      jointStressIndex: calculateJointStressIndex(angles),
      injuryRiskScore: calculateInjuryRiskScore(angles, keypoints),
      
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
    const nose = keypoints.find(kp => kp.part === 'nose');
    
    if (!leftAnkle || !rightAnkle || !leftHip || !rightHip || !nose) {
      return null;
    }
    
    // Calculate midpoints
    const ankleMidX = (leftAnkle.x + rightAnkle.x) / 2;
    const hipMidX = (leftHip.x + rightHip.x) / 2;
    
    // Calculate horizontal offset (normalized)
    const horizontalOffset = Math.abs(ankleMidX - hipMidX);
    
    // Calculate vertical alignment - nose should be aligned with ankles
    const verticalOffset = Math.abs(nose.x - ankleMidX);
    
    // Combined score with more weight on vertical alignment
    const combinedOffset = (horizontalOffset * 0.4) + (verticalOffset * 0.6);
    
    // Convert to balance score (0-100)
    const balanceScore = Math.max(0, 100 - (combinedOffset * 1000));
    
    return Math.min(100, balanceScore);
  } catch (error) {
    return null;
  }
}

// Calculate stability index (0-100)
function calculateStabilityIndex(keypoints: any[]): number | null {
  try {
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    
    if (!leftAnkle || !rightAnkle || !leftKnee || !rightKnee || !leftHip || !rightHip) {
      return null;
    }
    
    // Calculate alignment of joints
    const leftLegAlignment = Math.abs((leftAnkle.x - leftKnee.x) - (leftKnee.x - leftHip.x));
    const rightLegAlignment = Math.abs((rightAnkle.x - rightKnee.x) - (rightKnee.x - rightHip.x));
    
    // Average alignment
    const avgAlignment = (leftLegAlignment + rightLegAlignment) / 2;
    
    // Convert to stability score (0-100)
    const stabilityScore = Math.max(0, 100 - (avgAlignment * 1000));
    
    return Math.min(100, stabilityScore);
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

// Evaluate elbow extension quality (0-100%)
function calculateElbowExtensionQuality(elbowAngle: number): number {
  // Optimal elbow angle depends on exercise
  // For standing posture, closer to 180 is better (straight arm)
  const deviation = Math.abs(180 - elbowAngle);
  return Math.max(0, 100 - (deviation / 45) * 100);
}

// Evaluate ankle range quality (0-100%)
function calculateAnkleRangeQuality(ankleAngle: number): number {
  // Optimal ankle angle during squats is around 80-100 degrees
  if (ankleAngle < 80) {
    return Math.max(0, 50 + ((ankleAngle - 60) / 20) * 50);
  } else if (ankleAngle > 100) {
    return Math.max(0, 100 - ((ankleAngle - 100) / 20) * 50);
  } else {
    // Optimal range
    const distanceFromOptimal = Math.abs(ankleAngle - 90);
    return 100 - (distanceFromOptimal / 10) * 20;
  }
}

// Evaluate neck alignment quality (0-100%)
function calculateNeckAlignmentQuality(neckAngle: number): number {
  // Optimal neck angle is typically around 160-180 degrees (neutral position)
  if (neckAngle < 160) {
    // Head too far forward
    return Math.max(0, 50 + ((neckAngle - 140) / 20) * 50);
  } else {
    // Good to optimal range
    const distanceFromOptimal = Math.abs(neckAngle - 170);
    return 100 - (distanceFromOptimal / 10) * 20;
  }
}

// Calculate body alignment (0-100%)
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

// Calculate weight distribution across feet (0-100%, where 100% is perfectly balanced)
function calculateWeightDistribution(keypoints: any[]): number | null {
  try {
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const nose = keypoints.find(kp => kp.part === 'nose');
    
    if (!leftAnkle || !rightAnkle || !nose) {
      return null;
    }
    
    // Calculate ankle midpoint
    const ankleMidX = (leftAnkle.x + rightAnkle.x) / 2;
    
    // Calculate horizontal distance from nose to ankle midpoint
    const deviation = Math.abs(nose.x - ankleMidX);
    
    // Calculate ankle width (distance between ankles)
    const ankleWidth = Math.abs(rightAnkle.x - leftAnkle.x);
    
    // Normalize deviation by ankle width
    const normalizedDeviation = ankleWidth > 0 ? deviation / ankleWidth : 0;
    
    // Convert to score (0-100)
    const weightDistributionScore = Math.max(0, 100 - (normalizedDeviation * 200));
    
    return Math.min(100, weightDistributionScore);
  } catch (error) {
    return null;
  }
}

// Calculate movement symmetry between left and right sides (0-100%)
function calculateMovementSymmetry(keypoints: any[], angles: BodyAngles): number | null {
  try {
    // If no keypoints or angles, return null
    if (!keypoints || keypoints.length === 0 || !angles) {
      return null;
    }
    
    // Find key points for symmetry calculation
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    
    if (!leftKnee || !rightKnee || !leftHip || !rightHip || !leftShoulder || !rightShoulder) {
      return null;
    }
    
    // Calculate vertical position differences
    const kneeVerticalDiff = Math.abs(leftKnee.y - rightKnee.y);
    const hipVerticalDiff = Math.abs(leftHip.y - rightHip.y);
    const shoulderVerticalDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Calculate average vertical difference
    const avgVerticalDiff = (kneeVerticalDiff + hipVerticalDiff + shoulderVerticalDiff) / 3;
    
    // Convert to symmetry score (0-100)
    const symmetryScore = Math.max(0, 100 - (avgVerticalDiff * 1000));
    
    return Math.min(100, symmetryScore);
  } catch (error) {
    return null;
  }
}

// Calculate joint stress index (0-100, where lower is better)
function calculateJointStressIndex(angles: BodyAngles): number | null {
  if (!angles) return null;
  
  try {
    let stressFactors = [];
    let weightFactors = [];
    
    // Knee stress factor (more stress at extreme angles)
    if (angles.kneeAngle !== null) {
      // Higher stress when knee is deeply bent or hyperextended
      const kneeStress = angles.kneeAngle < 90 
        ? 100 - (angles.kneeAngle - 40) * 2 
        : angles.kneeAngle > 170 
          ? (angles.kneeAngle - 170) * 3 
          : 0;
      stressFactors.push(Math.min(100, Math.max(0, kneeStress)));
      weightFactors.push(0.35); // Knee stress is weighted highly
    }
    
    // Hip stress factor
    if (angles.hipAngle !== null) {
      const hipStress = angles.hipAngle < 80 
        ? 80 - angles.hipAngle 
        : 0;
      stressFactors.push(Math.min(100, Math.max(0, hipStress)));
      weightFactors.push(0.25);
    }
    
    // Shoulder stress factor
    if (angles.shoulderAngle !== null) {
      const shoulderStress = Math.abs(angles.shoulderAngle - 180) > 45 
        ? Math.abs(angles.shoulderAngle - 180) - 45 
        : 0;
      stressFactors.push(Math.min(100, Math.max(0, shoulderStress)));
      weightFactors.push(0.2);
    }
    
    // Neck stress factor
    if (angles.neckAngle !== null) {
      const neckStress = Math.abs(angles.neckAngle - 170) > 15 
        ? (Math.abs(angles.neckAngle - 170) - 15) * 3 
        : 0;
      stressFactors.push(Math.min(100, Math.max(0, neckStress)));
      weightFactors.push(0.2);
    }
    
    // If we don't have enough data points, return null
    if (stressFactors.length === 0) return null;
    
    // Calculate weighted average stress
    let totalWeight = 0;
    let weightedSum = 0;
    
    for (let i = 0; i < stressFactors.length; i++) {
      weightedSum += stressFactors[i] * weightFactors[i];
      totalWeight += weightFactors[i];
    }
    
    // Return overall stress index (0-100)
    return Math.round(weightedSum / totalWeight);
  } catch (error) {
    return null;
  }
}

// Calculate injury risk score (0-100, where lower is better)
function calculateInjuryRiskScore(angles: BodyAngles, keypoints: any[]): number | null {
  if (!angles || !keypoints) return null;
  
  try {
    // Start with joint stress as a base factor
    const jointStress = calculateJointStressIndex(angles);
    if (jointStress === null) return null;
    
    // Calculate alignment factor
    const alignment = calculateBodyAlignment(keypoints);
    const alignmentFactor = alignment !== null ? (100 - alignment) * 0.5 : 30; // Default to medium risk if unknown
    
    // Calculate balance factor
    const balance = calculateBalanceScore(keypoints);
    const balanceFactor = balance !== null ? (100 - balance) * 0.3 : 20; // Default to medium risk if unknown
    
    // Weight the factors (joint stress is most important)
    const weightedRisk = (jointStress * 0.6) + alignmentFactor + balanceFactor;
    
    // Return overall injury risk (0-100)
    return Math.min(100, Math.max(0, Math.round(weightedRisk)));
  } catch (error) {
    return null;
  }
}
