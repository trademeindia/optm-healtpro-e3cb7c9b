
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

type VideoStatus = 'inactive' | 'loading' | 'active' | 'error';
type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export default function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>('inactive');
  const [permission, setPermission] = useState<PermissionStatus>('unknown');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const stream = useRef<MediaStream | null>(null);

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    setVideoStatus('loading');
    setCameraError(null);

    try {
      // Check if permission was already denied
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermission(permissionStatus.state as PermissionStatus);

      if (permissionStatus.state === 'denied') {
        throw new Error('Camera permission was denied. Please enable camera access in your browser settings.');
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      videoRef.current.srcObject = mediaStream;
      stream.current = mediaStream;
      setVideoStatus('active');
      setCameraActive(true);
      setPermission('granted');
      toast.success('Camera activated successfully');

    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(error instanceof Error ? error.message : 'Failed to access camera');
      setVideoStatus('error');
      setCameraActive(false);
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setPermission('denied');
        toast.error('Camera access denied. Please check your browser permissions.');
      } else {
        toast.error('Failed to access camera. Please make sure no other app is using it.');
      }
    }
  }, [videoRef]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
      stream.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setVideoStatus('inactive');
    setCameraActive(false);
    toast.info('Camera stopped');
  }, [videoRef]);

  // Toggle camera state
  const toggleCamera = useCallback(() => {
    if (cameraActive) {
      stopCamera();
    } else {
      requestCameraPermission();
    }
  }, [cameraActive, stopCamera, requestCameraPermission]);

  // Retry camera connection
  const retryCamera = useCallback(() => {
    stopCamera();
    requestCameraPermission();
  }, [stopCamera, requestCameraPermission]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    cameraActive,
    toggleCamera,
    videoStatus,
    permission,
    retryCamera,
    cameraError
  };
}
