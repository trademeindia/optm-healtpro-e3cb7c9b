
import { useRef, useState, useEffect } from 'react';
import * as Human from '@vladmandic/human';
import { HumanDetectionStatus, FeedbackType } from '../types';

type UseHumanDetectionProps = {
  cameraActive: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
};

type UseHumanDetectionReturn = {
  isModelLoading: boolean;
  humanRef: React.RefObject<Human.Human | null>;
  lastDetection: Human.Result | null;
  detectionStatus: HumanDetectionStatus;
  startDetection: () => void;
  stopDetection: () => void;
};

export const useHumanDetection = ({
  cameraActive,
  videoRef,
  canvasRef,
  onFeedbackChange,
}: UseHumanDetectionProps): UseHumanDetectionReturn => {
  const humanRef = useRef<Human.Human | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [lastDetection, setLastDetection] = useState<Human.Result | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<HumanDetectionStatus>({
    isActive: false,
    fps: null,
    confidence: null
  });

  // Initialize Human.js
  useEffect(() => {
    const initHuman = async () => {
      if (!humanRef.current) {
        setIsModelLoading(true);
        onFeedbackChange("Loading motion detection model...", FeedbackType.INFO);

        try {
          const config: Human.Config = {
            modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
            filter: { enabled: true },
            face: { enabled: false },
            body: { enabled: true, modelPath: 'blazepose.json' },
            hand: { enabled: false },
            object: { enabled: false },
            gesture: { enabled: true },
            debug: false,
            // Required fields
            backend: 'webgl',
            wasmPath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/',
            wasmPlatformFetch: false,
            async: true,
            warmup: 'none',
            cacheModels: true,
            cacheSensitivity: 0.7,
            skipAllowed: false,
            deallocate: false,
            flags: {},
            softwareKernels: true
          };

          humanRef.current = new Human.Human(config);
          await humanRef.current.load();
          
          onFeedbackChange("Motion detection model loaded. Start camera to begin tracking.", FeedbackType.SUCCESS);
        } catch (error) {
          console.error('Failed to initialize Human.js:', error);
          onFeedbackChange("Failed to load motion detection model. Please try again.", FeedbackType.ERROR);
        } finally {
          setIsModelLoading(false);
        }
      }
    };

    initHuman();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onFeedbackChange]);

  const startDetection = () => {
    if (!humanRef.current || !videoRef.current || !canvasRef.current) return;

    const human = humanRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Setup canvas
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    let lastTime = performance.now();
    let frameCount = 0;

    const detect = async () => {
      if (!human || !video || !canvas || !ctx || !cameraActive) return;

      try {
        // Perform detection
        const result = await human.detect(video);
        setLastDetection(result);
        
        // Calculate FPS
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
          setDetectionStatus({
            isActive: true,
            fps: Math.round(frameCount * 1000 / (now - lastTime)),
            confidence: result.body[0]?.score || null
          });
          frameCount = 0;
          lastTime = now;
        }

        // Draw video frame and detection results
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw detected body keypoints
        human.draw.all(canvas, result);
        
        // Update tracking status
        if (result.body.length === 0) {
          onFeedbackChange("No person detected. Please make sure you're visible in the camera.", FeedbackType.WARNING);
        }
      } catch (error) {
        console.error('Detection error:', error);
      }

      // Continue detection loop
      if (cameraActive) {
        animationRef.current = requestAnimationFrame(detect);
      }
    };

    // Start detection loop
    animationRef.current = requestAnimationFrame(detect);
  };

  const stopDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setDetectionStatus({
      isActive: false,
      fps: null,
      confidence: null
    });
  };

  return {
    isModelLoading,
    humanRef,
    lastDetection,
    detectionStatus,
    startDetection,
    stopDetection
  };
};
