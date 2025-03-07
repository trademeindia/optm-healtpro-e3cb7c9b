
import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionConfig } from './poseDetectionTypes';
import { toast } from '@/hooks/use-toast';
import { getOptimizedConfig } from './utils/configUtils';

interface UsePoseModelResult {
  model: posenet.PoseNet | null;
  isModelLoading: boolean;
  error: string | null;
}

export const usePoseModel = (config: PoseDetectionConfig): UsePoseModelResult => {
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get optimized configuration based on device performance
  const optimizedConfig = useCallback(() => {
    // Apply performance-optimized configs
    return getOptimizedConfig();
  }, []);
  
  // Load PoseNet model
  const loadModel = useCallback(async () => {
    if (model) return; // Prevent reloading if model exists
    
    setIsModelLoading(true);
    setError(null);
    
    try {
      console.log("Loading TensorFlow.js...");
      // Make sure TensorFlow.js is ready
      await tf.ready();
      console.log("TensorFlow.js is ready");
      
      // Apply memory optimizations before loading
      if (tf.env().get('IS_BROWSER')) {
        try {
          // Use backend.disposeVariables() if available (newer versions)
          const backend = tf.getBackend();
          if (backend === 'webgl' && (tf as any).webgl) {
            (tf as any).webgl.disposeVariables();
          }
        } catch (e) {
          console.warn("Failed to cleanup memory:", e);
        }
      }
      
      // Get performance-optimized configuration
      const deviceConfig = optimizedConfig();
      console.log("Using optimized config:", deviceConfig);
      
      // Set lower multiplier and quantization for faster loading and inference
      const modelMultiplier = deviceConfig.optimizationLevel === 'performance' ? 0.5 : 0.75;
      
      // Load PoseNet model
      console.log("Loading PoseNet model...");
      const loadedModel = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: deviceConfig.inputResolution,
        multiplier: modelMultiplier,
        quantBytes: 2 // Use 2-byte quantization for better performance
      });
      
      console.log("PoseNet model loaded successfully");
      setModel(loadedModel);
      
      toast({
        title: "Model Loaded",
        description: "Pose detection model loaded successfully.",
      });
    } catch (error) {
      console.error('Error loading PoseNet model:', error);
      setError("Failed to load pose detection model");
      
      toast({
        title: "Model Loading Failed",
        description: "Failed to load pose detection model. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setIsModelLoading(false);
    }
  }, [model, optimizedConfig]);
  
  // Load model on component mount
  useEffect(() => {
    loadModel();
    
    // Cleanup on unmount
    return () => {
      // Close model and free up memory
      if (model) {
        try {
          if (model.dispose) {
            model.dispose();
          }
          
          // Force garbage collection
          if (tf.env().get('IS_BROWSER')) {
            try {
              // Use backend.disposeVariables() if available (newer versions)
              const backend = tf.getBackend();
              if (backend === 'webgl' && (tf as any).webgl) {
                (tf as any).webgl.disposeVariables();
              }
              
              // Try to clear memory more aggressively
              tf.disposeVariables();
            } catch (e) {
              console.warn("Failed to cleanup memory:", e);
            }
          }
        } catch (e) {
          console.warn("Error disposing model:", e);
        }
      }
    };
  }, [loadModel]);
  
  return {
    model,
    isModelLoading,
    error
  };
};
