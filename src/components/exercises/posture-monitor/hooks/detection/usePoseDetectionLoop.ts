
import { useRef, useCallback, useEffect } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { UsePoseDetectionLoopProps } from './types';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { FeedbackType } from '../../types';

export const usePoseDetectionLoop = ({
  model,
  cameraActive,
  videoRef,
  config,
  onPoseDetected,
  setFeedback
}: UsePoseDetectionLoopProps) => {
  const requestAnimationRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);
  
  // Helpers for detection failures and timing
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  // Helper for frame rate adaptation
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  // Check if video is ready for detection
  const isVideoReady = useCallback(() => {
    if (!videoRef.current) return false;
    
    return (
      videoRef.current.readyState >= 2 && 
      !videoRef.current.paused && 
      videoRef.current.videoWidth > 0 &&
      videoRef.current.videoHeight > 0
    );
  }, [videoRef]);
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    // Prevent concurrent detection runs
    if (isDetectingRef.current) return;
    
    if (!model || !videoRef.current || !cameraActive) {
      if (!model) console.log("Cannot detect pose: missing model");
      if (!videoRef.current) console.log("Cannot detect pose: missing video element");
      if (!cameraActive) console.log("Cannot detect pose: camera inactive");
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      // Check if video is ready for processing
      if (!isVideoReady()) {
        // Video not ready yet, retry soon
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      isDetectingRef.current = true;
      
      // Calculate time since last successful detection for performance monitoring
      const now = performance.now();
      
      // Estimate pose
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true  // Mirror the camera view
      });
      
      console.log("Pose detected, score:", detectedPose.score);
      updateDetectionTime();
      
      // Reset failure counter on successful detection
      resetFailureCounter();
      
      // Calculate FPS for monitoring
      const detectionTime = performance.now() - now;
      console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > config.minPoseConfidence) {
        onPoseDetected(detectedPose);
      } else {
        // Pose confidence is too low
        console.warn("Low confidence in pose detection:", detectedPose.score);
        setFeedback(
          "Can't detect your pose clearly. Ensure good lighting and that your full body is visible.",
          FeedbackType.WARNING
        );
      }
    } catch (error) {
      handleDetectionFailure(error);
    } finally {
      isDetectingRef.current = false;
    }
    
    // Continue the detection loop with adaptive frame rate
    // If detection is taking too long, we'll slow down the frame rate
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
    isVideoReady
  ]);
  
  // Start pose detection when camera is active
  useEffect(() => {
    if (cameraActive && model) {
      console.log("Starting pose detection loop...");
      
      // Wait for 1 second before starting detection to make sure video is initialized
      const startTimeout = setTimeout(() => {
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      }, 1000);
      
      return () => {
        // Cleanup animation frame on unmount or dependency change
        clearTimeout(startTimeout);
        
        if (requestAnimationRef.current) {
          if (typeof requestAnimationRef.current === 'number') {
            cancelAnimationFrame(requestAnimationRef.current);
          } else {
            clearTimeout(requestAnimationRef.current);
          }
          requestAnimationRef.current = null;
        }
      };
    }
  }, [cameraActive, model, detectPose]);
  
  // Cleanup on unmount
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
    isDetectionRunning: !!requestAnimationRef.current
  };
};
