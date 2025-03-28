
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export default function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState({
    isReady: false,
    hasStream: false,
    resolution: null as { width: number; height: number } | null,
  });
  
  const streamRef = useRef<MediaStream | null>(null);
  
  const toggleCamera = useCallback(async () => {
    if (cameraActive) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setCameraActive(false);
      setVideoStatus(prev => ({
        ...prev,
        isReady: false,
        hasStream: false
      }));
      
      return;
    }
    
    try {
      // Start camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        setVideoStatus({
          isReady: true,
          hasStream: true,
          resolution: {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight
          }
        });
        
        setCameraActive(true);
        setPermission('granted');
        
        toast.success("Camera started successfully");
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      if (err.name === 'NotAllowedError') {
        setPermission('denied');
        toast.error('Camera access denied. Please allow camera permissions.');
      } else {
        toast.error(`Camera error: ${err.message || 'Unknown error'}`);
      }
    }
  }, [cameraActive, videoRef]);
  
  const retryCamera = useCallback(() => {
    toggleCamera();
  }, [toggleCamera]);
  
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  }, [videoRef]);
  
  return {
    cameraActive,
    toggleCamera,
    videoStatus,
    permission,
    retryCamera,
    stopCamera,
    cameraError
  };
}
