
import { useSessionState } from './useSessionState';
import { useSessionActions } from './useSessionActions';

export const useSessionManagement = () => {
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
    stats,
    sessionId,
    exerciseType,
    initSession,
    handleGoodRep,
    handleBadRep,
    saveSessionData,
    completeCurrentSession,
    resetSession
  };
};
