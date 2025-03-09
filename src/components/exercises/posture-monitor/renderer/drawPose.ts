
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from '../types';
import { adjacentKeyPoints } from './SkeletonRenderer';

export const drawPose = (
  ctx: CanvasRenderingContext2D, 
  pose: posenet.Pose, 
  canvasSize: { width: number, height: number },
  kneeAngle: number | null,
  hipAngle: number | null,
  currentSquatState: SquatState,
  videoWidth: number = 640,
  videoHeight: number = 480,
  minPartConfidence: number = 0.5
) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  
  // Calculate scale factors for the canvas
  const scaleX = canvasSize.width / videoWidth;
  const scaleY = canvasSize.height / videoHeight;
  
  // Draw keypoints
  pose.keypoints.forEach(keypoint => {
    if (keypoint.score > minPartConfidence) {
      // Determine color based on keypoint type
      let color = 'aqua';
      if (keypoint.part.includes('Shoulder') || keypoint.part.includes('Hip')) {
        color = 'yellow';
      } else if (keypoint.part.includes('Knee')) {
        color = 'lime';
      } else if (keypoint.part.includes('Ankle')) {
        color = 'orange'; 
      }
      
      // Draw point
      ctx.beginPath();
      ctx.arc(
        keypoint.position.x * scaleX, 
        keypoint.position.y * scaleY, 
        6, 0, 2 * Math.PI
      );
      ctx.fillStyle = color;
      ctx.fill();
      
      // Add keypoint label with more contrast for readability
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(
        keypoint.part, 
        keypoint.position.x * scaleX + 11, 
        keypoint.position.y * scaleY + 1
      );
      ctx.fillStyle = 'white';
      ctx.fillText(
        keypoint.part, 
        keypoint.position.x * scaleX + 10, 
        keypoint.position.y * scaleY
      );
    }
  });
  
  // Draw skeleton with gradient colors based on body part
  adjacentKeyPoints.forEach(([partA, partB]) => {
    const keyPointA = pose.keypoints.find(kp => kp.part === partA);
    const keyPointB = pose.keypoints.find(kp => kp.part === partB);
    
    if (keyPointA && keyPointB && 
        keyPointA.score > minPartConfidence && 
        keyPointB.score > minPartConfidence) {
          
      // Different colors for different body parts
      let color = 'white';
      if ((partA.includes('Shoulder') && partB.includes('Hip')) || 
          (partA.includes('Hip') && partB.includes('Shoulder'))) {
        // Torso connections
        color = 'yellow';
        ctx.lineWidth = 4;
      } else if (partA.includes('Knee') || partB.includes('Knee')) {
        // Knee connections - highlight the important parts for squats
        color = 'lime';
        ctx.lineWidth = 4;
      } else {
        ctx.lineWidth = 3;
      }
      
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(keyPointA.position.x * scaleX, keyPointA.position.y * scaleY);
      ctx.lineTo(keyPointB.position.x * scaleX, keyPointB.position.y * scaleY);
      ctx.stroke();
    }
  });
  
  // Draw joint angles with better visibility
  const addAngleDisplay = (
    angle: number | null, 
    label: string, 
    keypoint: string, 
    offsetX: number = 10, 
    offsetY: number = 0
  ) => {
    if (angle === null) return;
    
    const kp = pose.keypoints.find(kp => kp.part === keypoint);
    if (kp && kp.score > minPartConfidence) {
      // Background for better readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        kp.position.x * scaleX + offsetX - 2, 
        kp.position.y * scaleY + offsetY - 16, 
        90, 
        20
      );
      
      // Text
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        `${label}: ${angle}°`, 
        kp.position.x * scaleX + offsetX, 
        kp.position.y * scaleY + offsetY
      );
    }
  };
  
  // Add knee and hip angles
  addAngleDisplay(kneeAngle, 'Knee', 'leftKnee');
  addAngleDisplay(hipAngle, 'Hip', 'leftHip');
  
  // Draw squat state and confidence indicators
  const drawStateInfo = () => {
    // Background for status display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 70);
    
    // Squat state
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`State: ${currentSquatState}`, 20, 35);
    
    // Pose confidence
    ctx.font = '16px Arial';
    
    // Color based on confidence
    const confidenceColor = pose.score > 0.6 ? 'lime' : 
                            pose.score > 0.4 ? 'yellow' : 'red';
    
    ctx.fillStyle = confidenceColor;
    ctx.fillText(`Confidence: ${Math.round(pose.score * 100)}%`, 20, 65);
  };
  
  drawStateInfo();
};
