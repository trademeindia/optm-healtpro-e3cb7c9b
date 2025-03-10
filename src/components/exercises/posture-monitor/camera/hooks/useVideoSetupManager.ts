
import { useCallback } from 'react';
import { VideoStatus } from '../../hooks/detection/types';

interface UseVideoSetupManagerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setupTimeoutRef: React.MutableRefObject<number | null>;
  mountedRef: React.MutableRefObject<boolean>;
  setCameraError: (error: string | null) => void;
  setVideoStatus: React.Dispatch<React.SetStateAction<VideoStatus>>;
  stopCamera: () => void;
  setupVideoElement: (
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    stream: MediaStream
  ) => Promise<boolean>;
  ensureVideoIsPlaying: (
    videoRef: React.RefObject<HTMLVideoElement>
  ) => Promise<boolean>;
}

export const useVideoSetupManager = ({
  videoRef,
  canvasRef,
  setupTimeoutRef,
  mountedRef,
  setCameraError,
  setVideoStatus,
  stopCamera,
  setupVideoElement,
  ensureVideoIsPlaying
}: UseVideoSetupManagerProps) => {
  
  // Set up video element with stream
  const setupVideo = useCallback(async (stream: MediaStream): Promise<boolean> => {
    if (!videoRef.current) {
      console.error("Video element not found in DOM after check");
      setCameraError("Video element not available. Please reload and try again.");
      stopCamera();
      return false;
    }
    
    // Setup video element
    const videoSetupSuccess = await setupVideoElement(videoRef, canvasRef, stream);
    
    if (!videoSetupSuccess) {
      setCameraError("Failed to setup video element");
      stopCamera();
      return false;
    }
    
    // Wait a bit longer to ensure video is ready
    await new Promise(resolve => {
      const timeoutId = window.setTimeout(resolve, 800);
      setupTimeoutRef.current = timeoutId as unknown as number;
    });
    
    // Double-check component is still mounted
    if (!mountedRef.current) {
      stopCamera();
      return false;
    }
    
    return true;
  }, [videoRef, canvasRef, setCameraError, stopCamera, setupVideoElement, setupTimeoutRef, mountedRef]);
  
  // Ensure video is playing and recover if needed
  const ensureVideoPlayback = useCallback(async (): Promise<boolean> => {
    if (!videoRef.current) return false;
    
    // Double-check video state and try to recover if needed
    if (videoRef.current.paused) {
      console.log("Video not playing after setup, trying again");
      
      const playSuccess = await ensureVideoIsPlaying(videoRef);
      if (!playSuccess) {
        console.error("Failed to play video after retry");
        setCameraError("Could not start video playback. Please try again.");
        stopCamera();
        return false;
      }
    }
    
    return true;
  }, [videoRef, ensureVideoIsPlaying, setCameraError, stopCamera]);
  
  return {
    setupVideo,
    ensureVideoPlayback
  };
};
