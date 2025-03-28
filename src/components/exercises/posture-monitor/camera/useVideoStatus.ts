
import { useCallback } from 'react';

/**
 * Provides utilities for checking video element status
 */
export const useVideoStatus = () => {
  /**
   * Checks the status of the video element to ensure it's ready for use
   */
  const checkVideoStatus = useCallback((videoRef: React.MutableRefObject<HTMLVideoElement | null>) => {
    if (!videoRef.current) {
      return { 
        isReady: false, 
        details: 'Video element reference is null',
        resolution: null
      };
    }
    
    const video = videoRef.current;
    
    // Check video state
    const paused = video.paused;
    const ended = video.ended;
    const muted = video.muted;
    const readyState = video.readyState;
    const hasSource = !!video.srcObject;
    const hasDimensions = video.videoWidth > 0 && video.videoHeight > 0;
    
    // Get resolution if available
    const resolution = hasDimensions 
      ? { width: video.videoWidth, height: video.videoHeight }
      : null;
    
    let isReady = false;
    let details = '';
    
    // Check for various issues
    if (!hasSource) {
      details = 'No video source';
    } else if (readyState < 2) {
      // HAVE_CURRENT_DATA = 2
      details = `Video not ready (state ${readyState})`;
    } else if (ended) {
      details = 'Video playback ended';
    } else if (paused) {
      details = 'Video paused';
    } else if (!hasDimensions) {
      details = 'Video has no dimensions';
    } else {
      isReady = true;
      details = 'Video ready';
    }
    
    return { isReady, details, resolution };
  }, []);
  
  return { checkVideoStatus };
};
