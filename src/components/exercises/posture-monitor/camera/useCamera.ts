
import { useState, useRef, useCallback, useEffect } from 'react';
import { useCameraSetup } from './useCameraSetup';
import { useVideoElement } from './useVideoElement';
import { toast } from '@/hooks/use-toast';
import { VideoStatus } from '../hooks/detection/types';

interface UseCameraProps {
  onCameraStart?: () => void;
}

interface UseCameraResult {
  cameraActive: boolean;
  permission: 'granted' | 'denied' | 'prompt';
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  streamRef: React.RefObject<MediaStream | null>;
  toggleCamera: () => Promise<void>;
  stopCamera: () => void;
  cameraError: string | null;
  retryCamera: () => Promise<void>;
  videoStatus: VideoStatus;
}

export const useCamera = ({ onCameraStart }: UseCameraProps = {}): UseCameraResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Track video status
  const [videoStatus, setVideoStatus] = useState<VideoStatus>({
    isReady: false,
    hasStream: false,
    resolution: null,
    lastCheckTime: 0,
    errorCount: 0
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true); // Track if component is mounted
  const setupTimeoutRef = useRef<number | null>(null);
  
  const { requestCameraAccess } = useCameraSetup();
  const { setupVideoElement, ensureVideoIsPlaying, checkVideoStatus } = useVideoElement();
  
  // Clean up function to stop the camera stream
  const stopCamera = useCallback(() => {
    console.log("Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraError(null);
    setVideoStatus(prevStatus => ({
      ...prevStatus,
      isReady: false,
      hasStream: false,
      lastCheckTime: Date.now()
    }));
    
    // Clear any timeouts
    if (setupTimeoutRef.current) {
      window.clearTimeout(setupTimeoutRef.current);
      setupTimeoutRef.current = null;
    }
  }, []);
  
  // Function to check if video element is ready
  const waitForVideoElement = useCallback(async (): Promise<boolean> => {
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
  }, []);
  
  // Monitor video status regularly
  useEffect(() => {
    if (!cameraActive) return;
    
    const checkInterval = setInterval(() => {
      if (!videoRef.current || !mountedRef.current) return;
      
      const status = checkVideoStatus(videoRef);
      
      setVideoStatus(prevStatus => ({
        ...prevStatus,
        isReady: status.isReady,
        hasStream: !!videoRef.current?.srcObject,
        resolution: status.resolution,
        lastCheckTime: Date.now(),
        errorCount: status.isReady ? 0 : prevStatus.errorCount + 1
      }));
      
      // If video has persistent issues, try to recover
      if (!status.isReady && videoRef.current?.srcObject) {
        console.warn("Video element not ready:", status.details);
        
        if (videoStatus.errorCount > 5) {
          console.error("Persistent video issues detected, attempting recovery");
          ensureVideoIsPlaying(videoRef).catch(err => {
            console.error("Failed to recover video:", err);
          });
          
          // Reset error count after recovery attempt
          setVideoStatus(prevStatus => ({
            ...prevStatus,
            errorCount: 0
          }));
        }
      }
    }, 2000);
    
    return () => clearInterval(checkInterval);
  }, [cameraActive, checkVideoStatus, ensureVideoIsPlaying, videoStatus]);
  
  // Reset camera when there are too many consecutive errors
  useEffect(() => {
    if (videoStatus.errorCount > 10) {
      console.error("Too many video errors, resetting camera");
      setCameraError("Camera feed has issues. Attempting to reset...");
      
      // Auto-retry with timeout
      const retryTimeout = setTimeout(() => {
        retryCamera().catch(err => {
          console.error("Auto-retry of camera failed:", err);
        });
      }, 1000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [videoStatus.errorCount]);
  
  // Retry camera - stop and restart
  const retryCamera = useCallback(async () => {
    if (isInitializing) {
      console.log("Camera is already initializing, ignoring retry");
      return;
    }
    
    console.log("Retrying camera...");
    stopCamera();
    
    // Small delay to ensure everything is reset
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Re-initialize
    await toggleCamera();
  }, [isInitializing, stopCamera]);
  
  // Main function to toggle camera
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    if (isInitializing) {
      console.log("Camera initialization already in progress");
      return;
    }
    
    setIsInitializing(true);
    setCameraError(null);
    
    try {
      // First, ensure video element exists
      const videoElementExists = await waitForVideoElement();
      if (!videoElementExists) {
        setCameraError("Video element not found. Please reload the page and try again.");
        setIsInitializing(false);
        return;
      }
      
      // Request camera permission and turn on camera
      const { stream, error, permissionDenied } = await requestCameraAccess() || {};
      
      if (error) {
        setCameraError(error);
        if (permissionDenied) {
          setPermission('denied');
        }
        setIsInitializing(false);
        return;
      }
      
      if (!stream) {
        setCameraError("Failed to access camera stream");
        setIsInitializing(false);
        return;
      }
      
      streamRef.current = stream;
      
      // Make sure component is still mounted
      if (!mountedRef.current) {
        console.log("Component unmounted during camera initialization");
        stopCamera();
        setIsInitializing(false);
        return;
      }
      
      // Double-check video element exists before proceeding
      if (!videoRef.current) {
        console.error("Video element not found in DOM after check");
        setCameraError("Video element not available. Please reload and try again.");
        stopCamera();
        setIsInitializing(false);
        return;
      }
      
      // Update video status with stream
      setVideoStatus(prevStatus => ({
        ...prevStatus,
        hasStream: true,
        lastCheckTime: Date.now()
      }));
      
      // Setup video element
      const videoSetupSuccess = await setupVideoElement(videoRef, canvasRef, stream);
      
      if (!videoSetupSuccess) {
        setCameraError("Failed to setup video element");
        stopCamera();
        setIsInitializing(false);
        return;
      }
      
      // Wait a bit longer to ensure video is ready
      await new Promise(resolve => {
        setupTimeoutRef.current = window.setTimeout(resolve, 800) as unknown as number;
      });
      
      // Double-check component is still mounted
      if (!mountedRef.current) {
        stopCamera();
        setIsInitializing(false);
        return;
      }
      
      // Double-check video state and try to recover if needed
      if (videoRef.current?.paused) {
        console.log("Video not playing after setup, trying again");
        
        const playSuccess = await ensureVideoIsPlaying(videoRef);
        if (!playSuccess) {
          console.error("Failed to play video after retry");
          setCameraError("Could not start video playback. Please try again.");
          stopCamera();
          setIsInitializing(false);
          return;
        }
      }
      
      // Final video status check
      const finalStatus = checkVideoStatus(videoRef);
      
      if (!finalStatus.isReady) {
        console.error("Final video status check failed:", finalStatus.details);
        setCameraError(`Camera feed has issues: ${finalStatus.details}`);
        
        // Try one more time
        await ensureVideoIsPlaying(videoRef).catch(() => {});
        
        // Check once more
        const lastChanceStatus = checkVideoStatus(videoRef);
        if (!lastChanceStatus.isReady) {
          setCameraError("Camera is not functioning properly. Please try again.");
          stopCamera();
          setIsInitializing(false);
          return;
        }
      }
      
      // Set video status
      setVideoStatus({
        isReady: true,
        hasStream: true,
        resolution: finalStatus.resolution,
        lastCheckTime: Date.now(),
        errorCount: 0
      });
      
      // Set camera as active
      setCameraActive(true);
      setPermission('granted');
      
      if (onCameraStart) {
        onCameraStart();
      }
      
      toast({
        title: "Camera Active",
        description: "Camera is now active and ready for pose detection.",
      });
      
    } catch (err) {
      console.error("Error in toggleCamera:", err);
      setCameraError(`Camera setup failed: ${err}`);
      stopCamera();
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [cameraActive, stopCamera, requestCameraAccess, setupVideoElement, 
      ensureVideoIsPlaying, onCameraStart, isInitializing, waitForVideoElement, checkVideoStatus]);
  
  // Set up mounted ref
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      stopCamera();
      
      if (setupTimeoutRef.current) {
        window.clearTimeout(setupTimeoutRef.current);
      }
    };
  }, [stopCamera]);
  
  // Monitor video state and restart if needed
  useEffect(() => {
    if (!cameraActive) return;
    
    const checkVideoInterval = setInterval(() => {
      if (!mountedRef.current) return;
      
      if (!videoRef.current || !streamRef.current) return;
      
      const videoEl = videoRef.current;
      
      // Check if video element is properly playing
      if (videoEl.paused || videoEl.ended) {
        console.log("Video not playing during monitoring, attempting to resume");
        videoEl.play().catch(err => {
          console.error("Failed to resume video during monitoring:", err);
        });
      }
      
      // Check if stream is still active
      const trackActive = streamRef.current.getTracks().some(track => track.readyState === 'live');
      if (!trackActive) {
        console.error("Camera stream tracks are not active");
        setCameraError("Camera stream has been disconnected. Please try again.");
      }
    }, 5000);
    
    return () => clearInterval(checkVideoInterval);
  }, [cameraActive]);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    stopCamera,
    cameraError,
    retryCamera,
    videoStatus
  };
};
