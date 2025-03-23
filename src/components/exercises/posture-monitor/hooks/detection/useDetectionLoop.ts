
import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { UsePoseDetectionLoopProps, DetectionStateRef } from './types';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { useDetectionStatus } from './useDetectionStatus';
import { useVideoReadyCheck } from './useVideoReadyCheck';
import { usePoseEstimation } from './usePoseEstimation';
import { FeedbackType } from '../../types';

export const useDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback,
  videoReady
}: UsePoseDetectionLoopProps) => {
  const requestAnimationRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);
  const detectionStateRef = useRef<DetectionStateRef>({
    lastDetectionTime: 0,
    detectionFailureCount: 0,
    consecutiveFailures: 0
  });
  
  const {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats,
    updateDetectionStatus
  } = useDetectionStatus();
  
  const {
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback, detectionStateRef);
  
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  const { isVideoReady } = useVideoReadyCheck({ videoRef, videoReady });
  
  const handlePoseDetectionSuccess = useCallback((detectedPose: posenet.Pose, detectionTime: number) => {
    updateFpsStats(detectionTime, detectionStateRef);
    updateDetectionTime();
    
    const visibleKeypoints = detectedPose.keypoints.filter(kp => kp.score > config.minPartConfidence).length;
    
    updateDetectionStatus({
      isDetecting: true,
      confidence: detectedPose.score,
      detectedKeypoints: visibleKeypoints,
      lastDetectionTime: performance.now()
    });
    
    resetFailureCounter();
    
    if (detectedPose.score > config.minPoseConfidence) {
      onPoseDetected(detectedPose);
    }
  }, [
    updateFpsStats, 
    detectionStateRef, 
    updateDetectionTime, 
    config, 
    updateDetectionStatus, 
    resetFailureCounter, 
    onPoseDetected
  ]);
  
  const { estimatePose } = usePoseEstimation({
    model,
    videoRef,
    config,
    onDetectionSuccess: handlePoseDetectionSuccess,
    onDetectionFailure: handleDetectionFailure,
    setFeedback
  });
  
  const detectPose = useCallback(async () => {
    if (isDetectingRef.current) return;
    
    if (!model || !videoRef.current || !cameraActive) {
      if (!model) console.log("Cannot detect pose: missing model");
      if (!videoRef.current) console.log("Cannot detect pose: missing video element");
      if (!cameraActive) console.log("Cannot detect pose: camera inactive");
      
      updateDetectionStatus({ isDetecting: false });
      
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      if (!isVideoReady()) {
        updateDetectionStatus({ isDetecting: false });
        
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      isDetectingRef.current = true;
      await estimatePose();
    } catch (error) {
      updateDetectionStatus({ isDetecting: false });
    } finally {
      isDetectingRef.current = false;
    }
    
    const frameDelay = calculateFrameDelay(detectionStateRef.current.lastDetectionTime);
    requestAnimationRef.current = setTimeout(() => {
      requestAnimationRef.current = requestAnimationFrame(detectPose);
    }, frameDelay) as unknown as number;
  }, [
    model, 
    cameraActive, 
    videoRef, 
    isVideoReady, 
    estimatePose,
    updateDetectionStatus,
    calculateFrameDelay,
    detectionStateRef
  ]);
  
  useEffect(() => {
    if (cameraActive && model) {
      console.log("Starting pose detection loop...");
      
      const startTimeout = setTimeout(() => {
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      }, 1000);
      
      return () => {
        clearTimeout(startTimeout);
        
        if (requestAnimationRef.current) {
          if (typeof requestAnimationRef.current === 'number') {
            cancelAnimationFrame(requestAnimationRef.current);
          } else {
            clearTimeout(requestAnimationRef.current);
          }
          requestAnimationRef.current = null;
        }
        
        updateDetectionStatus({ isDetecting: false });
      };
    } else {
      updateDetectionStatus({ isDetecting: false });
    }
  }, [cameraActive, model, detectPose, updateDetectionStatus]);
  
  useEffect(() => {
    return () => {
      if (requestAnimationRef.current) {
        if (typeof requestAnimationRef.current === 'number') {
          cancelAnimationFrame(requestAnimationRef.current);
        } else {
          clearTimeout(requestAnimationRef.current);
        }
        requestAnimationRef.current = null;
      }
    };
  }, []);
  
  return {
    isDetectionRunning: !!requestAnimationRef.current,
    detectionStatus
  };
};
