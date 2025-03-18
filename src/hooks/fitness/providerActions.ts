
import { FitnessData, FitnessProvider } from './types';
import { getProviderData } from './providerData';

export const updateProviderConnection = (
  providers: FitnessProvider[],
  providerId: string,
  isConnected: boolean,
  lastSync?: string
): FitnessProvider[] => {
  return providers.map(provider => 
    provider.id === providerId 
      ? { 
          ...provider, 
          isConnected, 
          lastSync
        } 
      : provider
  );
};

export const updateFitnessDataTimestamps = (
  fitnessData: FitnessData,
  providerName: string
): FitnessData => {
  const updated = { ...fitnessData };
  
  Object.keys(updated).forEach(key => {
    if (updated[key]?.source === providerName) {
      updated[key] = {
        ...updated[key]!,
        timestamp: new Date().toISOString()
      };
    }
  });
  
  return updated;
};

export const removeProviderData = (
  fitnessData: FitnessData,
  providerName: string
): FitnessData => {
  const newFitnessData = { ...fitnessData };
  
  Object.keys(newFitnessData).forEach(key => {
    if (newFitnessData[key]?.source === providerName) {
      delete newFitnessData[key];
    }
  });
  
  return newFitnessData;
};
