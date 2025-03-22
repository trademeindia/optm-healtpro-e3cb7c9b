
import { useRef, useState, useCallback, useEffect } from 'react';
import * as Human from '@vladmandic/human';
import { JointAngle } from '@/types/motion-analysis';

interface JointPosition {
  x: number;
  y: number;
  score: number;
  part: string;
}

export interface DetectionResult {
  joints: Record<string, [number, number]>;
  jointAngles: JointAngle[];
  fps: number;
}

export const useHumanPoseDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const humanRef = useRef<Human.Human | null>(null);
  const [joints, setJoints] = useState<Record<string, [number, number]>>({});
  const [jointAngles, setJointAngles] = useState<JointAngle[]>([]);
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(Date.now());
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize Human library
  const initHuman = useCallback(async () => {
    if (!humanRef.current) {
      const config = {
        modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
        filter: { enabled: true },
        body: { 
          enabled: true,
          modelPath: 'blazepose-heavy.json',
          minConfidence: 0.2,
        }
      };
      
      const human = new Human.Human(config);
      await human.load();
      humanRef.current = human;
      console.log('Human pose detection model loaded');
    }
  }, []);

  // Calculate angle between three points
  const calculateAngle = (a: [number, number], b: [number, number], c: [number, number]): number => {
    // Convert points to vectors
    const ab = [b[0] - a[0], b[1] - a[1]];
    const cb = [b[0] - c[0], b[1] - c[1]];
    
    // Calculate dot product
    const dot = ab[0] * cb[0] + ab[1] * cb[1];
    
    // Calculate magnitudes
    const magAB = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
    const magCB = Math.sqrt(cb[0] * cb[0] + cb[1] * cb[1]);
    
    // Calculate angle in radians
    const angleRadians = Math.acos(dot / (magAB * magCB));
    
    // Convert to degrees
    return angleRadians * (180 / Math.PI);
  };

  // Process detection results
  const processDetectionResults = (result: Human.Result) => {
    if (!result.body || result.body.length === 0) return;
    
    const body = result.body[0];
    const detectedJoints: Record<string, [number, number]> = {};
    
    // Map pose keypoints to our format
    const keypointMap: Record<string, string> = {
      nose: 'nose',
      leftEye: 'leftEye',
      rightEye: 'rightEye',
      leftEar: 'leftEar',
      rightEar: 'rightEar',
      leftShoulder: 'leftShoulder',
      rightShoulder: 'rightShoulder',
      leftElbow: 'leftElbow',
      rightElbow: 'rightElbow',
      leftWrist: 'leftWrist',
      rightWrist: 'rightWrist',
      leftHip: 'leftHip',
      rightHip: 'rightHip',
      leftKnee: 'leftKnee',
      rightKnee: 'rightKnee',
      leftAnkle: 'leftAnkle',
      rightAnkle: 'rightAnkle'
    };
    
    // Extract joint positions
    body.keypoints.forEach(keypoint => {
      const name = keypoint.part as string;
      if (keypointMap[name]) {
        // Fix: Access x and y from position object correctly
        detectedJoints[keypointMap[name]] = [keypoint.position.x, keypoint.position.y];
      }
    });
    
    setJoints(detectedJoints);
    
    // Calculate joint angles
    const newJointAngles: JointAngle[] = [];
    
    // Right elbow angle
    if (detectedJoints.rightShoulder && detectedJoints.rightElbow && detectedJoints.rightWrist) {
      const rightElbowAngle = calculateAngle(
        detectedJoints.rightShoulder,
        detectedJoints.rightElbow,
        detectedJoints.rightWrist
      );
      
      newJointAngles.push({
        joint: 'rightElbow',
        angle: rightElbowAngle,
        timestamp: Date.now(),
      });
    }
    
    // Left elbow angle
    if (detectedJoints.leftShoulder && detectedJoints.leftElbow && detectedJoints.leftWrist) {
      const leftElbowAngle = calculateAngle(
        detectedJoints.leftShoulder,
        detectedJoints.leftElbow,
        detectedJoints.leftWrist
      );
      
      newJointAngles.push({
        joint: 'leftElbow',
        angle: leftElbowAngle,
        timestamp: Date.now(),
      });
    }
    
    // Right knee angle
    if (detectedJoints.rightHip && detectedJoints.rightKnee && detectedJoints.rightAnkle) {
      const rightKneeAngle = calculateAngle(
        detectedJoints.rightHip,
        detectedJoints.rightKnee,
        detectedJoints.rightAnkle
      );
      
      newJointAngles.push({
        joint: 'rightKnee',
        angle: rightKneeAngle,
        timestamp: Date.now(),
      });
    }
    
    // Left knee angle
    if (detectedJoints.leftHip && detectedJoints.leftKnee && detectedJoints.leftAnkle) {
      const leftKneeAngle = calculateAngle(
        detectedJoints.leftHip,
        detectedJoints.leftKnee,
        detectedJoints.leftAnkle
      );
      
      newJointAngles.push({
        joint: 'leftKnee',
        angle: leftKneeAngle,
        timestamp: Date.now(),
      });
    }
    
    setJointAngles(newJointAngles);
    
    // Update FPS counter
    frameCount.current += 1;
    const now = Date.now();
    const elapsed = now - lastFpsUpdate.current;
    
    if (elapsed >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / elapsed));
      frameCount.current = 0;
      lastFpsUpdate.current = now;
    }
  };

  // Detection loop
  const detect = useCallback(async () => {
    if (!humanRef.current || !videoRef.current || !isDetecting) return;
    
    try {
      const result = await humanRef.current.detect(videoRef.current);
      processDetectionResults(result);
    } catch (err) {
      console.error('Error during pose detection:', err);
    }
    
    if (isDetecting) {
      requestAnimationFrame(detect);
    }
  }, [isDetecting, videoRef]);

  // Start detection
  const startDetection = useCallback(async () => {
    if (!humanRef.current) {
      await initHuman();
    }
    
    setIsDetecting(true);
    frameCount.current = 0;
    lastFpsUpdate.current = Date.now();
    
    // Start detection loop
    detect();
  }, [detect, initHuman]);

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initHuman();
    
    return () => {
      stopDetection();
    };
  }, [initHuman, stopDetection]);

  // Start detection loop when isDetecting changes
  useEffect(() => {
    if (isDetecting) {
      detect();
    }
  }, [isDetecting, detect]);

  return {
    isDetecting,
    startDetection,
    stopDetection,
    joints,
    jointAngles,
    fps,
  };
};
