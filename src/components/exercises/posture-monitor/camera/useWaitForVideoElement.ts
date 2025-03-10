
import { useCallback } from 'react';

interface UseWaitForVideoElementProps {
  mountedRef: React.MutableRefObject<boolean>;
}

export const useWaitForVideoElement = ({
  mountedRef
}: UseWaitForVideoElementProps) => {
  // Function to check if video element is ready
  const waitForVideoElement = useCallback(async (videoRef: React.RefObject<HTMLVideoElement>): Promise<boolean> => {
    console.log("Waiting for video element to be available in DOM...");
    // Try for up to 10 seconds (100 attempts * 100ms)
    for (let i = 0; i < 100; i++) {
      if (!mountedRef.current) return false;
      
      if (videoRef.current) {
        console.log("Video element found in DOM");
        return true;
      }
      
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.error("Timed out waiting for video element");
    return false;
  }, [mountedRef]);
  
  return { waitForVideoElement };
};
