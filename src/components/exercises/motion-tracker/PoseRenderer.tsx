
import React, { useEffect, useRef } from 'react';
import { Pose } from './types';

interface PoseRendererProps {
  pose: Pose | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  showSkeleton?: boolean;
  showKeypoints?: boolean;
  showAngles?: boolean;
  lineWidth?: number;
  pointRadius?: number;
  lineColor?: string;
  keypointColor?: string;
  scoreThreshold?: number;
}

const PoseRenderer: React.FC<PoseRendererProps> = ({
  pose,
  canvasRef,
  showSkeleton = true,
  showKeypoints = true,
  showAngles = true,
  lineWidth = 4,
  pointRadius = 6,
  lineColor = '#00ff00',
  keypointColor = '#ff0000',
  scoreThreshold = 0.3
}) => {
  const requestRef = useRef<number>();
  
  // Draw the pose on the canvas
  useEffect(() => {
    if (!canvasRef.current || !pose) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const drawPose = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      
      if (!pose) return;
      
      // Define the connections between keypoints for skeleton
      const connections = [
        ['nose', 'left_eye'], ['nose', 'right_eye'],
        ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
        ['left_shoulder', 'right_shoulder'],
        ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
        ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
        ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
        ['left_hip', 'right_hip'],
        ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
        ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
      ];
      
      // Draw skeleton
      if (showSkeleton) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        
        for (const [part1, part2] of connections) {
          const keypoint1 = pose.keypoints.find(kp => kp.name === part1);
          const keypoint2 = pose.keypoints.find(kp => kp.name === part2);
          
          if (keypoint1 && keypoint2 && 
              keypoint1.score > scoreThreshold && keypoint2.score > scoreThreshold) {
            ctx.beginPath();
            ctx.moveTo(keypoint1.x, keypoint1.y);
            ctx.lineTo(keypoint2.x, keypoint2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw keypoints
      if (showKeypoints) {
        for (const keypoint of pose.keypoints) {
          if (keypoint.score > scoreThreshold) {
            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, pointRadius, 0, 2 * Math.PI);
            ctx.fillStyle = keypointColor;
            ctx.fill();
          }
        }
      }
    };
    
    requestRef.current = requestAnimationFrame(drawPose);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [
    pose, 
    canvasRef, 
    showSkeleton, 
    showKeypoints, 
    showAngles, 
    lineWidth, 
    pointRadius, 
    lineColor, 
    keypointColor,
    scoreThreshold
  ]);
  
  return null;
};

export default PoseRenderer;
