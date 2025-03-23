
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts angles between body keypoints from Human.js detection results
 */
export const extractBodyAngles = (result: Human.Result): BodyAngles => {
  // Default angles object
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  if (!result || !result.body || result.body.length === 0) {
    return angles;
  }
  
  const body = result.body[0];
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 20) {
    return angles;
  }

  try {
    // Extract specific keypoints needed for angle calculations
    // Using BlazePose keypoint indices
    const leftHip = keypoints.find(kp => kp.part === 'leftHip') || findKeypointByIndex(keypoints, 23);
    const rightHip = keypoints.find(kp => kp.part === 'rightHip') || findKeypointByIndex(keypoints, 24);
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee') || findKeypointByIndex(keypoints, 25);
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee') || findKeypointByIndex(keypoints, 26);
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle') || findKeypointByIndex(keypoints, 27);
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle') || findKeypointByIndex(keypoints, 28);
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder') || findKeypointByIndex(keypoints, 11);
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder') || findKeypointByIndex(keypoints, 12);
    const leftElbow = keypoints.find(kp => kp.part === 'leftElbow') || findKeypointByIndex(keypoints, 13);
    const rightElbow = keypoints.find(kp => kp.part === 'rightElbow') || findKeypointByIndex(keypoints, 14);
    const leftWrist = keypoints.find(kp => kp.part === 'leftWrist') || findKeypointByIndex(keypoints, 15);
    const rightWrist = keypoints.find(kp => kp.part === 'rightWrist') || findKeypointByIndex(keypoints, 16);
    const neck = keypoints.find(kp => kp.part === 'neck') || findKeypointByIndex(keypoints, 1);
    const nose = keypoints.find(kp => kp.part === 'nose') || findKeypointByIndex(keypoints, 0);
    
    // Only calculate if we have the necessary keypoints with sufficient confidence
    const confidenceThreshold = 0.3; // Lower threshold to improve detection
    
    // Calculate knee angle (average of left and right if both available)
    if (leftKnee && leftHip && leftAnkle && 
        leftKnee.score > confidenceThreshold && 
        leftHip.score > confidenceThreshold && 
        leftAnkle.score > confidenceThreshold) {
      angles.kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    } else if (rightKnee && rightHip && rightAnkle && 
              rightKnee.score > confidenceThreshold && 
              rightHip.score > confidenceThreshold && 
              rightAnkle.score > confidenceThreshold) {
      angles.kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    }
    
    // Calculate hip angle (average of left and right if both available)
    if (leftShoulder && leftHip && leftKnee && 
        leftShoulder.score > confidenceThreshold && 
        leftHip.score > confidenceThreshold && 
        leftKnee.score > confidenceThreshold) {
      angles.hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    } else if (rightShoulder && rightHip && rightKnee && 
              rightShoulder.score > confidenceThreshold && 
              rightHip.score > confidenceThreshold && 
              rightKnee.score > confidenceThreshold) {
      angles.hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    }
    
    // Calculate shoulder angle
    if (rightHip && rightShoulder && rightElbow && 
        rightHip.score > confidenceThreshold && 
        rightShoulder.score > confidenceThreshold && 
        rightElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
    } else if (leftHip && leftShoulder && leftElbow && 
                leftHip.score > confidenceThreshold && 
                leftShoulder.score > confidenceThreshold && 
                leftElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
    }
    
    // Calculate elbow angle
    if (leftShoulder && leftElbow && leftWrist && 
        leftShoulder.score > confidenceThreshold && 
        leftElbow.score > confidenceThreshold && 
        leftWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    } else if (rightShoulder && rightElbow && rightWrist && 
                rightShoulder.score > confidenceThreshold && 
                rightElbow.score > confidenceThreshold && 
                rightWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    }
    
    console.log('Angles calculated successfully:', JSON.stringify(angles));
    
    return angles;
  } catch (error) {
    console.error('Error calculating angles:', error);
    return angles;
  }
};

// Helper function to find keypoint by index in case part name isn't available
function findKeypointByIndex(keypoints: any[], index: number) {
  return keypoints[index] || null;
}

// Calculate angle between three points in degrees
function calculateAngle(pointA: any, pointB: any, pointC: any): number {
  try {
    // Extract coordinates, handling both normalized and pixel coordinates
    const getX = (point: any) => typeof point.x === 'number' ? point.x : point.position.x;
    const getY = (point: any) => typeof point.y === 'number' ? point.y : point.position.y;
    
    const ax = getX(pointA);
    const ay = getY(pointA);
    const bx = getX(pointB);
    const by = getY(pointB);
    const cx = getX(pointC);
    const cy = getY(pointC);
    
    // Calculate vectors
    const vec1 = { x: ax - bx, y: ay - by };
    const vec2 = { x: cx - bx, y: cy - by };
    
    // Calculate dot product
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    
    // Avoid division by zero
    if (mag1 === 0 || mag2 === 0) return 180;
    
    // Calculate angle in radians and convert to degrees
    const cosAngle = Math.max(-1, Math.min(1, dotProduct / (mag1 * mag2)));
    const angleRad = Math.acos(cosAngle);
    const angleDeg = angleRad * (180 / Math.PI);
    
    return angleDeg;
  } catch (error) {
    console.error('Error in angle calculation:', error);
    return 180; // Default angle
  }
}
