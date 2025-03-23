
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
  lineWidth: 3,
  pointRadius: 5,
  fontSize: 16,
  fontColor: 'rgba(255, 255, 255, 0.9)',
  pointColor: '#00ff00',
  lineColor: '#00ffff',
  jointColor: '#ff0000',
  angleColor: '#ffff00',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
};

const MotionRenderer: React.FC<MotionRendererProps> = ({ result, canvasRef, angles }) => {
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastResult = useRef<Human.Result | null>(null);
  
  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      
      // Set high quality rendering
      if (canvasCtxRef.current) {
        canvasCtxRef.current.imageSmoothingEnabled = true;
        canvasCtxRef.current.imageSmoothingQuality = 'high';
      }
    }
    
    return () => {
      // Clear canvas on unmount
      if (canvasRef.current && canvasCtxRef.current) {
        canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [canvasRef]);
  
  // Draw on canvas when result changes
  useEffect(() => {
    const ctx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    
    if (!ctx || !canvas) return;
    
    // If no detection result and no previous result, clear and show message
    if (!result && !lastResult.current) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Show "waiting for detection" message
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Waiting for body detection...', canvas.width / 2, canvas.height / 2);
      return;
    }
    
    // If no current result but we have a previous one, use the last result 
    // with reduced opacity to show continuity
    const currentResult = result || lastResult.current;
    if (!currentResult || !currentResult.body || currentResult.body.length === 0) return;
    
    // Store current result as last result for next render if empty
    if (result) {
      lastResult.current = result;
    }
    
    // Get body data
    const body = currentResult.body[0];
    const keypoints = body.keypoints;
    
    // Make sure canvas dimensions match the video
    if (currentResult.source) {
      const sourceWidth = currentResult.source.width || 640;
      const sourceHeight = currentResult.source.height || 480;
      
      // Only resize if needed
      if (canvas.width !== sourceWidth || canvas.height !== sourceHeight) {
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
      }
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add semi-transparent overlay
    if (drawOptions.backgroundColor) {
      ctx.fillStyle = drawOptions.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
          
          // Draw joints with higher visibility
          ctx.strokeStyle = drawOptions.jointColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          
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
          // Draw angle arc
          const rightHip = keypoints.find(kp => kp.part === 'rightHip');
          const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
          
          if (rightHip && rightAnkle && rightHip.score > 0.5 && rightAnkle.score > 0.5) {
            // Draw angle arc
            drawAngleArc(ctx, rightHip, rightKnee, rightAnkle);
          }
          
          // Draw text
          ctx.fillText(`Knee: ${Math.round(angles.kneeAngle)}°`, rightKnee.x + 15, rightKnee.y + 5);
        }
      }
      
      // Draw hip angle
      if (angles.hipAngle !== null) {
        const rightHip = keypoints.find(kp => kp.part === 'rightHip');
        if (rightHip && rightHip.score > 0.5) {
          // Draw angle arc
          const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
          const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
          
          if (rightKnee && rightShoulder && rightKnee.score > 0.5 && rightShoulder.score > 0.5) {
            // Draw angle arc
            drawAngleArc(ctx, rightKnee, rightHip, rightShoulder);
          }
          
          ctx.fillText(`Hip: ${Math.round(angles.hipAngle)}°`, rightHip.x + 15, rightHip.y + 5);
        }
      }
      
      // Draw shoulder angle
      if (angles.shoulderAngle !== null) {
        const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
        if (rightShoulder && rightShoulder.score > 0.5) {
          // Draw angle arc
          const rightElbow = keypoints.find(kp => kp.part === 'rightElbow');
          const rightHip = keypoints.find(kp => kp.part === 'rightHip');
          
          if (rightElbow && rightHip && rightElbow.score > 0.5 && rightHip.score > 0.5) {
            // Draw angle arc
            drawAngleArc(ctx, rightHip, rightShoulder, rightElbow);
          }
          
          ctx.fillText(`Shoulder: ${Math.round(angles.shoulderAngle)}°`, rightShoulder.x + 15, rightShoulder.y + 5);
        }
      }
    }
    
    // Show detection confidence
    if (body.score) {
      ctx.font = '18px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`Detection confidence: ${Math.round(body.score * 100)}%`, 20, 30);
    }
    
  }, [result, canvasRef, angles]);
  
  // Helper function to draw angle arcs
  const drawAngleArc = (ctx: CanvasRenderingContext2D, p1: any, p2: any, p3: any) => {
    if (!ctx) return;
    
    // Calculate vectors
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 === 0 || mag2 === 0) return;
    
    // Calculate unit vectors
    const uv1 = { x: v1.x / mag1, y: v1.y / mag1 };
    const uv2 = { x: v2.x / mag2, y: v2.y / mag2 };
    
    // Calculate angle
    const dot = uv1.x * uv2.x + uv1.y * uv2.y;
    const angle = Math.acos(Math.min(1, Math.max(-1, dot)));
    
    // Calculate angle bisector
    const bisector = {
      x: (uv1.x + uv2.x) / 2,
      y: (uv1.y + uv2.y) / 2
    };
    
    // Normalize bisector
    const bisMag = Math.sqrt(bisector.x * bisector.x + bisector.y * bisector.y);
    if (bisMag === 0) return;
    
    const normalizedBisector = {
      x: bisector.x / bisMag,
      y: bisector.y / bisMag
    };
    
    // Draw arc
    const radius = 25;
    ctx.beginPath();
    ctx.arc(p2.x, p2.y, radius, Math.atan2(uv1.y, uv1.x), Math.atan2(uv2.y, uv2.x), angle > Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();
  };
  
  return null; // This component doesn't render anything directly, it just draws on the canvas
};

export default MotionRenderer;
