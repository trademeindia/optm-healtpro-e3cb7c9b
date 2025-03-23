
import * as posenet from '@tensorflow-models/posenet';

/**
 * Calculate angle between three points (in degrees)
 * For example: angle between hip-knee-ankle for knee angle
 */
export const calculateAngle = (
  pointA: posenet.Keypoint,
  pointB: posenet.Keypoint, // middle point (apex of the angle)
  pointC: posenet.Keypoint
): number => {
  if (!pointA || !pointB || !pointC) {
    return 0;
  }

  if (pointA.score < 0.5 || pointB.score < 0.5 || pointC.score < 0.5) {
    // Low confidence in one or more points
    return 0;
  }

  const { x: x1, y: y1 } = pointA.position;
  const { x: x2, y: y2 } = pointB.position;
  const { x: x3, y: y3 } = pointC.position;

  // Calculate vectors
  const vec1 = { x: x1 - x2, y: y1 - y2 };
  const vec2 = { x: x3 - x2, y: y3 - y2 };

  // Calculate dot product
  const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;

  // Calculate magnitudes
  const vec1Magnitude = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
  const vec2Magnitude = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);

  // Calculate angle in radians
  const angleInRadians = Math.acos(
    Math.min(1, Math.max(-1, dotProduct / (vec1Magnitude * vec2Magnitude)))
  );

  // Convert to degrees
  const angleInDegrees = (angleInRadians * 180) / Math.PI;

  return angleInDegrees;
};
