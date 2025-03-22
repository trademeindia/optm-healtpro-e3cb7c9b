
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateLeftElbowAngle, calculateRightElbowAngle } from './elbowAngles';
import { calculateLeftKneeAngle, calculateRightKneeAngle } from './kneeAngles';
import { calculateLeftHipAngle, calculateRightHipAngle } from './hipAngles';

// Calculate all important joint angles from keypoints
export const calculateJointAngles = (keypoints: BodyKeypoint[]): JointAngle[] => {
  // Helper function to find keypoint by name
  const findKeypoint = (name: string): BodyKeypoint | undefined => 
    keypoints.find(kp => kp.part === name);
    
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
