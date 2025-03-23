
import { useState, useRef } from 'react';
import { MotionStats } from '@/components/exercises/posture-monitor/types';
import { getInitialStats } from '../../utils/statsUtils';

export const useSessionState = () => {
  // Exercise stats
  const [stats, setStats] = useState<MotionStats>(getInitialStats());
  
  // Session tracking
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const exerciseType = useRef<string>("squat");
  
  return {
    stats,
    setStats,
    sessionId,
    setSessionId,
    exerciseType: exerciseType.current
  };
};
