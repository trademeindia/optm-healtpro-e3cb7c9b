
import { useEffect } from 'react';

interface UseCameraInitializationProps {
  mountedRef: React.RefObject<boolean>;
  stopCamera: () => void;
  setupTimeoutRef: React.RefObject<number | null>;
}

export const useCameraInitialization = ({
  mountedRef,
  stopCamera,
  setupTimeoutRef
}: UseCameraInitializationProps) => {
  // Set up mounted ref
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      stopCamera();
      
      if (setupTimeoutRef.current) {
        window.clearTimeout(setupTimeoutRef.current);
      }
    };
  }, [mountedRef, stopCamera, setupTimeoutRef]);
};
