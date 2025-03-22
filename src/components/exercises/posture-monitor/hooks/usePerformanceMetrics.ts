
import { useState, useCallback } from 'react';
import { TrackingStats } from '../types';

export const usePerformanceMetrics = () => {
  const [stats, setStats] = useState<TrackingStats>({
    reps: 0,
    incorrectReps: 0,
    accuracy: 0
  });
  
  const updateMetricsForGoodRep = useCallback(() => {
    setStats(prevStats => {
      const newReps = prevStats.reps + 1;
      // Calculate new accuracy based on the ratio of good reps to total reps
      const newAccuracy = Math.round(((newReps - prevStats.incorrectReps) / newReps) * 100);
      
      return {
        ...prevStats,
        reps: newReps,
        accuracy: newAccuracy
      };
    });
  }, []);
  
  const updateMetricsForBadRep = useCallback(() => {
    setStats(prevStats => {
      const newReps = prevStats.reps + 1;
      const newIncorrectReps = prevStats.incorrectReps + 1;
      // Calculate new accuracy based on the ratio of good reps to total reps
      const newAccuracy = Math.round(((newReps - newIncorrectReps) / newReps) * 100);
      
      return {
        ...prevStats,
        reps: newReps,
        incorrectReps: newIncorrectReps,
        accuracy: newAccuracy
      };
    });
  }, []);
  
  const resetMetrics = useCallback(() => {
    setStats({
      reps: 0,
      incorrectReps: 0,
      accuracy: 0
    });
  }, []);
  
  return {
    stats,
    updateMetricsForGoodRep,
    updateMetricsForBadRep,
    resetMetrics
  };
};
