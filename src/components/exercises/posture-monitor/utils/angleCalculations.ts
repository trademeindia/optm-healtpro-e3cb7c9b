import * as posenet from '@tensorflow-models/posenet';

type Point = posenet.Keypoint | number[] | { x: number, y: number };

// Calculate angle between three points (in degrees)
export const calculateAngle = (
  pointA: Point, 
  pointB: Point, 
  pointC: Point
): number => {
  // Extract positions based on input type
  const getPosition = (point: Point): [number, number] => {
    if (Array.isArray(point)) {
      return [point[0], point[1]];
    } else if ('position' in point) {
      return [point.position.x, point.position.y];
    } else if ('x' in point && 'y' in point) {
      return [point.x, point.y];
    }
    throw new Error('Invalid point format');
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
  // Make sure to handle edge cases to avoid NaN
  if (magAB === 0 || magBC === 0) return 0;
  
  // Ensure value is in valid range for acos
  const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magAB * magBC)));
  return Math.acos(cosTheta) * (180 / Math.PI);
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
