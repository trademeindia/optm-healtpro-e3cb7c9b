
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateAngle, getPoint } from './geometryUtils';

// Calculate left elbow angle
export const calculateLeftElbowAngle = (
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
export const calculateRightElbowAngle = (
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
