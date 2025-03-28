
import { useState, useRef, useEffect } from 'react';

interface SessionStats {
  totalReps: number;
  goodReps: number;
  badReps: number;
  caloriesBurned: number;
  startTime: number;
  lastUpdate: number;
}

// Initial stats
export const getInitialStats = (): SessionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  caloriesBurned: 0,
  startTime: Date.now(),
  lastUpdate: Date.now()
});

// Update stats for good rep
export const updateStatsForGoodRep = (stats: SessionStats): SessionStats => ({
  ...stats,
  totalReps: stats.totalReps + 1,
  goodReps: stats.goodReps + 1,
  lastUpdate: Date.now()
});

// Update stats for bad rep
export const updateStatsForBadRep = (stats: SessionStats): SessionStats => ({
  ...stats,
  totalReps: stats.totalReps + 1,
  badReps: stats.badReps + 1,
  lastUpdate: Date.now()
});

export const useSessionStats = () => {
  const [stats, setStats] = useState<SessionStats>(getInitialStats());
  
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
    setStats(prev => updateStatsForGoodRep(prev));
  };
  
  const addBadRep = () => {
    setStats(prev => updateStatsForBadRep(prev));
  };
  
  const resetStats = () => {
    setStats(getInitialStats());
  };
  
  return {
    stats,
    addGoodRep,
    addBadRep,
    resetStats
  };
};
