
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCameraPermission } from './utils/cameraPermission';
import { setupVideoElement, ensureVideoIsPlaying } from './utils/videoElementSetup';
import { stopCameraStream, requestCameraStream } from './utils/cameraStream';

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
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  
  const { permission, setPermission, handlePermissionError } = useCameraPermission();
  
  // Clean up function to stop the camera stream
  const stopCamera = useCallback(() => {
    stopCameraStream({ streamRef, videoRef }, retryTimeoutRef);
    setCameraActive(false);
    setCameraError(null);
  }, []);
  
  // Main function to toggle camera
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    try {
      setCameraError(null);
      
      // Request camera stream
      const stream = await requestCameraStream();
      console.log("Camera access granted");
      streamRef.current = stream;
      
      // Setup video element
      const videoSetupSuccess = await setupVideoElement(stream, { videoRef, canvasRef });
      if (!videoSetupSuccess) {
        throw new Error("Failed to setup video element");
      }
      
      // Verify video is playing
      const isPlaying = await ensureVideoIsPlaying(videoRef);
      if (!isPlaying) {
        throw new Error("Failed to start video playback");
      }
      
      setCameraActive(true);
      setPermission('granted');
      
      if (onCameraStart) {
        onCameraStart();
      }
    } catch (error) {
      console.error('Error accessing or setting up camera:', error);
      
      // Handle specific errors
      const errorMessage = handlePermissionError(error);
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clean up any partial setup
      stopCamera();
    }
  }, [cameraActive, stopCamera, onCameraStart, setPermission, handlePermissionError]);
  
  // Setup automatic retry for video playback issues
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const checkVideoInterval = setInterval(async () => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        
        if ((videoEl.paused || videoEl.ended) && streamRef.current) {
          console.log("Video not playing, attempting to resume...");
          try {
            await videoEl.play();
          } catch (err) {
            console.error("Failed to resume video:", err);
            
            // If we've had multiple failures, restart the camera
            if (!retryTimeoutRef.current) {
              retryTimeoutRef.current = window.setTimeout(() => {
                console.log("Multiple play failures, restarting camera...");
                stopCamera();
                toggleCamera();
                retryTimeoutRef.current = null;
              }, 2000);
            }
          }
        }
      }, 3000);
      
      return () => clearInterval(checkVideoInterval);
    }
  }, [cameraActive, stopCamera, toggleCamera]);
  
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
