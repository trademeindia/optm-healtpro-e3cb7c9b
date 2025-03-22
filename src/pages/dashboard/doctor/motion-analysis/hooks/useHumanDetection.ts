
import { useState, useRef, useEffect, useCallback } from 'react';
import { JointAngle } from '../components/MotionAnalysisRecorder';

interface UseHumanDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  targetJoints: string[];
}

interface DetectionStatus {
  isDetecting: boolean;
  fps: number | null;
  confidence: number | null;
}

// Simulated joint mapping for the prototype
// In a real implementation, this would be mapped to Human.js keypoints
const JOINT_MAPPING: Record<string, [string, string, string]> = {
  'left-knee': ['leftHip', 'leftKnee', 'leftAnkle'],
  'right-knee': ['rightHip', 'rightKnee', 'rightAnkle'],
  'left-elbow': ['leftShoulder', 'leftElbow', 'leftWrist'],
  'right-elbow': ['rightShoulder', 'rightElbow', 'rightWrist'],
  'left-shoulder': ['leftEar', 'leftShoulder', 'leftElbow'],
  'right-shoulder': ['rightEar', 'rightShoulder', 'rightElbow'],
  'left-hip': ['leftShoulder', 'leftHip', 'leftKnee'],
  'right-hip': ['rightShoulder', 'rightHip', 'rightKnee'],
  'left-ankle': ['leftKnee', 'leftAnkle', 'leftFoot'],
  'right-ankle': ['rightKnee', 'rightAnkle', 'rightFoot']
};

