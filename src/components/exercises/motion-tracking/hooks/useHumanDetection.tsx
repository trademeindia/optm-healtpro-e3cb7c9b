
import { useState, useEffect, useRef, useCallback } from 'react';
import { human, isModelLoaded } from '@/lib/human/core';
import { DetectionStatus, BodyAngles, DetectionOptions } from '@/lib/human/types';
import { calculateBodyAngles } from '@/lib/human/angles';
import { toast } from 'sonner';

export interface UseHumanDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
  showSkeleton?: boolean;
  onPoseDetected?: (pose: any) => void;
  onAngleUpdate?: (angles: BodyAngles) => void;
}

export const useHumanDetection = (options: UseHumanDetectionProps) => {
  const { videoRef, canvasRef, isActive, showSkeleton = true, onPoseDetected, onAngleUpdate } = options;
  
  // State
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [angles, setAngles] = useState<BodyAngles>({
    kneeAngle: null,
    hipAngle: null,
    shoulderAngle: null
  });
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null,
    detectedKeypoints: 0,
    lastDetectionTime: 0
  });
  const [feedback, setFeedback] = useState<{ message: string | null; type: string } | null>(null);
  
  // Refs
  const requestRef = useRef<number | null>(null);
  const frameCounter = useRef(0);
  const lastFpsUpdate = useRef(Date.now());
  const isDetectingRef = useRef(false);
  
  // Load model on mount
  useEffect(() => {
    const loadModel = async () => {
      if (isModelLoaded()) {
        setIsModelLoading(false);
        return;
      }
      
      try {
        setIsModelLoading(true);
        await human.load();
        setIsModelLoading(false);
        
        console.log('Human.js model loaded in hook');
      } catch (error) {
        console.error('Error loading Human.js model in hook:', error);
        toast.error('Failed to load AI motion detection model');
        setIsModelLoading(false);
      }
    };
    
    loadModel();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, []);
  
  // Process frame with pose detection
  const detectFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isDetectingRef.current) {
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }
    
    try {
      // Update FPS counter
      frameCounter.current++;
      const now = Date.now();
      if (now - lastFpsUpdate.current > 1000) {
        setDetectionStatus(prev => ({
          ...prev,
          fps: frameCounter.current,
          lastDetectionTime: now
        }));
        frameCounter.current = 0;
        lastFpsUpdate.current = now;
      }
      
      // Perform detection
      const detectionResult = await human.detect(videoRef.current);
      
      // Handle result
      setResult(detectionResult);
      
      // Draw results if skeleton visualization is enabled
      if (showSkeleton && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Clear canvas before drawing
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Draw pose skeleton
          await human.draw.all(canvasRef.current, detectionResult);
        }
      }
      
      // Calculate angles if a body was detected
      if (detectionResult.body && detectionResult.body.length > 0) {
        const pose = detectionResult.body[0];
        const bodyAngles = calculateBodyAngles(pose);
        
        // Update angles
        setAngles(bodyAngles);
        
        // Call angle update callback if provided
        if (onAngleUpdate) {
          onAngleUpdate(bodyAngles);
        }
        
        // Update detection status with confidence
        setDetectionStatus(prev => ({
          ...prev,
          confidence: pose.score,
          detectedKeypoints: pose.keypoints?.filter((kp: any) => kp.score > 0.5).length || 0
        }));
        
        // Call pose detected callback if provided
        if (onPoseDetected) {
          onPoseDetected(pose);
        }
      }
      
      // Continue detection loop
      requestRef.current = requestAnimationFrame(detectFrame);
    } catch (error) {
      console.error('Error in Human.js detection:', error);
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  }, [videoRef, canvasRef, showSkeleton, onPoseDetected, onAngleUpdate]);
  
  // Start detection
  const startDetection = useCallback(() => {
    if (isModelLoading) {
      toast.error('AI model is still loading');
      return;
    }
    
    console.log('Starting Human.js detection');
    isDetectingRef.current = true;
    setDetectionStatus(prev => ({ ...prev, isDetecting: true }));
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    // Start detection loop
    requestRef.current = requestAnimationFrame(detectFrame);
  }, [isModelLoading, detectFrame]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    console.log('Stopping Human.js detection');
    isDetectingRef.current = false;
    setDetectionStatus(prev => ({ ...prev, isDetecting: false }));
    
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);
  
  // Reset detection
  const resetDetection = useCallback(() => {
    stopDetection();
    setResult(null);
    setAngles({
      kneeAngle: null,
      hipAngle: null,
      shoulderAngle: null
    });
    setFeedback(null);
  }, [stopDetection]);
  
  // Toggle detection based on isActive prop
  useEffect(() => {
    if (isActive && !isDetectingRef.current && !isModelLoading) {
      startDetection();
    } else if (!isActive && isDetectingRef.current) {
      stopDetection();
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isActive, isModelLoading, startDetection, stopDetection]);
  
  return {
    isModelLoading,
    detectionStatus,
    result,
    angles,
    feedback,
    startDetection,
    stopDetection,
    resetDetection
  };
};
