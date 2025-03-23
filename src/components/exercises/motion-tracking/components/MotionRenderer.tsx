
import React, { useEffect } from 'react';
import * as Human from '@vladmandic/human';
import { BodyAngles } from '@/components/exercises/posture-monitor/types';

interface MotionRendererProps {
  result: Human.Result;
  angles: BodyAngles;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const MotionRenderer: React.FC<MotionRendererProps> = ({ 
  result, 
  angles, 
  canvasRef 
}) => {
  useEffect(() => {
    if (!canvasRef.current || !result?.body) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Resize canvas to match video dimensions if needed
    if (result.source && (
      canvasRef.current.width !== result.source.width || 
      canvasRef.current.height !== result.source.height
    )) {
      canvasRef.current.width = result.source.width;
      canvasRef.current.height = result.source.height;
    }
    
    // Draw skeleton
    if (result.body && result.body.length > 0) {
      const person = result.body[0];
      
      // Set drawing styles
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#22c55e'; // Green color for skeleton lines
      ctx.fillStyle = '#22c55e';
      
      // Draw body keypoints
      for (const keypoint of person.keypoints) {
        if (keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      
      // Define connections to draw the skeleton
      const connections = [
        ['leftShoulder', 'rightShoulder'],
        ['leftShoulder', 'leftElbow'],
        ['leftElbow', 'leftWrist'],
        ['rightShoulder', 'rightElbow'],
        ['rightElbow', 'rightWrist'],
        ['leftShoulder', 'leftHip'],
        ['rightShoulder', 'rightHip'],
        ['leftHip', 'rightHip'],
        ['leftHip', 'leftKnee'],
        ['leftKnee', 'leftAnkle'],
        ['rightHip', 'rightKnee'],
        ['rightKnee', 'rightAnkle']
      ];
      
      // Create a map for easy keypoint lookup
      const keypointMap = new Map();
      person.keypoints.forEach(keypoint => {
        keypointMap.set(keypoint.name, keypoint);
      });
      
      // Draw connections
      for (const [from, to] of connections) {
        const fromPoint = keypointMap.get(from);
        const toPoint = keypointMap.get(to);
        
        if (fromPoint && toPoint && fromPoint.score > 0.3 && toPoint.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(fromPoint.x, fromPoint.y);
          ctx.lineTo(toPoint.x, toPoint.y);
          ctx.stroke();
        }
      }
      
      // Draw angle labels if available
      if (angles) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        
        // Draw knee angle
        if (angles.kneeAngle && keypointMap.get('leftKnee')) {
          const knee = keypointMap.get('leftKnee');
          const text = `${Math.round(angles.kneeAngle)}°`;
          ctx.strokeText(text, knee.x + 15, knee.y);
          ctx.fillText(text, knee.x + 15, knee.y);
        }
        
        // Draw hip angle
        if (angles.hipAngle && keypointMap.get('leftHip')) {
          const hip = keypointMap.get('leftHip');
          const text = `${Math.round(angles.hipAngle)}°`;
          ctx.strokeText(text, hip.x + 15, hip.y);
          ctx.fillText(text, hip.x + 15, hip.y);
        }
      }
    }
  }, [result, angles, canvasRef]);
  
  return null; // This component doesn't render anything visible, it just draws on the canvas
};

export default MotionRenderer;
