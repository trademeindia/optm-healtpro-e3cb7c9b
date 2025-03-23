
import { useState, useRef } from 'react';
import { human } from '@/lib/human';
import * as Human from '@vladmandic/human';
import { toast } from 'sonner';

export const useDetectionState = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionFps, setDetectionFps] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  
  // Detection loop references
  const requestRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastFpsUpdateTime = useRef<number>(0);
  
  const loadModel = async () => {
    try {
      if (!isModelLoaded) {
        setDetectionError(null);
        await human.load();
        setIsModelLoaded(true);
      }
      return true;
    } catch (error) {
      console.error('Error loading Human.js model:', error);
      setDetectionError('Failed to load Human.js model');
      toast.error('Failed to load motion detection model. Please refresh and try again.');
      return false;
    }
  };
  
  return {
    state: {
      isDetecting,
      detectionFps,
      isModelLoaded,
      detectionError
    },
    setters: {
      setIsDetecting,
      setDetectionFps,
      setIsModelLoaded,
      setDetectionError
    },
    refs: {
      requestRef,
      lastFrameTime,
      frameCount,
      lastFpsUpdateTime
    },
    loadModel
  };
};
