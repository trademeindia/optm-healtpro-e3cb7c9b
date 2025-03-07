
import { useState, useRef, useCallback, useEffect } from 'react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  
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
    
    // Clear any retry timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Function to ensure video element is playing properly
  const ensureVideoIsPlaying = useCallback(async () => {
    if (!videoRef.current) return false;
    
    const videoElement = videoRef.current;
    
    console.log("Ensuring video is playing...");
    console.log("Video paused:", videoElement.paused);
    console.log("Video ended:", videoElement.ended);
    console.log("Video readyState:", videoElement.readyState);
    
    if (videoElement.paused || videoElement.ended) {
      try {
        console.log("Attempting to play video...");
        await videoElement.play();
        console.log("Video playback started successfully");
        return true;
      } catch (error) {
        console.error("Failed to play video:", error);
        return false;
      }
    }
    
    return !videoElement.paused;
  }, []);
  
  // Setup video element after stream is acquired
  const setupVideoElement = useCallback(async (stream: MediaStream) => {
    if (!videoRef.current) {
      console.error("Video element ref is null");
      return false;
    }
    
    try {
      console.log("Setting up video element with stream");
      
      // Set stream as source for video element
      videoRef.current.srcObject = stream;
      
      // Set proper size for the video and canvas
      if (canvasRef.current) {
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }
      
      // Wait for video metadata to load
      return new Promise<boolean>((resolve) => {
        if (!videoRef.current) {
          console.error("Video ref became null during setup");
          resolve(false);
          return;
        }
        
        // Handle video loading event
        const onLoadedMetadata = async () => {
          if (!videoRef.current) {
            console.error("Video ref is null in onLoadedMetadata");
            resolve(false);
            return;
          }
          
          videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          
          try {
            // Try to play video
            await videoRef.current.play();
            console.log("Video is now playing after metadata loaded");
            resolve(true);
          } catch (err) {
            console.error("Failed to play video after metadata loaded:", err);
            resolve(false);
          }
        };
        
        // If metadata already loaded
        if (videoRef.current.readyState >= 2) {
          console.log("Video metadata already loaded, playing now");
          videoRef.current.play()
            .then(() => {
              console.log("Video playing (metadata already loaded)");
              resolve(true);
            })
            .catch((err) => {
              console.error("Error playing video (metadata already loaded):", err);
              resolve(false);
            });
        } else {
          // Wait for metadata to load
          console.log("Waiting for video metadata to load");
          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        }
      });
    } catch (error) {
      console.error("Error in setupVideoElement:", error);
      return false;
    }
  }, []);
  
  // Main function to toggle camera
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    
    try {
      console.log("Requesting camera access...");
      setCameraError(null);
      
      // Request camera permission and turn on camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      console.log("Camera access granted");
      streamRef.current = stream;
      
      // Setup video element
      const videoSetupSuccess = await setupVideoElement(stream);
      
      if (!videoSetupSuccess) {
        throw new Error("Failed to setup video element");
      }
      
      // Set camera as active
      setCameraActive(true);
      setPermission('granted');
      
      if (onCameraStart) {
        onCameraStart();
      }
    } catch (error) {
      console.error('Error accessing or setting up camera:', error);
      
      // Handle specific errors
      let errorMessage = "Failed to access camera";
      
      if (error instanceof DOMException) {
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
          setPermission('denied');
        } else if (error.name === 'AbortError') {
          errorMessage = "Camera access was aborted. Please try again.";
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clean up any partial setup
      stopCamera();
    }
  }, [cameraActive, stopCamera, setupVideoElement, onCameraStart]);
  
  // Monitor video state and restart if needed
  useEffect(() => {
    if (!cameraActive) return;
    
    const checkVideoInterval = setInterval(() => {
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
    stopCamera,
    cameraError
  };
};
