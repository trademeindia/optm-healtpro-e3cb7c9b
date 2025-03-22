
import * as Human from '@vladmandic/human';
import { toast } from 'sonner';
import { tensorflowMemoryManager } from './tensorflowMemoryManager';

/**
 * Utility for managing Human.js model initialization and fallbacks
 */
export const humanModelManager = {
  /**
   * Initializes the Human.js model with performance optimizations
   * @param isLowEndDevice Whether the device has limited capabilities
   */
  createOptimizedConfiguration: (isLowEndDevice: boolean): Partial<Human.Config> => {
    const baseConfig: Partial<Human.Config> = {
      modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
      filter: { enabled: true, equalization: false },
      face: { enabled: false },
      hand: { enabled: false },
      gesture: { enabled: false },
      // Configure body pose detection
      body: { 
        enabled: true,
        // For low-end devices, use lighter model
        modelPath: isLowEndDevice ? 'blazepose-lite.json' : 'blazepose-heavy.json',
        minConfidence: 0.2, 
        maxDetected: 1,
      },
      // Segmentation is expensive, disable it
      segmentation: { enabled: false },
      // Optimize for performance
      backend: 'webgl',
      // Reduced warmup for faster startup
      warmup: 'none',
      // Debug settings
      debug: false,
    };
    
    return baseConfig;
  },
  
  /**
   * Initializes Human.js with fallbacks for different device capabilities
   */
  initializeHuman: async (onProgress?: (message: string) => void): Promise<Human.Human | null> => {
    // Clean up TensorFlow memory before initialization
    tensorflowMemoryManager.cleanupTensors();
    
    try {
      // Check device capabilities
      const isLowEndDevice = navigator.hardwareConcurrency <= 4;
      
      // If low-end device, notify user
      if (isLowEndDevice) {
        console.log("Detected low-end device, using optimized configuration");
        if (onProgress) onProgress("Initializing optimized model for your device...");
      } else {
        if (onProgress) onProgress("Initializing high-quality detection model...");
      }
      
      // Configure Human.js based on device capabilities
      const config = humanModelManager.createOptimizedConfiguration(isLowEndDevice);
      
      // Create Human instance with optimized configuration
      const human = new Human.Human(config);
      
      // Pre-load and warm up the model
      try {
        if (onProgress) onProgress("Loading body tracking model...");
        await human.load();
        if (onProgress) onProgress("Initializing model...");
        await human.warmup();
        return human;
      } catch (modelError) {
        console.error("Error during model loading:", modelError);
        
        // Try to recover with simpler model
        if (onProgress) onProgress("Trying alternative lightweight model...");
        
        // Update config to use the lightest model
        human.config.body.modelPath = 'blazepose-lite.json';
        human.config.backend = 'webgl';
        
        try {
          await human.load();
          await human.warmup();
          return human;
        } catch (fallbackError) {
          console.error("Fallback model loading failed:", fallbackError);
          toast.error("Failed to load motion detection model. Please try refreshing the page.");
          return null;
        }
      }
    } catch (error) {
      console.error("Error initializing Human.js:", error);
      return null;
    }
  },
  
  /**
   * Checks whether WebGL is supported and available
   */
  checkWebGLSupport: (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        console.warn("WebGL not supported");
        return false;
      }
      
      return true;
    } catch (e) {
      console.warn("Error checking WebGL support:", e);
      return false;
    }
  },
  
  /**
   * Safely cleans up Human.js resources
   */
  cleanupHumanResources: (human: Human.Human | null) => {
    if (!human) return;
    
    try {
      // Clear instance reference to allow garbage collection
      // No need to call dispose() as it's not available
      // Just ensure TensorFlow memory is cleaned up
      tensorflowMemoryManager.cleanupTensors();
      console.log("Human.js resources cleaned up successfully");
    } catch (error) {
      console.error("Error during Human.js cleanup:", error);
    }
  }
};
