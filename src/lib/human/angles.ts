
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
    const point = keypoints.find(kp => kp.name === name);
    return point ? [point.position[0], point.position[1]] : null;
  };
  
  // Extract key points
  const hip = getPoint('hip right');
  const knee = getPoint('knee right');
  const ankle = getPoint('ankle right');
  const shoulder = getPoint('shoulder right');
  const elbow = getPoint('elbow right');
  const wrist = getPoint('wrist right');
  const neck = getPoint('neck');
  const ear = getPoint('ear right');
  
  // Calculate knee angle (between hip, knee, and ankle)
  if (hip && knee && ankle) {
    angles.kneeAngle = calculateAngle(hip, knee, ankle);
  }
  
  // Calculate hip angle (between shoulder, hip, and knee)
  if (shoulder && hip && knee) {
    angles.hipAngle = calculateAngle(shoulder, hip, knee);
  }
  
  // Calculate shoulder angle (between elbow, shoulder, and hip)
  if (elbow && shoulder && hip) {
    angles.shoulderAngle = calculateAngle(elbow, shoulder, hip);
  }
  
  // Calculate elbow angle (between shoulder, elbow, and wrist)
  if (shoulder && elbow && wrist) {
    angles.elbowAngle = calculateAngle(shoulder, elbow, wrist);
  }
  
  // Calculate ankle angle (between knee, ankle, and toe)
  const toe = getPoint('foot index right');
  if (knee && ankle && toe) {
    angles.ankleAngle = calculateAngle(knee, ankle, toe);
  }
  
  // Calculate neck angle (between ear, neck, and shoulder)
  if (ear && neck && shoulder) {
    angles.neckAngle = calculateAngle(ear, neck, shoulder);
  }
  
  return angles;
};
