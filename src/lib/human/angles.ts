
import type { Result } from '@vladmandic/human';
import { BodyAngles } from './types';

/**
 * Calculate angle between three points
 */
const calculateAngle = (a: any, b: any, c: any): number | null => {
  if (!a || !b || !c) return null;
  
  // Convert to vectors
  const ab = { x: b.x - a.x, y: b.y - a.y };
  const cb = { x: b.x - c.x, y: b.y - c.y };
  
  // Calculate dot product
  const dot = ab.x * cb.x + ab.y * cb.y;
  
  // Calculate magnitudes
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  
  // Calculate angle
  if (magAB === 0 || magCB === 0) return null;
  
  const cosAngle = dot / (magAB * magCB);
  
  // Clamp for potential floating point errors
  const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
  
  // Convert to degrees
  const angleRad = Math.acos(clampedCosAngle);
  const angleDeg = angleRad * (180 / Math.PI);
  
  return Math.round(angleDeg);
};

/**
 * Extract body angles from detection result
 */
export const extractBodyAngles = (result: Result) => {
  // Default empty angles
  const angles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null,
  };
  
  // Check if there's a valid body detection
  if (!result || !result.body || result.body.length === 0 || !result.body[0].keypoints) {
    return angles;
  }
  
  // Get keypoints
  const keypoints = result.body[0].keypoints;
  
  // Find necessary keypoints
  const findKeypoint = (name: string) => keypoints.find(kp => kp.part === name);
  
  // Right side (typically more visible in frontal exercises)
  const rightHip = findKeypoint('rightHip');
  const rightKnee = findKeypoint('rightKnee');
  const rightAnkle = findKeypoint('rightAnkle');
  const rightShoulder = findKeypoint('rightShoulder');
  const rightElbow = findKeypoint('rightElbow');
  const rightWrist = findKeypoint('rightWrist');
  const nose = findKeypoint('nose');
  
  // Calculate knee angle (ankle -> knee -> hip)
  if (rightAnkle && rightKnee && rightHip) {
    angles.kneeAngle = calculateAngle(rightAnkle, rightKnee, rightHip);
  }
  
  // Calculate hip angle (knee -> hip -> shoulder)
  if (rightKnee && rightHip && rightShoulder) {
    angles.hipAngle = calculateAngle(rightKnee, rightHip, rightShoulder);
  }
  
  // Calculate shoulder angle (hip -> shoulder -> elbow)
  if (rightHip && rightShoulder && rightElbow) {
    angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
  }
  
  // Calculate elbow angle (shoulder -> elbow -> wrist)
  if (rightShoulder && rightElbow && rightWrist) {
    angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  }
  
  // Calculate ankle angle (knee -> ankle -> foot)
  // Note: 'foot' is not a standard keypoint, so we approximate
  if (rightKnee && rightAnkle) {
    // Create a point below the ankle to approximate foot position
    const foot = { 
      x: rightAnkle.x, 
      y: rightAnkle.y + 30 // 30 pixels below ankle
    };
    angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, foot);
  }
  
  // Calculate neck angle (approximation using shoulder and nose)
  if (rightShoulder && nose) {
    // Create a point vertically above shoulder to form baseline
    const verticalRef = { 
      x: rightShoulder.x, 
      y: rightShoulder.y - 50 // 50 pixels above shoulder 
    };
    angles.neckAngle = calculateAngle(rightShoulder, nose, verticalRef);
  }
  
  return angles;
};
