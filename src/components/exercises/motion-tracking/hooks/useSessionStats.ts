
import { useState, useRef, useEffect } from 'react';

interface SessionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  caloriesBurned: number;
  startTime: number;
  lastUpdate: number;
}

export const useSessionStats = () => {
  const [stats, setStats] = useState<SessionStats>({
    totalReps: 0,
    goodReps: 0,
    badReps: 0,
    caloriesBurned: 0,
    startTime: Date.now(),
    lastUpdate: Date.now()
  });
  
  // Update stats with calorie calculations
  useEffect(() => {
    const intervalId = setInterval(() => {
      setStats(prev => {
        const sessionDuration = (Date.now() - prev.startTime) / 1000; // in seconds
        
        // Simple calorie calculation based on activity level and duration
        // MET value for moderate exercise is around 5-7
        const met = 5; 
        const weight = 70; // kg, default value
        const caloriesPerMinute = (met * 3.5 * weight) / 200; 
        const burnedCalories = (caloriesPerMinute * sessionDuration) / 60;
        
        return {
          ...prev,
          caloriesBurned: parseFloat(burnedCalories.toFixed(1)),
          lastUpdate: Date.now()
        };
      });
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const addGoodRep = () => {
    setStats(prev => ({
      ...prev,
      totalReps: prev.totalReps + 1,
      goodReps: prev.goodReps + 1,
      lastUpdate: Date.now()
    }));
  };
  
  const addBadRep = () => {
    setStats(prev => ({
      ...prev,
      totalReps: prev.totalReps + 1,
      badReps: prev.badReps + 1,
      lastUpdate: Date.now()
    }));
  };
  
  const resetStats = () => {
    setStats({
      totalReps: 0,
      goodReps: 0,
      badReps: 0,
      caloriesBurned: 0,
      startTime: Date.now(),
      lastUpdate: Date.now()
    });
  };
  
  return {
    stats,
    addGoodRep,
    addBadRep,
    resetStats
  };
};
