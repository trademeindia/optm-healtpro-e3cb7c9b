
import { useState, useRef, useEffect, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { FeedbackType } from '../types';
import { HumanDetectionStatus } from '../types';
import { performanceMonitor } from '../../utils/performanceMonitor';

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
        
        // Memory usage check
        const memoryInfo = (performance as any).memory;
        const initialMemory = memoryInfo ? {
          totalJSHeapSize: memoryInfo.totalJSHeapSize,
          usedJSHeapSize: memoryInfo.usedJSHeapSize
        } : null;
        
        if (initialMemory) {
          console.log("Initial memory usage:", 
            `${Math.round(initialMemory.usedJSHeapSize / 1048576)}MB / ${Math.round(initialMemory.totalJSHeapSize / 1048576)}MB`);
        }
        
        // Detect device capabilities for adaptive settings
        const isLowEndDevice = navigator.hardwareConcurrency <= 4 || 
                              (initialMemory && initialMemory.totalJSHeapSize < 2 * 1073741824);
        
        console.log(`Detected ${isLowEndDevice ? 'low-end' : 'capable'} device, adjusting settings accordingly`);
                              
        // Configure Human.js with performance optimizations
        const config: Partial<Human.Config> = {
          modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
          filter: { enabled: true, equalization: false },
          face: { enabled: false },
          hand: { enabled: false },
          gesture: { enabled: false },
          // Configure body pose detection
          body: { 
            enabled: true,
            // For low-end devices, use lighter model
            modelPath: isLowEndDevice ? 'blazepose.json' : 'blazepose-heavy.json',
            minConfidence: 0.2, 
            maxDetected: 1, 
          },
          // Segmentation is expensive, disable it
          segmentation: { enabled: false },
          // Optimize for performance
          backend: 'webgl',
          // Reduced warmup for faster startup
          warmup: 'none',
          // Debug settings
          debug: false,
        };
        
        // Create Human instance with configuration
        const human = new Human.Human(config);
        
        // Pre-load and warm up the model with proper error handling
        try {
          await human.load();
          await human.warmup();
          
          humanRef.current = human;
          setIsModelLoading(false);
          onFeedbackChange("Motion detection ready. Starting camera will begin tracking.", FeedbackType.SUCCESS);
          
          console.log("Human.js initialized successfully");
        } catch (modelError) {
          console.error("Error during model loading:", modelError);
          // Try to recover with simpler model
          try {
            console.log("Attempting to load with lighter model as fallback...");
            config.body.modelPath = 'blazepose.json';
            await human.load(config);
            await human.warmup();
            
            humanRef.current = human;
            setIsModelLoading(false);
            onFeedbackChange("Motion detection ready (using lighter model).", FeedbackType.WARNING);
            
            console.log("Human.js initialized with fallback model");
          } catch (fallbackError) {
            console.error("Fallback model loading failed:", fallbackError);
            setIsModelLoading(false);
            onFeedbackChange(
              "Failed to initialize motion detection. Please try refreshing the page or using a different device.",
              FeedbackType.ERROR
            );
          }
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
        
        // Instead of calling dispose(), we'll clean up resources manually
        try {
          // Clean up tensors and resources
          humanRef.current = null;
          console.log("Human.js resources cleaned up successfully");
        } catch (error) {
          console.error("Error during Human.js cleanup:", error);
        }
        
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
      
      // Check for memory leaks
      const memoryInfo = (performance as any).memory;
      if (memoryInfo && memoryInfo.usedJSHeapSize > 0.8 * memoryInfo.totalJSHeapSize) {
        console.warn("Memory usage high, performing cleanup");
        
        // Cleanup resources that might be causing memory pressure
        fpsCounterRef.current = fpsCounterRef.current.slice(-10);
        
        // Force garbage collection if possible (requires --expose-gc flag)
        if (typeof global !== 'undefined' && (global as any).gc) {
          (global as any).gc();
        }
      }
    }
  }, [onFeedbackChange]);
  
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
              
              // Pass the body array instead of the full result object
              // The draw.body method expects the body array, not the full result
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
