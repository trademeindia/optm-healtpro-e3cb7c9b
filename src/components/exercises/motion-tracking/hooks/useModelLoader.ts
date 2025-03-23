
import { useState, useCallback } from 'react';
import { warmupModel, getModelLoadProgress } from '@/lib/human/modelLoader';
import { toast } from 'sonner';

interface ModelState {
  isModelLoaded: boolean;
  isModelLoading: boolean;
  modelError: string | null;
  loadProgress: number;
}

export const useModelLoader = () => {
  const [modelState, setModelState] = useState<ModelState>({
    isModelLoaded: false,
    isModelLoading: false,
    modelError: null,
    loadProgress: 0
  });
  
  // Function to load the model with progress tracking
  const loadModel = useCallback(async () => {
    // Don't reload if already loaded or loading
    if (modelState.isModelLoaded || modelState.isModelLoading) {
      return modelState.isModelLoaded;
    }
    
    try {
      // Start loading
      setModelState(prev => ({
        ...prev,
        isModelLoading: true,
        modelError: null,
        loadProgress: 0
      }));
      
      // Set up progress tracking
      const updateProgress = () => {
        const progress = getModelLoadProgress();
        setModelState(prev => ({
          ...prev,
          loadProgress: progress
        }));
        
        // Continue updating progress if still loading
        if (progress < 100 && modelState.isModelLoading) {
          setTimeout(updateProgress, 200);
        }
      };
      
      // Start progress tracking
      updateProgress();
      
      // Load the model with automatic retry
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!success && attempts < maxAttempts) {
        attempts++;
        console.log(`Loading Human.js model (attempt ${attempts}/${maxAttempts})`);
        
        try {
          success = await warmupModel();
        } catch (error) {
          console.error(`Model load attempt ${attempts} failed:`, error);
          
          if (attempts < maxAttempts) {
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      // Update state based on load result
      if (success) {
        setModelState(prev => ({
          ...prev,
          isModelLoaded: true,
          isModelLoading: false,
          modelError: null,
          loadProgress: 100
        }));
        
        console.log('Model loaded successfully');
        return true;
      } else {
        const errorMessage = `Failed to load model after ${maxAttempts} attempts`;
        console.error(errorMessage);
        
        setModelState(prev => ({
          ...prev,
          isModelLoaded: false,
          isModelLoading: false,
          modelError: errorMessage,
          loadProgress: 0
        }));
        
        toast.error('Error loading motion detection model', {
          description: 'Please try refreshing the page or check your internet connection'
        });
        
        return false;
      }
    } catch (error) {
      console.error('Error in model loading:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading model';
      
      setModelState(prev => ({
        ...prev,
        isModelLoaded: false,
        isModelLoading: false,
        modelError: errorMessage,
        loadProgress: 0
      }));
      
      toast.error('Failed to load motion detection model', {
        description: errorMessage
      });
      
      return false;
    }
  }, [modelState.isModelLoaded, modelState.isModelLoading]);
  
  return {
    modelState,
    loadModel
  };
};
