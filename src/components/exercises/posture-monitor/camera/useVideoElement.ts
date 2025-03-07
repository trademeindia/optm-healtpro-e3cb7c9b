
import { useCallback } from 'react';

/**
 * Provides utilities for working with the video element
 */
export const useVideoElement = () => {
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
      
      // Wait for video metadata to load
      return new Promise<boolean>((resolve) => {
        if (!videoRef.current) {
          console.error("Video ref became null during setup");
          resolve(false);
          return;
        }
        
        // Handle video loading event
        const onLoadedMetadata = async () => {
          if (!videoRef.current) {
            console.error("Video ref is null in onLoadedMetadata");
            resolve(false);
            return;
          }
          
          videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          
          try {
            // Try to play video
            await videoRef.current.play();
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
          videoRef.current.play()
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
  }, []);
  
  /**
   * Ensure video element is playing
   */
  const ensureVideoIsPlaying = useCallback(async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return false;
    
    const videoElement = videoRef.current;
    
    console.log("Ensuring video is playing...");
    console.log("Video paused:", videoElement.paused);
    console.log("Video ended:", videoElement.ended);
    console.log("Video readyState:", videoElement.readyState);
    
    if (videoElement.paused || videoElement.ended) {
      try {
        console.log("Attempting to play video...");
        await videoElement.play();
        console.log("Video playback started successfully");
        return true;
      } catch (error) {
        console.error("Failed to play video:", error);
        return false;
      }
    }
    
    return !videoElement.paused;
  }, []);
  
  return {
    setupVideoElement,
    ensureVideoIsPlaying
  };
};
