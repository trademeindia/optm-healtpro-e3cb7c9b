import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCameraToggleProps {
  requestCameraAccess: () => Promise<{ stream: MediaStream | null, error: string | null, permissionDenied?: boolean }>;
  onCameraStart: (stream: MediaStream) => void;
  onCameraStop: () => void;
  setError: (error: string | null) => void;
  setPermission: (permission: 'granted' | 'denied' | 'prompt') => void;
}

export const useCameraToggle = ({
  requestCameraAccess,
  onCameraStart,
  onCameraStop,
  setError,
  setPermission
}: UseCameraToggleProps) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  
  // Toggle camera on/off
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      // Stop Camera
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        setVideoStream(null);
        onCameraStop();
        setCameraActive(false);
        
        toast({
          description: "Camera turned off",
          variant: "default"
        });
      }
    } else {
      // Start Camera
      const { stream, error, permissionDenied } = await requestCameraAccess();
      
      if (stream) {
        setVideoStream(stream);
        onCameraStart(stream);
        setCameraActive(true);
        setError(null);
        setPermission('granted');
      } else {
        setError(error);
        setCameraActive(false);
        
        if (permissionDenied) {
          setPermission('denied');
        }
      }
    }
  }, [cameraActive, videoStream, requestCameraAccess, onCameraStart, onCameraStop, setError, setPermission, toast]);
  
  // Get permission status on mount
  useEffect(() => {
    const getPermissionStatus = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermission(permissionStatus.state);
        
        permissionStatus.addEventListener('change', () => {
          setPermission(permissionStatus.state);
        });
      } catch (error) {
        console.error("Error checking camera permission:", error);
        setError("Error checking camera permission.");
      }
    };
    
    getPermissionStatus();
  }, [setError, setPermission]);
  
  return {
    cameraActive,
    toggleCamera
  };
};
