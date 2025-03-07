
import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { UsePoseDetectionLoopProps } from './types';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { useDetectionStatus } from './useDetectionStatus';
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
  
  const {
    detectionStatus,
    setDetectionStatus,
    updateFpsStats
  } = useDetectionStatus();
  
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  const isVideoReady = useCallback(() => {
    if (videoReady === false) return false;
    
    if (!videoRef.current) return false;
    
    const video = videoRef.current;
    
    return (
      video.readyState >= 2 && 
      !video.paused && 
      video.videoWidth > 0 &&
      video.videoHeight > 0
    );
  }, [videoRef, videoReady]);
  
  const detectPose = useCallback(async () => {
    if (isDetectingRef.current) return;
    
    if (!model || !videoRef.current || !cameraActive) {
      if (!model) console.log("Cannot detect pose: missing model");
      if (!videoRef.current) console.log("Cannot detect pose: missing video element");
      if (!cameraActive) console.log("Cannot detect pose: camera inactive");
      
      setDetectionStatus(prevStatus => ({
        ...prevStatus,
        isDetecting: false
      }));
      
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      if (!isVideoReady()) {
        setDetectionStatus(prevStatus => ({
          ...prevStatus,
          isDetecting: false
        }));
        
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      isDetectingRef.current = true;
      
      const startTime = performance.now();
      
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true
      });
      
      const detectionTime = performance.now() - startTime;
      updateFpsStats(detectionTime, detectionStateRef);
      updateDetectionTime();
      
      const visibleKeypoints = detectedPose.keypoints.filter(kp => kp.score > config.minPartConfidence).length;
      
      setDetectionStatus(prevStatus => ({
        ...prevStatus,
        isDetecting: true,
        confidence: detectedPose.score,
        detectedKeypoints: visibleKeypoints,
        lastDetectionTime: performance.now()
      }));
      
      if (performance.now() % 5000 < 100) {
        console.log(`Pose detected, score: ${detectedPose.score}`);
        console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      }
      
      resetFailureCounter();
      
      if (detectedPose.score > config.minPoseConfidence) {
        onPoseDetected(detectedPose);
      } else {
        if (detectedPose.score < 0.1) {
          setFeedback(
            "Can't detect your pose clearly. Ensure good lighting and that your full body is visible.",
            FeedbackType.WARNING
          );
        }
      }
    } catch (error) {
      handleDetectionFailure(error);
      
      setDetectionStatus(prevStatus => ({
        ...prevStatus,
        isDetecting: false
      }));
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
    config, 
    onPoseDetected, 
    setFeedback, 
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime,
    calculateFrameDelay,
    isVideoReady,
    updateFpsStats,
    setDetectionStatus,
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
        
        setDetectionStatus(prevStatus => ({
          ...prevStatus,
          isDetecting: false
        }));
      };
    } else {
      setDetectionStatus(prevStatus => ({
        ...prevStatus,
        isDetecting: false
      }));
    }
  }, [cameraActive, model, detectPose, setDetectionStatus]);
  
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
