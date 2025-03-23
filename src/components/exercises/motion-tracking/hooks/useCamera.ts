
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

  // Handle camera activation
  const startCamera = useCallback(async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      
      // Set up error handling
      videoRef.current.onerror = (e) => {
        console.error("Video error:", e);
        setHasVideoError(true);
        toast.error("Error with video stream");
      };
      
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
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
        }
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasVideoError(true);
      toast.error("Could not access camera", {
        description: "Please ensure camera permissions are granted to this site",
        duration: 5000
      });
    }
  }, []);

  // Handle camera deactivation
  const stopCamera = useCallback(() => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
    
    if (onCameraStop) {
      onCameraStop();
    }
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
