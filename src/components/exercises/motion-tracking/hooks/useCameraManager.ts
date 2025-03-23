
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useCameraManager = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera
  const startCamera = async () => {
    try {
      if (!videoRef.current) {
        toast.error("Video element not found");
        return false;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      videoRef.current.srcObject = stream;
      
      return new Promise<boolean>((resolve) => {
        if (!videoRef.current) {
          resolve(false);
          return;
        }
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setCameraActive(true);
                toast.success("Camera activated");
                resolve(true);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                toast.error("Could not start video stream");
                resolve(false);
              });
          } else {
            resolve(false);
          }
        };
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera", {
        description: "Please ensure camera permissions are granted to this site",
        duration: 5000
      });
      return false;
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
    return true;
  };

  return {
    cameraActive,
    videoRef,
    startCamera,
    stopCamera
  };
};
