
import { useCallback } from 'react';

interface UseVideoReadyCheckProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoReady: boolean;
}

export const useVideoReadyCheck = ({ videoRef, videoReady }: UseVideoReadyCheckProps) => {
  // Check if video is ready for pose estimation
  const isVideoReady = useCallback(() => {
    const video = videoRef.current;
    
    if (!video) return false;
    
    // Ensure video has valid dimensions and is playing
    return (
      videoReady &&
      video.readyState >= 2 && // HAVE_CURRENT_DATA or better
      video.width > 0 &&
      video.height > 0 &&
      !video.paused
    );
  }, [videoRef, videoReady]);
  
  // Added for backward compatibility
  const isVideoElementReady = useCallback((video: HTMLVideoElement) => {
    if (!video) return false;
    
    return (
      video.readyState >= 2 &&
      video.width > 0 &&
      video.height > 0 &&
      !video.paused
    );
  }, []);
  
  return { 
    isVideoReady,
    isVideoElementReady
  };
};
