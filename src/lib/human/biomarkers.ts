
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts biomechanical metrics from pose detection results
 */
export const extractBiomarkers = (
  result: Human.Result | null,
  angles: BodyAngles
): Record<string, any> => {
  if (!result || !result.body || result.body.length === 0) {
    return {
      balance: null,
      stability: null,
      symmetry: null,
      rangeOfMotion: null,
      posture: null
    };
  }

  const body = result.body[0];
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length === 0) {
    return {
      balance: null,
      stability: null,
      symmetry: null,
      rangeOfMotion: null,
      posture: null
    };
  }

  // Calculate balance score based on hip and shoulder alignment
  let balance = calculateBalance(keypoints);
  
  // Calculate stability based on movement consistency
  let stability = calculateStability(keypoints, angles);
  
  // Calculate symmetry between left and right sides
  let symmetry = calculateSymmetry(keypoints, angles);
  
  // Calculate range of motion based on joint angles
  let rangeOfMotion = calculateRangeOfMotion(angles);
  
  // Calculate posture score based on spine alignment
  let posture = calculatePosture(keypoints, angles);

  return {
    balance,
    stability,
    symmetry,
    rangeOfMotion,
    posture
  };
};

// Helper function to calculate balance score
const calculateBalance = (keypoints: any[]): number | null => {
  try {
    // Find hip and shoulder keypoints
    const leftHip = keypoints.find(kp => kp.part === 'leftHip' || kp.name === 'leftHip');
    const rightHip = keypoints.find(kp => kp.part === 'rightHip' || kp.name === 'rightHip');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder' || kp.name === 'leftShoulder');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder' || kp.name === 'rightShoulder');
    
    if (!leftHip || !rightHip || !leftShoulder || !rightShoulder) {
      return null;
    }
    
    // Calculate hip and shoulder alignment
    const hipAlignment = Math.abs(leftHip.y - rightHip.y);
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Normalize by image height (assuming y values are between 0-1)
    const alignmentScore = 1 - ((hipAlignment + shoulderAlignment) / 2);
    
    // Scale to 0-1 range
    return Math.max(0, Math.min(1, alignmentScore));
  } catch (err) {
    console.error('Error calculating balance:', err);
    return null;
  }
};

// Helper function to calculate stability
const calculateStability = (keypoints: any[], angles: BodyAngles): number | null => {
  try {
    // For simplicity, we'll use static score initially
    // In a real implementation, this would track variance over time
    const kneeStability = angles.kneeAngle ? Math.min(1, Math.max(0, 1 - Math.abs((angles.kneeAngle - 90) / 90))) : 0;
    const hipStability = angles.hipAngle ? Math.min(1, Math.max(0, 1 - Math.abs((angles.hipAngle - 90) / 90))) : 0;
    
    // Average stability score
    const stabilityScore = (kneeStability + hipStability) / 2;
    return stabilityScore;
  } catch (err) {
    console.error('Error calculating stability:', err);
    return null;
  }
};

// Helper function to calculate symmetry
const calculateSymmetry = (keypoints: any[], angles: BodyAngles): number | null => {
  try {
    // In a real implementation, this would compare left vs right side angles
    // For now, return a placeholder value
    return 0.85;
  } catch (err) {
    console.error('Error calculating symmetry:', err);
    return null;
  }
};

// Helper function to calculate range of motion
const calculateRangeOfMotion = (angles: BodyAngles): number | null => {
  try {
    // Calculate score based on knee and hip angles
    const kneeROM = angles.kneeAngle ? Math.min(1, angles.kneeAngle / 90) : 0;
    const hipROM = angles.hipAngle ? Math.min(1, angles.hipAngle / 90) : 0;
    
    const romScore = (kneeROM + hipROM) / 2;
    return romScore;
  } catch (err) {
    console.error('Error calculating range of motion:', err);
    return null;
  }
};

// Helper function to calculate posture
const calculatePosture = (keypoints: any[], angles: BodyAngles): number | null => {
  try {
    // Use neck angle as main indicator of posture
    const postureScore = angles.neckAngle ? Math.min(1, Math.max(0, angles.neckAngle / 180)) : 0;
    return postureScore;
  } catch (err) {
    console.error('Error calculating posture:', err);
    return null;
  }
};
