
import { RefObject } from 'react';

export interface CameraStreamOptions {
  videoRef: RefObject<HTMLVideoElement>;
  streamRef: RefObject<MediaStream | null>;
}

export const stopCameraStream = (options: CameraStreamOptions, timeoutRef?: RefObject<number | null>) => {
  const { streamRef, videoRef } = options;
  
  console.log("Stopping camera...");
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  
  // Clear any retry timeouts
  if (timeoutRef && timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};

export const requestCameraStream = async (): Promise<MediaStream> => {
  console.log("Requesting camera access...");
  
  // Request camera permission and turn on camera
  return navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user',
      frameRate: { ideal: 30 }
    },
    audio: false
  });
};
