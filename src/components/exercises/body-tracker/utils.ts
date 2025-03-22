
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from './types';

// Define a Point interface that matches the structure we're using
interface Point {
  x: number;
  y: number;
}

// Calculate angle between three points
export const calculateAngle = (
  p1: Point,
  p2: Point,
  p3: Point
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

// Helper function to extract point coordinates from keypoint
const getPoint = (keypoint: BodyKeypoint): Point => {
  return {
    x: keypoint.position.x,
    y: keypoint.position.y
  };
};

// Calculate left elbow angle
const calculateLeftElbowAngle = (
  leftShoulder: BodyKeypoint,
  leftElbow: BodyKeypoint,
  leftWrist: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(leftShoulder),
    getPoint(leftElbow),
    getPoint(leftWrist)
  );
  
  return {
    joint: 'Left Elbow',
    angle
  };
};

// Calculate right elbow angle
const calculateRightElbowAngle = (
  rightShoulder: BodyKeypoint,
  rightElbow: BodyKeypoint,
  rightWrist: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(rightShoulder),
    getPoint(rightElbow),
    getPoint(rightWrist)
  );
  
  return {
    joint: 'Right Elbow',
    angle
  };
};

// Calculate left knee angle
const calculateLeftKneeAngle = (
  leftHip: BodyKeypoint,
  leftKnee: BodyKeypoint,
  leftAnkle: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(leftHip),
    getPoint(leftKnee),
    getPoint(leftAnkle)
  );
  
  return {
    joint: 'Left Knee',
    angle
  };
};

// Calculate right knee angle
const calculateRightKneeAngle = (
  rightHip: BodyKeypoint,
  rightKnee: BodyKeypoint,
  rightAnkle: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(rightHip),
    getPoint(rightKnee),
    getPoint(rightAnkle)
  );
  
  return {
    joint: 'Right Knee',
    angle
  };
};

// Calculate left hip angle
const calculateLeftHipAngle = (
  leftShoulder: BodyKeypoint,
  leftHip: BodyKeypoint,
  leftKnee: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(leftShoulder),
    getPoint(leftHip),
    getPoint(leftKnee)
  );
  
  return {
    joint: 'Left Hip',
    angle
  };
};

// Calculate right hip angle
const calculateRightHipAngle = (
  rightShoulder: BodyKeypoint,
  rightHip: BodyKeypoint,
  rightKnee: BodyKeypoint
): JointAngle => {
  const angle = calculateAngle(
    getPoint(rightShoulder),
    getPoint(rightHip),
    getPoint(rightKnee)
  );
  
  return {
    joint: 'Right Hip',
    angle
  };
};

// Calculate all important joint angles from keypoints
export const calculateJointAngles = (keypoints: BodyKeypoint[]): JointAngle[] => {
  // Helper function to find keypoint by name
  const findKeypoint = (name: string) => keypoints.find(kp => kp.part === name);
  const angles: JointAngle[] = [];
  
  // Left elbow angle
  const leftShoulder = findKeypoint('leftShoulder');
  const leftElbow = findKeypoint('leftElbow');
  const leftWrist = findKeypoint('leftWrist');
  
  if (leftShoulder && leftElbow && leftWrist) {
    angles.push(calculateLeftElbowAngle(leftShoulder, leftElbow, leftWrist));
  }
  
  // Right elbow angle
  const rightShoulder = findKeypoint('rightShoulder');
  const rightElbow = findKeypoint('rightElbow');
  const rightWrist = findKeypoint('rightWrist');
  
  if (rightShoulder && rightElbow && rightWrist) {
    angles.push(calculateRightElbowAngle(rightShoulder, rightElbow, rightWrist));
  }
  
  // Left knee angle
  const leftHip = findKeypoint('leftHip');
  const leftKnee = findKeypoint('leftKnee');
  const leftAnkle = findKeypoint('leftAnkle');
  
  if (leftHip && leftKnee && leftAnkle) {
    angles.push(calculateLeftKneeAngle(leftHip, leftKnee, leftAnkle));
  }
  
  // Right knee angle
  const rightHip = findKeypoint('rightHip');
  const rightKnee = findKeypoint('rightKnee');
  const rightAnkle = findKeypoint('rightAnkle');
  
  if (rightHip && rightKnee && rightAnkle) {
    angles.push(calculateRightKneeAngle(rightHip, rightKnee, rightAnkle));
  }
  
  // Hip angles
  const leftShoulder2 = findKeypoint('leftShoulder');
  const leftHip2 = findKeypoint('leftHip');
  const leftKnee2 = findKeypoint('leftKnee');
  
  if (leftShoulder2 && leftHip2 && leftKnee2) {
    angles.push(calculateLeftHipAngle(leftShoulder2, leftHip2, leftKnee2));
  }
  
  // Right hip angle
  const rightShoulder2 = findKeypoint('rightShoulder');
  const rightHip2 = findKeypoint('rightHip');
  const rightKnee2 = findKeypoint('rightKnee');
  
  if (rightShoulder2 && rightHip2 && rightKnee2) {
    angles.push(calculateRightHipAngle(rightShoulder2, rightHip2, rightKnee2));
  }
  
  return angles;
};
