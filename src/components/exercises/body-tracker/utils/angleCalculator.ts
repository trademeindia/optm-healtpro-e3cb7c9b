
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateAngle, getPoint } from './geometryUtils';

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
  
  // Calculate left elbow angle (shoulder - elbow - wrist)
  if (keypointMap.has('leftShoulder') && keypointMap.has('leftElbow') && keypointMap.has('leftWrist')) {
    const shoulder = keypointMap.get('leftShoulder')!;
    const elbow = keypointMap.get('leftElbow')!;
    const wrist = keypointMap.get('leftWrist')!;
    
    const angle = calculateAngle(
      getPoint(shoulder),
      getPoint(elbow),
      getPoint(wrist)
    );
    
    angles.push({
      joint: 'Left Elbow',
      angle: angle
    });
  }
  
  // Calculate right elbow angle (shoulder - elbow - wrist)
  if (keypointMap.has('rightShoulder') && keypointMap.has('rightElbow') && keypointMap.has('rightWrist')) {
    const shoulder = keypointMap.get('rightShoulder')!;
    const elbow = keypointMap.get('rightElbow')!;
    const wrist = keypointMap.get('rightWrist')!;
    
    const angle = calculateAngle(
      getPoint(shoulder),
      getPoint(elbow),
      getPoint(wrist)
    );
    
    angles.push({
      joint: 'Right Elbow',
      angle: angle
    });
  }
  
  // Calculate left knee angle (hip - knee - ankle)
  if (keypointMap.has('leftHip') && keypointMap.has('leftKnee') && keypointMap.has('leftAnkle')) {
    const hip = keypointMap.get('leftHip')!;
    const knee = keypointMap.get('leftKnee')!;
    const ankle = keypointMap.get('leftAnkle')!;
    
    const angle = calculateAngle(
      getPoint(hip),
      getPoint(knee),
      getPoint(ankle)
    );
    
    angles.push({
      joint: 'Left Knee',
      angle: angle
    });
  }
  
  // Calculate right knee angle (hip - knee - ankle)
  if (keypointMap.has('rightHip') && keypointMap.has('rightKnee') && keypointMap.has('rightAnkle')) {
    const hip = keypointMap.get('rightHip')!;
    const knee = keypointMap.get('rightKnee')!;
    const ankle = keypointMap.get('rightAnkle')!;
    
    const angle = calculateAngle(
      getPoint(hip),
      getPoint(knee),
      getPoint(ankle)
    );
    
    angles.push({
      joint: 'Right Knee',
      angle: angle
    });
  }
  
  // Calculate left hip angle (shoulder - hip - knee)
  if (keypointMap.has('leftShoulder') && keypointMap.has('leftHip') && keypointMap.has('leftKnee')) {
    const shoulder = keypointMap.get('leftShoulder')!;
    const hip = keypointMap.get('leftHip')!;
    const knee = keypointMap.get('leftKnee')!;
    
    const angle = calculateAngle(
      getPoint(shoulder),
      getPoint(hip),
      getPoint(knee)
    );
    
    angles.push({
      joint: 'Left Hip',
      angle: angle
    });
  }
  
  // Calculate right hip angle (shoulder - hip - knee)
  if (keypointMap.has('rightShoulder') && keypointMap.has('rightHip') && keypointMap.has('rightKnee')) {
    const shoulder = keypointMap.get('rightShoulder')!;
    const hip = keypointMap.get('rightHip')!;
    const knee = keypointMap.get('rightKnee')!;
    
    const angle = calculateAngle(
      getPoint(shoulder),
      getPoint(hip),
      getPoint(knee)
    );
    
    angles.push({
      joint: 'Right Hip',
      angle: angle
    });
  }
  
  return angles;
};
