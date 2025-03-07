
import { useState, useRef, useCallback, useEffect } from 'react';
import { useCameraSetup } from './useCameraSetup';
import { useVideoElement } from './useVideoElement';
import { toast } from '@/hooks/use-toast';

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
}

export const useCamera = ({ onCameraStart }: UseCameraProps = {}): UseCameraResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true); // Track if component is mounted
  const setupTimeoutRef = useRef<number | null>(null);
  
  const { requestCameraAccess } = useCameraSetup();
  const { setupVideoElement, ensureVideoIsPlaying } = useVideoElement();
  
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
    
    // Clear any timeouts
    if (setupTimeoutRef.current) {
      window.clearTimeout(setupTimeoutRef.current);
      setupTimeoutRef.current = null;
    }
  }, []);
  
  // Function to check if video element is ready
  const waitForVideoElement = useCallback(async (): Promise<boolean> => {
    console.log("Waiting for video element to be available in DOM...");
    // Try for up to 5 seconds (50 attempts * 100ms)
    for (let i = 0; i < 50; i++) {
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
        setupTimeoutRef.current = window.setTimeout(resolve, 500) as unknown as number;
      });
      
      // Double-check component is still mounted
      if (!mountedRef.current) {
        stopCamera();
        setIsInitializing(false);
        return;
      }
      
      // Double-check video state
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
      ensureVideoIsPlaying, onCameraStart, isInitializing, waitForVideoElement]);
  
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
    }, 3000);
    
    return () => clearInterval(checkVideoInterval);
  }, [cameraActive]);
  
  // Auto-initialize camera
  useEffect(() => {
    // Small timeout to let everything render
    const timer = setTimeout(() => {
      if (!cameraActive && permission !== 'denied' && !isInitializing) {
        console.log("Auto-initializing camera...");
        toggleCamera().catch(err => {
          console.error("Auto-init camera failed:", err);
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [cameraActive, permission, toggleCamera, isInitializing]);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    stopCamera,
    cameraError
  };
};
