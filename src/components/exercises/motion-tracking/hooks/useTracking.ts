
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseTrackingProps {
  startDetection: () => void;
  stopDetection: () => void;
  resetSession: () => void;
}

export const useTracking = ({ 
  startDetection, 
  stopDetection, 
  resetSession 
}: UseTrackingProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle motion tracking
  const toggleTracking = useCallback(() => {
    if (isTracking) {
      stopDetection();
      setIsTracking(false);
      toast.info("Motion tracking paused");
    } else {
      startDetection();
      setIsTracking(true);
      toast.success("Motion tracking active");
    }
  }, [isTracking, startDetection, stopDetection]);

  // Reset session data
  const handleReset = useCallback(() => {
    resetSession();
    toast.info("Session reset");
  }, [resetSession]);

  // Clean up on unmount
  const cleanup = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    stopDetection();
  }, [stopDetection]);

  return {
    isTracking,
    setIsTracking,
    toggleTracking,
    handleReset,
    cleanup,
    loadingTimeoutRef
  };
};
