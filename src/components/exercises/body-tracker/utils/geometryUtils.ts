
import type { Point } from '../types/geometry';
import { BodyKeypoint } from '@vladmandic/human';
import { JointAngle } from '../types';

// Calculate angle between three points
export const calculateAngle = (
  p1: Point,
  p2: Point,
  p3: Point
): number => {
  // Convert to vectors
  const vec1 = {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
  
  const vec2 = {
    x: p3.x - p2.x,
    y: p3.y - p2.y
  };
  
  // Calculate dot product
  const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
  const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
  
  // Calculate angle in degrees
  const angleRad = Math.acos(dotProduct / (mag1 * mag2));
  const angleDeg = angleRad * (180 / Math.PI);
  
  return Math.round(angleDeg);
};

// Helper function to extract point coordinates from keypoint
export const getPoint = (keypoint: BodyKeypoint): Point => {
  return {
    x: keypoint.position.x,
    y: keypoint.position.y
  };
};
