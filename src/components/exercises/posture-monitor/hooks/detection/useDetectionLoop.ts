
import { useState, useEffect, useRef, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionLoopProps } from './types';
import { FeedbackType } from '../../types';
import { useDetectionStatus } from './useDetectionStatus';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { performanceMonitor } from '../../../utils/performanceMonitor';

export const usePoseDetectionLoop = ({ 
  model, 
  cameraActive, 
  videoRef, 
  config, 
  onPoseDetected, 
  setFeedback, 
  videoReady 
}: PoseDetectionLoopProps) => {
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  const requestIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  
  // Detection status management
  const { 
    detectionStatus, 
    setDetectionStatus,
    updateFpsStats
  } = useDetectionStatus();
  
  // Detection failure handling
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  // Skip frames for better performance
  const shouldProcessFrame = useCallback(() => {
    // Process every frame when starting
    if (frameCountRef.current < 30) return true;
    
    // Then process every 2nd frame to save resources
    return frameCountRef.current % 2 === 0;
  }, []);
  
  // Detect pose in current video frame
  const detectPose = useCallback(async () => {
    if (!model || !videoRef.current || !cameraActive || !videoReady) {
      // Stop detection if prerequisites not met
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
        setIsDetectionRunning(false);
      }
      return;
    }
    
    // Start performance timing
    const endTiming = performanceMonitor.startTiming('poseDetection');
    
    try {
      frameCountRef.current += 1;
      
      // Skip frames for better performance
      if (!shouldProcessFrame()) {
        // Still process animation frame but skip the heavy detection
        requestIdRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      // Get actual pose detection with configured parameters
      const pose = await model.estimateSinglePose(
        videoRef.current, 
        {
          flipHorizontal: true,
          ...config
        }
      );
      
      // Record successful detection
      endTiming();
      updateDetectionTime();
      resetFailureCounter();
      
      // Calculate FPS
      const currentTime = performance.now();
      const timeDiff = currentTime - detectionStateRef.current.lastFrameTime;
      detectionStateRef.current.lastFrameTime = currentTime;
      
      // Update FPS in status
      updateFpsStats(timeDiff, detectionStateRef);
      
      // Process detected keypoints
      const validKeypoints = pose.keypoints.filter(kp => kp.score > (config.minPartConfidence || 0.5));
      
      // Update detection status with results
      setDetectionStatus({
        isDetecting: true,
        fps: detectionStatus.fps,
        confidence: pose.score,
        detectedKeypoints: validKeypoints.length,
        lastDetectionTime: currentTime
      });
      
      // Pass the detected pose to handler
      onPoseDetected(pose);
      
    } catch (error) {
      endTiming();
      handleDetectionFailure(error);
    }
    
    // Continue detection loop
    if (cameraActive && videoReady) {
      requestIdRef.current = requestAnimationFrame(detectPose);
    }
  }, [
    model, 
    videoRef, 
    cameraActive, 
    videoReady, 
    config, 
    onPoseDetected, 
    shouldProcessFrame, 
    updateDetectionTime, 
    resetFailureCounter, 
    updateFpsStats, 
    detectionStateRef, 
    setDetectionStatus, 
    detectionStatus.fps, 
    handleDetectionFailure
  ]);
  
  // Start detection when dependencies change
  useEffect(() => {
    const shouldStartDetection = 
      cameraActive && 
      model && 
      videoRef.current && 
      videoReady && 
      !requestIdRef.current;
    
    if (shouldStartDetection) {
      console.log("Starting pose detection loop");
      setFeedback("Starting pose detection...", FeedbackType.INFO);
      frameCountRef.current = 0;
      requestIdRef.current = requestAnimationFrame(detectPose);
      setIsDetectionRunning(true);
    }
    
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
        setIsDetectionRunning(false);
      }
    };
  }, [cameraActive, model, videoRef, videoReady, detectPose, setFeedback]);
  
  return {
    isDetectionRunning,
    detectionStatus
  };
};
