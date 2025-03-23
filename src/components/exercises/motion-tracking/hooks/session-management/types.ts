
import { MotionStats } from '@/components/exercises/posture-monitor/types';

export interface SessionState {
  sessionId: string | undefined;
  stats: MotionStats;
  exerciseType: string;
}

export interface SessionActions {
  initSession: () => Promise<string | undefined>;
  handleGoodRep: () => void;
  handleBadRep: () => void;
  saveSessionData: (
    detectionResult: any,
    angles: any,
    biomarkers: any,
    motionState: string
  ) => Promise<boolean>;
  completeCurrentSession: () => void;
  resetSession: () => void;
}
