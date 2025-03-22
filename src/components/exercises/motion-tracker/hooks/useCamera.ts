
import { useState } from 'react';
import { FeedbackType } from '../types';

type UseCameraProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  onFeedbackChange: (message: string | null, type: FeedbackType) => void;
  onCameraStart: () => void;
  onCameraStop: () => void;
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

  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' 
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setCameraActive(true);
            onFeedbackChange("Camera active. Analyzing your movements...", FeedbackType.INFO);
            onCameraStart();
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onFeedbackChange("Failed to access camera. Please check camera permissions.", FeedbackType.ERROR);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    onCameraStop();
    onFeedbackChange("Camera stopped. Start camera to begin tracking.", FeedbackType.INFO);
  };

  return {
    cameraActive,
    toggleCamera,
    stopCamera
  };
};
