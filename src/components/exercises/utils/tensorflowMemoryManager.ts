
import * as tf from '@tensorflow/tfjs';

/**
 * Utility for managing TensorFlow.js memory and resources
 */
export const tensorflowMemoryManager = {
  /**
   * Performs garbage collection of unused tensors
   */
  cleanupTensors: () => {
    try {
      // Dispose of all intermediate tensors
      tf.tidy(() => {});
      
      // Force garbage collection
      tf.disposeVariables();
      tf.engine().endScope();
      tf.engine().startScope();
      
      // Force backend cleanup if possible
      if (tf.env().get('IS_BROWSER')) {
        try {
          // @ts-ignore - This is an internal API but useful for memory management
          tf.ENV.backend.resBackend?.disposeMemoryManagement?.();
        } catch (e) {
          console.warn("Failed to cleanup backend memory:", e);
        }
      }
      
      console.log("TensorFlow memory cleaned up");
    } catch (error) {
      console.error("Error during tensor cleanup:", error);
    }
  },
  
  /**
   * Gets current memory usage information
   */
  getMemoryInfo: () => {
    try {
      const memoryInfo = tf.memory();
      return {
        numTensors: memoryInfo.numTensors,
        numDataBuffers: memoryInfo.numDataBuffers,
        usedBytes: memoryInfo.numBytes,
        unreliable: memoryInfo.unreliable
      };
    } catch (error) {
      console.error("Error getting memory info:", error);
      return null;
    }
  },
  
  /**
   * Checks if memory usage is high and performs cleanup if needed
   */
  checkAndCleanupMemoryIfNeeded: () => {
    try {
      const memoryInfo = tf.memory();
      
      // If we have too many tensors, cleanup
      if (memoryInfo.numTensors > 1000) {
        console.warn(`High tensor count detected (${memoryInfo.numTensors}), cleaning up...`);
        tensorflowMemoryManager.cleanupTensors();
        return true;
      }
      
      // Check browser memory if available
      const browserMemory = (performance as any).memory;
      if (browserMemory && browserMemory.usedJSHeapSize > 0.8 * browserMemory.totalJSHeapSize) {
        console.warn("High memory usage detected, cleaning up...");
        tensorflowMemoryManager.cleanupTensors();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking memory:", error);
      return false;
    }
  },
  
  /**
   * Configures TensorFlow.js for optimal performance
   */
  configureForOptimalPerformance: () => {
    try {
      // Enable memory optimization flags
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', true); // Use 16-bit floating point textures
      tf.env().set('WEBGL_FLUSH_THRESHOLD', 1); // Flush operations frequently
      tf.env().set('WEBGL_CPU_FORWARD', false); // Use GPU
      tf.env().set('WEBGL_PACK', true); // Enable texture packing
      
      // Set a custom tensor disposal threshold
      tf.setBackend('webgl');
      
      console.log("TensorFlow configured for optimal performance");
    } catch (error) {
      console.error("Error configuring TensorFlow:", error);
    }
  }
};
