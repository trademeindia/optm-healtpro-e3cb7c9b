
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CameraHookResult {
  cameraActive: boolean;
  toggleCamera: () => Promise<void>;
  videoStatus: {
    isReady: boolean;
    hasStream: boolean;
    resolution: { width: number; height: number } | null;
    lastCheckTime: number;
    errorCount: number;
  };
  permission: 'granted' | 'denied' | 'prompt';
  retryCamera: () => Promise<void>;
  cameraError: string | null;
}

export const useCamera = (videoRef: React.RefObject<HTMLVideoElement>): CameraHookResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState({
    isReady: false,
    hasStream: false,
    resolution: null as { width: number; height: number } | null,
    lastCheckTime: 0,
    errorCount: 0
  });
  
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Request camera access
  const requestCameraAccess = useCallback(async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      console.log('Camera access granted');
      setPermission('granted');
      return { stream, error: null };
    } catch (err: any) {
      console.error('Camera access error:', err);
      const permissionDenied = err.name === 'NotAllowedError' || 
                              err.name === 'PermissionDeniedError';
      
      setPermission(permissionDenied ? 'denied' : 'prompt');
      
      return { 
        stream: null, 
        error: err.message || 'Failed to access camera', 
        permissionDenied 
      };
    }
  }, []);
  
  // Setup video element
  const setupVideoElement = useCallback(async (
    videoRef: React.RefObject<HTMLVideoElement>,
    stream: MediaStream
  ) => {
    if (!videoRef.current) {
      console.error('Video element is null');
      return false;
    }
    
    try {
      console.log('Setting up video element with stream');
      // Set the stream as source for video element
      videoRef.current.srcObject = stream;
      
      // Wait for video to load metadata
      await new Promise<void>((resolve) => {
        if (!videoRef.current) {
          resolve();
          return;
        }
        
        if (videoRef.current.readyState >= 2) {
          console.log('Video already loaded');
          resolve();
        } else {
          console.log('Waiting for video to load...');
          videoRef.current.onloadeddata = () => {
            console.log('Video loaded');
            resolve();
          };
          
          // Add a timeout in case onloadeddata never fires
          setTimeout(() => {
            console.log('Video load timeout, continuing anyway');
            resolve();
          }, 2000);
        }
      });
      
      console.log('Video setup complete, dimensions:', 
        videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
      return true;
    } catch (err) {
      console.error('Error setting up video element:', err);
      return false;
    }
  }, []);
  
  // Toggle camera state
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      console.log('Stopping camera');
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraActive(false);
      setVideoStatus(prev => ({
        ...prev,
        isReady: false,
        hasStream: false
      }));
      
      return;
    }
    
    console.log('Starting camera');
    setIsInitializing(true);
    setCameraError(null);
    
    try {
      const { stream, error, permissionDenied } = await requestCameraAccess();
      
      if (error || !stream) {
        setCameraError(error || 'Failed to access camera');
        setIsInitializing(false);
        
        if (permissionDenied) {
          toast.error('Camera access was denied. Please check your browser permissions.');
        } else {
          toast.error('Failed to access camera. Please try again.');
        }
        
        return;
      }
      
      streamRef.current = stream;
      
      const videoSetupSuccess = await setupVideoElement(videoRef, stream);
      if (!videoSetupSuccess) {
        setCameraError('Failed to setup video element');
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        setIsInitializing(false);
        return;
      }
      
      if (videoRef.current) {
        try {
          console.log('Attempting to play video');
          await videoRef.current.play();
          console.log('Video playback started successfully');
          
          setCameraActive(true);
          setVideoStatus({
            isReady: true,
            hasStream: true,
            resolution: {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight
            },
            lastCheckTime: Date.now(),
            errorCount: 0
          });
          
          toast.success('Camera activated successfully');
        } catch (playError) {
          console.error('Error playing video:', playError);
          setCameraError('Failed to start camera playback. Please try again.');
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          setIsInitializing(false);
        }
      }
    } catch (err: any) {
      console.error('Error toggling camera:', err);
      setCameraError(err.message || 'Error accessing camera');
      setIsInitializing(false);
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [cameraActive, requestCameraAccess, setupVideoElement, videoRef]);
  
  // Retry camera connection
  const retryCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setCameraError(null);
    
    // Small delay before retrying
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toggleCamera();
  }, [toggleCamera, videoRef]);
  
  return {
    cameraActive,
    toggleCamera,
    videoStatus,
    permission,
    retryCamera,
    cameraError
  };
};
