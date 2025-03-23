
import React, { useRef, useEffect } from 'react';
import * as Human from '@vladmandic/human';
import { BodyAngles, EnhancedResult } from '@/lib/human/types';

interface MotionRendererProps {
  result: EnhancedResult | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  angles?: BodyAngles;
  showAngles?: boolean;
}

const MotionRenderer: React.FC<MotionRendererProps> = ({
  result,
  canvasRef,
  angles,
  showAngles = true
}) => {
  const requestRef = useRef<number>();
  const scaleX = useRef<number>(1);
  const scaleY = useRef<number>(1);
  
  // Draw pose on canvas
  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas || !result?.body || result.body.length === 0) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update scale factors - use default dimensions if source is undefined
      const sourceWidth = result.source?.width || 640;
      const sourceHeight = result.source?.height || 480;
      scaleX.current = canvas.width / sourceWidth;
      scaleY.current = canvas.height / sourceHeight;
      
      // Get first detected body
      const body = result.body[0];
      
      // Draw skeleton
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
      
      // Define connections for human.js model (BlazePose connections)
      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], // Face
        [9, 10], // Shoulders
        [11, 13], [13, 15], [15, 17], [17, 19], [19, 15], [15, 21], // Left arm
        [12, 14], [14, 16], [16, 18], [18, 20], [20, 16], [16, 22], // Right arm
        [11, 23], [23, 25], [25, 27], [27, 29], [27, 31], [29, 31], // Left leg
        [12, 24], [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]  // Right leg
      ];
      
      // Draw connections (skeleton)
      for (const [i, j] of connections) {
        const kp1 = body.keypoints[i];
        const kp2 = body.keypoints[j];
        
        // Only draw connection if both keypoints have good confidence
        if (kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(kp1.x * scaleX.current, kp1.y * scaleY.current);
          ctx.lineTo(kp2.x * scaleX.current, kp2.y * scaleY.current);
          ctx.stroke();
        }
      }
      
      // Draw keypoints
      body.keypoints.forEach(keypoint => {
        if (keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(
            keypoint.x * scaleX.current, 
            keypoint.y * scaleY.current, 
            4, 0, 2 * Math.PI
          );
          
          // Color based on keypoint type
          if (keypoint.name?.includes('shoulder') || keypoint.name?.includes('hip')) {
            ctx.fillStyle = 'yellow';
          } else if (keypoint.name?.includes('knee')) {
            ctx.fillStyle = 'lime';
          } else if (keypoint.name?.includes('ankle')) {
            ctx.fillStyle = 'orange';
          } else {
            ctx.fillStyle = 'aqua';
          }
          
          ctx.fill();
        }
      });
      
      // Draw angles if available
      if (showAngles && angles) {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        
        // Draw knee angle near knee
        if (angles.kneeAngle !== null) {
          const leftKnee = body.keypoints[25];
          const rightKnee = body.keypoints[26];
          
          if (leftKnee && leftKnee.score > 0.3) {
            ctx.fillText(
              `Knee: ${Math.round(angles.kneeAngle)}°`, 
              leftKnee.x * scaleX.current - 40, 
              leftKnee.y * scaleY.current - 10
            );
          } else if (rightKnee && rightKnee.score > 0.3) {
            ctx.fillText(
              `Knee: ${Math.round(angles.kneeAngle)}°`, 
              rightKnee.x * scaleX.current + 40, 
              rightKnee.y * scaleY.current - 10
            );
          }
        }
        
        // Draw hip angle near hip
        if (angles.hipAngle !== null) {
          const leftHip = body.keypoints[23];
          const rightHip = body.keypoints[24];
          
          if (leftHip && leftHip.score > 0.3) {
            ctx.fillText(
              `Hip: ${Math.round(angles.hipAngle)}°`, 
              leftHip.x * scaleX.current - 40, 
              leftHip.y * scaleY.current - 10
            );
          } else if (rightHip && rightHip.score > 0.3) {
            ctx.fillText(
              `Hip: ${Math.round(angles.hipAngle)}°`, 
              rightHip.x * scaleX.current + 40, 
              rightHip.y * scaleY.current - 10
            );
          }
        }
        
        // Draw shoulder angle
        if (angles.shoulderAngle !== null) {
          const leftShoulder = body.keypoints[11];
          
          if (leftShoulder && leftShoulder.score > 0.3) {
            ctx.fillText(
              `Shoulder: ${Math.round(angles.shoulderAngle)}°`, 
              leftShoulder.x * scaleX.current - 50, 
              leftShoulder.y * scaleY.current - 10
            );
          }
        }
      }
    };
    
    // Run drawing function
    if (result?.body && result.body.length > 0) {
      drawCanvas();
    } else if (canvasRef.current) {
      // Clear canvas if no body detected
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [result, canvasRef, angles, showAngles]);
  
  return null;
};

export default MotionRenderer;
