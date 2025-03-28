
import type { Result } from '@vladmandic/human';

// Calculate the angle between three points
export const calculateAngle = (a: [number, number], b: [number, number], c: [number, number]): number => {
  const ab = [b[0] - a[0], b[1] - a[1]];
  const cb = [b[0] - c[0], b[1] - c[1]];
  
  // Calculate dot product
  const dot = ab[0] * cb[0] + ab[1] * cb[1];
  
  // Calculate magnitudes
  const magAb = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
  const magCb = Math.sqrt(cb[0] * cb[0] + cb[1] * cb[1]);
  
  // Calculate angle in degrees
  let angle = Math.acos(dot / (magAb * magCb)) * (180 / Math.PI);
  
  // Prevent NaN
  if (isNaN(angle)) {
    angle = 0;
  }
  
  return angle;
};

// Extract body angles from a Human.js result
export const extractBodyAngles = (result: Result) => {
  // Initialize with null values
  const angles = {
    kneeAngle: null as number | null,
    hipAngle: null as number | null,
    shoulderAngle: null as number | null,
    elbowAngle: null as number | null,
    ankleAngle: null as number | null,
    neckAngle: null as number | null
  };
  
  if (!result || !result.body || result.body.length === 0 || !result.body[0].keypoints) {
    return angles;
  }
  
  const keypoints = result.body[0].keypoints;
  
  // Helper to get a keypoint's position
  const getPoint = (name: string): [number, number] | null => {
    const point = keypoints.find(kp => kp.part === name);
    return point && point.score > 0.5 ? [point.x, point.y] : null;
  };
  
  // Calculate knee angle (right leg)
  const rightHip = getPoint('rightHip');
  const rightKnee = getPoint('rightKnee');
  const rightAnkle = getPoint('rightAnkle');
  
  if (rightHip && rightKnee && rightAnkle) {
    angles.kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  }
  
  // Calculate hip angle
  const rightShoulder = getPoint('rightShoulder');
  if (rightShoulder && rightHip && rightKnee) {
    angles.hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  }
  
  // Calculate shoulder angle
  const rightElbow = getPoint('rightElbow');
  if (rightElbow && rightShoulder && rightHip) {
    angles.shoulderAngle = calculateAngle(rightElbow, rightShoulder, rightHip);
  }
  
  // Calculate elbow angle
  const rightWrist = getPoint('rightWrist');
  if (rightWrist && rightElbow && rightShoulder) {
    angles.elbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
  }
  
  // Calculate ankle angle
  if (rightKnee && rightAnkle) {
    const rightFoot = getPoint('rightFoot') || getPoint('rightHeel');
    if (rightFoot) {
      angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, rightFoot);
    }
  }
  
  // Calculate neck angle
  const nose = getPoint('nose');
  if (nose && rightShoulder && rightHip) {
    angles.neckAngle = calculateAngle(nose, rightShoulder, rightHip);
  }
  
  return angles;
};
