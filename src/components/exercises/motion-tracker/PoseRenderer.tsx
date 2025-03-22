
import React, { useEffect, useRef } from 'react';
import { Result } from '@vladmandic/human';

interface PoseRendererProps {
  result: Result;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showAngles?: boolean;
  showLabels?: boolean;
}

const PoseRenderer: React.FC<PoseRendererProps> = ({ 
  result, 
  canvasRef,
  showAngles = true,
  showLabels = true 
}) => {
  const animationFrameRef = useRef<number>();
  
  // Calculate angle between three points
  const calculateAngle = (pointA: number[], pointB: number[], pointC: number[]): number => {
    const vectorBA = [pointA[0] - pointB[0], pointA[1] - pointB[1]];
    const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]];
    
    const dotProduct = vectorBA[0] * vectorBC[0] + vectorBA[1] * vectorBC[1];
    const magnitudeBA = Math.sqrt(vectorBA[0] * vectorBA[0] + vectorBA[1] * vectorBA[1]);
    const magnitudeBC = Math.sqrt(vectorBC[0] * vectorBC[0] + vectorBC[1] * vectorBC[1]);
    
    // Ensure value is in valid range for acos
    const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magnitudeBA * magnitudeBC)));
    return Math.acos(cosTheta) * (180 / Math.PI);
  };

  // Draw joint angles on canvas
  const drawJointAngles = (ctx: CanvasRenderingContext2D, body: any) => {
    if (!body || !body.keypoints) return;
    
    const keypoints = body.keypoints;
    
    // Find specific keypoints for angle calculations
    const leftHip = keypoints.find((kp: any) => kp.part === 'leftHip');
    const leftKnee = keypoints.find((kp: any) => kp.part === 'leftKnee');
    const leftAnkle = keypoints.find((kp: any) => kp.part === 'leftAnkle');
    
    const rightHip = keypoints.find((kp: any) => kp.part === 'rightHip');
    const rightKnee = keypoints.find((kp: any) => kp.part === 'rightKnee');
    const rightAnkle = keypoints.find((kp: any) => kp.part === 'rightAnkle');
    
    // Draw text with shadow for better visibility
    const drawText = (text: string, x: number, y: number) => {
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(text, x + 1, y + 1); // Shadow
      ctx.fillStyle = 'yellow';
      ctx.fillText(text, x, y);
    };
    
    // Calculate and draw left knee angle
    if (leftHip && leftKnee && leftAnkle) {
      const leftKneeAngle = calculateAngle(
        [leftHip.position[0], leftHip.position[1]],
        [leftKnee.position[0], leftKnee.position[1]],
        [leftAnkle.position[0], leftAnkle.position[1]]
      );
      
      // Draw angle on canvas
      drawText(`${Math.round(leftKneeAngle)}°`, leftKnee.position[0] + 10, leftKnee.position[1]);
    }
    
    // Calculate and draw right knee angle
    if (rightHip && rightKnee && rightAnkle) {
      const rightKneeAngle = calculateAngle(
        [rightHip.position[0], rightHip.position[1]],
        [rightKnee.position[0], rightKnee.position[1]],
        [rightAnkle.position[0], rightAnkle.position[1]]
      );
      
      // Draw angle on canvas
      drawText(`${Math.round(rightKneeAngle)}°`, rightKnee.position[0] - 40, rightKnee.position[1]);
    }
  };

  // Render pose data on canvas
  useEffect(() => {
    if (!result || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderPose = () => {
      if (!result.body || result.body.length === 0) return;
      
      // If Human.js already rendered the pose, just add angles
      if (showAngles && result.body[0]) {
        drawJointAngles(ctx, result.body[0]);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(renderPose);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [result, canvasRef, showAngles, showLabels]);

  return null;
};

export default PoseRenderer;
