
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Calculate angle between three points in 2D space
 */
const calculateAngle = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
  pointC: { x: number; y: number }
): number => {
  // Convert to vectors
  const vectorAB = { x: pointB.x - pointA.x, y: pointB.y - pointA.y };
  const vectorCB = { x: pointB.x - pointC.x, y: pointB.y - pointC.y };
  
  // Calculate dot product
  const dotProduct = vectorAB.x * vectorCB.x + vectorAB.y * vectorCB.y;
  
  // Calculate magnitudes
  const magnitudeAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
  const magnitudeCB = Math.sqrt(vectorCB.x * vectorCB.x + vectorCB.y * vectorCB.y);
  
  // Calculate angle in radians
  const angleRad = Math.acos(dotProduct / (magnitudeAB * magnitudeCB));
  
  // Convert to degrees
  const angleDeg = angleRad * (180 / Math.PI);
  
  return angleDeg;
};

/**
 * Extract relevant body angles from a Human.js Result
 */
export const extractBodyAngles = (result: Human.Result): BodyAngles => {
  const angles: BodyAngles = {
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
  
  try {
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Get keypoint indices for the right side
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
    const rightElbow = keypoints.find(kp => kp.part === 'rightElbow');
    const rightWrist = keypoints.find(kp => kp.part === 'rightWrist');
    const nose = keypoints.find(kp => kp.part === 'nose');
    
    // Get keypoint indices for the left side
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
    const leftElbow = keypoints.find(kp => kp.part === 'leftElbow');
    const leftWrist = keypoints.find(kp => kp.part === 'leftWrist');
    
    // Calculate knee angle (use right by default, fall back to left)
    if (rightKnee && rightHip && rightAnkle && 
        rightKnee.score > 0.5 && rightHip.score > 0.5 && rightAnkle.score > 0.5) {
      angles.kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    } else if (leftKnee && leftHip && leftAnkle && 
               leftKnee.score > 0.5 && leftHip.score > 0.5 && leftAnkle.score > 0.5) {
      angles.kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    }
    
    // Calculate hip angle (use right by default, fall back to left)
    if (rightShoulder && rightHip && rightKnee && 
        rightShoulder.score > 0.5 && rightHip.score > 0.5 && rightKnee.score > 0.5) {
      angles.hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    } else if (leftShoulder && leftHip && leftKnee && 
               leftShoulder.score > 0.5 && leftHip.score > 0.5 && leftKnee.score > 0.5) {
      angles.hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    }
    
    // Calculate shoulder angle (use right by default, fall back to left)
    if (rightElbow && rightShoulder && rightHip && 
        rightElbow.score > 0.5 && rightShoulder.score > 0.5 && rightHip.score > 0.5) {
      angles.shoulderAngle = calculateAngle(rightElbow, rightShoulder, rightHip);
    } else if (leftElbow && leftShoulder && leftHip && 
               leftElbow.score > 0.5 && leftShoulder.score > 0.5 && leftHip.score > 0.5) {
      angles.shoulderAngle = calculateAngle(leftElbow, leftShoulder, leftHip);
    }
    
    // Calculate elbow angle (use right by default, fall back to left)
    if (rightWrist && rightElbow && rightShoulder && 
        rightWrist.score > 0.5 && rightElbow.score > 0.5 && rightShoulder.score > 0.5) {
      angles.elbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
    } else if (leftWrist && leftElbow && leftShoulder && 
               leftWrist.score > 0.5 && leftElbow.score > 0.5 && leftShoulder.score > 0.5) {
      angles.elbowAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
    }
    
    // Calculate ankle angle (use right by default, fall back to left)
    if (rightKnee && rightAnkle && 
        rightKnee.score > 0.5 && rightAnkle.score > 0.5) {
      // We only have two points, so we'll create a third point directly below the ankle
      const floorPoint = { x: rightAnkle.x, y: rightAnkle.y + 50 };
      angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, floorPoint);
    } else if (leftKnee && leftAnkle && 
               leftKnee.score > 0.5 && leftAnkle.score > 0.5) {
      const floorPoint = { x: leftAnkle.x, y: leftAnkle.y + 50 };
      angles.ankleAngle = calculateAngle(leftKnee, leftAnkle, floorPoint);
    }
    
    // Calculate neck angle
    if (nose && rightShoulder && leftShoulder && 
        nose.score > 0.5 && rightShoulder.score > 0.5 && leftShoulder.score > 0.5) {
      // Calculate midpoint between shoulders
      const midShoulder = {
        x: (rightShoulder.x + leftShoulder.x) / 2,
        y: (rightShoulder.y + leftShoulder.y) / 2
      };
      
      // Create a point directly below the mid-shoulder point
      const verticalPoint = { x: midShoulder.x, y: midShoulder.y + 50 };
      
      angles.neckAngle = calculateAngle(nose, midShoulder, verticalPoint);
    }
    
  } catch (error) {
    console.error('Error calculating body angles:', error);
  }
  
  return angles;
};
