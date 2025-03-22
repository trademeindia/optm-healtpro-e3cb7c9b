
import { useState, useRef } from 'react';
import { JointAngle } from '@/types/motion-analysis';
import { useHumanPoseDetection } from '@/hooks/useHumanPoseDetection';

// Hook that can utilize either the existing PoseNet or the new Human detection
export const useMotionAnalysisDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [detectionMethod, setDetectionMethod] = useState<'posenet' | 'human'>('human');
  const [isRecording, setIsRecording] = useState(false);
  const recordedAngles = useRef<JointAngle[]>([]);
  const recordingStartTime = useRef<number | null>(null);
  
  // Use the new Human detection hook
  const humanDetection = useHumanPoseDetection(videoRef);
  
  // Start recording session
  const startRecording = () => {
    recordedAngles.current = [];
    recordingStartTime.current = Date.now();
    setIsRecording(true);
    
    if (detectionMethod === 'human') {
      humanDetection.startDetection();
    }
  };
  
  // Stop recording session
  const stopRecording = () => {
    setIsRecording(false);
    
    if (detectionMethod === 'human') {
      humanDetection.stopDetection();
    }
    
    return {
      jointAngles: recordedAngles.current,
      duration: recordingStartTime.current 
        ? Math.round((Date.now() - recordingStartTime.current) / 1000) 
        : 0
    };
  };
  
  // Track joint angles during recording
  if (isRecording && detectionMethod === 'human' && humanDetection.jointAngles.length > 0) {
    recordedAngles.current = [...recordedAngles.current, ...humanDetection.jointAngles];
  }
  
  // Switch between detection methods
  const switchDetectionMethod = (method: 'posenet' | 'human') => {
    if (isRecording) {
      stopRecording();
    }
    setDetectionMethod(method);
  };
  
  return {
    ...humanDetection,
    detectionMethod,
    switchDetectionMethod,
    isRecording,
    startRecording,
    stopRecording
  };
};
