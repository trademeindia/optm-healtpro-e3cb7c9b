
import React, { useEffect, useRef } from 'react';
import * as Human from '@vladmandic/human';
import { BodyAngles } from '../posture-monitor/types';

interface MotionRendererProps {
  result: Human.Result | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  angles: BodyAngles;
}

// Configuration for visualization
const drawOptions = {
  drawPoints: true,
  drawSkeleton: true,
  drawAngles: true,
  showLabels: true,
  lineWidth: 2,
  pointRadius: 4,
  fontSize: 14,
  fontColor: 'rgba(255, 255, 255, 0.8)',
  pointColor: '#00ff00',
  lineColor: '#00ffff',
  jointColor: '#ff0000',
  angleColor: '#ffff00',
};

const MotionRenderer: React.FC<MotionRendererProps> = ({ result, canvasRef, angles }) => {
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
    }
  }, [canvasRef]);
  
  // Draw on canvas when result changes
  useEffect(() => {
    const ctx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    
    if (!ctx || !canvas) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If no detection result, don't draw anything
    if (!result || !result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const keypoints = body.keypoints;
    
    // Make sure canvas dimensions match the video
    if (result.source) {
      canvas.width = result.source.width;
      canvas.height = result.source.height;
    }
    
    // Draw skeleton lines
    if (drawOptions.drawSkeleton) {
      ctx.lineWidth = drawOptions.lineWidth;
      ctx.strokeStyle = drawOptions.lineColor;
      
      // Define connections between keypoints
      const connections = [
        ['leftShoulder', 'rightShoulder'],
        ['leftShoulder', 'leftElbow'],
        ['rightShoulder', 'rightElbow'],
        ['leftElbow', 'leftWrist'],
        ['rightElbow', 'rightWrist'],
        ['leftShoulder', 'leftHip'],
        ['rightShoulder', 'rightHip'],
        ['leftHip', 'rightHip'],
        ['leftHip', 'leftKnee'],
        ['rightHip', 'rightKnee'],
        ['leftKnee', 'leftAnkle'],
        ['rightKnee', 'rightAnkle'],
      ];
      
      for (const [from, to] of connections) {
        const fromPoint = keypoints.find(kp => kp.part === from);
        const toPoint = keypoints.find(kp => kp.part === to);
        
        if (fromPoint && toPoint && fromPoint.score > 0.5 && toPoint.score > 0.5) {
          ctx.beginPath();
          ctx.moveTo(fromPoint.x, fromPoint.y);
          ctx.lineTo(toPoint.x, toPoint.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw keypoints
    if (drawOptions.drawPoints) {
      for (const keypoint of keypoints) {
        if (keypoint.score > 0.5) {
          ctx.fillStyle = drawOptions.pointColor;
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, drawOptions.pointRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw labels
          if (drawOptions.showLabels) {
            ctx.fillStyle = drawOptions.fontColor;
            ctx.font = `${drawOptions.fontSize}px Arial`;
            ctx.fillText(keypoint.part, keypoint.x + 10, keypoint.y - 10);
          }
        }
      }
    }
    
    // Draw angles
    if (drawOptions.drawAngles) {
      ctx.font = `bold ${drawOptions.fontSize + 2}px Arial`;
      ctx.fillStyle = drawOptions.angleColor;
      
      // Draw knee angle
      if (angles.kneeAngle !== null) {
        const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
        if (rightKnee && rightKnee.score > 0.5) {
          ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, rightKnee.x + 15, rightKnee.y + 5);
        }
      }
      
      // Draw hip angle
      if (angles.hipAngle !== null) {
        const rightHip = keypoints.find(kp => kp.part === 'rightHip');
        if (rightHip && rightHip.score > 0.5) {
          ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, rightHip.x + 15, rightHip.y + 5);
        }
      }
      
      // Draw shoulder angle
      if (angles.shoulderAngle !== null) {
        const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
        if (rightShoulder && rightShoulder.score > 0.5) {
          ctx.fillText(`Shoulder: ${Math.round(angles.shoulderAngle)}°`, rightShoulder.x + 15, rightShoulder.y + 5);
        }
      }
    }
    
  }, [result, canvasRef, angles]);
  
  return null; // This component doesn't render anything directly, it just draws on the canvas
};

export default MotionRenderer;
