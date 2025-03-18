import { useState, useEffect, useCallback } from 'react';
import { FitnessData, FitnessProvider } from './types';
import { getMockProviders } from './mockProviders';
import { updateProviderConnection, updateFitnessDataTimestamps, removeProviderData } from './providerActions';
import { getProviderData } from './providerData';

export interface UseFitnessIntegrationResult {
  providers: FitnessProvider[];
  fitnessData: FitnessData;
  isLoading: boolean;
  error: string | null;
  connectProvider: (providerId: string) => Promise<boolean>;
  disconnectProvider: (providerId: string) => Promise<boolean>;
  refreshProviderData: (providerId: string) => Promise<boolean>;
}

export const useFitnessIntegration = (): UseFitnessIntegrationResult => {
  const [providers, setProviders] = useState<FitnessProvider[]>([]);
  const [fitnessData, setFitnessData] = useState<FitnessData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const initialProviders = getMockProviders();
      setProviders(initialProviders);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading fitness providers:', err);
      setError('Failed to load fitness providers');
      setIsLoading(false);
    }
  }, []);
  
  const connectProvider = useCallback(async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const provider = providers.find(p => p.id === providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }
      
      const now = new Date().toISOString();
      const updatedProviders = updateProviderConnection(providers, providerId, true, now);
      setProviders(updatedProviders);
      
      const providerData = await getProviderData(providerId);
      setFitnessData(prev => ({ ...prev, ...providerData }));
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(`Error connecting to provider ${providerId}:`, err);
      setError(`Failed to connect to fitness provider: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      return false;
    }
  }, [providers]);
  
  const disconnectProvider = useCallback(async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const provider = providers.find(p => p.id === providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }
      
      const updatedProviders = updateProviderConnection(providers, providerId, false);
      setProviders(updatedProviders);
      
      const updatedData = removeProviderData(fitnessData, provider.name);
      setFitnessData(updatedData);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(`Error disconnecting from provider ${providerId}:`, err);
      setError(`Failed to disconnect from fitness provider: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      return false;
    }
  }, [providers, fitnessData]);
  
  const refreshProviderData = useCallback(async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }
      
      if (!provider.isConnected) {
        throw new Error(`Provider ${provider.name} is not connected`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const providerData = await getProviderData(providerId);
      
      const updatedData = updateFitnessDataTimestamps(fitnessData, provider.name);
      
      setFitnessData({ ...updatedData, ...providerData });
      
      const now = new Date().toISOString();
      const updatedProviders = updateProviderConnection(providers, providerId, true, now);
      setProviders(updatedProviders);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(`Error refreshing data from provider ${providerId}:`, err);
      setError(`Failed to refresh fitness data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      return false;
    }
  }, [providers, fitnessData]);
  
  return {
    providers,
    fitnessData,
    isLoading,
    error,
    connectProvider,
    disconnectProvider,
    refreshProviderData
  };
};
