
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
    if (angles.kneeAngle) {
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, 10, 30);
    }
    if (angles.hipAngle) {
      ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, 10, 50);
    }
  }, [result, canvasRef, angles]);
  
  return null; // This component only handles canvas drawing, doesn't render anything
};

// Helper functions for drawing
const drawKeypoints = (
  ctx: CanvasRenderingContext2D, 
  keypoints: any[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  // This is a simplified version - in a real app, you'd use the actual keypoints
  keypoints.forEach(keypoint => {
    if (!keypoint.score || keypoint.score < 0.3) return;
    
    const { x, y } = keypoint;
    
    ctx.beginPath();
    ctx.arc(x * canvasWidth, y * canvasHeight, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'aqua';
    ctx.fill();
  });
};

const drawSkeleton = (
  ctx: CanvasRenderingContext2D, 
  keypoints: any[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  // This is a simplified version - in a real app, you'd define proper connections
  // between keypoints and draw lines accordingly
  
  // Example connection pairs (this is just illustrative)
  const connections = [
    [5, 7], [7, 9], // Left arm
    [6, 8], [8, 10], // Right arm
    [11, 13], [13, 15], // Left leg
    [12, 14], [14, 16], // Right leg
    [5, 6], [5, 11], [6, 12], [11, 12] // Torso
  ];
  
  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 2;
  
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

export default MotionRenderer;
