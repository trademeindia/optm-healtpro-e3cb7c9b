
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
    
    // Get canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // If no body detected, don't render anything
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    if (!body.keypoints || body.keypoints.length === 0) return;
    
    // Draw keypoints and skeleton
    drawKeypoints(ctx, body.keypoints, canvasWidth, canvasHeight);
    drawSkeleton(ctx, body.keypoints, canvasWidth, canvasHeight);
    
    // Draw angles if available
    drawAngles(ctx, angles, canvasWidth, canvasHeight);
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
  const minConfidence = 0.3;
  
  keypoints.forEach(keypoint => {
    if (!keypoint || keypoint.score < minConfidence) return;
    
    const { x, y } = keypoint;
    const xPos = x * canvasWidth;
    const yPos = y * canvasHeight;
    
    // Draw main point
    ctx.beginPath();
    ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 230, 255, 0.7)';
    ctx.fill();
    
    // Draw glow effect
    ctx.beginPath();
    ctx.arc(xPos, yPos, 8, 0, 2 * Math.PI);
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
  const minConfidence = 0.3;
  const colorGood = 'rgba(75, 200, 255, 0.8)';
  const colorWarning = 'rgba(255, 165, 0, 0.8)';
  
  // Define connections between keypoints for BlazePose
  // 0: nose, 1-2: eyes, 3-4: ears, 5-6: shoulders, 7-8: elbows, 9-10: wrists
  // 11-12: hips, 13-14: knees, 15-16: ankles
  const connections = [
    // Face
    [0, 1], [0, 2], [1, 3], [2, 4],
    // Arms
    [5, 7], [7, 9], [6, 8], [8, 10],
    // Body
    [5, 6], [5, 11], [6, 12], [11, 12],
    // Legs
    [11, 13], [13, 15], [12, 14], [14, 16]
  ];
  
  // Set line style
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw connections
  connections.forEach(([i, j]) => {
    if (i >= keypoints.length || j >= keypoints.length) return;
    
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (!kp1 || !kp2 || kp1.score < minConfidence || kp2.score < minConfidence) return;
    
    const x1 = kp1.x * canvasWidth;
    const y1 = kp1.y * canvasHeight;
    const x2 = kp2.x * canvasWidth;
    const y2 = kp2.y * canvasHeight;
    
    // Determine if this is a leg connection (for potential highlighting during squats)
    const isLegConnection = (
      (i === 11 && j === 13) || (i === 13 && j === 15) || 
      (i === 12 && j === 14) || (i === 14 && j === 16)
    );
    
    // Draw glowing effect underneath
    ctx.strokeStyle = 'rgba(75, 200, 255, 0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Draw main line
    ctx.strokeStyle = isLegConnection ? colorWarning : colorGood;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
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
  
  // Create a semi-transparent background for the angle display
  if (angles.kneeAngle || angles.hipAngle || angles.shoulderAngle) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 180, 100);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  }
  
  // Draw title
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Joint Angles', 20, 20);
  ctx.font = '14px Arial';
  
  let yOffset = 45;
  
  // Draw angles with color coding
  if (angles.kneeAngle !== null) {
    const color = getAngleColor(angles.kneeAngle, 90, 20);
    ctx.fillStyle = color;
    ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, 20, yOffset);
    yOffset += 20;
  }
  
  if (angles.hipAngle !== null) {
    const color = getAngleColor(angles.hipAngle, 90, 20);
    ctx.fillStyle = color;
    ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, 20, yOffset);
    yOffset += 20;
  }
  
  if (angles.shoulderAngle !== null) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`Shoulder: ${Math.round(angles.shoulderAngle)}°`, 20, yOffset);
  }
};

// Helper to determine color based on how close angle is to ideal
const getAngleColor = (angle: number, idealAngle: number, tolerance: number): string => {
  const diff = Math.abs(angle - idealAngle);
  
  if (diff <= tolerance) {
    return 'rgb(0, 255, 127)'; // Good (green)
  } else if (diff <= tolerance * 2) {
    return 'rgb(255, 165, 0)'; // Warning (orange)
  } else {
    return 'rgb(255, 105, 97)'; // Bad (red)
  }
};

export default MotionRenderer;
