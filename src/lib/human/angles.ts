
import { BodyAngles } from './types';

type Point = {
  x: number;
  y: number;
  z?: number;
  score?: number;
};

type Keypoint = Point & {
  part: string;
};

type Body = {
  keypoints: Keypoint[];
  score?: number;
};

export const calculateBodyAngles = (body: Body): BodyAngles => {
  // Initialize with default values
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };

  // If no keypoints, return empty angles
  if (!body.keypoints || body.keypoints.length === 0) {
    return angles;
  }

  // Map keypoints by part name for easier access
  const keypointMap = new Map<string, Keypoint>();
  for (const kp of body.keypoints) {
    if (kp.score && kp.score > 0.5) {
      keypointMap.set(kp.part, kp);
    }
  }

  // Calculate knee angle
  const hip = keypointMap.get('rightHip') || keypointMap.get('leftHip');
  const knee = keypointMap.get('rightKnee') || keypointMap.get('leftKnee');
  const ankle = keypointMap.get('rightAnkle') || keypointMap.get('leftAnkle');
  
  if (hip && knee && ankle) {
    angles.kneeAngle = calculateAngle(hip, knee, ankle);
  }

  // Calculate hip angle
  const shoulder = keypointMap.get('rightShoulder') || keypointMap.get('leftShoulder');
  
  if (shoulder && hip && knee) {
    angles.hipAngle = calculateAngle(shoulder, hip, knee);
  }

  // Calculate shoulder angle
  const elbow = keypointMap.get('rightElbow') || keypointMap.get('leftElbow');
  
  if (elbow && shoulder && hip) {
    angles.shoulderAngle = calculateAngle(elbow, shoulder, hip);
  }

  // Calculate elbow angle
  const wrist = keypointMap.get('rightWrist') || keypointMap.get('leftWrist');
  
  if (wrist && elbow && shoulder) {
    angles.elbowAngle = calculateAngle(wrist, elbow, shoulder);
  }

  // Calculate ankle angle
  if (knee && ankle) {
    // For ankle angle, we need a point on the ground
    const groundPoint = { 
      x: ankle.x, 
      y: ankle.y + 50 // Arbitrary point below the ankle
    };
    angles.ankleAngle = calculateAngle(knee, ankle, groundPoint);
  }

  // Calculate neck angle
  const nose = keypointMap.get('nose');
  
  if (nose && shoulder) {
    // For neck angle, we use the vertical line and the line from shoulder to nose
    const verticalPoint = { x: shoulder.x, y: shoulder.y - 100 }; // Point directly above shoulder
    angles.neckAngle = calculateAngle(verticalPoint, shoulder, nose);
  }

  return angles;
};

// Calculate angle between three points in degrees
const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
  try {
    // Calculate vectors
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    // Calculate dot product
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    // Calculate angle in radians
    const angleRad = Math.acos(Math.min(1, Math.max(-1, dotProduct / (mag1 * mag2))));
    
    // Convert to degrees
    const angleDeg = angleRad * (180 / Math.PI);
    
    return angleDeg;
  } catch (error) {
    console.error('Error calculating angle:', error);
    return 0;
  }
};
