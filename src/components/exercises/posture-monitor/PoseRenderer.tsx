
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { SquatState } from './types';
import { PoseDetectionConfig } from './poseDetectionTypes';

interface PoseRendererProps {
  pose: posenet.Pose | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  kneeAngle: number | null;
  hipAngle: number | null;
  currentSquatState: SquatState;
  config?: PoseDetectionConfig;
}

const PoseRenderer: React.FC<PoseRendererProps> = ({
  pose,
  canvasRef,
  kneeAngle,
  hipAngle,
  currentSquatState,
  config
}) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [renderCount, setRenderCount] = useState(0);
  
  // Adjust canvas to match video dimensions - with optimization to reduce unnecessary updates
  const adjustCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    // Get actual display dimensions
    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;
    
    // If dimensions have changed, update canvas size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Set canvas display size (css pixels)
      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";
      
      // Set actual size in memory (scaled for high DPI displays)
      // For performance, limit DPR to 2 max
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr);
      
      // Store the new size
      setCanvasSize({ width: displayWidth, height: displayHeight });
    }
    
    // Clear the canvas after resize
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);
  
  // Set up resize observer with debounce for better performance
  useEffect(() => {
    adjustCanvas();
    
    // Debounce resize handling
    let resizeTimeout: number | null = null;
    
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      
      resizeTimeout = window.setTimeout(() => {
        adjustCanvas();
      }, 200);
    };
    
    // Watch for container resize
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    
    // Also watch for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustCanvas, canvasRef]);
  
  // Pre-compute connections for drawing skeleton
  const adjacentKeyPoints = useMemo(() => [
    ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
    ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
    ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
    ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
    ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
    ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
    ['rightKnee', 'rightAnkle'],
    // Connect shoulders and hips to form torso
    ['leftShoulder', 'rightShoulder'],
    ['leftHip', 'rightHip']
  ], []);
  
  // Draw pose keypoints and skeleton on canvas with performance optimizations
  const drawPose = useCallback(() => {
    if (!pose || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width / (Math.min(window.devicePixelRatio || 1, 2)), 
                      canvas.height / (Math.min(window.devicePixelRatio || 1, 2)));
    
    // Calculate scale factors for the canvas
    const videoWidth = config?.inputResolution.width || 640; 
    const videoHeight = config?.inputResolution.height || 480;
    const scaleX = canvasSize.width / videoWidth;
    const scaleY = canvasSize.height / videoHeight;
    
    // Minimum confidence threshold for displaying keypoints
    const minPartConfidence = config?.minPartConfidence || 0.5;
    
    // Performance optimization: Only draw the most important keypoints on low-end devices
    const optimizationLevel = config?.optimizationLevel || 'balanced';
    const isHighPerformanceMode = optimizationLevel === 'performance';
    
    // Keypoints to always draw regardless of performance mode
    const criticalKeypoints = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 
                               'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'];
    
    // Draw keypoints with optimization
    pose.keypoints.forEach(keypoint => {
      // Skip non-critical keypoints in high performance mode
      if (isHighPerformanceMode && !criticalKeypoints.includes(keypoint.part)) {
        return;
      }
      
      if (keypoint.score > minPartConfidence) {
        // Determine color based on keypoint type
        let color = 'aqua';
        if (keypoint.part.includes('Shoulder') || keypoint.part.includes('Hip')) {
          color = 'yellow';
        } else if (keypoint.part.includes('Knee')) {
          color = 'lime';
        } else if (keypoint.part.includes('Ankle')) {
          color = 'orange'; 
        }
        
        // Draw point
        ctx.beginPath();
        ctx.arc(
          keypoint.position.x * scaleX, 
          keypoint.position.y * scaleY, 
          isHighPerformanceMode ? 4 : 6, 0, 2 * Math.PI
        );
        ctx.fillStyle = color;
        ctx.fill();
        
        // Add keypoint label only in balanced or accuracy mode
        if (!isHighPerformanceMode) {
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.fillText(
            keypoint.part, 
            keypoint.position.x * scaleX + 11, 
            keypoint.position.y * scaleY + 1
          );
          ctx.fillStyle = 'white';
          ctx.fillText(
            keypoint.part, 
            keypoint.position.x * scaleX + 10, 
            keypoint.position.y * scaleY
          );
        }
      }
    });
    
    // Draw skeleton with optimization
    adjacentKeyPoints.forEach(([partA, partB]) => {
      // Skip some connections in high performance mode
      if (isHighPerformanceMode) {
        const isImportantConnection = 
          (partA.includes('Shoulder') || partA.includes('Hip') || 
           partA.includes('Knee') || partA.includes('Ankle')) &&
          (partB.includes('Shoulder') || partB.includes('Hip') || 
           partB.includes('Knee') || partB.includes('Ankle'));
        
        if (!isImportantConnection) return;
      }
      
      const keyPointA = pose.keypoints.find(kp => kp.part === partA);
      const keyPointB = pose.keypoints.find(kp => kp.part === partB);
      
      if (keyPointA && keyPointB && 
          keyPointA.score > minPartConfidence && 
          keyPointB.score > minPartConfidence) {
            
        // Different colors for different body parts
        let color = 'white';
        if ((partA.includes('Shoulder') && partB.includes('Hip')) || 
            (partA.includes('Hip') && partB.includes('Shoulder'))) {
          // Torso connections
          color = 'yellow';
          ctx.lineWidth = isHighPerformanceMode ? 3 : 4;
        } else if (partA.includes('Knee') || partB.includes('Knee')) {
          // Knee connections - highlight the important parts for squats
          color = 'lime';
          ctx.lineWidth = isHighPerformanceMode ? 3 : 4;
        } else {
          ctx.lineWidth = isHighPerformanceMode ? 2 : 3;
        }
        
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(keyPointA.position.x * scaleX, keyPointA.position.y * scaleY);
        ctx.lineTo(keyPointB.position.x * scaleX, keyPointB.position.y * scaleY);
        ctx.stroke();
      }
    });
    
    // Draw joint angles with better visibility
    const addAngleDisplay = (
      angle: number | null, 
      label: string, 
      keypoint: string, 
      offsetX: number = 10, 
      offsetY: number = 0
    ) => {
      if (angle === null) return;
      
      const kp = pose.keypoints.find(kp => kp.part === keypoint);
      if (kp && kp.score > minPartConfidence) {
        // Background for better readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
          kp.position.x * scaleX + offsetX - 2, 
          kp.position.y * scaleY + offsetY - 16, 
          90, 
          20
        );
        
        // Text
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(
          `${label}: ${angle}°`, 
          kp.position.x * scaleX + offsetX, 
          kp.position.y * scaleY + offsetY
        );
      }
    };
    
    // Add knee and hip angles - critical info
    addAngleDisplay(kneeAngle, 'Knee', 'leftKnee');
    addAngleDisplay(hipAngle, 'Hip', 'leftHip');
    
    // Draw squat state and confidence indicators
    const drawStateInfo = () => {
      // Background for status display
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 200, 70);
      
      // Squat state
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`State: ${currentSquatState}`, 20, 35);
      
      // Pose confidence
      ctx.font = '16px Arial';
      
      // Color based on confidence
      const confidenceColor = pose.score > 0.6 ? 'lime' : 
                             pose.score > 0.4 ? 'yellow' : 'red';
      
      ctx.fillStyle = confidenceColor;
      ctx.fillText(`Confidence: ${Math.round(pose.score * 100)}%`, 20, 65);
    };
    
    drawStateInfo();
    
    // Update render count for performance tracking
    setRenderCount(prev => prev + 1);
    
  }, [pose, canvasRef, kneeAngle, hipAngle, currentSquatState, canvasSize, config, adjacentKeyPoints]);

  // Run the drawing effect with requestAnimationFrame for smoother rendering
  useEffect(() => {
    let animationId: number | null = null;
    
    const renderLoop = () => {
      if (pose) {
        drawPose();
      }
      animationId = requestAnimationFrame(renderLoop);
    };
    
    // Start render loop
    animationId = requestAnimationFrame(renderLoop);
    
    return () => {
      // Cancel animation on cleanup
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
      
      // Clear canvas when no pose is detected
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };
  }, [pose, drawPose, canvasRef]);

  return null;
};

export default PoseRenderer;
