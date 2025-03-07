
import React, { useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from './types';

interface PoseRendererProps {
  pose: posenet.Pose | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
}

const PoseRenderer: React.FC<PoseRendererProps> = ({
  pose,
  canvasRef,
  kneeAngle,
  hipAngle,
  currentSquatState
}) => {
  // Draw pose keypoints and skeleton on canvas
  const drawPose = useCallback(() => {
    if (!pose) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
    });
    
    // Define connections for drawing skeleton
    const adjacentKeyPoints = [
      ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
      ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];
    
    // Draw skeleton
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    
    adjacentKeyPoints.forEach(([partA, partB]) => {
      const keyPointA = pose.keypoints.find(kp => kp.part === partA);
      const keyPointB = pose.keypoints.find(kp => kp.part === partB);
      
      if (keyPointA && keyPointB && keyPointA.score > 0.5 && keyPointB.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(keyPointA.position.x, keyPointA.position.y);
        ctx.lineTo(keyPointB.position.x, keyPointB.position.y);
        ctx.stroke();
      }
    });
    
    // Draw angles if available
    if (kneeAngle) {
      const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
      if (leftKnee && leftKnee.score > 0.5) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Knee: ${kneeAngle}°`, leftKnee.position.x + 10, leftKnee.position.y);
      }
    }
    
    if (hipAngle) {
      const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
      if (leftHip && leftHip.score > 0.5) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Hip: ${hipAngle}°`, leftHip.position.x + 10, leftHip.position.y);
      }
    }
    
    // Draw squat state
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`State: ${currentSquatState}`, 10, 30);
  }, [pose, canvasRef, kneeAngle, hipAngle, currentSquatState]);

  // Run the drawing effect
  React.useEffect(() => {
    if (pose) {
      drawPose();
    }
  }, [pose, drawPose]);

  return null;
};

export default PoseRenderer;
