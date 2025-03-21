
import { KeyPoint } from '../types';

/**
 * Calculate the angle between three points in degrees
 */
export const calculateAngle = (
  a: KeyPoint, 
  b: KeyPoint, 
  c: KeyPoint
): number => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};

/**
 * Calculate the distance between two points
 */
export const calculateDistance = (a: KeyPoint, b: KeyPoint): number => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

/**
 * Calculate midpoint between two keypoints
 */
export const calculateMidpoint = (a: KeyPoint, b: KeyPoint): { x: number; y: number } => {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
};
