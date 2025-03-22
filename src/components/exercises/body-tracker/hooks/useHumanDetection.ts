
import { useState, useEffect, useRef, useCallback } from 'react';
import * as Human from '@vladmandic/human';
import { JointAngle } from '../types';
import { calculateJointAngles } from '../utils';

export const useHumanDetection = (
  webcamRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isTracking: boolean,
  onAnglesDetected?: (angles: JointAngle[]) => void
) => {
  const [human, setHuman] = useState<Human.Human | null>(null);
  const [angles, setAngles] = useState<JointAngle[]>([]);
  const [detectionFps, setDetectionFps] = useState<number>(0);
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  
  // Initialize Human.js
  useEffect(() => {
    const initHuman = async () => {
      try {
        console.log('Initializing Human.js...');
        // Create a config that includes all required properties
        const humanConfig: Partial<Human.Config> = {
          // Use a CDN path for the models
          modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
          filter: { enabled: true, equalization: false },
          face: { enabled: false },
          body: { 
            enabled: true,
            modelPath: 'blazepose-heavy.json',
            minConfidence: 0.5,
            skipFrames: 0, // Don't skip frames for more accurate tracking
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
        console.log('Loading Human.js models...');
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
  }, []);
  
  // Tracking function
  const detect = useCallback(async (timestamp: number) => {
    if (!human || !webcamRef.current || !canvasRef.current || !isTracking) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }
    
    const video = webcamRef.current;
    if (video.readyState !== 4) {
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
        
        setAngles(calculatedAngles);
        
        if (onAnglesDetected) {
          onAnglesDetected(calculatedAngles);
        }
      }
    } catch (error) {
      console.error('Error during detection:', error);
    }
    
    // Continue detection loop if still tracking
    if (isTracking) {
      requestRef.current = requestAnimationFrame(detect);
    }
  }, [human, isTracking, onAnglesDetected, webcamRef, canvasRef]);

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

  return {
    human,
    angles,
    detectionFps,
    startTracking
  };
};
