
import * as Human from '@vladmandic/human';

// Additional biomarkers extracted from pose data
export const extractBiomarkers = (result: Human.Result, angles: any): Record<string, any> => {
  const biomarkers: Record<string, any> = {};
  
  if (!result.body || result.body.length === 0) {
    return biomarkers;
  }
  
  try {
    const body = result.body[0];
    
    // Calculate overall posture score (0-100)
    let postureScore = 100;
    
    // Check neck alignment (ideal is around 0 degrees from vertical)
    if (angles.neckAngle !== null) {
      const neckDeviationFromIdeal = Math.abs(angles.neckAngle - 0);
      postureScore -= neckDeviationFromIdeal * 0.5; // Reduce score based on deviation
    }
    
    // Check shoulder symmetry
    const leftShoulder = body.keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = body.keypoints.find(kp => kp.part === 'rightShoulder');
    if (leftShoulder && rightShoulder) {
      const shoulderHeightDifference = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderHeightNormalized = shoulderHeightDifference / (result.size?.height || 480);
      const shoulderSymmetryScore = 100 - (shoulderHeightNormalized * 1000);
      biomarkers.shoulderSymmetry = Math.max(0, Math.min(100, shoulderSymmetryScore));
      
      // Factor shoulder symmetry into posture score
      postureScore -= (100 - biomarkers.shoulderSymmetry) * 0.2;
    }
    
    // Calculate body balance (how centered the body is)
    const nose = body.keypoints.find(kp => kp.part === 'nose');
    const leftHip = body.keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = body.keypoints.find(kp => kp.part === 'rightHip');
    
    if (nose && leftHip && rightHip) {
      const hipsX = (leftHip.x + rightHip.x) / 2;
      const hipsY = (leftHip.y + rightHip.y) / 2;
      
      const horizontalDeviation = Math.abs(nose.x - hipsX) / (result.size?.width || 640);
      const balanceScore = 100 - (horizontalDeviation * 200);
      biomarkers.balanceScore = Math.max(0, Math.min(100, balanceScore));
      
      // Factor balance into posture score
      postureScore -= (100 - biomarkers.balanceScore) * 0.2;
    }
    
    // Add knee stability (consistency of knee angle during motion)
    if (angles.kneeAngle !== null) {
      // This is a simplified placeholder - in a real app this would track angle over time
      const kneeStability = Math.min(100, Math.max(0, 100 - Math.abs(angles.kneeAngle - 90) * 0.5));
      biomarkers.kneeStability = kneeStability;
    }
    
    // Add hip-to-knee alignment
    if (angles.hipAngle !== null && angles.kneeAngle !== null) {
      // Better alignment if both angles are similar in motion
      const alignmentDiff = Math.abs(angles.hipAngle - angles.kneeAngle);
      const alignmentScore = Math.max(0, 100 - alignmentDiff * 0.5);
      biomarkers.hipKneeAlignment = alignmentScore;
    }
    
    biomarkers.postureScore = Math.max(0, Math.min(100, postureScore));
    
  } catch (e) {
    console.error('Error calculating biomarkers:', e);
  }
  
  return biomarkers;
};

// Alias for backward compatibility
export const calculateBiomarkers = extractBiomarkers;
