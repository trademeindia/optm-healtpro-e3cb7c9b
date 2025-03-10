
import { useCallback } from 'react';
import { VideoStatus } from '../hooks/detection/types';

interface UseCameraCleanupProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  streamRef: React.RefObject<MediaStream | null>;
  setCameraActive: (active: boolean) => void;
  setCameraError: (error: string | null) => void;
  setVideoStatus: React.Dispatch<React.SetStateAction<VideoStatus>>;
  setupTimeoutRef: React.RefObject<number | null>;
}

export const useCameraCleanup = ({
  videoRef,
  streamRef,
  setCameraActive,
  setCameraError,
  setVideoStatus,
  setupTimeoutRef
}: UseCameraCleanupProps) => {
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
    setVideoStatus(prevStatus => ({
      ...prevStatus,
      isReady: false,
      hasStream: false,
      lastCheckTime: Date.now()
    }));
    
    // Clear any timeouts
    if (setupTimeoutRef.current) {
      window.clearTimeout(setupTimeoutRef.current);
      setupTimeoutRef.current = null;
    }
  }, [videoRef, streamRef, setCameraActive, setCameraError, setVideoStatus, setupTimeoutRef]);
  
  return { stopCamera };
};
