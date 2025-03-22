
import * as posenet from '@tensorflow-models/posenet';

// Calculate angle between three points (in degrees)
export const calculateAngle = (a: posenet.Keypoint, b: posenet.Keypoint, c: posenet.Keypoint): number => {
  const radians = Math.atan2(c.position.y - b.position.y, c.position.x - b.position.x) -
                 Math.atan2(a.position.y - b.position.y, a.position.x - b.position.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};
