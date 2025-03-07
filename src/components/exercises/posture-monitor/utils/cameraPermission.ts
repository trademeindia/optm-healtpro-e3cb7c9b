
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export type CameraPermissionStatus = 'granted' | 'denied' | 'prompt';

export interface UseCameraPermissionResult {
  permission: CameraPermissionStatus;
  setPermission: (status: CameraPermissionStatus) => void;
  handlePermissionError: (error: unknown) => string;
}

export function useCameraPermission(): UseCameraPermissionResult {
  const [permission, setPermission] = useState<CameraPermissionStatus>('prompt');

  const handlePermissionError = useCallback((error: unknown): string => {
    let errorMessage = "Failed to access camera";
    
    if (error instanceof DOMException) {
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No camera found. Please connect a camera and try again.";
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
        setPermission('denied');
      } else if (error.name === 'AbortError') {
        errorMessage = "Camera access was aborted. Please try again.";
      }
    }
    
    return errorMessage;
  }, []);

  return {
    permission,
    setPermission,
    handlePermissionError
  };
}
