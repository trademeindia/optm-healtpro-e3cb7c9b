
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseCameraOptions {
  onCameraReady?: () => void;
  autoStart?: boolean;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  
  // Check for camera permissions
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermission(result.state as 'granted' | 'denied' | 'prompt');
        
        result.addEventListener('change', () => {
          setPermission(result.state as 'granted' | 'denied' | 'prompt');
        });
      } catch (error) {
        console.log('Permissions API not supported, will check when camera is requested');
      }
    };
    
    checkPermission();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Auto-start camera if requested
  useEffect(() => {
    if (options.autoStart && permission === 'granted') {
      startCamera();
    }
  }, [options.autoStart, permission]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  // Start the camera and connect to video element
  const startCamera = useCallback(async () => {
    if (cameraActive || isInitializing) return;
    
    setIsInitializing(true);
    setCameraError(null);
    
    try {
      console.log('Starting camera...');
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      
      if (!videoRef.current) {
        throw new Error('Video element is not available');
      }
      
      // Connect stream to video element
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (!videoRef.current) {
          resolve();
          return;
        }
        
        const onLoadedMetadata = () => {
          videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
          resolve();
        };
        
        if (videoRef.current.readyState >= 2) {
          resolve();
        } else {
          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        }
      });
      
      // Start playing the video
      await videoRef.current.play();
      
      setCameraActive(true);
      setPermission('granted');
      options.onCameraReady?.();
      
      toast.success('Camera started successfully');
      console.log('Camera started successfully');
    } catch (error: any) {
      console.error('Error starting camera:', error);
      
      let errorMessage = 'Failed to access camera';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access was denied. Please allow camera access and try again.';
        setPermission('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      } else if (error.message) {
        errorMessage = `Camera error: ${error.message}`;
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [cameraActive, isInitializing, options]);
  
  // Stop the camera and clean up
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  }, []);
  
  // Toggle camera state
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
    } else {
      await startCamera();
    }
  }, [cameraActive, startCamera, stopCamera]);
  
  // Retry after error
  const retryCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    
    // Small delay before retrying
    await new Promise(resolve => setTimeout(resolve, 500));
    await startCamera();
  }, [startCamera, stopCamera]);
  
  return {
    videoRef,
    canvasRef,
    cameraActive,
    toggleCamera,
    startCamera,
    stopCamera,
    retryCamera,
    cameraError,
    permission,
    isInitializing
  };
};
