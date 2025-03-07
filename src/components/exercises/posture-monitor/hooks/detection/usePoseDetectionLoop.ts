
import { useRef, useCallback, useEffect, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import { UsePoseDetectionLoopProps, DetectionState } from './types';
import { useDetectionFailureHandler } from './useDetectionFailureHandler';
import { useAdaptiveFrameRate } from './useAdaptiveFrameRate';
import { FeedbackType } from '../../types';

export interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  lastDetectionTime: number;
  confidence: number | null;
  detectedKeypoints: number;
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
  const requestAnimationRef = useRef<number | null>(null);
  const isDetectingRef = useRef(false);
  const lastFpsUpdateTime = useRef<number>(0);
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    lastDetectionTime: 0,
    confidence: null,
    detectedKeypoints: 0
  });
  
  // Helpers for detection failures and timing
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  // Helper for frame rate adaptation
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  // Function to calculate and update FPS
  const updateFpsStats = useCallback((detectionTime: number) => {
    const now = performance.now();
    
    // Initialize or reset FPS calculation window
    if (!detectionStateRef.current.frameTimes.length || 
        now - detectionStateRef.current.frameTimes[0] > 1000) {
      detectionStateRef.current.frameTimes = [now];
      detectionStateRef.current.cumulativeProcessingTime = detectionTime;
      detectionStateRef.current.framesProcessed = 1;
    } else {
      // Add to the current window
      detectionStateRef.current.frameTimes.push(now);
      detectionStateRef.current.cumulativeProcessingTime += detectionTime;
      detectionStateRef.current.framesProcessed++;
      
      // Remove old frames outside the 1-second window
      while (detectionStateRef.current.frameTimes.length > 0 && 
             now - detectionStateRef.current.frameTimes[0] > 1000) {
        detectionStateRef.current.frameTimes.shift();
      }
    }
    
    // Update FPS every 500ms
    if (now - lastFpsUpdateTime.current > 500) {
      const frameCount = detectionStateRef.current.frameTimes.length;
      const timeWindow = frameCount > 1 
        ? (detectionStateRef.current.frameTimes[frameCount - 1] - detectionStateRef.current.frameTimes[0]) / 1000
        : 1;
      
      const fps = frameCount / timeWindow;
      const avgProcessingTime = detectionStateRef.current.cumulativeProcessingTime / detectionStateRef.current.framesProcessed;
      
      setDetectionStatus(prev => ({
        ...prev,
        fps,
        isDetecting: true,
        lastDetectionTime: now
      }));
      
      lastFpsUpdateTime.current = now;
      
      // Log less frequently to avoid console spam
      if (now % 3000 < 100) {
        console.log(`Detection stats: ${fps.toFixed(1)} FPS, avg processing: ${avgProcessingTime.toFixed(1)}ms`);
      }
    }
  }, [detectionStateRef]);
  
  // Check if video is ready for detection
  const isVideoReady = useCallback(() => {
    // First use the videoReady flag passed from parent
    if (videoReady === false) return false;
    
    // Double-check the video element
    if (!videoRef.current) return false;
    
    const video = videoRef.current;
    
    return (
      video.readyState >= 2 && 
      !video.paused && 
      video.videoWidth > 0 &&
      video.videoHeight > 0
    );
  }, [videoRef, videoReady]);
  
  // Detect pose in video stream
  const detectPose = useCallback(async () => {
    // Prevent concurrent detection runs
    if (isDetectingRef.current) return;
    
    if (!model || !videoRef.current || !cameraActive) {
      if (!model) console.log("Cannot detect pose: missing model");
      if (!videoRef.current) console.log("Cannot detect pose: missing video element");
      if (!cameraActive) console.log("Cannot detect pose: camera inactive");
      
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: false
      }));
      
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      // Check if video is ready for processing
      if (!isVideoReady()) {
        // Video not ready yet, retry soon but don't count as error
        setDetectionStatus(prev => ({
          ...prev,
          isDetecting: false
        }));
        
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      isDetectingRef.current = true;
      
      // Calculate time since last successful detection for performance monitoring
      const startTime = performance.now();
      
      // Estimate pose with higher accuracy settings for stability
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true,  // Mirror the camera view
        // maxPoseDetections has been removed as it's not part of SinglePersonInterfaceConfig
        scoreThreshold: 0.1,   // Lower threshold to detect more keypoints
        nmsRadius: 30          // Non-maximum suppression radius
      });
      
      // Calculate performance metrics
      const detectionTime = performance.now() - startTime;
      updateFpsStats(detectionTime);
      updateDetectionTime();
      
      // Count visible keypoints for diagnostics
      const visibleKeypoints = detectedPose.keypoints.filter(kp => kp.score > config.minPartConfidence).length;
      
      // Update status with confidence and keypoint count
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: true,
        confidence: detectedPose.score,
        detectedKeypoints: visibleKeypoints,
        lastDetectionTime: performance.now()
      }));
      
      // Log pose detection details but less frequently
      if (performance.now() % 5000 < 100) {
        console.log(`Pose detected, score: ${detectedPose.score}`);
        console.log(`Pose detection completed in ${detectionTime.toFixed(2)}ms (${(1000/detectionTime).toFixed(1)} FPS)`);
      }
      
      // Reset failure counter on successful detection
      resetFailureCounter();
      
      // Only proceed if we have a pose with sufficient confidence
      if (detectedPose.score > config.minPoseConfidence) {
        onPoseDetected(detectedPose);
      } else {
        // If confidence is really low, show a warning
        if (detectedPose.score < 0.1) {
          setFeedback(
            "Can't detect your pose clearly. Ensure good lighting and that your full body is visible.",
            FeedbackType.WARNING
          );
        }
      }
    } catch (error) {
      handleDetectionFailure(error);
      
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: false
      }));
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
    isVideoReady,
    updateFpsStats
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
        
        setDetectionStatus(prev => ({
          ...prev,
          isDetecting: false
        }));
      };
    } else {
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: false
      }));
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
    isDetectionRunning: !!requestAnimationRef.current,
    detectionStatus
  };
};
