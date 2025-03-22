
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCameraOptions {
  onCameraStart?: () => void;
  onCameraStop?: () => void;
  onCameraError?: (error: string) => void;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  // State for camera status
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Refs for DOM elements and stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // State for video readiness
  const [videoStatus, setVideoStatus] = useState({
    isReady: false,
    hasStarted: false,
    error: null as string | null
  });
  
  // Check camera permissions
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermission(permissionStatus.state);
        
        permissionStatus.onchange = () => {
          setPermission(permissionStatus.state);
        };
      } catch (error) {
        console.log('Permission API not supported, will check permissions when requesting camera');
      }
    };
    
    checkPermission();
  }, []);
  
  // Handle video status changes
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    const handleVideoReady = () => {
      setVideoStatus(prev => ({ ...prev, isReady: true, hasStarted: true }));
    };
    
    const handleVideoError = (event: Event) => {
      const videoError = (event as any).target?.error;
      const errorMessage = videoError ? 
        `Video error: ${videoError.message || videoError.code}` : 
        'Unknown video error';
      
      setVideoStatus(prev => ({ 
        ...prev, 
        isReady: false, 
        error: errorMessage 
      }));
      
      setCameraError(errorMessage);
    };
    
    videoElement.addEventListener('loadeddata', handleVideoReady);
    videoElement.addEventListener('error', handleVideoError);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoReady);
      videoElement.removeEventListener('error', handleVideoError);
    };
  }, [videoRef.current]);
  
  // Function to start the camera
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        // Stream already exists, just update state
        setCameraActive(true);
        return;
      }
      
      // Reset error state
      setCameraError(null);
      setVideoStatus(prev => ({ ...prev, error: null }));
      
      const constraints = { 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        } 
      };
      
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      // Store the stream reference
      streamRef.current = stream;
      
      // Connect the stream to the video element
      videoRef.current.srcObject = stream;
      
      // Update state
      setCameraActive(true);
      setVideoStatus(prev => ({ ...prev, isReady: false, hasStarted: true }));
      
      // Call the onCameraStart callback
      options.onCameraStart?.();
      
      // Update permission state
      setPermission('granted');
      
    } catch (error: any) {
      let errorMessage = 'Failed to start camera';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access denied. Please grant permission in your browser settings.';
        setPermission('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is in use by another application or not available.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet the required constraints.';
      } else if (error.message) {
        errorMessage = `Camera error: ${error.message}`;
      }
      
      setCameraError(errorMessage);
      setVideoStatus(prev => ({ ...prev, error: errorMessage }));
      
      // Call the onCameraError callback
      options.onCameraError?.(errorMessage);
      
      console.error('Camera start error:', errorMessage, error);
    }
  }, [options]);
  
  // Function to stop the camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      // Stop all tracks in the stream
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear the video source
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    // Update state
    setCameraActive(false);
    setVideoStatus(prev => ({ ...prev, isReady: false }));
    
    // Call the onCameraStop callback
    options.onCameraStop?.();
  }, [options]);
  
  // Toggle camera on/off
  const toggleCamera = useCallback(() => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [cameraActive, startCamera, stopCamera]);
  
  // Retry camera access
  const retryCamera = useCallback(() => {
    if (streamRef.current) {
      stopCamera();
    }
    
    // Small delay before trying again
    setTimeout(() => {
      startCamera();
    }, 500);
  }, [startCamera, stopCamera]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    startCamera,
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
  };
};
