
import { useCallback, useState } from 'react';

/**
 * Provides utilities for working with the video element
 */
export const useVideoElement = () => {
  const [lastPlayAttempt, setLastPlayAttempt] = useState(0);

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
  }, []);
  
  // Helper function to attempt video play with retry logic
  const attemptVideoPlay = async (videoElement: HTMLVideoElement): Promise<void> => {
    const now = Date.now();
    
    // Avoid rapid play attempts (browser throttling prevention)
    if (now - lastPlayAttempt < 300) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setLastPlayAttempt(Date.now());
    
    // Try playing with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await videoElement.play();
        return; // Success
      } catch (error) {
        attempts++;
        console.warn(`Play attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) throw error;
        
        // Wait a bit longer between each retry
        await new Promise(resolve => setTimeout(resolve, 500 * attempts));
      }
    }
  };
  
  /**
   * Ensure video element is playing with enhanced debugging
   */
  const ensureVideoIsPlaying = useCallback(async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) return false;
    
    const videoElement = videoRef.current;
    
    console.log("Ensuring video is playing...");
    console.log("Video state:", {
      paused: videoElement.paused,
      ended: videoElement.ended,
      readyState: videoElement.readyState,
      networkState: videoElement.networkState,
      error: videoElement.error ? videoElement.error.code : 'none',
      width: videoElement.videoWidth,
      height: videoElement.videoHeight
    });
    
    if (videoElement.paused || videoElement.ended) {
      try {
        // Prevent too frequent play attempts
        const now = Date.now();
        if (now - lastPlayAttempt < 300) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        setLastPlayAttempt(Date.now());
        console.log("Attempting to play video...");
        await videoElement.play();
        console.log("Video playback started successfully");
        return true;
      } catch (error) {
        console.error("Failed to play video:", error);
        return false;
      }
    }
    
    // Also check if video has actual dimensions
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      console.warn("Video dimensions are zero, feed may not be working properly");
      return false;
    }
    
    return !videoElement.paused;
  }, [lastPlayAttempt]);
  
  /**
   * Check if video element is ready for processing
   */
  const checkVideoStatus = useCallback((videoRef: React.RefObject<HTMLVideoElement>): { 
    isReady: boolean, 
    details: string,
    resolution: { width: number, height: number } | null
  } => {
    if (!videoRef.current) {
      return { isReady: false, details: "Video element not found", resolution: null };
    }
    
    const video = videoRef.current;
    const hasStream = !!video.srcObject;
    const hasValidDimensions = video.videoWidth > 0 && video.videoHeight > 0;
    const isPlaying = !video.paused && !video.ended;
    const hasValidReadyState = video.readyState >= 2;
    
    let details = "";
    
    if (!hasStream) details += "No stream. ";
    if (!hasValidDimensions) details += "No dimensions. ";
    if (!isPlaying) details += "Not playing. ";
    if (!hasValidReadyState) details += `Ready state: ${video.readyState}. `;
    
    const isReady = hasStream && hasValidDimensions && isPlaying && hasValidReadyState;
    
    // Resolution
    const resolution = hasValidDimensions 
      ? { width: video.videoWidth, height: video.videoHeight } 
      : null;
    
    return { 
      isReady, 
      details: isReady ? "Video ready" : `Video not ready: ${details}`, 
      resolution 
    };
  }, []);
  
  return {
    setupVideoElement,
    ensureVideoIsPlaying,
    checkVideoStatus
  };
};
