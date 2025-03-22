
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from '../types';

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
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  
  const scaleX = canvasSize.width / videoWidth;
  const scaleY = canvasSize.height / videoHeight;
  
  // Draw skeleton lines
  drawSkeleton(ctx, pose.keypoints, minPartConfidence, scaleX, scaleY);
  
  // Draw keypoints
  drawKeypoints(ctx, pose.keypoints, minPartConfidence, scaleX, scaleY);
  
  // Draw angle indicators if available
  if (kneeAngle !== null) {
    drawAngleIndicator(ctx, pose, 'knee', kneeAngle, scaleX, scaleY);
  }
  
  if (hipAngle !== null) {
    drawAngleIndicator(ctx, pose, 'hip', hipAngle, scaleX, scaleY);
  }
  
  // Draw current state indicator
  drawStateIndicator(ctx, currentSquatState, canvasSize);
};

// Draw skeleton lines connecting keypoints
const drawSkeleton = (
  ctx: CanvasRenderingContext2D,
  keypoints: posenet.Keypoint[],
  minConfidence: number,
  scaleX: number,
  scaleY: number
) => {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );
  
  // Set line style
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 3;
  
  // Draw lines
  adjacentKeyPoints.forEach((keypoints) => {
    ctx.beginPath();
    ctx.moveTo(keypoints[0].position.x * scaleX, keypoints[0].position.y * scaleY);
    ctx.lineTo(keypoints[1].position.x * scaleX, keypoints[1].position.y * scaleY);
    ctx.stroke();
  });
};

// Draw keypoints
const drawKeypoints = (
  ctx: CanvasRenderingContext2D,
  keypoints: posenet.Keypoint[],
  minConfidence: number,
  scaleX: number,
  scaleY: number
) => {
  keypoints.forEach((keypoint) => {
    if (keypoint.score < minConfidence) return;
    
    const { x, y } = keypoint.position;
    
    // Draw keypoint circle
    ctx.beginPath();
    ctx.arc(x * scaleX, y * scaleY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    
    // Draw keypoint label
    ctx.font = '12px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(keypoint.part, x * scaleX + 7, y * scaleY - 7);
  });
};

// Draw angle indicator
const drawAngleIndicator = (
  ctx: CanvasRenderingContext2D,
  pose: posenet.Pose,
  angleType: 'knee' | 'hip',
  angle: number,
  scaleX: number,
  scaleY: number
) => {
  // Find the position to draw the angle
  let position;
  
  if (angleType === 'knee') {
    const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = pose.keypoints.find(kp => kp.part === 'rightKnee');
    
    if (leftKnee && leftKnee.score > 0.5) {
      position = leftKnee.position;
    } else if (rightKnee && rightKnee.score > 0.5) {
      position = rightKnee.position;
    } else {
      return; // Can't find a good position
    }
  } else { // hip
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    
    if (leftHip && leftHip.score > 0.5) {
      position = leftHip.position;
    } else if (rightHip && rightHip.score > 0.5) {
      position = rightHip.position;
    } else {
      return; // Can't find a good position
    }
  }
  
  // Draw background for text
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(
    position.x * scaleX + 15, 
    position.y * scaleY - 10, 
    75, 
    20
  );
  
  // Draw text
  ctx.font = '12px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `${angleType === 'knee' ? 'Knee' : 'Hip'}: ${angle}°`, 
    position.x * scaleX + 20, 
    position.y * scaleY + 5
  );
};

// Draw state indicator at the top of the canvas
const drawStateIndicator = (
  ctx: CanvasRenderingContext2D,
  state: SquatState,
  canvasSize: { width: number; height: number }
) => {
  let stateText = '';
  let stateColor = '';
  
  switch (state) {
    case SquatState.STANDING:
      stateText = 'Standing';
      stateColor = '#3b82f6'; // Blue
      break;
    case SquatState.MID_SQUAT:
      stateText = 'Squatting Down';
      stateColor = '#f59e0b'; // Yellow/Orange
      break;
    case SquatState.BOTTOM_SQUAT:
      stateText = 'Bottom Position';
      stateColor = '#22c55e'; // Green
      break;
  }
  
  // Draw pill-shaped background
  const textWidth = 120;
  const textHeight = 24;
  const padding = 10;
  
  ctx.fillStyle = stateColor;
  ctx.beginPath();
  ctx.roundRect(
    canvasSize.width / 2 - textWidth / 2 - padding,
    10,
    textWidth + padding * 2,
    textHeight + padding / 2,
    8
  );
  ctx.fill();
  
  // Draw text
  ctx.font = 'bold 14px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(
    stateText,
    canvasSize.width / 2,
    25
  );
  ctx.textAlign = 'start'; // Reset text alignment
};
