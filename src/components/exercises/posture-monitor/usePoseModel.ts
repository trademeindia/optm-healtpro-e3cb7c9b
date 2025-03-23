
import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { PoseDetectionConfig } from './poseDetectionTypes';

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
          // Memory cleanup for WebGL backend
          const backend = tf.getBackend();
          if (backend === 'webgl') {
            // @ts-ignore - accessing internals but it's useful for memory management
            const gl = tf.backend().getGPGPUContext().gl;
            gl.finish();
          }
        } catch (e) {
          console.warn("Error during WebGL cleanup:", e);
        }
      }
      
      // Load PoseNet model with correct type-safe config
      console.log("Loading PoseNet model with config:", config);
      const loadedModel = await posenet.load({
        architecture: config.architecture || 'MobileNetV1',
        outputStride: config.outputStride || 16,
        inputResolution: config.inputResolution,
        multiplier: config.multiplier || 0.75,
        quantBytes: config.quantBytes || 2
      });
      
      console.log("PoseNet model loaded successfully");
      setModel(loadedModel);
    } catch (err) {
      console.error("Error loading PoseNet model:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsModelLoading(false);
    }
  }, [config, model]);
  
  // Load model on component mount
  useEffect(() => {
    loadModel();
    
    return () => {
      // Clean up tf.js resources when component unmounts
      if (model) {
        try {
          // Dispose of tensors to prevent memory leaks
          tf.disposeVariables();
        } catch (e) {
          console.warn("Error during TensorFlow cleanup:", e);
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
