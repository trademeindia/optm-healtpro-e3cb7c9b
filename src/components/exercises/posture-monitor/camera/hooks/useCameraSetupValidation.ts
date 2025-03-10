
import { useCallback } from 'react';
import { VideoStatus } from '../../hooks/detection/types';

interface UseCameraSetupValidationProps {
  mountedRef: React.MutableRefObject<boolean>;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setCameraError: (error: string | null) => void;
  stopCamera: () => void;
  setIsInitializing: (initializing: boolean) => void;
  waitForVideoElement: (videoRef: React.RefObject<HTMLVideoElement>) => Promise<boolean>;
  checkVideoStatus: (videoRef: React.RefObject<HTMLVideoElement>) => { 
    isReady: boolean, 
    details: string,
    resolution: { width: number, height: number } | null
  };
}

export const useCameraSetupValidation = ({
  mountedRef,
  videoRef,
  canvasRef,
  setCameraError,
  stopCamera,
  setIsInitializing,
  waitForVideoElement,
  checkVideoStatus
}: UseCameraSetupValidationProps) => {
  
  // Check if video element exists and is ready
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
  
  // Validate component is still mounted
  const validateComponentMounted = useCallback((): boolean => {
    if (!mountedRef.current) {
      console.log("Component unmounted during camera initialization");
      stopCamera();
      setIsInitializing(false);
      return false;
    }
    return true;
  }, [mountedRef, stopCamera, setIsInitializing]);
  
  // Perform final video status check
  const performFinalStatusCheck = useCallback(async (): Promise<boolean> => {
    // Final video status check
    const finalStatus = checkVideoStatus(videoRef);
    
    if (!finalStatus.isReady) {
      console.error("Final video status check failed:", finalStatus.details);
      setCameraError(`Camera feed has issues: ${finalStatus.details}`);
      
      // Double-check video element exists
      if (!videoRef.current) {
        setCameraError("Video element unavailable. Please reload the page.");
        stopCamera();
        setIsInitializing(false);
        return false;
      }
      
      return false;
    }
    
    return true;
  }, [checkVideoStatus, videoRef, setCameraError, stopCamera, setIsInitializing]);
  
  return {
    validateVideoElement,
    validateComponentMounted,
    performFinalStatusCheck
  };
};
