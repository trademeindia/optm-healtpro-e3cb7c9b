
import { useState, useRef, useCallback, useEffect } from 'react';
import { useCameraSetup } from './useCameraSetup';
import { useVideoElement } from './useVideoElement';

interface UseCameraProps {
  onCameraStart?: () => void;
}

interface UseCameraResult {
  cameraActive: boolean;
  permission: 'granted' | 'denied' | 'prompt';
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  streamRef: React.RefObject<MediaStream | null>;
  toggleCamera: () => Promise<void>;
  stopCamera: () => void;
  cameraError: string | null;
}

export const useCamera = ({ onCameraStart }: UseCameraProps = {}): UseCameraResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  
  const { requestCameraAccess } = useCameraSetup();
  const { setupVideoElement, ensureVideoIsPlaying } = useVideoElement();
  
  // Clean up function to stop the camera stream
  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraError(null);
    
    // Clear any retry timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);
  
  // Main function to toggle camera
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    setCameraError(null);
    
    // Request camera permission and turn on camera
    const { stream, error, permissionDenied } = await requestCameraAccess() || {};
    
    if (error) {
      setCameraError(error);
      if (permissionDenied) {
        setPermission('denied');
      }
      return;
    }
    
    if (!stream) {
      setCameraError("Failed to access camera stream");
      return;
    }
    
    streamRef.current = stream;
    
    // Setup video element
    const videoSetupSuccess = await setupVideoElement(videoRef, canvasRef, stream);
    
    if (!videoSetupSuccess) {
      setCameraError("Failed to setup video element");
      stopCamera();
      return;
    }
    
    // Set camera as active
    setCameraActive(true);
    setPermission('granted');
    
    if (onCameraStart) {
      onCameraStart();
    }
  }, [cameraActive, stopCamera, requestCameraAccess, setupVideoElement, onCameraStart]);
  
  // Monitor video state and restart if needed
  useEffect(() => {
    if (!cameraActive) return;
    
    const checkVideoInterval = setInterval(() => {
      if (!videoRef.current || !streamRef.current) return;
      
      const videoEl = videoRef.current;
      
      // Check if video element is properly playing
      if (videoEl.paused || videoEl.ended) {
        console.log("Video not playing during monitoring, attempting to resume");
        videoEl.play().catch(err => {
          console.error("Failed to resume video during monitoring:", err);
        });
      }
    }, 3000);
    
    return () => clearInterval(checkVideoInterval);
  }, [cameraActive]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    stopCamera,
    cameraError
  };
};
