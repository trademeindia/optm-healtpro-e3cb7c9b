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
  
  const {
    detectionStateRef,
    handleDetectionFailure,
    resetFailureCounter,
    updateDetectionTime
  } = useDetectionFailureHandler(setFeedback);
  
  const { calculateFrameDelay } = useAdaptiveFrameRate();
  
  const updateFpsStats = useCallback((detectionTime: number) => {
    const now = performance.now();
    
    if (!detectionStateRef.current.frameTimes.length || 
        now - detectionStateRef.current.frameTimes[0] > 1000) {
      detectionStateRef.current.frameTimes = [now];
      detectionStateRef.current.cumulativeProcessingTime = detectionTime;
      detectionStateRef.current.framesProcessed = 1;
    } else {
      detectionStateRef.current.frameTimes.push(now);
      detectionStateRef.current.cumulativeProcessingTime += detectionTime;
      detectionStateRef.current.framesProcessed++;
      
      while (detectionStateRef.current.frameTimes.length > 0 && 
             now - detectionStateRef.current.frameTimes[0] > 1000) {
        detectionStateRef.current.frameTimes.shift();
      }
    }
    
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
      
      if (now % 3000 < 100) {
        console.log(`Detection stats: ${fps.toFixed(1)} FPS, avg processing: ${avgProcessingTime.toFixed(1)}ms`);
      }
    }
  }, [detectionStateRef]);
  
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
      
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: false
      }));
      
      requestAnimationRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      if (!isVideoReady()) {
        setDetectionStatus(prev => ({
          ...prev,
          isDetecting: false
        }));
        
        requestAnimationRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      isDetectingRef.current = true;
      
      const startTime = performance.now();
      
      const detectedPose = await model.estimateSinglePose(videoRef.current, {
        flipHorizontal: true,
        nmsRadius: 30
      });
      
      const detectionTime = performance.now() - startTime;
      updateFpsStats(detectionTime);
      updateDetectionTime();
      
      const visibleKeypoints = detectedPose.keypoints.filter(kp => kp.score > config.minPartConfidence).length;
      
      setDetectionStatus(prev => ({
        ...prev,
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
      
      setDetectionStatus(prev => ({
        ...prev,
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
    updateFpsStats
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
