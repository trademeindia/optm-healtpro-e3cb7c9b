
import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionConfig } from './poseDetectionTypes';
import { toast } from '@/components/ui/use-toast';

interface UsePoseModelResult {
  model: posenet.PoseNet | null;
  isModelLoading: boolean;
  error: string | null;
}

export const usePoseModel = (config: PoseDetectionConfig): UsePoseModelResult => {
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      
      // Force garbage collection to free up memory before loading
      if (tf.env().get('IS_BROWSER')) {
        try {
          // @ts-ignore - accessing internals but it's useful for memory management
          tf.ENV.backend.disposeMemoryManagement?.();
        } catch (e) {
          console.warn("Failed to cleanup memory:", e);
        }
      }
      
      // Load PoseNet model
      console.log("Loading PoseNet model...");
      const loadedModel = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: config.inputResolution,
        multiplier: 0.75,
        quantBytes: 2
      });
      
      console.log("PoseNet model loaded successfully");
      setModel(loadedModel);
      
      toast({
        title: "Model Loaded",
        description: "Pose detection model loaded successfully. You can start exercising now.",
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
  }, [model, config]);
  
  // Load model on component mount
  useEffect(() => {
    loadModel();
    
    // Cleanup on unmount
    return () => {
      // Close model and free up memory
      if (model) {
        try {
          // @ts-ignore - accessing internals but it's useful for memory management
          model.dispose?.();
          
          // Force garbage collection
          if (tf.env().get('IS_BROWSER')) {
            try {
              // @ts-ignore - accessing internals but it's useful for memory management
              tf.ENV.backend.disposeMemoryManagement?.();
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
