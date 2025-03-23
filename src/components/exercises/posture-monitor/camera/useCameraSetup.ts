
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Handles camera device setup, permissions, and error handling
 */
export const useCameraSetup = () => {
  /**
   * Lists available video devices for debugging purposes
   */
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("Available video devices:", videoDevices.map(d => ({ 
        deviceId: d.deviceId, 
        label: d.label || `Camera ${videoDevices.indexOf(d) + 1}` 
      })));
      return videoDevices;
    } catch (error) {
      console.error("Error enumerating devices:", error);
      return [];
    }
  }, []);

  /**
   * Requests camera access with optimal settings for pose detection
   */
  const requestCameraAccess = useCallback(async () => {
    try {
      console.log("Requesting camera access...");
      
      // First enumerate devices for debugging
      const videoDevices = await enumerateDevices();
      
      // Request camera permission with optimal settings for pose detection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });
      
      console.log("Camera access granted successfully");
      
      // Get the actual constraints being used
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      console.log("Camera settings:", {
        width: settings.width,
        height: settings.height,
        frameRate: settings.frameRate,
        deviceId: settings.deviceId
      });
      
      return { stream, error: null };
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      // Handle specific errors with user-friendly messages
      let errorMessage = "Failed to access camera";
      let permissionDenied = false;
      
      if (error instanceof DOMException) {
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = "Camera access denied. Please allow camera access in your browser settings.";
          permissionDenied = true;
        } else if (error.name === 'AbortError') {
          errorMessage = "Camera access was aborted. Please try again.";
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = "Camera is already in use by another application. Please close other applications using the camera.";
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = "Camera does not support the requested resolution. Using default resolution instead.";
          // Try again with default constraints
          try {
            const defaultStream = await navigator.mediaDevices.getUserMedia({ 
              video: true, 
              audio: false 
            });
            console.log("Camera access granted with default constraints");
            return { stream: defaultStream, error: null };
          } catch (defaultError) {
            console.error("Failed with default constraints too:", defaultError);
          }
        }
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { stream: null, error: errorMessage, permissionDenied };
    }
  }, [enumerateDevices]);
  
  return {
    requestCameraAccess,
    enumerateDevices
  };
};
