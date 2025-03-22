import { useState, useRef, useEffect, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { FeedbackType } from '../types';
import { HumanDetectionStatus } from '../types';
import { performanceMonitor } from '../../utils/performanceMonitor';
import { tensorflowMemoryManager } from '../../utils/tensorflowMemoryManager';
import { humanModelManager } from '../../utils/humanModelManager';
import { cameraResolutionManager } from '../../utils/cameraResolutionManager';

interface UseHumanDetectionProps {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
}

export const useHumanDetection = ({
  cameraActive,
  videoRef,
  canvasRef,
  onFeedbackChange
}: UseHumanDetectionProps) => {
  // State
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [lastDetection, setLastDetection] = useState<Human.Result | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<HumanDetectionStatus>({
    isActive: false,
    fps: null,
    confidence: null,
  });
  
  // Refs
  const humanRef = useRef<Human.Human | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fpsCounterRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);
  const isDisposingRef = useRef(false);
  const errorCountRef = useRef(0);
  const lastPerformanceCheckRef = useRef(Date.now());
  const adaptiveFrameSkipRef = useRef(1); // Adaptive frame skipping (1 = process every frame)
  
  // Initialize Human.js with optimized settings
  useEffect(() => {
    if (humanRef.current) return; // Already initialized
    
    const initializeHuman = async () => {
      try {
        setIsModelLoading(true);
        onFeedbackChange("Loading motion detection model...", FeedbackType.INFO);
        
        console.log("Initializing Human.js");
        
        // Check if WebGL is available, show warning if not
        if (!humanModelManager.checkWebGLSupport()) {
          onFeedbackChange(
            "Your browser may not support hardware acceleration. Motion detection might be slow.",
            FeedbackType.WARNING
          );
        }
        
        // Configure TensorFlow for best performance
        tensorflowMemoryManager.configureForOptimalPerformance();
        
        // Initialize Human.js with progress feedback
        const human = await humanModelManager.initializeHuman((message) => {
          onFeedbackChange(message, FeedbackType.INFO);
        });
        
        if (human) {
          humanRef.current = human;
          setIsModelLoading(false);
          onFeedbackChange("Motion detection ready. Starting camera will begin tracking.", FeedbackType.SUCCESS);
          console.log("Human.js initialized successfully");
        } else {
          throw new Error("Failed to initialize Human.js");
        }
      } catch (error) {
        console.error("Error initializing Human.js:", error);
        setIsModelLoading(false);
        onFeedbackChange(
          "Failed to initialize motion detection. Please try refreshing the page.",
          FeedbackType.ERROR
        );
      }
    };
    
    initializeHuman();
    
    // Enhanced cleanup
    return () => {
      if (humanRef.current) {
        console.log("Cleaning up Human.js instance");
        isDisposingRef.current = true;
        
        // Clean up tensors and resources
        humanModelManager.cleanupHumanResources(humanRef.current);
        humanRef.current = null;
        
        isDisposingRef.current = false;
      }
    };
  }, [onFeedbackChange]);
  
  // Adaptive performance monitoring
  const checkPerformance = useCallback(() => {
    const now = Date.now();
    if (now - lastPerformanceCheckRef.current < 5000) return; // Check every 5 seconds
    
    lastPerformanceCheckRef.current = now;
    
    // Calculate current FPS from our counter
    if (fpsCounterRef.current.length >= 2) {
      const timeElapsed = fpsCounterRef.current[fpsCounterRef.current.length - 1] - 
                          fpsCounterRef.current[0];
      const frameCount = fpsCounterRef.current.length - 1;
      const fps = Math.round((1000 * frameCount) / timeElapsed);
      
      // Adjust frame skipping based on performance
      if (fps < 15 && adaptiveFrameSkipRef.current < 4) {
        adaptiveFrameSkipRef.current += 1;
        console.log(`Performance optimization: Increasing frame skip to ${adaptiveFrameSkipRef.current} (${fps} FPS)`);
        onFeedbackChange(
          "Optimizing detection performance for your device...", 
          FeedbackType.INFO
        );
      } else if (fps > 25 && adaptiveFrameSkipRef.current > 1) {
        adaptiveFrameSkipRef.current -= 1;
        console.log(`Performance optimization: Decreasing frame skip to ${adaptiveFrameSkipRef.current} (${fps} FPS)`);
      }
      
      // Check if we need to adapt video resolution
      if (videoRef.current && fps < 10) {
        cameraResolutionManager.adaptResolutionIfNeeded(videoRef.current, fpsCounterRef.current);
      }
      
      // Clean up memory if needed
      tensorflowMemoryManager.checkAndCleanupMemoryIfNeeded();
    }
  }, [onFeedbackChange, videoRef]);
  
  // Start detection loop with improved error handling
  const startDetection = useCallback(() => {
    if (!humanRef.current || !videoRef.current || !canvasRef.current || !cameraActive) {
      console.warn("Cannot start detection: missing prerequisites");
      return;
    }
    
    if (detectionIntervalRef.current) {
      console.log("Detection already running");
      return;
    }
    
    console.log("Starting Human.js detection loop");
    
    // Reset stats
    fpsCounterRef.current = [];
    frameCountRef.current = 0;
    errorCountRef.current = 0;
    adaptiveFrameSkipRef.current = 1;
    
    const detect = async () => {
      if (!humanRef.current || !videoRef.current || !cameraActive || isDisposingRef.current) {
        stopDetection();
        return;
      }
      
      frameCountRef.current += 1;
      
      // Skip frames for better performance based on adaptive frame skipping
      if (frameCountRef.current % adaptiveFrameSkipRef.current !== 0) {
        requestAnimationFrame(detect);
        return;
      }
      
      try {
        // Start timing
        const endTiming = performanceMonitor.startTiming('humanDetection');
        
        // Run detection
        const result = await humanRef.current.detect(videoRef.current);
        
        // Successful detection, reset error counter
        errorCountRef.current = 0;
        
        // End timing and record performance
        endTiming();
        
        // Calculate FPS
        const now = performance.now();
        fpsCounterRef.current.push(now);
        
        // Keep only the last 30 timestamps for FPS calculation
        if (fpsCounterRef.current.length > 30) {
          fpsCounterRef.current.shift();
        }
        
        // Calculate FPS based on the last 30 frames
        let fps = null;
        if (fpsCounterRef.current.length >= 2) {
          const timeElapsed = fpsCounterRef.current[fpsCounterRef.current.length - 1] - 
                             fpsCounterRef.current[0];
          const frameCount = fpsCounterRef.current.length - 1;
          fps = Math.round((1000 * frameCount) / timeElapsed);
        }
        
        // Check performance periodically and adjust settings
        checkPerformance();
        
        // Update status
        setDetectionStatus({
          isActive: true,
          fps,
          confidence: result.body[0]?.score || null
        });
        
        // Draw results on canvas if we have a body detection
        if (result.body && result.body.length > 0) {
          // Store the latest detection for analysis
          setLastDetection(result);
          
          // Draw to canvas
          if (canvasRef.current && humanRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              // First clear the canvas
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              
              // Draw the body detection results
              humanRef.current.draw.body(canvasRef.current, result.body);
            }
          }
        } else if (canvasRef.current) {
          // Clear canvas when no detection
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
        
        // Continue detection loop
        requestAnimationFrame(detect);
      } catch (error) {
        console.error("Error in Human.js detection:", error);
        
        // Increment error counter
        errorCountRef.current += 1;
        
        // If we have persistent errors, try to recover 
        if (errorCountRef.current > 5) {
          console.warn(`Multiple detection errors (${errorCountRef.current}), attempting recovery`);
          
          // Inform user
          onFeedbackChange("Detection issues detected. Trying to recover...", FeedbackType.WARNING);
          
          // Clean up TensorFlow memory to help recovery
          tensorflowMemoryManager.cleanupTensors();
          
          // Try to recover by restarting detection
          if (humanRef.current) {
            try {
              console.log("Performing emergency cleanup and reset");
              
              // Clear existing detection loop
              stopDetection();
              
              // Small delay before restarting
              setTimeout(() => {
                if (cameraActive) {
                  console.log("Restarting detection after recovery");
                  startDetection();
                  
                  // Reset error counter
                  errorCountRef.current = 0;
                }
              }, 1000);
              
              return; // Exit the current detection loop
            } catch (recoveryError) {
              console.error("Recovery attempt failed:", recoveryError);
              onFeedbackChange(
                "Detection issues persisting. Try reloading the page.",
                FeedbackType.ERROR
              );
            }
          }
        }
        
        // Try to continue detection despite error
        requestAnimationFrame(detect);
      }
    };
    
    // Initialize the detection loop
    frameCountRef.current = 0;
    fpsCounterRef.current = [];
    requestAnimationFrame(detect);
    
    setDetectionStatus(prev => ({ ...prev, isActive: true }));
    
  }, [cameraActive, videoRef, canvasRef, humanRef, checkPerformance, onFeedbackChange]);
  
  // Stop detection with enhanced cleanup
  function stopDetection() {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setDetectionStatus({
      isActive: false,
      fps: null,
      confidence: null,
    });
    
    // Release canvas resources
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    
    console.log("Human.js detection stopped");
  }
  
  // Automatically start/stop detection based on cameraActive state
  useEffect(() => {
    if (cameraActive && humanRef.current) {
      startDetection();
    } else if (!cameraActive && detectionStatus.isActive) {
      stopDetection();
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [cameraActive, detectionStatus.isActive, humanRef, startDetection]);
  
  return {
    isModelLoading,
    humanRef,
    lastDetection,
    detectionStatus,
    startDetection,
    stopDetection
  };
};
