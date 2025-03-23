
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

// Extract angles from detected body pose
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
    return angles;
  }
  
  const body = result.body[0];
  
  // Map key points for angle calculations (using BlazePose keypoint indices)
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 25) {
    return angles;
  }
  
  // Calculate knee angle (hip-knee-ankle)
  try {
    // @ts-ignore - Using type assertion for accessing x, y properties
    const leftHip = [keypoints[23].x, keypoints[23].y] as [number, number];
    // @ts-ignore
    const leftKnee = [keypoints[25].x, keypoints[25].y] as [number, number];
    // @ts-ignore
    const leftAnkle = [keypoints[27].x, keypoints[27].y] as [number, number];
    
    // @ts-ignore
    const rightHip = [keypoints[24].x, keypoints[24].y] as [number, number];
    // @ts-ignore
    const rightKnee = [keypoints[26].x, keypoints[26].y] as [number, number];
    // @ts-ignore
    const rightAnkle = [keypoints[28].x, keypoints[28].y] as [number, number];
    
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    angles.kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate knee angle', e);
  }
  
  // Calculate hip angle (shoulder-hip-knee)
  try {
    // @ts-ignore
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    // @ts-ignore
    const leftHip = [keypoints[23].x, keypoints[23].y] as [number, number];
    // @ts-ignore
    const leftKnee = [keypoints[25].x, keypoints[25].y] as [number, number];
    
    // @ts-ignore
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    // @ts-ignore
    const rightHip = [keypoints[24].x, keypoints[24].y] as [number, number];
    // @ts-ignore
    const rightKnee = [keypoints[26].x, keypoints[26].y] as [number, number];
    
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    
    angles.hipAngle = (leftHipAngle + rightHipAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate hip angle', e);
  }
  
  // Calculate shoulder angle (neck-shoulder-elbow)
  try {
    // @ts-ignore
    const neck = [keypoints[0].x, keypoints[0].y] as [number, number];
    // @ts-ignore
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    // @ts-ignore
    const leftElbow = [keypoints[13].x, keypoints[13].y] as [number, number];
    
    // @ts-ignore
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    // @ts-ignore
    const rightElbow = [keypoints[14].x, keypoints[14].y] as [number, number];
    
    const leftShoulderAngle = calculateAngle(neck, leftShoulder, leftElbow);
    const rightShoulderAngle = calculateAngle(neck, rightShoulder, rightElbow);
    
    angles.shoulderAngle = (leftShoulderAngle + rightShoulderAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate shoulder angle', e);
  }
  
  // Calculate elbow angle (shoulder-elbow-wrist)
  try {
    // @ts-ignore
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    // @ts-ignore
    const leftElbow = [keypoints[13].x, keypoints[13].y] as [number, number];
    // @ts-ignore
    const leftWrist = [keypoints[15].x, keypoints[15].y] as [number, number];
    
    // @ts-ignore
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    // @ts-ignore
    const rightElbow = [keypoints[14].x, keypoints[14].y] as [number, number];
    // @ts-ignore
    const rightWrist = [keypoints[16].x, keypoints[16].y] as [number, number];
    
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    
    angles.elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate elbow angle', e);
  }
  
  // Calculate neck angle (between shoulders and nose)
  try {
    // @ts-ignore
    const nose = [keypoints[0].x, keypoints[0].y] as [number, number];
    // @ts-ignore
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    // @ts-ignore
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    
    // Calculate midpoint between shoulders
    const midShoulders: [number, number] = [
      (leftShoulder[0] + rightShoulder[0]) / 2,
      (leftShoulder[1] + rightShoulder[1]) / 2
    ];
    
    // Calculate a point directly below the nose at the same y-level as mid shoulders
    const verticalPoint: [number, number] = [nose[0], midShoulders[1]];
    
    angles.neckAngle = calculateAngle(verticalPoint, nose, midShoulders);
  } catch (e) {
    console.log('Failed to calculate neck angle', e);
  }
  
  return angles;
};
