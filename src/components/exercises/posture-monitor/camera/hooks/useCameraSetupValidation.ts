
import { useCallback } from 'react';

interface UseCameraSetupValidationProps {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  setCameraError: (error: string | null) => void;
  setIsInitializing: (initializing: boolean) => void;
  waitForVideoElement: (videoRef: React.MutableRefObject<HTMLVideoElement | null>) => Promise<boolean>;
  checkVideoStatus: (videoRef: React.MutableRefObject<HTMLVideoElement | null>) => { 
    isReady: boolean, 
    details: string,
    resolution: { width: number, height: number } | null
  };
}

export const useCameraSetupValidation = ({
  videoRef,
  setCameraError,
  setIsInitializing,
  waitForVideoElement,
  checkVideoStatus
}: UseCameraSetupValidationProps) => {
  
  // Validate that video element exists and is ready
  const validateVideoElement = useCallback(async (): Promise<boolean> => {
    // First, ensure video element exists
    const videoElementExists = await waitForVideoElement(videoRef);
    if (!videoElementExists) {
      setCameraError("Video element not found. Please reload the page and try again.");
      setIsInitializing(false);
      return false;
    }
    return true;
  }, [waitForVideoElement, videoRef, setCameraError, setIsInitializing]);
  
  // Check final video status to ensure it's working properly
  const checkFinalVideoStatus = useCallback(async (): Promise<boolean> => {
    const status = checkVideoStatus(videoRef);
    
    if (!status.isReady) {
      console.error("Final video status check failed:", status.details);
      setCameraError(`Camera feed has issues: ${status.details}`);
      return false;
    }
    
    return true;
  }, [checkVideoStatus, videoRef, setCameraError]);
  
  return {
    validateVideoElement,
    checkFinalVideoStatus
  };
};
