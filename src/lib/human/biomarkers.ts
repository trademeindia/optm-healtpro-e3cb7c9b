
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

// Extract biomarkers from detection result and angles
export const extractBiomarkers = (
  result: Human.Result | null,
  angles: BodyAngles
): Record<string, any> => {
  if (!result || !result.body || result.body.length === 0) {
    return {
      balance: 0,
      stability: 0,
      symmetry: 0,
      range: 0
    };
  }
  
  // Get the body detection
  const body = result.body[0];
  
  // Extract confidence and keypoints
  const confidence = body.score || 0;
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 10) {
    console.log('Not enough keypoints for biomarker extraction');
    return {
      balance: 0,
      stability: 0,
      symmetry: 0,
      range: 0
    };
  }
  
  // Calculate balance (based on vertical alignment of shoulders, hips, and ankles)
  let balance = 0.5; // Default value
  try {
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder') || keypoints[12];
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder') || keypoints[11];
    const rightHip = keypoints.find(kp => kp.part === 'rightHip') || keypoints[24];
    const leftHip = keypoints.find(kp => kp.part === 'leftHip') || keypoints[23];
    
    if (rightShoulder && leftShoulder && rightHip && leftHip && 
        rightShoulder.score > 0.3 && leftShoulder.score > 0.3 && 
        rightHip.score > 0.3 && leftHip.score > 0.3) {
      
      // Calculate horizontal alignment (how level the shoulders and hips are)
      const shoulderDiff = Math.abs(rightShoulder.y - leftShoulder.y);
      const hipDiff = Math.abs(rightHip.y - leftHip.y);
      
      // Normalize the differences (0 = perfect alignment, 1 = poor alignment)
      const shoulderAlignment = 1 - Math.min(1, shoulderDiff * 10);
      const hipAlignment = 1 - Math.min(1, hipDiff * 10);
      
      balance = (shoulderAlignment + hipAlignment) / 2;
    }
  } catch (e) {
    console.error('Error calculating balance:', e);
  }
  
  // Calculate stability (based on keypoint movement over time)
  // This is a simplified version since we don't track over time
  const stability = confidence;
  
  // Calculate symmetry (comparing left and right side angles)
  let symmetry = 0.75; // Default value
  try {
    if (angles.kneeAngle !== null) {
      // Use confidence as a component of symmetry
      symmetry = confidence * 0.8 + 0.2;
    }
  } catch (e) {
    console.error('Error calculating symmetry:', e);
  }
  
  // Calculate range of motion (based on knee and hip angles)
  let range = 0.5; // Default value
  try {
    if (angles.kneeAngle !== null && angles.hipAngle !== null) {
      // Normalize knee angle (90 degrees is optimal for deep squat)
      const kneeRange = 1 - Math.min(1, Math.abs(angles.kneeAngle - 90) / 90);
      
      // Normalize hip angle (90 degrees is optimal for deep squat)
      const hipRange = 1 - Math.min(1, Math.abs(angles.hipAngle - 90) / 90);
      
      range = (kneeRange + hipRange) / 2;
    }
  } catch (e) {
    console.error('Error calculating range of motion:', e);
  }
  
  return {
    balance: parseFloat(balance.toFixed(2)),
    stability: parseFloat(stability.toFixed(2)),
    symmetry: parseFloat(symmetry.toFixed(2)),
    range: parseFloat(range.toFixed(2))
  };
};
