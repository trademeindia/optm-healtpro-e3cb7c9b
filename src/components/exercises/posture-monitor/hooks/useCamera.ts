
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useCamera = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Initialize camera
  const startCamera = useCallback(async (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    
    try {
      setCameraError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      videoElement.srcObject = stream;
      
      // Wait for video to load
      await videoElement.play();
      setIsCameraReady(true);
      toast.success("Camera started successfully");
      
      return true;
    } catch (err) {
      console.error('Error starting camera:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setCameraError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, []);
  
  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsCameraReady(false);
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  return {
    isCameraReady,
    cameraError,
    startCamera,
    stopCamera
  };
};
