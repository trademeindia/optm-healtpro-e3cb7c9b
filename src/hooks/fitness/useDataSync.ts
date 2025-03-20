
import { useState } from 'react';
import { FitnessData, FitnessProvider } from './types';
import { generateMockFitnessData } from './mockFitnessData';

export const useDataSync = (
  initialFitnessData: FitnessData, 
  providers: FitnessProvider[], 
  setProviders: React.Dispatch<React.SetStateAction<FitnessProvider[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [fitnessData, setFitnessData] = useState<FitnessData>(initialFitnessData);

  // Simulates refreshing data from a provider
  const refreshProviderData = async (providerId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.id === providerId && provider.isConnected
            ? { 
                ...provider, 
                lastSynced: new Date().toISOString(),
                metrics: {
                  steps: Math.floor(Math.random() * 5000) + 3000,
                  calories: Math.floor(Math.random() * 500) + 1500,
                  heartRate: Math.floor(Math.random() * 20) + 60,
                  distance: Math.floor(Math.random() * 5) + 2,
                }
              } 
            : provider
        )
      );
      
      // Also update the detailed fitness data
      setFitnessData(prev => {
        // Generate new step data
        const newStepsData = prev.steps.data.map((item) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 5000) + 3000
        }));
        
        // Generate new heart rate data
        const newHeartRateData = prev.heartRate.data.map((item) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 20) + 60
        }));
        
        // Generate new calorie data
        const newCaloriesData = prev.calories.data.map((item) => ({
          timestamp: item.timestamp,
          value: Math.floor(Math.random() * 500) + 1500
        }));
        
        return {
          steps: {
            data: newStepsData,
            summary: prev.steps.summary
          },
          heartRate: {
            data: newHeartRateData,
            summary: prev.heartRate.summary
          },
          calories: {
            data: newCaloriesData,
            summary: prev.calories.summary
          }
        };
      });
      
      return true;
    } catch (error) {
      console.error('Error refreshing provider data:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refreshes data for all connected providers
  const refreshProviders = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const connectedProviders = providers.filter(provider => provider.isConnected);
      for (const provider of connectedProviders) {
        await refreshProviderData(provider.id);
      }
      return true;
    } catch (error) {
      console.error('Error refreshing providers:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fitnessData,
    refreshProviderData,
    refreshProviders
  };
};
