
import { useState, useEffect } from 'react';
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
};

export const useCamera = ({
  videoRef,
  onFeedbackChange,
  onCameraStart,
  onCameraStop
}: UseCameraProps): UseCameraReturn => {
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }

    try {
      console.log("Requesting camera access...");
      onFeedbackChange("Accessing camera...", FeedbackType.INFO);
      
      const newStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { max: 30 }
        } 
      });

      setStream(newStream);

      if (videoRef.current) {
        console.log("Setting video source");
        videoRef.current.srcObject = newStream;
        
        // Make sure we wait for the video to be ready before proceeding
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            console.log("Video metadata loaded, dimensions:", {
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight
            });
            
            videoRef.current.play().then(() => {
              console.log("Video playback started");
              setCameraActive(true);
              onFeedbackChange("Camera active. Analyzing your movements...", FeedbackType.INFO);
              if (onCameraStart) onCameraStart();
            }).catch(err => {
              console.error("Failed to play video:", err);
              onFeedbackChange("Failed to start video playback. Please try again.", FeedbackType.ERROR);
            });
          }
        };
        
        // Handle video errors
        videoRef.current.onerror = (event) => {
          console.error("Video error event:", event);
          onFeedbackChange("Error with video playback. Please try again.", FeedbackType.ERROR);
        };
      } else {
        console.error("Video element reference is null");
        onFeedbackChange("Camera initialization failed. Please refresh and try again.", FeedbackType.ERROR);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      
      // Provide specific feedback based on error
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          onFeedbackChange("Camera access denied. Please check camera permissions in your browser settings.", FeedbackType.ERROR);
        } else if (error.name === 'NotFoundError') {
          onFeedbackChange("No camera found. Please connect a camera and try again.", FeedbackType.ERROR);
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          onFeedbackChange("Camera is in use by another application or not available.", FeedbackType.ERROR);
        } else {
          onFeedbackChange(`Failed to access camera: ${error.name}`, FeedbackType.ERROR);
        }
      } else {
        onFeedbackChange("Failed to access camera. Please check your device settings.", FeedbackType.ERROR);
      }
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera");
    
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}, enabled: ${track.enabled}, state: ${track.readyState}`);
        track.stop();
      });
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      console.log("Cleared video source");
    }

    setCameraActive(false);
    if (onCameraStop) onCameraStop();
    onFeedbackChange("Camera stopped. Start camera to begin tracking.", FeedbackType.INFO);
  };

  return {
    cameraActive,
    toggleCamera,
    stopCamera
  };
};
