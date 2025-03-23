
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraActive: boolean;
  hasVideoError: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = (onCameraStop?: () => void): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle camera activation
  const startCamera = useCallback(async () => {
    try {
      if (!videoRef.current) return;
      
      // Reset error state
      setHasVideoError(false);
      
      // First check if camera permissions are granted
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        toast.error("Camera access denied", {
          description: "Please enable camera permissions in your browser settings",
          duration: 5000
        });
        setHasVideoError(true);
        return;
      }
      
      console.log("Requesting camera access...");
      
      // Try with specific constraints first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
            frameRate: { ideal: 30 }
          } 
        });
        
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        
        console.log("Camera stream obtained:", stream.getVideoTracks()[0].label);
      } catch (initialError) {
        console.warn("Failed with initial constraints, trying simpler request:", initialError);
        
        // Fallback to basic constraints if specific ones fail
        const basicStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        
        streamRef.current = basicStream;
        videoRef.current.srcObject = basicStream;
        
        console.log("Camera stream obtained with basic constraints");
      }
      
      // Set up error handling
      videoRef.current.onerror = (e) => {
        console.error("Video error:", e);
        setHasVideoError(true);
        toast.error("Error with video stream");
      };
      
      // Handle video metadata loading
      videoRef.current.onloadedmetadata = () => {
        if (!videoRef.current) return;
        
        console.log("Video metadata loaded, dimensions:", {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        });
        
        videoRef.current.play()
          .then(() => {
            setCameraActive(true);
            setHasVideoError(false);
            toast.success("Camera activated");
          })
          .catch(err => {
            console.error("Error playing video:", err);
            setHasVideoError(true);
            toast.error("Could not start video stream");
          });
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasVideoError(true);
      
      // Provide more specific error messages
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error("Camera access denied", {
            description: "Please allow camera access when prompted",
            duration: 5000
          });
        } else if (error.name === 'NotFoundError') {
          toast.error("No camera found", {
            description: "Please connect a camera to your device",
            duration: 5000
          });
        } else {
          toast.error("Camera error", {
            description: error.message,
            duration: 5000
          });
        }
      } else {
        toast.error("Could not access camera", {
          description: "Please ensure camera permissions are granted to this site",
          duration: 5000
        });
      }
    }
  }, []);

  // Handle camera deactivation
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
    }
    
    setCameraActive(false);
    
    if (onCameraStop) {
      onCameraStop();
    }
    
    console.log("Camera stopped");
  }, [onCameraStop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive, stopCamera]);

  return {
    videoRef,
    cameraActive,
    hasVideoError,
    startCamera,
    stopCamera
  };
};
