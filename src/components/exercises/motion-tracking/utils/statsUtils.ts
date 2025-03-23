
import { toast } from 'sonner';
import { MotionStats } from '@/components/exercises/posture-monitor/types';

/**
 * Update stats when a good rep is completed
 */
export const updateStatsForGoodRep = (prevStats: MotionStats): MotionStats => {
  const updatedStats = {
    totalReps: prevStats.totalReps + 1,
    goodReps: prevStats.goodReps + 1,
    badReps: prevStats.badReps,
    accuracy: Math.min(prevStats.accuracy + 2, 100)
  };
  
  toast.success("Rep Completed", {
    description: "Great form! Keep going!",
    duration: 3000
  });
  
  return updatedStats;
};

/**
 * Update stats when a bad rep is completed
 */
export const updateStatsForBadRep = (prevStats: MotionStats): MotionStats => {
  const updatedStats = {
    totalReps: prevStats.totalReps + 1,
    goodReps: prevStats.goodReps,
    badReps: prevStats.badReps + 1,
    accuracy: Math.max(prevStats.accuracy - 5, 50)
  };
  
  toast.warning("Rep Needs Improvement", {
    description: "Watch your form. Check feedback for tips.",
    duration: 3000
  });
  
  return updatedStats;
};

/**
 * Reset stats to initial values
 */
export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 75 // Start with a default accuracy
});

