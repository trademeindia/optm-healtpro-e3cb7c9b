
import { useCallback } from 'react';
import { VideoStatus } from '../../hooks/detection/types';

interface UseCameraPermissionAndStreamProps {
  requestCameraAccess: () => Promise<{ stream: MediaStream | null; error: string | null; permissionDenied?: boolean }>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  setPermission: (permission: 'granted' | 'denied' | 'prompt') => void;
  setCameraError: (error: string | null) => void;
  setVideoStatus: React.Dispatch<React.SetStateAction<VideoStatus>>;
  setIsInitializing: (initializing: boolean) => void;
  stopCamera: () => void;
}

export const useCameraPermissionAndStream = ({
  requestCameraAccess,
  streamRef,
  setPermission,
  setCameraError,
  setVideoStatus,
  setIsInitializing,
  stopCamera
}: UseCameraPermissionAndStreamProps) => {
  
  // Request camera permission and get stream
  const getCameraStream = useCallback(async (): Promise<boolean> => {
    // Request camera permission and turn on camera
    const { stream, error, permissionDenied } = await requestCameraAccess() || {};
    
    if (error) {
      setCameraError(error);
      if (permissionDenied) {
        setPermission('denied');
      }
      setIsInitializing(false);
      return false;
    }
    
    if (!stream) {
      setCameraError("Failed to access camera stream");
      setIsInitializing(false);
      return false;
    }
    
    streamRef.current = stream;
    
    // Update video status with stream
    setVideoStatus(prevStatus => ({
      ...prevStatus,
      hasStream: true,
      lastCheckTime: Date.now()
    }));
    
    return true;
  }, [requestCameraAccess, streamRef, setPermission, setCameraError, setVideoStatus, setIsInitializing]);

  return {
    getCameraStream
  };
};
