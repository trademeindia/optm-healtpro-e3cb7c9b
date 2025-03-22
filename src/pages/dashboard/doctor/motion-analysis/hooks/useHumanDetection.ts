
import { useState, useEffect, useRef } from 'react';
import { JointAngle } from '@/types/motion-analysis';

// We're creating a simulated hook since we don't have actual pose detection in place
export const useHumanDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [joints, setJoints] = useState<Record<string, [number, number]>>({});
  const [jointAngles, setJointAngles] = useState<JointAngle[]>([]);
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(Date.now());
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

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

  const startDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }
    
    setIsDetecting(true);
    frameCount.current = 0;
    lastFpsUpdate.current = Date.now();
    
    // Simulate pose detection with random joint positions
    detectionInterval.current = setInterval(() => {
      const simulatedJoints: Record<string, [number, number]> = {
        nose: [Math.random() * 640, Math.random() * 480],
        leftEye: [Math.random() * 640, Math.random() * 480],
        rightEye: [Math.random() * 640, Math.random() * 480],
        leftEar: [Math.random() * 640, Math.random() * 480],
        rightEar: [Math.random() * 640, Math.random() * 480],
        leftShoulder: [Math.random() * 640, Math.random() * 480],
        rightShoulder: [Math.random() * 640, Math.random() * 480],
        leftElbow: [Math.random() * 640, Math.random() * 480],
        rightElbow: [Math.random() * 640, Math.random() * 480],
        leftWrist: [Math.random() * 640, Math.random() * 480],
        rightWrist: [Math.random() * 640, Math.random() * 480],
        leftHip: [Math.random() * 640, Math.random() * 480],
        rightHip: [Math.random() * 640, Math.random() * 480],
        leftKnee: [Math.random() * 640, Math.random() * 480],
        rightKnee: [Math.random() * 640, Math.random() * 480],
        leftAnkle: [Math.random() * 640, Math.random() * 480],
        rightAnkle: [Math.random() * 640, Math.random() * 480],
        leftFoot: [Math.random() * 640, Math.random() * 480],
        rightFoot: [Math.random() * 640, Math.random() * 480],
      };
      
      setJoints(simulatedJoints);
      
      // Calculate joint angles
      const newJointAngles: JointAngle[] = [];
      
      // Right arm angle (shoulder-elbow-wrist)
      if (simulatedJoints.rightShoulder && simulatedJoints.rightElbow && simulatedJoints.rightWrist) {
        const rightElbowAngle = calculateAngle(
          simulatedJoints.rightShoulder,
          simulatedJoints.rightElbow,
          simulatedJoints.rightWrist
        );
        
        newJointAngles.push({
          joint: 'rightElbow',
          angle: rightElbowAngle,
          timestamp: Date.now(),
        });
      }
      
      // Left arm angle (shoulder-elbow-wrist)
      if (simulatedJoints.leftShoulder && simulatedJoints.leftElbow && simulatedJoints.leftWrist) {
        const leftElbowAngle = calculateAngle(
          simulatedJoints.leftShoulder,
          simulatedJoints.leftElbow,
          simulatedJoints.leftWrist
        );
        
        newJointAngles.push({
          joint: 'leftElbow',
          angle: leftElbowAngle,
          timestamp: Date.now(),
        });
      }
      
      // Right knee angle (hip-knee-ankle)
      if (simulatedJoints.rightHip && simulatedJoints.rightKnee && simulatedJoints.rightAnkle) {
        const rightKneeAngle = calculateAngle(
          simulatedJoints.rightHip,
          simulatedJoints.rightKnee,
          simulatedJoints.rightAnkle
        );
        
        newJointAngles.push({
          joint: 'rightKnee',
          angle: rightKneeAngle,
          timestamp: Date.now(),
        });
      }
      
      // Left knee angle (hip-knee-ankle)
      if (simulatedJoints.leftHip && simulatedJoints.leftKnee && simulatedJoints.leftAnkle) {
        const leftKneeAngle = calculateAngle(
          simulatedJoints.leftHip,
          simulatedJoints.leftKnee,
          simulatedJoints.leftAnkle
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
    }, 100); // Simulate 10 fps
  };

  const stopDetection = () => {
    setIsDetecting(false);
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  return {
    isDetecting,
    startDetection,
    stopDetection,
    joints,
    jointAngles,
    fps,
  };
};
