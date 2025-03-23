
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts angles between body keypoints from Human.js detection results
 */
export const extractBodyAngles = (result: Human.Result): BodyAngles => {
  // Default angles object
  const angles: BodyAngles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  if (!result || !result.body || result.body.length === 0) {
    console.log("No body detected in result");
    return angles;
  }
  
  const body = result.body[0];
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 15) {
    console.log(`Insufficient keypoints detected: ${keypoints?.length || 0}`);
    return angles;
  }

  try {
    // Log all keypoints for debugging
    console.log("Detected keypoints:", keypoints.map(kp => ({ 
      part: kp.part || kp.name, 
      score: kp.score, 
      position: { x: kp.x, y: kp.y } 
    })));
    
    // Extract specific keypoints needed for angle calculations
    // Using BlazePose keypoint indices with better fallbacks
    const leftHip = findKeypoint(keypoints, ['leftHip', 'left_hip'], 23);
    const rightHip = findKeypoint(keypoints, ['rightHip', 'right_hip'], 24);
    const leftKnee = findKeypoint(keypoints, ['leftKnee', 'left_knee'], 25);
    const rightKnee = findKeypoint(keypoints, ['rightKnee', 'right_knee'], 26);
    const leftAnkle = findKeypoint(keypoints, ['leftAnkle', 'left_ankle'], 27);
    const rightAnkle = findKeypoint(keypoints, ['rightAnkle', 'right_ankle'], 28);
    const leftShoulder = findKeypoint(keypoints, ['leftShoulder', 'left_shoulder'], 11);
    const rightShoulder = findKeypoint(keypoints, ['rightShoulder', 'right_shoulder'], 12);
    const leftElbow = findKeypoint(keypoints, ['leftElbow', 'left_elbow'], 13);
    const rightElbow = findKeypoint(keypoints, ['rightElbow', 'right_elbow'], 14);
    const leftWrist = findKeypoint(keypoints, ['leftWrist', 'left_wrist'], 15);
    const rightWrist = findKeypoint(keypoints, ['rightWrist', 'right_wrist'], 16);
    
    // Only calculate if we have the necessary keypoints with sufficient confidence
    // Lower threshold to improve detection
    const confidenceThreshold = 0.2;
    
    // Calculate knee angle (average of left and right if both available)
    if (leftKnee && leftHip && leftAnkle && 
        leftKnee.score > confidenceThreshold && 
        leftHip.score > confidenceThreshold && 
        leftAnkle.score > confidenceThreshold) {
      angles.kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      console.log(`Left knee angle calculated: ${angles.kneeAngle}°`);
    } else if (rightKnee && rightHip && rightAnkle && 
              rightKnee.score > confidenceThreshold && 
              rightHip.score > confidenceThreshold && 
              rightAnkle.score > confidenceThreshold) {
      angles.kneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      console.log(`Right knee angle calculated: ${angles.kneeAngle}°`);
    }
    
    // Calculate hip angle (average of left and right if both available)
    if (leftShoulder && leftHip && leftKnee && 
        leftShoulder.score > confidenceThreshold && 
        leftHip.score > confidenceThreshold && 
        leftKnee.score > confidenceThreshold) {
      angles.hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
      console.log(`Left hip angle calculated: ${angles.hipAngle}°`);
    } else if (rightShoulder && rightHip && rightKnee && 
              rightShoulder.score > confidenceThreshold && 
              rightHip.score > confidenceThreshold && 
              rightKnee.score > confidenceThreshold) {
      angles.hipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
      console.log(`Right hip angle calculated: ${angles.hipAngle}°`);
    }
    
    // Calculate shoulder angle
    if (rightHip && rightShoulder && rightElbow && 
        rightHip.score > confidenceThreshold && 
        rightShoulder.score > confidenceThreshold && 
        rightElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
      console.log(`Right shoulder angle calculated: ${angles.shoulderAngle}°`);
    } else if (leftHip && leftShoulder && leftElbow && 
                leftHip.score > confidenceThreshold && 
                leftShoulder.score > confidenceThreshold && 
                leftElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
      console.log(`Left shoulder angle calculated: ${angles.shoulderAngle}°`);
    }
    
    // Calculate elbow angle
    if (leftShoulder && leftElbow && leftWrist && 
        leftShoulder.score > confidenceThreshold && 
        leftElbow.score > confidenceThreshold && 
        leftWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      console.log(`Left elbow angle calculated: ${angles.elbowAngle}°`);
    } else if (rightShoulder && rightElbow && rightWrist && 
                rightShoulder.score > confidenceThreshold && 
                rightElbow.score > confidenceThreshold && 
                rightWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      console.log(`Right elbow angle calculated: ${angles.elbowAngle}°`);
    }
    
    return angles;
  } catch (error) {
    console.error('Error calculating angles:', error);
    return angles;
  }
};

// Enhanced function to find keypoint by multiple names or index
function findKeypoint(keypoints: any[], possibleNames: string[], index: number) {
  // First try to find by part name
  for (const name of possibleNames) {
    const keypoint = keypoints.find(kp => 
      (kp.part === name) || (kp.name === name)
    );
    if (keypoint && keypoint.score > 0) return keypoint;
  }
  
  // Then try to find by index
  if (keypoints[index] && keypoints[index].score > 0) {
    return keypoints[index];
  }
  
  return null;
}

// Calculate angle between three points in degrees with improved handling
function calculateAngle(pointA: any, pointB: any, pointC: any): number {
  try {
    // Extract coordinates, handling both normalized and pixel coordinates
    const getX = (point: any) => {
      if (typeof point.x === 'number') return point.x;
      if (point.position && typeof point.position.x === 'number') return point.position.x;
      return null;
    };
    
    const getY = (point: any) => {
      if (typeof point.y === 'number') return point.y;
      if (point.position && typeof point.position.y === 'number') return point.position.y;
      return null;
    };
    
    const ax = getX(pointA);
    const ay = getY(pointA);
    const bx = getX(pointB);
    const by = getY(pointB);
    const cx = getX(pointC);
    const cy = getY(pointC);
    
    // Validate coordinates
    if (ax === null || ay === null || bx === null || by === null || cx === null || cy === null) {
      console.error('Invalid coordinates for angle calculation');
      return 180;
    }
    
    // Calculate vectors
    const vec1 = { x: ax - bx, y: ay - by };
    const vec2 = { x: cx - bx, y: cy - by };
    
    // Calculate dot product
    const dotProduct = vec1.x * vec2.x + vec1.y * vec2.y;
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    const mag2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    
    // Avoid division by zero
    if (mag1 === 0 || mag2 === 0) {
      console.error('Zero magnitude in angle calculation');
      return 180;
    }
    
    // Calculate angle in radians and convert to degrees
    const cosAngle = Math.max(-1, Math.min(1, dotProduct / (mag1 * mag2)));
    const angleRad = Math.acos(cosAngle);
    const angleDeg = angleRad * (180 / Math.PI);
    
    return angleDeg;
  } catch (error) {
    console.error('Error in angle calculation:', error);
    return 180; // Default angle
  }
}
