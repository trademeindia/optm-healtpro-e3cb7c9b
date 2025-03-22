
import { useState, useEffect, useCallback, useRef } from 'react';
import { FeedbackType } from '../types';
import { cameraResolutionManager } from '../../utils/cameraResolutionManager';

interface UseCameraProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  onFeedbackChange?: (message: string | null, type: FeedbackType) => void;
  onCameraStart?: () => void;
  onCameraStop?: () => void;
}

export const useCamera = ({
  videoRef,
  onFeedbackChange,
  onCameraStart,
  onCameraStop
}: UseCameraProps) => {
  // State
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState({
    isReady: false,
    hasStream: false,
    resolution: null as { width: number; height: number } | null,
    lastCheckTime: 0,
    errorCount: 0
  });

  // Refs
  const streamRef = useRef<MediaStream | null>(null);
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentVideoRef = videoRef || internalVideoRef;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startAttemptsRef = useRef<number>(0);

  // Start camera with optimized resolution management
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      
      if (onFeedbackChange) {
        onFeedbackChange("Requesting camera access...", FeedbackType.INFO);
      }
      
      console.log("Requesting camera permission");
      
      // Check if permission was already denied
      if (permission === 'denied') {
        setCameraError("Camera permission was denied. Please grant access in your browser settings.");
        if (onFeedbackChange) {
          onFeedbackChange("Camera permission denied. Please enable camera access in your browser settings.", FeedbackType.ERROR);
        }
        return;
      }
      
      // Get optimal camera constraints based on device capabilities
      const constraints = await cameraResolutionManager.getOptimalCameraConstraints();
      
      // Request camera with specific constraints for better detection
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Update permission status
      setPermission('granted');
      
      // Store stream reference
      streamRef.current = stream;
      
      // Attach stream to video element
      if (currentVideoRef.current) {
        currentVideoRef.current.srcObject = stream;
        currentVideoRef.current.onloadedmetadata = () => {
          if (currentVideoRef.current) {
            currentVideoRef.current.play()
              .then(() => {
                setCameraActive(true);
                setVideoStatus({
                  isReady: true,
                  hasStream: true,
                  resolution: {
                    width: currentVideoRef.current?.videoWidth || 0,
                    height: currentVideoRef.current?.videoHeight || 0
                  },
                  lastCheckTime: Date.now(),
                  errorCount: 0
                });
                
                // Reset start attempts counter on success
                startAttemptsRef.current = 0;
                
                if (onFeedbackChange) {
                  onFeedbackChange("Camera started successfully.", FeedbackType.SUCCESS);
                }
                
                if (onCameraStart) {
                  onCameraStart();
                }
              })
              .catch(error => {
                console.error("Error playing video:", error);
                setCameraError(`Failed to start video: ${error.message}`);
                if (onFeedbackChange) {
                  onFeedbackChange(`Error starting camera: ${error.message}`, FeedbackType.ERROR);
                }
              });
          }
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      
      // Handle specific permission errors
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setPermission('denied');
        setCameraError("Camera access denied. Please grant permission.");
        if (onFeedbackChange) {
          onFeedbackChange("Camera permission denied. Please enable camera access.", FeedbackType.ERROR);
        }
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setCameraError("No camera found. Please connect a camera and try again.");
        if (onFeedbackChange) {
          onFeedbackChange("No camera found. Please connect a camera and try again.", FeedbackType.ERROR);
        }
      } else if (error instanceof DOMException && error.name === 'NotReadableError') {
        // Camera might be in use by another application, try with lower resolution
        startAttemptsRef.current++;
        
        if (startAttemptsRef.current <= 2) {
          console.log("Camera might be in use, trying with lower resolution...");
          if (onFeedbackChange) {
            onFeedbackChange("Trying with alternative camera settings...", FeedbackType.INFO);
          }
          
          // Small delay before retrying
          setTimeout(() => {
            startCamera();
          }, 500);
          return;
        } else {
          setCameraError("Camera is in use by another application or not available.");
          if (onFeedbackChange) {
            onFeedbackChange("Camera is in use by another application. Please close other programs using your camera.", FeedbackType.ERROR);
          }
        }
      } else {
        setCameraError(`Failed to access camera: ${(error as Error).message}`);
        if (onFeedbackChange) {
          onFeedbackChange(`Error accessing camera: ${(error as Error).message}`, FeedbackType.ERROR);
        }
      }
    }
  }, [permission, currentVideoRef, onFeedbackChange, onCameraStart]);
  
  // Stop camera
  const stopCamera = useCallback(() => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (currentVideoRef.current) {
      currentVideoRef.current.srcObject = null;
    }
    
    // Update state
    setCameraActive(false);
    setVideoStatus(prev => ({
      ...prev,
      isReady: false,
      hasStream: false
    }));
    
    if (onFeedbackChange) {
      onFeedbackChange("Camera stopped.", FeedbackType.INFO);
    }
    
    if (onCameraStop) {
      onCameraStop();
    }
    
    console.log("Camera stopped");
  }, [currentVideoRef, onFeedbackChange, onCameraStop]);
  
  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (cameraActive) {
      stopCamera();
    } else {
      // Reset attempts counter when starting fresh
      startAttemptsRef.current = 0;
      startCamera();
    }
  }, [cameraActive, startCamera, stopCamera]);
  
  // Retry camera after error
  const retryCamera = useCallback(() => {
    if (streamRef.current) {
      stopCamera();
    }
    setCameraError(null);
    // Reset attempts counter for retry
    startAttemptsRef.current = 0;
    startCamera();
  }, [startCamera, stopCamera]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Check video status periodically
  useEffect(() => {
    if (!cameraActive) return;
    
    const checkVideoStatus = () => {
      if (!currentVideoRef.current) return;
      
      const video = currentVideoRef.current;
      const now = Date.now();
      
      // Only check every second
      if (now - videoStatus.lastCheckTime < 1000) {
        return;
      }
      
      // Check if video is still playing correctly
      if (video.readyState < 2 || video.paused || !video.srcObject) {
        setVideoStatus(prev => ({
          ...prev,
          errorCount: prev.errorCount + 1,
          lastCheckTime: now
        }));
        
        // After several errors, try to restart
        if (videoStatus.errorCount > 5) {
          console.warn("Video stream appears to be stalled, attempting to restart");
          retryCamera();
        }
      } else {
        // Reset error count if video is playing fine
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
    
    const intervalId = setInterval(checkVideoStatus, 1000);
    return () => clearInterval(intervalId);
  }, [cameraActive, videoStatus, currentVideoRef, retryCamera]);
  
  return {
    cameraActive,
    permission,
    videoRef: currentVideoRef,
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
