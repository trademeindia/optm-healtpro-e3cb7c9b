
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateAngle, getPoint } from './geometryUtils';

// Calculate left knee angle
export const calculateLeftKneeAngle = (
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
export const calculateRightKneeAngle = (
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
