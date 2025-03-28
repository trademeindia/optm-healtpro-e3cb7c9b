
import { useCallback } from 'react';

/**
 * Provides utilities for setting up the video element with a camera stream
 */
export const useVideoSetup = () => {
  /**
   * Sets up a video element with the provided stream
   */
  const setupVideoElement = useCallback(async (
    videoRef: React.MutableRefObject<HTMLVideoElement | null>,
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
    stream: MediaStream
  ): Promise<boolean> => {
    if (!videoRef.current) {
      console.error("Video element reference is null");
      return false;
    }
    
    try {
      // Set stream as source for video element
      videoRef.current.srcObject = stream;
      
      // Wait for the video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element reference is null"));
          return;
        }
        
        const handleLoaded = () => {
          resolve();
          cleanup();
        };
        
        const handleError = (error: Event) => {
          console.error("Error loading video metadata:", error);
          reject(new Error("Failed to load video metadata"));
          cleanup();
        };
        
        const cleanup = () => {
          videoRef.current?.removeEventListener('loadedmetadata', handleLoaded);
          videoRef.current?.removeEventListener('error', handleError);
        };
        
        videoRef.current.addEventListener('loadedmetadata', handleLoaded);
        videoRef.current.addEventListener('error', handleError);
        
        // If already loaded, resolve immediately
        if (videoRef.current.readyState >= 2) {
          resolve();
          cleanup();
        }
      });
      
      // Set canvas size to match video
      if (canvasRef.current && videoRef.current.videoWidth) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
      
      // Start playback
      await videoRef.current.play();
      
      return true;
    } catch (error) {
      console.error("Error setting up video element:", error);
      return false;
    }
  }, []);
  
  return { setupVideoElement };
};