export const useHumanDetection = ({
  videoRef,
  canvasRef,
  targetJoints
}: UseHumanDetectionProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAngles, setDetectedAngles] = useState<JointAngle[]>([]);
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    isDetecting: false,
    fps: null,
    confidence: null
  });
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const fpsBuffer = useRef<number[]>([]);
  
  // Used to load and initialize Human.js
  const initHumanJs = useCallback(async () => {
    try {
      // In a real implementation, we would load Human.js here
      // const human = new Human.Human({
      //   // Configuration options for Human.js
      //   modelBasePath: '/models/human',
      //   filter: { enabled: true, equalization: false },
      //   face: { enabled: false },
      //   body: { enabled: true, modelPath: 'blazepose.json' },
      //   hand: { enabled: false },
      //   gesture: { enabled: false }
      // });
      
      // await human.load();
      
      // For this prototype, we're simulating the initialization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return true;
    } catch (error) {
      console.error('Error initializing Human.js:', error);
      return false;
    }
  }, []);
  
  // Calculate angle between three points (in degrees)
  const calculateAngle = (pointA: [number, number], pointB: [number, number], pointC: [number, number]): number => {
    const ab = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const cb = [pointB[0] - pointC[0], pointB[1] - pointC[1]];
    
    // Dot product
    const dot = ab[0] * cb[0] + ab[1] * cb[1];
    
    // Magnitudes
    const abMag = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
    const cbMag = Math.sqrt(cb[0] * cb[0] + cb[1] * cb[1]);
    
    // Angle in radians
    const angle = Math.acos(dot / (abMag * cbMag));
    
    // Convert to degrees
    return (angle * 180) / Math.PI;
  };
  
  // Simulate keypoint detection from Human.js
  const simulateKeypoints = () => {
    const width = videoRef.current?.videoWidth || 640;
    const height = videoRef.current?.videoHeight || 480;
    
    // Center point with some randomness
    const centerX = width / 2 + (Math.random() * 20 - 10);
    const centerY = height / 2 + (Math.random() * 20 - 10);
    
    // Simulated keypoints with some noise to make it look realistic
    const keypoints = {
      // Head
      nose: [centerX, centerY - 100 + (Math.random() * 4 - 2)],
      leftEye: [centerX - 15 + (Math.random() * 2 - 1), centerY - 105 + (Math.random() * 2 - 1)],
      rightEye: [centerX + 15 + (Math.random() * 2 - 1), centerY - 105 + (Math.random() * 2 - 1)],
      leftEar: [centerX - 30 + (Math.random() * 3 - 1.5), centerY - 100 + (Math.random() * 3 - 1.5)],
      rightEar: [centerX + 30 + (Math.random() * 3 - 1.5), centerY - 100 + (Math.random() * 3 - 1.5)],
      
      // Shoulders
      leftShoulder: [centerX - 60 + (Math.random() * 4 - 2), centerY - 50 + (Math.random() * 4 - 2)],
      rightShoulder: [centerX + 60 + (Math.random() * 4 - 2), centerY - 50 + (Math.random() * 4 - 2)],
      
      // Arms
      leftElbow: [centerX - 90 + (Math.random() * 5 - 2.5), centerY + 0 + (Math.random() * 5 - 2.5)],
      rightElbow: [centerX + 90 + (Math.random() * 5 - 2.5), centerY + 0 + (Math.random() * 5 - 2.5)],
      leftWrist: [centerX - 110 + (Math.random() * 6 - 3), centerY + 50 + (Math.random() * 6 - 3)],
      rightWrist: [centerX + 110 + (Math.random() * 6 - 3), centerY + 50 + (Math.random() * 6 - 3)],
      
      // Hips
      leftHip: [centerX - 40 + (Math.random() * 3 - 1.5), centerY + 50 + (Math.random() * 3 - 1.5)],
      rightHip: [centerX + 40 + (Math.random() * 3 - 1.5), centerY + 50 + (Math.random() * 3 - 1.5)],
      
      // Legs
      leftKnee: [centerX - 40 + (Math.random() * 4 - 2), centerY + 120 + (Math.random() * 4 - 2)],
      rightKnee: [centerX + 40 + (Math.random() * 4 - 2), centerY + 120 + (Math.random() * 4 - 2)],
      leftAnkle: [centerX - 40 + (Math.random() * 5 - 2.5), centerY + 180 + (Math.random() * 5 - 2.5)],
      rightAnkle: [centerX + 40 + (Math.random() * 5 - 2.5), centerY + 180 + (Math.random() * 5 - 2.5)],
      
      // Feet
      leftFoot: [centerX - 40 + (Math.random() * 6 - 3), centerY + 200 + (Math.random() * 6 - 3)],
      rightFoot: [centerX + 40 + (Math.random() * 6 - 3), centerY + 200 + (Math.random() * 6 - 3)]
    };
    
    return keypoints;
  };
  
  // Draw keypoints and skeleton on canvas
  const drawDetection = (keypoints: Record<string, [number, number]>) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Get canvas dimensions
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections (skeleton)
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    
    // Draw body skeleton
    const connections = [
      // Head
      ['leftEar', 'leftEye'],
      ['leftEye', 'nose'],
      ['nose', 'rightEye'],
      ['rightEye', 'rightEar'],
      
      // Torso
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      
      // Arms
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      
      // Legs
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['leftAnkle', 'leftFoot'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle'],
      ['rightAnkle', 'rightFoot']
    ];
    
    for (const [start, end] of connections) {
      const startPoint = keypoints[start];
      const endPoint = keypoints[end];
      
      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint[0], startPoint[1]);
        ctx.lineTo(endPoint[0], endPoint[1]);
        ctx.stroke();
      }
    }
    
    // Draw keypoints
    ctx.fillStyle = '#ff0000';
    
    for (const point of Object.values(keypoints)) {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw angles for target joints
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    for (const jointName of targetJoints) {
      if (JOINT_MAPPING[jointName]) {
        const [startJoint, midJoint, endJoint] = JOINT_MAPPING[jointName];
        
        if (keypoints[startJoint] && keypoints[midJoint] && keypoints[endJoint]) {
          const angle = calculateAngle(
            keypoints[startJoint],
            keypoints[midJoint],
            keypoints[endJoint]
          );
          
          // Draw angle value
          const x = keypoints[midJoint][0];
          const y = keypoints[midJoint][1] - 15;
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(x - 30, y - 14, 60, 20);
          
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${Math.round(angle)}°`, x, y);
        }
      }
    }
  };
  
  // Start detection loop
  const startDetection = useCallback(async () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setDetectionStatus(prev => ({
      ...prev,
      isDetecting: true
    }));
    
    // Initialize Human.js
    const initialized = await initHumanJs();
    
    if (!initialized) {
      setIsDetecting(false);
      setDetectionStatus(prev => ({
        ...prev,
        isDetecting: false
      }));
      return;
    }
    
    // Make sure canvas size matches video
    if (videoRef.current && canvasRef.current) {
      const videoWidth = videoRef.current.videoWidth || 640;
      const videoHeight = videoRef.current.videoHeight || 480;
      
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }
    
    let lastFpsUpdateTime = performance.now();
    let frameCount = 0;
    
    // Setup detection loop
    const detectFrame = async () => {
      if (!isDetecting || !videoRef.current || !canvasRef.current) {
        animationFrameRef.current = null;
        return;
      }
      
      try {
        const now = performance.now();
        frameCount++;
        
        // Update FPS every second
        if (now - lastFpsUpdateTime > 1000) {
          const fps = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime));
          
          // Add to FPS buffer for smoothing
          fpsBuffer.current.push(fps);
          if (fpsBuffer.current.length > 5) {
            fpsBuffer.current.shift();
          }
          
          // Calculate average FPS
          const avgFps = Math.round(
            fpsBuffer.current.reduce((sum, val) => sum + val, 0) / fpsBuffer.current.length
          );
          
          setDetectionStatus(prev => ({
            ...prev,
            fps: avgFps
          }));
          
          lastFpsUpdateTime = now;
          frameCount = 0;
        }
        
        // Only update every 100ms to avoid too frequent updates
        if (now - lastUpdateRef.current > 100) {
          // In a real implementation, we would use Human.js detect method:
          // const result = await human.detect(videoRef.current);
          // const keypoints = result.body[0]?.keypoints;
          
          // For this prototype, we use simulated keypoints
          const keypoints = simulateKeypoints();
          
          // Calculate angles for target joints
          const newAngles: JointAngle[] = [];
          
          for (const jointName of targetJoints) {
            if (JOINT_MAPPING[jointName]) {
              const [startJoint, midJoint, endJoint] = JOINT_MAPPING[jointName];
              
              if (keypoints[startJoint] && keypoints[midJoint] && keypoints[endJoint]) {
                const angle = calculateAngle(
                  keypoints[startJoint],
                  keypoints[midJoint],
                  keypoints[endJoint]
                );
                
                newAngles.push({
                  jointName,
                  angle,
                  timestamp: Date.now()
                });
              }
            }
          }
          
          // Update angles
          setDetectedAngles(newAngles);
          
          // Draw detection on canvas
          drawDetection(keypoints);
          
          // Update confidence (simulated)
          setDetectionStatus(prev => ({
            ...prev,
            confidence: 0.75 + Math.random() * 0.2 // Random confidence between 0.75 and 0.95
          }));
          
          lastUpdateRef.current = now;
        }
        
        // Continue detection loop
        animationFrameRef.current = requestAnimationFrame(detectFrame);
      } catch (error) {
        console.error('Error in detection loop:', error);
        setIsDetecting(false);
        setDetectionStatus(prev => ({
          ...prev,
          isDetecting: false
        }));
      }
    };
    
    // Start detection loop
    animationFrameRef.current = requestAnimationFrame(detectFrame);
  }, [isDetecting, videoRef, canvasRef, targetJoints, initHumanJs]);
  
  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setDetectionStatus(prev => ({
      ...prev,
      isDetecting: false
    }));
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  // Reset detection
  const resetDetection = useCallback(() => {
    setDetectedAngles([]);
    fpsBuffer.current = [];
    lastUpdateRef.current = 0;
    
    // Restart detection if it was running
    if (isDetecting) {
      stopDetection();
      setTimeout(() => {
        startDetection();
      }, 500);
    }
  }, [isDetecting, stopDetection, startDetection]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopDetection();
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stopDetection, cameraStream]);
  
  return {
    startDetection,
    stopDetection,
    resetDetection,
    detectedAngles,
    detectionStatus,
    cameraStream,
    setCameraStream
  };
};
