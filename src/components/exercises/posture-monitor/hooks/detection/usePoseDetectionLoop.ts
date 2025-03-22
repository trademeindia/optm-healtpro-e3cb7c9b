
import { useState, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { FeedbackType } from '../../types';
// Fix the import error - import directly without referring to useDetectionLoop
import { useDetectionStatus } from './useDetectionStatus';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { performanceMonitor } from '../../../utils/performanceMonitor';

export interface UsePoseDetectionLoopProps {
  model: posenet.PoseNet | null;
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  config: any;
  onPoseDetected: (pose: posenet.Pose) => void;
  setFeedback: (message: string, type: FeedbackType) => void;
  videoReady: boolean;
}

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback,
  videoReady
}: UsePoseDetectionLoopProps) => {
  const [isDetectionRunning, setIsDetectionRunning] = useState(false);
  const { 
    detectionStatus, 
    setDetectionStatus,
    updateFpsStats
  } = useDetectionStatus();

  // Implement detection logic directly here
  const [requestIdRef] = useState({ current: null as number | null });
  const [frameCountRef] = useState({ current: 0 });
  
  const { 
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);

  useEffect(() => {
    const detectPose = async () => {
      if (!model || !videoRef.current || !cameraActive || !videoReady) {
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
          requestIdRef.current = null;
          setIsDetectionRunning(false);
        }
        return;
      }
  
      const endTiming = performanceMonitor.startTiming('poseDetection');
      
      try {
        frameCountRef.current += 1;
        
        // Skip frames for better performance
        if (frameCountRef.current % 2 !== 0) {
          requestIdRef.current = requestAnimationFrame(detectPose);
          return;
        }
        
        const pose = await model.estimateSinglePose(
          videoRef.current, 
          {
            flipHorizontal: true,
            ...config
          }
        );
        
        endTiming();
        updateDetectionTime();
        resetFailureCounter();
        
        const currentTime = performance.now();
        const timeDiff = currentTime - detectionStateRef.current.lastFrameTime;
        detectionStateRef.current.lastFrameTime = currentTime;
        
        updateFpsStats(timeDiff, detectionStateRef);
        
        const validKeypoints = pose.keypoints.filter(kp => kp.score > (config.minPartConfidence || 0.5));
        
        setDetectionStatus({
          isDetecting: true,
          fps: detectionStatus.fps,
          confidence: pose.score,
          detectedKeypoints: validKeypoints.length,
          lastDetectionTime: currentTime
        });
        
        onPoseDetected(pose);
        
      } catch (error) {
        endTiming();
        handleDetectionFailure(error);
      }
      
      if (cameraActive && videoReady) {
        requestIdRef.current = requestAnimationFrame(detectPose);
      }
    };

    if (cameraActive && model && videoRef.current && videoReady && !requestIdRef.current) {
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
  }, [
    cameraActive, 
    model, 
    videoRef, 
    videoReady, 
    config, 
    onPoseDetected, 
    setFeedback,
    detectionStatus.fps,
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    setDetectionStatus,
    updateDetectionTime,
    updateFpsStats
  ]);

  return {
    isDetectionRunning,
    detectionStatus
  };
};
