
import * as posenet from '@tensorflow-models/posenet';

// Calculate angle between three points (in degrees)
export const calculateAngle = (
  pointA: posenet.Keypoint | number[], 
  pointB: posenet.Keypoint | number[], 
  pointC: posenet.Keypoint | number[]
): number => {
  // Extract positions based on input type
  const getPosition = (point: posenet.Keypoint | number[]): number[] => {
    return Array.isArray(point) ? point : point.position;
  };

  const posA = getPosition(pointA);
  const posB = getPosition(pointB);
  const posC = getPosition(pointC);

  // Calculate vectors AB and BC
  const AB = [posB[0] - posA[0], posB[1] - posA[1]];
  const BC = [posC[0] - posB[0], posC[1] - posB[1]];
  
  // Calculate dot product and magnitudes
  const dotProduct = AB[0] * BC[0] + AB[1] * BC[1];
  const magAB = Math.sqrt(AB[0] * AB[0] + AB[1] * AB[1]);
  const magBC = Math.sqrt(BC[0] * BC[0] + BC[1] * BC[1]);
  
  // Calculate angle in radians and convert to degrees
  const angleRad = Math.acos(dotProduct / (magAB * magBC));
  return angleRad * (180 / Math.PI);
};

// Calculate the average of multiple angles
export const calculateAverageAngle = (angles: number[]): number => {
  if (angles.length === 0) return 0;
  const sum = angles.reduce((acc, angle) => acc + angle, 0);
  return sum / angles.length;
};

// Extract specific keypoints that are commonly used together
export const extractJointKeypoints = (pose: posenet.Pose) => {
  const keypoints = pose.keypoints;
  
  return {
    leftShoulder: keypoints.find(kp => kp.part === 'leftShoulder'),
    rightShoulder: keypoints.find(kp => kp.part === 'rightShoulder'),
    leftElbow: keypoints.find(kp => kp.part === 'leftElbow'),
    rightElbow: keypoints.find(kp => kp.part === 'rightElbow'),
    leftWrist: keypoints.find(kp => kp.part === 'leftWrist'),
    rightWrist: keypoints.find(kp => kp.part === 'rightWrist'),
    leftHip: keypoints.find(kp => kp.part === 'leftHip'),
    rightHip: keypoints.find(kp => kp.part === 'rightHip'),
    leftKnee: keypoints.find(kp => kp.part === 'leftKnee'),
    rightKnee: keypoints.find(kp => kp.part === 'rightKnee'),
    leftAnkle: keypoints.find(kp => kp.part === 'leftAnkle'),
    rightAnkle: keypoints.find(kp => kp.part === 'rightAnkle'),
    nose: keypoints.find(kp => kp.part === 'nose')
  };
};

// Calculate key joint angles from a pose
export const calculateJointAngles = (pose: posenet.Pose) => {
  const joints = extractJointKeypoints(pose);
  
  // Only calculate if we have all necessary keypoints
  const angles: { [key: string]: number | null } = {
    leftKnee: null,
    rightKnee: null,
    leftHip: null,
    rightHip: null,
    leftElbow: null,
    rightElbow: null
  };
  
  // Calculate knee angles
  if (joints.leftHip && joints.leftKnee && joints.leftAnkle) {
    angles.leftKnee = calculateAngle(joints.leftHip, joints.leftKnee, joints.leftAnkle);
  }
  
  if (joints.rightHip && joints.rightKnee && joints.rightAnkle) {
    angles.rightKnee = calculateAngle(joints.rightHip, joints.rightKnee, joints.rightAnkle);
  }
  
  // Calculate hip angles
  if (joints.leftShoulder && joints.leftHip && joints.leftKnee) {
    angles.leftHip = calculateAngle(joints.leftShoulder, joints.leftHip, joints.leftKnee);
  }
  
  if (joints.rightShoulder && joints.rightHip && joints.rightKnee) {
    angles.rightHip = calculateAngle(joints.rightShoulder, joints.rightHip, joints.rightKnee);
  }
  
  // Calculate elbow angles
  if (joints.leftShoulder && joints.leftElbow && joints.leftWrist) {
    angles.leftElbow = calculateAngle(joints.leftShoulder, joints.leftElbow, joints.leftWrist);
  }
  
  if (joints.rightShoulder && joints.rightElbow && joints.rightWrist) {
    angles.rightElbow = calculateAngle(joints.rightShoulder, joints.rightElbow, joints.rightWrist);
  }
  
  return angles;
};
