
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

/**
 * Extracts angles between body keypoints from Human.js detection results
 * Enhanced to provide more accurate and stable measurements
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
    return angles;
  }
  
  const body = result.body[0];
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 15) {
    return angles;
  }

  try {
    // Extract specific keypoints needed for angle calculations
    // Using a more robust method to find keypoints by name or index
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
    const neck = findKeypoint(keypoints, ['neck'], 0);
    
    // Use a lower confidence threshold for better detection in challenging conditions
    const confidenceThreshold = 0.2;
    
    // Calculate knee angles
    let leftKneeAngle = null;
    let rightKneeAngle = null;
    
    if (leftHip && leftKnee && leftAnkle && 
        leftHip.score > confidenceThreshold && 
        leftKnee.score > confidenceThreshold && 
        leftAnkle.score > confidenceThreshold) {
      leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    }
    
    if (rightHip && rightKnee && rightAnkle && 
        rightHip.score > confidenceThreshold && 
        rightKnee.score > confidenceThreshold && 
        rightAnkle.score > confidenceThreshold) {
      rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    }
    
    // Use the angle with higher confidence, or average them if both are available
    if (leftKneeAngle !== null && rightKneeAngle !== null) {
      const leftConfidence = Math.min(leftHip.score, leftKnee.score, leftAnkle.score);
      const rightConfidence = Math.min(rightHip.score, rightKnee.score, rightAnkle.score);
      
      if (leftConfidence > rightConfidence) {
        angles.kneeAngle = leftKneeAngle;
      } else if (rightConfidence > leftConfidence) {
        angles.kneeAngle = rightKneeAngle;
      } else {
        // Equal confidence, take average
        angles.kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
      }
    } else if (leftKneeAngle !== null) {
      angles.kneeAngle = leftKneeAngle;
    } else if (rightKneeAngle !== null) {
      angles.kneeAngle = rightKneeAngle;
    }
    
    // Calculate hip angles using the same approach
    let leftHipAngle = null;
    let rightHipAngle = null;
    
    if (leftShoulder && leftHip && leftKnee && 
        leftShoulder.score > confidenceThreshold && 
        leftHip.score > confidenceThreshold && 
        leftKnee.score > confidenceThreshold) {
      leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    }
    
    if (rightShoulder && rightHip && rightKnee && 
        rightShoulder.score > confidenceThreshold && 
        rightHip.score > confidenceThreshold && 
        rightKnee.score > confidenceThreshold) {
      rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    }
    
    // Determine best hip angle
    if (leftHipAngle !== null && rightHipAngle !== null) {
      const leftConfidence = Math.min(leftShoulder.score, leftHip.score, leftKnee.score);
      const rightConfidence = Math.min(rightShoulder.score, rightHip.score, rightKnee.score);
      
      if (leftConfidence > rightConfidence) {
        angles.hipAngle = leftHipAngle;
      } else if (rightConfidence > leftConfidence) {
        angles.hipAngle = rightHipAngle;
      } else {
        angles.hipAngle = (leftHipAngle + rightHipAngle) / 2;
      }
    } else if (leftHipAngle !== null) {
      angles.hipAngle = leftHipAngle;
    } else if (rightHipAngle !== null) {
      angles.hipAngle = rightHipAngle;
    }
    
    // Calculate shoulder angle
    if (rightHip && rightShoulder && rightElbow && 
        rightHip.score > confidenceThreshold && 
        rightShoulder.score > confidenceThreshold && 
        rightElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
    } else if (leftHip && leftShoulder && leftElbow && 
              leftHip.score > confidenceThreshold && 
              leftShoulder.score > confidenceThreshold && 
              leftElbow.score > confidenceThreshold) {
      angles.shoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
    }
    
    // Calculate elbow angle
    if (leftShoulder && leftElbow && leftWrist && 
        leftShoulder.score > confidenceThreshold && 
        leftElbow.score > confidenceThreshold && 
        leftWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    } else if (rightShoulder && rightElbow && rightWrist && 
              rightShoulder.score > confidenceThreshold && 
              rightElbow.score > confidenceThreshold && 
              rightWrist.score > confidenceThreshold) {
      angles.elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    }
    
    // Calculate ankle angle
    if (leftKnee && leftAnkle && 
        leftKnee.score > confidenceThreshold && 
        leftAnkle.score > confidenceThreshold) {
      // For ankle, we need a third point. We can use the toe or create a virtual point
      const toeX = leftAnkle.x + (leftAnkle.x - leftKnee.x) * 0.3;
      const toeY = leftAnkle.y + (leftAnkle.y - leftKnee.y) * 0.3;
      const virtualToe = { x: toeX, y: toeY, score: leftAnkle.score };
      
      angles.ankleAngle = calculateAngle(leftKnee, leftAnkle, virtualToe);
    } else if (rightKnee && rightAnkle && 
              rightKnee.score > confidenceThreshold && 
              rightAnkle.score > confidenceThreshold) {
      const toeX = rightAnkle.x + (rightAnkle.x - rightKnee.x) * 0.3;
      const toeY = rightAnkle.y + (rightAnkle.y - rightKnee.y) * 0.3;
      const virtualToe = { x: toeX, y: toeY, score: rightAnkle.score };
      
      angles.ankleAngle = calculateAngle(rightKnee, rightAnkle, virtualToe);
    }
    
    // Calculate neck angle if neck point is available
    if (neck && leftShoulder && rightShoulder &&
        neck.score > confidenceThreshold &&
        leftShoulder.score > confidenceThreshold &&
        rightShoulder.score > confidenceThreshold) {
      // Create a virtual point directly below the neck for alignment
      const verticalPointX = neck.x;
      const verticalPointY = neck.y + 50; // 50 pixels down
      const verticalPoint = { x: verticalPointX, y: verticalPointY, score: neck.score };
      
      // Midpoint between shoulders
      const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
      const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const midShoulder = { x: midShoulderX, y: midShoulderY, score: Math.min(leftShoulder.score, rightShoulder.score) };
      
      angles.neckAngle = calculateAngle(verticalPoint, neck, midShoulder);
    }
    
    // Round angles to improve readability and reduce small variations
    Object.keys(angles).forEach(key => {
      const angleKey = key as keyof BodyAngles;
      if (angles[angleKey] !== null) {
        angles[angleKey] = Math.round(angles[angleKey] as number);
      }
    });
    
    return angles;
  } catch (error) {
    console.error('Error calculating angles:', error);
    return angles;
  }
};

/**
 * Enhanced function to find keypoint by multiple names or index with better error handling
 */
