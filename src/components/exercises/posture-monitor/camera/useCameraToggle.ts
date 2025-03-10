
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useCameraSetup } from './useCameraSetup';
import { useVideoElement } from './useVideoElement';
import { VideoStatus } from '../hooks/detection/types';
import { useWaitForVideoElement } from './useWaitForVideoElement';

interface UseCameraToggleProps {
  cameraActive: boolean;
  isInitializing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  streamRef: React.RefObject<MediaStream | null>;
  mountedRef: React.RefObject<boolean>;
  setupTimeoutRef: React.RefObject<number | null>;
  setCameraActive: (active: boolean) => void;
  setPermission: (permission: 'granted' | 'denied' | 'prompt') => void;
  setCameraError: (error: string | null) => void;
  setIsInitializing: (initializing: boolean) => void;
  setVideoStatus: React.Dispatch<React.SetStateAction<VideoStatus>>;
  stopCamera: () => void;
  onCameraStart?: () => void;
}

export const useCameraToggle = ({
  cameraActive,
  isInitializing,
  videoRef,
  canvasRef,
  streamRef,
  mountedRef,
  setupTimeoutRef,
  setCameraActive,
  setPermission,
  setCameraError,
  setIsInitializing,
  setVideoStatus,
  stopCamera,
  onCameraStart
}: UseCameraToggleProps) => {
  const { requestCameraAccess } = useCameraSetup();
  const { setupVideoElement, ensureVideoIsPlaying, checkVideoStatus } = useVideoElement();
  const { waitForVideoElement } = useWaitForVideoElement({ mountedRef });
  
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
      const videoElementExists = await waitForVideoElement(videoRef);
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
  }, [
    cameraActive, 
    isInitializing,
    videoRef, 
    canvasRef, 
    streamRef, 
    mountedRef,
    setupTimeoutRef,
    requestCameraAccess, 
    setupVideoElement, 
    ensureVideoIsPlaying, 
    checkVideoStatus,
    waitForVideoElement,
    setCameraActive, 
    setPermission, 
    setCameraError, 
    setIsInitializing, 
    setVideoStatus, 
    stopCamera, 
    onCameraStart
  ]);
  
  return { toggleCamera };
};
