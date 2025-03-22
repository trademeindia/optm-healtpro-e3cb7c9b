
import { useCallback } from 'react';

interface UseVideoReadyCheckProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoReady: boolean;
}

export const useVideoReadyCheck = ({ videoRef, videoReady }: UseVideoReadyCheckProps) => {
  // Check if video is ready for detection
  const isVideoReady = useCallback((): boolean => {
    const video = videoRef.current;
    
    if (!video) {
      console.log("Video element not found");
      return false;
    }
    
    if (video.readyState < 2) {
      console.log("Video not ready (readyState < 2)");
      return false;
    }
    
    if (video.paused) {
      console.log("Video is paused");
      return false;
    }
    
    if (!videoReady) {
      console.log("Video not marked as ready");
      return false;
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log("Video dimensions are zero");
      return false;
    }
    
    return true;
  }, [videoRef, videoReady]);
  
  return {
    isVideoReady
  };
};
