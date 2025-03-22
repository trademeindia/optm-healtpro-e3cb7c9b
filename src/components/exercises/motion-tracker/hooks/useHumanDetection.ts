
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
        console.log("Initializing Human.js model...");

        try {
          const config: Human.Config = {
            modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
            filter: { enabled: true },
            face: { enabled: false },
            body: { enabled: true, modelPath: 'blazepose.json' },
            hand: { enabled: false },
            object: { enabled: false },
            gesture: { enabled: true },
            debug: true, // Enable debug for troubleshooting
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
            softwareKernels: true,
            validateModels: false,
            segmentation: { enabled: false }
          };

          humanRef.current = new Human.Human(config);
          await humanRef.current.load();
          console.log("Human.js model loaded successfully");
          
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
        animationRef.current = null;
      }
    };
  }, [onFeedbackChange]);

  // Auto-start detection when camera becomes active
  useEffect(() => {
    console.log("Camera active state changed:", cameraActive);
    if (cameraActive && humanRef.current && videoRef.current) {
      console.log("Camera active, starting detection");
      startDetection();
    } else if (!cameraActive && detectionStatus.isActive) {
      console.log("Camera inactive, stopping detection");
      stopDetection();
    }
  }, [cameraActive]);

  const startDetection = () => {
    if (!humanRef.current || !videoRef.current || !canvasRef.current) {
      console.log("Cannot start detection: missing refs", {
        human: !!humanRef.current,
        video: !!videoRef.current,
        canvas: !!canvasRef.current
      });
      return;
    }

    console.log("Starting detection loop");
    const human = humanRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    // Setup canvas
    // Always update canvas dimensions to match video
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
    } else {
      // Fallback dimensions if video dimensions are not yet available
      canvas.width = 640;
      canvas.height = 480;
      console.log("Using fallback canvas dimensions: 640x480");
    }

    let lastTime = performance.now();
    let frameCount = 0;

    const detect = async () => {
      if (!human || !video || !canvas || !ctx || !cameraActive) {
        console.log("Detection loop stopping - prerequisites not met", {
          human: !!human,
          video: !!video,
          canvas: !!canvas,
          ctx: !!ctx,
          cameraActive
        });
        return;
      }

      try {
        // Make sure video is playing
        if (video.paused || video.ended) {
          console.log("Video not playing, attempting to play...");
          try {
            await video.play();
          } catch (e) {
            console.error("Could not play video:", e);
          }
        }

        // Check if video has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          console.log("Video dimensions not available yet");
        } else if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          // Update canvas size if video dimensions changed
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          console.log(`Updated canvas size to ${canvas.width}x${canvas.height}`);
        }

        // Perform detection
        const result = await human.detect(video);
        console.log("Detection result:", {
          bodyCount: result.body.length,
          confidence: result.body[0]?.score,
          keypoints: result.body[0]?.keypoints.length || 0
        });
        
        setLastDetection(result);
        
        // Calculate FPS
        const now = performance.now();
        frameCount++;
        
        if (now - lastTime >= 1000) {
          const fps = Math.round(frameCount * 1000 / (now - lastTime));
          console.log(`FPS: ${fps}`);
          setDetectionStatus({
            isActive: true,
            fps: fps,
            confidence: result.body[0]?.score || null
          });
          frameCount = 0;
          lastTime = now;
        }

        // Clear the canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw detected body keypoints
        if (result.body.length > 0) {
          human.draw.all(canvas, result);
          
          // Draw joint angles if available
          const body = result.body[0];
          if (body && body.keypoints.length > 0) {
            drawJointAngles(ctx, body);
          }
        } else {
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
    setDetectionStatus(prev => ({ ...prev, isActive: true }));
  };

  const drawJointAngles = (ctx: CanvasRenderingContext2D, body: Human.BodyResult) => {
    const keypoints = body.keypoints;
    
    // Find specific keypoints for angle calculations
    const leftHip = keypoints.find(kp => kp.part === 'leftHip');
    const leftKnee = keypoints.find(kp => kp.part === 'leftKnee');
    const leftAnkle = keypoints.find(kp => kp.part === 'leftAnkle');
    
    const rightHip = keypoints.find(kp => kp.part === 'rightHip');
    const rightKnee = keypoints.find(kp => kp.part === 'rightKnee');
    const rightAnkle = keypoints.find(kp => kp.part === 'rightAnkle');
    
    // Calculate and draw left knee angle
    if (leftHip && leftKnee && leftAnkle) {
      const leftKneeAngle = calculateAngle(
        [leftHip.position[0], leftHip.position[1]],
        [leftKnee.position[0], leftKnee.position[1]],
        [leftAnkle.position[0], leftAnkle.position[1]]
      );
      
      // Draw angle on canvas
      ctx.font = '16px Arial';
      ctx.fillStyle = 'yellow';
      ctx.fillText(`${Math.round(leftKneeAngle)}°`, leftKnee.position[0] + 10, leftKnee.position[1]);
    }
    
    // Calculate and draw right knee angle
    if (rightHip && rightKnee && rightAnkle) {
      const rightKneeAngle = calculateAngle(
        [rightHip.position[0], rightHip.position[1]],
        [rightKnee.position[0], rightKnee.position[1]],
        [rightAnkle.position[0], rightAnkle.position[1]]
      );
      
      // Draw angle on canvas
      ctx.font = '16px Arial';
      ctx.fillStyle = 'yellow';
      ctx.fillText(`${Math.round(rightKneeAngle)}°`, rightKnee.position[0] - 40, rightKnee.position[1]);
    }
  };
  
  const calculateAngle = (pointA: number[], pointB: number[], pointC: number[]): number => {
    const AB = Math.sqrt(Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2));
    const BC = Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2));
    const AC = Math.sqrt(Math.pow(pointC[0] - pointA[0], 2) + Math.pow(pointC[1] - pointA[1], 2));
    
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
  };

  const stopDetection = () => {
    console.log("Stopping detection loop");
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
