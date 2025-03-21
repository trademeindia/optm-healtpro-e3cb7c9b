
import { useState, useEffect, useCallback, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as movenet from '@tensorflow-models/movenet';
import { toast } from 'sonner';
import { Pose } from '../types';

interface UseMoveNetOptions {
  modelType?: 'lightning' | 'thunder';
  enableSmoothing?: boolean;
}

interface ModelState {
  model: movenet.MoveNet | null;
  detector: movenet.PoseDetector | null;
  isLoading: boolean;
  error: string | null;
  estimationInProgress: boolean;
  loadProgress: number;
}

export const useMoveNetModel = (options: UseMoveNetOptions = {}) => {
  const { 
    modelType = 'lightning',
    enableSmoothing = true
  } = options;
  
  const [modelState, setModelState] = useState<ModelState>({
    model: null,
    detector: null,
    isLoading: false,
    error: null,
    estimationInProgress: false,
    loadProgress: 0
  });
  
  const [pose, setPose] = useState<Pose | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  
  // Initialize TensorFlow.js and load the MoveNet model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Initialize TensorFlow.js
        await tf.ready();
        console.log('TensorFlow.js is ready');
        
        // Configure model type
        const modelConfig: movenet.ModelConfig = {
          modelType: modelType === 'thunder' ? 
            movenet.modelType.MULTIPOSE_LIGHTNING : 
            movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing,
          // Track loading progress
          progressCallback: (progress: number) => {
            setModelState(prev => ({ ...prev, loadProgress: Math.floor(progress * 100) }));
          }
        };
        
        // Load MoveNet model
        console.log('Loading MoveNet model...');
        const model = await movenet.load(modelConfig);
        
        if (!isMountedRef.current) return;
        
        // Create detector
        const detector = await model.createDetector();
        
        console.log('MoveNet model loaded successfully');
        setModelState(prev => ({ 
          ...prev, 
          model, 
          detector,
          isLoading: false, 
          loadProgress: 100
        }));
        
        toast.success('Exercise AI model loaded successfully');
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
        
        if (!isMountedRef.current) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setModelState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: `Failed to load model: ${errorMessage}` 
        }));
        
        toast.error(`Error loading AI model: ${errorMessage}`);
      }
    };
    
    loadModel();
    
    return () => {
      isMountedRef.current = false;
      
      // Clean up TensorFlow memory
      try {
        tf.engine().disposeVariables();
      } catch (e) {
        console.warn('Error disposing TensorFlow variables:', e);
      }
    };
  }, [modelType, enableSmoothing]);
  
  // Estimate pose from video
  const estimatePoseOnImage = useCallback(async (
    detector: movenet.PoseDetector, 
    video: HTMLVideoElement
  ): Promise<Pose | null> => {
    if (!video || video.readyState < 2) {
      return null;
    }
    
    try {
      const poses = await detector.estimatePoses(video, {
        maxPoses: 1,
        flipHorizontal: false
      });
      
      if (poses.length === 0) {
        return null;
      }
      
      const pose = poses[0];
      
      // Convert to our Pose type with named keypoints
      const keypoints = pose.keypoints.map(kp => ({
        x: kp.x,
        y: kp.y,
        score: kp.score,
        name: kp.name
      }));
      
      return {
        keypoints,
        score: pose.score || 0
      };
    } catch (error) {
      console.error('Error estimating pose:', error);
      return null;
    }
  }, []);
  
  // Start detection loop
  const startDetection = useCallback((videoElement: HTMLVideoElement) => {
    if (!modelState.detector || !videoElement) {
      return;
    }
    
    let lastFrameTime = 0;
    const minFrameTime = 1000 / 30; // Limit to 30 FPS max
    
    const detectPose = async (timestamp: number) => {
      if (!isMountedRef.current) return;
      
      // Throttle frame rate
      if (timestamp - lastFrameTime < minFrameTime) {
        frameRequestRef.current = requestAnimationFrame(detectPose);
        return;
      }
      
      if (!modelState.estimationInProgress && videoElement.readyState >= 2) {
        setModelState(prev => ({ ...prev, estimationInProgress: true }));
        
        try {
          const detectedPose = await estimatePoseOnImage(modelState.detector, videoElement);
          
          if (isMountedRef.current && detectedPose) {
            setPose(detectedPose);
          }
        } catch (error) {
          console.error('Error in pose detection loop:', error);
        } finally {
          if (isMountedRef.current) {
            setModelState(prev => ({ ...prev, estimationInProgress: false }));
          }
        }
        
        lastFrameTime = timestamp;
      }
      
      frameRequestRef.current = requestAnimationFrame(detectPose);
    };
    
    frameRequestRef.current = requestAnimationFrame(detectPose);
    
    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
        frameRequestRef.current = null;
      }
    };
  }, [modelState.detector, modelState.estimationInProgress, estimatePoseOnImage]);
  
  // Stop detection loop
  const stopDetection = useCallback(() => {
    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }
    
    setPose(null);
  }, []);
  
  return {
    model: modelState.model,
    isModelLoading: modelState.isLoading,
    modelError: modelState.error,
    modelLoadProgress: modelState.loadProgress,
    pose,
    startDetection,
    stopDetection
  };
};
