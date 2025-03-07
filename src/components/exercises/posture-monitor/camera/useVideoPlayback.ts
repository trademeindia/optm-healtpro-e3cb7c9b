
import { useState, useCallback } from 'react';

/**
 * Provides utilities for controlling video playback
 */
export const useVideoPlayback = () => {
  const [lastPlayAttempt, setLastPlayAttempt] = useState(0);
  
  /**
   * Attempt to play a video element with retry logic
   */
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
  
  return {
    attemptVideoPlay,
    ensureVideoIsPlaying,
    lastPlayAttempt
  };
};
