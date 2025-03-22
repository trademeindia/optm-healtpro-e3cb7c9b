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
  
  // Initialize Human.js
  useEffect(() => {
    if (humanRef.current) return; // Already initialized
    
    const initializeHuman = async () => {
      try {
        setIsModelLoading(true);
        onFeedbackChange("Loading motion detection model...", FeedbackType.INFO);
        
        console.log("Initializing Human.js");
        
        // Configure Human.js
        const config: Partial<Human.Config> = {
          modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
          filter: { enabled: true, equalization: false },
          face: { enabled: false },
          hand: { enabled: false },
          gesture: { enabled: false },
          // Configure body pose detection
          body: { 
            enabled: true,
            modelPath: 'blazepose-heavy.json', // Use heavy model for better accuracy
            minConfidence: 0.2, // Lower threshold for initial detection
            maxDetected: 1, // Only detect one person
          },
          // Segmentation is expensive, disable it
          segmentation: { enabled: false },
          // Optimize for performance
          backend: 'webgl',
          warmup: 'none',
          // Debug settings
          debug: false,
        };
        
        // Create Human instance with configuration
        const human = new Human.Human(config);
        
        // Pre-load and warm up the model
        await human.load();
        await human.warmup();
        
        humanRef.current = human;
        setIsModelLoading(false);
        onFeedbackChange("Motion detection ready. Starting camera will begin tracking.", FeedbackType.SUCCESS);
        
        console.log("Human.js initialized successfully");
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
    
    // Cleanup
    return () => {
      if (humanRef.current) {
        console.log("Cleaning up Human.js instance");
        humanRef.current = null;
      }
    };
  }, [onFeedbackChange]);
  
  // Start detection loop
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
    
    const detect = async () => {
      if (!humanRef.current || !videoRef.current || !cameraActive) {
        stopDetection();
        return;
      }
      
      frameCountRef.current += 1;
      
      // Skip frames for better performance (process every other frame)
      if (frameCountRef.current % 2 !== 0) {
        requestAnimationFrame(detect);
        return;
      }
      
      try {
        // Start timing
        const endTiming = performanceMonitor.startTiming('humanDetection');
        
        // Run detection
        const result = await humanRef.current.detect(videoRef.current);
        
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
          if (canvasRef.current) {
            await humanRef.current.draw.canvas(canvasRef.current, result);
          }
        }
        
        // Continue detection loop
        requestAnimationFrame(detect);
      } catch (error) {
        console.error("Error in Human.js detection:", error);
        
        // Try to continue detection despite error
        requestAnimationFrame(detect);
      }
    };
    
    // Initialize the detection loop
    frameCountRef.current = 0;
    fpsCounterRef.current = [];
    requestAnimationFrame(detect);
    
    setDetectionStatus(prev => ({ ...prev, isActive: true }));
    
  }, [cameraActive, videoRef, canvasRef, humanRef]);
  
  // Stop detection
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
