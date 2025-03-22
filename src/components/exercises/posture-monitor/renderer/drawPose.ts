
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from '../types';
import { calculateJointAngles } from '../utils/angleCalculations';

// Draw keypoint on canvas
const drawKeypoint = (
  ctx: CanvasRenderingContext2D,
  keypoint: posenet.Keypoint,
  scaleX: number,
  scaleY: number,
  minConfidence: number,
  color = 'aqua',
  size = 5
) => {
  if (keypoint.score < minConfidence) return;
  
  const { x, y } = scaleKeypoint(keypoint, scaleX, scaleY);
  
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

// Draw line between two keypoints
const drawSegment = (
  ctx: CanvasRenderingContext2D,
  p1: posenet.Keypoint,
  p2: posenet.Keypoint,
  scaleX: number,
  scaleY: number,
  minConfidence: number,
  color = 'aqua',
  lineWidth = 2
) => {
  if (p1.score < minConfidence || p2.score < minConfidence) return;
  
  const { x: x1, y: y1 } = scaleKeypoint(p1, scaleX, scaleY);
  const { x: x2, y: y2 } = scaleKeypoint(p2, scaleX, scaleY);
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

// Scale keypoint position for display
const scaleKeypoint = (
  keypoint: posenet.Keypoint,
  scaleX: number,
  scaleY: number
) => {
  return {
    x: keypoint.position[0] * scaleX,
    y: keypoint.position[1] * scaleY
  };
};

// Draw angle display
const drawAngleDisplay = (
  ctx: CanvasRenderingContext2D,
  keypoint: posenet.Keypoint,
  angle: number | null,
  label: string,
  scaleX: number,
  scaleY: number,
  minConfidence: number,
  offsetX = 10,
  offsetY = 0
) => {
  if (keypoint.score < minConfidence || angle === null) return;
  
  const { x, y } = scaleKeypoint(keypoint, scaleX, scaleY);
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  const text = `${label}: ${Math.round(angle)}°`;
  ctx.strokeText(text, x + offsetX, y + offsetY);
  ctx.fillText(text, x + offsetX, y + offsetY);
};

// Draw state info box
const drawStateInfo = (
  ctx: CanvasRenderingContext2D,
  currentSquatState: SquatState,
  canvasSize: { width: number; height: number }
) => {
  const stateText = getStateDisplayText(currentSquatState);
  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  
  // Position in top-right corner with padding
  const padding = 20;
  const textWidth = ctx.measureText(stateText).width;
  const x = canvasSize.width - textWidth - padding;
  const y = padding + 20; // 20px for text height
  
  ctx.strokeText(stateText, x, y);
  ctx.fillText(stateText, x, y);
};

// Get display text for squat state
const getStateDisplayText = (state: SquatState): string => {
  switch (state) {
    case SquatState.STANDING:
      return 'Standing';
    case SquatState.MID_SQUAT:
      return 'Mid Squat';
    case SquatState.BOTTOM_SQUAT:
      return 'Bottom Position';
    default:
      return 'Unknown State';
  }
};

// Define skeleton connections
const skeleton = [
  ['nose', 'leftEye'], ['leftEye', 'leftEar'], 
  ['nose', 'rightEye'], ['rightEye', 'rightEar'],
  ['nose', 'leftShoulder'], ['nose', 'rightShoulder'],
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'], ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle']
];

// Main function to draw pose
export const drawPose = (
  ctx: CanvasRenderingContext2D,
  pose: posenet.Pose,
  canvasSize: { width: number; height: number },
  kneeAngle: number | null,
  hipAngle: number | null,
  currentSquatState: SquatState,
  videoWidth: number,
  videoHeight: number,
  minPartConfidence: number
) => {
  // Clear canvas first
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  
  // Calculate scale factors
  const scaleX = canvasSize.width / videoWidth;
  const scaleY = canvasSize.height / videoHeight;
  
  // Get keypoints dictionary
  const keypointsByName: { [key: string]: posenet.Keypoint } = {};
  pose.keypoints.forEach(keypoint => {
    keypointsByName[keypoint.part] = keypoint;
  });
  
  // Draw skeleton
  ctx.lineWidth = 2;
  skeleton.forEach(([partA, partB]) => {
    const keypointA = keypointsByName[partA];
    const keypointB = keypointsByName[partB];
    
    if (keypointA && keypointB) {
      // Color coding based on body segment
      let color = 'aqua';
      
      // Color legs differently based on squat state
      if ((partA.includes('Knee') || partB.includes('Knee') || 
           partA.includes('Ankle') || partB.includes('Ankle') ||
           partA.includes('Hip') || partB.includes('Hip')) && 
          (partA !== 'rightHip' || partB !== 'leftHip')) {
        
        if (currentSquatState === SquatState.BOTTOM_SQUAT) {
          color = 'lime'; // Green for bottom position
        } else if (currentSquatState === SquatState.MID_SQUAT) {
          color = 'yellow'; // Yellow for mid squat
        } else {
          color = 'aqua'; // Default for standing
        }
      }
      
      drawSegment(ctx, keypointA, keypointB, scaleX, scaleY, minPartConfidence, color);
    }
  });
  
  // Draw keypoints
  pose.keypoints.forEach(keypoint => {
    drawKeypoint(ctx, keypoint, scaleX, scaleY, minPartConfidence);
  });
  
  // Draw joint angles
  const angles = calculateJointAngles(pose);
  
  // Draw knee angles
  const leftKnee = keypointsByName['leftKnee'];
  const rightKnee = keypointsByName['rightKnee'];
  
  if (leftKnee) {
    drawAngleDisplay(ctx, leftKnee, angles.leftKnee, 'L-Knee', scaleX, scaleY, minPartConfidence, 10, 0);
  }
  
  if (rightKnee) {
    drawAngleDisplay(ctx, rightKnee, angles.rightKnee, 'R-Knee', scaleX, scaleY, minPartConfidence, -60, 0);
  }
  
  // Draw hip angles
  const leftHip = keypointsByName['leftHip'];
  const rightHip = keypointsByName['rightHip'];
  
  if (leftHip) {
    drawAngleDisplay(ctx, leftHip, angles.leftHip, 'L-Hip', scaleX, scaleY, minPartConfidence, 10, -20);
  }
  
  if (rightHip) {
    drawAngleDisplay(ctx, rightHip, angles.rightHip, 'R-Hip', scaleX, scaleY, minPartConfidence, -60, -20);
  }
  
  // Draw current state info
  drawStateInfo(ctx, currentSquatState, canvasSize);
};
