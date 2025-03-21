
import { useState, useEffect, useCallback } from 'react';
import { Pose, ExerciseForm, FeedbackType, ExerciseMetrics, FeedbackMessage } from '../types';
import { exerciseAnalyzers } from '../analyzers';

interface UseExerciseAnalysisProps {
  pose: Pose | null;
  exerciseType: string;
  isActive: boolean;
}

export const useExerciseAnalysis = ({ pose, exerciseType, isActive }: UseExerciseAnalysisProps) => {
  const [metrics, setMetrics] = useState<ExerciseMetrics>({
    reps: 0,
    correctReps: 0,
    incorrectReps: 0,
    accuracy: 0,
    rangeOfMotion: {
      average: 0,
      min: 0,
      max: 0
    },
    formErrors: {},
    sessionDuration: 0
  });
  
  const [feedback, setFeedback] = useState<FeedbackMessage>({
    message: 'Prepare for your exercise session',
    type: FeedbackType.INFO,
    timestamp: Date.now()
  });
  
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  
  // Reset metrics when exercise type changes
  useEffect(() => {
    setMetrics({
      reps: 0,
      correctReps: 0,
      incorrectReps: 0,
      accuracy: 0,
      rangeOfMotion: {
        average: 0,
        min: 0,
        max: 0
      },
      formErrors: {},
      sessionDuration: 0
    });
    
    setFeedback({
      message: `Ready to start ${exerciseType}`,
      type: FeedbackType.INFO,
      timestamp: Date.now()
    });
    
    setSessionStartTime(null);
  }, [exerciseType]);
  
  // Start session timer when active
  useEffect(() => {
    if (isActive && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    
    if (!isActive && sessionStartTime) {
      // Update session duration when stopping
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      setMetrics(prev => ({
        ...prev,
        sessionDuration: duration
      }));
    }
    
    // Update duration periodically while active
    let intervalId: number | null = null;
    
    if (isActive && sessionStartTime) {
      intervalId = window.setInterval(() => {
        const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
        setMetrics(prev => ({
          ...prev,
          sessionDuration: duration
        }));
      }, 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, sessionStartTime]);
  
  // Analyze pose and update metrics
  const analyzePose = useCallback(() => {
    if (!pose || !isActive) return;
    
    // Get the correct analyzer for this exercise type
    const analyzer = exerciseAnalyzers[exerciseType];
    
    if (!analyzer) {
      console.error(`No analyzer found for exercise type: ${exerciseType}`);
      return;
    }
    
    // Analyze the current pose
    const result = analyzer.analyze(pose, metrics);
    
    // Update metrics based on analysis result
    if (result.metrics) {
      setMetrics(result.metrics);
    }
    
    // Update feedback if provided
    if (result.feedback) {
      setFeedback({
        message: result.feedback.message,
        type: result.feedback.type || FeedbackType.INFO,
        timestamp: Date.now()
      });
    }
  }, [pose, isActive, exerciseType, metrics]);
  
  // Run analysis whenever the pose changes
  useEffect(() => {
    if (pose && isActive) {
      analyzePose();
    }
  }, [pose, isActive, analyzePose]);
  
  // Reset session
  const resetSession = useCallback(() => {
    setMetrics({
      reps: 0,
      correctReps: 0,
      incorrectReps: 0,
      accuracy: 0,
      rangeOfMotion: {
        average: 0,
        min: 0,
        max: 0
      },
      formErrors: {},
      sessionDuration: 0
    });
    
    setFeedback({
      message: `Ready to start ${exerciseType}`,
      type: FeedbackType.INFO,
      timestamp: Date.now()
    });
    
    setSessionStartTime(isActive ? Date.now() : null);
  }, [exerciseType, isActive]);
  
  return {
    metrics,
    feedback,
    resetSession
  };
};
