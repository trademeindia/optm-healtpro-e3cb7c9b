
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateAngle, getPoint } from './geometryUtils';

// Calculate left hip angle
export const calculateLeftHipAngle = (
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
export const calculateRightHipAngle = (
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
