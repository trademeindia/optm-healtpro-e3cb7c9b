
import React, { useEffect } from 'react';
import { BodyAngles } from '../posture-monitor/types';

interface MotionRendererProps {
  result: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  angles: BodyAngles;
}

const MotionRenderer: React.FC<MotionRendererProps> = ({ result, canvasRef, angles }) => {
  useEffect(() => {
    renderMotion(result, canvasRef, angles);
  }, [result, canvasRef, angles]);
  
  return null; // This component only handles canvas drawing, doesn't render anything
};

// Main rendering function
const renderMotion = (result: any, canvasRef: React.RefObject<HTMLCanvasElement>, angles: BodyAngles) => {
  if (!canvasRef.current) return;
  
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // If no result detected or no body, show a message to the user
  if (!result || !result.body || result.body.length === 0) {
    drawNoBodyMessage(ctx, canvas.width, canvas.height);
    // Draw silhouette guide to help user position
    drawSilhouetteGuide(ctx, canvas.width, canvas.height);
    return;
  }
  
  const body = result.body[0];
  if (!body.keypoints || body.keypoints.length === 0) {
    drawNoBodyMessage(ctx, canvas.width, canvas.height);
    // Draw silhouette guide to help user position
    drawSilhouetteGuide(ctx, canvas.width, canvas.height);
    return;
  }
  
  // Draw keypoints and skeleton
  drawKeypoints(ctx, body.keypoints, canvas.width, canvas.height);
  drawSkeleton(ctx, body.keypoints, canvas.width, canvas.height);
  
  // Draw angles if available
  drawAngles(ctx, angles, canvas.width, canvas.height);
  
  // Add detailed form feedback based on angles
  drawFormFeedback(ctx, angles, canvas.width, canvas.height);
};

// Helper function to draw silhouette guide
const drawSilhouetteGuide = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  ctx.save();
  
  // Draw a faded human silhouette in the center
  const centerX = canvasWidth / 2;
  const height = canvasHeight * 0.8;
  const width = height * 0.4;
  const startY = canvasHeight * 0.1;
  
  // Set translucent style
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#4ECDC4';
  ctx.lineWidth = 2;
  
  // Head
  const headRadius = width * 0.2;
  ctx.beginPath();
  ctx.arc(centerX, startY + headRadius, headRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Body
  ctx.beginPath();
  ctx.moveTo(centerX, startY + headRadius * 2);
  ctx.lineTo(centerX, startY + height * 0.5);
  ctx.stroke();
  
  // Arms
  ctx.beginPath();
  ctx.moveTo(centerX - width * 0.5, startY + height * 0.25);
  ctx.lineTo(centerX, startY + height * 0.2);
  ctx.lineTo(centerX + width * 0.5, startY + height * 0.25);
  ctx.stroke();
  
  // Legs
  ctx.beginPath();
  ctx.moveTo(centerX, startY + height * 0.5);
  ctx.lineTo(centerX - width * 0.3, startY + height);
  ctx.moveTo(centerX, startY + height * 0.5);
  ctx.lineTo(centerX + width * 0.3, startY + height);
  ctx.stroke();
  
  // Draw a message
  ctx.globalAlpha = 1;
  ctx.font = '14px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Stand in this position to begin', centerX, startY + height + 30);
  
  ctx.restore();
};

// Helper function to draw "no body detected" message
const drawNoBodyMessage = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, canvasHeight - 60, canvasWidth, 60);
  
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Position yourself in the camera view', canvasWidth / 2, canvasHeight - 35);
  ctx.font = '12px Arial';
  ctx.fillText('Make sure your full body is visible', canvasWidth / 2, canvasHeight - 15);
};

