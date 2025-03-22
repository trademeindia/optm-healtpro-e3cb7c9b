
import * as posenet from '@tensorflow-models/posenet';

// Calculate angle between three keypoints
export const calculateAngle = (
  a: posenet.Keypoint | undefined, 
  b: posenet.Keypoint | undefined, 
  c: posenet.Keypoint | undefined
): number => {
  if (!a || !b || !c || !a.position || !b.position || !c.position) {
    return 0;
  }

  const vectorBA = {
    x: a.position.x - b.position.x,
    y: a.position.y - b.position.y
  };
  
  const vectorBC = {
    x: c.position.x - b.position.x,
    y: c.position.y - b.position.y
  };
  
  const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;
  const magnitudeBA = Math.sqrt(vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
  
  if (magnitudeBA === 0 || magnitudeBC === 0) {
    return 0;
  }
  
  // Ensure value is in valid range for acos
  let cosTheta = dotProduct / (magnitudeBA * magnitudeBC);
  cosTheta = Math.max(-1, Math.min(1, cosTheta));
  
  let angle = Math.acos(cosTheta) * (180 / Math.PI);
  
  // Ensure angle is in the range 0-180
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Calculate joint angles based on pose keypoints
export const calculateJointAngles = (pose: posenet.Pose) => {
  const keypoints = pose.keypoints;
  
  // Find the required keypoints
  const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
  const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
  const leftElbow = keypoints.find(kp => kp.part === 'leftElbow');
  const rightElbow = keypoints.find(kp => kp.part === 'rightElbow');
  const leftWrist = keypoints.find(kp => kp.part === 'leftWrist');
  const rightWrist = keypoints.find(kp => kp.part === 'rightWrist');
  const leftHip = keypoints.find(kp => kp.part === 'leftHip');
  const rightHip = keypoints.find(kp => kp.part === 'rightHip');
  const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
  const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
  const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
  const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
  
  // Calculate angles
  return {
    leftElbow: calculateAngle(leftShoulder, leftElbow, leftWrist),
    rightElbow: calculateAngle(rightShoulder, rightElbow, rightWrist),
    leftShoulder: calculateAngle(leftElbow, leftShoulder, leftHip),
    rightShoulder: calculateAngle(rightElbow, rightShoulder, rightHip),
    leftHip: calculateAngle(leftShoulder, leftHip, leftKnee),
    rightHip: calculateAngle(rightShoulder, rightHip, rightKnee),
    leftKnee: calculateAngle(leftHip, leftKnee, leftAnkle),
    rightKnee: calculateAngle(rightHip, rightKnee, rightAnkle)
  };
};
