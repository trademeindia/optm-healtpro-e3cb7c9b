
import { useState } from 'react';
import { MotionStats } from '@/components/exercises/posture-monitor/types';
import { getInitialStats } from '../utils/statsUtils';

export interface SessionData {
  stats: MotionStats;
  exerciseType: string;
  sessionDuration: number;
  startTime: Date | null;
}

export function useSessionData() {
  const [sessionData, setSessionData] = useState<SessionData>({
    stats: getInitialStats(),
    exerciseType: 'squat',
    sessionDuration: 0,
    startTime: null
  });

  const updateStats = (newStats: MotionStats) => {
    setSessionData(prev => ({
      ...prev,
      stats: newStats
    }));
  };

  const updateSessionDuration = (duration: number) => {
    setSessionData(prev => ({
      ...prev,
      sessionDuration: duration
    }));
  };

  const setExerciseType = (type: string) => {
    setSessionData(prev => ({
      ...prev,
      exerciseType: type
    }));
  };

  const resetSessionData = () => {
    setSessionData({
      stats: getInitialStats(),
      exerciseType: 'squat',
      sessionDuration: 0,
      startTime: null
    });
  };

  const startSession = () => {
    setSessionData(prev => ({
      ...prev,
      startTime: new Date()
    }));
  };

  return {
    sessionData,
    updateStats,
    updateSessionDuration,
    setExerciseType,
    resetSessionData,
    startSession
  };
}
