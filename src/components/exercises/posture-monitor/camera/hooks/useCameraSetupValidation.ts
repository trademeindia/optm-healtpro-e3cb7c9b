
import { useCallback } from 'react';

interface UseCameraSetupValidationProps {
  setCameraError: (error: string | null) => void;
  setIsInitializing: (initializing: boolean) => void;
  waitForVideoElement: (videoRef: React.MutableRefObject<HTMLVideoElement | null>) => Promise<boolean>;
}

export const useCameraSetupValidation = ({
  setCameraError,
  setIsInitializing,
  waitForVideoElement
}: UseCameraSetupValidationProps) => {
  
  // Validate video element
  const validateVideoElement = useCallback(async (
    videoRef: React.MutableRefObject<HTMLVideoElement | null>
  ): Promise<boolean> => {
    // Wait for video element to be available
    const videoElementAvailable = await waitForVideoElement(videoRef);
    
    if (!videoElementAvailable) {
      setCameraError("Video element not available. Please reload the page.");
      setIsInitializing(false);
      return false;
    }
    
    return true;
  }, [waitForVideoElement, setCameraError, setIsInitializing]);
  
  return {
    validateVideoElement
  };
};
