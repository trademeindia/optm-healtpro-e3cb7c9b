
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

  // Initialize Human.js with optimized settings
  useEffect(() => {
    const initHuman = async () => {
      if (!humanRef.current) {
        setIsModelLoading(true);
        onFeedbackChange("Loading motion detection model...", FeedbackType.INFO);
        console.log("Initializing Human.js model...");

        try {
          // Optimized configuration for better performance and accuracy
          const config: Human.Config = {
            modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
            filter: { 
              enabled: true,
              equalization: false,  // Disable for better performance
              width: 640,
              height: 480
            },
            face: { enabled: false },
            body: { 
              enabled: true, 
              modelPath: 'blazepose.json',
              maxDetected: 1,  // Only need to detect one person
              scoreThreshold: 0.3,
              segmentation: false  // Disable for better performance
            },
            hand: { enabled: false },
            object: { enabled: false },
            gesture: { enabled: true },
            debug: false,  // Disable debug in production
            backend: 'webgl',
            wasmPath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/',
            wasmPlatformFetch: false,
            async: true,
            warmup: 'none',  // 'none' for faster startup, 'body' for better initial performance
            cacheModels: true,
            cacheSensitivity: 0.7,
            skipAllowed: false,
            deallocate: true,  // Release memory when possible
            flags: {},
            softwareKernels: true,
            validateModels: false,
            segmentation: { enabled: false }
          };

          const human = new Human.Human(config);
          console.log("Human.js instance created, loading models...");
          await human.load();
          console.log("Human.js model loaded successfully");
          humanRef.current = human;
          
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

  // The calculateAngle function for joint angle calculation
  const calculateAngle = (pointA: number[], pointB: number[], pointC: number[]): number => {
    // Create vectors from B to A and B to C
    const vectorBA = [pointA[0] - pointB[0], pointA[1] - pointB[1]];
    const vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]];
    
    // Calculate dot product
    const dotProduct = vectorBA[0] * vectorBC[0] + vectorBA[1] * vectorBC[1];
    
    // Calculate magnitudes
    const magnitudeBA = Math.sqrt(vectorBA[0] * vectorBA[0] + vectorBA[1] * vectorBA[1]);
    const magnitudeBC = Math.sqrt(vectorBC[0] * vectorBC[0] + vectorBC[1] * vectorBC[1]);
    
    // Calculate cosine of the angle
    const cosTheta = dotProduct / (magnitudeBA * magnitudeBC);
    
    // Calculate angle in degrees, ensuring value is in valid range for acos
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
    return Math.acos(clampedCosTheta) * (180 / Math.PI);
  };

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

    // Setup canvas with proper dimensions
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      console.log(`Canvas size set to ${canvas.width}x${canvas.height}`);
    } else {
      // Fallback dimensions
      canvas.width = 640;
      canvas.height = 480;
      console.log("Using fallback canvas dimensions: 640x480");
    }

    let lastTime = performance.now();
    let frameCount = 0;
    let skipFrames = 0; // For frame skipping optimization

    const detect = async () => {
      if (!human || !video || !canvas || !ctx || !cameraActive) {
        console.log("Detection loop stopping - prerequisites not met");
        return;
      }

      try {
        // Skip frames for better performance if needed
        skipFrames++;
        if (skipFrames < 2) { // Process every second frame
          // Just draw the previous frame without detection
          if (lastDetection) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            human.draw.all(canvas, lastDetection);
            
            if (lastDetection.body.length > 0) {
              drawJointAngles(ctx, lastDetection.body[0]);
            }
          }
          
          animationRef.current = requestAnimationFrame(detect);
          return;
        }
        skipFrames = 0;

        // Make sure video is playing
        if (video.paused || video.ended) {
          console.log("Video not playing, attempting to play...");
          try {
            await video.play();
          } catch (e) {
            console.error("Could not play video:", e);
          }
        }

        // Check if video has dimensions and update canvas if needed
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          console.log("Video dimensions not available yet");
        } else if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          console.log(`Updated canvas size to ${canvas.width}x${canvas.height}`);
        }

        // Perform detection with optimized settings
        const result = await human.detect(video);
        if (result.body.length > 0) {
          console.log("Detection result:", {
            bodyCount: result.body.length,
            confidence: result.body[0]?.score,
            keypoints: result.body[0]?.keypoints.length || 0
          });
        }
        
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

      // Continue detection loop with requestAnimationFrame
      if (cameraActive) {
        animationRef.current = requestAnimationFrame(detect);
      }
    };

    // Draw joint angles on canvas with optimized rendering
    const drawJointAngles = (ctx: CanvasRenderingContext2D, body: Human.BodyResult) => {
      const keypoints = body.keypoints;
      
      // Draw text with shadow for better visibility
      const drawText = (text: string, x: number, y: number) => {
        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(text, x + 1, y + 1); // Shadow
        ctx.fillStyle = 'yellow';
        ctx.fillText(text, x, y);
      };
      
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
        drawText(`${Math.round(leftKneeAngle)}°`, leftKnee.position[0] + 10, leftKnee.position[1]);
      }
      
      // Calculate and draw right knee angle
      if (rightHip && rightKnee && rightAnkle) {
        const rightKneeAngle = calculateAngle(
          [rightHip.position[0], rightHip.position[1]],
          [rightKnee.position[0], rightKnee.position[1]],
          [rightAnkle.position[0], rightAnkle.position[1]]
        );
        
        // Draw angle on canvas
        drawText(`${Math.round(rightKneeAngle)}°`, rightKnee.position[0] - 40, rightKnee.position[1]);
      }
    };

    // Start detection loop
    animationRef.current = requestAnimationFrame(detect);
    setDetectionStatus(prev => ({ ...prev, isActive: true }));
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
