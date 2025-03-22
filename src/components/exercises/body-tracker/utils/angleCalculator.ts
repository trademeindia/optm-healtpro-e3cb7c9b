
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateAngle, getPoint } from './geometryUtils';
import { 
  calculateLeftElbowAngle, 
  calculateRightElbowAngle 
} from './elbowAngles';
import { 
  calculateLeftKneeAngle, 
  calculateRightKneeAngle 
} from './kneeAngles';
import { 
  calculateLeftHipAngle, 
  calculateRightHipAngle 
} from './hipAngles';

/**
 * Calculate joint angles from detected body keypoints
 */
export const calculateJointAngles = (keypoints: BodyKeypoint[]): JointAngle[] => {
  const angles: JointAngle[] = [];
  
  // Create a map of keypoints by name for easier access
  const keypointMap = new Map<string, BodyKeypoint>();
  keypoints.forEach(keypoint => {
    keypointMap.set(keypoint.part, keypoint);
  });
  
  // Calculate left elbow angle
  if (keypointMap.has('leftShoulder') && keypointMap.has('leftElbow') && keypointMap.has('leftWrist')) {
    const angle = calculateLeftElbowAngle(
      keypointMap.get('leftShoulder')!,
      keypointMap.get('leftElbow')!,
      keypointMap.get('leftWrist')!
    );
    angles.push(angle);
  }
  
  // Calculate right elbow angle
  if (keypointMap.has('rightShoulder') && keypointMap.has('rightElbow') && keypointMap.has('rightWrist')) {
    const angle = calculateRightElbowAngle(
      keypointMap.get('rightShoulder')!,
      keypointMap.get('rightElbow')!,
      keypointMap.get('rightWrist')!
    );
    angles.push(angle);
  }
  
  // Calculate left knee angle
  if (keypointMap.has('leftHip') && keypointMap.has('leftKnee') && keypointMap.has('leftAnkle')) {
    const angle = calculateLeftKneeAngle(
      keypointMap.get('leftHip')!,
      keypointMap.get('leftKnee')!,
      keypointMap.get('leftAnkle')!
    );
    angles.push(angle);
  }
  
  // Calculate right knee angle
  if (keypointMap.has('rightHip') && keypointMap.has('rightKnee') && keypointMap.has('rightAnkle')) {
    const angle = calculateRightKneeAngle(
      keypointMap.get('rightHip')!,
      keypointMap.get('rightKnee')!,
      keypointMap.get('rightAnkle')!
    );
    angles.push(angle);
  }
  
  // Calculate left hip angle
  if (keypointMap.has('leftShoulder') && keypointMap.has('leftHip') && keypointMap.has('leftKnee')) {
    const angle = calculateLeftHipAngle(
      keypointMap.get('leftShoulder')!,
      keypointMap.get('leftHip')!,
      keypointMap.get('leftKnee')!
    );
    angles.push(angle);
  }
  
  // Calculate right hip angle
  if (keypointMap.has('rightShoulder') && keypointMap.has('rightHip') && keypointMap.has('rightKnee')) {
    const angle = calculateRightHipAngle(
      keypointMap.get('rightShoulder')!,
      keypointMap.get('rightHip')!,
      keypointMap.get('rightKnee')!
    );
    angles.push(angle);
  }
  
  return angles;
};
