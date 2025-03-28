
import * as Human from '@vladmandic/human';
import { BodyAngles } from './types';

/**
 * Extract body angles from Human.js detection result
 */
export const extractBodyAngles = (result: Human.Result): BodyAngles => {
  // Initialize all angles to null
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  // Check if we have body detection results
  if (!result || !result.body || result.body.length === 0) {
    return angles;
  }
  
  // Get keypoints from the first detected person
  const body = result.body[0];
  const keypoints = body.keypoints;
  
  // Calculate knee angle (right side)
  const rightHip = keypoints.find(kp => kp.part === 'rightHip');
  const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
  const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
  
  if (rightHip && rightKnee && rightAnkle) {
    angles.kneeAngle = calculateAngle(
      { x: rightHip.x, y: rightHip.y },
      { x: rightKnee.x, y: rightKnee.y },
      { x: rightAnkle.x, y: rightAnkle.y }
    );
  }
  
  // Calculate hip angle (right side)
  const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
  
  if (rightShoulder && rightHip && rightKnee) {
    angles.hipAngle = calculateAngle(
      { x: rightShoulder.x, y: rightShoulder.y },
      { x: rightHip.x, y: rightHip.y },
      { x: rightKnee.x, y: rightKnee.y }
    );
  }
  
  // Calculate shoulder angle (right side)
  const rightElbow = keypoints.find(kp => kp.part === 'rightElbow');
  
  if (rightShoulder && rightElbow && rightHip) {
    angles.shoulderAngle = calculateAngle(
      { x: rightElbow.x, y: rightElbow.y },
      { x: rightShoulder.x, y: rightShoulder.y },
      { x: rightHip.x, y: rightHip.y }
    );
  }
  
  // Calculate elbow angle (right side)
  const rightWrist = keypoints.find(kp => kp.part === 'rightWrist');
  
  if (rightShoulder && rightElbow && rightWrist) {
    angles.elbowAngle = calculateAngle(
      { x: rightShoulder.x, y: rightShoulder.y },
      { x: rightElbow.x, y: rightElbow.y },
      { x: rightWrist.x, y: rightWrist.y }
    );
  }
  
  // Calculate ankle angle (right side)
  if (rightKnee && rightAnkle) {
    // For ankle, we need to create a vertical reference point
    const verticalPoint = { x: rightAnkle.x, y: rightAnkle.y - 100 };
    
    angles.ankleAngle = calculateAngle(
      { x: rightKnee.x, y: rightKnee.y },
      { x: rightAnkle.x, y: rightAnkle.y },
      verticalPoint
    );
  }
  
  // Calculate neck angle
  const nose = keypoints.find(kp => kp.part === 'nose');
  
  if (nose && rightShoulder && rightHip) {
    angles.neckAngle = calculateAngle(
      { x: nose.x, y: nose.y },
      { x: rightShoulder.x, y: rightShoulder.y },
      { x: rightHip.x, y: rightHip.y }
    );
  }
  
  return angles;
};

/**
 * Calculate angle between three points (in degrees)
 */
export const calculateAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number => {
  // Calculate vectors
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  // Calculate dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  // Calculate angle in radians
  const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
  
  // Convert to degrees
  return (angleRad * 180) / Math.PI;
};
