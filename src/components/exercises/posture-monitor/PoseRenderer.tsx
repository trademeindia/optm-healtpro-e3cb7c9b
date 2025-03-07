
import React, { useCallback, useEffect } from 'react';
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
  // Adjust canvas to match video dimensions
  const adjustCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    // Set canvas to match parent dimensions
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // Clear the canvas after resize
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);
  
  // Set up resize observer
  useEffect(() => {
    adjustCanvas();
    
    // Watch for container resize
    const resizeObserver = new ResizeObserver(adjustCanvas);
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    
    return () => resizeObserver.disconnect();
  }, [adjustCanvas, canvasRef]);
  
  // Draw pose keypoints and skeleton on canvas
  const drawPose = useCallback(() => {
    if (!pose) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale factors for the canvas
    const videoWidth = 640; // Same as in PoseNet config
    const videoHeight = 480;
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) { // Lower threshold for better visualization
        ctx.beginPath();
        ctx.arc(
          keypoint.position.x * scaleX, 
          keypoint.position.y * scaleY, 
          6, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'aqua';
        ctx.fill();
        
        // Add keypoint label
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(
          keypoint.part, 
          keypoint.position.x * scaleX + 10, 
          keypoint.position.y * scaleY
        );
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
    ctx.lineWidth = 3;
    
    adjacentKeyPoints.forEach(([partA, partB]) => {
      const keyPointA = pose.keypoints.find(kp => kp.part === partA);
      const keyPointB = pose.keypoints.find(kp => kp.part === partB);
      
      if (keyPointA && keyPointB && keyPointA.score > 0.3 && keyPointB.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(keyPointA.position.x * scaleX, keyPointA.position.y * scaleY);
        ctx.lineTo(keyPointB.position.x * scaleX, keyPointB.position.y * scaleY);
        ctx.stroke();
      }
    });
    
    // Draw angles if available
    if (kneeAngle) {
      const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
      if (leftKnee && leftKnee.score > 0.3) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(
          `Knee: ${kneeAngle}°`, 
          leftKnee.position.x * scaleX + 10, 
          leftKnee.position.y * scaleY
        );
      }
    }
    
    if (hipAngle) {
      const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
      if (leftHip && leftHip.score > 0.3) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(
          `Hip: ${hipAngle}°`, 
          leftHip.position.x * scaleX + 10, 
          leftHip.position.y * scaleY
        );
      }
    }
    
    // Draw squat state
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`State: ${currentSquatState}`, 10, 30);
    
    // Draw confidence score
    ctx.font = '16px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText(`Confidence: ${Math.round(pose.score * 100)}%`, 10, 60);
  }, [pose, canvasRef, kneeAngle, hipAngle, currentSquatState]);

  // Run the drawing effect
  useEffect(() => {
    if (pose) {
      drawPose();
    }
  }, [pose, drawPose]);

  return null;
};

export default PoseRenderer;
