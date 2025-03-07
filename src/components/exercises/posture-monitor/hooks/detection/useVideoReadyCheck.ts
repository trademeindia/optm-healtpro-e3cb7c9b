
import { useCallback } from 'react';

export interface UseVideoReadyCheckProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoReady?: boolean;
}

export const useVideoReadyCheck = ({
  videoRef,
  videoReady = false
}: UseVideoReadyCheckProps) => {
  const isVideoReady = useCallback(() => {
    if (videoReady === false) return false;
    
    if (!videoRef.current) return false;
    
    const video = videoRef.current;
    
    return (
      video.readyState >= 2 && 
      !video.paused && 
      video.videoWidth > 0 &&
      video.videoHeight > 0
    );
  }, [videoRef, videoReady]);

  return { isVideoReady };
};
