
import * as tf from '@tensorflow/tfjs';
import * as Human from '@vladmandic/human';

// Configure TensorFlow.js - prefer WebGL for best performance
if (typeof window !== 'undefined') {
  tf.setBackend('webgl');
  console.log('TensorFlow backend:', tf.getBackend());
}

// Create Human instance with optimized configuration for body pose analysis
const humanConfig: Human.Config = {
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
  filter: { enabled: true, equalization: false },
  face: { enabled: false },
  body: { 
    enabled: true,
    modelPath: 'blazepose-heavy.json',
    maxDetected: 1, // Focus on one person at a time
    scoreThreshold: 0.3,
    nmsRadius: 20,
  },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false }
};

// Initialize Human instance
export const human = new Human.Human(humanConfig);

// Pre-warm model to avoid delay on first detection
export const warmupModel = async (): Promise<void> => {
  try {
    console.log('Warming up Human.js model...');
    await human.load();
    console.log('Human.js model loaded and ready');
    
    // Optional: run a dummy detection to fully warm up the model
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 64, 64);
        await human.detect(canvas);
      }
    }
  } catch (error) {
    console.error('Error warming up Human.js model:', error);
  }
};

// Helper function for calculating angle between three points
export const calculateAngle = (
  a: [number, number], 
  b: [number, number], 
  c: [number, number]
): number => {
  const ab = [b[0] - a[0], b[1] - a[1]];
  const cb = [b[0] - c[0], b[1] - c[1]];
  
  const dot = (ab[0] * cb[0] + ab[1] * cb[1]);
  const cross = (ab[0] * cb[1] - ab[1] * cb[0]);
  
  let angle = Math.atan2(cross, dot);
  
  // Convert to degrees and ensure positive value
  angle = Math.abs(angle * 180 / Math.PI);
  
  // Ensure angle is in [0, 180] range for human-readable angles
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Extract angles from detected body pose
export const extractBodyAngles = (result: Human.Result): { 
  kneeAngle: number | null;
  hipAngle: number | null; 
  shoulderAngle: number | null;
  elbowAngle: number | null;
  ankleAngle: number | null;
  neckAngle: number | null;
} => {
  const angles = {
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null,
    elbowAngle: null,
    ankleAngle: null,
    neckAngle: null
  };
  
  if (!result.body || result.body.length === 0) {
    return angles;
  }
  
  const body = result.body[0];
  
  // Map key points for angle calculations (using BlazePose keypoint indices)
  const keypoints = body.keypoints;
  
  if (!keypoints || keypoints.length < 25) {
    return angles;
  }
  
  // Calculate knee angle (hip-knee-ankle)
  try {
    const leftHip = [keypoints[23].x, keypoints[23].y] as [number, number];
    const leftKnee = [keypoints[25].x, keypoints[25].y] as [number, number];
    const leftAnkle = [keypoints[27].x, keypoints[27].y] as [number, number];
    
    const rightHip = [keypoints[24].x, keypoints[24].y] as [number, number];
    const rightKnee = [keypoints[26].x, keypoints[26].y] as [number, number];
    const rightAnkle = [keypoints[28].x, keypoints[28].y] as [number, number];
    
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    angles.kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate knee angle', e);
  }
  
  // Calculate hip angle (shoulder-hip-knee)
  try {
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    const leftHip = [keypoints[23].x, keypoints[23].y] as [number, number];
    const leftKnee = [keypoints[25].x, keypoints[25].y] as [number, number];
    
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    const rightHip = [keypoints[24].x, keypoints[24].y] as [number, number];
    const rightKnee = [keypoints[26].x, keypoints[26].y] as [number, number];
    
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    
    angles.hipAngle = (leftHipAngle + rightHipAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate hip angle', e);
  }
  
  // Calculate shoulder angle (neck-shoulder-elbow)
  try {
    const neck = [keypoints[0].x, keypoints[0].y] as [number, number];
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    const leftElbow = [keypoints[13].x, keypoints[13].y] as [number, number];
    
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    const rightElbow = [keypoints[14].x, keypoints[14].y] as [number, number];
    
    const leftShoulderAngle = calculateAngle(neck, leftShoulder, leftElbow);
    const rightShoulderAngle = calculateAngle(neck, rightShoulder, rightElbow);
    
    angles.shoulderAngle = (leftShoulderAngle + rightShoulderAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate shoulder angle', e);
  }
  
  // Calculate elbow angle (shoulder-elbow-wrist)
  try {
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    const leftElbow = [keypoints[13].x, keypoints[13].y] as [number, number];
    const leftWrist = [keypoints[15].x, keypoints[15].y] as [number, number];
    
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    const rightElbow = [keypoints[14].x, keypoints[14].y] as [number, number];
    const rightWrist = [keypoints[16].x, keypoints[16].y] as [number, number];
    
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    
    angles.elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
  } catch (e) {
    console.log('Failed to calculate elbow angle', e);
  }
  
  // Calculate neck angle (between shoulders and nose)
  try {
    const nose = [keypoints[0].x, keypoints[0].y] as [number, number];
    const leftShoulder = [keypoints[11].x, keypoints[11].y] as [number, number];
    const rightShoulder = [keypoints[12].x, keypoints[12].y] as [number, number];
    
    // Calculate midpoint between shoulders
    const midShoulders: [number, number] = [
      (leftShoulder[0] + rightShoulder[0]) / 2,
      (leftShoulder[1] + rightShoulder[1]) / 2
    ];
    
    // Calculate a point directly below the nose at the same y-level as mid shoulders
    const verticalPoint: [number, number] = [nose[0], midShoulders[1]];
    
    angles.neckAngle = calculateAngle(verticalPoint, nose, midShoulders);
  } catch (e) {
    console.log('Failed to calculate neck angle', e);
  }
  
  return angles;
};

// Additional biomarkers extracted from pose data
export const extractBiomarkers = (result: Human.Result, angles: any): Record<string, any> => {
  const biomarkers: Record<string, any> = {};
  
  if (!result.body || result.body.length === 0) {
    return biomarkers;
  }
  
  try {
    const body = result.body[0];
    
    // Calculate overall posture score (0-100)
    let postureScore = 100;
    
    // Check neck alignment (ideal is around 0 degrees from vertical)
    if (angles.neckAngle !== null) {
      const neckDeviationFromIdeal = Math.abs(angles.neckAngle - 0);
      postureScore -= neckDeviationFromIdeal * 0.5; // Reduce score based on deviation
    }
    
    // Check shoulder symmetry
    const leftShoulder = body.keypoints[11];
    const rightShoulder = body.keypoints[12];
    if (leftShoulder && rightShoulder) {
      const shoulderHeightDifference = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderSymmetryScore = 100 - (shoulderHeightDifference * 100);
      biomarkers.shoulderSymmetry = Math.max(0, Math.min(100, shoulderSymmetryScore));
      
      // Factor shoulder symmetry into posture score
      postureScore -= (100 - biomarkers.shoulderSymmetry) * 0.2;
    }
    
    // Calculate body balance (how centered the body is)
    const nose = body.keypoints[0];
    const hips = [(body.keypoints[23].x + body.keypoints[24].x) / 2, 
                  (body.keypoints[23].y + body.keypoints[24].y) / 2];
    
    if (nose) {
      const horizontalDeviation = Math.abs(nose.x - hips[0]);
      const balanceScore = 100 - (horizontalDeviation * 100);
      biomarkers.balanceScore = Math.max(0, Math.min(100, balanceScore));
      
      // Factor balance into posture score
      postureScore -= (100 - biomarkers.balanceScore) * 0.2;
    }
    
    biomarkers.postureScore = Math.max(0, Math.min(100, postureScore));
    
    // Calculate movement fluidity (if temporal data is available)
    // This would require comparing with previous frames
    
  } catch (e) {
    console.error('Error calculating biomarkers:', e);
  }
  
  return biomarkers;
};
