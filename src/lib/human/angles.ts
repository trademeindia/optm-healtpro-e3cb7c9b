
import { BodyAngles } from './types';

/**
 * Extracts body angles from a Human.js detection result
 */
export const extractBodyAngles = (result: any): BodyAngles => {
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  try {
    // Make sure we have body detection results
    if (!result.body || result.body.length === 0) {
      return angles;
    }
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Get required keypoints for angle calculations
    const rightHip = keypoints.find((kp: any) => kp.part === 'rightHip');
    const rightKnee = keypoints.find((kp: any) => kp.part === 'rightKnee');
    const rightAnkle = keypoints.find((kp: any) => kp.part === 'rightAnkle');
    const rightShoulder = keypoints.find((kp: any) => kp.part === 'rightShoulder');
    const rightElbow = keypoints.find((kp: any) => kp.part === 'rightElbow');
    const rightWrist = keypoints.find((kp: any) => kp.part === 'rightWrist');
    const neck = keypoints.find((kp: any) => kp.part === 'neck');
    
    // Calculate knee angle (angle between hip, knee, and ankle)
    if (rightHip && rightKnee && rightAnkle && 
        rightHip.score > 0.5 && rightKnee.score > 0.5 && rightAnkle.score > 0.5) {
      angles.kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    }
    
    // Calculate hip angle (angle between knee, hip, and shoulder)
    if (rightKnee && rightHip && rightShoulder &&
        rightKnee.score > 0.5 && rightHip.score > 0.5 && rightShoulder.score > 0.5) {
      angles.hipAngle = calculateAngle(rightKnee, rightHip, rightShoulder);
    }
    
    // Calculate shoulder angle (angle between hip, shoulder, and elbow)
    if (rightHip && rightShoulder && rightElbow &&
        rightHip.score > 0.5 && rightShoulder.score > 0.5 && rightElbow.score > 0.5) {
      angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
    }
    
    // Calculate elbow angle (angle between shoulder, elbow, and wrist)
    if (rightShoulder && rightElbow && rightWrist &&
        rightShoulder.score > 0.5 && rightElbow.score > 0.5 && rightWrist.score > 0.5) {
      angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    }
    
    // Calculate ankle angle (angle between knee, ankle, and toe)
    const rightToe = keypoints.find((kp: any) => kp.part === 'rightFoot');
    if (rightKnee && rightAnkle && rightToe &&
        rightKnee.score > 0.5 && rightAnkle.score > 0.5 && rightToe.score > 0.5) {
      angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, rightToe);
    }
    
    // Calculate neck angle (angle between shoulder, neck, and head)
    const nose = keypoints.find((kp: any) => kp.part === 'nose');
    if (rightShoulder && neck && nose &&
        rightShoulder.score > 0.5 && neck.score > 0.5 && nose.score > 0.5) {
      angles.neckAngle = calculateAngle(rightShoulder, neck, nose);
    }
    
  } catch (error) {
    console.error('Error extracting body angles:', error);
  }
  
  return angles;
};

/**
 * Calculate angle between three points
 */
const calculateAngle = (p1: any, p2: any, p3: any): number => {
  try {
    // Calculate vectors
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    // Calculate angle using dot product
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return 180;
    
    const cosAngle = dot / (mag1 * mag2);
    const angle = Math.acos(Math.min(1, Math.max(-1, cosAngle)));
    
    // Convert to degrees
    return Math.round(angle * (180 / Math.PI));
  } catch (error) {
    console.error('Error calculating angle:', error);
    return 180; // Default to straight angle
  }
};
