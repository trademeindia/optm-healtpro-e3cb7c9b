
import * as Human from '@vladmandic/human';

// Helper function for calculating angle between three points
export const calculateAngle = (
  a: [number, number], 
  b: [number, number], 
  c: [number, number]
): number => {
  const ab = [b[0] - a[0], b[1] - a[1]];
  const cb = [b[0] - c[0], b[1] - c[1]];
  
  const dot = (ab[0] * cb[0] + ab[1] * cb[1]);
  const cross = (ab[0] * cb[1] - ab[1] * cb[0]);
  
  let angle = Math.atan2(cross, dot);
  
  // Convert to degrees and ensure positive value
  angle = Math.abs(angle * 180 / Math.PI);
  
  // Ensure angle is in [0, 180] range for human-readable angles
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Get valid keypoint or return null
const getValidKeypoint = (keypoints: any[], index: number): [number, number] | null => {
  if (!keypoints || !keypoints[index] || !keypoints[index].score || keypoints[index].score < 0.3) {
    return null;
  }
  
  const kp = keypoints[index];
  
  // Ensure keypoint has valid coordinates
  if (isNaN(kp.x) || isNaN(kp.y) || kp.x < 0 || kp.y < 0 || kp.x > 1 || kp.y > 1) {
    return null;
  }
  
  return [kp.x, kp.y];
};

// Extract angles from detected body pose with improved error handling
export const extractBodyAngles = (result: Human.Result): { 
  kneeAngle: number | null;
  hipAngle: number | null; 
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
} => {
  const angles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  if (!result.body || result.body.length === 0) {
    console.log('No body detected for angle calculation');
    return angles;
  }
  
  const body = result.body[0];
  
  // Log the first few keypoints to debug
  if (body.keypoints && body.keypoints.length > 0) {
    console.log(`First keypoint: ${JSON.stringify(body.keypoints[0])}`);
    console.log(`Keypoints available: ${body.keypoints.length}`);
  }
  
  // Map key points for angle calculations (using BlazePose keypoint indices)
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 20) {
    console.warn('Not enough keypoints for angle calculation:', keypoints?.length ?? 0);
    return angles;
  }
  
  // Calculate knee angle (hip-knee-ankle)
  try {
    // Get left side keypoints
    const leftHip = getValidKeypoint(keypoints, 23);
    const leftKnee = getValidKeypoint(keypoints, 25);
    const leftAnkle = getValidKeypoint(keypoints, 27);
    
    // Get right side keypoints
    const rightHip = getValidKeypoint(keypoints, 24);
    const rightKnee = getValidKeypoint(keypoints, 26);
    const rightAnkle = getValidKeypoint(keypoints, 28);
    
    // Calculate left knee angle if all points are valid
    if (leftHip && leftKnee && leftAnkle) {
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      angles.kneeAngle = leftKneeAngle;
      console.log('Left knee angle calculated:', leftKneeAngle);
    }
    
    // Calculate right knee angle if all points are valid
    if (rightHip && rightKnee && rightAnkle) {
      const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      
      // If we already have a left knee angle, average them
      if (angles.kneeAngle !== null) {
        angles.kneeAngle = (angles.kneeAngle + rightKneeAngle) / 2;
        console.log('Knee angle (averaged):', angles.kneeAngle);
      } else {
        angles.kneeAngle = rightKneeAngle;
        console.log('Right knee angle calculated:', rightKneeAngle);
      }
    }
  } catch (e) {
    console.error('Failed to calculate knee angle:', e);
  }
  
  // Calculate hip angle (shoulder-hip-knee)
  try {
    // Get left side keypoints
    const leftShoulder = getValidKeypoint(keypoints, 11);
    const leftHip = getValidKeypoint(keypoints, 23);
    const leftKnee = getValidKeypoint(keypoints, 25);
    
    // Get right side keypoints
    const rightShoulder = getValidKeypoint(keypoints, 12);
    const rightHip = getValidKeypoint(keypoints, 24);
    const rightKnee = getValidKeypoint(keypoints, 26);
    
    // Calculate left hip angle if all points are valid
    if (leftShoulder && leftHip && leftKnee) {
      const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
      angles.hipAngle = leftHipAngle;
      console.log('Left hip angle calculated:', leftHipAngle);
    }
    
    // Calculate right hip angle if all points are valid
    if (rightShoulder && rightHip && rightKnee) {
      const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
      
      // If we already have a left hip angle, average them
      if (angles.hipAngle !== null) {
        angles.hipAngle = (angles.hipAngle + rightHipAngle) / 2;
        console.log('Hip angle (averaged):', angles.hipAngle);
      } else {
        angles.hipAngle = rightHipAngle;
        console.log('Right hip angle calculated:', rightHipAngle);
      }
    }
  } catch (e) {
    console.error('Failed to calculate hip angle:', e);
  }
  
  // Calculate shoulder angle (neck-shoulder-elbow)
  try {
    // Use nose as neck approximation
    const nose = getValidKeypoint(keypoints, 0);
    const leftShoulder = getValidKeypoint(keypoints, 11);
    const leftElbow = getValidKeypoint(keypoints, 13);
    
    const rightShoulder = getValidKeypoint(keypoints, 12);
    const rightElbow = getValidKeypoint(keypoints, 14);
    
    // Calculate left shoulder angle if all points are valid
    if (nose && leftShoulder && leftElbow) {
      const leftShoulderAngle = calculateAngle(nose, leftShoulder, leftElbow);
      angles.shoulderAngle = leftShoulderAngle;
      console.log('Left shoulder angle calculated:', leftShoulderAngle);
    }
    
    // Calculate right shoulder angle if all points are valid
    if (nose && rightShoulder && rightElbow) {
      const rightShoulderAngle = calculateAngle(nose, rightShoulder, rightElbow);
      
      // If we already have a left shoulder angle, average them
      if (angles.shoulderAngle !== null) {
        angles.shoulderAngle = (angles.shoulderAngle + rightShoulderAngle) / 2;
        console.log('Shoulder angle (averaged):', angles.shoulderAngle);
      } else {
        angles.shoulderAngle = rightShoulderAngle;
        console.log('Right shoulder angle calculated:', rightShoulderAngle);
      }
    }
  } catch (e) {
    console.error('Failed to calculate shoulder angle:', e);
  }
  
  // Calculate elbow angle (shoulder-elbow-wrist)
  try {
    const leftShoulder = getValidKeypoint(keypoints, 11);
    const leftElbow = getValidKeypoint(keypoints, 13);
    const leftWrist = getValidKeypoint(keypoints, 15);
    
    const rightShoulder = getValidKeypoint(keypoints, 12);
    const rightElbow = getValidKeypoint(keypoints, 14);
    const rightWrist = getValidKeypoint(keypoints, 16);
    
    // Calculate left elbow angle if all points are valid
    if (leftShoulder && leftElbow && leftWrist) {
      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      angles.elbowAngle = leftElbowAngle;
    }
    
    // Calculate right elbow angle if all points are valid
    if (rightShoulder && rightElbow && rightWrist) {
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      
      // If we already have a left elbow angle, average them
      if (angles.elbowAngle !== null) {
        angles.elbowAngle = (angles.elbowAngle + rightElbowAngle) / 2;
      } else {
        angles.elbowAngle = rightElbowAngle;
      }
    }
  } catch (e) {
    console.error('Failed to calculate elbow angle:', e);
  }
  
  // Calculate neck angle (between shoulders and nose)
  try {
    const nose = getValidKeypoint(keypoints, 0);
    const leftShoulder = getValidKeypoint(keypoints, 11);
    const rightShoulder = getValidKeypoint(keypoints, 12);
    
    if (nose && leftShoulder && rightShoulder) {
      // Calculate midpoint between shoulders
      const midShoulders: [number, number] = [
        (leftShoulder[0] + rightShoulder[0]) / 2,
        (leftShoulder[1] + rightShoulder[1]) / 2
      ];
      
      // Calculate a point directly below the nose at the same y-level as mid shoulders
      const verticalPoint: [number, number] = [nose[0], midShoulders[1]];
      
      angles.neckAngle = calculateAngle(verticalPoint, nose, midShoulders);
      console.log('Neck angle calculated:', angles.neckAngle);
    }
  } catch (e) {
    console.error('Failed to calculate neck angle:', e);
  }
  
  return angles;
};

// Alias for backward compatibility 
export const calculateAngles = extractBodyAngles;
