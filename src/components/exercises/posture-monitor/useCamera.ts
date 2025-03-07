
import { useState, useRef, useCallback, useEffect } from 'react';

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
}

export const useCamera = ({ onCameraStart }: UseCameraProps = {}): UseCameraResult => {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);
  
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    try {
      console.log("Requesting camera access...");
      // Request camera permission and turn on camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log("Camera access granted");
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Make sure video metadata is loaded before playing
        if (videoRef.current.readyState >= 2) {
          // Metadata already loaded
          await videoRef.current.play();
          console.log("Video playing (metadata already loaded)");
        } else {
          // Wait for metadata to load
          videoRef.current.onloadedmetadata = async () => {
            if (videoRef.current) {
              try {
                await videoRef.current.play();
                console.log("Video playing (after metadata loaded)");
              } catch (err) {
                console.error("Error playing video:", err);
              }
            }
          };
        }
      }
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // Clear any previous content on the canvas
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        
        // Set canvas dimensions directly to match video size
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }
      
      setCameraActive(true);
      setPermission('granted');
      
      if (onCameraStart) {
        onCameraStart();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermission('denied');
    }
  }, [cameraActive, stopCamera, onCameraStart]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);
  
  return {
    cameraActive,
    permission,
    videoRef,
    canvasRef,
    streamRef,
    toggleCamera,
    stopCamera
  };
};
