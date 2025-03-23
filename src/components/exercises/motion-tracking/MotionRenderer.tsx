
import React, { useEffect } from 'react';
import { BodyAngles } from '../posture-monitor/types';

interface MotionRendererProps {
  result: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  angles: BodyAngles;
}

const MotionRenderer: React.FC<MotionRendererProps> = ({ result, canvasRef, angles }) => {
  useEffect(() => {
    if (!result || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If no body detected, don't render anything
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    if (!body.keypoints || body.keypoints.length === 0) return;
    
    // Draw keypoints and skeleton
    drawKeypoints(ctx, body.keypoints, canvas.width, canvas.height);
    drawSkeleton(ctx, body.keypoints, canvas.width, canvas.height);
    
    // Draw angles if available
    drawAngles(ctx, angles, canvas.width, canvas.height);
  }, [result, canvasRef, angles]);
  
  return null; // This component only handles canvas drawing, doesn't render anything
};

// Helper function to draw keypoints
const drawKeypoints = (
  ctx: CanvasRenderingContext2D, 
  keypoints: any[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  keypoints.forEach(keypoint => {
    if (!keypoint.score || keypoint.score < 0.3) return;
    
    const { x, y } = keypoint;
    
    ctx.beginPath();
    ctx.arc(x * canvasWidth, y * canvasHeight, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 230, 255, 0.7)';
    ctx.fill();
    
    // Add a glow effect
    ctx.beginPath();
    ctx.arc(x * canvasWidth, y * canvasHeight, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 230, 255, 0.2)';
    ctx.fill();
  });
};

// Helper function to draw skeleton
const drawSkeleton = (
  ctx: CanvasRenderingContext2D, 
  keypoints: any[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  // Define connections between keypoints
  const connections = [
    [5, 7], [7, 9], // Left arm
    [6, 8], [8, 10], // Right arm
    [11, 13], [13, 15], // Left leg
    [12, 14], [14, 16], // Right leg
    [5, 6], [5, 11], [6, 12], [11, 12] // Torso
  ];
  
  // Set line style
  ctx.strokeStyle = 'rgba(75, 200, 255, 0.8)';
  ctx.lineWidth = 3;
  
  // Draw connections
  connections.forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (!kp1 || !kp2 || !kp1.score || !kp2.score || kp1.score < 0.3 || kp2.score < 0.3) return;
    
    ctx.beginPath();
    ctx.moveTo(kp1.x * canvasWidth, kp1.y * canvasHeight);
    ctx.lineTo(kp2.x * canvasWidth, kp2.y * canvasHeight);
    ctx.stroke();
  });
  
  // Draw an additional glow effect
  ctx.strokeStyle = 'rgba(75, 200, 255, 0.3)';
  ctx.lineWidth = 6;
  
  connections.forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (!kp1 || !kp2 || !kp1.score || !kp2.score || kp1.score < 0.3 || kp2.score < 0.3) return;
    
    ctx.beginPath();
    ctx.moveTo(kp1.x * canvasWidth, kp1.y * canvasHeight);
    ctx.lineTo(kp2.x * canvasWidth, kp2.y * canvasHeight);
    ctx.stroke();
  });
};

// Helper function to draw angles
const drawAngles = (
  ctx: CanvasRenderingContext2D,
  angles: BodyAngles,
  canvasWidth: number,
  canvasHeight: number
) => {
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  // Add a semi-transparent background for better readability
  if (angles.kneeAngle || angles.hipAngle || angles.shoulderAngle) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 150, 80);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  }
  
  let yOffset = 20;
  
  if (angles.kneeAngle) {
    ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, 20, yOffset);
    yOffset += 20;
  }
  
  if (angles.hipAngle) {
    ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, 20, yOffset);
    yOffset += 20;
  }
  
  if (angles.shoulderAngle) {
    ctx.fillText(`Shoulder: ${Math.round(angles.shoulderAngle)}°`, 20, yOffset);
  }
};

export default MotionRenderer;
