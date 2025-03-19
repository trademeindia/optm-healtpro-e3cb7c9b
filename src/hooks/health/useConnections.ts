
import { useState, useCallback } from 'react';
import { healthDataService, FitnessConnection } from '@/services/health';

export const useConnections = (userId: string | undefined) => {
  const [hasGoogleFitConnected, setHasGoogleFitConnected] = useState<boolean>(false);
  const [connections, setConnections] = useState<FitnessConnection[]>([]);

  const loadConnections = useCallback(async () => {
    if (!userId) return;

    try {
      // Check if Google Fit is connected
      const hasConnected = await healthDataService.hasGoogleFitConnected(userId);
      setHasGoogleFitConnected(hasConnected);
      
      // Get all connections
      const userConnections = await healthDataService.getFitnessConnections(userId);
      setConnections(userConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  }, [userId]);

  return {
    hasGoogleFitConnected,
    connections,
    loadConnections
  };
};
