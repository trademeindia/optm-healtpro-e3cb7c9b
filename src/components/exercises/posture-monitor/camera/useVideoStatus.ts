
import { useCallback } from 'react';

/**
 * Provides utilities for checking video element status
 */
export const useVideoStatus = () => {
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
    checkVideoStatus
  };
};
