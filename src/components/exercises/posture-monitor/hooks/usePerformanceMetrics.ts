
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const usePerformanceMetrics = () => {
  const [accuracy, setAccuracy] = useState(75); // Starting value
  const [reps, setReps] = useState(0);
  const [incorrectReps, setIncorrectReps] = useState(0);
  
  const updateMetricsForGoodRep = useCallback(() => {
    setReps(prev => prev + 1);
    setAccuracy(prev => Math.min(prev + 2, 100));
    
    toast.success("Rep Completed", {
      description: "Great form! Keep going!",
      duration: 3000
    });
  }, []);
  
  const updateMetricsForBadRep = useCallback(() => {
    setIncorrectReps(prev => prev + 1);
    setAccuracy(prev => Math.max(prev - 5, 50));
  }, []);
  
  const resetMetrics = useCallback(() => {
    setReps(0);
    setIncorrectReps(0);
    setAccuracy(75);
    
    toast.info("Session Reset", {
      description: "Your workout session has been reset. Ready to start new exercises!",
      duration: 4000
    });
  }, []);
  
  return {
    stats: {
      accuracy,
      reps,
      incorrectReps
    },
    updateMetricsForGoodRep,
    updateMetricsForBadRep,
    resetMetrics
  };
};
