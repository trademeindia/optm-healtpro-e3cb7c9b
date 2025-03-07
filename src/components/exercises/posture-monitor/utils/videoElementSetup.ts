
import { RefObject } from 'react';

export interface VideoSetupOptions {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
}

export async function setupVideoElement(
  stream: MediaStream, 
  options: VideoSetupOptions
): Promise<boolean> {
  const { videoRef, canvasRef } = options;
  
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
}

export async function ensureVideoIsPlaying(videoRef: RefObject<HTMLVideoElement>): Promise<boolean> {
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
}
