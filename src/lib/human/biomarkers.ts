
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
    const leftShoulder = body.keypoints[11];
    const rightShoulder = body.keypoints[12];
    if (leftShoulder && rightShoulder) {
      const shoulderHeightDifference = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderSymmetryScore = 100 - (shoulderHeightDifference * 100);
      biomarkers.shoulderSymmetry = Math.max(0, Math.min(100, shoulderSymmetryScore));
      
      // Factor shoulder symmetry into posture score
      postureScore -= (100 - biomarkers.shoulderSymmetry) * 0.2;
    }
    
    // Calculate body balance (how centered the body is)
    const nose = body.keypoints[0];
    const hips = [(body.keypoints[23].x + body.keypoints[24].x) / 2, 
                  (body.keypoints[23].y + body.keypoints[24].y) / 2];
    
    if (nose) {
      const horizontalDeviation = Math.abs(nose.x - hips[0]);
      const balanceScore = 100 - (horizontalDeviation * 100);
      biomarkers.balanceScore = Math.max(0, Math.min(100, balanceScore));
      
      // Factor balance into posture score
      postureScore -= (100 - biomarkers.balanceScore) * 0.2;
    }
    
    biomarkers.postureScore = Math.max(0, Math.min(100, postureScore));
    
    // Calculate movement fluidity (if temporal data is available)
    // This would require comparing with previous frames
    
  } catch (e) {
    console.error('Error calculating biomarkers:', e);
  }
  
  return biomarkers;
};

// Alias for backward compatibility
export const calculateBiomarkers = extractBiomarkers;
