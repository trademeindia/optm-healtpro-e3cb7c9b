
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
    if (!videoRef.current) return false;
    
    try {
      const videoElement = videoRef.current;
      console.log("Setting up video element with stream");
      
      // Clear any previous source
      videoElement.srcObject = null;
      
      // Set stream as source for video element
      videoElement.srcObject = stream;
      
      // Set proper size for the video
      if (canvasRef.current) {
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }
      
      // Wait a short moment for the srcObject to be applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Add event listeners to debug video loading
      const onLoadedMetadata = () => {
        console.log("Video loadedmetadata event fired");
      };
      
      const onLoadedData = () => {
        console.log("Video loadeddata event fired");
      };
      
      videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.addEventListener('loadeddata', onLoadedData);
      
      // Promise that resolves when metadata is loaded
      const metadataLoaded = new Promise<boolean>((resolve) => {
        if (videoElement.readyState >= 2) {
          console.log("Video metadata already loaded, readyState:", videoElement.readyState);
          resolve(true);
          return;
        }
        
        const onMetadataLoaded = () => {
          console.log("Metadata loaded event handler");
          videoElement.removeEventListener('loadedmetadata', onMetadataLoaded);
          resolve(true);
        };
        
        videoElement.addEventListener('loadedmetadata', onMetadataLoaded);
        
        // Add a timeout in case the event never fires
        setTimeout(() => {
          videoElement.removeEventListener('loadedmetadata', onMetadataLoaded);
          console.log("Metadata load timeout, continuing anyway. ReadyState:", videoElement.readyState);
          resolve(videoElement.readyState >= 1);
        }, 2000);
      });
      
      // Wait for metadata to load
      await metadataLoaded;
      
      // Try to play the video
      try {
        console.log("Attempting to play video after metadata loaded");
        await videoElement.play();
        console.log("Video playing successfully");
        
        // Remove the temporary event listeners
        videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
        videoElement.removeEventListener('loadeddata', onLoadedData);
        
        return true;
      } catch (err) {
        console.error("Error playing video after metadata loaded:", err);
        
        // Try one more time with muted (some browsers require this)
        try {
          videoElement.muted = true;
          await videoElement.play();
          console.log("Video playing successfully (muted)");
          return true;
        } catch (mutedErr) {
          console.error("Error playing muted video:", mutedErr);
          return false;
        }
      }
    } catch (error) {
      console.error("Error setting up video element:", error);
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
      
      // Verify video is playing
      const isPlaying = await ensureVideoIsPlaying();
      if (!isPlaying) {
        throw new Error("Failed to start video playback");
      }
      
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
  }, [cameraActive, stopCamera, ensureVideoIsPlaying, setupVideoElement, onCameraStart]);
  
  // Setup automatic retry for video playback issues
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      const checkVideoInterval = setInterval(async () => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        
        if ((videoEl.paused || videoEl.ended) && streamRef.current) {
          console.log("Video not playing, attempting to resume...");
          try {
            await videoEl.play();
          } catch (err) {
            console.error("Failed to resume video:", err);
            
            // If we've had multiple failures, restart the camera
            if (!retryTimeoutRef.current) {
              retryTimeoutRef.current = window.setTimeout(() => {
                console.log("Multiple play failures, restarting camera...");
                stopCamera();
                toggleCamera();
                retryTimeoutRef.current = null;
              }, 2000);
            }
          }
        }
      }, 3000);
      
      return () => clearInterval(checkVideoInterval);
    }
  }, [cameraActive, stopCamera, toggleCamera]);
  
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
