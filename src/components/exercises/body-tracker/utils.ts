
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from './types';

// Calculate angle between three points
export const calculateAngle = (
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number => {
  // Convert to vectors
  const vec1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  
  const vec2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y
  };
  
  // Calculate dot product
  const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
  const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
  
  // Calculate angle in degrees
  const angleRad = Math.acos(dotProduct / (mag1 * mag2));
  const angleDeg = angleRad * (180 / Math.PI);
  
  return Math.round(angleDeg);
};

// Calculate all important joint angles from keypoints
export const calculateJointAngles = (keypoints: BodyKeypoint[]): JointAngle[] => {
  const findKeypoint = (name: string) => keypoints.find(kp => kp.name === name);
  const angles: JointAngle[] = [];
  
  // Left elbow angle
  const leftShoulder = findKeypoint('leftShoulder');
  const leftElbow = findKeypoint('leftElbow');
  const leftWrist = findKeypoint('leftWrist');
  
  if (leftShoulder && leftElbow && leftWrist) {
    const angle = calculateAngle(
      leftShoulder, 
      leftElbow, 
      leftWrist
    );
    
    angles.push({
      joint: 'Left Elbow',
      angle
    });
  }
  
  // Right elbow angle
  const rightShoulder = findKeypoint('rightShoulder');
  const rightElbow = findKeypoint('rightElbow');
  const rightWrist = findKeypoint('rightWrist');
  
  if (rightShoulder && rightElbow && rightWrist) {
    const angle = calculateAngle(
      rightShoulder, 
      rightElbow, 
      rightWrist
    );
    
    angles.push({
      joint: 'Right Elbow',
      angle
    });
  }
  
  // Left knee angle
  const leftHip = findKeypoint('leftHip');
  const leftKnee = findKeypoint('leftKnee');
  const leftAnkle = findKeypoint('leftAnkle');
  
  if (leftHip && leftKnee && leftAnkle) {
    const angle = calculateAngle(
      leftHip, 
      leftKnee, 
      leftAnkle
    );
    
    angles.push({
      joint: 'Left Knee',
      angle
    });
  }
  
  // Right knee angle
  const rightHip = findKeypoint('rightHip');
  const rightKnee = findKeypoint('rightKnee');
  const rightAnkle = findKeypoint('rightAnkle');
  
  if (rightHip && rightKnee && rightAnkle) {
    const angle = calculateAngle(
      rightHip, 
      rightKnee, 
      rightAnkle
    );
    
    angles.push({
      joint: 'Right Knee',
      angle
    });
  }
  
  // Hip angles
  const leftShoulder2 = findKeypoint('leftShoulder');
  const leftHip2 = findKeypoint('leftHip');
  const leftKnee2 = findKeypoint('leftKnee');
  
  if (leftShoulder2 && leftHip2 && leftKnee2) {
    const angle = calculateAngle(
      leftShoulder2, 
      leftHip2, 
      leftKnee2
    );
    
    angles.push({
      joint: 'Left Hip',
      angle
    });
  }
  
  // Right hip angle
  const rightShoulder2 = findKeypoint('rightShoulder');
  const rightHip2 = findKeypoint('rightHip');
  const rightKnee2 = findKeypoint('rightKnee');
  
  if (rightShoulder2 && rightHip2 && rightKnee2) {
    const angle = calculateAngle(
      rightShoulder2, 
      rightHip2, 
      rightKnee2
    );
    
    angles.push({
      joint: 'Right Hip',
      angle
    });
  }
  
  return angles;
};
