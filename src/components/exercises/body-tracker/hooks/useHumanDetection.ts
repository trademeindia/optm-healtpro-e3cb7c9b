
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateJointAngles } from '../utils/angleCalculator';
import Webcam from 'react-webcam';

export interface HumanDetectionOptions {
  performanceMode?: 'high' | 'balanced' | 'low';
  skipFrames?: number;
}

export const useHumanDetection = (
  webcamRef: React.RefObject<Webcam>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isTracking: boolean,
  onAnglesDetected?: (angles: JointAngle[]) => void,
  options?: HumanDetectionOptions
) => {
  const [human, setHuman] = useState<Human.Human | null>(null);
  const [angles, setAngles] = useState<JointAngle[]>([]);
  const [detectionFps, setDetectionFps] = useState<number>(0);
  const [detectionQuality, setDetectionQuality] = useState<number>(0);
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCounter = useRef<number>(0);
  
  // Get performance settings based on options
  const getModelConfig = useCallback(() => {
    // Default to balanced mode
    const performanceMode = options?.performanceMode || 'balanced';
    
    let modelPath = 'blazepose-heavy.json'; // Default high quality
    let skipFrames = options?.skipFrames ?? 0;
    
    // Adjust model based on performance mode
    if (performanceMode === 'low') {
      modelPath = 'blazepose-lite.json';
      skipFrames = options?.skipFrames ?? 2; // Skip more frames in low power mode
    } else if (performanceMode === 'balanced') {
      modelPath = 'blazepose.json'; // Medium quality
      skipFrames = options?.skipFrames ?? 1;
    }
    
    return { modelPath, skipFrames };
  }, [options?.performanceMode, options?.skipFrames]);
  
  // Initialize Human.js
  useEffect(() => {
    const initHuman = async () => {
      try {
        console.log('Initializing Human.js...');
        const { modelPath, skipFrames } = getModelConfig();
        
        // Create a config that includes all required properties
        const humanConfig: Partial<Human.Config> = {
          // Use a CDN path for the models
          modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
          filter: { enabled: true, equalization: false },
          face: { enabled: false },
          body: { 
            enabled: true,
            modelPath,
            minConfidence: 0.5,
            skipFrames,
          },
          hand: { enabled: false },
          object: { enabled: false },
          gesture: { enabled: true },
          // Add missing required properties
          backend: 'webgl',
          wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/',
          debug: false,
          async: true,
        };

        const humanInstance = new Human.Human(humanConfig);
        console.log(`Loading Human.js models with ${modelPath}...`);
        await humanInstance.load();
        console.log('Human.js models loaded successfully');
        setHuman(humanInstance);
      } catch (error) {
        console.error('Error initializing Human.js:', error);
      }
    };

    initHuman();
    
    return () => {
      // Cleanup animation frame
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [getModelConfig]);
  
  // Tracking function
  const detect = useCallback(async (timestamp: number) => {
    if (!human || !webcamRef.current || !canvasRef.current || !isTracking) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }
    
    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    // Calculate FPS
    const elapsed = timestamp - lastFrameTime.current;
    if (elapsed > 0) {
      setDetectionFps(Math.round(1000 / elapsed));
    }
    lastFrameTime.current = timestamp;

    // Apply frame skipping if needed
    const { skipFrames } = getModelConfig();
    frameCounter.current = (frameCounter.current + 1) % (skipFrames + 1);
    
    // Skip frame if needed
    if (frameCounter.current !== 0) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    try {
      // Perform detection
      const result = await human.detect(video);
      
      // Clear canvas and draw video frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw body pose points and connections
      human.draw.all(canvas, result);
      
      // Calculate angles between joints
      if (result.body && result.body.length > 0) {
        const keypoints = result.body[0].keypoints;
        const calculatedAngles = calculateJointAngles(keypoints);
        
        // Update detection quality score
        setDetectionQuality(result.body[0].score * 100);
        
        setAngles(calculatedAngles);
        
        if (onAnglesDetected) {
          onAnglesDetected(calculatedAngles);
        }
      } else {
        // No body detected, set quality to 0
        setDetectionQuality(0);
      }
    } catch (error) {
      console.error('Error during detection:', error);
      setDetectionQuality(0);
    }
    
    // Continue detection loop if still tracking
    if (isTracking) {
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [human, isTracking, onAnglesDetected, webcamRef, canvasRef, getModelConfig]);

  // Start tracking function
  const startTracking = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(detect);
  }, [detect]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Reset detection
  const resetDetection = useCallback(() => {
    setAngles([]);
    setDetectionQuality(0);
    if (onAnglesDetected) {
      onAnglesDetected([]);
    }
  }, [onAnglesDetected]);

  return {
    human,
    angles,
    detectionFps,
    detectionQuality,
    startTracking,
    resetDetection
  };
};
