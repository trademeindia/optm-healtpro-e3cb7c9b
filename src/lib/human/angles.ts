
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Calculate the angle between three points in 2D space
 * @param p1 First point (x, y)
 * @param p2 Second point (middle point)
 * @param p3 Third point
 * @returns Angle in degrees
 */
const calculateAngle = (
  p1: { x: number, y: number },
  p2: { x: number, y: number },
  p3: { x: number, y: number }
): number => {
  // Calculate vectors
  const vector1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const vector2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  // Calculate dot product
  const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
  // Calculate angle in radians
  const angleRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
  
  // Convert to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);
  
  return Math.min(360, Math.max(0, angleDegrees));
};

/**
 * Extract body angles from Human.js detection result
 */
export const extractBodyAngles = (result: Human.Result): BodyAngles => {
  // Initialize with null values
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  // If no body detected or confidence too low, return empty angles
  if (!result || !result.body || result.body.length === 0) {
    return angles;
  }
  
  try {
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Find necessary keypoints
    const findKeypoint = (name: string) => 
      keypoints.find(kp => kp.part === name && kp.score > 0.5);
    
    // Calculate knee angle (ankle-knee-hip)
    const leftAnkle = findKeypoint('leftAnkle');
    const leftKnee = findKeypoint('leftKnee');
    const leftHip = findKeypoint('leftHip');
    const rightAnkle = findKeypoint('rightAnkle');
    const rightKnee = findKeypoint('rightKnee');
    const rightHip = findKeypoint('rightHip');
    
    if (rightAnkle && rightKnee && rightHip) {
      angles.kneeAngle = calculateAngle(rightAnkle, rightKnee, rightHip);
    } else if (leftAnkle && leftKnee && leftHip) {
      angles.kneeAngle = calculateAngle(leftAnkle, leftKnee, leftHip);
    }
    
    // Calculate hip angle (knee-hip-shoulder)
    const leftShoulder = findKeypoint('leftShoulder');
    const rightShoulder = findKeypoint('rightShoulder');
    
    if (rightKnee && rightHip && rightShoulder) {
      angles.hipAngle = calculateAngle(rightKnee, rightHip, rightShoulder);
    } else if (leftKnee && leftHip && leftShoulder) {
      angles.hipAngle = calculateAngle(leftKnee, leftHip, leftShoulder);
    }
    
    // Calculate shoulder angle (hip-shoulder-elbow)
    const leftElbow = findKeypoint('leftElbow');
    const rightElbow = findKeypoint('rightElbow');
    
    if (rightHip && rightShoulder && rightElbow) {
      angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
    } else if (leftHip && leftShoulder && leftElbow) {
      angles.shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
    }
    
    // Calculate elbow angle (shoulder-elbow-wrist)
    const leftWrist = findKeypoint('leftWrist');
    const rightWrist = findKeypoint('rightWrist');
    
    if (rightShoulder && rightElbow && rightWrist) {
      angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    } else if (leftShoulder && leftElbow && leftWrist) {
      angles.elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    }
    
    // Calculate ankle angle (knee-ankle-foot)
    // Note: For basic BlazeNet model, foot point might not be available
    // So we approximate with available points
    if (rightKnee && rightAnkle) {
      // Approximate a point below the ankle
      const footPoint = { 
        x: rightAnkle.x, 
        y: rightAnkle.y + 30 
      };
      angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, footPoint);
    } else if (leftKnee && leftAnkle) {
      const footPoint = { 
        x: leftAnkle.x, 
        y: leftAnkle.y + 30 
      };
      angles.ankleAngle = calculateAngle(leftKnee, leftAnkle, footPoint);
    }
    
    // Calculate neck angle (vertical line from head)
    const nose = findKeypoint('nose');
    const midShoulder = {
      x: (leftShoulder?.x || 0 + rightShoulder?.x || 0) / 2,
      y: (leftShoulder?.y || 0 + rightShoulder?.y || 0) / 2
    };
    
    if (nose && (leftShoulder || rightShoulder)) {
      // Create a vertical reference point
      const verticalPoint = { x: midShoulder.x, y: midShoulder.y - 100 };
      angles.neckAngle = calculateAngle(verticalPoint, midShoulder, nose);
    }
    
  } catch (error) {
    console.error('Error calculating body angles:', error);
  }
  
  return angles;
};
