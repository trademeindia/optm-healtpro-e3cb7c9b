
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { VideoStatus } from '../hooks/detection/types';
import { useCameraInitialization } from './useCameraInitialization';
import { useCameraCleanup } from './useCameraCleanup';
import { useCameraToggle } from './useCameraToggle';
import { useCameraMonitoring } from './useCameraMonitoring';

interface UseCameraProps {
  onCameraStart?: () => void;
}

interface UseCameraResult {
  cameraActive: boolean;
  permission: 'granted' | 'denied' | 'prompt';
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  toggleCamera: () => Promise<void>;
  stopCamera: () => void;
  cameraError: string | null;
  retryCamera: () => Promise<void>;
  videoStatus: VideoStatus;
}

export const useCamera = ({ onCameraStart }: UseCameraProps = {}): UseCameraResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Track video status
  const [videoStatus, setVideoStatus] = useState<VideoStatus>({
    isReady: false,
    hasStream: false,
    resolution: null,
    lastCheckTime: 0,
    errorCount: 0
  });
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef<boolean>(true);
  const setupTimeoutRef = useRef<number | null>(null);
  
  // Camera cleanup hook
  const { stopCamera } = useCameraCleanup({
    videoRef,
    streamRef,
    setCameraActive,
    setCameraError,
    setVideoStatus,
    setupTimeoutRef
  });
  
  // Camera toggle hook
  const { toggleCamera } = useCameraToggle({
    cameraActive,
    isInitializing,
    videoRef,
    canvasRef,
    streamRef,
    mountedRef,
    setupTimeoutRef,
    setCameraActive,
    setPermission,
    setCameraError,
    setIsInitializing,
    setVideoStatus,
    stopCamera,
    onCameraStart
  });
  
  // Camera monitoring hook
  useCameraMonitoring({
    cameraActive,
    videoRef,
    streamRef,
    mountedRef,
    setCameraError
  });
  
  // Camera initialization hook
  useCameraInitialization({
    mountedRef,
    stopCamera,
    setupTimeoutRef
  });
  
  // Video status monitoring effect
  useEffect(() => {
    if (videoStatus.errorCount > 10) {
      console.error("Too many video errors, resetting camera");
      setCameraError("Camera feed has issues. Attempting to reset...");
      
      // Auto-retry with timeout
      const retryTimeout = setTimeout(() => {
        retryCamera().catch(err => {
          console.error("Auto-retry of camera failed:", err);
        });
      }, 1000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [videoStatus.errorCount]);
  
  // Retry camera function
  const retryCamera = useCallback(async () => {
    if (isInitializing) {
      console.log("Camera is already initializing, ignoring retry");
      return;
    }
    
    console.log("Retrying camera...");
    stopCamera();
    
    // Small delay to ensure everything is reset
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Re-initialize
    await toggleCamera();
  }, [isInitializing, stopCamera, toggleCamera]);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
  };
};