// Helper function to draw keypoints
const drawKeypoints = (
  ctx: CanvasRenderingContext2D, 
  keypoints: any[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  keypoints.forEach(keypoint => {
    // Use a lower confidence threshold to show more keypoints
    if (!keypoint.score || keypoint.score < 0.2) return;
    
    const { x, y } = keypoint;
    
    // Make sure x and y are valid numbers and in range 0-1 for normalization
    if (isNaN(x) || isNaN(y)) return;
    
    // Scale coordinates to canvas size
    const canvasX = x * canvasWidth;
    const canvasY = y * canvasHeight;
    
    // Skip if outside canvas bounds (with some padding)
    if (canvasX < -20 || canvasY < -20 || canvasX > canvasWidth + 20 || canvasY > canvasHeight + 20) return;
    
    // Draw keypoint with different colors based on confidence
    const alpha = Math.max(0.3, keypoint.score);
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 230, 255, ${alpha})`;
    ctx.fill();
    
    // Add a glow effect
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 12, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(0, 230, 255, ${alpha * 0.3})`;
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
  // Define connections between keypoints for BlazePose (different from PoseNet)
  // These are indices for the standard BlazePose keypoint array
  const connections = [
    [11, 13], [13, 15], // Left arm
    [12, 14], [14, 16], // Right arm
    [11, 23], [12, 24], // Shoulders to hips
    [23, 25], [25, 27], // Left leg
    [24, 26], [26, 28], // Right leg
    [23, 24], // Hip connection
    [11, 12]  // Shoulder connection
  ];
  
  // Set line style
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
  ctx.lineWidth = 4;
  
  // Draw connections
  connections.forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (!kp1 || !kp2 || !kp1.score || !kp2.score || kp1.score < 0.2 || kp2.score < 0.2) return;
    
    // Make sure x and y are valid numbers
    if (isNaN(kp1.x) || isNaN(kp1.y) || isNaN(kp2.x) || isNaN(kp2.y)) return;
    
    // Scale coordinates to canvas size
    const x1 = kp1.x * canvasWidth;
    const y1 = kp1.y * canvasHeight;
    const x2 = kp2.x * canvasWidth;
    const y2 = kp2.y * canvasHeight;
    
    // Skip if outside canvas bounds
    if (x1 < 0 || y1 < 0 || x1 > canvasWidth || y1 > canvasHeight) return;
    if (x2 < 0 || y2 < 0 || x2 > canvasWidth || y2 > canvasHeight) return;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  
  // Draw an additional glow effect
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
  ctx.lineWidth = 8;
  
  connections.forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (!kp1 || !kp2 || !kp1.score || !kp2.score || kp1.score < 0.2 || kp2.score < 0.2) return;
    
    // Make sure x and y are valid numbers
    if (isNaN(kp1.x) || isNaN(kp1.y) || isNaN(kp2.x) || isNaN(kp2.y)) return;
    
    // Scale coordinates to canvas size
    const x1 = kp1.x * canvasWidth;
    const y1 = kp1.y * canvasHeight;
    const x2 = kp2.x * canvasWidth;
    const y2 = kp2.y * canvasHeight;
    
    // Skip if outside canvas bounds
    if (x1 < 0 || y1 < 0 || x1 > canvasWidth || y1 > canvasHeight) return;
    if (x2 < 0 || y2 < 0 || x2 > canvasWidth || y2 > canvasHeight) return;
    
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
  // Add a semi-transparent background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 200, 150);
  
  ctx.font = '16px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  let yOffset = 20;
  
  // Draw the angle values with better error handling
  ctx.fillText('Angle Measurements:', 20, yOffset);
  yOffset += 30;
  
  if (angles.kneeAngle !== null && !isNaN(angles.kneeAngle)) {
    const kneeColor = getAngleColor(angles.kneeAngle, 90, 140);
    ctx.fillStyle = kneeColor;
    ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, 20, yOffset);
    ctx.fillStyle = 'white';
    yOffset += 25;
  } else {
    ctx.fillText(`Knee: --`, 20, yOffset);
    yOffset += 25;
  }
  
  if (angles.hipAngle !== null && !isNaN(angles.hipAngle)) {
    const hipColor = getAngleColor(angles.hipAngle, 80, 130);
    ctx.fillStyle = hipColor;
    ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, 20, yOffset);
    ctx.fillStyle = 'white';
    yOffset += 25;
  } else {
    ctx.fillText(`Hip: --`, 20, yOffset);
    yOffset += 25;
  }
  
  if (angles.shoulderAngle !== null && !isNaN(angles.shoulderAngle)) {
    const shoulderColor = getAngleColor(angles.shoulderAngle, 160, 180);
    ctx.fillStyle = shoulderColor;
    ctx.fillText(`Shoulder: ${Math.round(angles.shoulderAngle)}°`, 20, yOffset);
    ctx.fillStyle = 'white';
    yOffset += 25;
  } else {
    ctx.fillText(`Shoulder: --`, 20, yOffset);
    yOffset += 25;
  }
};

// Helper function to draw form feedback
const drawFormFeedback = (
  ctx: CanvasRenderingContext2D,
  angles: BodyAngles,
  canvasWidth: number,
  canvasHeight: number
) => {
  // Only give form feedback if we have angle data
  if (angles.kneeAngle === null && angles.hipAngle === null && angles.shoulderAngle === null) {
    return;
  }
  
  const messages = [];
  
  // Analyze knee angle
  if (angles.kneeAngle !== null) {
    if (angles.kneeAngle < 90) {
      messages.push("Knee bent too much");
    } else if (angles.kneeAngle > 160) {
      messages.push("Deepen your squat");
    }
  }
  
  // Analyze hip angle
  if (angles.hipAngle !== null) {
    if (angles.hipAngle < 80) {
      messages.push("Hips too low, raise slightly");
    } else if (angles.hipAngle > 130) {
      messages.push("Bend at the hips more");
    }
  }
  
  // Analyze shoulder angle
  if (angles.shoulderAngle !== null) {
    if (angles.shoulderAngle < 160) {
      messages.push("Keep shoulders back");
    }
  }
  
  // If we have feedback, display it
  if (messages.length > 0) {
    // Draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(canvasWidth - 210, 10, 200, 40 + (messages.length * 25));
    
    // Draw header
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Form Feedback:', canvasWidth - 200, 20);
    
    // Draw messages
    ctx.font = '14px Arial';
    ctx.fillStyle = '#FFA500'; // Orange for feedback
    
    messages.forEach((message, index) => {
      ctx.fillText(message, canvasWidth - 200, 50 + (index * 25));
    });
  }
};

// Helper to get color based on angle (green if in optimal range, yellow/red otherwise)
const getAngleColor = (angle: number, min: number, max: number): string => {
  if (angle >= min && angle <= max) {
    return 'rgba(0, 255, 0, 0.9)'; // Green for good range
  } else if (angle < min) {
    return 'rgba(255, 165, 0, 0.9)'; // Orange for too small
  } else {
    return 'rgba(255, 50, 50, 0.9)'; // Red for too large
  }
};

export default MotionRenderer;
