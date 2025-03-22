
import { useState, useRef, useCallback, useEffect } from 'react';
import { VideoStatus } from './types';
import { toast } from 'sonner';

interface UseCameraOptions {
  onCameraStart?: () => void;
  onCameraStop?: () => void;
  onCameraError?: (error: string) => void;
  onFeedbackChange?: (message: string | null, type: string) => void;
}

export const useCamera = (options: UseCameraOptions = {}) => {
  // State for camera status
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Refs for DOM elements and stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  
  // State for video readiness
  const [videoStatus, setVideoStatus] = useState<VideoStatus>({
    isReady: false,
    hasStream: false,
    resolution: null,
    lastCheckTime: Date.now(),
    errorCount: 0
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
      if (!mountedRef.current) return;
      
      setVideoStatus(prev => ({ 
        ...prev, 
        isReady: true, 
        hasStream: true,
        resolution: {
          width: videoElement.videoWidth,
          height: videoElement.videoHeight
        },
        lastCheckTime: Date.now() 
      }));
      
      if (options.onFeedbackChange) {
        options.onFeedbackChange("Camera is ready", "success");
      }
    };
    
    const handleVideoError = (event: Event) => {
      if (!mountedRef.current) return;
      
      const videoError = (event as any).target?.error;
      const errorMessage = videoError ? 
        `Video error: ${videoError.message || videoError.code}` : 
        'Unknown video error';
      
      setVideoStatus(prev => ({ 
        ...prev, 
        isReady: false,
        errorCount: prev.errorCount + 1
      }));
      
      setCameraError(errorMessage);
      
      if (options.onCameraError) {
        options.onCameraError(errorMessage);
      }
      
      if (options.onFeedbackChange) {
        options.onFeedbackChange(errorMessage, "error");
      }
    };
    
    videoElement.addEventListener('loadeddata', handleVideoReady);
    videoElement.addEventListener('error', handleVideoError);
    
    return () => {
      videoElement.removeEventListener('loadeddata', handleVideoReady);
      videoElement.removeEventListener('error', handleVideoError);
    };
  }, [videoRef.current, options]);
  
  // Function to start the camera
  const startCamera = useCallback(async () => {
    if (isInitializing) {
      console.log("Camera initialization already in progress");
      return;
    }
    
    setIsInitializing(true);
    
    try {
      if (streamRef.current) {
        // Stream already exists, just update state
        setCameraActive(true);
        setIsInitializing(false);
        return;
      }
      
      // Reset error state
      setCameraError(null);
      setVideoStatus(prev => ({ ...prev, errorCount: 0 }));
      
      if (options.onFeedbackChange) {
        options.onFeedbackChange("Requesting camera access...", "info");
      }
      
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
      
      if (!mountedRef.current) {
        // Component unmounted during camera initialization
        stream.getTracks().forEach(track => track.stop());
        setIsInitializing(false);
        return;
      }
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      // Store the stream reference
      streamRef.current = stream;
      
      // Connect the stream to the video element
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(error => {
        console.error("Failed to play video:", error);
        throw error;
      });
      
      // Update state
      setCameraActive(true);
      setVideoStatus(prev => ({ 
        ...prev, 
        hasStream: true,
        lastCheckTime: Date.now()
      }));
      
      // Call the onCameraStart callback
      if (options.onCameraStart) {
        options.onCameraStart();
      }
      
      // Update permission state
      setPermission('granted');
      
      // Show toast notification
      toast.success("Camera activated", {
        description: "Your camera is now active and ready for motion tracking"
      });
      
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
      setVideoStatus(prev => ({ ...prev, errorCount: prev.errorCount + 1 }));
      
      // Call the onCameraError callback
      if (options.onCameraError) {
        options.onCameraError(errorMessage);
      }
      
      if (options.onFeedbackChange) {
        options.onFeedbackChange(errorMessage, "error");
      }
      
      // Show toast notification
      toast.error("Camera Error", {
        description: errorMessage
      });
      
      console.error('Camera start error:', errorMessage, error);
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [options, isInitializing]);
  
  // Function to stop the camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      // Stop all tracks in the stream
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.error("Error stopping track:", err);
        }
      });
      streamRef.current = null;
    }
    
    // Clear the video source
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const oldSrc = videoRef.current.srcObject;
        videoRef.current.srcObject = null;
        
        // Handle MediaStream cleanup if needed
        if (oldSrc instanceof MediaStream) {
          oldSrc.getTracks().forEach(track => {
            try { track.stop(); } catch (e) { console.error(e); }
          });
        }
      } catch (error) {
        console.error("Error clearing video source:", error);
      }
    }
    
    // Update state
    setCameraActive(false);
    setVideoStatus(prev => ({ 
      ...prev, 
      isReady: false,
      hasStream: false 
    }));
    
    // Call the onCameraStop callback
    if (options.onCameraStop) {
      options.onCameraStop();
    }
    
    // Show toast notification
    toast.info("Camera stopped", {
      description: "Camera has been turned off"
    });
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
  
  // Monitor camera stream health
  useEffect(() => {
    if (!cameraActive || !videoRef.current) return;
    
    const checkVideoHealth = () => {
      if (!mountedRef.current || !videoRef.current || !cameraActive) return;
      
      const video = videoRef.current;
      const now = Date.now();
      
      // Only check every 2 seconds to avoid performance issues
      if (now - videoStatus.lastCheckTime < 2000) return;
      
      // Check for video issues
      if (video.paused || video.ended || video.readyState < 2 || !video.srcObject) {
        console.log("Video health check: Issues detected");
        setVideoStatus(prev => ({
          ...prev,
          errorCount: prev.errorCount + 1,
          lastCheckTime: now
        }));
        
        // If multiple issues detected, try to recover
        if (videoStatus.errorCount > 3) {
          console.log("Multiple video issues detected, attempting recovery");
          retryCamera();
        }
      } else {
        // Video is healthy, reset error count
        setVideoStatus({
          isReady: true,
          hasStream: true,
          resolution: {
            width: video.videoWidth,
            height: video.videoHeight
          },
          lastCheckTime: now,
          errorCount: 0
        });
      }
    };
    
    const intervalId = setInterval(checkVideoHealth, 2000);
    return () => clearInterval(intervalId);
  }, [cameraActive, videoRef, videoStatus, retryCamera]);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) { console.error(e); }
        });
      }
      
      // Final state cleanup
      setCameraActive(false);
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
    videoStatus,
    isInitializing
  };
};
