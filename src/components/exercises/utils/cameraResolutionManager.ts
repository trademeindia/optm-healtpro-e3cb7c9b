
/**
 * Utility for managing camera resolution based on device capabilities
 */
export const cameraResolutionManager = {
  /**
   * Get optimal camera constraints based on device capabilities
   */
  getOptimalCameraConstraints: async (preferHighResolution = false): Promise<MediaStreamConstraints> => {
    // Start with default constraints
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30 }
      },
      audio: false
    };
    
    try {
      // Check device memory/CPU to determine optimal resolution
      const isLowEndDevice = navigator.hardwareConcurrency <= 2;
      const memoryInfo = (performance as any).memory;
      const hasLimitedMemory = memoryInfo && memoryInfo.jsHeapSizeLimit < 2 * 1024 * 1024 * 1024; // Less than 2GB
      
      if (isLowEndDevice || hasLimitedMemory) {
        console.log("Detected low-end device, using lower resolution");
        // Use lower resolution for low-end devices
        (constraints.video as MediaTrackConstraints).width = { ideal: 320 };
        (constraints.video as MediaTrackConstraints).height = { ideal: 240 };
        (constraints.video as MediaTrackConstraints).frameRate = { ideal: 15 };
      } else if (preferHighResolution) {
        console.log("Using higher resolution for capable device");
        // Use higher resolution for capable devices when requested
        (constraints.video as MediaTrackConstraints).width = { ideal: 1280 };
        (constraints.video as MediaTrackConstraints).height = { ideal: 720 };
      }
      
      return constraints;
    } catch (error) {
      console.warn("Error determining optimal camera constraints:", error);
      return constraints; // Return default constraints on error
    }
  },
  
  /**
   * Downscale video resolution if needed for performance
   */
  adaptResolutionIfNeeded: (videoElement: HTMLVideoElement, fpsStats: number[] | null) => {
    if (!videoElement || !fpsStats || fpsStats.length < 10) return false;
    
    // Calculate average FPS
    const avgFps = fpsStats.reduce((sum, fps) => sum + fps, 0) / fpsStats.length;
    
    // If performance is poor, try to lower resolution
    if (avgFps < 15 && videoElement.videoWidth > 320) {
      console.log(`Low performance detected (${avgFps.toFixed(1)} FPS), adapting resolution`);
      
      // We can't change resolution directly, but we can set CSS to scale down
      // the video element, which will use less GPU resources for rendering
      videoElement.style.width = '320px';
      videoElement.style.height = '240px';
      
      return true;
    }
    
    return false;
  }
};
