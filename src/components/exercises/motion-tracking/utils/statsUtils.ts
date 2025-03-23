
import { MotionStats } from '../../posture-monitor/types';

export const getInitialStats = (): MotionStats => ({
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
  accuracy: 0
});

export const updateStatsForGoodRep = (prev: MotionStats): MotionStats => {
  const totalReps = prev.totalReps + 1;
  const goodReps = prev.goodReps + 1;
  
  return {
    totalReps,
    goodReps,
    badReps: prev.badReps,
    accuracy: Math.round((goodReps / totalReps) * 100)
  };
};

export const updateStatsForBadRep = (prev: MotionStats): MotionStats => {
  const totalReps = prev.totalReps + 1;
  const badReps = prev.badReps + 1;
  
  return {
    totalReps,
    goodReps: prev.goodReps,
    badReps,
    accuracy: Math.round((prev.goodReps / totalReps) * 100)
  };
};