function findKeypoint(keypoints: any[], possibleNames: string[], index: number): any {
  if (!keypoints || !Array.isArray(keypoints)) {
    return null;
  }
  
  // First try to find by part name
  for (const name of possibleNames) {
    const keypoint = keypoints.find(kp => 
      (kp && kp.part === name) || (kp && kp.name === name)
    );
    if (keypoint && keypoint.score > 0) return keypoint;
  }
  
  // Then try to find by index
  if (index >= 0 && index < keypoints.length && keypoints[index] && keypoints[index].score > 0) {
    return keypoints[index];
  }
  
  return null;
}

/**
 * Calculate angle between three points in degrees
 * Improved for better accuracy and error handling
 */
function calculateAngle(pointA: any, pointB: any, pointC: any): number {
  try {
    // Extract coordinates, handling both normalized and pixel coordinates
    const getX = (point: any) => {
      if (point === null) return null;
      if (typeof point.x === 'number') return point.x;
      if (point.position && typeof point.position.x === 'number') return point.position.x;
      return null;
    };
    
    const getY = (point: any) => {
      if (point === null) return null;
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
      return 180; // Default value if coordinates are invalid
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
      return 180; // Default value for invalid magnitudes
    }
    
    // Calculate angle in radians and convert to degrees
    const cosAngle = Math.max(-1, Math.min(1, dotProduct / (mag1 * mag2)));
    const angleRad = Math.acos(cosAngle);
    const angleDeg = angleRad * (180 / Math.PI);
    
    return angleDeg;
  } catch (error) {
    console.error('Error in angle calculation:', error);
    return 180; // Default angle on error
  }
}
