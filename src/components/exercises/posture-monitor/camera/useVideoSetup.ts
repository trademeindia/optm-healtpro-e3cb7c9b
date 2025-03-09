
import { useCallback } from 'react';
import { useVideoPlayback } from './useVideoPlayback';

/**
 * Provides utilities for setting up video elements
 */
export const useVideoSetup = () => {
  const { attemptVideoPlay } = useVideoPlayback();

  /**
   * Setup video element with stream and play it
   */
  const setupVideoElement = useCallback(async (
    videoRef: React.RefObject<HTMLVideoElement>,
    canvasRef: React.RefObject<HTMLCanvasElement>,
    stream: MediaStream
  ) => {
    if (!videoRef.current) {
      console.error("Video element ref is null");
      return false;
    }
    
    try {
      console.log("Setting up video element with stream");
      
      // Set stream as source for video element
      videoRef.current.srcObject = stream;
      
      // Set proper size for the video and canvas
      if (canvasRef.current) {
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }
      
      // Wait for video metadata to load with improved timeout handling
      return new Promise<boolean>((resolve) => {
        if (!videoRef.current) {
          console.error("Video ref became null during setup");
          resolve(false);
          return;
        }
        
        // Set a timeout in case metadata never loads
        const timeoutId = setTimeout(() => {
          console.error("Video metadata load timeout");
          resolve(false);
        }, 8000); // Increased timeout for slower devices
        
        // Handle video loading event
        const onLoadedMetadata = async () => {
          if (!videoRef.current) {
            console.error("Video ref is null in onLoadedMetadata");
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }
          
          videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          clearTimeout(timeoutId);
          
          try {
            // Try to play video with retry mechanism
            await attemptVideoPlay(videoRef.current);
            console.log("Video is now playing after metadata loaded");
            resolve(true);
          } catch (err) {
            console.error("Failed to play video after metadata loaded:", err);
            resolve(false);
          }
        };
        
        // If metadata already loaded
        if (videoRef.current.readyState >= 2) {
          console.log("Video metadata already loaded, playing now");
          clearTimeout(timeoutId);
          attemptVideoPlay(videoRef.current)
            .then(() => {
              console.log("Video playing (metadata already loaded)");
              resolve(true);
            })
            .catch((err) => {
              console.error("Error playing video (metadata already loaded):", err);
              resolve(false);
            });
        } else {
          // Wait for metadata to load
          console.log("Waiting for video metadata to load");
          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        }
      });
    } catch (error) {
      console.error("Error in setupVideoElement:", error);
      return false;
    }
  }, [attemptVideoPlay]);
  
  return {
    setupVideoElement
  };
};
