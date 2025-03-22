
import { useState, useRef, useCallback, useEffect } from 'react';
import { FeedbackType } from '../types';

type UseCameraProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
  onCameraStart?: () => void;
  onCameraStop?: () => void;
};

type UseCameraReturn = {
  cameraActive: boolean;
  toggleCamera: () => Promise<void>;
  stopCamera: () => void;
  cameraPermission: 'granted' | 'denied' | 'prompt';
};

export const useCamera = ({
  videoRef,
  onFeedbackChange,
  onCameraStart,
  onCameraStop
}: UseCameraProps): UseCameraReturn => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const streamRef = useRef<MediaStream | null>(null);
  
  // Stop camera and clean up resources
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      // Stop all tracks in the stream
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Clear the video source
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    onFeedbackChange(null, FeedbackType.INFO);
    
    if (onCameraStop) {
      onCameraStop();
    }
    
    console.log("Camera stopped");
  }, [videoRef, onFeedbackChange, onCameraStop]);
  
  // Toggle camera on/off
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    try {
      onFeedbackChange("Requesting camera access...", FeedbackType.INFO);
      
      // Request camera with ideal settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      // Store stream for later cleanup
      streamRef.current = stream;
      
      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Needed for iOS Safari
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
      
      setCameraActive(true);
      setCameraPermission('granted');
      onFeedbackChange("Camera active. Stand where your full body is visible.", FeedbackType.SUCCESS);
      
      if (onCameraStart) {
        onCameraStart();
      }
      
      console.log("Camera started");
    } catch (error) {
      console.error("Camera access error:", error);
      
      let errorMessage = "Failed to access camera";
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
          setCameraPermission('denied');
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is being used by another application. Please close other camera apps.";
        }
      }
      
      onFeedbackChange(errorMessage, FeedbackType.ERROR);
    }
  }, [cameraActive, videoRef, stopCamera, onFeedbackChange, onCameraStart]);
  
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
    toggleCamera,
    stopCamera,
    cameraPermission
  };
};
