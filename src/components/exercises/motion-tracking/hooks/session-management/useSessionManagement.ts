
import { useSessionState } from './useSessionState';
import { useSessionActions } from './useSessionActions';
import { UseSessionManagementReturn } from './types';

export const useSessionManagement = (): UseSessionManagementReturn => {
  const {
    stats,
    setStats,
    sessionId,
    setSessionId,
    exerciseType
  } = useSessionState();
  
  const {
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  } = useSessionActions(
    sessionId,
    setSessionId,
    stats,
    setStats,
    exerciseType
  );
  
  return {
    // State
    stats,
    sessionId,
    exerciseType,
    
    // Actions
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  };
};
