
import React, { useCallback, useEffect } from 'react';
import { RendererProps } from './renderer/types';
import { useCanvasSize } from './renderer/useCanvasSize';
import { drawPose } from './renderer/drawPose';

const PoseRenderer: React.FC<RendererProps> = ({
  pose,
  canvasRef,
  kneeAngle,
  hipAngle,
  currentSquatState,
  config
}) => {
  const { canvasSize } = useCanvasSize(canvasRef);
  
  // Draw pose keypoints and skeleton on canvas
  const renderPose = useCallback(() => {
    if (!pose || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Get configuration values or use defaults
    const videoWidth = config?.inputResolution.width || 640; 
    const videoHeight = config?.inputResolution.height || 480;
    const minPartConfidence = config?.minPartConfidence || 0.5;
    
    // Draw the pose using our utility function
    drawPose(
      ctx,
      pose,
      canvasSize,
      kneeAngle,
      hipAngle,
      currentSquatState,
      videoWidth,
      videoHeight,
      minPartConfidence
    );
  }, [pose, canvasRef, kneeAngle, hipAngle, currentSquatState, canvasSize, config]);

  // Run the drawing effect
  useEffect(() => {
    if (pose) {
      requestAnimationFrame(renderPose);
    } else if (canvasRef.current) {
      // Clear canvas when no pose is detected
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [pose, renderPose, canvasRef]);

  return null;
};

export default PoseRenderer;
